# 变量和常量 (Variables and Constants)

y)**。

## 概念引入：数据的"容器"

想象一下你的桌子上有两种盒子：

- **保险箱 (`const`)**: 一旦把东西放进去就锁死


在 Zig 中，我们用名字来代表数据，方便以后使用。这

## Zig 的设计哲学：默认不可变

与很多其他语言不同，Zig 鼓励你**默认使用常量**。这不

想象一下，如果程序的某以：


2. **更容易推理代码**: 当你看到 `const x = 5;`会变
3. **有助于性能优化**: 编译器知道这些值不会改变，可以进行更激进的优化
4

选择

安全。

g
const std = @import(");

pub fn{
    // 声明一个常量 `pancakes_count`，它的值是 12
   = 12;
 
    // 打印出来
});
    

    //stant
}
``

**运行结果：**
```
I ate 12 pancakes.


### 编译时常量 vs 运行时常量

一个重要区别：

#### 1. 编译时常量 (Compile-titants)

这它们：

g
const std"std");

// 编译时常量 - 在编译时就能计算出结果
const SECONDS_PER_HOU600，编译时计算
常数
const MAX_P游戏配置

pub fn main() !void {
;
    std.debug.print("圆周率: {d:.5}\n", .{PI});
    std.debug.print("最大玩家数: {}\n", .{MAX_PLAYERS});
}
```

**运行结果：**
```
一小时有 3600 秒
``` false
运行:4.3
是否
华氏温度: 7
```
计数器: 1*：*行结果

**运
```});
}.{is_running, : {}\n"("是否运行.print   std.debug);
 temperature}}\n", .{d:.1"华氏温度: {(ntug.pridebtd.
    snter});", .{cou数器: {}\nint("计.debug.pr  std    
  alse;
ing = fis_runn转华氏度
    32;  // 摄氏度 1.8 +  *temperaturemperature = te+= 1;
        counter 
使用演示不同类型的    //   
！
  2;  // 编译错误 = 4ystery_valuer mva// 误）
    致编译错有指定类型（这会导    // 错误：没;
    
 = true: bools_running
    var i64 = 23.5;erature: f  var temp = 0;
  er: u32ar count型
    v指定类    // 正确：明确() !void {

pub fn maintd");
rt("simpoonst std = @`zig
c底是什么。

``这个变量到想清楚是为了让你在写代码时就ar` 进行类型推断，这g 不会对 `v比如 `i32`）。Zi类型（必须**明确指定它的明变量时，**` 声`var型

使用 ：必须明确类 重要特性

###值: 70
```生命 60
恢复后的现在是:又受伤了！玩家生命值80
是: 命值现在呀！玩家生值: 100
哎
```
玩家生命
**运行结果：**```
th});
}
al, .{he生命值: {}\n"t("恢复后的prindebug. std.  
 恢复一些生命值/  /th += 10; eal算
    h// 可以进行各种运    );
    
h}", .{healt: {}\n在是！玩家生命值现伤了t("又受d.debug.prin 20;
    st -althlth = he    hea
    // 再次改变  
lth});
  \n", .{hea是: {}哎呀！玩家生命值现在rint("debug.ptd.    s = 80;
alth少
    he值减到攻击，生命
    // 受lth});
     .{hea}\n",("玩家生命值: {g.print  std.debu100;
  alth: i32 =    var he
 h`，初始值是 100healt明一个变量 ` 声 //  ) !void {
 ain(b fn m");

put("stdorstd = @impst ```zig
con
！"
打算后面要改它的值的变量，我是这个确地**告诉编译器："，Zig 要求你**明用 `var`。但是，就需要一个可以改变的值时改变时

当你确实当你确实需要`)：# 变量 (`var`

#``16)
指定为 i明确 (95数: )
分 f3265.5 (明确指定为重: )
体型由编译器推断true (类器推断)
是学生: 编译
姓名: 张三 (类型由由编译器推断)类型5.5 ( 17身高:(类型由编译器推断)
5 : 2```
年龄**运行结果：**


;
}
```ore}){sci16)\n", . {} (明确指定为 int("分数:std.debug.pr
    weight});", .{f32)\n} (明确指定为 d:.1: {nt("体重.pri   std.debug
 ;nt})des_stu, .{in"断)\类型由编译器推"是学生: {} (print(debug.;
    std.", .{name})\n断)器推{s} (类型由编译名: ("姓debug.print
    std..{height});译器推断)\n", 身高: {} (类型由编"rint(debug.p   std.{age});
 n", .编译器推断)\} (类型由t("年龄: {.prindebug  
    std.
  整数   // 16位有符号95;     = score: i16nst     co数
32位浮点    // f32 = 65.5;weight:  const  明确指定类型
       
    //ol，布尔值
 // bo true;    dent =t is_stu  cons面量
  [6:0]u8，字符串字nst / *co      /";     "张三e =namconst 数
    ，编译时浮点time_floatmp// co  75.5;      height = 1   const nt，编译时整数
 e_iptim      // com     25;   age = const 动推断类型
     - Zig 自 // 类型推断 {
   () !void mainub fnd");

pt("stporst std = @im
```zig
con
洁。，能让代码写起来更简型推断me_int`)。这叫类(`compti一个整数 ` 是**出 `12它能自己**推断明，ig 很聪。Z `12` 是什么类型没有告诉 Zig;` 的时候，并_count = 12pancakes `const 注意到我们写e)

enc(Type Infer### 类型推断 


```错误！不能重新赋值
}mp(); // e.timestaimd.t st_time =urrent改变
    // c期间不会值在程序运行   // 这些});
    
 ser_input.{u {s}\n", 入:rint("用户输 std.debug.pme});
   ent_tirr.{cu\n", 间: {}动时t("程序启pring.td.debu   s输入
    
  // 假设这是用户  ";        Hello, Zig!r_input = "use   const 时间戳
 / 获取当前estamp();  /.timtd.time = sime current_t    const能改变
行时确定，但之后不行时常量 - 值在运 // 运void {
   fn main() !
pub "std");
( @importtd =nst sg
co

```zi能改变：旦确定就不这些值在运行时确定，但一ants)

onstuntime C (R时常量. 运行 2

####: 100
```大玩家数4159
最3.1圆周率: ## 与 R
ust 的对比：不同的可变性哲学

如果你熟悉 Rust，你会发现 Zig 的变量系统有相似之处，但也有重要区别：

### 相似之处

1. **默认不可变**: 两种语言都鼓励默认使用不可变值
2. **明确可变性**: 需要改变值时，都要明确声明

### 关键区别

| 特性 | Rust | Zig |
|------|------|-----|
| 不可变声明 | `let x = 5;` | `const x = 5;` |
| 可变声明 | `let mut x = 5;` | `var x: i32 = 5;` |
| 类型推断 | 对 `let` 和 `let mut` 都支持 | 只对 `const` 支持 |
| 变量遮蔽 | 支持 `let x = ...; let x = ...;` | 不支持遮蔽 |
| 编译时计算 | 有限支持 | 强大的 `comptime` 系统 |

```zig
// Zig 示例
const std = @import("std");

pub fn main() !void {
    // Zig 风格：const 用于不变值，var 用于可变值
    const pi = 3.14159;           // 不可变，类型推断
    var radius: f64 = 5.0;        // 可变，必须指定类型
    
    // 计算面积
    const area = pi * radius * radius;  // 编译时如果可能会优化
    
    std.debug.print("半径: {d:.1}\n", .{radius});
    std.debug.print("面积: {d:.2}\n", .{area});
    
    // 改变半径
    radius = 10.0;
    const new_area = pi * radius * radius;
    std.debug.print("新半径: {d:.1}\n", .{radius});
    std.debug.print("新面积: {d:.2}\n", .{new_area});
}
```

**运行结果：**
```
半径: 5.0
面积: 78.54
新半径: 10.0
新面积: 314.16
```

## 内存布局和性能影响

理解变量和常量的内存布局对于系统编程很重要：

### 常量的内存特性

```zig
const std = @import("std");

// 全局常量存储在程序的只读数据段
const GLOBAL_CONFIG = "production";
const MAX_BUFFER_SIZE = 1024;

pub fn main() !void {
    // 局部常量可能被内联或存储在栈上
    const local_constant = 42;
    
    // 字符串字面量存储在只读内存中
    const message = "Hello, World!";
    
    std.debug.print("全局配置: {s}\n", .{GLOBAL_CONFIG});
    std.debug.print("最大缓冲区大小: {}\n", .{MAX_BUFFER_SIZE});
    std.debug.print("局部常量: {}\n", .{local_constant});
    std.debug.print("消息: {s}\n", .{message});
    
    // 这些值的地址在程序运行期间不会改变
    std.debug.print("message 的地址: {*}\n", .{message.ptr});
}
```

### 变量的内存特性

```zig
const std = @import("std");

pub fn main() !void {
    // 变量存储在栈上，可以修改
    var counter: u32 = 0;
    var buffer: [100]u8 = undefined;  // 未初始化的数组
    
    std.debug.print("counter 的地址: {*}\n", .{&counter});
    std.debug.print("buffer 的地址: {*}\n", .{&buffer});
    
    // 修改变量值
    counter = 10;
    buffer[0] = 'H';
    buffer[1] = 'i';
    
    std.debug.print("修改后的 counter: {}\n", .{counter});
    std.debug.print("buffer 前两个字节: {c}{c}\n", .{ buffer[0], buffer[1] });
    
    // 地址保持不变，但内容可以改变
    std.debug.print("counter 的地址（修改后）: {*}\n", .{&counter});
}
```

### 性能考虑

```zig
const std = @import("std");

// 编译时常量 - 零运行时开销
const COMPILE_TIME_RESULT = blk: {
    var sum: u32 = 0;
    var i: u32 = 1;
    while (i <= 100) : (i += 1) {
        sum += i;
    }
    break :blk sum;  // 1 + 2 + ... + 100 = 5050
};

pub fn main() !void {
    std.debug.print("1到100的和（编译时计算）: {}\n", .{COMPILE_TIME_RESULT});
    
    // 运行时变量 - 有内存和计算开销
    var runtime_sum: u32 = 0;
    var i: u32 = 1;
    while (i <= 100) : (i += 1) {
        runtime_sum += i;
    }
    
    std.debug.print("1到100的和（运行时计算）: {}\n", .{runtime_sum});
    
    // 编译时常量在性能上更优，因为值已经在编译时确定
}
```

**运行结果：**
```
1到100的和（编译时计算）: 5050
1到100的和（运行时计算）: 5050
```## 变量作用域和生命
周期

理解作用域和生命周期对于避免内存错误至关重要：

### 基本作用域规则

```zig
const std = @import("std");

// 全局作用域
const GLOBAL_CONSTANT = "我是全局的";

pub fn main() !void {
    // 函数作用域
    const function_constant = "我在函数里";
    var function_variable: i32 = 100;
    
    std.debug.print("全局常量: {s}\n", .{GLOBAL_CONSTANT});
    std.debug.print("函数常量: {s}\n", .{function_constant});
    std.debug.print("函数变量: {}\n", .{function_variable});
    
    // 块作用域
    {
        const block_constant = "我在块里";
        var block_variable: i32 = 200;
        
        // 可以访问外层作用域的变量
        function_variable = 150;  // 修改外层变量
        
        std.debug.print("块常量: {s}\n", .{block_constant});
        std.debug.print("块变量: {}\n", .{block_variable});
        std.debug.print("修改后的函数变量: {}\n", .{function_variable});
    }
    // block_constant 和 block_variable 在这里已经不存在了
    
    std.debug.print("块结束后的函数变量: {}\n", .{function_variable});
    
    // 条件作用域
    if (function_variable > 100) {
        const condition_constant = "条件为真";
        var condition_variable: i32 = 300;
        
        std.debug.print("条件常量: {s}\n", .{condition_constant});
        std.debug.print("条件变量: {}\n", .{condition_variable});
    }
    // condition_constant 和 condition_variable 在这里不存在
}
```

**运行结果：**
```
全局常量: 我是全局的
函数常量: 我在函数里
函数变量: 100
块常量: 我在块里
块变量: 200
修改后的函数变量: 150
块结束后的函数变量: 150
条件常量: 条件为真
条件变量: 300
```

### 生命周期和内存安全

```zig
const std = @import("std");

pub fn main() !void {
    var outer_value: i32 = 42;
    var pointer_to_outer: *i32 = &outer_value;
    
    std.debug.print("外层值: {}\n", .{outer_value});
    std.debug.print("通过指针访问: {}\n", .{pointer_to_outer.*});
    
    {
        var inner_value: i32 = 100;
        // 这是安全的 - inner_value 在这个作用域内有效
        var pointer_to_inner: *i32 = &inner_value;
        
        std.debug.print("内层值: {}\n", .{inner_value});
        std.debug.print("通过指针访问内层值: {}\n", .{pointer_to_inner.*});
        
        // 修改外层变量是安全的
        pointer_to_outer.* = 200;
    }
    // inner_value 和 pointer_to_inner 在这里已经无效
    
    std.debug.print("修改后的外层值: {}\n", .{outer_value});
    
    // 如果我们试图在这里使用 pointer_to_inner，会导致未定义行为
    // 但 Zig 的编译器会尽力检测这种错误
}
```

**运行结果：**
```
外层值: 42
通过指针访问: 42
内层值: 100
通过指针访问内层值: 100
修改后的外层值: 200
```

## 实际应用场景和最佳实践

### 1. 配置和常量

```zig
const std = @import("std");

// 应用配置 - 使用常量
const AppConfig = struct {
    const MAX_USERS = 1000;
    const DEFAULT_TIMEOUT = 30; // 秒
    const VERSION = "1.0.0";
    const DEBUG_MODE = true;
};

pub fn main() !void {
    std.debug.print("应用版本: {s}\n", .{AppConfig.VERSION});
    std.debug.print("最大用户数: {}\n", .{AppConfig.MAX_USERS});
    std.debug.print("默认超时: {} 秒\n", .{AppConfig.DEFAULT_TIMEOUT});
    std.debug.print("调试模式: {}\n", .{AppConfig.DEBUG_MODE});
    
    // 在实际应用中使用这些配置
    var current_users: u32 = 0;
    const timeout: u32 = AppConfig.DEFAULT_TIMEOUT;
    
    if (AppConfig.DEBUG_MODE) {
        std.debug.print("调试信息：当前用户数 {}\n", .{current_users});
    }
}
```

### 2. 状态管理

```zig
const std = @import("std");

const GameState = enum {
    menu,
    playing,
    paused,
    game_over,
};

pub fn main() !void {
    // 游戏状态 - 需要改变，所以用 var
    var current_state: GameState = GameState.menu;
    var score: u32 = 0;
    var lives: u8 = 3;
    
    // 游戏常量 - 不会改变
    const MAX_SCORE = 999999;
    const INITIAL_LIVES = 3;
    
    std.debug.print("游戏开始！\n");
    std.debug.print("初始状态: {}\n", .{current_state});
    std.debug.print("初始生命: {}\n", .{lives});
    
    // 模拟游戏进行
    current_state = GameState.playing;
    score = 1500;
    
    std.debug.print("游戏进行中...\n");
    std.debug.print("当前状态: {}\n", .{current_state});
    std.debug.print("当前分数: {}\n", .{score});
    
    // 失去生命
    lives -= 1;
    if (lives == 0) {
        current_state = GameState.game_over;
    }
    
    std.debug.print("游戏结束状态: {}\n", .{current_state});
    std.debug.print("最终分数: {}\n", .{score});
    std.debug.print("剩余生命: {}\n", .{lives});
}
```

### 3. 数据处理

```zig
const std = @import("std");

pub fn main() !void {
    // 原始数据 - 常量，不会改变
    const raw_data = [_]i32{ 10, 25, 30, 15, 40, 35, 20 };
    
    // 处理结果 - 变量，会在计算过程中改变
    var sum: i32 = 0;
    var max_value: i32 = raw_data[0];
    var min_value: i32 = raw_data[0];
    var count: usize = 0;
    
    std.debug.print("原始数据: ");
    for (raw_data) |value| {
        std.debug.print("{} ", .{value});
    }
    std.debug.print("\n");
    
    // 处理数据
    for (raw_data) |value| {
        sum += value;
        if (value > max_value) max_value = value;
        if (value < min_value) min_value = value;
        count += 1;
    }
    
    // 计算平均值 - 常量，因为计算完就不会改变
    const average: f32 = @as(f32, @floatFromInt(sum)) / @as(f32, @floatFromInt(count));
    
    std.debug.print("统计结果:\n");
    std.debug.print("  总和: {}\n", .{sum});
    std.debug.print("  平均值: {d:.2}\n", .{average});
    std.debug.print("  最大值: {}\n", .{max_value});
    std.debug.print("  最小值: {}\n", .{min_value});
    std.debug.print("  数据个数: {}\n", .{count});
}
```

**运行结果：**
```
原始数据: 10 25 30 15 40 35 20 
统计结果:
  总和: 175
  平均值: 25.00
  最大值: 40
  最小值: 10
  数据个数: 7
```#
# 命名约定和代码风格

在 Zig 中，我们使用 `snake_case` (蛇形命名法) 来给常量和变量命名：

```zig
const std = @import("std");

// 全局常量 - 通常使用 SCREAMING_SNAKE_CASE
const MAX_BUFFER_SIZE = 1024;
const DEFAULT_CONFIG_FILE = "config.json";
const PI = 3.14159265359;

pub fn main() !void {
    // 局部常量和变量 - 使用 snake_case
    const user_name = "张三";
    const file_path = "/home/user/documents";
    const is_valid = true;
    
    var player_score: u32 = 0;
    var connection_count: u16 = 0;
    var last_update_time: i64 = 0;
    
    // 好的命名示例
    const database_url = "postgresql://localhost:5432/mydb";
    var current_user_id: u32 = 1001;
    var is_authenticated: bool = false;
    
    // 不推荐的命名（虽然语法正确，但不符合 Zig 风格）
    // const DatabaseURL = "...";     // 应该用 database_url
    // var currentUserId: u32 = ...;  // 应该用 current_user_id
    // var IsAuthenticated: bool = ...;// 应该用 is_authenticated
    
    std.debug.print("用户名: {s}\n", .{user_name});
    std.debug.print("文件路径: {s}\n", .{file_path});
    std.debug.print("是否有效: {}\n", .{is_valid});
    std.debug.print("玩家分数: {}\n", .{player_score});
}
```

## 常见错误和调试技巧

### 1. 忘记指定变量类型

```zig
const std = @import("std");

pub fn main() !void {
    // 错误：变量必须指定类型
    // var count = 0;  // 编译错误！
    
    // 正确：明确指定类型
    var count: u32 = 0;
    
    // 常量可以类型推断
    const max_count = 100;  // 这是可以的
    
    std.debug.print("计数: {}\n", .{count});
    std.debug.print("最大计数: {}\n", .{max_count});
}
```

### 2. 尝试修改常量

```zig
const std = @import("std");

pub fn main() !void {
    const initial_value = 42;
    
    std.debug.print("初始值: {}\n", .{initial_value});
    
    // 错误：不能修改常量
    // initial_value = 100;  // 编译错误: cannot assign to constant
    
    // 如果需要修改，应该使用变量
    var mutable_value: i32 = 42;
    mutable_value = 100;  // 这是可以的
    
    std.debug.print("可变值: {}\n", .{mutable_value});
}
```

### 3. 作用域问题

```zig
const std = @import("std");

pub fn main() !void {
    var outer_var: i32 = 10;
    
    {
        var inner_var: i32 = 20;
        std.debug.print("内部作用域 - outer_var: {}, inner_var: {}\n", .{ outer_var, inner_var });
    }
    
    std.debug.print("外部作用域 - outer_var: {}\n", .{outer_var});
    // std.debug.print("inner_var: {}\n", .{inner_var}); // 错误：inner_var 不在作用域内
}
```

## 总结

**变量和常量的选择原则：**

1. **默认使用 `const`**: 除非你确实需要改变值，否则总是使用常量
2. **需要改变时使用 `var`**: 当值需要在程序运行期间改变时，使用变量并明确指定类型
3. **利用编译时计算**: 尽可能让计算在编译时完成，提高运行时性能
4. **注意作用域**: 理解变量的生命周期，避免访问已经失效的变量
5. **遵循命名约定**: 使用 `snake_case` 命名，让代码更符合 Zig 风格

**与其他语言的对比：**

- **相比 C/C++**: Zig 的常量系统更强大，编译时计算能力更强
- **相比 Rust**: Zig 不支持变量遮蔽，但有更灵活的编译时计算
- **相比 Python/JavaScript**: Zig 要求明确的类型声明，提供更好的性能和安全性

理解 Zig 的变量和常量系统是掌握这门语言的基础。它不仅影响代码的性能，还影响代码的安全性和可维护性。在实际开发中，合理使用常量和变量能让你的程序更高效、更可靠。