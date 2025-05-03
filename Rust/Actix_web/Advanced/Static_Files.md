# 静态文件 (Static Files)
聊聊怎么用 Actix Web 向用户提供服务器上的**静态文件 (Static Files)**，比如图片 (jpg, png), 样式表 (css), 脚本 (js), 或者可下载的文件 (pdf, zip) 等。

想象一下你的网站需要显示 logo 图片，或者加载一些 CSS 样式，这些文件都存在你的服务器硬盘上。当浏览器请求这些文件时，Actix Web 需要能找到对应的文件并发给浏览器。

有两种主要方式：

**方式一：提供单个指定的文件 (`NamedFile`)**

这种方式适用于你知道用户请求的 URL 对应服务器上哪个具体的文件。

*   **核心工具:** `actix_files::NamedFile`
*   **怎么用:**
    1.  定义一个路由，通常这个路由会包含一个路径参数来表示用户想要的文件名或路径。
    2.  在处理函数 (Handler) 里，从请求 (`HttpRequest`) 中提取出这个文件名/路径。
    3.  **（非常重要）构建安全的文件路径。** 直接使用 URL 里的路径参数可能有安全风险（后面会细说）。你需要确保最终路径指向你允许访问的文件夹内的文件。
    4.  使用 `NamedFile::open("服务器上的完整文件路径")` 来创建响应对象。如果文件存在且可读，它会准备好发送文件。
    5.  返回 `Ok(named_file)`。`NamedFile` 会自动处理很多细节，比如设置正确的 `Content-Type` (根据文件扩展名判断是图片、CSS 还是其他)，以及处理缓存相关的 HTTP 头部。

看个例子（**注意：这个例子有安全隐患，仅作演示**）：

```rust
use actix_files::NamedFile;
use actix_web::{web, App, HttpRequest, HttpServer, Result}; // Result 是 actix_web::Result
use std::path::PathBuf;

// 处理函数：根据 URL 中的 filename 参数打开文件
async fn serve_file(req: HttpRequest) -> Result<NamedFile> {
    // 1. 从 URL 路径参数中获取 "filename"
    // 比如 URL 是 /files/images/logo.png，路由是 /{filename:.*}，
    // 那么 filename 就是 "files/images/logo.png"
    let filename: String = req.match_info().query("filename").parse().unwrap();

    // 2. **危险操作警告！** 直接将用户输入的部分拼接到路径中
    // 这意味着如果用户访问 /../../etc/passwd，这里会尝试打开那个敏感文件！
    // 在实际应用中，绝不能这样做！你需要将 filename 和一个安全的根目录结合，
    // 并进行路径清理，防止 "../" 攻击。
    let base_dir = PathBuf::from("./static_files/"); // 假设你的文件都在这个目录下
    let requested_path = base_dir.join(&filename);

    println!("尝试打开文件: {:?}", requested_path); // 打印日志看看

    // 3. 更好的做法是使用专门的库或方法来清理和验证路径，
    //    确保它仍然在 base_dir 内部。
    //    例如，可以使用 path_clean 库，或者检查 `canonicalize()` 后的路径。
    //    为了简化演示，这里直接 open 了（再次强调，这不安全！）。

    // 4. 使用清理和验证后的路径打开 NamedFile
    // let safe_path = sanitize_path(base_dir, filename); // 假设有这么个安全函数
    // Ok(NamedFile::open(safe_path)?)

    // 为了让代码能跑，我们暂时用不安全的方式（实际项目千万别学！）
    // 假设当前目录下有个叫 "example.txt" 的文件
    // 并且你访问 http://127.0.0.1:8080/example.txt
    let path: PathBuf = filename.parse().unwrap(); // 直接用 URL 里的名字
    Ok(NamedFile::open(path)?) // 尝试打开文件
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 确保当前目录下有一个名为 static_files 的文件夹，里面放些文件
    // 或者为了简单，直接在当前目录下放一个 example.txt 文件

    HttpServer::new(|| {
        App::new()
            // 定义路由：匹配根目录 / 后面的所有内容，并将其捕获为 "filename" 参数
            // {filename:.*} 这个模式匹配任意字符，包括 "/"，直到路径结束
            .route("/{filename:.*}", web::get().to(serve_file))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

**严重警告 (Security Warning)!**

上面那个例子里的路由 `/{filename:.*}` 和直接使用 `req.match_info().query("filename")` 来构建文件路径的方式**极其危险**！

攻击者可以通过构造类似 `/../secret_file.txt` 或者 `/images/../../config.yaml` 这样的 URL，尝试访问你的静态文件目录之外的文件（这叫**路径遍历攻击 Path Traversal**）。如果你的服务器进程有权限读取那些文件，它们就会被泄露！

**永远不要**直接信任来自 URL 的路径信息来构造文件系统路径。你必须：
1.  定义一个安全的**根目录 (Base Directory)**，所有要提供的静态文件都必须在这个目录或其子目录下。
2.  将用户请求的路径与这个根目录结合。
3.  **清理和验证**合并后的路径，确保它没有 `..`，并且最终解析的绝对路径仍然在这个安全的根目录之内。

**因为处理路径安全比较复杂，所以对于提供整个目录的文件，Actix 提供了更安全、更方便的方式：`Files` 服务。**

**方式二：提供整个目录的文件 (`Files`)**

这是最常用、也更安全的方式，用来提供一个目录下（包括子目录）的所有静态文件。

*   **核心工具:** `actix_files::Files`
*   **怎么用:**
    1.  创建一个 `Files` 服务实例：`actix_files::Files::new("URL访问前缀", "服务器上的文件夹路径")`
        *   `URL访问前缀`: 用户在浏览器里访问这些文件时，URL 需要以这个前缀开头。比如 `/static`。
        *   `服务器上的文件夹路径`: 这些文件实际存储在服务器硬盘上的哪个文件夹。比如 `"."` (表示当前运行目录)，或者 `"./static_assets"` 等。
    2.  **必须**使用 `App::service()` 来注册这个 `Files` 服务。**不能用 `App::route()`**，因为 `Files` 需要处理前缀下的所有子路径 (比如 `/static/css/`, `/static/images/` 等)，`App::service()` 才支持这种前缀匹配。

看例子：

```rust
use actix_files as fs; // 给 actix_files 取个别名 fs，写起来方便
use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 假设你的可执行文件旁边有一个名为 "static_root" 的文件夹
    // 里面放了 index.html, style.css, images/logo.png 等文件
    // 如果没有，可以手动创建一个
    std::fs::create_dir_all("./static_root/images").ok(); // 尝试创建目录
    std::fs::write("./static_root/index.html", "<h1>Hello from static file!</h1>").ok();
    std::fs::write("./static_root/style.css", "body { color: blue; }").ok();
    std::fs::write("./static_root/images/logo.png", "dummy image data").ok(); // 实际应该放图片

    println!("尝试在 http://127.0.0.1:8080/static/index.html 访问");

    HttpServer::new(|| {
        App::new()
            // 注册 Files 服务
            // URL 前缀是 "/static"
            // 服务器上的根目录是 "./static_root"
            .service(
                fs::Files::new("/static", "./static_root")
                    // .show_files_listing() // 如果想在访问目录时显示文件列表，取消这行注释
                    // .index_file("index.html") // 如果想在访问 /static/ 时自动显示 index.html，取消这行注释
            )
            // 你可以继续添加其他的 service 或 route
            // .route("/", web::get().to(HttpResponse::Ok))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

现在：
*   访问 `http://127.0.0.1:8080/static/index.html` 会得到 `static_root/index.html` 的内容。
*   访问 `http://127.0.0.1:8080/static/style.css` 会得到 `static_root/style.css` 的内容。
*   访问 `http://127.0.0.1:8080/static/images/logo.png` 会得到 `static_root/images/logo.png` 的内容。
*   访问 `http://127.0.0.1:8080/static/` （或者 `/static/images/`）默认会返回 404 Not Found。

**目录列表和索引文件**

*   `.show_files_listing()`: 如果你想让用户访问一个目录 URL (比如 `/static/`) 时，看到一个简单的 HTML 页面列出该目录下的文件和子目录，可以在 `Files::new()` 后面链式调用这个方法。
*   `.index_file("文件名")`: 如果你希望用户访问目录 URL 时，自动显示该目录下的某个特定文件（通常是 `index.html`），可以调用这个方法。比如 `.index_file("index.html")`，那么访问 `/static/` 就相当于访问 `/static/index.html`。

**配置选项 (Configuration)**

无论是用 `NamedFile` 还是 `Files`，都可以配置一些选项来调整文件服务的行为：

*   `.use_etag(bool)`: 是否生成并发送 `ETag` HTTP 头部。ETag 像文件的版本号，浏览器可以用它来判断本地缓存的文件是否还是最新的，如果是，就不用重新下载了（服务器返回 304 Not Modified）。默认通常是开启的。
*   `.use_last_modified(bool)`: 是否发送 `Last-Modified` HTTP 头部。这个头部告诉浏览器文件最后修改的时间，浏览器也可以用它来判断缓存是否有效。默认通常是开启的。
*   `.set_content_disposition(ContentDisposition)`: 设置 `Content-Disposition` HTTP 头部。这个头部可以告诉浏览器如何处理文件：
    *   `DispositionType::Inline` (默认): 浏览器尝试直接在页面里显示文件内容（比如图片、HTML、PDF 如果浏览器支持的话）。
    *   `DispositionType::Attachment`: 浏览器会提示用户下载文件，而不是试图显示它。这对于提供 `.zip`, `.exe` 或者你希望用户明确下载而不是预览的文件很有用。

看配置例子：

**给 `NamedFile` 添加配置 (强制下载)**

```rust
use actix_files::NamedFile;
use actix_web::{
    get, http::header::{ContentDisposition, DispositionType}, web, App, Error, HttpRequest, HttpServer, Result
};
use std::path::PathBuf;

#[get("/{filename:.*}")] // 再次强调，这个路由模式和直接使用 filename 不安全
async fn download_file(req: HttpRequest) -> Result<NamedFile, Error> {
    let filename: String = req.match_info().query("filename").parse().unwrap();
    let path: PathBuf = filename.parse().unwrap(); // 假设文件在当前目录
    let file = NamedFile::open(path)?;

    // 添加配置
    Ok(file
        .use_last_modified(true) // 确保发送 Last-Modified 头
        // 设置 Content-Disposition 为 Attachment，强制浏览器下载
        .set_content_disposition(ContentDisposition {
            disposition: DispositionType::Attachment,
            parameters: vec![], // 可以加 filename 参数，但 NamedFile 通常会自动处理
        })
    )
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // 放一个 example.txt 文件在当前目录
    std::fs::write("./example.txt", "This is a downloadable file.").ok();

    HttpServer::new(|| App::new().service(download_file))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
```

**给 `Files` 添加配置**

```rust
use actix_files as fs;
use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
     // 确保 static_root 目录存在并有文件
    std::fs::create_dir_all("./static_root").ok();
    std::fs::write("./static_root/some_file.txt", "File content").ok();

    HttpServer::new(|| {
        App::new().service(
            fs::Files::new("/static", "./static_root")
                .show_files_listing() // 允许显示目录列表
                .use_last_modified(true) // 确保发送 Last-Modified 头
                // 你也可以链式调用 .use_etag(true/false) 等
        )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

**总结一下静态文件服务：**

1.  **单个文件:** 用 `NamedFile::open(path)`，但**必须**自己处理好路径安全，防止路径遍历攻击。
2.  **整个目录:** 推荐用 `actix_files::Files::new(prefix, dir_path).service(...)`，更安全方便，能处理子目录。
3.  **目录访问:** 可以用 `.show_files_listing()` 显示文件列表，或用 `.index_file()` 自动加载索引文件。
4.  **配置:** 可以用 `.use_etag()`, `.use_last_modified()` 控制缓存相关头部，用 `.set_content_disposition()` 控制是内联显示还是强制下载。

对于大多数提供 CSS/JS/图片等网站静态资源的需求，使用 `actix_files::Files` 是最佳实践。