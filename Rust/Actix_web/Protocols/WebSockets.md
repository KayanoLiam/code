# WebSocket (WebSockets)
聊聊 WebSockets，以及怎么用 Actix Web (配合 `actix-ws` 库) 来实现它。

**WebSockets 是啥？（大白话版）**

想象一下普通的网页浏览（HTTP）就像写信：
1.  你（浏览器）写一封信（请求）给服务器。
2.  服务器收到信，处理一下，给你回一封信（响应）。
3.  这次通信结束了。你想再问点啥，得重新写信。

WebSockets 就像打电话：
1.  你（浏览器）跟服务器说：“喂，我们来打个电话吧？”（发起 WebSocket 连接请求，这是一个特殊的 HTTP 请求，要求“升级”连接）。
2.  服务器同意了：“好，接通了！”（返回一个特殊的 HTTP 响应，状态码 101 Switching Protocols）。
3.  现在，电话线（WebSocket 连接）就一直通着了！**你和服务器可以随时给对方说话（发送消息），不需要每次都重新拨号（请求/响应循环）**。

**为啥要用 WebSockets？**

它特别适合需要**实时双向通信**的场景，比如：
*   在线聊天室：大家可以实时看到别人发的消息。
*   实时数据更新：股票行情、体育比分、在线游戏状态等。
*   多人协作编辑。

**Actix Web 怎么搞定 WebSockets？ (`actix-ws` 库)**

Actix Web 把 WebSocket 的具体实现放到了一个单独的库 `actix-ws` 里。你需要把它加到你的 `Cargo.toml` 依赖中。

核心流程是：
1.  **握手 (Handshake):** 客户端发起一个特殊的 HTTP GET 请求，要求升级到 WebSocket。
2.  **升级:** 服务器端的 Actix 处理函数 (Handler) 收到这个请求，使用 `actix_ws::handle` 函数来处理握手。如果握手成功，这个函数会返回：
    *   一个特殊的 HTTP 响应 (`HttpResponse`，状态码 101)，你**必须**把这个响应返回给客户端，表示同意升级。
    *   一个 `Session` 对象：你可以把它想象成你的**话筒**，用来向这个特定的客户端**发送**消息。
    *   一个 `MessageStream` 对象：你可以把它想象成你的**听筒**，用来**接收**这个客户端发来的消息流。
3.  **持续通信:** 握手完成后，HTTP 连接就变成了 WebSocket 连接。你需要在一个**后台任务** (`rt::spawn`) 中持续监听 `MessageStream`，处理收到的消息，并使用 `Session` 发送消息回去。

**看代码解释 (简单的回声服务器 Echo Server)**

这个例子实现了一个简单的“回声”服务器：客户端发什么消息，服务器就把同样的消息发回去。

```rust
// 需要在 Cargo.toml 中添加依赖:
// actix-web = "4"
// actix-ws = "0.2" // 或者更新版本
// futures-util = "0.3" // 需要 StreamExt

use actix_web::{rt, web, App, Error, HttpRequest, HttpResponse, HttpServer};
use actix_ws::{AggregatedMessage, MessageStream}; // AggregatedMessage 用于处理分片消息
use futures_util::StreamExt as _; // 引入 StreamExt 来使用 .next()

// WebSocket 处理函数
async fn echo_ws(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    // 1. 处理 WebSocket 握手
    //    actix_ws::handle 尝试将 HTTP 请求升级到 WebSocket
    //    输入: HttpRequest 和原始的请求体流 (Payload)
    //    输出 (如果成功): 元组 (响应, Session对象, 消息流)
    //    res: 必须返回给客户端的 101 Switching Protocols 响应
    //    session: 用来给这个客户端发消息的 "话筒"
    //    msg_stream: 用来接收这个客户端消息的 "听筒" (原始消息流)
    let (res, mut session, msg_stream) = actix_ws::handle(&req, stream)?;

    // WebSocket 消息可能被分成多个片段 (Continuation frames)
    // aggregate_continuations() 会自动把它们拼起来，方便处理
    // max_continuation_size 设置一个最大限制，防止内存耗尽
    let mut aggregated_stream = msg_stream
        .aggregate_continuations()
        .max_continuation_size(1024 * 1024); // 限制为 1MB

    // 2. 启动一个后台异步任务来处理后续的 WebSocket 通信
    //    注意：我们不 await 这个 spawn 的结果，让它在后台独立运行
    //    这样 handler 才能立刻返回 res，完成握手
    rt::spawn(async move {
        // 循环等待并处理从客户端收到的消息
        while let Some(msg_result) = aggregated_stream.next().await {
            match msg_result {
                // 收到一个完整的文本消息
                Ok(AggregatedMessage::Text(text)) => {
                    println!("收到文本: {}", text);
                    // 使用 session (话筒) 把收到的文本原样发回去
                    // 注意：实际应用需要处理这里的 unwrap() 可能产生的错误
                    if session.text(text).await.is_err() {
                        // 发送失败，可能连接已断开，退出循环
                        eprintln!("发送文本失败，连接可能已关闭");
                        break;
                    }
                }

                // 收到一个完整的二进制消息
                Ok(AggregatedMessage::Binary(bin)) => {
                    println!("收到二进制数据，长度: {}", bin.len());
                    // 把收到的二进制数据原样发回去
                    if session.binary(bin).await.is_err() {
                         eprintln!("发送二进制失败，连接可能已关闭");
                        break;
                    }
                }

                // 收到一个 Ping 帧 (客户端用来测试连接是否还活着)
                Ok(AggregatedMessage::Ping(msg)) => {
                    println!("收到 Ping");
                    // 必须回复一个 Pong 帧，内容通常和 Ping 一样
                    if session.pong(&msg).await.is_err() {
                         eprintln!("发送 Pong 失败，连接可能已关闭");
                        break;
                    }
                }

                 // 收到 Close 帧 (客户端请求关闭连接)
                Ok(AggregatedMessage::Close(reason)) => {
                    println!("收到 Close 帧: {:?}", reason);
                    // 可以尝试优雅关闭，然后退出循环
                    let _ = session.close(reason).await;
                    break; // 结束后台任务
                }

                // 收到 Pong 帧 (我们之前发的 Ping 的回应，通常不用特别处理)
                Ok(AggregatedMessage::Pong(_)) => {
                     println!("收到 Pong");
                    // 通常忽略
                }

                // 发生了协议错误或其他问题
                Err(e) => {
                    eprintln!("WebSocket 错误: {:?}", e);
                    break; // 出错了，结束后台任务
                }
            }
        }
        // 循环结束，意味着 WebSocket 连接关闭了
        println!("WebSocket 连接关闭");
    });

    // 3. handler 函数本身立即返回从 handle() 获取的 101 响应
    //    这告诉客户端：“升级成功，现在是 WebSocket 了！”
    //    后台任务 `rt::spawn` 会接管后续的通信。
    Ok(res)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("WebSocket 服务器启动于 ws://127.0.0.1:8080/ws_echo");
    HttpServer::new(|| {
        App::new()
            // 定义一个路由，当 GET 请求访问 /ws_echo 时，调用 echo_ws 处理函数
            .route("/ws_echo", web::get().to(echo_ws))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

**怎么测试？**

你可以使用一些在线的 WebSocket 测试工具（比如 [websocketking.com](https://websocketking.com/)）或者浏览器的开发者工具控制台来连接 `ws://127.0.0.1:8080/ws_echo`，然后发送消息看服务器是否会原样返回。

**总结一下 Actix WebSocket 流程：**

1.  客户端发起升级请求到特定路由（比如 `/ws_echo`）。
2.  Actix handler (`echo_ws`) 被调用。
3.  调用 `actix_ws::handle()` 进行握手，获得 `res` (101响应), `session` (发送器), `stream` (接收器)。
4.  （可选但推荐）使用 `aggregate_continuations()` 处理消息分片。
5.  使用 `rt::spawn()` 启动一个**后台任务**来处理 `stream` 中的消息。
6.  在后台任务的循环中：
    *   `await stream.next()` 等待接收消息。
    *   `match` 消息类型 (Text, Binary, Ping, Close 等)。
    *   使用 `session.text()`, `session.binary()`, `session.pong()`, `session.close()` 来响应或发送消息。
    *   处理错误和连接关闭。
7.  handler 函数**立即**返回 `Ok(res)`，完成握手。

这样，你就用 Actix Web 和 `actix-ws` 建立了一个可以进行实时双向通信的 WebSocket 服务！