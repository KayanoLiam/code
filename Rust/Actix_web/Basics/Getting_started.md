**第一步：安装 Rust**

*   **原文意思：** 如果你电脑上还没装 Rust 语言，推荐用 `rustup` 这个工具来装。官方有个很好的入门指南。Actix Web 这个框架要求你的 Rust 版本至少是 1.72。运行 `rustup update` 可以帮你更新到最新版。
*   **大白话解释：**
    *   想用 Actix Web 写东西，你电脑上得先装好 Rust 语言。
    *   如果你还没装，官方推荐用一个叫 `rustup` 的小工具来安装和管理 Rust。跟着官方指南走就行。（搜 "Install Rust" 就能找到）
    *   Actix Web 对 Rust 版本有要求，最低得是 1.72 版。你可以随时在命令行（终端）里敲 `rustup update` 这个命令，它会帮你把 Rust 更新到最新，保证能用 Actix Web。

**第二步：创建第一个 "Hello, world!" 项目**

*   **原文意思：** 用 Cargo 创建一个新的二进制项目，然后进入那个目录。
*   **大白话解释：**
    *   Rust 自带一个叫 Cargo 的工具，用来管理项目、编译代码、下载依赖库等等，非常好用。
    *   咱先用 Cargo 创建一个新项目。打开你的命令行（终端），敲下面两个命令：

    ```bash
    # 1. 创建一个叫 hello-world 的新项目文件夹
    cargo new hello-world

    # 2. 进入这个刚创建的文件夹
    cd hello-world
    ```
    *   现在你就在你的第一个 Rust Web 项目的目录里了。

**第三步：添加 Actix Web 依赖**

*   **原文意思：** 在 `Cargo.toml` 文件里把 `actix-web` 添加为项目的依赖。
*   **大白话解释：**
    *   我们要告诉项目：“嘿，我要用 `actix-web` 这个框架来写网页服务！”
    *   怎么告诉它呢？需要修改项目文件夹里的 `Cargo.toml` 文件。这个文件相当于项目的“说明书”，里面记录了项目名字、版本、作者，还有最重要的——它依赖哪些外部的代码库（就像 Python 的 `requirements.txt` 或 Node.js 的 `package.json`）。
    *   打开 `Cargo.toml` 文件，找到 `[dependencies]` 这一部分，在下面加上一行：

    ```toml
    [dependencies]
    # 就加下面这行，告诉 Cargo 我们需要 actix-web 版本 4
    actix-web = "4"
    ```
    *   加上这行之后，下次你编译或运行项目时，Cargo 就会自动去下载 `actix-web` 这个库了。

**第四步：编写请求处理函数**

*   **原文意思：** 请求处理器是 `async` 异步函数，可以接受参数（从请求中提取），并返回能转换成 `HttpResponse`（HTTP 响应）的类型。
*   **大白话解释：**
    *   当用户访问你的网站某个地址（比如 `/` 首页，或者 `/about` 关于页面）时，服务器需要知道该干什么。负责处理这些访问的，就是“请求处理器”函数。
    *   在 Actix Web 里，这些函数通常是 `async`（异步）的，这意味着它们能处理耗时操作（比如读数据库）而不会阻塞整个服务器。
    *   这些函数可以接收用户请求带来的数据（比如 URL 里的参数、POST 过来的表单内容），最后它们必须返回一个“响应”给用户的浏览器（比如一段 HTML 文字、一个 JSON 数据或者就是简单的“OK”）。
*   **代码实战：**
    *   现在打开项目里的 `src/main.rs` 文件，这是你 Rust 程序的主要代码文件。
    *   把里面的内容**全部删掉**，换成下面的代码：

    ```rust
    // 1. 引入 actix-web 库里我们需要用到的东西
    use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};

    // 2. 定义第一个请求处理器：处理对根路径 ("/") 的 GET 请求
    // #[get("/")] 是个方便的宏，直接把这个函数绑定到 GET / 请求上
    #[get("/")]
    async fn hello() -> impl Responder {
        // 当有人访问 "/" 时，就执行这个函数
        // 返回一个 HTTP 200 OK 状态，并且响应体是 "Hello world!" 字符串
        HttpResponse::Ok().body("Hello world!")
    }

    // 3. 定义第二个请求处理器：处理对 "/echo" 路径的 POST 请求
    // #[post("/echo")] 宏把这个函数绑定到 POST /echo 请求上
    #[post("/echo")]
    async fn echo(req_body: String) -> impl Responder {
        // 这个函数接收一个 String 类型的参数 req_body
        // Actix Web 会自动把 POST 请求的请求体内容解析成字符串传进来
        // 返回一个 HTTP 200 OK 状态，响应体就是收到的那个字符串原样返回
        HttpResponse::Ok().body(req_body)
    }

    // 4. 定义第三个请求处理器：这个函数没有用上面的宏
    // 我们待会儿会手动把它注册到路由上
    async fn manual_hello() -> impl Responder {
        // 返回一个 HTTP 200 OK 状态，响应体是 "Hey there!"
        HttpResponse::Ok().body("Hey there!")
    }

    // 注意： 到这里我们只定义了处理请求的函数，还没启动服务器呢！
    ```
    *   **解释一下:**
        *   `use ...` 是导入需要用的库。
        *   `async fn ...` 定义异步函数。
        *   `-> impl Responder` 表示这个函数返回一个实现了 `Responder` 特征（可以被转换成 HTTP 响应）的东西。`HttpResponse::Ok().body(...)` 就是创建一个成功的响应。
        *   `#[get("/")]` 和 `#[post("/echo")]` 是一种叫“宏”的 Rust 特性，这里是 Actix Web 提供的快捷方式，用来声明这个函数处理哪个 URL 路径和哪种 HTTP 方法（GET 或 POST）。`manual_hello` 函数没用宏，后面我们会看到怎么处理。

**第五步：创建应用实例，注册处理器，启动服务器**

*   **原文意思：** 创建 `App` 实例，用 `App::service` 注册带宏的处理器，用 `App::route` 注册手动路由的处理器。最后在 `HttpServer` 里启动这个应用。
*   **大白话解释：**
    *   光有处理函数还不行，我们得把它们“组装”起来，告诉服务器：“当收到这样的请求时，请调用那个函数”。
    *   这个“组装”工作由 `App` 对象负责。
    *   然后，我们需要一个真正的 HTTP 服务器（`HttpServer`）来监听网络端口，接收用户的请求，并把请求交给我们的 `App` 来处理。
*   **代码实战：**
    *   继续在 `src/main.rs` 文件里，把下面的 `main` 函数**追加**到刚才那些代码的**后面**：

    ```rust
    // 5. 定义主函数 main，这是程序的入口点
    #[actix_web::main] // 这也是一个 Actix Web 提供的宏，简化异步 main 函数的启动
    async fn main() -> std::io::Result<()> {
        // 打印一条消息，方便我们知道服务器启动了
        println!("🚀 服务启动于 http://127.0.0.1:8080");

        // 创建并配置 HTTP 服务器
        HttpServer::new(|| {
            // HttpServer::new 需要一个“工厂函数”作为参数
            // 这个函数每次需要时会创建一个 App 实例
            App::new() // 创建一个新的 App 实例
                .service(hello) // 注册 hello 函数 (因为它用了 #[get(...)] 宏)
                .service(echo)  // 注册 echo 函数 (因为它用了 #[post(...)] 宏)
                .route("/hey", web::get().to(manual_hello)) // 手动注册路由
                                                            // 当收到对 "/hey" 路径的 GET 请求时...
                                                            // ...调用 manual_hello 函数
        })
        .bind(("127.0.0.1", 8080))? // 把服务器绑定到 IP 地址 127.0.0.1 的 8080 端口
                                    // .bind() 可能失败 (比如端口被占用)，所以返回 Result，用 ? 处理错误
        .run()                       // 正式启动服务器！
        .await                       // 因为 main 是 async 函数，我们需要 .await 来等待服务器运行
                                    // (服务器会一直运行，直到你手动停止它，比如按 Ctrl+C)
    }
    ```
    *   **解释一下:**
        *   `#[actix_web::main]` 是个方便的宏，帮你处理了启动异步代码所需的底层设置。
        *   `HttpServer::new(...)` 创建服务器。它需要一个闭包（`|| { ... }`）作为参数，这个闭包返回一个配置好的 `App` 实例。
        *   `App::new()` 创建应用。
        *   `.service(hello)` 和 `.service(echo)` 用来注册那些使用了路由宏（`#[get]`, `#[post]` 等）的函数。Actix Web 会自动从宏里读取路径和方法信息。
        *   `.route("/hey", web::get().to(manual_hello))` 是手动注册路由的方式。这里我们明确指定了：路径是 `/hey`，HTTP 方法是 GET (`web::get()`)，处理函数是 `manual_hello`。
        *   `.bind(("127.0.0.1", 8080))`? 告诉服务器监听哪个网络地址和端口。`127.0.0.1` 是本机地址，`8080` 是端口号。
        *   `.run().await` 启动服务器并开始等待请求。

**第六步：运行你的 Web 服务**

*   **原文意思：** 用 `cargo run` 编译并运行程序。`#[actix_web::main]` 宏会在 Actix 运行时中执行异步 `main` 函数。然后就可以访问 `http://127.0.0.1:8080/` 等定义的路由了。
*   **大白话解释：**
    *   齐活了！现在回到你的命令行（确保你还在 `hello-world` 目录下），运行下面的命令：

    ```bash
    cargo run
    ```
    *   Cargo 会先检查 `Cargo.toml`，下载 `actix-web`（如果还没下载的话），然后编译你的 `src/main.rs` 代码，最后运行生成的可执行文件。
    *   如果一切顺利，你应该会看到终端输出了我们写的那句：`🚀 服务启动于 http://127.0.0.1:8080`
    *   现在，打开你的网页浏览器，试试访问：
        *   `http://127.0.0.1:8080/`  (应该会看到 "Hello world!")
        *   `http://127.0.0.1:8080/hey` (应该会看到 "Hey there!")
    *   对于 `/echo` 那个 POST 请求，浏览器直接访问通常发的是 GET 请求，所以不行。你可以用 `curl` 这样的命令行工具来测试：
        ```bash
        # 在另一个命令行窗口运行:
        # -X POST 指定用 POST 方法
        # -d "some data" 把 "some data" 作为请求体发送
        curl -X POST -d "some data" http://127.0.0.1:8080/echo
        ```
        这个命令应该会返回 `some data`。

**总结一下：**

我们用 Rust 和 Actix Web 完成了：
1.  **安装 Rust 环境** (用 `rustup`)。
2.  **创建了一个新项目** (用 `cargo new`)。
3.  **添加了 `actix-web` 依赖** (修改 `Cargo.toml`)。
4.  **写了几个处理函数** (`hello`, `echo`, `manual_hello`) 来响应不同的请求。
5.  **配置并启动了一个 HTTP 服务器**，把这些函数注册到对应的 URL 路径和方法上。
6.  **运行了服务** (用 `cargo run`) 并通过浏览器或 `curl` 进行了访问。