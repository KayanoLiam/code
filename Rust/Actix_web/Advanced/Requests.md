# 请求体 (Request Body) 和数据处理
Actix Web 怎么处理别人发送过来的数据，特别是放在请求体 (Request Body) 里的数据。

想象一下，用户在网页上填了个表单提交，或者一个手机 App 发送了一些结构化数据给你的服务器，这些数据就放在请求的“肚子”里（也就是 Body）。Actix Web 需要能把这些数据读出来，并转换成你 Rust 代码里能用的格式。

**最常见的：处理 JSON 数据**

现在程序之间交流，JSON 是最常用的格式之一，就像普通话一样。比如 App 发送用户信息给服务器，很可能就是 JSON 格式：`{"username": "张三", "age": 30}`。

Actix Web 处理 JSON 主要有两种方法：

**方法一：使用 `web::Json<T>` 提取器 (Extractor) - 推荐，最省事！**

这就像给 Actix Web 配备了一个“JSON 自动翻译机”。

1.  **定义一个 Rust 结构体 (Struct)**，它的字段要和你期望接收的 JSON 结构一模一样。
2.  **给结构体加上 `#[derive(Deserialize)]`**。这是告诉 `serde` 库（Actix Web 用它来处理序列化和反序列化）：“嘿，你知道怎么把 JSON 文本转换成这个结构体的实例”。
3.  **在你的处理函数 (Handler) 的参数里写上 `web::Json<你的结构体类型>`**。

看代码：

```rust
// 别忘了在 Cargo.toml 里加上依赖:
// serde = { version = "1.0", features = ["derive"] }
// serde_json = "1.0" (虽然 Json 提取器内部用，但最好显式加上)

use actix_web::{web, App, HttpServer, Result};
use serde::Deserialize; // 引入 Deserialize

// 1. 定义一个结构体，字段名和类型要匹配 JSON
#[derive(Deserialize)] // 2. 加上这个宏！
struct UserInfo {
    username: String,
    // 你可以加更多字段，比如 age: u32,
}

// 3. 在处理函数的参数里使用 web::Json<UserInfo>
async fn receive_user_info(info: web::Json<UserInfo>) -> Result<String> {
    // 如果代码能执行到这里，说明 Actix Web 已经帮你做好了：
    // a. 检查请求的 Content-Type是不是 application/json
    // b. 读取请求体里的数据
    // c. 尝试把 JSON 数据解析成 UserInfo 结构体
    // d. 如果以上任何一步失败 (比如格式不对，类型不匹配)，Actix 会自动返回 400 Bad Request 错误

    // 现在你可以直接用 info 里的数据了，注意 info 是 web::Json<UserInfo> 类型
    // 需要用 .username 访问里面的字段
    Ok(format!("欢迎你, {}!", info.username))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // 创建一个路由，只接受 POST 请求，并交给 receive_user_info 处理
            .route("/users", web::post().to(receive_user_info))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

用 `curl` 测试一下 (确保你的 Actix 服务正在运行):

```bash
curl -X POST http://127.0.0.1:8080/users \
     -H "Content-Type: application/json" \
     -d '{"username": "李四"}'
```

服务器应该会返回: `欢迎你, 李四!`

如果你发送的 JSON 不对，比如字段名写错了 `{"usernam": "王五"}`，或者类型不对 `{"username": 123}`，或者 `Content-Type` 不对，Actix 会自动帮你拒绝，返回 400 错误。

**小技巧:** 如果你不确定收到的 JSON 具体结构是啥，或者想接收任意有效的 JSON，可以用 `serde_json::Value` 作为类型：`web::Json<serde_json::Value>`。

**方法二：手动加载和反序列化 - 更灵活，但也更麻烦**

有时候你可能想在反序列化之前对原始数据做些操作，或者需要更精细地控制内存使用（比如限制请求体大小）。这时可以手动处理。

1.  处理函数的参数接收 `web::Payload`。`Payload` 是一个数据流 (Stream)，表示请求体里的原始字节数据，可能是一块块过来的。
2.  你需要循环读取这个流，把数据块拼起来。
3.  **非常重要：** 在拼接过程中，一定要检查累计的数据大小，防止有人发送超大请求耗尽你的服务器内存。
4.  数据读完后，你得到一个完整的字节数组 (`Bytes` 或 `BytesMut`)。
5.  使用 `serde_json::from_slice` 手动把字节数组反序列化成你的结构体。

看代码：

```rust
use actix_web::{error, post, web, App, Error, HttpResponse, HttpServer};
use futures::StreamExt; // 需要 futures 依赖
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)] // 这里也需要 Deserialize，Serialize 是为了方便后面发回响应
struct MyObj {
    name: String,
    number: i32,
}

const MAX_SIZE: usize = 262_144; // 限制最大接收 256KB

#[post("/manual_json")] // 用 post 宏简化路由注册
async fn index_manual(mut payload: web::Payload) -> Result<HttpResponse, Error> { // 参数是 Payload
    // payload 是一个字节流 (stream of Bytes objects)
    let mut body = web::BytesMut::new(); // 创建一个可变的字节缓冲区

    // 2. 循环读取数据块
    while let Some(chunk_result) = payload.next().await {
        let chunk = chunk_result?; // 处理读取过程中可能发生的错误
        // 3. 检查累计大小，防止内存溢出攻击
        if (body.len() + chunk.len()) > MAX_SIZE {
            // 如果超了，返回一个 Bad Request 错误
            return Err(error::ErrorBadRequest("请求体太大了"));
        }
        // 把读到的数据块追加到缓冲区
        body.extend_from_slice(&chunk);
    }

    // 4. 所有数据都读完了，现在 body 里是完整的请求体字节

    // 5. 手动进行 JSON 反序列化
    let obj = serde_json::from_slice::<MyObj>(&body)?; // `?` 会在反序列化失败时自动转成 InternalServerError
                                                      // 你可能想更精细地处理，比如返回 BadRequest

    // 成功了！把解析出来的对象再转成 JSON 发回去 (作为示例)
    Ok(HttpResponse::Ok().json(obj)) // .json() 会自动设置 Content-Type 并序列化 obj
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(index_manual)) // 使用 .service 注册 #[post(...)] 宏标记的函数
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
```

这种方式给了你更多控制权，但也需要你自己处理更多细节和错误情况。

**自动解压缩 (Content Encoding)**

如果客户端（比如浏览器）发送数据时压缩了数据（就像发快递前把东西打包压缩），它会在请求头里加一个 `Content-Encoding` 来说明用了哪种压缩方法（比如 `gzip`, `br` (Brotli), `deflate`）。

好消息是：**Actix Web 自动帮你处理这个！** 它会检查 `Content-Encoding` 头，如果发现是它支持的压缩格式，就会自动解压缩请求体。你的处理函数拿到的 `web::Json` 或者 `web::Payload` 都已经是解压后的原始数据了。你基本不用操心这事。

**注意：** Actix Web 目前不支持同时用多种压缩编码（比如 `Content-Encoding: br, gzip`）。

**分块传输编码 (Chunked Transfer Encoding)**

有时候发送方在开始发送数据时，不知道数据总共有多大（比如实时生成的数据流）。这时它会用“分块传输编码”，把数据一块一块发过来，最后发一个结束标记。

同样好消息：**Actix Web 自动帮你处理分块！** 你拿到的 `web::Payload` 流已经是解码、拼接好的数据了，你不需要关心底层的分块细节。

**处理文件上传等 (Multipart Body)**

当你需要在一个请求里同时发送普通表单数据和文件时（比如用户上传头像，同时填写昵称），通常使用 `multipart/form-data` 格式。

处理这种格式稍微复杂点，Actix Web 把这个功能放到了一个**单独的库 `actix-multipart`** 里。你需要添加这个依赖，并按照它的文档来处理 multipart 数据流。这里就不展开了，知道有这个专门的库就行。

**处理网页表单数据 (Urlencoded Body)**

这是传统 HTML `<form>` 提交时最常见的格式（如果没指定 `enctype="multipart/form-data"`）。数据格式是 `key1=value1&key2=value2` 这种。

Actix Web 提供了 `web::Form<T>` 提取器，用法和 `web::Json<T>` 非常像：

1.  **定义一个 Rust 结构体**，字段名对应表单里的 `name` 属性。
2.  **加上 `#[derive(Deserialize)]`**。
3.  **在处理函数参数里写 `web::Form<你的结构体类型>`**。

看代码：

```rust
use actix_web::{post, web, App, HttpResponse, HttpServer};
use serde::Deserialize;

// 1. 定义结构体，字段名对应表单的 name
#[derive(Deserialize)] // 2. 加上 Deserialize
struct RegistrationForm {
    username: String,
    email: String,
    // age: Option<u32>, // 可以用 Option 处理可选字段
}

// 3. 使用 web::Form<RegistrationForm> 作为参数
#[post("/register")]
async fn handle_registration(form: web::Form<RegistrationForm>) -> HttpResponse {
    // 和 web::Json 类似，Actix 已经帮你做了：
    // a. 检查 Content-Type 是不是 application/x-www-form-urlencoded
    // b. 读取请求体
    // c. 解析 urlencoded 数据到 RegistrationForm 结构体
    // d. 出错自动返回 400 Bad Request

    // 直接使用解析好的数据
    HttpResponse::Ok().body(format!(
        "收到注册信息！用户名: {}, 邮箱: {}",
        form.username, form.email
    ))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(handle_registration))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
```

用 `curl` 测试：

```bash
curl -X POST http://127.0.0.1:8080/register \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=张三&email=zhangsan@example.com"
```

服务器会返回：`收到注册信息！用户名: 张三, 邮箱: zhangsan@example.com`

**直接处理原始数据流 (Streaming Request)**

如果你不想一次性把整个请求体加载到内存（比如处理一个非常大的文件上传，或者想边接收边处理），可以直接操作 `web::Payload` 这个原始数据流。

这其实就是上面“手动处理 JSON”里读取 `payload` 的那部分逻辑。你可以拿到一块块的原始字节 (`Bytes`)，然后按需处理。

```rust
use actix_web::{get, web, Error, HttpResponse, HttpServer};
use futures::StreamExt;

#[get("/stream_data")]
async fn index_stream(mut body: web::Payload) -> Result<HttpResponse, Error> {
    println!("开始接收数据流...");
    let mut received_bytes_count = 0;

    // 循环读取数据块
    while let Some(item_result) = body.next().await {
        let item = item_result?; // 处理读取错误
        println!("收到一个数据块，大小: {} 字节", item.len());
        // 这里你可以对 item (Bytes 类型) 做任何处理
        // 比如写入文件、发送到别处、进行计算等
        received_bytes_count += item.len();
    }

    println!("数据流接收完毕，总共 {} 字节", received_bytes_count);
    Ok(HttpResponse::Ok().body("数据流处理完成"))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(index_stream))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
```

**总结一下处理请求体：**

*   **JSON:** 用 `web::Json<YourStruct>` 最方便，Actix 自动搞定。想完全控制就手动读 `web::Payload` 再用 `serde_json::from_slice`。
*   **Form (Urlencoded):** 用 `web::Form<YourStruct>`，和 `web::Json` 类似。
*   **文件上传 (Multipart):** 用 `actix-multipart` 这个库。
*   **压缩/分块:** Actix 自动处理，你不用管。
*   **处理大文件/流式数据:** 直接操作 `web::Payload`，一块一块处理。
*   **关键依赖:** `serde` (尤其是 `Deserialize`) 是处理结构化数据的基础。

基本上，Actix Web 提供了方便的工具（提取器）来处理常见格式，同时也保留了让你直接操作原始数据流的灵活性。