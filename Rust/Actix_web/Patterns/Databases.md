# 数据库 (Databases)
聊聊在 Actix Web 里怎么跟数据库打交道，特别是涉及到**异步 (Async)** 操作的时候。

**背景：为啥要特别说异步？**

Actix Web 本身是基于异步设计的，这意味着它可以同时处理很多很多网络连接，而不会因为等待某个慢操作（比如读写数据库、访问外部 API）而被卡住。它就像一个能同时接很多电话的超级客服。

但是，很多传统的数据库操作，尤其是某些库（比如老版本的 Diesel），它们的操作是**同步/阻塞 (Blocking)** 的。这就好比客服在接一个电话时，必须等对方说完一整段话才能挂断去接下一个电话。如果数据库操作很慢，客服（Actix Web 的工作线程）就会被这个慢操作卡住，无法处理其他用户的请求，导致整个应用性能下降，甚至卡死。

所以，我们需要一种方法来协调异步的 Actix Web 和可能阻塞的数据库操作。

**两种主要情况和对策：**

**情况一：使用的数据库库是同步/阻塞的 (比如 Diesel v1/v2)**

*   **问题：** 直接在 `async` 处理函数里调用 Diesel 的阻塞方法（比如 `execute()`, `first()`, `load()`）会卡住 Actix 的工作线程。
*   **解决方案：** 把阻塞的操作扔给一个专门处理“慢活儿/脏活儿”的**后台线程池**去做，Actix Web 提供了一个工具 `web::block` 来帮你干这个事。

**怎么用 `web::block` 配合 Diesel (和 `r2d2` 连接池)？**

1.  **设置数据库连接池 (`r2d2`)：**
    *   数据库连接的建立和销毁是比较耗时的操作。直接为每个请求都新建连接效率很低。
    *   **连接池 (Connection Pool)** 就像是预先准备好了一堆数据库连接放在那里。当你的处理函数需要连接时，就从池子里借一个用，用完再还回去。这样可以复用连接，提高效率。
    *   `r2d2` 是 Rust 社区常用的一个通用连接池库，可以和 Diesel 很好地配合。
    *   你需要在 `main` 函数里创建这个连接池 (`r2d2::Pool`)。

2.  **把连接池放入应用状态 (App State)：**
    *   为了让你的处理函数能拿到连接池，你需要把它作为共享状态添加到 Actix 应用里。
    *   使用 `App::new().app_data(web::Data::new(pool.clone()))`。`web::Data` 是 Actix 用来包装共享状态的类型。

3.  **定义数据库操作函数：**
    *   最好把具体的 Diesel 数据库操作（增删改查）封装在单独的函数里，这些函数接收一个数据库连接 (`&mut SqliteConnection` 或其他类型) 作为参数。这些函数本身是**同步**的。

    ```rust
    // (如示例代码所示)
    // 定义 Diesel 的插入结构体
    #[derive(Debug, Insertable)]
    #[diesel(table_name = self::schema::users)]
    struct NewUser<'a> { id: &'a str, name: &'a str, }

    // 封装好的同步数据库插入函数
    fn insert_new_user( conn: &mut SqliteConnection, user_name: String,) -> diesel::QueryResult<User> {
        // ... Diesel 的具体操作 ...
        Ok(user)
    }
    ```

4.  **在 `async` 处理函数中使用 `web::block`：**
    *   **提取连接池:** 在处理函数参数里用 `pool: web::Data<DbPool>` 来获取应用状态里的连接池。
    *   **调用 `web::block`:** 这是关键！把**所有可能阻塞**的操作都放进 `web::block` 的闭包里。
        ```rust
        let user = web::block(move || { // move 把所有权移入闭包
            // --- 在 web::block 内部 ---
            // 1. 从连接池获取连接 (注意：获取连接本身也可能阻塞！)
            let mut conn = pool.get().expect("无法从池中获取连接");

            // 2. 调用你的同步数据库操作函数
            insert_new_user(&mut conn, name) // name 需要从外部捕获
            // --- web::block 内部结束 ---
        })
        .await? // 等待后台线程完成，第一个 '?' 处理 BlockingError
        .map_err(error::ErrorInternalServerError)?; // 第二个 '?' (或 map_err) 处理 Diesel 返回的错误
        ```
    *   **解释 `web::block`:**
        *   它接收一个闭包 `|| { ... }`。
        *   它会把这个闭包交给 Actix 的**阻塞任务线程池**去执行。
        *   这样，慢速的数据库操作就不会卡住处理网络请求的主工作线程了。
        *   `web::block` 本身返回一个 `Future`，你需要 `.await` 它。
        *   它的返回值是 `Result<Result<T, E>, BlockingError>`，需要处理两层错误：内部是你的数据库操作可能返回的错误 `E`，外部是阻塞线程池本身可能出的错 `BlockingError`。

5.  **返回响应：** 拿到数据库操作结果后，构造 `HttpResponse` 返回。

**看 Diesel 示例的关键部分：**

```rust
// main 函数中设置连接池并放入 App State
type DbPool = r2d2::Pool<r2d2::ConnectionManager<SqliteConnection>>;
async fn main() -> io::Result<()> {
    let manager = r2d2::ConnectionManager::<SqliteConnection>::new("app.db");
    let pool = r2d2::Pool::builder().build(manager).expect("...");
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone())) // 共享连接池
            .route("/{name}", web::get().to(index_diesel))
    }) /* ... */
}

// Handler 中使用 web::block
async fn index_diesel( pool: web::Data<DbPool>, name: web::Path<(String,)>,) -> actix_web::Result<impl Responder> {
    let (name,) = name.into_inner();
    let user_result = web::block(move || { // <-- 核心：使用 web::block
        let mut conn = pool.get().expect("无法获取连接"); // 获取连接也在 block 内部
        insert_new_user(&mut conn, name) // 调用同步 DB 函数
    })
    .await; // 等待后台任务完成

    // 处理两层 Result
    match user_result {
        Ok(Ok(user)) => Ok(HttpResponse::Ok().json(user)), // 成功
        Ok(Err(diesel_err)) => Err(error::ErrorInternalServerError(diesel_err)), // DB 操作错误
        Err(blocking_err) => Err(error::ErrorInternalServerError(blocking_err)), // 阻塞线程池错误
    }
}
```

**情况二：使用的数据库库本身就是异步的 (比如 `sqlx`, `tokio-postgres`, `mongodb`, SeaORM)**

*   **优势：** 这些库天生就适合异步环境，它们的操作不会阻塞线程。
*   **解决方案：** **不需要** `web::block`！你可以直接在 `async` 处理函数里 `await` 数据库操作。

**怎么用异步库 (以 SeaORM 为例)？**

1.  **设置数据库连接：**
    *   异步库通常自己会管理连接池（比如 SeaORM, `sqlx::Pool`）。
    *   在 `main` 函数里，使用库提供的方法建立连接（或连接池）。

2.  **把连接（或连接池）放入应用状态：**
    *   同样使用 `App::new().app_data(web::Data::new(conn.clone()))`。

3.  **定义异步数据库操作函数：**
    *   你的数据库操作函数本身就是 `async fn`，接收异步连接 (`&DatabaseConnection` 或 `&sqlx::Pool` 等) 作为参数，并返回 `Future`。

    ```rust
    // (如示例代码所示)
    // SeaORM 实体定义等...
    // 异步数据库插入函数
    async fn insert_new_user( conn: &DatabaseConnection, user_name: String,) -> Result<User, sea_orm::DbErr> {
        // ... SeaORM 的异步操作，会用到 .await ...
        let user = new_user.insert(conn).await?; // 直接 await
        Ok(User { id: user.id, name: user.name })
    }
    ```

4.  **在 `async` 处理函数中直接 `await`：**
    *   **提取连接:** 在处理函数参数里用 `conn: web::Data<DatabaseConnection>` (或其他异步连接类型) 获取连接。
    *   **直接调用并 `await`:** 这是关键！因为 `insert_new_user` 是 `async fn`，它的数据库操作不会阻塞线程，所以你可以直接 `await` 它。

    ```rust
    let user = insert_new_user(&conn, name) // 调用 async DB 函数
                .await // <-- 核心：直接 await
                .map_err(error::ErrorInternalServerError)?; // 处理 DB 操作错误
    ```

5.  **返回响应：** 拿到结果后，构造 `HttpResponse` 返回。

**看 SeaORM 示例的关键部分：**

```rust
// main 函数中设置异步连接并放入 App State
async fn main() -> io::Result<()> {
    let conn = Database::connect("sqlite:app.db").await.expect("...");
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(conn.clone())) // 共享异步连接
            .route("/{name}", web::get().to(index_seaorm))
    }) /* ... */
}

// Handler 中直接 await
async fn index_seaorm( conn: web::Data<DatabaseConnection>, name: web::Path<(String,)>,) -> actix_web::Result<impl Responder> {
    let (name,) = name.into_inner();
    let user_result = insert_new_user(&conn, name) // 调用 async DB 函数
                        .await; // <-- 核心：直接 await

    match user_result {
        Ok(user) => Ok(HttpResponse::Ok().json(user)), // 成功
        Err(db_err) => Err(error::ErrorInternalServerError(db_err)), // DB 操作错误
    }
}
```

**总结对比：**

| 特性         | 同步库 (如 Diesel v1/v2)         | 异步库 (如 SeaORM, sqlx)        |
| :----------- | :------------------------------- | :------------------------------ |
| **核心问题** | 操作阻塞 Actix 工作线程           | 操作本身不阻塞，适合异步环境       |
| **解决方案** | 使用 `web::block` 移到后台线程池   | **直接**在 handler 中 `await`   |
| **连接处理** | 通常用 `r2d2` 做连接池           | 库自带连接池或直接管理异步连接    |
| **Handler写法** | `web::block(move || { ... }).await` | `async_db_function(...).await` |
| **性能**     | 依赖阻塞线程池调度，可能有开销     | 通常更优，与 Actix 协作更自然   |

**结论：**

*   如果你用的数据库库是**阻塞**的（比如 Diesel v1/v2），**必须用 `web::block`** 把数据库操作包起来，避免阻塞 Actix 的工作线程。
*   如果你用的数据库库是**异步**的（比如 SeaORM, sqlx），那么恭喜你，你可以**直接在 `async` handler 里 `await`** 数据库操作，代码更简洁，性能通常也更好。

选择合适的数据库库和正确的使用方式对于构建高性能的 Actix Web 应用至关重要！