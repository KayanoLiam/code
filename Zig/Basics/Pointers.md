# 指针与引用 (Pointers)

Zig 的指针设计比 Rust 更直接：没有借用检查器，但有边界检查、未初始化保护、`const`/可变性语义和多种指针形态。你需要自律，但工具足够强。

与 Rust 的 `&T`/`&mut T` 概念对应，Zig 使用 `*const T` 与 `*T`（可变指针）。此外还有“多元素指针”与“切片”用于连续内存。

## 基本指针：`*T` 与 `*const T`

```zig
const std = @import("std");

pub fn main() !void {
    var x: i32 = 42;
    const p: *i32 = &x;       // 可变指针：可通过指针修改 x
    const cp: *const i32 = &x; // 只读指针：不可通过指针修改 x

    p.* = 100;                 // 解引用并赋值
    std.debug.print("x={}, *cp={}\n", .{ x, cp.* });
}
```

- `&expr` 取地址，类型为指向该值的指针。
- `ptr.*` 解引用。
- `*const T` 类似 Rust 的 `&T`，`*T` 类似 `&mut T`，但 Zig 没有编译期借用规则；需要开发者自己保证无数据竞争与别名问题。

## 多元素指针：`[*]T` 与 `[*]const T`

多元素指针是“裸指针 + 未知长度”的语义，常用于 C 互操作或手动内存管理：

```zig
const std = @import("std");

pub fn main() !void {
    var arr = [_]u8{ 10, 20, 30, 40 };

    // 从切片获取多元素指针（去掉长度）
    var s: []u8 = arr[0..];
    const mp: [*]u8 = s.ptr;     // 多元素指针

    mp[1] = 200;                 // 允许按下标访问（调用者需自证边界）
    std.debug.print("arr={any}\n", .{arr});
}
```

提示：`[*]T` 不携带长度，所有边界安全由你负责；优先使用切片 `[]T`/`[]const T`，除非必须与底层接口对接。

## 可空指针：`?*T` / `?*const T`

```zig
const std = @import("std");

fn find_char(haystack: []const u8, needle: u8) ?*const u8 {
    for (haystack, 0..) |c, i| {
        if (c == needle) return &haystack[i];
    }
    return null;
}

pub fn main() !void {
    const s = "zig";
    if (find_char(s, 'i')) |ptr| {
        std.debug.print("found '{'c'}' at {*}\n", .{ ptr.*, ptr });
    } else {
        std.debug.print("not found\n", .{});
    }
}
```

- 可空指针与 Rust 的 `*const T` + `Option` 类似，但 Zig 用 `?*const T` 一体表达。
- 解包可空值使用 `if (opt) |v| { ... } else { ... }` 语法。

## 指向数组 vs 指向首元素

- `&array` 类型为 `*[N]T`（指向整个数组）。
- `&array[0]` 类型为 `*T`（指向第一个元素）。

```zig
const std = @import("std");

pub fn main() !void {
    var buf = [_]i32{ 1, 2, 3 };
    const p_arr: *[3]i32 = &buf;  // 指向整个数组
    const p_elm: *i32 = &buf[0];  // 指向首元素

    p_arr.*[1] = 200;
    p_elm.* = 100;
    std.debug.print("buf={any}\n", .{buf});
}
```

## 指针与切片的互转

- `[]T` 持有 `(ptr: [*]T, len: usize)`。
- 从切片到多元素指针：`slice.ptr`
- 从数组到切片：`array[begin..end]`

优先在 API 层使用切片；仅在必要时暴露多元素指针。

## 对齐与地址运算

```zig
const std = @import("std");

pub fn main() !void {
    var x: u32 = 0;
    const px: *u32 = &x;

    std.debug.print("alignof(u32)={} ptr=*{}\n", .{ @alignOf(u32), px });
}
```

- `@alignOf(T)` 返回类型对齐；与 C 互操作或自定义内存布局时很重要。
- Zig 允许通过 `@intFromPtr` / `@ptrFromInt` 在整型与指针间转换（需小心）。

## 未初始化与别名注意

- `var buf: [1024]u8 = undefined;` 表示未初始化，读取未写入的数据是未定义行为。
- 同一可变数据的多个别名可能引入数据竞争；Zig 不强制检查，需靠规范与代码审查。

## 与 Rust 对照

| 主题 | Rust | Zig |
|---|---|---|
| 只读借用 | `&T` | `*const T`（语义更底层）|
| 可变借用 | `&mut T` | `*T` |
| 切片 | `&[T]` / `&mut [T]` | `[]const T` / `[]T` |
| 空指针 | `Option<*const T>` | `?*const T` |
| 借用检查 | 编译期借用规则 | 无；需自律与测试 |

结论：Zig 给你“C 一样的自由 + 更好的工具”；写指针代码要遵守约定、消除歧义、写测试。

## 练习
1) 写一个函数，接收 `[]u8` 与 `u8`，返回 `?*u8` 指向首次匹配位置；并写用例覆盖首/中/尾与未找到。
2) 用 `*[N]T` 实现一个就地反转函数 `reverse(*[N]T)`，要求 O(1) 空间。
3) 用 `@intFromPtr` 打印一段内存的十六进制地址区间，帮助理解指针算术。