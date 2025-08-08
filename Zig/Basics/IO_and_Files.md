# I/O 与文件 (std.fs, std.io)

这章覆盖最常用的 I/O：标准输入输出、读写文件、缓冲 I/O、路径与目录。Zig 的 I/O 明确且显式，错误处理与资源释放通过 `try` + `defer` 保证清晰。

## 标准输出/输入

```zig
const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Hello, {s}!\n", .{"world"});

    const stdin = std.io.getStdIn().reader();
    var buf: [128]u8 = undefined;
    const n = try stdin.read(&buf);
    std.debug.print("read {} bytes\n", .{n});
}
```

- `writer().print` 支持格式化
- `reader().read` 读取字节；返回读取的字节数

## 读整个文件

```zig
const std = @import("std");

pub fn main() !void {
    const cwd = std.fs.cwd();
    const file = try cwd.openFile("README.md", .{});
    defer file.close();

    const stat = try file.stat();
    var buf = try std.heap.page_allocator.alloc(u8, @intCast(stat.size));
    defer std.heap.page_allocator.free(buf);

    const n = try file.readAll(buf);
    std.debug.print("size={} read={} first10={any}\n", .{ stat.size, n, buf[0..@min(10, n)] });
}
```

- `openFile(path, .{})` 以只读打开
- `stat()` 获取文件大小等元信息
- 记得 `close()`，并释放缓冲

## 写文件（覆盖/追加）

```zig
const std = @import("std");

pub fn main() !void {
    const cwd = std.fs.cwd();

    // 覆盖写入
    {
        const file = try cwd.createFile("out.txt", .{ .truncate = true });
        defer file.close();
        const w = file.writer();
        try w.print("line {}\n", .{1});
    }

    // 追加
    {
        const file = try cwd.openFile("out.txt", .{ .mode = .write_only, .lock = .none });
        defer file.close();
        try file.seekFromEnd(0);
        const w = file.writer();
        try w.print("line {}\n", .{2});
    }
}
```

- `createFile(..., .{ .truncate = true })` 覆盖
- 追加时移动到文件尾再写

## 缓冲 I/O

```zig
const std = @import("std");

pub fn main() !void {
    var buf_stream = std.io.fixedBufferStream(&[_]u8{0} ** 256);
    const w = buf_stream.writer();
    try w.print("num={} str={s}\n", .{ 42, "zig" });

    const written = buf_stream.getWritten();
    std.debug.print("buf: {s}", .{written});
}
```

- `fixedBufferStream` 用内存缓冲模拟 I/O，适合测试与格式化阶段

## 逐行读取

```zig
const std = @import("std");

pub fn main() !void {
    const cwd = std.fs.cwd();
    const file = try cwd.openFile("input.txt", .{});
    defer file.close();

    var br = std.io.bufferedReader(file.reader());
    var r = br.reader();

    var line_buf: [256]u8 = undefined;
    while (try r.readUntilDelimiterOrEof(&line_buf, '\n')) |line| {
        std.debug.print("line: {s}\n", .{line});
    }
}
```

- 缓冲 reader 减少系统调用
- `readUntilDelimiterOrEof` 处理按行读取

## 路径与目录遍历

```zig
const std = @import("std");

pub fn main() !void {
    const cwd = std.fs.cwd();
    var it = try cwd.openIterableDir(".", .{});
    defer it.close();

    var iter = it.iterate();
    while (try iter.next()) |entry| {
        std.debug.print("{s} ({})\n", .{ entry.name, entry.kind });
    }
}
```

- `openIterableDir` + `iterate` 遍历目录
- `entry.kind` 提供文件类型信息

## 错误处理与健壮性

I/O 失败很常见：不存在、权限、被占用、磁盘满。配合 `error`/`try`/`catch` 与 `switch` 分类处理：

```zig
fn read_config(path: []const u8) ![]u8 {
    const file = try std.fs.cwd().openFile(path, .{});
    defer file.close();
    return try file.readToEndAlloc(std.heap.page_allocator, 1 << 20);
}

pub fn main() !void {
    const cfg = read_config("config.toml") catch |err| switch (err) {
        error.FileNotFound => blk: {
            std.log.warn("config not found, using defaults", .{});
            break :blk "";
        },
        else => return err,
    };
    _ = cfg;
}
```

## 与 Rust 的对照

| 主题 | Rust | Zig |
|---|---|---|
| 标准 I/O | `std::io::{stdin, stdout}` | `std.io.getStdIn/Out()` |
| 文件 | `std::fs::File` | `std.fs.File` |
| 缓冲 | `BufReader/BufWriter` | `bufferedReader/Writer` |
| 迭代读取 | `read_line` | `readUntilDelimiterOrEof` |

Zig 的 I/O 明确、可组合，错误与资源释放都走统一语法。

## 练习
1) 实现一个“按行去重”工具，读取 `stdin`，输出唯一行到 `stdout`。
2) 写一个“小日志轮转”：超过 1MB 则重命名旧文件并新建写入。
3) 遍历目录，把所有 `.zig` 文件的首行输出到 `stdout`。