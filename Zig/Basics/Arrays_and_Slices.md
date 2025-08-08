# 数组与切片 (Arrays & Slices)

Zig 把“定长数组”和“切片视图”分得很清楚：
- 数组 `[N]T`：长度在编译期就确定，值在栈或静态区上分配，大小是类型的一部分。
- 切片 `[]T` / `[]const T`：对一段连续内存的动态视图（带指针和长度），常用于函数参数、子区间、运行时拼接等。

这与 Rust 的 `[T; N]`（定长）与 `&[T]`（切片）有相似的心智模型。

## 定长数组 `[N]T`

```zig
const std = @import("std");

pub fn main() !void {
    // 编译期已知长度与元素类型
    const primes = [5]u32{ 2, 3, 5, 7, 11 };
    std.debug.print("len={} first={} last={}\n", .{ primes.len, primes[0], primes[primes.len-1] });

    // 可变数组需显式 var；支持下标赋值
    var scores = [4]i32{ 10, 20, 30, 40 };
    scores[2] = 300;
    std.debug.print("scores={any}\n", .{scores});
}
```

要点：
- 数组长度是类型一部分：`[4]i32` ≠ `[5]i32`。
- 访问越界会在 Debug 下触发安全检查（崩溃），Release 下也为 UB，应避免。

## 数组推断与填充

```zig
const std = @import("std");

pub fn main() !void {
    // 使用 `[_]T{ ... }` 让编译器从字面量个数推断长度
    const letters = [_]u8{ 'A', 'B', 'C' };

    // 全部初始化为同一值（需要 comptime 已知长度）
    const filled: [8]u8 = .{0} ** 8; // 8 个 0

    std.debug.print("letters.len={}, filled.len={}\n", .{ letters.len, filled.len });
}
```

## 切片 `[]T` / `[]const T`

- `[]T`：可变视图；可以通过切片修改底层数据。
- `[]const T`：只读视图；借用不可变视图更安全。

```zig
const std = @import("std");

pub fn main() !void {
    var data = [_]u8{ 1, 2, 3, 4, 5, 6 };

    // 全切片（可变）
    var view: []u8 = data[0..];
    view[1] = 20; // 修改影响到原数组

    // 子切片（只读）
    const head: []const u8 = data[0..3];
    std.debug.print("head={any} data={any}\n", .{ head, data });
}
```

切片是 (ptr, len) 的轻量组合，适合作为函数参数传递连续序列。

## 切片边界与安全

```zig
const std = @import("std");

pub fn main() !void {
    const text = "abcdef";

    const a = text[0..2];          // "ab"
    const b = text[2..text.len];   // "cdef"

    // 非法：越界切片会在运行时报错（Debug）
    // const bad = text[5..10];

    std.debug.print("a={s} b={s}\n", .{ a, b });
}
```

## 与 `for` 的配合：遍历与索引

```zig
const std = @import("std");

pub fn main() !void {
    const arr = [_]i32{ 10, 20, 30 };

    // 不带索引
    for (arr) |v| {
        std.debug.print("v={} ", .{v});
    }
    std.debug.print("\n", .{});

    // 带索引
    for (arr, 0..) |v, i| {
        std.debug.print("[{d}]={d} ", .{ i, v });
    }
    std.debug.print("\n", .{});
}
```

## 从数组得到切片、从切片复制

```zig
const std = @import("std");

pub fn main() !void {
    var buf = [_]u8{0} ** 8;          // 定长数组
    var s: []u8 = buf[0..];           // 切片视图（可写）

    // 写入数据（边界自行保证）
    s[0] = 'H'; s[1] = 'i';

    // 复制到另一块区域
    var out = [_]u8{0} ** 8;
    std.mem.copy(u8, out[0..2], s[0..2]);

    std.debug.print("buf={any} out={any}\n", .{ buf, out });
}
```

要点：
- `std.mem.copy(T, dst, src)` 目标与来源都为切片；长度需匹配或以较短为准（取决于API）。

## 以字符串为切片：`[]const u8`

Zig 的“字符串”是字节切片：`[]const u8`。

```zig
const std = @import("std");

pub fn main() !void {
    const s: []const u8 = "Hello, Zig"; // 字面量位于只读段
    std.debug.print("len={} first='{'c'}'\n", .{ s.len, s[0] });

    // 子串（切片）
    const hello = s[0..5];
    const zig = s[7..];
    std.debug.print("{s} | {s}\n", .{ hello, zig });
}
```

## 动态增长：使用分配器构建切片

数组长度在类型层面固定；需要“增长”的场景，通常使用分配器配合 `ArrayList` 或自己分配：

```zig
const std = @import("std");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var list = std.ArrayList(u8).init(allocator);
    defer list.deinit();

    try list.appendSlice("Hello");
    try list.append(' ');
    try list.appendSlice("Zig");

    const slice = list.items; // []u8，可继续扩容
    std.debug.print("{s}\n", .{slice});
}
```

## 与 Rust 的心智映射

| 概念 | Rust | Zig |
|---|---|---|
| 定长数组 | `[T; N]` | `[N]T` |
| 切片（只读） | `&[T]` | `[]const T` |
| 切片（可变） | `&mut [T]` | `[]T` |
| 字符串切片 | `&str` (UTF-8 语义) | `[]const u8` (字节视图) |

注意：Zig 字符串是“字节切片”，不做 UTF-8 语义保证，涉及字符需自行处理。

## 最佳实践
- 函数参数尽量使用切片 `[]const T`，避免拷贝；需要修改才用 `[]T`。
- 只在需要固定大小、栈分配或性能敏感时使用定长数组 `[N]T`。
- 切片边界要自证安全；Debug 下可利用越界检查。
- 处理文本请使用 `[]const u8` 与 `std.mem`、`std.fmt` 配套 API。

## 练习
1) 写一个函数，接收 `[]const i32`，返回最大值，空切片返回 `null`。
2) 构造一个 `[16]u8` 的环形缓冲，给出写入与读取的下标更新逻辑。
3) 用 `ArrayList(u8)` 构建一个 `join` 函数，将若干 `[]const u8` 以分隔符连接。