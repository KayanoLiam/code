Actix Web 怎么根据用户访问的网址（URL）来决定调用哪段代码来处理请求，这玩意儿叫 **URL Dispatch (URL 分发)**。

想象一下，你开了一家大公司，有很多部门（比如销售部、技术部、客服部）。当有人来访时，前台（Actix Web）需要根据访客要去哪个部门（URL 路径，比如 `/sales/orders`）以及访客想干什么（HTTP 方法，比如 GET 是想看订单，POST 是想下订单），来指引访客去正确的办公室（你的处理代码，Handler）。

**核心思想：把 URL 映射到处理函数 (Handler)**

URL 分发就是建立 “哪个 URL + 哪个 HTTP 方法” 对应 “哪个处理函数” 的规则。

**处理函数 (Handler) 是啥？**

就是你写的那个 `async fn` 函数，它负责处理具体的请求，最后返回一个能变成 HTTP 响应的东西（比如 `HttpResponse` 或者 `Result<impl Responder, MyError>`）。它可以接受一些从请求里自动提取出来的参数（比如 URL 里的变量、查询参数、请求体等）。

**怎么配置这些规则？**

Actix Web 提供了几种方式来配置这些 “URL -> Handler” 的映射规则。

**1. 简单直接：`App::route()`**

这是最基本的方法，用来给一个特定的 URL 路径 + HTTP 方法 注册一个处理函数。

```rust
use actix_web::{web, App, HttpResponse, HttpServer};

// 这是我们的处理函数，当有人访问 "/" 时，我们会调用它
async fn index() -> HttpResponse {
    HttpResponse::Ok().body("你好，世界!") // 返回一个 200 OK 响应，内容是 "你好，世界!"
}

// 另一个处理函数，可能用于处理用户提交的数据
async fn handle_user_post() -> HttpResponse {
    HttpResponse::Ok().body("收到你的 POST 请求了！")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // 规则 1: 如果有人用 GET 方法访问根路径 "/"
            .route("/", web::get().to(index)) // web::get() 指定了 HTTP 方法是 GET
                                               // .to(index) 指定了处理函数是 index

            // 规则 2: 如果有人用 POST 方法访问路径 "/user"
            .route("/user", web::post().to(handle_user_post)) // web::post() 指定方法是 POST
                                                              // .to(handle_user_post) 指定处理函数
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

*   `App::new()`: 创建一个新的 Actix Web 应用实例。
*   `.route("路径", web::方法().to(处理函数))`: 这就是注册规则的核心。
    *   第一个参数是 **URL 路径模式** (Path Pattern)，比如 `/` 或 `/user`。
    *   第二个参数 `web::get()` 或 `web::post()` 等，定义了这个规则**只匹配哪种 HTTP 方法** (GET, POST, PUT, DELETE 等)。
    *   `.to(你的函数名)` 把这个路径和方法**绑定到你的处理函数**上。

**注意：** 对同一个路径，你可以用 `route()` 注册多次，只要它们的 HTTP 方法或者后面的 “守卫 (Guard)” 不一样就行。如果都一样，只有第一个注册的会生效。

**2. 更灵活强大：`App::service()` 和 `web::resource()`**

当你需要对同一个 URL 路径（比如 `/users/{id}`）根据不同的 HTTP 方法（GET 获取用户，PUT 更新用户）或者其他条件（比如请求头）进行不同的处理时，`App::service()` 配合 `web::resource()` 更方便。

`web::resource("路径模式")` 创建一个“资源” (Resource)，你可以把它想象成是管理特定 URL 路径下所有规则的一个小单元。

```rust
use actix_web::{guard, web, App, HttpRequest, HttpResponse, HttpServer}; // 引入 guard

async fn index() -> HttpResponse {
    HttpResponse::Ok().body("处理 /prefix 的请求")
}

async fn get_user(req: HttpRequest) -> HttpResponse {
    let name = req.match_info().get("name").unwrap_or("未知用户");
    HttpResponse::Ok().body(format!("获取用户: {}", name))
}

async fn update_user(req: HttpRequest) -> HttpResponse {
    let name = req.match_info().get("name").unwrap_or("未知用户");
    HttpResponse::Ok().body(format!("更新用户: {}", name))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // 注册一个简单的资源，路径是 "/prefix"，只有一个默认处理方式 (通过 .to)
            .service(web::resource("/prefix").to(index))

            // 注册一个更复杂的资源，路径是 "/user/{name}"
            .service(
                web::resource("/user/{name}") // 定义资源路径，{name} 是个变量
                    .name("user_detail") // 给这个资源起个名字，后面生成 URL 时有用
                    // 添加一个 "守卫 (Guard)"：要求请求头必须包含 Content-Type: application/json
                    // .guard(guard::Header("content-type", "application/json"))
                    // 注意：上面这行 guard 会让浏览器直接访问失败，因为浏览器 GET 请求通常不带 Content-Type: application/json
                    // 为了方便测试，我们先注释掉 guard

                    // 为这个资源添加具体的路由规则
                    // 规则 1: 如果是 GET 方法，调用 get_user 函数
                    .route(web::get().to(get_user))
                    // 规则 2: 如果是 PUT 方法，调用 update_user 函数
                    .route(web::put().to(update_user))
                    // 你还可以继续 .route(web::delete().to(delete_user)) 等等
            )
            // 你可以继续 .service(...) 添加更多资源
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

*   `App::service(web::resource(...))`: 注册一个资源。
*   `web::resource("/user/{name}")`: 定义资源路径，`{name}` 是一个路径参数（后面会讲）。
*   `.name("user_detail")`: 给资源起个名字，方便以后生成指向这个资源的 URL。
*   `.guard(...)`: 添加守卫条件。只有满足所有守卫条件的请求，才会考虑这个资源下的路由。`guard::Header("content-type", "application/json")` 就是一个守卫，要求请求头里必须有 `Content-Type` 并且值是 `application/json`。
*   `.route(web::方法().to(处理函数))`: 在这个资源内部，为特定的 HTTP 方法指定处理函数。

**如果一个请求来了，Actix Web 怎么找对应的处理函数？ (Route Matching)**

1.  **按注册顺序检查 `service`：** Actix Web 会按照你调用 `App::service()` 的顺序，逐个检查资源。
2.  **匹配资源路径：** 看请求的 URL 路径（比如 `/user/alice`）是否符合当前检查的资源的路径模式（比如 `/user/{name}`）。
3.  **检查资源守卫 (Guard)：** 如果路径模式匹配了，还要检查这个资源上定义的所有 `guard` 条件是否都满足。比如上面例子里注释掉的 `guard::Header`。如果不满足，就跳过这个资源，继续检查下一个 `service`。
4.  **按注册顺序检查资源内的 `route`：** 如果资源路径和守卫都通过了，Actix Web 就开始检查这个资源内部用 `.route()` 定义的规则，也是按照你注册的顺序。
5.  **匹配 `route` 的方法和守卫：** 看请求的 HTTP 方法（比如 GET）是否匹配当前检查的 `route` 定义的方法（比如 `web::get()`），并且满足这个 `route` 上可能定义的 `guard` (是的，`route` 也可以有自己的 `guard`)。
6.  **找到就执行：** 一旦找到第一个完全匹配的 `route`，Actix Web 就停止查找，调用这个 `route` 对应的处理函数。
7.  **找不到咋办？**
    *   如果在某个资源里，路径匹配了，但所有 `route` 的方法或守卫都不匹配，通常会返回 405 Method Not Allowed。
    *   如果检查完所有 `service`，没有一个资源的路径模式能匹配上请求的 URL 路径，或者匹配上的资源没有任何 `route`，就会返回 404 Not Found。（除非你配置了 `default_service`）。

**URL 路径模式语法 (Resource Pattern Syntax)**

就是你写在 `route()` 或 `resource()` 里的那个字符串，用来匹配 URL 的路径部分（比如 `http://example.com/users/123?sort=asc` 里的 `/users/123`）。

*   **字面量匹配：** `/users/list` 就精确匹配 `/users/list`。
*   **变量段 (路径参数)：** 用花括号 `{}` 包起来，比如 `/users/{id}`。
    *   `{id}` 会匹配 URL 路径中 `/users/` 后面、下一个 `/` (或者路径末尾) 之前的所有字符。
    *   匹配到的值（比如 URL 是 `/users/123`，匹配到的就是 `"123"`）会被提取出来，你可以在处理函数里获取到。
    *   默认匹配规则是 `[^{}/]+` (一个或多个非 `/` 和非 `{` `}` 的字符)。
    *   例子：
        *   路径模式 `foo/{baz}/{bar}`
        *   匹配 `foo/1/2` -> 提取出 `baz="1"`, `bar="2"`
        *   匹配 `foo/abc/def` -> 提取出 `baz="abc"`, `bar="def"`
        *   不匹配 `foo/1/2/` (因为多了个尾部斜杠)
        *   不匹配 `bar/abc/def` (因为第一个 `foo` 没匹配上)
*   **带字面量的变量段：** `/product/{name}.html`
    *   匹配 `/product/book.html` -> 提取出 `name="book"`
    *   不匹配 `/product/book` (因为缺少 `.html`)
*   **多个变量段：** `/files/{name}.{ext}`
    *   匹配 `/files/image.jpg` -> 提取出 `name="image"`, `ext="jpg"`
*   **带正则表达式的变量段：** `{identifier:regex}`
    *   `/users/{id:\d+}` 只匹配 `id` 是数字的情况。`\d+` 是正则表达式，表示一个或多个数字。
    *   匹配 `/users/123` -> 提取出 `id="123"`
    *   不匹配 `/users/alice`
*   **尾部匹配 (Tail Match)：** 捕获路径末尾的所有内容（包括 `/`）。
    *   `/files/{filepath:.*}`
    *   匹配 `/files/a/b/c.txt` -> 提取出 `filepath="a/b/c.txt"`
    *   匹配 `/files/a/` -> 提取出 `filepath="a/"`
*   **URL 解码：** Actix Web 会自动对 URL 路径进行解码，你拿到的变量值是解码后的。
    *   URL `/users/Noël` (浏览器可能会编码成 `/users/No%C3%ABl`)
    *   路径模式 `/users/{name}`
    *   提取出的 `name` 是 `"Noël"`，而不是 `"No%C3%ABl"`。
    *   你在写路径模式时，也应该用解码后的字面量，比如用 `/Foo Bar/{baz}` 而不是 `/Foo%20Bar/{baz}`。

**怎么在处理函数里拿到 URL 里的变量？(Match Information / Path Extraction)**

有两种主要方式：

**1. 手动从 `HttpRequest` 获取 (不推荐，容易出错)**

```rust
use actix_web::{get, App, HttpRequest, HttpServer, Result};

#[get("/users/{id}/{action}")] // 定义路径参数 id 和 action
async fn user_handler(req: HttpRequest) -> Result<String> {
    // 从 req.match_info() 中按名字获取，返回的是 &str
    let id_str: &str = req.match_info().get("id").unwrap_or("0");
    let action: &str = req.match_info().get("action").unwrap_or("view");

    // 你需要手动解析成想要的类型，比如 u32
    let id: u32 = match id_str.parse() {
        Ok(num) => num,
        Err(_) => return Ok("无效的 ID".to_string()), // 处理解析错误
    };

    Ok(format!("用户 ID: {}, 操作: {}", id, action))
}

// main 函数省略...
```
这种方法比较繁琐，需要手动处理 `Option` 和解析错误。

**2. 使用路径提取器 `web::Path` (推荐，类型安全)**

Actix Web 提供了一个叫 `Path` 的提取器 (Extractor)，可以自动把 URL 路径参数按顺序或者按名字解析成你指定的类型。

**a) 按顺序提取到元组 (Tuple)**

```rust
use actix_web::{get, web, App, HttpServer, Result};

// 路径模式: /{username}/{id}/index.html
// 提取器类型: web::Path<(String, u32)>
// 第一个变量 {username} 对应 String
// 第二个变量 {id} 对应 u32
#[get("/{username}/{id}/index.html")]
async fn index_tuple(info: web::Path<(String, u32)>) -> Result<String> {
    // info 是一个 Path<(String, u32)> 结构
    // info.into_inner() 可以拿到里面的元组 (String, u32)
    let (username, id) = info.into_inner();
    Ok(format!("欢迎 {}! 你的 ID 是: {}", username, id))
}

// main 函数省略...
```
这种方式要求元组里的类型顺序和数量必须跟路径模式里的 `{}` 变量完全对应。

**b) 按名字提取到结构体 (Struct)**

你需要定义一个结构体，它的字段名要和路径模式里的 `{}` 变量名一致，并且这个结构体需要实现 `serde::Deserialize` trait。

```rust
use actix_web::{get, web, App, HttpServer, Result};
use serde::Deserialize; // 需要添加 serde 依赖并在 features 中启用 "derive"

#[derive(Deserialize)] // 让 serde 能够反序列化这个结构体
struct UserInfo {
    // 字段名必须和路径参数名一致
    username: String,
    id: u32,
}

// 路径模式: /{username}/{id}/index.html
// 提取器类型: web::Path<UserInfo>
#[get("/{username}/{id}/index.html")]
async fn index_struct(info: web::Path<UserInfo>) -> Result<String> {
    // info 是一个 Path<UserInfo> 结构
    // 可以直接访问里面的字段 info.username, info.id
    Ok(format!("欢迎 {}! 你的 ID 是: {}", info.username, info.id))
}

// main 函数省略...
```
这种方式更清晰，不容易搞错顺序，推荐使用。

**分组路由 (Scoping Routes)**

如果你的网站有很多关于用户的 URL，比如：
*   `/users/list`
*   `/users/detail/{id}`
*   `/users/edit/{id}`

你会发现它们都有共同的前缀 `/users`。`web::scope()` 可以帮你把这些相关的路由组织在一起。

```rust
use actix_web::{get, web, App, HttpResponse, HttpServer};

#[get("/list")] // 注意这里路径是相对 scope 的
async fn list_users() -> HttpResponse {
    HttpResponse::Ok().body("用户列表")
}

#[get("/detail/{id}")] // 路径参数 id
async fn user_detail(path: web::Path<(u32,)>) -> HttpResponse { // 用元组提取 id
    HttpResponse::Ok().body(format!("用户详情: ID = {}", path.into_inner().0))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // 创建一个 scope，所有在这个 scope 里注册的 service/route 都会自动加上 "/users" 前缀
            .service(
                web::scope("/users") // 定义前缀
                    .service(list_users)   // 实际路径是 /users/list
                    .service(user_detail) // 实际路径是 /users/detail/{id}
                    // 你可以继续 .service(...) 或 .route(...)
            )
            // 你可以有其他的 scope，比如 web::scope("/admin")...
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```
使用 `web::scope("/users")` 后，你在里面定义的 `#[get("/list")]` 实际对应的完整路径是 `/users/list`。这让你的代码结构更清晰。Scope 也可以嵌套。

**生成 URL (Generating Resource URLs)**

有时候你需要在代码里生成指向你网站其他页面的链接。如果你的资源用 `.name("...")` 命名了，就可以用 `HttpRequest::url_for()` 来生成 URL。

```rust
use actix_web::{get, guard, http::header, web, App, HttpRequest, HttpResponse, HttpServer, Result};

#[get("/generate-link")]
async fn generate_link(req: HttpRequest) -> Result<HttpResponse> {
    // 假设我们想生成指向名为 "user_profile" 的资源的 URL
    // 这个资源路径可能是 /profile/{user_id}/{section}
    let user_id = "123";
    let section = "settings";

    // 调用 url_for("资源名", [路径参数按顺序组成的数组])
    match req.url_for("user_profile", [user_id, section]) {
        Ok(url) => { // url 是一个 Url 对象
            // 可以直接用 url.as_str() 获取字符串形式
            // 比如 "http://127.0.0.1:8080/profile/123/settings"
            Ok(HttpResponse::Ok().body(format!("生成的链接: {}", url)))
        }
        Err(e) => {
            Ok(HttpResponse::InternalServerError().body(format!("生成链接失败: {}", e)))
        }
    }
}

async fn profile_handler() -> HttpResponse { // 只是个占位的处理函数
    HttpResponse::Ok().body("这是用户个人资料页")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(generate_link) // 注册生成链接的路由
            .service(
                // 定义被引用的资源，并给它命名
                web::resource("/profile/{user_id}/{section}")
                    .name("user_profile") // !! 必须有名字才能用 url_for
                    .route(web::get().to(profile_handler))
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

**其他要点**

*   **外部资源 (External Resources):** 可以用 `App::external_resource("name", "https://...")` 定义外部 URL 模板，主要也是为了方便用 `url_for` 生成外部链接。
*   **路径规范化 (Path Normalization):** 使用 `middleware::NormalizePath::default()` 中间件可以自动处理 URL 末尾的斜杠（比如把 `/users` 重定向到 `/users/` 或反之）以及合并多个斜杠（比如把 `/users///list` 重定向到 `/users/list`）。注意：重定向可能会把 POST 请求变成 GET 请求，丢失数据，所以通常只对 GET 请求启用完全的规范化。
*   **自定义守卫 (Custom Route Guard):** 你可以自己写一个结构体实现 `Guard` trait，定义非常复杂的匹配逻辑。
*   **组合守卫:** 可以用 `guard::Not`, `guard::Any`, `guard::All` 来组合已有的守卫，实现“非”、“或”、“且”的逻辑。
*   **自定义 404 页面:** 用 `App::default_service()` 可以指定当所有路由都匹配不上时，应该调用哪个处理逻辑，而不是默认的 404。

**总结一下 URL 分发：**

1.  **核心:** 把收到的请求 (URL + 方法) 导向正确的处理代码 (Handler)。
2.  **注册:** 用 `App::route()` (简单) 或 `App::service(web::resource(...).route(...))` (灵活) 来定义规则。
3.  **路径模式:** 用 `{}` 定义变量段，可以用正则，会自动 URL 解码。
4.  **守卫 (Guard):** 为资源或路由添加额外的匹配条件（如 HTTP 方法、请求头）。
5.  **匹配过程:** 按顺序、先匹配资源路径和守卫、再匹配资源内的路由方法和守卫，找到第一个就用。
6.  **提取参数:** 在 Handler 里用 `web::Path<(...)>` 或 `web::Path<Struct>` 安全地获取 URL 变量。
7.  **组织:** 用 `web::scope()` 把相关路由分组，共享 URL 前缀。
8.  **生成链接:** 用 `req.url_for()` 为命名资源生成 URL。

这就是 Actix Web 处理 URL 和调用对应代码的基本流程