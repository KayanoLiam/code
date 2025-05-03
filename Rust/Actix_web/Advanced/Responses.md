# 响应 (Responses)
在 Actix Web 里，你的处理函数 (Handler) 处理完请求后，怎么给客户端（比如浏览器）回消息，也就是怎么构造和发送 **HTTP 响应 (Response)**。

想象一下，别人问你问题（发请求），你得回答（发响应）。这个回答不能随随便便，得有格式，比如先说“我知道了”（HTTP 状态码，像 200 OK），然后可能要说明回答的格式（Content-Type，比如是纯文本还是 JSON），最后才是回答的内容（响应体 Body）。

**构造响应的基本方式：`HttpResponse` 构建器 (Builder)**

Actix Web 提供了一种像搭积木一样的方式来创建响应，叫做“构建器模式” (Builder Pattern)。

1.  **起点：选个状态码。** 你通常从一个表示 HTTP 状态码的方法开始，比如 `HttpResponse::Ok()` (表示 200 OK), `HttpResponse::NotFound()` (表示 404 Not Found), `HttpResponse::BadRequest()` (表示 400 Bad Request) 等等。这会返回一个 `HttpResponseBuilder` 对象。
2.  **加点料：设置头部、内容类型等。** 拿到 `HttpResponseBuilder` 后，你可以链式调用各种方法来添加细节：
    *   `.content_type(...)`: 设置响应内容的类型，比如 `ContentType::plaintext()` (纯文本), `ContentType::json()` (JSON), `ContentType::html()` (HTML) 等。
    *   `.insert_header(("Header名", "Header值"))`: 添加自定义的 HTTP 头部。
    *   还有很多其他方法，可以查文档。
3.  **收尾：加入响应体并完成构建。** 最后，你需要调用一个“终结”方法，把响应体（你想发给客户端的实际内容）放进去，并生成最终的 `HttpResponse` 对象。常用的终结方法有：
    *   `.body("你的内容字符串或者字节")`: 发送普通文本或字节数据。
    *   `.json(你的可序列化数据)`: 把你的 Rust 数据结构（需要实现 `serde::Serialize`）转换成 JSON 字符串作为响应体，并自动设置 `Content-Type: application/json`。
    *   `.finish()`: 发送一个没有响应体的响应（比如对于 204 No Content 状态码）。

**注意：** 终结方法（`.body`, `.json`, `.finish`）在一个构建器实例上**只能调用一次**！调完就代表响应造好了。再调就会报错 (panic)。

看个例子：

```rust
use actix_web::{http::header::ContentType, HttpResponse};

async fn index() -> HttpResponse {
    // 1. 起点：200 OK
    HttpResponse::Ok()
        // 2. 加料：设置内容类型为纯文本
        .content_type(ContentType::plaintext())
        // 2. 加料：添加一个自定义头部 X-Hdr: sample
        .insert_header(("X-Hdr", "sample"))
        // 3. 收尾：设置响应体为 "data" 并完成构建
        .body("data")
}
```
这个 `index` 函数被调用时，会返回一个 HTTP 响应，状态码是 200，内容类型是 `text/plain`，包含一个自定义头 `X-Hdr: sample`，响应体是字符串 "data"。

**专门返回 JSON 响应**

你的 API 经常需要返回 JSON 数据。Actix Web 有个更方便、更清晰的方式来专门做这件事，就是直接返回 `web::Json<T>` 类型。

1.  **定义一个 Rust 结构体 `T`**，你想把它转成 JSON 返回。
2.  **给结构体加上 `#[derive(Serialize)]`**。这是告诉 `serde` 库：“我知道怎么把这个结构体的实例变成 JSON 字符串”。（注意：接收请求是用 `Deserialize`，发送响应是用 `Serialize`）。
3.  **在你的处理函数里，创建一个 `T` 的实例，用 `web::Json()` 包裹它**，然后直接返回（通常放在 `Ok()` 里，如果你的函数返回 `Result` 的话）。

看代码：

```rust
// 别忘了在 Cargo.toml 加依赖:
// serde = { version = "1.0", features = ["derive"] }

use actix_web::{get, web, App, HttpResponse, HttpServer, Responder, Result};
use serde::Serialize; // 引入 Serialize

// 1. 定义要返回的结构体
#[derive(Serialize)] // 2. 加上 Serialize 宏！
struct MyInfo {
    username: String,
    message: String,
}

#[get("/hello/{name}")] // 路径参数 name
async fn greet(name: web::Path<String>) -> Result<impl Responder> { // 返回 Result<impl Responder>
    // 创建要返回的数据实例
    let info = MyInfo {
        username: name.into_inner(), // 从 Path 中取出 name
        message: "欢迎使用 Actix Web!".to_string(),
    };

    // 3. 用 web::Json 包裹数据并返回
    // Actix 会自动帮你：
    // a. 把 info 序列化成 JSON 字符串
    // b. 设置 Content-Type: application/json
    // c. 设置状态码为 200 OK (因为是 Ok(web::Json(...)) )
    Ok(web::Json(info))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(greet))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
```
访问 `http://127.0.0.1:8080/hello/张三`，你会收到一个 JSON 响应：
```json
{
  "username": "张三",
  "message": "欢迎使用 Actix Web!"
}
```

**用 `web::Json<T>` 返回的好处是：**
从函数的返回类型 `Result<web::Json<MyInfo>>` 或 `web::Json<MyInfo>`，就能一眼看出这个函数**必定返回 JSON**，代码更清晰。而用 `HttpResponseBuilder::json()` 的话，返回类型是 `HttpResponse`，你需要看具体实现才知道它返回的是不是 JSON。

**内容压缩 (Content Encoding)**

如果你的响应体比较大（比如一个很长的 JSON 或 HTML），传输起来会比较慢，也浪费带宽。Actix Web 可以帮你自动压缩响应内容。

你需要使用 `Compress` 中间件 (Middleware)。中间件就像是在你的请求处理流程外面包了一层额外的处理逻辑。

1.  **在 `App` 上添加 `Compress` 中间件。** 使用 `.wrap(middleware::Compress::default())`。

```rust
use actix_web::{get, middleware, App, HttpResponse, HttpServer}; // 引入 middleware

#[get("/big_data")]
async fn big_data() -> HttpResponse {
    // 假设这里生成了一个很大的字符串
    let large_body = "这是一个很大很大的响应体...".repeat(1000);
    HttpResponse::Ok().body(large_body)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // 启用压缩中间件！
            .wrap(middleware::Compress::default())
            .service(big_data) // 注册你的处理函数
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

现在，当浏览器请求 `/big_data` 时：
1.  浏览器会在请求头里告诉服务器它支持哪些压缩格式，比如 `Accept-Encoding: gzip, deflate, br`。
2.  `Compress` 中间件看到这个头，再看看服务器支持的压缩格式（默认都支持）。
3.  它会选择一个双方都支持的最高效的格式（比如 `br` 或 `gzip`），把 `big_data` 函数返回的响应体压缩一下。
4.  然后，它在最终发给浏览器的响应头里加上 `Content-Encoding: br` (或者 `gzip` 等)，告诉浏览器：“我用 br 压缩了，你收到了自己解压”。
5.  浏览器收到后，看到 `Content-Encoding` 头，就知道怎么解压了。

整个过程对你的处理函数是透明的，你只需要返回原始数据，中间件会自动帮你压缩。如果浏览器不支持任何压缩，中间件也不会压缩，直接发送原始数据（这叫 `identity` 编码）。

**禁止特定响应的压缩**

有时候，某个响应你不想让它被压缩（可能它已经很小了，或者压缩会出问题）。你可以在构建 `HttpResponse` 时，手动设置 `Content-Encoding` 头部为 `Identity`。

```rust
use actix_web::{
    get, http::header::ContentEncoding, middleware, App, HttpResponse, HttpServer,
};

#[get("/no_compress")]
async fn no_compress() -> HttpResponse {
    HttpResponse::Ok()
        // 手动设置 Content-Encoding 为 Identity，告诉压缩中间件“别碰我”
        .insert_header(ContentEncoding::Identity)
        .body("这点内容就不用压缩啦")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 即使应用全局启用了压缩中间件
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Compress::default())
            .service(no_compress) // 这个路由的响应也不会被压缩
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

**发送预先压缩好的内容**

假设你有一些静态资源（比如 CSS、JS 文件），在构建网站时就已经把它们压缩成了 `.gz` 或 `.br` 文件存着了。当用户请求这些资源时，你希望直接发送这些压缩好的文件，而不是让 Actix Web 再压缩一遍（浪费 CPU，而且可能把已经压缩的文件弄坏）。

方法是：
1.  读取你预先压缩好的文件的**原始字节**。
2.  在构建 `HttpResponse` 时，用 `.body()` 把这些**压缩好的字节**放进去。
3.  **同时，手动设置正确的 `Content-Encoding` 头部**（比如 `ContentEncoding::Gzip` 或 `ContentEncoding::Brotli`），告诉浏览器这个响应体是用哪种方式压缩的。

```rust
use actix_web::{
    get, http::header::ContentEncoding, middleware, App, HttpResponse, HttpServer,
};

// 假设这是预先用 gzip 压缩好的 "Hello World!" 字符串的字节数据
static HELLO_WORLD_GZIPPED: &[u8] = &[
    0x1f, 0x8b, 0x08, 0x00, 0xa2, 0x30, 0x10, 0x5c, 0x00, 0x03, 0xcb, 0x48, 0xcd, 0xc9, 0xc9,
    0x57, 0x28, 0xcf, 0x2f, 0xca, 0x49, 0xe1, 0x02, 0x00, 0x2d, 0x3b, 0x08, 0xaf, 0x0c, 0x00,
    0x00, 0x00,
];

#[get("/precompressed")]
async fn precompressed() -> HttpResponse {
    HttpResponse::Ok()
        // 关键：告诉浏览器这是 gzip 压缩的
        .insert_header(ContentEncoding::Gzip)
        // 关键：直接发送压缩好的字节数据
        .body(HELLO_WORLD_GZIPPED)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 即使应用全局启用了压缩中间件
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Compress::default()) // 这个中间件看到 Content-Encoding 不是 Identity 也不是 Auto, 就不会再压缩了
            .service(precompressed)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

**总结一下发送响应：**

*   **基本方式:** 用 `HttpResponse::Ok()` 等开始，链式调用 `.content_type()`, `.insert_header()` 等，最后用 `.body()`, `.json()` 或 `.finish()` 结束。
*   **JSON 响应:** 推荐直接返回 `web::Json<YourStruct>` (需要 `#[derive(Serialize)]`)，代码更清晰。也可以用 `HttpResponseBuilder::json()`.
*   **自动压缩:** 使用 `middleware::Compress::default()` 中间件，它会根据浏览器能力自动压缩响应。
*   **禁止压缩:** 在响应上设置 `ContentEncoding::Identity`。
*   **发送预压缩内容:** 直接用 `.body()` 发送压缩字节，并手动设置正确的 `Content-Encoding` (如 `Gzip`, `Brotli`)。

这样，你就能灵活地控制 Actix Web 如何向客户端发送各种各样的响应了。