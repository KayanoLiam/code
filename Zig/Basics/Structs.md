# Zig 中的结构体 (Structs)

## 概念引入

想象一下你正在整理一个图书馆。每本书都有很多属性：书名、作者、页数、出版年份、是否被借出等等。如果我们把这些信息分别存储在不同的地方，管理起来会非常混乱。结构体就像是一个专门的书籍档案袋，把一本书的所有相关信息都装在一起，贴上"图书信息"的标签。

在编程中，结构体（Struct）是一种将多个相关的数据项组合成一个有意义整体的方式。它让我们能够创建自定义的数据类型，将不同类型的数据打包在一起，形成一个逻辑上的整体。

**为什么需要结构体？**
- **数据组织**：将相关的数据组织在一起，避免散乱
- **代码清晰**：通过有意义的名称表达数据的含义
- **类型安全**：编译器可以检查数据的正确使用
- **封装性**：将数据和操作数据的方法组合在一起

## 详细解释

### 基本语法和定义

在 Zig 中，我们使用 `struct` 关键字来定义结构体。结构体的定义就像是创建一个模板，描述了这种类型的数据应该包含哪些字段。

```zig
const std = @import("std");

// 定义一个图书结构体
const Book = struct {
    title: []const u8,        // 书名（字符串切片）
    author: []const u8,       // 作者
    pages: u32,               // 页数（无符号32位整数）
    year: u16,                // 出版年份
    is_borrowed: bool,        // 是否被借出
};
```

### 结构体实例化

定义了结构体类型后，我们可以创建具体的实例。这就像是根据档案袋的模板，为每本具体的书创建一个档案袋。

```zig
pub fn main() !void {
    // 创建一个图书实例
    const book1 = Book{
        .title = "Zig编程指南",
        .author = "张三",
        .pages = 350,
        .year = 2024,
        .is_borrowed = false,
    };
    
    // 访问结构体字段
    std.debug.print("书名: {s}\n", .{book1.title});
    std.debug.print("作者: {s}\n", .{book1.author});
    std.debug.print("页数: {}\n", .{book1.pages});
    
    // 可变的结构体实例
    var book2 = Book{
        .title = "Rust权威指南",
        .author = "李四",
        .pages = 500,
        .year = 2023,
        .is_borrowed = false,
    };
    
    // 修改字段值
    book2.is_borrowed = true;
    std.debug.print("《{s}》已被借出: {}\n", .{ book2.title, book2.is_borrowed });
}
```

**输出结果：**
```
书名: Zig编程指南
作者: 张三
页数: 350
《Rust权威指南》已被借出: true
```

### 结构体方法

结构体不仅可以存储数据，还可以定义操作这些数据的方法。这就像是给档案袋配备了一些专用工具，让我们能够方便地处理其中的信息。

```zig
const Book = struct {
    title: []const u8,
    author: []const u8,
    pages: u32,
    year: u16,
    is_borrowed: bool,
    
    // 实例方法：借书
    // self: *Book 表示这个方法可以修改实例
    fn borrow(self: *Book) void {
        if (!self.is_borrowed) {
            self.is_borrowed = true;
            std.debug.print("《{s}》已被借出\n", .{self.title});
        } else {
            std.debug.print("《{s}》已经被借出了\n", .{self.title});
        }
    }
    
    // 实例方法：还书
    fn return_book(self: *Book) void {
        if (self.is_borrowed) {
            self.is_borrowed = false;
            std.debug.print("《{s}》已归还\n", .{self.title});
        } else {
            std.debug.print("《{s}》本来就在图书馆\n", .{self.title});
        }
    }
    
    // 只读方法：获取书籍信息
    // self: Book 表示这个方法不会修改实例
    fn get_info(self: Book) void {
        const status = if (self.is_borrowed) "已借出" else "可借阅";
        std.debug.print("《{s}》- 作者: {s}, 页数: {}, 状态: {s}\n", 
                       .{ self.title, self.author, self.pages, status });
    }
    
    // 关联函数：创建新书
    // 注意：没有 self 参数，这是一个关联函数，不是实例方法
    fn create_new(title: []const u8, author: []const u8, pages: u32, year: u16) Book {
        return Book{
            .title = title,
            .author = author,
            .pages = pages,
            .year = year,
            .is_borrowed = false,
        };
    }
};

pub fn main() !void {
    // 使用关联函数创建新书
    var my_book = Book.create_new("Zig语言精髓", "王五", 280, 2024);
    
    // 调用实例方法
    my_book.get_info();
    my_book.borrow();
    my_book.borrow(); // 尝试重复借书
    my_book.return_book();
}
```

**方法类型说明：**
- `self: Book`：按值传递，方法接收实例的副本，无法修改原实例
- `self: *Book`：按指针传递，方法可以修改原实例
- 无 `self` 参数：关联函数，属于类型本身而不是实例

### 结构体作为命名空间

结构体还可以作为命名空间使用，包含常量、类型定义和函数。这就像是给档案袋系统配备了一套管理规则和工具。

```zig
const Library = struct {
    // 常量定义
    const MAX_BOOKS = 1000;
    const MAX_BORROW_DAYS = 30;
    
    // 嵌套类型定义
    const BookCategory = enum {
        fiction,
        science,
        history,
        technology,
    };
    
    // 关联函数
    fn get_max_capacity() u32 {
        return MAX_BOOKS;
    }
    
    fn calculate_fine(days_overdue: u32) u32 {
        return days_overdue * 2; // 每天罚款2元
    }
};

// 增强的图书结构体
const Book = struct {
    title: []const u8,
    author: []const u8,
    pages: u32,
    year: u16,
    category: Library.BookCategory,
    is_borrowed: bool,
    
    fn get_category_name(self: Book) []const u8 {
        return switch (self.category) {
            .fiction => "小说",
            .science => "科学",
            .history => "历史",
            .technology => "技术",
        };
    }
};

pub fn main() !void {
    // 使用命名空间中的常量和函数
    std.debug.print("图书馆最大容量: {}\n", .{Library.get_max_capacity()});
    std.debug.print("逾期5天的罚款: {}元\n", .{Library.calculate_fine(5)});
    
    // 创建带分类的图书
    const tech_book = Book{
        .title = "Zig系统编程",
        .author = "赵六",
        .pages = 420,
        .year = 2024,
        .category = Library.BookCategory.technology,
        .is_borrowed = false,
    };
    
    std.debug.print("《{s}》属于{s}类别\n", .{ tech_book.title, tech_book.get_category_name() });
}
```

## 内存布局和对齐

理解结构体的内存布局对于系统编程和性能优化非常重要。这就像是了解档案袋在文件柜中是如何摆放的。

### 默认内存布局

```zig
const std = @import("std");

const Example = struct {
    a: u8,   // 1字节
    b: u32,  // 4字节
    c: u16,  // 2字节
};

pub fn main() !void {
    std.debug.print("Example结构体大小: {} 字节\n", .{@sizeOf(Example)});
    std.debug.print("字段a的偏移量: {} 字节\n", .{@offsetOf(Example, "a")});
    std.debug.print("字段b的偏移量: {} 字节\n", .{@offsetOf(Example, "b")});
    std.debug.print("字段c的偏移量: {} 字节\n", .{@offsetOf(Example, "c")});
}
```

**可能的输出：**
```
Example结构体大小: 8 字节
字段a的偏移量: 0 字节
字段b的偏移量: 4 字节
字段c的偏移量: 6 字节
```

编译器会自动添加填充（padding）来确保字段的正确对齐，这可能导致结构体的实际大小比所有字段大小之和要大。

### 紧凑结构体 (Packed Struct)

当我们需要精确控制内存布局时（比如与C语言交互或进行底层编程），可以使用 `packed struct`：

```zig
const PackedExample = packed struct {
    a: u8,   // 1字节
    b: u32,  // 4字节  
    c: u16,  // 2字节
};

const AlignedExample = struct {
    a: u8,   // 1字节 + 3字节填充
    b: u32,  // 4字节
    c: u16,  // 2字节 + 2字节填充
};

pub fn main() !void {
    std.debug.print("PackedExample大小: {} 字节\n", .{@sizeOf(PackedExample)});
    std.debug.print("AlignedExample大小: {} 字节\n", .{@sizeOf(AlignedExample)});
    
    // 演示内存布局的差异
    const packed_data = PackedExample{ .a = 1, .b = 2, .c = 3 };
    const aligned_data = AlignedExample{ .a = 1, .b = 2, .c = 3 };
    
    std.debug.print("紧凑结构体地址差: {}\n", .{@intFromPtr(&packed_data.c) - @intFromPtr(&packed_data.a)});
    std.debug.print("对齐结构体地址差: {}\n", .{@intFromPtr(&aligned_data.c) - @intFromPtr(&aligned_data.a)});
}
```

**使用场景对比：**
- **普通结构体**：性能优先，编译器自动优化对齐
- **紧凑结构体**：空间优先，精确控制内存布局

## 与其他语言对比

### 与 C 语言对比

```zig
// Zig 结构体
const Point = struct {
    x: f32,
    y: f32,
    
    fn distance_from_origin(self: Point) f32 {
        return @sqrt(self.x * self.x + self.y * self.y);
    }
};

// 等价的 C 代码：
// struct Point {
//     float x;
//     float y;
// };
// 
// float distance_from_origin(struct Point self) {
//     return sqrt(self.x * self.x + self.y * self.y);
// }
```

**Zig 的优势：**
- 方法可以直接定义在结构体内部
- 更清晰的语法和更好的类型安全
- 编译时计算和泛型支持

### 与 Rust 对比

```zig
// Zig 版本
const Rectangle = struct {
    width: u32,
    height: u32,
    
    fn area(self: Rectangle) u32 {
        return self.width * self.height;
    }
};

// Rust 版本：
// struct Rectangle {
//     width: u32,
//     height: u32,
// }
// 
// impl Rectangle {
//     fn area(&self) -> u32 {
//         self.width * self.height
//     }
// }
```

**主要差异：**
- Zig 的方法直接定义在结构体内部，Rust 使用 `impl` 块
- Zig 的内存管理更加显式，Rust 有所有权系统
- Zig 支持编译时计算，Rust 有更强的类型系统

## 实践指导

### 结构体设计模式

#### 1. 构建器模式 (Builder Pattern)

```zig
const DatabaseConfig = struct {
    host: []const u8,
    port: u16,
    username: []const u8,
    password: []const u8,
    database: []const u8,
    timeout: u32,
    
    const Builder = struct {
        host: []const u8 = "localhost",
        port: u16 = 5432,
        username: []const u8 = "",
        password: []const u8 = "",
        database: []const u8 = "",
        timeout: u32 = 30,
        
        fn set_host(self: *Builder, host: []const u8) *Builder {
            self.host = host;
            return self;
        }
        
        fn set_port(self: *Builder, port: u16) *Builder {
            self.port = port;
            return self;
        }
        
        fn set_credentials(self: *Builder, username: []const u8, password: []const u8) *Builder {
            self.username = username;
            self.password = password;
            return self;
        }
        
        fn build(self: Builder) DatabaseConfig {
            return DatabaseConfig{
                .host = self.host,
                .port = self.port,
                .username = self.username,
                .password = self.password,
                .database = self.database,
                .timeout = self.timeout,
            };
        }
    };
    
    fn builder() Builder {
        return Builder{};
    }
};

pub fn main() !void {
    var config = DatabaseConfig.builder()
        .set_host("192.168.1.100")
        .set_port(3306)
        .set_credentials("admin", "secret123")
        .build();
        
    std.debug.print("数据库配置: {s}:{}\n", .{ config.host, config.port });
}
```

#### 2. 状态机模式

```zig
const TrafficLight = struct {
    const State = enum {
        red,
        yellow,
        green,
    };
    
    state: State,
    duration: u32, // 当前状态持续时间（秒）
    
    fn init() TrafficLight {
        return TrafficLight{
            .state = .red,
            .duration = 0,
        };
    }
    
    fn next_state(self: *TrafficLight) void {
        switch (self.state) {
            .red => {
                self.state = .green;
                self.duration = 30;
            },
            .green => {
                self.state = .yellow;
                self.duration = 5;
            },
            .yellow => {
                self.state = .red;
                self.duration = 25;
            },
        }
    }
    
    fn get_state_name(self: TrafficLight) []const u8 {
        return switch (self.state) {
            .red => "红灯",
            .yellow => "黄灯",
            .green => "绿灯",
        };
    }
};
```

### 最佳实践

#### 1. 字段命名和组织

```zig
// 好的实践：清晰的命名和逻辑分组
const User = struct {
    // 基本信息
    id: u64,
    username: []const u8,
    email: []const u8,
    
    // 状态信息
    is_active: bool,
    last_login: i64, // Unix 时间戳
    
    // 统计信息
    login_count: u32,
    created_at: i64,
    
    fn is_recently_active(self: User) bool {
        const now = std.time.timestamp();
        const one_week = 7 * 24 * 60 * 60;
        return (now - self.last_login) < one_week;
    }
};
```

#### 2. 错误处理集成

```zig
const FileReader = struct {
    path: []const u8,
    content: ?[]u8,
    
    const Error = error{
        FileNotFound,
        PermissionDenied,
        OutOfMemory,
    };
    
    fn init(path: []const u8) FileReader {
        return FileReader{
            .path = path,
            .content = null,
        };
    }
    
    fn read(self: *FileReader, allocator: std.mem.Allocator) Error!void {
        // 模拟文件读取
        if (std.mem.eql(u8, self.path, "nonexistent.txt")) {
            return Error.FileNotFound;
        }
        
        // 实际的文件读取逻辑会在这里
        self.content = try allocator.alloc(u8, 100);
    }
    
    fn deinit(self: *FileReader, allocator: std.mem.Allocator) void {
        if (self.content) |content| {
            allocator.free(content);
        }
    }
};
```

#### 3. 性能考虑

```zig
// 性能友好的结构体设计
const OptimizedStruct = struct {
    // 将经常一起访问的字段放在一起
    x: f32,
    y: f32,
    z: f32,
    
    // 将大小相同的字段分组，减少填充
    flags: u32,
    id: u32,
    
    // 将较少使用的大字段放在最后
    name: [256]u8,
    
    // 使用合适的数据类型
    small_counter: u8,  // 而不是 u32，如果值域允许
};
```

### 常见陷阱和解决方案

#### 1. 结构体复制的性能问题

```zig
// 问题：大结构体的意外复制
const LargeStruct = struct {
    data: [1000]u8,
    
    // 错误：按值传递大结构体
    fn process_wrong(self: LargeStruct) void {
        // 这会复制整个结构体！
        _ = self;
    }
    
    // 正确：使用指针传递
    fn process_right(self: *const LargeStruct) void {
        // 只传递指针，高效！
        _ = self;
    }
};
```

#### 2. 字段初始化遗漏

```zig
const Config = struct {
    host: []const u8,
    port: u16,
    enabled: bool = true, // 提供默认值
    
    // 提供便利的构造函数
    fn init(host: []const u8, port: u16) Config {
        return Config{
            .host = host,
            .port = port,
            .enabled = true,
        };
    }
};
```

## 总结

结构体是 Zig 中组织和管理数据的核心工具。通过本章的学习，你应该掌握：

**核心概念：**
- 结构体的定义和实例化
- 实例方法和关联函数的区别
- 结构体作为命名空间的使用

**内存管理：**
- 默认内存布局和对齐规则
- 紧凑结构体的使用场景
- 性能优化的考虑

**实践技能：**
- 常见设计模式的实现
- 错误处理的集成
- 性能友好的结构体设计

**最佳实践：**
- 清晰的命名和组织
- 合适的方法设计
- 常见陷阱的避免

结构体不仅仅是数据的容器，更是构建复杂程序的基础。掌握好结构体的使用，将为你后续学习 Zig 的高级特性打下坚实的基础。在下一章中，我们将学习枚举类型，它与结构体一起构成了 Zig 类型系统的重要组成部分。