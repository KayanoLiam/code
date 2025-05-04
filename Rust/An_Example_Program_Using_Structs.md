
# 用结构体组织数据 (An Example Program Using Structs)
咱们通过一个具体的例子来看看**结构体 (Structs)** 如何帮助我们组织数据，让代码更清晰、更易懂。

**目标：计算矩形的面积**

我们要写一个程序，计算一个矩形的面积。矩形需要宽度 (width) 和高度 (height) 这两个信息。

**最初版本：使用单独的变量**

最直接的想法就是用两个独立的变量来表示宽度和高度，然后写一个函数来计算面积。

```rust
// Filename: src/main.rs

fn main() {
    let width1 = 30;  // 矩形的宽度
    let height1 = 50; // 矩形的高度

    println!(
        "这个矩形的面积是 {} 平方像素。",
        // 调用 area 函数，传入宽度和高度
        area(width1, height1)
    );
}

// 计算面积的函数，接收两个 u32 参数
fn area(width: u32, height: u32) -> u32 {
    width * height // 返回 宽度 * 高度
}
```

运行 `cargo run`，输出：

```
这个矩形的面积是 1500 平方像素。
```

这个代码能工作，但有个**问题**：`area` 函数接收两个独立的参数 `width` 和 `height`。虽然我们知道它们是用来算一个矩形的面积，但从函数签名 `fn area(width: u32, height: u32)` 本身来看，**这两个参数之间的关联性并不明确**。如果代码复杂起来，或者别人来看这段代码，可能就不清楚这两个 `u32` 值必须一起用来表示一个矩形了。

**改进版本一：使用元组 (Tuple)**

我们学过元组可以把多个值组合起来。试试用元组来表示矩形的尺寸。

```rust
// Filename: src/main.rs

fn main() {
    // 把宽度和高度放在一个元组里
    let rect1 = (30, 50); // 类型是 (u32, u32)

    println!(
        "这个矩形的面积是 {} 平方像素。",
        // 调用 area 函数，传入整个元组
        area(rect1)
    );
}

// 计算面积的函数，接收一个元组参数
fn area(dimensions: (u32, u32)) -> u32 {
    // 通过索引访问元组的元素
    dimensions.0 * dimensions.1 // 宽度 * 高度
}
```

这个版本好了一点：`area` 函数现在只接收一个参数 `dimensions`，稍微体现了这两个值是相关的。

但是，**新的问题**出现了：元组的元素没有名字！我们得用 `dimensions.0` 和 `dimensions.1` 这种索引来访问宽度和高度。这让代码变得**不清晰**：
*   光看 `dimensions.0 * dimensions.1`，很难一眼看出这是在算宽度乘以高度。
*   如果我们不小心把元组里的顺序搞反了（比如写成 `let rect1 = (50, 30);`），虽然计算面积结果不变，但如果我们要做其他事情（比如画图），这个错误就可能导致问题。
*   别人（或未来的你）维护这段代码时，必须时刻记住 `0` 代表宽度，`1` 代表高度，增加了心智负担和出错的可能性。

我们需要一种方式，既能把相关数据组合起来，又能给每个部分起个明确的名字。这就是结构体派上用场的时候了！

**改进版本二：使用结构体 (Struct) - 更清晰、更有意义！**

现在我们用结构体来重构代码。

```rust
// Filename: src/main.rs

// 1. 定义一个名为 Rectangle 的结构体
struct Rectangle {
    width: u32,  // 字段：宽度，类型 u32
    height: u32, // 字段：高度，类型 u32
}

fn main() {
    // 2. 创建一个 Rectangle 实例
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "这个矩形的面积是 {} 平方像素。",
        // 3. 调用 area 函数，传入 Rectangle 实例的引用
        area(&rect1) // 注意这里用了 &，表示借用
    );

    // rect1 在这里仍然有效，因为我们只是借用给 area 函数
    println!("原始矩形: 宽度 {}, 高度 {}", rect1.width, rect1.height);
}

// 4. 计算面积的函数，接收一个 Rectangle 的引用
fn area(rectangle: &Rectangle) -> u32 { // 参数类型是 &Rectangle
    // 通过字段名访问宽度和高度，非常清晰！
    rectangle.width * rectangle.height
}
```

这个版本好在哪里？

1.  **代码意图明确:** 我们定义了一个 `Rectangle` 类型，清晰地表达了我们在处理矩形。
2.  **字段命名:** `width` 和 `height` 这两个名字比 `.0` 和 `.1` 直观多了。`rectangle.width` 一看就知道是矩形的宽度。
3.  **结构化:** `width` 和 `height` 被明确地组合在一起，属于 `Rectangle` 这个整体。
4.  **函数签名更清晰:** `fn area(rectangle: &Rectangle)` 这个签名清楚地说明了：“这个函数计算一个 `Rectangle` 的面积”。
5.  **借用而非所有权转移:** 我们把 `area` 函数的参数改成了 `&Rectangle`（一个对 `Rectangle` 的不可变引用）。这意味着 `main` 函数在调用 `area` 时，**没有**把 `rect1` 的所有权交给 `area`，只是把它“借”给了 `area` 去用一下。这样做的好处是，`main` 函数在调用完 `area` 之后，**仍然拥有 `rect1` 的所有权**，可以继续使用 `rect1`。这是处理结构体时非常常见的模式，因为我们通常不希望仅仅为了计算一个值（比如面积）就失去对原始结构体的所有权。
6.  **通过引用访问字段:** 注意，即使 `rectangle` 是一个引用 (`&Rectangle`)，我们仍然可以直接用 `.` 来访问它的字段，比如 `rectangle.width`。Rust 会自动处理解引用。访问借用的结构体的字段**不会**移动字段的值。

这个使用结构体的版本，在**清晰度**和**可维护性**上都比前两个版本要好得多！

**锦上添花：让结构体能被打印出来 (衍生 Trait `Debug`)**

我们经常需要在调试代码时打印出变量的值。试试直接打印 `Rectangle` 实例：

```rust
// (接上例)
// fn main() {
//     let rect1 = Rectangle { width: 30, height: 50 };
//     println!("rect1 is {}", rect1); // <-- 这行代码会编译错误！
// }
```

编译器会报错，大概意思是 `Rectangle` 没有实现 `std::fmt::Display` 这个 trait。`println!` 宏默认使用 `Display` 格式来打印，这种格式是设计给**最终用户看**的。对于像数字、字符串这样的基本类型，怎么显示给用户是很明确的。但对于我们自定义的结构体，Rust 不知道我们想把它显示成什么样（要不要括号？要不要逗号？显示哪些字段？）。

不过，编译器通常会给一个有用的提示：

```
= note: in format strings you may be able to use `{:?}` (or {:#?} for pretty-print) instead
```

它建议我们试试用 `{:?}` 这个格式说明符。这告诉 `println!` 使用叫做 **`Debug`** 的格式来打印。`Debug` 格式是专门为**开发者调试**设计的，目标是能清晰地展示出结构体的内部值。

我们试试修改 `println!`：

```rust
// println!("rect1 is {:?}", rect1); // 用 {:?}
```

再编译，还是报错！

```
error[E0277]: `Rectangle` doesn't implement `Debug`
```

编译器又说 `Rectangle` 没有实现 `Debug` 这个 trait。但是，它又给了一个非常有用的提示：

```
= note: add `#[derive(Debug)]` to `Rectangle` or manually `impl Debug for Rectangle`
```

它告诉我们，要想让 `Rectangle` 能用 `Debug` 格式打印，最简单的方法就是在结构体定义前加上一个**外部属性 (outer attribute)** `#[derive(Debug)]`。

**`derive` 是什么？**
`derive` 是 Rust 的一个强大功能，它允许我们让编译器自动为我们的类型**生成**某些常用 trait 的实现代码。`Debug` 就是其中一个可以自动生成的 trait。

我们来加上这个属性：

```rust
// Filename: src/main.rs

// 加上 #[derive(Debug)] 属性
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    // 现在可以用 {:?} 来打印了！
    println!("rect1 is {:?}", rect1);
}
```

现在运行 `cargo run`，输出：

```
rect1 is Rectangle { width: 30, height: 50 }
```

成功了！我们看到了结构体的名字和所有字段及其值。

**更漂亮的 Debug 打印：`{:#?}`**

如果结构体比较大，单行打印可能不好看。可以用 `{:#?}` 来进行“**美化打印 (pretty-print)**”，它会带上换行和缩进：

```rust
println!("rect1 is {:#?}", rect1);
```

输出会变成：

```
rect1 is Rectangle {
    width: 30,
    height: 50,
}
```

**另一个调试好帮手：`dbg!` 宏**

还有一个方便的宏叫 `dbg!`，它特别适合在开发过程中快速打印某个表达式的值以及它在代码中的位置。

*   `dbg!(表达式)` 会：
    1.  **获取**表达式的所有权（如果是 `Copy` 类型就是复制）。
    2.  把文件名、行号、表达式本身以及表达式计算结果**打印到标准错误流 (stderr)**（注意不是标准输出 stdout）。
    3.  **返回**表达式值的所有权。

```rust
#[derive(Debug)]
struct Rectangle { width: u32, height: u32, }

fn main() {
    let scale = 2;
    let rect1 = Rectangle {
        // 在这里用 dbg! 看看 30 * scale 的结果
        width: dbg!(30 * scale), // dbg! 返回 60，赋值给 width
        height: 50,
    };

    // 用 dbg! 打印整个 rect1 实例的引用（加 & 避免所有权转移）
    dbg!(&rect1);
}
```

运行 `cargo run`，你会在终端看到类似这样的输出（注意输出来自 stderr）：

```
[src/main.rs:10] 30 * scale = 60          // 显示文件名、行号、表达式和结果
[src/main.rs:14] &rect1 = Rectangle {    // 显示文件名、行号、表达式和结果（美化格式）
    width: 60,
    height: 50,
}
```

`dbg!` 对于快速检查代码中间步骤的值非常有用。

**总结一下这个例子：**

1.  用独立的变量表示宽度和高度，不够结构化，关联性不强。
2.  用元组稍微好点，但缺乏明确的字段名，不够清晰，容易出错。
3.  用**结构体**是最好的方式，它把相关数据组合起来，并给每个字段命名，代码清晰易懂。
4.  计算面积的函数接收结构体的**引用 (`&Rectangle`)** 而不是所有权，这样 `main` 函数还能继续使用原始实例。
5.  通过添加 `#[derive(Debug)]` 属性，可以让自定义的结构体支持用 `{:?}` 或 `{:#?}` (美化) 格式进行调试打印。
6.  `dbg!` 宏是另一个方便的调试工具，可以打印表达式的值和位置。

这个例子很好地展示了结构体如何帮助我们写出更有意义、更易于理解和维护的代码。接下来可以学习如何给结构体添加**方法 (methods)**，让数据和操作它们的行为更紧密地结合起来。