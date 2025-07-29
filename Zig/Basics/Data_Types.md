# Zig 的数据类型 (Data Types)

聊聊 Zig 里的**数据类型 (Data Types)**。

**核心概念：类型告诉 Zig 这是啥**

想象一下你在整理一个工具箱，里面有螺丝刀、锤子、扳手。每个工具都有特定的用途：螺丝刀用来拧螺丝，锤子用来敲钉子，扳手用来拧螺母。如果你拿锤子去拧螺丝，肯定不行对吧？

编程也是一样的道理。你要处理各种数据：数字、文字、真假判断。你得告诉 Zig 每个数据是"什么种类"的，它才知道怎么操作这些数据。比如，数字可以加减乘除，文字可以拼接，但你不能拿文字去做乘法运算。**数据类型**就是给数据贴上的"身份标签"。

**静态类型语言 (Statically Typed)**

Zig 是一种**静态类型**语言。这意味着**在程序运行之前（也就是编译的时候）**，Zig 编译器**必须**知道你程序里**所有变量**的类型是什么。

*   **类型推断 (Type Inference):** 大多数时候，Zig 很聪明。你写 `const x = 5;`，它看到 `5` 是个整数，就能**推断**出 `x` 应该是整数类型。你写 `const name = "Alice";`，它看到 `"Alice"` 是个字符串，就能推断出 `name` 的类型。

*   **需要类型注解 (Type Annotation):** 但有时候，Zig 自己也搞不清楚你到底想要哪种类型。这时候，你就必须用冒号 `:` 加上明确的类型来告诉编译器你的意图：

    ```zig
    const std = @import("std");
    
    pub fn main() !void {
        // Zig 能推断出这是 comptime_int 类型
        const score = 100;
        
        // 但这里我们需要明确指定类型
        var level: u8 = 10;  // 明确告诉 Zig 这是 u8 类型
        var temperature: i32 = -5;  // 明确告诉 Zig 这是 i32 类型
        
        std.debug.print("Score: {}, Level: {}, Temperature: {}\n", .{ score, level, temperature });
    }
    ```

**Zig 类型系统的特色**

与 C、Rust、Go 相比，Zig 的类型系统有几个独特之处：

*   **精确的位宽控制：** Zig 允许你指定任意位宽的整数，比如 `u3`（3位无符号整数）、`i17`（17位有符号整数）。这在底层编程中非常有用。
*   **编译时类型：** Zig 有 `comptime_int` 和 `comptime_float` 这样的编译时类型，它们在编译时就能确定值。
*   **显式类型转换：** Zig 不会自动进行类型转换，所有转换都必须显式进行，这避免了很多隐藏的 bug。

## 标量类型 (Scalar Types)

Zig 的标量类型代表**单个**值。主要包括：

### 1. 整数类型 (Integer Types)

整数就是没有小数部分的数字，就像你数苹果时用的数字：1、2、3...

#### 有符号整数 (Signed Integers)

有符号整数可以表示正数、负数和零，就像温度计一样，可以显示零上和零下的温度。

*   **标准类型：** `i8`, `i16`, `i32`, `i64`, `i128`
*   **任意位宽：** `i1` 到 `i65535`（Zig 的特色功能）
*   **架构相关：** `isize`（大小取决于你的电脑是 32 位还是 64 位）

**取值范围：** 对于 `iN` 类型，范围是 `-(2^(N-1))` 到 `2^(N-1) - 1`

```zig
const std = @import("std");

pub fn main() !void {
    // 常用的有符号整数类型
    var small: i8 = -128;      // 范围: -128 到 127
    var medium: i32 = -2000;   // 范围: -2,147,483,648 到 2,147,483,647
    var large: i64 = -9000000; // 范围: 非常大的负数到正数
    
    // Zig 的特色：任意位宽整数
    var tiny: i3 = -4;         // 范围: -4 到 3 (只用 3 位)
    var custom: i17 = -65000;  // 范围: -65,536 到 65,535 (用 17 位)
    
    std.debug.print("small: {}, medium: {}, large: {}\n", .{ small, medium, large });
    std.debug.print("tiny: {}, custom: {}\n", .{ tiny, custom });
}
```

#### 无符号整数 (Unsigned Integers)

无符号整数只能表示零和正数，就像计数器一样，不能倒退到负数。

*   **标准类型：** `u8`, `u16`, `u32`, `u64`, `u128`
*   **任意位宽：** `u1` 到 `u65535`
*   **架构相关：** `usize`（常用于数组索引和内存大小）

**取值范围：** 对于 `uN` 类型，范围是 `0` 到 `2^N - 1`

```zig
const std = @import("std");

pub fn main() !void {
    // 常用的无符号整数类型
    var byte: u8 = 255;        // 范围: 0 到 255 (常用于字节操作)
    var count: u32 = 4000000;  // 范围: 0 到 4,294,967,295
    var huge: u64 = 18000000000000000000; // 范围: 0 到非常大的正数
    
    // 任意位宽的例子
    var flag: u1 = 1;          // 只能是 0 或 1 (1 位)
    var rgb: u24 = 0xFF5733;   // 24 位，常用于颜色值
    
    // usize 用于数组索引和内存大小
    var index: usize = 42;
    var array_size: usize = 1000;
    
    std.debug.print("byte: {}, count: {}, huge: {}\n", .{ byte, count, huge });
    std.debug.print("flag: {}, rgb: 0x{X}, index: {}\n", .{ flag, rgb, index });
}
```#### 整数字面量
 (Integer Literals)

Zig 支持多种进制的整数字面量：

```zig
const std = @import("std");

pub fn main() !void {
    // 十进制 (默认)
    const decimal = 42;
    const big_number = 1_000_000;  // 下划线用于提高可读性
    
    // 十六进制 (以 0x 开头)
    const hex = 0xFF;              // 255
    const color = 0x00FF00;        // 绿色的 RGB 值
    
    // 八进制 (以 0o 开头)
    const octal = 0o755;           // 493 (Unix 文件权限)
    
    // 二进制 (以 0b 开头)
    const binary = 0b1010;         // 10
    const flags = 0b1111_0000;     // 240，下划线提高可读性
    
    std.debug.print("decimal: {}, hex: {}, octal: {}, binary: {}\n", 
                    .{ decimal, hex, octal, binary });
}
```

#### 整数溢出处理

Zig 对整数溢出的处理非常严格，这是它的安全特性之一：

```zig
const std = @import("std");

pub fn main() !void {
    // Debug 模式下，溢出会导致程序崩溃
    var small: u8 = 255;
    // small += 1;  // 这会在 debug 模式下崩溃！
    
    // 使用 Zig 的溢出处理函数
    const result1 = @addWithOverflow(small, 1);  // 返回 {value, overflow_bit}
    std.debug.print("255 + 1 = {}, overflow: {}\n", .{ result1[0], result1[1] });
    
    // 环绕加法 (wrapping add)
    const wrapped = small +% 1;  // 结果是 0，不会崩溃
    std.debug.print("255 +%% 1 = {}\n", .{wrapped});
    
    // 饱和加法 (saturating add)
    const saturated = std.math.add(u8, small, 1) catch 255;  // 达到最大值就停止
    std.debug.print("saturated add: {}\n", .{saturated});
}
```

### 2. 浮点数类型 (Floating-Point Types)

浮点数就像小数，可以表示带小数点的数值，比如身高 1.75 米、圆周率 3.14159。

Zig 提供了多种精度的浮点数类型：

*   `f16`: 半精度浮点数（16位）
*   `f32`: 单精度浮点数（32位）
*   `f64`: 双精度浮点数（64位）
*   `f128`: 四倍精度浮点数（128位）

```zig
const std = @import("std");

pub fn main() !void {
    // 不同精度的浮点数
    const half: f16 = 3.14;           // 半精度，节省内存但精度较低
    const single: f32 = 3.14159;      // 单精度，常用于图形计算
    const double: f64 = 3.14159265359; // 双精度，科学计算常用
    const quad: f128 = 3.1415926535897932384626433832795; // 四倍精度，极高精度
    
    // 科学记数法
    const large: f64 = 1.23e10;       // 1.23 × 10^10
    const small: f64 = 4.56e-8;       // 4.56 × 10^-8
    
    // 特殊值
    const infinity = std.math.inf(f64);
    const neg_infinity = -std.math.inf(f64);
    const not_a_number = std.math.nan(f64);
    
    std.debug.print("half: {d:.2}, single: {d:.5}, double: {d:.11}\n", 
                    .{ half, single, double });
    std.debug.print("large: {e}, small: {e}\n", .{ large, small });
    std.debug.print("inf: {}, -inf: {}, nan: {}\n", 
                    .{ infinity, neg_infinity, not_a_number });
}
```

#### 浮点数运算和精度

```zig
const std = @import("std");

pub fn main() !void {
    // 基本运算
    const a: f64 = 10.5;
    const b: f64 = 3.2;
    
    const sum = a + b;        // 加法
    const diff = a - b;       // 减法
    const product = a * b;    // 乘法
    const quotient = a / b;   // 除法
    const remainder = @mod(a, b); // 取模运算
    
    std.debug.print("sum: {d:.2}, diff: {d:.2}, product: {d:.2}\n", 
                    .{ sum, diff, product });
    std.debug.print("quotient: {d:.2}, remainder: {d:.2}\n", 
                    .{ quotient, remainder });
    
    // 浮点数精度问题演示
    const x: f32 = 0.1;
    const y: f32 = 0.2;
    const z = x + y;
    std.debug.print("0.1 + 0.2 = {d:.17}\n", .{z}); // 可能不等于 0.3
    
    // 浮点数比较应该使用误差范围
    const epsilon: f32 = 1e-6;
    const expected: f32 = 0.3;
    if (@abs(z - expected) < epsilon) {
        std.debug.print("结果在误差范围内等于 0.3\n");
    }
}
```

### 3. 布尔类型 (Boolean Type)

布尔类型就像开关，只有两种状态：开（`true`）和关（`false`）。

```zig
const std = @import("std");

pub fn main() !void {
    // 基本布尔值
    const is_zig_awesome: bool = true;
    const is_learning_hard: bool = false;
    
    // 布尔运算
    const and_result = is_zig_awesome and is_learning_hard;  // false
    const or_result = is_zig_awesome or is_learning_hard;    // true
    const not_result = !is_learning_hard;                    // true
    
    std.debug.print("Zig is awesome: {}\n", .{is_zig_awesome});
    std.debug.print("AND result: {}, OR result: {}, NOT result: {}\n", 
                    .{ and_result, or_result, not_result });
    
    // 条件判断中的使用
    if (is_zig_awesome) {
        std.debug.print("Let's continue learning Zig!\n");
    }
    
    // 比较运算返回布尔值
    const a = 10;
    const b = 20;
    const is_equal = (a == b);        // false
    const is_greater = (a > b);       // false
    const is_less_equal = (a <= b);   // true
    
    std.debug.print("a == b: {}, a > b: {}, a <= b: {}\n", 
                    .{ is_equal, is_greater, is_less_equal });
}
```

### 4. 字符和字符串

#### 字符 (Characters)

在 Zig 中，单个字符实际上就是 `u8` 类型，表示一个字节的 ASCII 值：

```zig
const std = @import("std");

pub fn main() !void {
    // 字符字面量用单引号
    const letter: u8 = 'A';           // ASCII 值 65
    const digit: u8 = '9';            // ASCII 值 57
    const symbol: u8 = '@';           // ASCII 值 64
    
    // 也可以直接用 ASCII 值
    const letter_by_value: u8 = 65;   // 等同于 'A'
    
    std.debug.print("Letter: {} (ASCII: {})\n", .{ letter, letter });
    std.debug.print("Digit: {} (ASCII: {})\n", .{ digit, digit });
    std.debug.print("Symbol: {} (ASCII: {})\n", .{ symbol, symbol });
    
    // 字符运算
    const next_letter = letter + 1;   // 'B' (ASCII 66)
    std.debug.print("Next letter: {} (ASCII: {})\n", .{ next_letter, next_letter });
}
```

#### 字符串 (Strings)

Zig 中的字符串是 `[]const u8` 类型，即字节数组：

```zig
const std = @import("std");

pub fn main() !void {
    // 字符串字面量用双引号
    const greeting: []const u8 = "Hello, Zig!";
    const name = "Alice";  // 类型推断为 []const u8
    
    // 字符串长度
    std.debug.print("Greeting: {s}, length: {}\n", .{ greeting, greeting.len });
    std.debug.print("Name: {s}, length: {}\n", .{ name, name.len });
    
    // 访问字符串中的字符
    const first_char = greeting[0];   // 'H' (ASCII 72)
    const last_char = greeting[greeting.len - 1]; // '!' (ASCII 33)
    
    std.debug.print("First char: {} ({}), Last char: {} ({})\n", 
                    .{ first_char, first_char, last_char, last_char });
    
    // 字符串切片
    const hello = greeting[0..5];     // "Hello"
    const zig = greeting[7..10];      // "Zig"
    
    std.debug.print("Hello: {s}, Zig: {s}\n", .{ hello, zig });
}
```

### 5. void 类型

`void` 类型表示"没有值"，就像一个空盒子：

```zig
const std = @import("std");

// 不返回任何值的函数
fn print_message() void {
    std.debug.print("This function returns nothing\n");
}

// 返回 void 的函数可以省略返回类型
fn another_function() {
    std.debug.print("Return type is implicitly void\n");
}

pub fn main() !void {
    // 调用 void 函数
    print_message();
    another_function();
    
    // void 值本身
    const nothing: void = {};
    _ = nothing; // 避免未使用变量警告
    
    std.debug.print("void value size: {} bytes\n", .{@sizeOf(void)});
}
```## 类型转换 (Ty
pe Conversion)

Zig 不会自动进行类型转换，所有转换都必须显式进行：

```zig
const std = @import("std");

pub fn main() !void {
    // 整数类型转换
    const small: u8 = 42;
    const large: u32 = @intCast(small);  // u8 -> u32，安全转换
    
    // 可能失败的转换
    const big: u32 = 300;
    const back_to_small: u8 = @intCast(big); // 运行时可能崩溃，因为 300 > 255
    
    // 浮点数转换
    const float_val: f32 = 3.14;
    const double_val: f64 = @floatCast(float_val);  // f32 -> f64
    
    // 整数和浮点数之间的转换
    const int_val: i32 = 42;
    const float_from_int: f32 = @floatFromInt(int_val);  // i32 -> f32
    const int_from_float: i32 = @intFromFloat(float_from_int); // f32 -> i32 (截断小数)
    
    std.debug.print("small: {}, large: {}\n", .{ small, large });
    std.debug.print("float_val: {d:.2}, double_val: {d:.2}\n", .{ float_val, double_val });
    std.debug.print("int_val: {}, float_from_int: {d:.1}, int_from_float: {}\n", 
                    .{ int_val, float_from_int, int_from_float });
}
```

## 与其他语言的对比

### 与 C 语言对比

| 特性 | C | Zig |
|------|---|-----|
| 整数类型 | `int`, `long`, `short` (大小不确定) | `i32`, `i64`, `i16` (大小明确) |
| 字符 | `char` (可能有符号或无符号) | `u8` (明确无符号) |
| 布尔 | `int` (0为假，非0为真) | `bool` (只有 `true` 和 `false`) |
| 类型转换 | 隐式转换（容易出错） | 显式转换（更安全） |

### 与 Rust 对比

| 特性 | Rust | Zig |
|------|------|-----|
| 整数类型 | `i32`, `u64` 等 | `i32`, `u64` 等 + 任意位宽 |
| 字符 | `char` (Unicode, 4字节) | `u8` (ASCII, 1字节) |
| 字符串 | `String`, `&str` | `[]u8`, `[]const u8` |
| 类型推断 | 强大的类型推断 | 基本的类型推断 |

### 与 Go 对比

| 特性 | Go | Zig |
|------|----|----|
| 整数类型 | `int`, `int32`, `int64` | `i32`, `i64` + 任意位宽 |
| 浮点数 | `float32`, `float64` | `f32`, `f64` + `f16`, `f128` |
| 类型转换 | 显式转换 | 显式转换 |
| 零值 | 每种类型都有零值 | 需要显式初始化 |

## 常见错误和调试技巧

### 1. 类型不匹配错误

```zig
// 错误示例
// const a: u8 = 300;  // 编译错误：300 超出 u8 范围

// 正确做法
const a: u16 = 300;  // 使用更大的类型
// 或者
const b: u8 = @intCast(300 % 256);  // 显式转换并处理溢出
```

### 2. 整数溢出

```zig
const std = @import("std");

pub fn main() !void {
    var counter: u8 = 255;
    
    // 错误：可能导致溢出崩溃
    // counter += 1;
    
    // 正确：使用溢出检查
    if (@addWithOverflow(counter, 1)[1] == 1) {
        std.debug.print("Overflow detected!\n");
    } else {
        counter = @addWithOverflow(counter, 1)[0];
    }
    
    // 或者使用环绕运算
    counter = counter +% 1;  // 结果是 0
    std.debug.print("Counter after wrap: {}\n", .{counter});
}
```

### 3. 浮点数精度问题

```zig
const std = @import("std");

pub fn main() !void {
    const a: f32 = 0.1;
    const b: f32 = 0.2;
    const sum = a + b;
    
    // 错误：直接比较浮点数
    // if (sum == 0.3) { ... }
    
    // 正确：使用误差范围比较
    const epsilon: f32 = 1e-6;
    if (@abs(sum - 0.3) < epsilon) {
        std.debug.print("Sum is approximately 0.3\n");
    }
}
```

### 4. 字符串处理常见错误

```zig
const std = @import("std");

pub fn main() !void {
    const text = "Hello";
    
    // 错误：越界访问
    // const char = text[10];  // 运行时崩溃
    
    // 正确：检查边界
    if (text.len > 10) {
        const char = text[10];
        std.debug.print("Char at index 10: {}\n", .{char});
    } else {
        std.debug.print("Index 10 is out of bounds\n");
    }
    
    // 安全的字符串操作
    for (text, 0..) |char, i| {
        std.debug.print("text[{}] = {} ('{c}')\n", .{ i, char, char });
    }
}
```

## 实践建议

1. **选择合适的整数类型：** 
   - 用 `u8` 处理字节数据
   - 用 `usize` 处理数组索引和内存大小
   - 用 `i32` 作为通用有符号整数
   - 需要特定位宽时使用任意位宽类型

2. **浮点数使用建议：**
   - 一般计算用 `f64`（精度更高）
   - 内存敏感场景用 `f32`
   - 比较浮点数时总是使用误差范围

3. **类型转换最佳实践：**
   - 总是使用显式转换函数
   - 考虑转换可能失败的情况
   - 在转换前检查值的范围

4. **调试技巧：**
   - 使用 `@TypeOf()` 查看变量类型
   - 使用 `@sizeOf()` 查看类型大小
   - 在 debug 模式下运行以捕获溢出错误

## 总结

Zig 的数据类型系统设计精巧且安全：

*   **精确控制：** 任意位宽整数让你精确控制内存使用
*   **类型安全：** 显式类型转换避免隐藏的 bug
*   **性能导向：** 编译时类型检查，运行时零开销
*   **简单明了：** 类型名称直观，容易理解和记忆

掌握这些基本数据类型是学好 Zig 的基础。记住：Zig 追求的是明确性和安全性，虽然需要写更多的代码，但能帮你避免很多运行时错误。