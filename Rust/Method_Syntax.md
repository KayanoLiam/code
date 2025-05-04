# 方法语法 (Method Syntax)
咱们来聊聊怎么给咱们定义的**结构体 (Structs)** 添加**行为 (Behavior)**，也就是让它们能“做”点什么事，而不仅仅是存放数据。这就是**方法 (Methods)** 的作用。

**方法 vs. 函数 (Methods vs. Functions)**

方法和函数很像：

*   都用 `fn` 关键字声明。
*   都有名字。
*   都可以有参数和返回值。
*   都包含一段代码，在被调用时执行。

**关键区别：**

*   **方法是定义在结构体（或者枚举、Trait 对象）的上下文中的。** 它们是与某个特定类型**关联**的。
*   方法的**第一个参数永远是 `self`**（有几种形式：`self`, `&self`, `&mut self`），它代表**调用这个方法的那个结构体实例本身**。

**如何定义方法：`impl` 块**

要把方法和结构体关联起来，你需要使用 `impl` 关键字，创建一个**实现块 (implementation block)**。

1.  写 `impl 结构体名 { ... }`。
2.  把所有属于这个结构体的方法（和关联函数，后面会讲）都定义在这个 `impl` 块的大括号 `{}` 里面。

**例子：给 `Rectangle` 添加 `area` 方法**

还记得我们之前那个计算矩形面积的 `area` 函数吗？它接收一个 `&Rectangle` 参数。现在我们把它变成 `Rectangle` 结构体的一个**方法**。

```rust
// Filename: src/main.rs

#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

// 为 Rectangle 创建一个实现块
impl Rectangle {
    // 在 impl 块里定义 area 方法
    // 第一个参数是 &self
    fn area(&self) -> u32 {
        // 在方法内部，通过 self.字段名 来访问实例的字段
        self.width * self.height
    }

    // 你可以在 impl 块里定义更多的方法...
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    // 调用方法：使用实例名 + 点号(.) + 方法名()
    // 注意和调用普通函数的区别： area(&rect1)
    println!(
        "这个矩形的面积是 {} 平方像素。",
        rect1.area() // 方法调用语法
    );
}
```

**发生了什么变化？**

1.  我们创建了 `impl Rectangle { ... }` 块。
2.  把 `area` 函数**移动**到了 `impl` 块内部。
3.  **最重要的改动：** 把 `area` 的第一个参数从 `rectangle: &Rectangle` 改成了 `&self`。
4.  在 `main` 函数里，调用方式从 `area(&rect1)` 变成了 `rect1.area()`。这种 `实例.方法名()` 的语法叫做**方法调用语法 (method syntax)**。

**`self`, `&self`, `&mut self`：方法的第一个参数**

*   `self` 出现在方法的第一个参数位置，代表调用这个方法的那个**结构体实例本身**。
*   `Self` (大写 S): 在 `impl` 块内部，`Self` 是你正在为之实现方法的那个类型的**别名**。所以 `self: &Self` 和 `rectangle: &Rectangle` 在这个上下文里是等价的。
*   **简写 `&self`:** 因为方法的第一个参数几乎总是 `self`（表示实例），所以 Rust 允许你把 `self: &Self` 简写成 `&self`。同理，`self: Self` 可以简写成 `self`，`self: &mut Self` 可以简写成 `&mut self`。
*   **选择哪种 `self`？**
    *   `&self` (不可变借用): 方法只需要**读取**实例的数据，**不**想获取所有权，也**不**想修改实例。这是最常用的。我们的 `area` 方法就是这样。
    *   `&mut self` (可变借用): 方法需要**修改**实例的数据。比如，你可能想写一个 `scale(&mut self, factor: f64)` 方法来缩放矩形。调用这个方法需要实例是 `mut` 的。
    *   `self` (获取所有权): 方法会**拿走**实例的所有权。这比较少见。通常用在“转换”场景，比如一个方法把当前的实例变成另一种类型，并且不希望原来的实例在转换后还能被使用。

**为什么用方法而不是函数？**

1.  **组织性:** 把所有与 `Rectangle` 相关的操作（比如计算面积、判断是否能容纳另一个矩形）都集中在一个 `impl Rectangle { ... }` 块里，代码结构更清晰。别人使用你的代码时，更容易找到一个类型能做哪些事情。
2.  **方法调用语法:** `rect1.area()` 比 `area(&rect1)` 更符合面向对象的习惯（如果你熟悉的话），读起来更自然（“调用 rect1 的 area 方法”）。
3.  **少写类型:** 在方法签名里不用每次都重复写类型名（比如不用写 `rectangle: &Rectangle`，只写 `&self` 就行）。

**方法名可以和字段名相同吗？可以！**

你可以定义一个和结构体字段同名的方法。Rust 能区分它们：

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // 定义一个也叫 width 的方法
    fn width(&self) -> bool {
        // 这里的 self.width 指的是字段 width
        self.width > 0
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };

    // 调用 width 方法 (带括号)
    if rect1.width() {
        // 访问 width 字段 (不带括号)
        println!("矩形宽度非零，宽度是 {}", rect1.width);
    }
}
```
Rust 通过你后面有没有加圆括号 `()` 来判断你指的是字段还是方法。

*   **Getter 方法:** 有时候，方法和字段同名，并且方法只是简单地返回字段的值（比如 `fn width(&self) -> u32 { self.width }`），这种方法叫做 **getter**。Rust **不会**像某些语言那样自动为字段生成 getter。如果你想让字段私有（后面章节讲）但又允许外部读取它的值，可以手动实现一个公有的 getter 方法。

**那个 `->` 跑哪儿去了？自动引用和解引用**

熟悉 C/C++ 的同学可能会问：如果我有一个指向对象的指针 `ptr`，访问成员用 `->`（比如 `ptr->method()`）；如果直接是对象 `obj`，访问成员用 `.`（比如 `obj.method()`）。Rust 怎么只有一个 `.`？

Rust 有一个很方便的特性叫做**自动引用和解引用 (Automatic Referencing and Dereferencing)**，主要就用在方法调用这里。

当你写 `object.something()` 时，Rust 编译器会自动在 `object` 前面加上必要的 `&`, `&mut` 或者 `*` (解引用)，来匹配 `something` 方法签名的第一个参数 (`self`, `&self`, 或 `&mut self`)。

例如，这两种调用是等价的：

```rust
// 假设 p1 是 Point 类型，distance 方法签名是 fn distance(&self, other: &Point) -> f64
p1.distance(&p2); // 编译器会自动加上 &，变成 (&p1).distance(&p2)
(&p1).distance(&p2); // 显式引用
```

因为方法有明确的“接收者”（`self` 的类型），编译器总能明确地推断出方法是想读取 (`&self`)、修改 (`&mut self`) 还是消耗 (`self`) 这个实例，所以可以安全地自动添加引用/解引用。这让 Rust 的所有权和借用在实践中用起来方便很多。

**带更多参数的方法**

方法除了第一个 `self` 参数外，可以像普通函数一样接收其他参数。

**例子：实现 `can_hold` 方法**

我们想给 `Rectangle` 加一个方法 `can_hold`，判断当前的矩形 (`self`) 能不能完全容纳下另一个矩形 (`other`)。

```rust
// Filename: src/main.rs
#[derive(Debug)]
struct Rectangle { width: u32, height: u32, }

impl Rectangle {
    fn area(&self) -> u32 { self.width * self.height }

    // 定义 can_hold 方法
    // 第一个参数是 &self (代表调用方法的那个矩形)
    // 第二个参数是 other: &Rectangle (代表要比较的另一个矩形，用不可变引用，因为只需读取)
    fn can_hold(&self, other: &Rectangle) -> bool {
        // 检查自身的宽高是否都大于另一个矩形的宽高
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    let rect2 = Rectangle { width: 10, height: 40 }; // 能被 rect1 容纳
    let rect3 = Rectangle { width: 60, height: 45 }; // 比 rect1 宽，不能被容纳

    println!("rect1 能容纳 rect2 吗? {}", rect1.can_hold(&rect2)); // true
    println!("rect1 能容纳 rect3 吗? {}", rect1.can_hold(&rect3)); // false
}
```
这个 `can_hold` 方法接收了 `self` 之外的另一个参数 `other: &Rectangle`，用法和函数参数一样。

**关联函数 (Associated Functions)：没有 `self` 的函数**

在 `impl` 块里定义的函数**不一定**都要接收 `self` 作为第一个参数。那些**没有** `self` 参数的函数叫做**关联函数 (associated functions)**，而不是方法。

*   **为什么不需要 `self`？** 因为它们的操作不依赖于某个具体的结构体实例。
*   **常见用途：构造函数 (Constructors)**。关联函数经常用来创建结构体的新实例。比如我们之前用过的 `String::from("hello")`，这里的 `from` 就是 `String` 类型的一个关联函数（它不接收 `self`）。虽然 Rust 没有内置的构造函数关键字，但习惯上用 `new` 或者其他描述性的名字来命名这类关联函数。

**例子：给 `Rectangle` 添加一个创建正方形的关联函数**

```rust
// Filename: src/main.rs
#[derive(Debug)]
struct Rectangle { width: u32, height: u32, }

impl Rectangle {
    // 这是一个关联函数，因为它没有 self 参数
    // 它接收一个边长 size，返回一个新的 Rectangle 实例 (正方形)
    fn square(size: u32) -> Self { // 返回类型是 Self
        // Self 在 impl 块里是 Rectangle 的别名
        Self { // 使用 Self 创建实例
            width: size,
            height: size,
        }
    }
    // area 和 can_hold 是方法 (有 &self)
    // ...
}

fn main() {
    // 调用关联函数：使用 类型名::函数名() 的语法
    let sq = Rectangle::square(3);

    println!("创建的正方形是: {:?}", sq); // 输出 Rectangle { width: 3, height: 3 }
}
```
调用关联函数使用 `::` 语法（类型名后跟两个冒号），这和调用模块里的函数语法一样。

**可以有多个 `impl` 块**

一个结构体可以有多个 `impl` 块。你可以把不同的方法或关联函数分散到不同的 `impl` 块里。

```rust
struct Rectangle { width: u32, height: u32, }

// 第一个 impl 块
impl Rectangle {
    fn area(&self) -> u32 { self.width * self.height }
}

// 第二个 impl 块
impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
```
这在当前例子里没什么必要，但语法是合法的。后面学习泛型和 Trait 时，会看到多个 `impl` 块的实际用途。

**总结一下方法语法：**

1.  **方法是与类型关联的函数：** 定义在 `impl TypeName { ... }` 块中。
2.  **第一个参数是 `self`:** `&self` (不可变借用，最常用), `&mut self` (可变借用), `self` (获取所有权)。
3.  **调用：** 使用点号语法 `instance.method_name(...)`。
4.  **自动引用/解引用：** Rust 会自动处理 `.` 调用时的引用和解引用。
5.  **关联函数：** `impl` 块里**没有** `self` 参数的函数，通常用作构造函数。使用 `TypeName::function_name(...)` 调用。
6.  **组织性：** 把与类型相关的行为都放在 `impl` 块里，代码更清晰。

现在你不仅知道如何用结构体组织数据，还知道如何给这些数据添加行为了！这让你的自定义类型更加强大和有用。下一步可以学习枚举 (Enums)，这是 Rust 创建自定义类型的另一个重要工具。