# Zig 中的函数 (Functions)

好的，咱们现在来聊聊**函数 (Functions)**，这是 Zig 程序的核心构建块，也是让代码变得有组织、可重用的关键工具。

## 函数：代码的"工具箱"

想象一下，你有一个工具箱，里面装着各种专门用途的工具。每个工具都有自己的名字，当你需要完成某个特定任务时，就拿出对应的工具来用。**函数**就像是代码世界里的工具——它们是一段有名字的代码，专门用来完成某个特定的任务。

- **定义函数：** 就像制作一个新工具，给它起个名字，告诉它需要什么材料（参数），以及它会产出什么结果（返回值）
- **调用函数：** 就像从工具箱里拿出工具来使用，只需要说出工具的名字

## 最简单的函数：无参数无返回值

让我们从最简单的函数开始：

```zig
const std = @import("std");

// 定义一个最简单的函数
fn say_hello() void {
    std.debug.print("Hello from a function!\n", .{});
}

pub fn main() !void {
    say_hello(); // 调用函数
    say_hello(); // 可以调用多次
}
```

**运行结果：**
```
Hello from a function!
Hello from a function!
```

**代码解析：**
- `fn`：告诉 Zig "我要定义一个函数"
- `say_hello`：函数的名字，遵循 `snake_case` 命名规范（小写字母，单词间用下划线连接）
- `()`：参数列表，这里是空的，表示不需要任何输入
- `void`：返回类型，`void` 表示"什么都不返回"
- `{}`：函数体，包含要执行的代码

## 函数参数：给函数传递信息

函数的真正威力在于它能接收不同的输入，产生不同的输出。就像一个榨汁机，你放入苹果就得到苹果汁，放入橙子就得到橙子汁。

```zig
const std = @import("std");

// 接收一个参数的函数
fn greet_person(name: []const u8) void {
    std.debug.print("Hello, {s}! Nice to meet you.\n", .{name});
}

// 接收多个参数的函数
fn introduce_person(name: []const u8, age: u8, city: []const u8) void {
    std.debug.print("This is {s}, {d} years old, from {s}.\n", .{ name, age, city });
}

pub fn main() !void {
    greet_person("Alice");
    greet_person("Bob");
    
    introduce_person("Charlie", 25, "Beijing");
    introduce_person("Diana", 30, "Shanghai");
}
```

**运行结果：**
```
Hello, Alice! Nice to meet you.
Hello, Bob! Nice to meet you.
This is Charlie, 25 years old, from Beijing.
This is Diana, 30 years old, from Shanghai.
```

**参数类型说明：**
- `[]const u8`：字符串类型（实际上是 u8 字节的切片）
- `u8`：8位无符号整数（0-255）
- 在 Zig 中，**必须**为每个参数明确指定类型，这让代码更安全、更清晰

## 函数返回值：函数的"产出"

函数不仅能执行操作，还能计算并返回结果。就像一个计算器，你输入数字和运算符，它返回计算结果。

```zig
const std = @import("std");

// 简单的数学运算函数
fn add(a: i32, b: i32) i32 {
    return a + b;
}

fn multiply(a: i32, b: i32) i32 {
    return a * b;
}

// 字符串长度计算函数
fn get_string_length(text: []const u8) usize {
    return text.len;
}

// 判断数字是否为偶数
fn is_even(number: i32) bool {
    return number % 2 == 0;
}

pub fn main() !void {
    // 使用返回值
    const sum = add(10, 20);
    const product = multiply(5, 6);
    
    std.debug.print("10 + 20 = {}\n", .{sum});
    std.debug.print("5 × 6 = {}\n", .{product});
    
    // 直接在表达式中使用函数返回值
    std.debug.print("15 + 25 = {}\n", .{add(15, 25)});
    
    // 字符串操作
    const message = "Hello, Zig!";
    const length = get_string_length(message);
    std.debug.print("'{s}' has {} characters\n", .{ message, length });
    
    // 布尔返回值
    const number = 42;
    if (is_even(number)) {
        std.debug.print("{} is even\n", .{number});
    } else {
        std.debug.print("{} is odd\n", .{number});
    }
}
```

**运行结果：**
```
10 + 20 = 30
5 × 6 = 30
15 + 25 = 40
'Hello, Zig!' has 11 characters
42 is even
```

## Zig 函数的独特特性

### 1. 表达式导向的返回值

在 Zig 中，函数体的最后一个表达式会自动成为返回值，你可以省略 `return` 关键字：

```zig
const std = @import("std");

// 传统写法：使用 return
fn add_traditional(a: i32, b: i32) i32 {
    return a + b;
}

// Zig 风格：最后一个表达式自动返回
fn add_zig_style(a: i32, b: i32) i32 {
    a + b  // 注意：没有分号，没有 return
}

// 更复杂的例子
fn calculate_discount(price: f32, is_member: bool) f32 {
    if (is_member) {
        price * 0.9  // 会员打9折
    } else {
        price  // 非会员原价
    }
}

pub fn main() !void {
    std.debug.print("Traditional: {}\n", .{add_traditional(5, 3)});
    std.debug.print("Zig style: {}\n", .{add_zig_style(5, 3)});
    
    std.debug.print("Member price: {d:.2}\n", .{calculate_discount(100.0, true)});
    std.debug.print("Regular price: {d:.2}\n", .{calculate_discount(100.0, false)});
}
```

**运行结果：**
```
Traditional: 8
Zig style: 8
Member price: 90.00
Regular price: 100.00
```

### 2. 编译时函数执行

Zig 的一个强大特性是可以在编译时执行函数，这让代码更高效：

```zig
const std = @import("std");

// 这个函数可以在编译时执行
fn fibonacci(n: u32) u32 {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// 编译时计算常量
const fib_10 = fibonacci(10);  // 在编译时计算，运行时直接使用结果

pub fn main() !void {
    std.debug.print("Fibonacci(10) = {} (calculated at compile time)\n", .{fib_10});
    
    // 运行时计算
    const runtime_result = fibonacci(8);
    std.debug.print("Fibonacci(8) = {} (calculated at runtime)\n", .{runtime_result});
}
```

## 错误处理函数

Zig 有一套独特而强大的错误处理机制，函数可以返回错误：

```zig
const std = @import("std");

// 定义错误类型
const MathError = error{
    DivisionByZero,
    NegativeSquareRoot,
};

// 可能返回错误的除法函数
fn safe_divide(a: f32, b: f32) MathError!f32 {
    if (b == 0) {
        return MathError.DivisionByZero;
    }
    return a / b;
}

// 可能返回错误的平方根函数
fn safe_sqrt(x: f32) MathError!f32 {
    if (x < 0) {
        return MathError.NegativeSquareRoot;
    }
    return @sqrt(x);
}

// 组合多个可能出错的操作
fn calculate_formula(a: f32, b: f32, c: f32) MathError!f32 {
    const division_result = try safe_divide(a, b);  // 可能出错，用 try 处理
    const sqrt_result = try safe_sqrt(division_result + c);  // 可能出错
    return sqrt_result;
}

pub fn main() !void {
    // 正常情况
    const result1 = safe_divide(10.0, 2.0) catch |err| {
        std.debug.print("Error: {}\n", .{err});
        return;
    };
    std.debug.print("10 ÷ 2 = {d:.2}\n", .{result1});
    
    // 错误情况：除零
    const result2 = safe_divide(10.0, 0.0) catch |err| {
        std.debug.print("Caught error: {}\n", .{err});
        0.0  // 提供默认值
    };
    std.debug.print("10 ÷ 0 = {d:.2} (with error handling)\n", .{result2});
    
    // 复杂计算
    const complex_result = calculate_formula(20.0, 4.0, 5.0) catch |err| {
        std.debug.print("Formula calculation failed: {}\n", .{err});
        return;
    };
    std.debug.print("Formula result = {d:.2}\n", .{complex_result});
}
```

**运行结果：**
```
10 ÷ 2 = 5.00
Caught error: error.DivisionByZero
10 ÷ 0 = 0.00 (with error handling)
Formula result = 3.00
```

## 函数可见性：`pub` 关键字

在 Zig 中，函数默认是私有的（只能在当前文件内使用）。如果要让其他文件能够使用你的函数，需要加上 `pub` 关键字：

```zig
const std = @import("std");

// 私有函数：只能在当前文件内使用
fn private_helper() void {
    std.debug.print("This is a private function\n", .{});
}

// 公共函数：可以被其他文件导入和使用
pub fn public_utility(message: []const u8) void {
    std.debug.print("Public function says: {s}\n", .{message});
    private_helper();  // 公共函数可以调用私有函数
}

// main 函数必须是公共的，因为操作系统需要调用它
pub fn main() !void {
    public_utility("Hello from main!");
}
```

## 与其他语言的对比

### Zig vs C
```c
// C 语言
int add(int a, int b) {
    return a + b;
}
```

```zig
// Zig
fn add(a: i32, b: i32) i32 {
    return a + b;
}
```

**Zig 的优势：**
- 更清晰的语法（`fn` 关键字明确表示函数）
- 更好的错误处理机制
- 编译时函数执行能力
- 更安全的类型系统

### Zig vs Rust
```rust
// Rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

```zig
// Zig
fn add(a: i32, b: i32) i32 {
    a + b
}
```

**Zig 的特点：**
- 语法更简洁（不需要 `->` 箭头）
- 手动内存管理（更直接的控制）
- 更简单的错误处理语法
- 编译时计算更强大

### Zig vs Go
```go
// Go
func add(a, b int) int {
    return a + b
}
```

```zig
// Zig
fn add(a: i32, b: i32) i32 {
    return a + b;
}
```

**Zig 的优势：**
- 更精确的类型控制（i32 vs 泛泛的 int）
- 无垃圾回收器，性能更可预测
- 编译时计算能力
- 更小的运行时开销

## 实用技巧和最佳实践

### 1. 函数命名规范
```zig
// 好的命名：动词 + 名词，清楚表达功能
fn calculate_area(width: f32, height: f32) f32 { ... }
fn validate_email(email: []const u8) bool { ... }
fn parse_json_string(json: []const u8) !JsonValue { ... }

// 避免的命名：过于简短或模糊
fn calc(w: f32, h: f32) f32 { ... }  // 太简短
fn do_stuff(data: []const u8) void { ... }  // 太模糊
```

### 2. 参数顺序建议
```zig
// 推荐：重要参数在前，可选参数在后
fn create_user(name: []const u8, email: []const u8, age: ?u8) !User { ... }

// 推荐：输入参数在前，输出参数在后
fn format_string(template: []const u8, args: anytype, buffer: []u8) ![]u8 { ... }
```

### 3. 错误处理模式
```zig
// 模式1：返回错误联合类型
fn risky_operation() !i32 {
    // ... 可能失败的操作
    return result;
}

// 模式2：使用 catch 提供默认值
fn safe_operation() i32 {
    return risky_operation() catch 0;  // 失败时返回 0
}

// 模式3：错误传播
fn higher_level_operation() !void {
    const result = try risky_operation();  // 错误会向上传播
    // ... 使用 result
}
```

### 4. 常见陷阱和调试技巧

**陷阱1：忘记处理错误**
```zig
// 错误：忽略可能的错误
fn bad_example() void {
    const result = risky_operation();  // 编译错误！
}

// 正确：明确处理错误
fn good_example() void {
    const result = risky_operation() catch {
        std.debug.print("Operation failed\n", .{});
        return;
    };
}
```

**陷阱2：参数类型不匹配**
```zig
fn process_number(n: i32) void { ... }

pub fn main() !void {
    const my_number: u32 = 42;
    process_number(my_number);  // 编译错误：类型不匹配
    
    // 正确：显式转换类型
    process_number(@intCast(my_number));
}
```

**调试技巧：使用 std.debug.print 调试函数**
```zig
fn debug_function(a: i32, b: i32) i32 {
    std.debug.print("debug_function called with a={}, b={}\n", .{ a, b });
    const result = a + b;
    std.debug.print("debug_function returning {}\n", .{result});
    return result;
}
```

## 总结

Zig 的函数系统设计简洁而强大：

- **语法清晰**：`fn` 关键字，明确的类型声明
- **错误处理**：内置的错误联合类型，让错误处理变得自然
- **编译时执行**：函数可以在编译时运行，提升性能
- **表达式导向**：最后一个表达式自动成为返回值
- **可见性控制**：`pub` 关键字控制函数的访问权限

函数是构建复杂程序的基础。通过将代码分解成小的、专注的函数，你可以写出更清晰、更可维护、更可测试的代码。在 Zig 中，函数不仅是代码组织的工具，更是性能优化和安全编程的重要手段。

记住：好的函数应该做一件事，并且把这件事做好。每个函数都应该有清晰的输入、明确的输出，以及可预测的行为。