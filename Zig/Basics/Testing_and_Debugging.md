# 测试与调试 (std.testing)

Zig 内置一流的测试支持：无需外部框架，写在 `.zig` 文件里，`zig test` 直接运行。风格和 Rust 的 `cargo test` 类似：以声明式 `test` 块组织、断言 API 完整、还支持基准与内存检测。

## 最小示例：`test` 块

```zig
const std = @import("std");

fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "add works" {
    try std.testing.expect(add(2, 3) == 5);
}
```

运行：
```bash
zig test path/to/file.zig
```

要点：
- `test "name" { ... }` 定义一个测试用例，名字随意
- 断言常用 `std.testing.expect`/`expectEqual`
- 测试体支持 `try`，一旦断言失败或错误向上传播，测试用例失败

## 常用断言

```zig
const std = @import("std");

fn square(x: i32) i32 { return x * x; }

test "assertions" {
    try std.testing.expect(true);
    try std.testing.expectEqual(@as(i32, 9), square(3));

    // 字节切片比较（字符串）
    try std.testing.expectEqualStrings("zig", "z" ++ "ig");
}
```

- `expectEqual(expected, actual)`：值相等
- `expectEqualStrings(a, b)`：字节切片（字符串）相等
- 更多：`expectError`、`expectApproxEqAbs`（浮点近似）、`expectFmt` 等

## 结构化测试：表驱动

```zig
const std = @import("std");

fn is_even(x: i32) bool { return x % 2 == 0; }

test "table-driven" {
    const cases = [_]struct{ x: i32, want: bool }{
        .{ .x = -2, .want = true },
        .{ .x = -1, .want = false },
        .{ .x = 0,  .want = true },
        .{ .x = 7,  .want = false },
    };

    for (cases) |c| {
        try std.testing.expectEqual(c.want, is_even(c.x));
    }
}
```

表驱动（table-driven）的风格和 Rust/Go 一样，稳定可靠且可读。

## 资源管理：分配器与清理

```zig
const std = @import("std");

fn make_copy(allocator: std.mem.Allocator, s: []const u8) ![]u8 {
    return try allocator.dupe(u8, s);
}

test "allocator usage in tests" {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const alloc = gpa.allocator();

    const copy = try make_copy(alloc, "hello");
    defer alloc.free(copy);

    try std.testing.expectEqualStrings("hello", copy);
}
```

测试里同样遵守“谁分配谁释放”，用 `defer/errdefer` 保证异常也能清理。

## 失败与日志

```zig
const std = @import("std");

fn div(a: i32, b: i32) !i32 {
    if (b == 0) return error.DivByZero;
    return a / b;
}

test "errors and logs" {
    const res = div(10, 0);
    try std.testing.expectError(error.DivByZero, res);

    std.log.warn("this is a warning during test", .{});
}
```

- `expectError(err, expr)`：断言表达式返回某错误
- 输出日志：默认测试模式也会打印日志（可通过 `-Dlog-level` 控制）

## 组织方式：专门测试文件 vs 就地测试

- 小函数/模块：直接在同文件写 `test` 块（就地测试）
- 大项目：创建 `tests/` 或 `*_test.zig`，用多文件运行 `zig test`（或在 `build.zig` 中定义 test 步骤）

示例 `build.zig` 测试条目（片段）：
```zig
const std = @import("std");

pub fn build(b: *std.build.Builder) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const unit_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });
    const run_tests = b.addRunArtifact(unit_tests);
    b.default_step.dependOn(&run_tests.step);
}
```

## 基准（简单方式）

```zig
const std = @import("std");

fn work(n: u64) u64 {
    var acc: u64 = 0;
    var i: u64 = 0;
    while (i < n) : (i += 1) acc +%= i;
    return acc;
}

test "micro bench" {
    var timer = try std.time.Timer.start();
    _ = work(10_000);
    const ns = timer.read();
    std.debug.print("elapsed={}ns\n", .{ns});
}
```

对于更严格的基准，建议独立二进制 + 重复多次取统计。

## 调试技巧

- `std.debug.print`：打印任意类型 `{any}`、字符串 `{s}`、数字 `{d}`
- `std.debug.assert(cond)`：条件不满足直接 panic
- `@panic("msg")`：立即崩溃，打印栈
- `@compileLog(...)`：编译期打印（配合 comptime 分析）

## 与 Rust 的对照

| 主题 | Rust | Zig |
|---|---|---|
| 单元测试 | `#[test]` + `cargo test` | `test` 块 + `zig test` |
| 断言 | `assert_eq!` 等 | `std.testing.expect*` 系列 |
| 基准 | `criterion` 等 | 计时器/自建 harness |
| 资源管理 | Drop 自动清理 | `defer/errdefer` 明确清理 |

心智模型：Zig 测试直观、轻量，最重要的是“就地测试”让你离实现最近。

## 练习
1) 用表驱动写一个 `parse_int` 的全覆盖测试，包含边界、错误分支与大数。
2) 写一个 `ArenaAllocator` 驱动的构建器，并在测试里断言 `deinit()` 无泄漏。
3) 把某个 `build.zig` 增加 `test` 步骤，作为默认 step 运行。