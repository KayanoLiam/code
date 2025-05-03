# 中间件 (Middleware)
聊聊 Actix Web 里的一个重要概念：**中间件 (Middleware)**。

**中间件是啥？（大白话版）**

想象一下你的 Actix Web 应用处理请求的过程就像一条流水线：
请求进来 -> [经过一些处理站] -> 到达最终的处理函数 (Handler) -> 处理函数生成响应 -> [响应再经过一些处理站] -> 响应发出去。

**中间件 (Middleware) 就是你在流水线上设置的那些“处理站”**。

这些处理站可以干很多事情：

1.  **请求预处理：** 在请求到达你的 Handler 之前，检查一下、改动一下。比如：
    *   检查用户是否登录了？没登录？直接拦住，返回“请登录”的响应，根本不让它去访问后面的 Handler。
    *   记录一下请求的信息（谁访问了？访问了哪个地址？什么时候访问的？）。
    *   给请求加点额外信息。
2.  **响应后处理：** 在你的 Handler 生成响应之后，但在响应发给用户之前，再加工一下。比如：
    *   给所有响应加一个统一的 HTTP 头部（比如服务器版本号）。
    *   压缩响应体，让传输更快。
    *   根据响应的状态码（比如 500 错误），显示一个更友好的错误页面。
3.  **修改应用状态：** （虽然不太常见，但理论上可以）。
4.  **访问外部服务：** 比如连接 Redis 读写 Session 数据，或者把日志发送到专门的日志服务。

**中间件的工作方式：像套娃/洋葱**

你可以在应用 (`App`)、某个路径范围 (`Scope`) 或者单个资源 (`Resource`) 上注册中间件。

当你注册多个中间件时，它们会像套娃或者洋葱一样一层层包裹起来。请求进来时，会从最外层的中间件开始，一层层往里走；响应出去时，会从最内层开始，一层层往外走。

**重要：中间件的执行顺序是“后注册的先执行”！** 就像穿衣服，你最后穿上的外套，是别人最先看到的（请求最先碰到）；脱衣服时，你最先脱掉外套（响应最后经过）。

**怎么写中间件？**

写中间件主要有两种方式：

**方式一：硬核方式 - 实现 `Service` 和 `Transform` Trait**

这是最底层、最灵活的方式，但代码也相对复杂。你需要定义两个结构体：

1.  **工厂 (Factory) - 实现 `Transform` Trait:**
    *   这个工厂负责创建你的中间件实例。
    *   它的 `new_transform` 方法接收“下一个服务”（可能是另一个中间件，或者最终的 Handler）作为参数，然后返回一个包含这个“下一个服务”的中间件实例。
2.  **中间件本身 - 实现 `Service` Trait:**
    *   这是实际处理请求的地方。
    *   它的 `call` 方法接收 `ServiceRequest` (请求)。
    *   在 `call` 方法里，你可以：
        *   **在调用下一个服务之前做点事** (请求预处理)。
        *   调用 `self.service.call(req)` 把请求**传递给下一个服务**，并 `await` 它的结果 (一个 `ServiceResponse`)。
        *   **在拿到下一个服务的响应之后做点事** (响应后处理)。
        *   最后返回处理好的响应 (或者错误)。

看个简单的例子（打印日志）：

```rust
use std::future::{ready, Ready};
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error,
};
use futures_util::future::LocalBoxFuture;

// --- 这是我们的中间件逻辑定义 ---
pub struct SayHi; // 一个空的结构体，只是为了实现 Transform

// 1. 实现 Transform (中间件工厂)
// S: 下一个服务的类型, B: 响应体的类型
impl<S, B> Transform<S, ServiceRequest> for SayHi
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static, // 下一个服务的 Future 需要是 'static
    B: 'static,         // 响应体类型也需要是 'static
{
    type Response = ServiceResponse<B>; // 这个中间件最终返回的响应类型
    type Error = Error;               // 这个中间件可能产生的错误类型
    type InitError = ();              // 初始化工厂时可能产生的错误 (这里没有)
    type Transform = SayHiMiddleware<S>; // 工厂创建出的中间件实例的类型
    type Future = Ready<Result<Self::Transform, Self::InitError>>; // 创建过程是同步的 (Ready)

    // 这个方法是核心，用来创建中间件实例
    fn new_transform(&self, service: S) -> Self::Future {
        // 把下一个服务 service 包裹进我们的中间件结构体里
        ready(Ok(SayHiMiddleware { service }))
    }
}

// 2. 中间件实例的结构体
pub struct SayHiMiddleware<S> {
    service: S, // 保存着下一个服务的引用
}

// 3. 为中间件实例实现 Service Trait (处理请求)
impl<S, B> Service<ServiceRequest> for SayHiMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    // 返回一个动态的 Future (因为我们用了 async move)
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    // 这个宏帮助我们传递 "readiness" 状态
    forward_ready!(service);

    // 这个方法是核心，处理进来的请求
    fn call(&self, req: ServiceRequest) -> Self::Future {
        // --- 在调用下一个服务之前 ---
        println!("中间件前段：你好！你请求了: {}", req.path());

        // 调用下一个服务 (可能是另一个中间件，或最终的 handler)
        let fut = self.service.call(req); // 这返回一个 Future

        // 我们需要返回一个 Future，所以用 Box::pin + async move
        Box::pin(async move {
            // 等待下一个服务处理完成，拿到响应结果 res
            let res = fut.await?; // '?' 处理可能发生的错误

            // --- 在拿到下一个服务的响应之后 ---
            println!("中间件后段：再见！");

            // 把响应结果返回
            Ok(res)
        })
    }
}

// --- 如何在 App 中使用 ---
// fn main() {
//     HttpServer::new(|| {
//         App::new()
//             .wrap(SayHi) // 就这样注册！
//             .route("/", web::get().to(HttpResponse::Ok))
//     })
//     // ...
// }
```
这种方式代码量大，泛型多，写起来比较复杂，但提供了最大的控制力。

**方式二：便捷方式 - 使用 `wrap_fn` 或 `from_fn`**

对于简单的场景，比如只是想在请求前后打印日志，或者加个 Header，Actix Web 提供了更简单的函数式风格：

*   **`wrap_fn`:** 直接提供一个闭包，这个闭包接收 `ServiceRequest` 和下一个服务 `srv` 作为参数。你需要在这个闭包里手动调用 `srv.call(req)` 并处理返回的 Future。

```rust
use actix_web::{dev::Service as _, web, App, HttpServer}; // 需要引入 Service trait
use futures_util::future::FutureExt; // 需要引入 FutureExt 来使用 .map

async fn my_handler() -> &'static str {
    "你好，中间件！"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // 使用 wrap_fn 包裹一个闭包
            .wrap_fn(|req, srv| {
                // --- 请求到达时 ---
                println!("wrap_fn 前段: 你好！你请求了: {}", req.path());

                // 调用下一个服务 srv.call(req)，它返回一个 Future
                // 使用 .map 在 Future 完成后执行后续操作
                srv.call(req).map(|res| {
                    // --- 响应返回时 ---
                    println!("wrap_fn 后段: 再见！");
                    // 把原始响应 res 返回
                    res // res 的类型是 Result<ServiceResponse, Error>
                })
            })
            .route("/index.html", web::get().to(my_handler))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

*   **`from_fn` (配合 `wrap`):** 提供一个 `async` 函数，这个函数接收 `ServiceRequest` 和一个特殊的 `Next` 对象。调用 `next.call(req).await` 就像是同步地调用了下一个服务并拿到了响应。这种方式写起来更像普通的 `async` 函数。

```rust
use actix_web::{
    body::MessageBody,
    dev::{ServiceRequest, ServiceResponse},
    middleware::{from_fn, Next}, // 引入 from_fn 和 Next
    web, App, Error, HttpServer, HttpResponse,
};

// 定义一个 async 函数作为中间件逻辑
async fn my_simple_middleware<B: MessageBody>( // 需要指定 Body 类型 B
    req: ServiceRequest,
    next: Next<B>, // Next<B> 代表调用链的下一步
) -> Result<ServiceResponse<B>, Error> {
    // --- 请求预处理 ---
    println!("from_fn 前段: 你好！你请求了: {}", req.path());
    // 如果想在这里提前返回，可以直接 return Ok(req.into_response(...))

    // 调用下一个服务 (中间件或 handler)，并等待响应
    let response = next.call(req).await?; // 调用方式更自然

    // --- 响应后处理 ---
    println!("from_fn 后段: 再见！");
    // 可以在这里修改 response, 比如 response.headers_mut().insert(...)
    // 注意：修改 body 比较复杂，通常只修改 header 或记录日志

    Ok(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
     HttpServer::new(|| {
        App::new()
            // 使用 wrap 包裹 from_fn(你的中间件函数)
            .wrap(from_fn(my_simple_middleware))
            .route("/", web::get().to(|| async { HttpResponse::Ok().body("OK") }))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

```

`wrap_fn` 和 `from_fn` 写起来简单很多，适合大多数自定义中间件的需求。

**Actix Web 自带的常用中间件**

Actix Web 提供了一些开箱即用的中间件，非常实用：

1.  **`Logger` (日志)**
    *   **作用：** 记录每个请求的详细信息，如访问者 IP、请求时间、路径、状态码、处理时长、User-Agent 等。排查问题必备！
    *   **使用：**
        ```rust
        use actix_web::middleware::Logger;
        use env_logger::Env; // 需要 env_logger 库来初始化

        // 在 main 函数开始处初始化日志
        env_logger::init_from_env(Env::default().default_filter_or("info"));

        // 在 App 构建时添加
        App::new().wrap(Logger::default()) // 使用默认格式
                 // .wrap(Logger::new("自定义格式")) // 也可以指定格式
        ```
    *   **格式化字符串：** 文档里列出了很多占位符，比如 `%a` (IP), `%r` (请求行), `%s` (状态码), `%T` (处理时间秒), `%{User-Agent}i` (请求头里的 User-Agent) 等。

2.  **`Compress` (压缩)** - (我们之前聊响应时提过)
    *   **作用：** 自动根据客户端（浏览器）能接受的压缩方式（`Accept-Encoding` 头）来压缩响应体，减少传输大小。
    *   **使用：** `App::new().wrap(middleware::Compress::default())`

3.  **`DefaultHeaders` (默认响应头)**
    *   **作用：** 给所有（或匹配的）响应自动添加一些 HTTP 头部，比如 `X-Frame-Options`, `X-Content-Type-Options`, 或者你自己的版本号 `X-Version`。
    *   **使用：** `App::new().wrap(middleware::DefaultHeaders::new().add(("Header名", "Header值")))`
    *   **注意：** 它不会覆盖响应中已经存在的同名 Header。

4.  **`SessionMiddleware` (用户会话)**
    *   **作用：** 在多次请求之间保持用户的状态，比如用户登录信息、购物车内容等。
    *   **原理：** 通常通过在客户端存一个带签名的 Cookie (Session ID)，服务器端根据这个 ID 找到对应的 Session 数据（可以存在内存、Cookie本身、Redis、数据库等）。
    *   **使用 (以 Cookie 存储为例):**
        ```rust
        use actix_session::{SessionMiddleware, storage::CookieSessionStore};
        use actix_web::cookie::Key; // 用来生成加密/签名的密钥

        // 需要一个密钥，长度必须足够 (例如 64 字节)
        // 现实应用中应该从配置或环境变量加载，而不是硬编码！
        let secret_key = Key::from(&[0; 64]);

        App::new().wrap(
            SessionMiddleware::builder(CookieSessionStore::default(), secret_key)
                // .cookie_secure(false) // 开发时用 http 可以设为 false，生产环境 https 必须 true
                .build()
        )
        ```
    *   **在 Handler 中使用：** 通过 `Session` 提取器来读写 Session 数据：
        ```rust
        use actix_session::Session;
        async fn handler(session: Session) -> Result<HttpResponse, Error> {
            // 写入 session
            session.insert("user_id", 123)?;
            // 读取 session
            if let Some(user_id) = session.get::<i32>("user_id")? { ... }
            // 清除 session
            // session.clear();
            // ...
        }
        ```
    *   **注意：** Cookie 存储有大小限制 (约 4KB)，不能存太多东西。对于需要存大量数据或更高安全性的场景，应使用 Redis 或数据库后端（需要额外添加对应的 `actix-session` 存储库依赖）。密钥非常重要，泄露会导致 Session 被伪造。

5.  **`ErrorHandlers` (错误处理)**
    *   **作用：** 自定义特定 HTTP 错误状态码（如 404 Not Found, 500 Internal Server Error）的响应页面或逻辑。
    *   **使用：**
        ```rust
        use actix_web::middleware::ErrorHandlers;
        use actix_web::http::StatusCode;

        // 定义一个处理函数，接收 ServiceResponse，返回修改后的响应或新响应
        fn custom_404_handler<B>(res: dev::ServiceResponse<B>) -> Result<ErrorHandlerResponse<B>> {
            let new_response = HttpResponse::NotFound()
                .body("哎呀，页面飞走啦！(自定义 404)");
            // 把原来的 body 类型丢掉，换成新 response 的 body 类型
            Ok(ErrorHandlerResponse::Response(res.into_response(new_response.map_into_left_body())))
        }

        App::new().wrap(
            ErrorHandlers::new()
                .handler(StatusCode::NOT_FOUND, custom_404_handler)
                // 可以继续 .handler(StatusCode::INTERNAL_SERVER_ERROR, ...)
        )
        ```

**总结一下中间件：**

*   **是什么：** 请求响应流水线上的处理站。
*   **干什么：** 预处理请求、后处理响应、日志、认证、Session、压缩、错误处理等。
*   **怎么工作：** 像洋葱一层层包裹，后注册的先执行（对请求来说），后执行（对响应来说）。
*   **怎么写：**
    *   硬核方式：实现 `Transform` 和 `Service` trait (复杂但灵活)。
    *   便捷方式：用 `wrap_fn` 或 `from_fn` (简单，适合多数情况)。
*   **怎么用：** 在 `App`, `Scope`, `Resource` 上用 `.wrap()` 方法注册。
*   **常用自带：** `Logger`, `Compress`, `DefaultHeaders`, `SessionMiddleware`, `ErrorHandlers` 等，能满足很多常见需求。

中间件是 Actix Web 强大和灵活性的重要体现！