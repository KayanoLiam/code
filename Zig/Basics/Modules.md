# 模块与导入 (Modules)

Zig 没有“包罗万象的关键字系统”；模块就是文件，命名空间可以由 `struct` 提供。导入、可见性、命名空间三件事清晰直白，足够表达大型项目结构。

这章对照 Rust：Rust 有 `mod`, `use`, `pub`，Zig 用 `@import`, `pub`, `usingnamespace` 实现类似能力。

## `@import`：导入一个模块（文件）

- `@import("std")` 导入标准库
- `@import("path/to/file.zig")` 导入本地文件（相对路径以当前文件为基准）

```zig
const std = @import("std");
const util = @import("./util.zig");

pub fn main() !void {
    util.say_hello();
    std.debug.print("version: {s}\n", .{@import("builtin").zig_version_string});
}
```

示例 `util.zig`：

```zig
const std = @import("std");

pub fn say_hello() void {
    std.debug.print("hello from util\n", .{});
}
```

- `pub` 使得被导入方的符号对外可见；无 `pub` 则仅在文件内可见。

## 模块即命名空间

导入后，文件级符号以“模块名.” 前缀访问；你也可以用 `const` 绑定重命名：

```zig
const U = @import("./util.zig");

pub fn main() !void {
    U.say_hello();
}
```

## `usingnamespace`：把一个命名空间“摊开”

适合把某个“模块/结构体”的成员引入当前命名空间，减少前缀：

```zig
const std = @import("std");

const Math = struct {
    pub fn add(a: i32, b: i32) i32 { return a + b; }
    pub fn mul(a: i32, b: i32) i32 { return a * b; }
};

pub usingnamespace Math; // 之后可直接用 add/mul

pub fn main() !void {
    std.debug.print("{} {}\n", .{ add(2,3), mul(4,5) });
}
```

注意：过度展开会污染命名空间，建议仅在“模块入口/门面”使用。

## 可见性：`pub` 的作用域

- `pub` 放在文件顶层：对导入该文件的其他文件可见
- `pub` 放在 `struct/enum/union` 内：对使用该类型的模块可见
- 不加 `pub`：仅当前文件可见

```zig
const std = @import("std");

const Internal = struct {
    fn helper() void { std.debug.print("internal\n", .{}); } // 私有
    pub fn run() void { helper(); }                             // 公共接口
};

pub fn main() !void {
    Internal.run();
}
```

## 文件布局建议（小型项目）

```
src/
  main.zig          # 程序入口
  util.zig          # 工具函数/小组件
  math.zig          # 纯算法逻辑
```

在 `main.zig` 中：

```zig
const std = @import("std");
const util = @import("util.zig");
const math = @import("math.zig");

pub fn main() !void {
    util.greet("Zig");
    const v = math.add(10, 32);
    std.debug.print("v={}\n", .{v});
}
```

## 文件布局建议（中大型项目）

- 用目录分区：`net/`, `db/`, `core/`
- 用 `index.zig` 或 `mod.zig` 作为子模块聚合入口（习惯约定）
- 在根 `src/` 暴露门面 `lib.zig`（对外 API）

示例：
```
src/
  lib.zig
  core/
    mod.zig        # usingnamespace 子模块
    hash.zig
    io.zig
```

`core/mod.zig`：
```zig
pub const hash = @import("hash.zig");
pub const io = @import("io.zig");
```

`lib.zig`：
```zig
pub usingnamespace @import("core/mod.zig");
```

## 与 Rust 的对照

| 主题 | Rust | Zig |
|---|---|---|
| 导入 | `use crate::mod;` | `const m = @import("mod.zig");` |
| 可见性 | `pub`/`pub(crate)` | `pub`（无 crate 级；通过文件结构与门面控制） |
| 模块入口 | `mod.rs/lib.rs` | `mod.zig/lib.zig`（约定俗成） |
| 展开命名空间 | `use m::*;` | `usingnamespace m;` |

心智模型：Zig 倾向“少一些魔法，多一些显式”。结构清楚、定位容易、IDE 友好。

## 练习
1) 把一组相关函数移入 `math.zig`，在 `main.zig` 用 `@import` 调用。
2) 写一个 `mod.zig` 作为目录聚合入口，使用 `usingnamespace` 在上层直接访问子模块符号。
3) 把某些内部辅助函数改为私有，公开稳定的 `pub` API 并编写示例代码。