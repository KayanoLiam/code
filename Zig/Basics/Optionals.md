# 可选类型与空值 (Optionals)

在 Zig 里，空值不是“神秘的 null 指针错误”，而是被类型系统显式建模的 `?T`：
- `T`：一定有值
- `?T`：要么是 `T`，要么是 `null`

这和 Rust 的 `Option<T>` 很像，但 Zig 用 `?T` 这种内建语法表达，解包也更直接。

## 声明与判空

```zig
const std = @import("std");

pub fn main() !void {
    var maybe_num: ?i32 = null;     // 目前没有值
    std.debug.print("is null? {}\n", .{ maybe_num == null });

    maybe_num = 42;                 // 赋值为某个 i32
    std.debug.print("is null? {}\n", .{ maybe_num == null });
}
```

## 解包：`if (opt) |v| { ... } else { ... }`

```zig
const std = @import("std");

fn parse_digit(c: u8) ?u8 {
    if (c >= '0' and c <= '9') return @as(u8, c - '0');
    return null;
}

pub fn main() !void {
    if (parse_digit('7')) |d| {
        std.debug.print("digit={}\n", .{d});
    } else {
        std.debug.print("not a digit\n", .{});
    }
}
```

- 解包时 `|d|` 引入一个只在分支内有效的绑定。
- 没有 `match`，但 `if` 语法已足够简洁。

## 提供默认值：`orelse`

```zig
const std = @import("std");

fn env_timeout() ?u32 { return null; }

pub fn main() !void {
    const timeout = env_timeout() orelse 30; // 若为 null 则取 30
    std.debug.print("timeout={}\n", .{timeout});
}
```

`orelse` 是最常用的空处理语法糖，等价于：

```zig
const val = blk: {
    if (env_timeout()) |v| break :blk v;
    break :blk 30;
};
```

## 与错误处理的组合

- 错误：`!T` 表示“要么错误、要么 T”。
- 可选：`?T` 表示“要么 null、要么 T”。
- 两者可组合：`!?T` / `?!(T)` 等具体位置取决于语义。

示例：可能失败且可能为空的查找：

```zig
const std = @import("std");

const DbError = error{ ConnectionFailed };

fn find_user_id(name: []const u8) DbError!?u32 {
    if (std.mem.eql(u8, name, "offline")) return DbError.ConnectionFailed;
    if (std.mem.eql(u8, name, "nobody")) return null; // 找不到
    return 1001; // 找到
}

pub fn main() !void {
    const id = find_user_id("alice") catch |err| {
        std.debug.print("db error: {}\n", .{err});
        return;
    } orelse {
        std.debug.print("not found\n", .{});
        return;
    };

    std.debug.print("id={}\n", .{id});
}
```

阅读顺序建议：先用 `catch` 处理错误，再用 `orelse` 处理为空的分支（直观且常见）。

## 可选切片与可选指针

```zig
const std = @import("std");

fn first_even(s: []const u32) ?usize {
    for (s, 0..) |v, i| if (v % 2 == 0) return i;
    return null;
}

pub fn main() !void {
    const arr = [_]u32{ 3, 5, 8, 9 };
    if (first_even(&arr)) |idx| {
        std.debug.print("first even at {}\n", .{idx});
    }
}
```

- `?[]T` 与 `[]?T` 不同：
  - `?[]T`：整个切片可能为 `null`。
  - `[]?T`：切片存在，但其中每个元素可能为 `null`。

## 模式与建议
- 读操作常用 `orelse` 给出默认值；写操作常用 `if (opt) |v|` 解包并处理。
- 表达“不存在”优先使用 `?T` 而非“魔法数字”。
- API 级别区分“失败”(error) 与“缺席”(null)：避免语义混淆。

## 与 Rust 对照

| 主题 | Rust | Zig |
|---|---|---|
| 可选类型 | `Option<T>` | `?T` |
| 解包 | `match`/`if let` | `if (opt) |v| {}` |
| 默认值 | `unwrap_or(x)` | `orelse x` |
| 链式处理 | `and_then` | 使用 `if`/`switch`/直接表达 |

Zig 放弃了大量语法糖，换来更直观的控制流；代码依旧简洁。

## 练习
1) 实现 `parse_u32([]const u8) ?u32`，要求：空串返回 `null`，非数字返回 `null`，否则返回解析结果。
2) 设计一个 `get_config(key: []const u8) ?[]const u8`，并用 `orelse` 提供默认配置。
3) 组合 `!?T`：模拟网络查找（可能失败），并表示“可能查不到”。