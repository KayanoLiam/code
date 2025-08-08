# 内存与分配器 (Allocators)

Zig 没有 GC。动态内存来自“分配器 (Allocator)”，你决定在何处、何时、以何种策略分配/释放。这更接近 C，但 Zig 提供了统一接口和安全语法，让这件事可控、可测试。

与 Rust 的 `Box/Vec` 这种“所有权即策略”不同，Zig 把“策略”抽象成分配器，你把它注入到需要动态内存的组件中。

## 分配器总览

标准库提供多种分配器（均实现 `std.mem.Allocator` 接口）：
- GeneralPurposeAllocator (GPA)：通用堆分配器，适合大多数应用；可开启泄漏检测
- ArenaAllocator：一次性批量释放，适合构建树/AST/短命对象图
- FixedBufferAllocator：在固定缓冲区里分配；零系统调用、超快，受容量限制
- PageAllocator：系统页分配；底层、较少直接使用

建议：业务代码接受“分配器参数”，由上层决定具体策略。

## 基础用法：GPA

```zig
const std = @import("std");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();                    // 可选：打印泄漏摘要
    const allocator = gpa.allocator();

    const msg = try allocator.dupe(u8, "hello allocator");
    defer allocator.free(msg);

    std.debug.print("{s}\n", .{msg});
}
```

要点：
- `defer`/`errdefer` 保证异常路径也能释放
- `dupe(T, slice)` 复制一份切片
- `alloc(T, n)` / `realloc` / `free` 是通用三件套

## Arena：一次性释放

```zig
const std = @import("std");

pub fn main() !void {
    var arena_state = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena_state.deinit();                // 一次性释放全部
    const arena = arena_state.allocator();

    const a = try arena.alloc(u32, 1_000);
    const b = try arena.dupe(u8, "parse-heavy-workload");
    _ = a; _ = b; // 使用它们
}
```

适合“构建期大量小对象，生命周期一致”的场景（如解析器、模板渲染）。无需手工 `free`，但要避免长生命周期持有指向 Arena 的指针。

## FixedBuffer：受控高速小池

```zig
const std = @import("std");

pub fn main() !void {
    var storage: [1024]u8 = undefined;                         // 固定缓冲
    var fba = std.heap.FixedBufferAllocator.init(&storage);
    const alloc = fba.allocator();

    const s = try alloc.dupe(u8, "fast and bounded");
    // 注意：超出容量会返回错误（捕获并降级策略）
}
```

适合“热路径、已知上界”的临时对象分配。可作为函数内部的小池来避免堆抖动。

## 通用 API 速查

```zig
const std = @import("std");

fn demo(allocator: std.mem.Allocator) !void {
    const n = 5;
    var buf = try allocator.alloc(u8, n);
    errdefer allocator.free(buf);

    // 写入
    for (buf, 0..) |_, i| buf[i] = @intCast(i);

    // 扩容（可能移动）
    buf = try allocator.realloc(buf, 2 * n);

    allocator.free(buf);  // 正常路径释放
}
```

规则：
- 谁分配，谁释放；调用方与被调方要约定好所有权
- `realloc` 可能挪动内存，旧指针失效
- 出错路径确保 `errdefer` 覆盖所有已分配对象

## 与容器协作

标准库容器都需要传入 `Allocator`：

```zig
const std = @import("std");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const alloc = gpa.allocator();

    var list = std.ArrayList(u32).init(alloc);
    defer list.deinit();                 // 释放内部缓冲

    try list.append(42);
    try list.appendSlice(&[_]u32{ 1,2,3 });

    std.debug.print("items={any}\n", .{list.items});
}
```

容器负责内部缓冲的释放（`deinit`），但你负责容器自身的生命周期管理。

## 调试与泄漏检测

```zig
var gpa = std.heap.GeneralPurposeAllocator(.{ .enable_allocator_tracing = true }){};
defer if (gpa.deinit() == .leak) @panic("memory leaked");
```

- 开启 tracing/安全检查，开发阶段能捕获泄漏
- 生产环境可关闭以减少开销

## 错误模式与最佳实践

- 明确所有权：函数签名体现“谁释放”
  - 由调用方释放：返回 `![]T` 并注明“使用完需 `allocator.free`”
  - 由被调方持有：返回只读视图 `[]const T` 指向内部缓冲，但需清晰文档
- 用 `errdefer` 铺好每一步分配后的回滚路线
- 热路径优先 FixedBuffer/arena；通用路径用 GPA
- 避免跨分配器混用对象：谁分配，用同一个释放

## 与 Rust 的对照

| 主题 | Rust | Zig |
|---|---|---|
| 动态分配入口 | `Box/Vec/String` 隐含默认分配器 | 显式 `Allocator` 参数 |
| 自定义策略 | 需引入自定义 alloc crate/全局替换 | 注入不同分配器实例即可 |
| 释放时机 | 所有权/生命周期自动管理 | 手动调用 `free/deinit` 或一次性回收 |
| 调试泄漏 | `Drop` 可搭配 RAII 检测 | GPA tracing + `deinit()` 返回状态 |

心智模型：Zig 给你“控制”，Rust 给你“所有权系统”。Zig 通过统一分配器接口把“控制”变得结构化。

## 练习
1) 把一段解析流程改为使用 `ArenaAllocator`，对比 `free` 点数量变化。
2) 用 `FixedBufferAllocator` 实现一个带上界的短字符串拼接函数，超界返回错误。
3) 写一个组件，构造时接受 `Allocator`，对比注入 GPA 与 FBA 的性能差异。