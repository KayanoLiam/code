# Defining Modules to Control Scope and Privacy(定义模块来控制作用域和隐私性)
Rust 里的“模块”（Modules），以及怎么用它们来控制代码的“作用域”（Scope，就是哪些代码能访问哪些东西）和“隐私性”（Privacy，哪些东西是公开的，哪些是私有的）。

### 模块速查表 (Modules Cheat Sheet)

在你深入了解细节之前，这里有个快速参考，总结了模块、路径、`use` 关键字和 `pub` 关键字是如何工作的，以及大多数开发者是如何组织代码的。后面的例子会详细解释每一条。

1.  **从 Crate 根开始**：
    *   编译器编译一个 Crate 时，首先会找 Crate 的根文件。
    *   通常，库 Crate 的根是 `src/lib.rs`。
    *   二进制 Crate 的根是 `src/main.rs`。

2.  **声明模块 (Declaring modules)**：
    *   在 Crate 根文件里，你可以用 `mod 模块名;` 来声明一个新的模块。比如，声明一个叫 `garden` 的模块：`mod garden;`。
    *   编译器会在下面这些地方找 `garden` 模块的代码：
        *   **内联定义**：直接在 `mod garden` 后面跟上大括号 `{}`，模块代码写在括号里，替换掉分号。例如：`mod garden { /* garden的代码 */ }`。
        *   **同名文件**：在 `src` 目录下找一个叫 `garden.rs` 的文件。例如：`src/garden.rs`。
        *   **同名目录下的 `mod.rs` 文件**：在 `src` 目录下找一个叫 `garden` 的文件夹，然后在该文件夹里找一个叫 `mod.rs` 的文件。例如：`src/garden/mod.rs`。

3.  **声明子模块 (Declaring submodules)**：
    *   在任何**非 Crate 根**的文件里（比如在 `src/garden.rs` 里），你也可以声明子模块。例如，在 `src/garden.rs` 里声明一个叫 `vegetables` 的子模块：`mod vegetables;`。
    *   编译器会在**父模块同名的目录**下找这个子模块的代码：
        *   **内联定义**：直接在 `mod vegetables` 后面跟上大括号 `{}`，模块代码写在括号里。
        *   **同名文件**：在父模块的目录里找一个叫 `vegetables.rs` 的文件。例如，如果父模块是 `garden`（对应 `src/garden.rs` 或 `src/garden/mod.rs`），那么就在 `src/garden/vegetables.rs` 找。
        *   **同名目录下的 `mod.rs` 文件**：在父模块的目录里找一个叫 `vegetables` 的文件夹，然后在该文件夹里找一个叫 `mod.rs` 的文件。例如：`src/garden/vegetables/mod.rs`。

4.  **模块中代码的路径 (Paths to code in modules)**：
    *   一旦一个模块成为了你 Crate 的一部分，你就可以在同一个 Crate 的任何其他地方，通过**路径**来引用那个模块里的代码（只要隐私规则允许）。
    *   例如，如果 `garden` 模块下的 `vegetables` 子模块里有一个叫 `Asparagus` 的类型（比如一个结构体），那么它的完整路径就是 `crate::garden::vegetables::Asparagus`。
        *   `crate` 是一个特殊的关键字，代表当前 Crate 的根。
        *   `::` 用来分隔路径中的各个部分。

5.  **私有 vs. 公开 (Private vs. public)**：
    *   默认情况下，一个模块里的所有东西（函数、结构体、模块等）对于它的父模块以及外部模块来说都是**私有**的。也就是说，外面访问不到。
    *   要想让一个模块**公开**，在声明它的时候要用 `pub mod 模块名;` 而不是 `mod 模块名;`。
    *   要想让一个公开模块里的具体某个东西（比如函数或结构体）也**公开**，需要在那个东西的声明前也加上 `pub`。例如 `pub fn my_function() {}` 或 `pub struct MyStruct;`。

6.  **`use` 关键字**：
    *   在一个作用域内，`use` 关键字可以为很长的路径创建“快捷方式”，以减少重复输入。
    *   比如，如果你能访问 `crate::garden::vegetables::Asparagus`，你可以在你的代码文件的开头（或其他合适的作用域）写：
        `use crate::garden::vegetables::Asparagus;`
    *   之后，在这个作用域里，你只需要写 `Asparagus` 就可以使用那个类型了，不用再写一长串路径。

#### 一个例子：`backyard` Crate

假设我们有一个叫 `backyard` 的二进制 Crate，目录结构如下：

```
backyard/
├── Cargo.lock
├── Cargo.toml
└── src/
    ├── garden/
    │   └── vegetables.rs  // 子模块 vegetables 的代码
    ├── garden.rs          // 模块 garden 的代码
    └── main.rs            // Crate 根
```

**`src/main.rs`** (Crate 根):

```rust
// 使用 use 关键字引入 Asparagus 类型，这样下面就可以直接用 Asparagus
use crate::garden::vegetables::Asparagus;

// 声明一个公开的模块 garden，编译器会去找 src/garden.rs 或 src/garden/mod.rs
pub mod garden;

fn main() {
    let plant = Asparagus {}; // 直接使用引入的 Asparagus
    println!("我正在种 {plant:?}!");
}
```

**`src/garden.rs`** (模块 `garden` 的定义):

```rust
// 声明一个公开的子模块 vegetables，编译器会去找 src/garden/vegetables.rs 或 src/garden/vegetables/mod.rs
pub mod vegetables;
```

**`src/garden/vegetables.rs`** (子模块 `vegetables` 的定义):

```rust
#[derive(Debug)] // 这是一个属性，让结构体可以被打印调试
pub struct Asparagus {} // 定义一个公开的结构体 Asparagus
```

这个例子演示了：
*   `src/main.rs` 是 Crate 根。
*   `pub mod garden;` 告诉编译器把 `src/garden.rs` 包含进来，并让 `garden` 模块公开。
*   在 `src/garden.rs` 里，`pub mod vegetables;` 告诉编译器把 `src/garden/vegetables.rs` 包含进来，并让 `vegetables` 模块公开（相对于 `garden` 模块的外部，也即 `main.rs` 可以通过 `garden::vegetables` 访问）。
*   `Asparagus` 结构体因为有 `pub`，所以是公开的，可以被 `main.rs` 通过路径 `crate::garden::vegetables::Asparagus` 访问。
*   `use crate::garden::vegetables::Asparagus;` 创建了一个快捷方式。

### 将相关代码组织到模块中 (Grouping Related Code in Modules)

模块的主要作用就是**组织代码**，让代码更容易阅读和复用。同时，模块也控制着代码的**隐私性**。默认情况下，模块里的东西都是私有的，这是内部实现细节，外面不能直接用。我们可以选择性地把模块和模块里的东西设为公开，这样外部代码才能使用它们。

#### 餐厅的例子

想象我们要写一个模拟餐厅功能的库 Crate。餐厅里有“前厅”（front of house）和“后厨”（back of house）。
*   前厅负责接待客人、点餐、调酒等。
*   后厨负责烹饪、洗碗、管理等。

我们可以用模块来组织这些功能。首先创建一个库 Crate：
`cargo new restaurant --lib`

然后修改 `src/lib.rs` (这是库 Crate 的根文件)：

```rust
// 文件名: src/lib.rs

mod front_of_house { // 定义一个叫 front_of_house 的模块
    mod hosting { // 在 front_of_house 内部定义一个叫 hosting 的子模块
        fn add_to_waitlist() {} // hosting 模块里的函数
        fn seat_at_table() {}
    }

    mod serving { // 在 front_of_house 内部定义另一个子模块 serving
        fn take_order() {}
        fn serve_order() {}
        fn take_payment() {}
    }
}
```
**(注意：这里所有的模块和函数默认都是私有的)**

我们用 `mod` 关键字定义模块，模块名后面跟着大括号 `{}`，模块的内容就写在里面。模块里可以再定义其他模块（如 `hosting` 和 `serving` 是 `front_of_house` 的子模块），也可以定义函数、结构体、枚举等等。

**使用模块的好处：**
*   **组织性**：把相关的功能放在一起，代码结构更清晰。
*   **可读性**：别人看你的代码时，可以通过模块的组织结构快速找到他们关心的部分，而不用看遍所有定义。
*   **可维护性**：添加新功能时，也知道应该把代码放在哪个模块里，保持整体的整洁。

#### 模块树 (Module Tree)

`src/main.rs` (对于二进制 Crate) 和 `src/lib.rs` (对于库 Crate) 被称为 **Crate 根 (crate roots)**。这是因为这两个文件的内容本身就构成了一个名为 `crate` 的隐式模块，它位于整个 Crate 模块结构的顶端。这个结构就像一棵树，叫做**模块树 (module tree)**。

对于上面餐厅的例子 (Listing 7-1)，模块树看起来像这样：

```
crate (Crate 根，隐式的)
 └── front_of_house (我们定义的模块)
     ├── hosting (front_of_house 的子模块)
     │   ├── add_to_waitlist (hosting 里的函数)
     │   └── seat_at_table
     └── serving (front_of_house 的子模块，和 hosting 是兄弟关系)
         ├── take_order
         ├── serve_order
         └── take_payment
```

这棵树显示了模块之间的嵌套关系（比如 `hosting` 在 `front_of_house` 里面）和同级关系（比如 `hosting` 和 `serving` 都是 `front_of_house` 的直接子模块）。
*   如果模块 A 在模块 B 里面，我们说 A 是 B 的**子模块 (child)**，B 是 A 的**父模块 (parent)**。
*   整个模块树都根植于那个隐式的 `crate` 模块之下。

这个模块树的概念跟你电脑上文件系统的目录树非常像！就像用文件夹组织文件一样，我们用模块组织代码。而要找到模块里的东西，我们就需要一种“路径”机制，就像文件路径一样。后面就会讲到这个。