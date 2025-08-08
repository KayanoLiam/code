# 并发与异步 (Async & Event Loop)

Zig 的异步是“协作式 (cooperative)”的：编译器把 `async`/`await` 变换成状态机，底层通过事件循环驱动（无需 GC、无需线程栈切换）。

对比 Rust：心智模型接近 `async/.await`，但 Zig 更贴近底层，能在不引入 runtime 的前提下写出事件驱动程序。

> 注意：Zig 版本演进中异步 API 有过变化，以下围绕 `std` 当前常用能力与模式给出实践向导。

## 最小心智模型

- `async fn`：可被调度的协程
- `await`：在某个可挂起点让出控制权，回到事件循环
- I/O 触发唤醒，继续从挂起点执行

## 异步任务基础（概念示例）

```zig
const std = @import("std");

fn do_work(id: u8) void {
    std.debug.print("task {} start\n", .{id});
    // ... 执行计算或等待 I/O ...
    std.debug.print("task {} end\n", .{id});
}

pub fn main() !void {
    // 实际项目通常结合事件循环与非阻塞 I/O 一起使用
    do_work(1);
    do_work(2);
}
```

上例是同步版。异步版通常与事件循环和非阻塞 I/O 一起出现，模式上：
- 用 `std.net` 做非阻塞 socket
- 用 `std.Thread` 启动少量工作线程（可选）
- 用 `std.event` 或自建队列组织任务

## 事件驱动 I/O（TCP 回显示例）

```zig
const std = @import("std");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var server = try std.net.StreamServer.init(.{ .reuse_address = true });
    defer server.deinit();

    try server.listen(.{ .address = .{ .any = .{} }, .port = 8080 });
    std.debug.print("listening on 0.0.0.0:8080\n", .{});

    while (true) {
        var conn = try server.accept();
        // 简单起见：每个连接交给一个线程；更高级可用非阻塞 + 事件循环
        try std.Thread.spawn(.{}, handle_client, .{ allocator, conn });
    }
}

fn handle_client(allocator: std.mem.Allocator, conn: std.net.StreamServer.Connection) !void {
    defer conn.stream.close();

    var br = std.io.bufferedReader(conn.stream.reader());
    var bw = std.io.bufferedWriter(conn.stream.writer());

    var r = br.reader();
    const w = bw.writer();

    var buf: [1024]u8 = undefined;

    while (true) {
        const n = try r.read(&buf);
        if (n == 0) break; // EOF
        try w.writeAll(buf[0..n]);
        try bw.flush();
    }
}
```

- 这是“多线程 + 同步 I/O”的基本模式（简单可靠）
- 要进一步降低线程数与上下文切换，可采用非阻塞 socket + 事件循环

## 非阻塞与多路复用（概念）

- 将 socket 设为 non-blocking
- 使用平台多路复用（epoll/kqueue）等待就绪
- 就绪后继续读写，未就绪让出控制

Zig 提供跨平台封装（`std.os`/`std.net`），也可以直接使用系统调用。事件循环通常由你的应用层组织（任务队列、定时器、唤醒机制）。

## 协作式并发的优势与取舍

优点：
- 零 GC；状态机由编译器生成
- 显式 I/O 与让出点，更可控
- 资源使用可预估

取舍：
- 需要你自己组织任务调度模型
- 一些 API 仍在演进，注意版本适配

## 模式建议

- 简单网络服务：每连接一线程 + 缓冲 I/O（快速上线）
- 高并发：少量线程 + 事件循环 + 非阻塞 socket
- CPU 密集：线程池 + work-stealing；I/O 与 CPU 解耦
- 统一取消/超时：自建“任务上下文”结构，传递截止时间与取消标记

## 与 Rust 的对照

| 主题 | Rust | Zig |
|---|---|---|
| 异步语法 | `async/.await` | 有对应语法/状态机，但更贴底层 |
| Runtime | Tokio/async-std 等 | 无强制 runtime，自己组织或选用库 |
| 网络 | `tokio::net` 等 | `std.net`（同步/非阻塞） |
| 并发 | `std::thread` + `sync` | `std.Thread` + 原生原语 |

Zig 倾向“自己决定 runtime 的形状”，使你能按业务裁剪，尽量保持可预测与高性能。

## 练习
1) 在回显服务器上加“连接数限制”和“读超时”。
2) 改写为非阻塞模式：使用平台多路复用等待可读可写事件。
3) 设计一个“任务执行器”，支持提交任务、定时任务、任务取消，并用它驱动一个简单 HTTP 服务。