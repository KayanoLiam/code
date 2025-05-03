# 测试 (Testing)
怎么给你的 Actix Web 应用写测试，确保它能按你预想的那样工作。写测试非常重要，能帮你抓住 Bug，以后改代码也更有底气。

Actix Web 提供了一套工具，让你能方便地测试你的应用，就像模拟一个真实的浏览器或客户端去访问你的服务一样。

**核心思想：模拟请求，检查响应**

测试的基本流程就是：
1.  **启动一个“测试版”的应用服务:** 把你的 `App` 配置（路由、中间件、共享状态等）加载到一个专门用于测试的环境里。
2.  **创建一个模拟的 HTTP 请求:** 就像用 `curl` 或者浏览器访问一样，指定方法（GET/POST）、路径、请求头、请求体等。
3.  **把模拟请求“发送”给测试服务:** 调用测试服务处理这个请求。
4.  **接收模拟的 HTTP 响应:** 拿到服务返回的结果。
5.  **检查响应是否符合预期:** 对比响应的状态码、响应头、响应体内容是不是跟你想要的一样。

**主要工具:**

*   `#[actix_web::test]`: 一个方便的宏，加在你的 `async` 测试函数上，它会帮你设置好异步运行时环境。
*   `test::init_service(你的 App 配置)`: 这就是步骤 1，启动测试服务。它接收你的 `App::new()...` 配置，返回一个可以在测试中调用的 `Service` 对象。
*   `test::TestRequest`: 这是步骤 2，用来创建模拟请求的构建器。
    *   `TestRequest::get()`, `TestRequest::post()`, `TestRequest::default()` (默认是 GET "/") 等方法开始构建。
    *   `.uri("/path")`: 设置请求路径。
    *   `.insert_header(...)`: 添加请求头。
    *   `.set_payload(...)`: 设置请求体。
    *   `.to_request()`: 完成构建，生成一个 `HttpRequest` 对象（给 `call_service` 用）。
    *   `.to_http_request()`: 生成一个稍微不同的 `HttpRequest` 对象（给直接调用 handler 或 extractor 测试用）。
*   `test::call_service(&app, req)`: 这是步骤 3 和 4，把 `req` 发给 `app`（`init_service` 返回的服务），然后 `await` 拿到 `HttpResponse`。
*   `assert!` / `assert_eq!`: 这是步骤 5，Rust 内置的断言宏，用来检查结果。

**例子 1：基本的集成测试 (Integration Testing)**

这是最常用的一种测试，测试你的路由和处理函数能不能正确协作。

假设你有一个简单的 `index` 处理函数（需要定义在你的代码里，这里省略了定义，假设它存在且对 GET 返回成功，对 POST 返回错误）。

```rust
// 假设你的代码里有类似这样的 handler
// async fn index(req: HttpRequest) -> HttpResponse { ... }
// App::new().service(index) or App::new().route("/", web::get().to(index))

#[cfg(test)] // 这个标记表示下面的代码只在测试时编译
mod tests {
    use actix_web::{http::header::ContentType, test, App};

    // 引入你实际代码里的 handler，假设它在父模块 (super)
    // use super::*;

    // 测试 GET / 应该成功
    #[actix_web::test] // 异步测试必须加这个宏
    async fn test_index_get() {
        // 1. 初始化一个只包含 index 服务的测试应用
        let app = test::init_service(
            App::new() // 像平时一样配置 App
                // 假设 index 是一个 service 或者用 route 注册了 GET /
                .route("/", actix_web::web::get().to(|| async { actix_web::HttpResponse::Ok().finish() })) // 这里用一个简单的闭包代替真实的 index
        ).await; // init_service 是异步的

        // 2. 创建一个模拟的 GET 请求
        let req = test::TestRequest::default() // 默认是 GET /
            .insert_header(ContentType::plaintext()) // 加个请求头（可选）
            .to_request(); // 生成请求对象

        // 3 & 4. 把请求发给测试服务，拿到响应
        let resp = test::call_service(&app, req).await;

        // 5. 检查响应状态码是不是成功的 (2xx)
        assert!(resp.status().is_success());
        // 你还可以检查更多，比如 resp.headers(), read_body(resp).await 等
    }

    // 测试 POST / 应该失败 (比如返回 405 Method Not Allowed)
    #[actix_web::test]
    async fn test_index_post() {
        // 1. 初始化服务 (同上)
         let app = test::init_service(
            App::new()
                .route("/", actix_web::web::get().to(|| async { actix_web::HttpResponse::Ok().finish() }))
        ).await;

        // 2. 创建一个模拟的 POST 请求
        let req = test::TestRequest::post() // 创建 POST 请求
            .uri("/") // 设置路径为 /
            .to_request();

        // 3 & 4. 发送并获取响应
        let resp = test::call_service(&app, req).await;

        // 5. 检查响应状态码是不是客户端错误 (4xx)
        // 比如，如果 / 只定义了 GET，发 POST 应该返回 405 Method Not Allowed
        assert!(resp.status().is_client_error());
    }
}

```

**例子 2：测试带有共享状态 (App Data) 的应用**

如果你的应用使用了 `app_data` 来共享状态（比如数据库连接池、配置），测试时也需要提供这些状态。

假设你的应用状态和 handler 是这样的：

```rust
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};

#[derive(Clone)] // AppState 通常需要 Clone
struct AppState {
    count: i32,
}

#[derive(Serialize, Deserialize)] // 用于 JSON 序列化/反序列化
struct AppStateResponse {
    count: i32,
}

// 这个 handler 读取 AppState 并以 JSON 返回
#[get("/")]
async fn index_with_state(data: web::Data<AppState>) -> impl Responder {
    let current_count = data.count;
    web::Json(AppStateResponse { count: current_count })
}

// main 函数省略...
```

测试代码：

```rust
#[cfg(test)]
mod tests {
    use super::*; // 引入 AppState, index_with_state 等
    use actix_web::{test, web, App};

    #[actix_web::test]
    async fn test_index_with_state_get() {
        // 1. 初始化服务，并提供 AppState 数据
        let initial_state = AppState { count: 4 };
        let app = test::init_service(
            App::new()
                // 在测试中配置 app_data，就像在 main 函数里一样
                .app_data(web::Data::new(initial_state.clone()))
                .service(index_with_state), // 注册使用了状态的 handler
        )
        .await;

        // 2. 创建 GET 请求
        let req = test::TestRequest::get().uri("/").to_request();

        // 3, 4 & 5: 发送请求，读取响应体，并直接解析成 JSON
        // test::call_and_read_body_json 是一个方便的函数，
        // 它帮你调用服务、读取响应体、并尝试把响应体解析成指定的 JSON 类型。
        let resp_body: AppStateResponse = test::call_and_read_body_json(&app, req).await;

        // 检查返回的 JSON 内容里的 count 是不是我们初始化的值
        assert_eq!(resp_body.count, 4);
    }
}
```

**例子 3：测试流式响应 (Streaming Response)**

如果你的 handler 返回一个数据流（比如 Server-Sent Events (SSE) 或者大文件下载），你需要测试这个流的内容。

假设有这样一个 SSE handler:

```rust
// ... (sse handler 定义，如原文所示，每秒发送 data: N)
use std::task::Poll;
use actix_web::{ http::{self, header::ContentEncoding, StatusCode}, web, App, Error, HttpRequest, HttpResponse, Responder};
use futures::{stream, StreamExt}; // StreamExt for stream::poll_fn

async fn sse(_req: HttpRequest) -> HttpResponse {
    let mut counter: usize = 5;
    let server_events =
        stream::poll_fn(move |_cx| -> Poll<Option<Result<web::Bytes, Error>>> {
            if counter == 0 { return Poll::Ready(None); }
            let payload = format!("data: {}\n\n", counter);
            counter -= 1;
            std::thread::sleep(std::time::Duration::from_millis(10)); // 模拟延迟
            Poll::Ready(Some(Ok(web::Bytes::from(payload))))
        });
    HttpResponse::build(StatusCode::OK)
        .insert_header((http::header::CONTENT_TYPE, "text/event-stream"))
        .insert_header(ContentEncoding::Identity) // 明确禁用压缩，因为SSE通常不需要
        .streaming(server_events) // 使用 streaming 发送流
}

// main 函数省略...
```

测试代码：

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{body::{self, MessageBody as _}, rt::pin, test, web, App};
    // MessageBody trait 提供了 poll_next 方法
    // rt::pin! 宏用于固定 Future/Stream
    use futures::{future, StreamExt as _}; // StreamExt for poll_fn in handler is different from test poll

    // 测试流的每一块数据
    #[actix_web::test]
    async fn test_sse_stream_chunks() {
        let app = test::init_service(App::new().route("/", web::get().to(sse))).await;
        let req = test::TestRequest::get().uri("/").to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());

        // 获取响应体，它现在是一个数据流 (实现了 MessageBody trait)
        let body = resp.into_body();
        pin!(body); // 固定这个流，这样才能在循环/多次 poll 中使用它

        // 从流中拉取第一块数据
        let bytes = future::poll_fn(|cx| body.as_mut().poll_next(cx)).await;
        assert_eq!(
            bytes.expect("Stream shouldn't end yet").expect("Chunk read error"),
            web::Bytes::from_static(b"data: 5\n\n")
        );

        // 拉取第二块
        let bytes = future::poll_fn(|cx| body.as_mut().poll_next(cx)).await;
        assert_eq!(
            bytes.expect("Stream shouldn't end yet").expect("Chunk read error"),
            web::Bytes::from_static(b"data: 4\n\n")
        );

        // 拉取剩下的块
        for i in (1..=3).rev() { // 应该是 3, 2, 1
             let expected_data = format!("data: {}\n\n", i);
             let bytes = future::poll_fn(|cx| body.as_mut().poll_next(cx)).await;
             assert_eq!(
                 bytes.expect("Stream shouldn't end yet").expect("Chunk read error"),
                 web::Bytes::from(expected_data)
             );
        }

        // 检查流是否结束
        let bytes = future::poll_fn(|cx| body.as_mut().poll_next(cx)).await;
        assert!(bytes.is_none(), "Stream should have ended");
    }

    // 测试一次性读取整个流的内容
    #[actix_web::test]
    async fn test_sse_stream_full_payload() {
        let app = test::init_service(App::new().route("/", web::get().to(sse))).await;
        let req = test::TestRequest::get().uri("/").to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());

        let body = resp.into_body();
        // body::to_bytes 会读取整个流，直到结束，然后把所有数据块合并成一个 Bytes 对象
        let full_bytes = body::to_bytes(body).await.expect("Failed to read full body");

        assert_eq!(
            full_bytes,
            web::Bytes::from_static(b"data: 5\n\ndata: 4\n\ndata: 3\n\ndata: 2\n\ndata: 1\n\n")
        );
    }
}
```

**单元测试 (Unit Testing) - 提取器、中间件等**

对于应用的整体逻辑，集成测试通常更有价值。但如果你在开发自己的提取器 (Extractor)、中间件 (Middleware) 或响应器 (Responder)，单元测试就很有用了。

你可以直接创建 `HttpRequest` 对象（用 `TestRequest::to_http_request()`），然后调用你的提取器或中间件的逻辑，或者直接调用**没有**使用路由宏（如 `#[get("/")]`）定义的、可以独立调用的 handler 函数。

```rust
// 假设有一个独立的 handler 函数 (没有 #[get(...)] 等宏)
async fn standalone_handler(req: actix_web::HttpRequest) -> actix_web::HttpResponse {
    if req.headers().contains_key("Content-Type") {
        actix_web::HttpResponse::Ok().finish()
    } else {
        actix_web::HttpResponse::BadRequest().finish()
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{
        http::{self, header::ContentType},
        test,
    };

    // 测试 handler 在有 Content-Type 时返回 OK
    #[actix_web::test]
    async fn test_standalone_handler_ok() {
        // 创建一个带 Content-Type 头的请求
        let req = test::TestRequest::default()
            .insert_header(ContentType::plaintext())
            .to_http_request(); // 注意是 to_http_request()

        // 直接调用 handler 函数
        let resp = standalone_handler(req).await;

        // 检查状态码
        assert_eq!(resp.status(), http::StatusCode::OK);
    }

    // 测试 handler 在没有 Content-Type 时返回 Bad Request
    #[actix_web::test]
    async fn test_standalone_handler_not_ok() {
        // 创建一个不带 Content-Type 头的请求
        let req = test::TestRequest::default().to_http_request();

        // 直接调用
        let resp = standalone_handler(req).await;

        // 检查状态码
        assert_eq!(resp.status(), http::StatusCode::BAD_REQUEST);
    }
}
```

**总结一下测试：**

1.  **首选集成测试:** 使用 `#[actix_web::test]`, `test::init_service`, `test::TestRequest`, `test::call_service` 来模拟完整的请求-响应流程。
2.  **测试带状态的应用:** 在 `init_service` 时用 `.app_data()` 提供状态。
3.  **测试流式响应:** 获取响应体 `MessageBody`，然后使用 `poll_next` 逐块检查，或用 `body::to_bytes` 获取完整内容。
4.  **单元测试:** 主要用于测试自定义的组件（提取器、中间件），或者可以独立调用的 handler 函数。

这样你就可以为你的 Actix Web 应用编写全面的测试了！