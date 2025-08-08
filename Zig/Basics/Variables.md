# 变量和常量 (Variables and Constants)

Zig 的可变性设计与 Rust 一样强调“默认不可变，按需可变”。本章用直观的例子讲清楚：何时用 `const`，何时用 `var`，以及和编译时常量的区别。

## 为什么默认不可变？
- 清晰：读到 `const` 就知道值不会变，逻辑更稳。
- 安全：避免“无意修改”带来的隐性 Bug。
- 性能：编译器能更大胆地优化不可变数据。

## 基本语法：`const` 与 `var`

```zig
const std = @import("std");

pub fn main() !void {
    // 不可变：交给编译器推断类型
    const greeting = "Hello, Zig!";         // 类型: []const u8
    const max_retries = 3;                   // 类型: comptime_int -> 推断为 i32 等具体整数类型

    // 可变：必须显式写类型（Zig 规则）
    var counter: u32 = 0;
    counter += 1;

    std.debug.print("{s} counter={}\n", .{ greeting, counter });
}
```

要点：
- `const` 支持类型推断（常量几乎总能写得更简洁）。
- `var` 需要显式类型标注（更可控、更清晰）。

## 运行时常量 vs 编译时常量

- 运行时常量：在程序运行期间确定一次后不再改变。
- 编译时常量：在编译阶段就能算出来，运行期零开销，常见于表、配置、形状已知的数据结构。

```zig
const std = @import("std");

// 典型的编译时常量：
const PI = 3.141592653589793;
const SECONDS_PER_HOUR = 60 * 60;           // 编译期即可求值

// 利用 comptime 进行复杂编译期计算
const FIRST_100_SUM = comptime blk: {
    var sum: u32 = 0;
    var i: u32 = 1;
    while (i <= 100) : (i += 1) sum += i;
    break :blk sum;                          // 5050，结果直接内嵌
};

pub fn main() !void {
    // 运行时常量（局部 const）：
    const radius = 5.0;                      // 用于表达“不会变”的意图
    const area = PI * radius * radius;       // 可能在编译期被折叠

    std.debug.print("area={d:.2}, sum={}\n", .{ area, FIRST_100_SUM });
}
```

对比 Rust：
- Rust 的 `const` 和 `static` 概念在 Zig 中分别由“编译期可求值的常量”和“全局常量/数据段”承接；Zig 不区分 `const`/`static` 关键字，而是以“是否在编译期可求值”和“作用域位置”来表达。

## 可变性与类型标注

Zig 对“变量”较为严格：
- `var` 必须标注类型（哪怕右侧有初始化值）。
- `const` 多数情况下可省略类型（由编译器推断）。

```zig
const std = @import("std");

pub fn main() !void {
    // ✅ 常量推断类型
    const port = 8080;              // 推断为整型
    const message = "ready";       // 推断为 []const u8

    // ✅ 变量显式类型
    var retry_count: u8 = 0;
    var temperature: f32 = 23.5;

    // ❌ 变量不写类型 -> 编译错误
    // var bad = 0;                 // error: variable declarations require a type

    std.debug.print("port={}, msg={s}, retry={}, temp={d:.1}\n",
        .{ port, message, retry_count, temperature });
}
```

设计取舍：把“变量需要类型”视作“对可变状态的显式承诺”。

## 作用域与生命周期

- 作用域由花括号 `{}` 决定。
- 外层可见内层声明？反之不行。
- Zig 没有 GC；值的“活跃期”主要靠作用域和所有者（变量绑定）管理。

```zig
const std = @import("std");

pub fn main() !void {
    const outer_const = 42;
    var outer_var: i32 = 100;

    {
        const inner_const = 7;
        var inner_var: i32 = 200;
        outer_var = 150; // 修改外层变量
        std.debug.print("inner: const={}, var={}\n", .{ inner_const, inner_var });
    }

    std.debug.print("outer: const={}, var={}\n", .{ outer_const, outer_var });
}
```

提示：离开作用域后，内部变量不可再访问；指针/切片跨越作用域要格外小心（见“指针”“数组与切片”“内存与分配器”章节）。

## 常见模式

- 局部计算结果用 `const` 固定，表达“不再变化”的事实：

```zig
const std = @import("std");

pub fn main() !void {
    var score: u32 = 0;                  // 可变状态，累加分数

    // 每轮计算产出一个常量结果，语义更清晰
    const bonus = if (score > 1000) 100 else 10;
    score += bonus;

    std.debug.print("score={}\n", .{score});
}
```

- 配置与约束集中定义为常量（全局或命名空间内）：

```zig
const App = struct {
    pub const MAX_USERS = 1000;
    pub const DEFAULT_TIMEOUT_SECS = 30;
};

pub fn main() !void {
    _ = App.MAX_USERS;
    _ = App.DEFAULT_TIMEOUT_SECS;
}
```

## 与 Rust 的对比总结

| 主题 | Rust | Zig |
|---|---|---|
| 默认不可变 | `let` 默认不可变 | `const` 不可变（推荐）|
| 可变声明 | `let mut x = ...` | `var x: T = ...`（必须显式类型）|
| 常量 | `const NAME: T = ...;` | `const NAME = ...;`（多为编译期可求值）|
| 类型推断 | `let`/`let mut` 均可推断 | 主要在 `const` 上推断；`var` 需标注 |
| 遮蔽 (shadowing) | 支持 | 不支持（减少困惑）|

小结：Zig 倡导“用 `const` 表达意图、用 `var` 明确承诺”。这样既利于优化，也利于读者快速建立对代码的正确心智模型。

## 练习
1) 用 `const` 写出圆柱体体积的编译时计算（给定半径和高度）。
2) 把一个小型“计数器”从 `const` 方案改为 `var` 方案，并思考为什么必须改。
3) 把多个散落的“魔法数字”整理为同一个命名空间下的常量集合。
