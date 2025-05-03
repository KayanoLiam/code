# HTTP/2 和 TLS (HTTPS)
怎么让你的 Actix Web 应用更牛、更快、更安全，涉及到 **HTTP/2** 和 **TLS (HTTPS)**。

**为啥要关心这个？**

*   **HTTP/2:** 这是 HTTP 协议的新版本，比老的 HTTP/1.1 效率高很多。主要好处是**速度快**！它可以用一个网络连接同时处理多个请求和响应（多路复用），还能压缩请求头，减少传输的数据量。对用户来说，就是网页加载更快，体验更好。
*   **TLS (HTTPS):** 就是你网址栏里看到的那个小锁图标。它给你的网站通信加上了**加密**和**认证**。
    *   **加密：** 防止中间有人偷听你和服务器之间传输的数据（比如密码、信用卡号）。
    *   **认证：** 确认你连接的确实是你想访问的那个服务器，而不是一个假冒的。
    *   现在，HTTPS 基本上是网站标配了，不仅安全，很多新功能（包括 HTTP/2 在大多数浏览器上的实现）也需要 HTTPS。

**Actix Web 的好消息：自动升级 HTTP/2**

Actix Web 设计得挺智能：**如果你正确地配置了 TLS (HTTPS)，它会自动尝试和支持 HTTP/2 的客户端（比如现代浏览器）协商，尽可能使用 HTTP/2 协议进行通信。** 你通常不需要为启用 HTTP/2 做额外的专门配置，把 TLS 开起来就行！

**关键任务：启用 TLS (HTTPS)**

所以，让 Actix Web 用上 HTTP/2 的关键，实际上是**如何启用 TLS**。要启用 TLS，你需要做几件事：

1.  **获取 TLS 证书和私钥:**
    *   **证书 (`cert.pem`)**: 相当于服务器的身份证，用来向客户端证明“我是谁”。
    *   **私钥 (`key.pem`)**: 服务器自己保管的秘密钥匙，用来解密客户端发来的信息和对信息签名。**这个文件绝对不能泄露！**
    *   **怎么获取？**
        *   **生产环境:** 你需要从受信任的证书颁发机构 (CA) 获取，比如 Let's Encrypt (免费) 或者其他商业 CA。
        *   **测试/开发环境:** 你可以自己生成一个“自签名”证书。浏览器会警告说这个证书不受信任，但用于本地开发测试足够了。文档里就提供了生成自签名证书的 `openssl` 命令：
          ```bash
          openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365 -subj '/CN=localhost'
          ```
          (需要你系统安装了 `openssl` 工具)。这会在当前目录下生成 `key.pem` 和 `cert.pem` 文件。

2.  **选择 TLS 实现库并启用 Actix Web 功能:**
    *   Actix Web 支持两种流行的 Rust TLS 库：`rustls` 和 `openssl`。你需要选一个。`rustls` 是纯 Rust 实现，通常更受欢迎。
    *   在你的 `Cargo.toml` 文件里，给 `actix-web` 依赖启用对应的 feature。比如用 `rustls` (版本 0.23)：
      ```toml
      [dependencies]
      actix-web = { version = "4", features = ["rustls-0_23"] }
      # 你还需要 rustls 和 rustls-pemfile 库来加载证书
      rustls = "0.23"
      rustls-pemfile = "2"
      # 如果用 openssl，则是 features = ["openssl"]，并需要 openssl 库和系统安装 openssl 开发库
      ```

3.  **在代码里加载证书和私钥，并配置 TLS:**
    *   使用你选择的库（这里以 `rustls` 为例）读取 `.pem` 文件。
    *   创建一个 TLS 配置对象 (`rustls::ServerConfig`)。

4.  **绑定服务器时使用 TLS 方法:**
    *   **最关键的一步：** 把原来启动服务器的 `.bind(("127.0.0.1", 8080))` 换成 `.bind_rustls_0_23(("127.0.0.1", 8443), tls_config)` (如果是 `openssl` 库，则是 `.bind_openssl(...)`)。
    *   注意端口号通常用 `8443` 或 `443` (HTTPS 默认端口)，而不是 `8080` (HTTP 默认端口)。
    *   把上一步创建的 `tls_config` 传进去。

**看代码解释 (`rustls` 示例)**

```rust
use actix_web::{web, App, HttpRequest, HttpServer, Responder};
use std::{fs::File, io::BufReader}; // 用于读取文件

// 引入 rustls 和 pemfile 相关库
use rustls::ServerConfig;
use rustls_pemfile::{certs, pkcs8_private_keys};
use rustls::pki_types::PrivateKeyDer;


async fn index(_req: HttpRequest) -> impl Responder {
    "你好，安全的世界！(Hello TLS World!)" // 返回简单的响应
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // --- 这部分是 TLS 配置 ---

    // （可选）如果使用基于 aws-lc-rs 的加密提供程序
    // rustls::crypto::aws_lc_rs::default_provider()
    //     .install_default()
    //     .unwrap();

    // 1. 加载证书和私钥文件 (确保 cert.pem 和 key.pem 在运行目录下)
    let cert_file = File::open("cert.pem").expect("找不到 cert.pem 文件");
    let key_file = File::open("key.pem").expect("找不到 key.pem 文件");
    let mut cert_reader = BufReader::new(cert_file);
    let mut key_reader = BufReader::new(key_file);

    // 使用 rustls_pemfile 解析证书
    let tls_certs = certs(&mut cert_reader)
        .collect::<Result<Vec<_>, _>>()
        .expect("无法解析证书文件");

    // 使用 rustls_pemfile 解析私钥 (PKCS#8 格式)
    let tls_key = pkcs8_private_keys(&mut key_reader)
        .next() // 通常只有一个 key
        .expect("在 key.pem 中没找到私钥")
        .expect("无法解析私钥文件");

    // 2. 创建 rustls 服务器配置
    let tls_config = ServerConfig::builder()
        // .with_safe_defaults() // 使用推荐的安全默认设置 (或者下面的方式)
        .with_no_client_auth() // 不要求客户端提供证书进行验证
        // 加载我们的证书链和私钥
        .with_single_cert(tls_certs, PrivateKeyDer::Pkcs8(tls_key))
        .expect("无法创建 TLS 配置");

    // --- 这部分和普通 Actix Web 应用一样 ---
    println!("服务器启动在 https://127.0.0.1:8443");

    HttpServer::new(|| {
        App::new().route("/", web::get().to(index)) // 路由和 Handler 的定义不变
    })
    // 3. 关键：使用 bind_rustls_0_23 绑定地址和 TLS 配置
    .bind_rustls_0_23(("127.0.0.1", 8443), tls_config)? // 注意端口和方法名
    .run()
    .await
}

```

**启动这个服务器后：**

*   你需要在浏览器里访问 `https://127.0.0.1:8443` (注意是 `https`)。
*   如果用的是自签名证书，浏览器会弹出安全警告，你需要手动选择“继续前往”。
*   在浏览器的开发者工具的网络(Network)标签页里，你可以看到协议(Protocol)栏通常会显示 `h2` 或 `HTTP/2`，表示 Actix Web 已经成功协商并使用了 HTTP/2！

**一点技术细节 (可以跳过)**

文档提到：
*   `RFC 7540 §3.2` 的升级方式不支持：这是指通过在**非加密**的 HTTP/1.1 请求中发送 `Upgrade: h2c` 头部来升级到 HTTP/2 的方式。`HttpServer` 这个高级接口不支持这种方式。
*   `RFC 7540 §3.4` 的“先验知识”启动支持：这是指客户端在连接时就已经知道服务器支持 HTTP/2 的情况。
    *   对于 TLS 连接，这通常通过 ALPN (应用层协议协商) 扩展在 TLS 握手时完成。客户端说“我支持 h2 和 http/1.1”，服务器（配置了 TLS 的 Actix Web）看到后会回应“好的，我们用 h2”。这就是为什么 `.bind_rustls_...()` 能自动启用 H2。
    *   对于非加密连接，需要客户端直接发送 HTTP/2 的帧（这需要更底层的设置，`HttpServer` 不直接支持）。

**总结一下：**

1.  **目标：** 让 Actix Web 应用支持更快、更安全的 HTTP/2 和 HTTPS。
2.  **关键：** 配置好 TLS (HTTPS)。
3.  **步骤：**
    *   获取证书 (`cert.pem`) 和私钥 (`key.pem`)。
    *   在 `Cargo.toml` 启用 TLS 功能 (`rustls` 或 `openssl`)。
    *   在代码中加载证书/私钥，创建 `TlsConfig`。
    *   用 `.bind_rustls_...()` 或 `.bind_openssl_...()` 替换 `.bind()` 来启动服务器。
4.  **效果：** 只要 TLS 配置正确，Actix Web 会自动和支持的客户端协商使用 HTTP/2。

这样你的 Actix Web 应用就能跟上现代网络协议的步伐了！