# Zig 中的注释 (Comments)
注释是写在代码里的“笔记”，它们是给人看的，Zig 编译器会完全忽略它们。写注释是个好习惯，可以帮助别人（以及未来的你）理解代码的意图。

在 Zig 中，只有一种注释方式：行注释。

**行注释 (Line Comments)**

用 `//` (两个斜杠) 开始，从 `//` 到这一行末尾的所有内容都会被当作注释。

```zig
const std = @import("std");

pub fn main() !void {
    // 这是一条注释。我可以用它来解释下面这行代码是干嘛的。
    const meaning_of_life = 42; // 注释也可以写在代码后面

    // 下面这行代码被注释掉了，所以它不会被执行
    // std.debug.print("This will not be printed.\n", .{});

    std.debug.print("The meaning of life is {}.\n", .{meaning_of_life});
}
```

**文档注释 (Documentation Comments)**

Zig 有一种特殊的注释，叫做“文档注释”，用 `///` (三个斜杠) 表示。这种注释是为你的 API 写文档用的，可以被工具自动提取生成文档。

文档注释通常写在函数或全局变量的声明之前。

```zig
const std = @import("std");

/// 这是一个文档注释！
/// 它描述了 `add` 函数的功能。
///
/// 接收两个 `i32` 类型的数字 `a` 和 `b`，
/// 然后返回它们的和。
fn add(a: i32, b: i32) i32 {
    return a + b;
}

pub fn main() !void {
    const result = add(10, 20);
    std.debug.print("Result: {}\n", .{result});
}
```

虽然我们现在还用不到自动生成文档的功能，但养成写文档注释的习惯，对写出高质量、易于理解的代码非常有帮助。

**为什么没有块注释？**

一些语言（如 C 或 JavaScript）有 `/* ... */` 这样的块注释。Zig 的设计者为了保持语言的简洁性，特意去掉了块注释。只用 `//` 就够了，而且还能避免一些由块注释嵌套引起的常见错误。

**总结一下：**

*   用 `//` 来写普通的单行注释。
*   用 `///` 来为函数或公开的声明写文档。
*   多写注释，让你的代码更易懂！
