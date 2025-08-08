# Zig 基础教程 📚

> 从零开始学习 Zig 编程语言的基础概念

这里包含了 Zig 编程语言的所有基础教程，按照学习难度和逻辑顺序排列。建议按照推荐顺序学习，每个章节都建立在前面章节的基础上。

## 📋 教程目录

### 🚀 入门必读
| 序号 | 教程 | 状态 | 描述 |
|------|------|------|------|
| 1 | [安装和环境配置](install.md) | ✅ | 搭建 Zig 开发环境 |
| 2 | [Hello World](helloworld.md) | ✅ | 第一个 Zig 程序 |
| 3 | [变量和常量](Variables.md) | ✅ | 可变性、编译时常量、作用域 |

### 🏗️ 核心概念
| 序号 | 教程 | 状态 | 描述 |
|------|------|------|------|
| 4 | [数据类型](Data_Types.md) | 📝 | 基本数据类型详解 |
| 5 | [函数](Functions.md) | 📝 | 函数定义和调用 |
| 6 | [控制流](Control_Flow.md) | 📝 | 条件语句和循环 |
| 7 | [错误处理](Error_Handling.md) | 📝 | Zig 的错误处理机制 |

### 🔧 数据结构
| 序号 | 教程 | 状态 | 描述 |
|------|------|------|------|
| 8 | [结构体](Structs.md) | 📝 | 自定义数据类型 |
| 9 | [枚举](Enums.md) | 📝 | 枚举类型和标签联合 |
| 10 | [联合体](Unions.md) | 📝 | 裸联合与标签联合 |
| 11 | [数组与切片](Arrays_and_Slices.md) | ✅ | 固定数组、切片、遍历与边界 |

### ⚡ 高级特性
| 序号 | 教程 | 状态 | 描述 |
|------|------|------|------|
| 12 | [编译时计算](Comptime.md) | 📝 | 强大的 comptime 系统 |
| 13 | [构建系统](build_system.md) | 📝 | Zig 的构建工具 |
| 14 | [注释和文档](Comments.md) | 📝 | 代码文档化 |
| 15 | [指针与引用](Pointers.md) | ✅ | 指针、可变性、别名与安全 |
| 16 | [可选类型与空值](Optionals.md) | ✅ | `?T`、空检查与解构 |
| 17 | [内存与分配器](Allocators.md) | ✅ | GPA、Arena、FixedBuffer |
| 18 | [模块与导入](Modules.md) | ✅ | `@import`、命名空间与可见性 |

### 🧰 工具与实践
| 序号 | 教程 | 状态 | 描述 |
|------|------|------|------|
| 20 | [测试与调试](Testing_and_Debugging.md) | ✅ | std.testing、断言、基准与日志 |
| 21 | [I/O 与文件](IO_and_Files.md) | ✅ | 标准流、读写文件、缓冲与目录 |
| 22 | [并发与异步](Async_and_Event_Loop.md) | ✅ | 线程、事件驱动 I/O、协作式并发 |

### 📖 综合概念
| 序号 | 教程 | 状态 | 描述 |
|------|------|------|------|
| 19 | [通用编程概念](Common_Programming_Concepts.md) | 📝 | 编程通用概念总结 |

## 🎯 学习建议

### 📚 推荐学习路径

#### 🌟 第一阶段：基础入门（1-3 周）
```
安装配置 → Hello World → 变量常量 → 数据类型 → 函数
```
**目标**: 能够编写简单的 Zig 程序，理解基本语法

#### 🔥 第二阶段：核心掌握（2-4 周）
```
控制流 → 错误处理 → 结构体 → 枚举 → 联合体 → 数组与切片
```
**目标**: 掌握 Zig 的核心编程概念，能够构建复杂的数据结构

#### ⚡ 第三阶段：高级应用（3-6 周）
```
编译时计算 → 指针与引用 → 可选类型 → 分配器 → 模块与导入 → 构建系统
```
**目标**: 理解 Zig 的高级特性，能够开发实际项目

### 💡 学习技巧

#### 🎯 有效学习方法
- **边学边练**: 每个概念都要亲自编写代码验证
- **对比理解**: 与 C/Rust 等语言对比，加深理解
- **项目驱动**: 通过小项目巩固所学知识
- **社区交流**: 参与 Zig 社区讨论

#### 🛠️ 实践建议
- **代码实验**: 修改示例代码，观察结果变化
- **错误学习**: 故意制造错误，理解编译器提示
- **性能测试**: 比较不同实现方式的性能差异
- **文档阅读**: 经常查阅官方文档和标准库

## 🔍 快速参考

### 🎨 代码风格
```zig
// 推荐的 Zig 代码风格
const MAX_USERS = 100;              // 全局常量：SCREAMING_SNAKE_CASE
const user_name = "张三";            // 局部常量：snake_case
var player_score: u32 = 0;          // 变量：snake_case + 明确类型

fn calculate_total(base: u32, bonus: u32) u32 {  // 函数：snake_case
    return base + bonus;
}

const UserProfile = struct {         // 结构体：PascalCase
    name: []const u8,
    age: u8,
};
```

### 🚀 常用模式
```zig
// 错误处理
const result = risky_operation() catch |err| {
    std.debug.print("错误: {}\n", .{err});
    return;
};

// 可选类型
if (optional_value) |value| {
    std.debug.print("值: {}\n", .{value});
} else {
    std.debug.print("没有值\n", .{});
}

// 编译时计算
const compile_time_result = comptime blk: {
    var sum: u32 = 0;
    var i: u32 = 1;
    while (i <= 10) : (i += 1) {
        sum += i;
    }
    break :blk sum;
};
```

---

<div align="center">

**准备好开始学习了吗？选择一个教程开始吧！⚡**

[🚀 从安装开始](install.md) | [👋 Hello World](helloworld.md) | [📦 变量和常量](Variables.md)

</div>