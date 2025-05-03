# 错误处理 (Error Handling)
聊聊 Actix Web 里的错误处理是怎么回事，再结合代码看看。

想象一下你在写一个网站后端服务，比如用户注册。用户提交信息，你的代码（我们叫它“处理函数” Handler）去处理。处理过程中可能会出错，比如：
1.  用户没填用户名（这是用户的错）。
2.  你想把用户信息存数据库，但数据库连不上了（这是服务器内部的错）。
3.  你想读取一个本地文件（比如头像模板），但文件不存在（也算内部错误）。

Actix Web 说：嘿，你的处理函数如果出错了，别直接崩掉啊！你可以告诉我你出了什么错，我（Actix Web 框架）会帮你把这个“错误”变成一个合适的 HTTP 响应（比如 400 Bad Request 或者 500 Internal Server Error）返回给浏览器或者调用你 API 的客户端。

**核心概念：`ResponseError` 特质 (Trait)**

Actix Web 定义了一个叫 `ResponseError` 的“规矩”（在 Rust 里叫 Trait，可以理解成一种接口或约定）。任何类型，只要遵守了这个规矩，Actix Web 就知道怎么把它变成一个 HTTP 错误响应。

这个规矩有两条核心要求：

1.  `status_code(&self) -> StatusCode`: 你得告诉我这个错误应该对应哪个 HTTP 状态码（比如 400, 500, 404 等）。
2.  `error_response(&self) -> HttpResponse<BoxBody>`: 你得告诉我具体怎么生成这个错误的 HTTP 响应（可以设置响应头，比如 `Content-Type`，还有响应体，也就是返回给用户看的内容）。

```rust
// 这就是那个“规矩”的定义
pub trait ResponseError {
    // 必须实现：返回对应的 HTTP 状态码
    fn status_code(&self) -> StatusCode;
    // 必须实现（但有默认）：生成完整的 HTTP 响应
    fn error_response(&self) -> HttpResponse<BoxBody>;
}
```

**处理函数的返回值 `Result<T, E>`**

你的处理函数通常会返回一个 `Result<T, E>`。
*   `T`：表示成功时返回的数据类型（比如一个字符串、JSON 数据等）。
*   `E`：表示失败时返回的错误类型。

关键点来了：**如果你的错误类型 `E` 实现了 `ResponseError` 这个规矩，Actix Web 就能自动帮你处理！**

```rust
// 这行代码（文档里的）意思是：
// 如果 Result 里的 T 能变成响应 (实现了 Responder)，
// 并且 Result 里的 E 能转成 Actix 的 Error 类型 (通常意味着 E 实现了 ResponseError)，
// 那么这个 Result 本身也能被 Actix 理解并变成响应。
impl<T: Responder, E: Into<Error>> Responder for Result<T, E>
```

**Actix Web 帮你处理了一些常见错误**

你不需要为所有错误都手动实现 `ResponseError`。比如，如果你代码里出现了标准的 `std::io::Error`（比如读文件失败），Actix Web 已经帮你做好了转换，默认会变成一个 500 Internal Server Error。

```rust
use std::io;
use actix_files::NamedFile;
use actix_web::{HttpRequest, Result as ActixResult}; // 注意这里的 Result 是 actix_web::Result

// 这个函数返回 io::Result<NamedFile>，也就是 Result<NamedFile, std::io::Error>
fn index(_req: HttpRequest) -> io::Result<NamedFile> {
    // NamedFile::open 返回的也是 io::Result
    // 如果这里文件 "static/index.html" 不存在，会返回一个 io::Error
    // Actix Web 看到 io::Error，会自动将其转为 500 错误响应
    Ok(NamedFile::open("static/index.html")?) // ? 语法糖，出错时提前返回 Err(io::Error)
}
```
上面代码如果 `NamedFile::open` 失败，返回 `Err(io::Error)`，Actix Web 会自动接管，返回一个 HTTP 500 响应给客户端。

**自定义错误并实现 `ResponseError`**

通常我们想更精细地控制错误。比如，想区分是用户输入无效（400）还是服务器内部问题（500）。这时就需要自定义错误类型，并为它实现 `ResponseError`。

这里用到了 `derive_more` 这个库，它能简化一些模板代码的书写（比如自动实现 `Display` 和 `Error` trait）。

**例子 1：最简单的自定义错误（使用默认的 500 响应）**

```rust
use actix_web::{error, Result};
use derive_more::derive::{Display, Error}; // 引入方便写代码的宏

#[derive(Debug, Display, Error)] // 使用宏自动实现 Debug, Display, Error trait
#[display("我的错误: {name}")] // 定义错误信息怎么显示 (用于 Display trait)
struct MyError {
    name: &'static str,
}

// 关键：为我们自定义的 MyError 实现 ResponseError 规矩
// 这里我们用了默认的 error_response() 实现
impl error::ResponseError for MyError {} // 注意这个 error 是 actix_web::error

async fn index() -> Result<&'static str, MyError> { // 返回值是 Result，错误类型是我们的 MyError
    // 直接返回一个我们定义的错误
    Err(MyError { name: "测试错误" })
}
```
在这个例子里，我们定义了 `MyError`，并让它实现了 `ResponseError`。但我们没有自己写 `status_code` 和 `error_response` 方法，所以它会使用 `ResponseError` 的默认实现：
*   `status_code()`: 默认是 `StatusCode::INTERNAL_SERVER_ERROR` (500)。
*   `error_response()`: 默认会用 500 状态码，响应体是错误的 `Display` 输出（也就是 "我的错误: 测试错误"）。

所以访问 `index` 路由会得到一个 500 错误。

**例子 2：自定义错误并覆盖 `status_code` 和 `error_response`**

这次我们想根据不同的错误类型，返回不同的状态码和响应内容。通常用枚举（Enum）来定义不同种类的错误。

```rust
use actix_web::{
    error, get,
    http::{header::ContentType, StatusCode},
    App, HttpResponse,
};
use derive_more::derive::{Display, Error};

#[derive(Debug, Display, Error)]
enum MyError {
    #[display("内部错误")] // 为 InternalError 定义显示信息
    InternalError,

    #[display("请求数据有问题")] // 为 BadClientData 定义显示信息
    BadClientData,

    #[display("处理超时")] // 为 Timeout 定义显示信息
    Timeout,
}

// 为我们的枚举 MyError 实现 ResponseError 规矩
impl error::ResponseError for MyError {
    // 自己写 error_response 方法，定制响应
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code()) // 使用下面 status_code() 方法得到的 SatusCode
            .insert_header(ContentType::html()) // 设置响应头，告诉浏览器内容是 HTML (这里简单用文本也行)
            .body(self.to_string()) // 设置响应体，内容就是上面 #[display(...)] 定义的
    }

    // 自己写 status_code 方法，根据错误类型返回不同状态码
    fn status_code(&self) -> StatusCode {
        match *self { // 匹配是哪种错误
            MyError::InternalError => StatusCode::INTERNAL_SERVER_ERROR, // 500
            MyError::BadClientData => StatusCode::BAD_REQUEST,         // 400
            MyError::Timeout => StatusCode::GATEWAY_TIMEOUT,       // 504
        }
    }
}

#[get("/")] // 定义一个路由
async fn index() -> Result<&'static str, MyError> { // 返回 Result，错误类型是 MyError
    // 模拟一个客户端数据错误
    Err(MyError::BadClientData)
}
```
在这个例子里：
1.  我们定义了一个枚举 `MyError`，包含三种可能的错误。
2.  我们为 `MyError` 实现了 `ResponseError`。
3.  我们重写了 `status_code()` 方法，根据 `MyError` 的具体变体（InternalError, BadClientData, Timeout）返回不同的 `StatusCode`。
4.  我们重写了 `error_response()` 方法，用 `status_code()` 得到的 `StatusCode` 构建响应，设置了 `Content-Type`，并把错误的 `Display` 信息（比如 "请求数据有问题"）作为响应体返回。

现在访问 `index` 路由，因为返回的是 `Err(MyError::BadClientData)`，所以 Actix Web 会调用我们写的 `status_code()` 得到 400，调用 `error_response()` 生成一个状态码为 400、内容为 "请求数据有问题" 的 HTTP 响应。

**错误辅助函数 (Error Helpers)**

有时候，你可能有一个错误类型，它本身没有实现 `ResponseError`，或者你想临时把它包装成一个特定 HTTP 状态码的错误。Actix Web 提供了一些方便的函数来做这件事，通常配合 `Result` 的 `map_err` 方法使用。

`map_err` 的作用是：如果 `Result` 是 `Ok`，它什么也不做；如果 `Result` 是 `Err(原始错误)`，它会调用你给的函数，把 `原始错误` 作为输入，让你返回一个 `新错误`。

```rust
use actix_web::{error, get, App, HttpServer, Result as ActixResult}; // 这里 Result 是 actix_web::Result

#[derive(Debug)] // 这个错误类型很简单，没有实现 Display, Error, ResponseError
struct MySimpleError {
    name: &'static str,
}

#[get("/")]
async fn index() -> ActixResult<String> { // 返回 Actix 的 Result，成功是 String
    // 假设有个操作返回了我们那个简单的 MySimpleError
    let result: Result<String, MySimpleError> = Err(MySimpleError { name: "一些内部问题" });

    // 使用 map_err 转换错误
    result.map_err(|err| {
        // 当 result 是 Err(MySimpleError) 时，这个闭包会被调用
        // err 就是那个 MySimpleError { name: "一些内部问题" }
        // 我们用 error::ErrorBadRequest() 这个辅助函数，
        // 把 MySimpleError 里的信息包装成一个 400 Bad Request 错误。
        error::ErrorBadRequest(err.name) // 这个函数会创建一个实现了 ResponseError 的错误类型
    })
    // map_err 返回的仍然是一个 Result, 但错误类型变成了 Actix Web 能理解的错误 (会生成 400 响应)
}
```
这里，`MySimpleError` 本身不能直接被 Actix Web 处理。但是通过 `map_err` 和 `error::ErrorBadRequest(err.name)`，我们把 `MySimpleError` 转换成了一个 Actix Web 内置的、表示 400 错误的类型。这样，如果 `result` 是 `Err`，最终会返回一个 400 响应给客户端，响应体通常就是我们传给 `ErrorBadRequest` 的字符串 "一些内部问题"。

Actix Web 在 `actix_web::error` 模块里提供了很多类似的辅助函数，比如 `ErrorNotFound` (404), `ErrorInternalServerError` (500) 等等。

**错误日志 (Error Logging)**

Actix Web 会自动记录错误日志。
*   默认情况下，它会以 `WARN` 级别记录所有实现了 `ResponseError` 的错误。
*   如果你把日志级别设为 `DEBUG` (通过 `RUST_LOG=actix_web=debug` 环境变量)，并且启用了 `RUST_BACKTRACE=1` 环境变量，它还会记录错误的堆栈跟踪信息（backtrace），帮助你定位问题。

你可以使用像 `env_logger` 这样的库来初始化日志系统，并使用 `actix_web::middleware::Logger` 中间件来记录每个请求的信息（包括成功和失败的）。

```rust
// 依赖需要在 Cargo.toml 中添加:
// env_logger = "0.8" (或者更新版本)
// log = "0.4" (或者更新版本)

use actix_web::{error, get, middleware::Logger, App, HttpServer, Result};
use derive_more::derive::{Display, Error};
use log::info; // 引入日志宏

#[derive(Debug, Display, Error)]
#[display("我的错误: {name}")]
pub struct MyError { // 和之前的例子一样
    name: &'static str,
}

impl error::ResponseError for MyError {} // 使用默认 500 响应

#[get("/")]
async fn index() -> Result<&'static str, MyError> {
    let err = MyError { name: "测试错误" };
    info!("准备返回一个错误: {}", err); // 使用 log::info! 手动记录一条信息日志
    Err(err) // 返回错误
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 设置环境变量来配置日志
    std::env::set_var("RUST_LOG", "info"); // 设置日志级别为 info (能看到 info, warn, error)
    std::env::set_var("RUST_BACKTRACE", "1"); // 开启 backtrace 记录 (对 debug 级别更有效)
    env_logger::init(); // 初始化日志系统

    HttpServer::new(|| {
        let logger = Logger::default(); // 创建一个默认的请求日志中间件

        App::new()
            .wrap(logger) // 把日志中间件加到应用上，它会记录请求开始和结束（包括状态码）
            .service(index) // 注册我们的路由处理函数
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```
运行这段代码，当你访问 `/` 时：
1.  `Logger` 中间件会记录请求的开始。
2.  `index` 函数里的 `info!` 会打印 "准备返回一个错误: 我的错误: 测试错误"。
3.  `index` 返回 `Err(MyError)`。
4.  Actix Web 捕获这个错误，因为它实现了 `ResponseError` (虽然是默认的)，会生成 500 响应。
5.  Actix Web 内部会以 `WARN` 级别记录这个错误（因为默认实现是 500）。
6.  `Logger` 中间件会记录请求的结束，包括状态码 500 和处理时间。

**最佳实践：区分用户错误和内部错误**

一个好的实践是把错误分成两类：
1.  **用户可见错误 (User-Facing Errors):** 这类错误是设计好要展示给用户的，比如输入验证失败。它们的错误信息应该是用户能理解的。
2.  **内部错误 (Internal Errors):** 这类错误是服务器内部发生的意外，比如数据库连接失败、代码 bug 等。它们的详细信息不应该直接暴露给用户（可能有安全风险，或者用户看不懂），通常应该映射成一个通用的错误信息（比如“服务器内部错误，请稍后再试”）。

**例子：用户可见的验证错误**

```rust
use actix_web::{
    error, get,
    http::{header::ContentType, StatusCode},
    App, HttpResponse, HttpServer,
};
use derive_more::derive::{Display, Error};

#[derive(Debug, Display, Error)]
enum UserError {
    #[display("字段验证错误: {field}")] // 这个信息是给用户看的
    ValidationError { field: String },
}

impl error::ResponseError for UserError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::html())
            .body(self.to_string()) // 直接用 Display 信息作为响应体
    }
    fn status_code(&self) -> StatusCode {
        match *self {
            UserError::ValidationError { .. } => StatusCode::BAD_REQUEST, // 验证错误通常是 400
        }
    }
}

// 假设有个处理函数会返回这个错误
async fn process_form(/* ... */) -> Result<&'static str, UserError> {
    let user_input = "invalid_email"; // 假设这是用户输入
    if !user_input.contains('@') { // 简单的验证
        // 返回一个用户可见的错误
        return Err(UserError::ValidationError { field: "email".to_string() });
    }
    Ok("处理成功")
}
```
这里，`UserError::ValidationError` 的信息 `"字段验证错误: email"` 是设计好给用户看的，所以直接在 `error_response` 里返回是合适的。

**例子：隐藏内部错误细节**

```rust
use actix_web::{
    error::{self, ResponseError}, // 引入 ResponseError
    get,
    http::{header::ContentType, StatusCode},
    App, HttpResponse, HttpServer, Result as ActixResult, // 用 Actix 的 Result
};
use derive_more::derive::{Display, Error};

// 假设这是一个内部操作可能产生的错误，细节不给用户看
#[derive(Debug, Error)] // 这里简单点，只实现 Debug 和 Error
struct InternalDbError;
impl std::fmt::Display for InternalDbError { // 手动实现 Display
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "数据库连接超时或其他内部问题") // 这个是内部日志可能看到的
    }
}

// 定义一个专门给用户看的通用内部错误
#[derive(Debug, Display, Error)]
enum UserFacingError {
    #[display("发生了内部错误。请稍后再试。")] // 这个是给用户看的信息
    InternalError,
    // 这里可以加其他用户可见错误，比如上面的 ValidationError
}

// 为用户可见错误实现 ResponseError
impl ResponseError for UserFacingError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::html())
            .body(self.to_string()) // 返回通用的、用户友好的信息
    }

    fn status_code(&self) -> StatusCode {
        match *self {
            UserFacingError::InternalError => StatusCode::INTERNAL_SERVER_ERROR, // 500
        }
    }
}

// 模拟一个会产生内部错误的操作
fn do_thing_that_fails() -> Result<(), InternalDbError> {
    // 假设这里连接数据库失败了
    Err(InternalDbError)
}

#[get("/")]
async fn index() -> ActixResult<&'static str, UserFacingError> { // 注意 Result 的错误类型是 UserFacingError
    // 调用可能失败的操作
    do_thing_that_fails()
        // 关键：使用 map_err 把内部的 InternalDbError 转换成用户可见的 UserFacingError::InternalError
        .map_err(|_e| {
            // _e 是那个 InternalDbError，我们忽略它的细节
            // 直接返回通用的用户可见内部错误
            // 可以在这里加 log::error!("内部错误发生: {:?}", _e); 来记录详细日志
            UserFacingError::InternalError
        })?; // 如果 map_err 产生了 Err(UserFacingError::InternalError)，? 会提前返回它

    // 如果 do_thing_that_fails() 成功了，这里会执行
    Ok("成功!")
}
```
在这个例子里：
1.  `InternalDbError` 代表一个内部错误，它的 `Display` 信息可能包含敏感或技术性的细节。
2.  `UserFacingError::InternalError` 是一个通用的、用户友好的错误类型。
3.  在 `index` 函数中，当 `do_thing_that_fails()` 返回 `Err(InternalDbError)` 时，我们使用 `map_err` 把它转换成 `UserFacingError::InternalError`。
4.  这样，Actix Web 只会看到 `UserFacingError`，并根据它的 `ResponseError` 实现（返回 500 状态码和"发生了内部错误。请稍后再试。"的消息）来响应用户。
5.  而 `InternalDbError` 的具体细节（比如 "数据库连接超时或其他内部问题"）不会暴露给用户，但我们可以在 `map_err` 的闭包里用 `log::error!` 把它记录到服务器日志中，方便开发者排查。

**总结一下：**

Actix Web 的错误处理机制核心是 `ResponseError` trait。
*   你可以让你的错误类型实现这个 trait，来自定义错误对应的 HTTP 响应（状态码、内容）。
*   Actix Web 自动处理实现了 `ResponseError` 的错误，以及一些它认识的标准库错误（如 `io::Error`）。
*   你可以使用 `derive_more` 简化自定义错误类型的编写。
*   可以使用 `error::ErrorXXX` 辅助函数和 `map_err` 快速将任意错误转换为标准的 HTTP 错误响应。
*   通过日志记录（`env_logger`, `middleware::Logger`）来跟踪发生的错误。
*   推荐区分用户可见错误和内部错误，只向用户展示友好的、安全的信息，同时在服务器端记录详细的内部错误日志。
