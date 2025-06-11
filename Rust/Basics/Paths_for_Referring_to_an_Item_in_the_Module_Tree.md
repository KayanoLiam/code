# Paths for Referring to an Item in the Module Tree(在模块树中引用项的路径)

在模块树里面通过“路径”（Paths）来找到我们想要的东西（比如函数、结构体等）。

### 路径 (Paths)

就像你在电脑上用文件路径（比如 `C:\Users\YourName\Documents\file.txt` 或者 `/home/yourname/documents/file.txt`）来定位文件一样，Rust 里也用路径来定位模块树里的“物品”（item）。要调用一个函数，你就得知道它的路径。

路径有两种形式：

1.  **绝对路径 (Absolute Path)**：
    *   从 Crate 的**根**开始的完整路径。
    *   如果代码来自**外部的 Crate**（也就是你项目依赖的库），绝对路径以**那个 Crate 的名字**开头。
    *   如果代码来自**当前的 Crate**，绝对路径以字面量 `crate` 开头。

2.  **相对路径 (Relative Path)**：
    *   从**当前模块**开始。
    *   可以使用 `self`（代表当前模块）、`super`（代表父模块），或者当前模块里的某个标识符（比如一个子模块名）作为起点。

无论是绝对路径还是相对路径，路径的各个部分都用**双冒号 `::`** 分隔。

#### 例子：调用 `add_to_waitlist` 函数

回到我们之前餐厅的例子 (Listing 7-1)，假设我们想在 Crate 根定义一个新函数 `eat_at_restaurant`，并且在这个函数里调用 `front_of_house::hosting` 模块里的 `add_to_waitlist` 函数。

```rust
// 文件名: src/lib.rs
// 这个代码现在还不能编译！后面会解释为什么。

mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {} // 我们要调用的函数
    }
}

pub fn eat_at_restaurant() { // 我们把它声明为 pub，表示它是公开的API
    // 使用绝对路径调用
    crate::front_of_house::hosting::add_to_waitlist();

    // 使用相对路径调用
    front_of_house::hosting::add_to_waitlist();
}
```
**(Listing 7-3 的简化版)**

*   **绝对路径**：`crate::front_of_house::hosting::add_to_waitlist()`
    *   `crate`: 代表当前 Crate 的根。
    *   `front_of_house`: 根模块下的 `front_of_house` 子模块。
    *   `hosting`: `front_of_house` 模块下的 `hosting` 子模块。
    *   `add_to_waitlist`: `hosting` 模块里的函数。
    *   这就像文件系统里的 `/front_of_house/hosting/add_to_waitlist`。

*   **相对路径**：`front_of_house::hosting::add_to_waitlist()`
    *   因为 `eat_at_restaurant` 函数和 `front_of_house` 模块都直接定义在 Crate 根下（它们是“兄弟姐妹”关系），所以可以直接从 `front_of_house` 开始。
    *   这就像在 `/` 目录下，你想访问 `front_of_house/hosting/add_to_waitlist`，你可以直接写 `front_of_house/hosting/add_to_waitlist`。

**选择绝对路径还是相对路径？**

*   这取决于你的项目和你移动代码的习惯。
*   如果你把 `front_of_house` 模块和 `eat_at_restaurant` 函数一起移动到另一个新模块（比如 `customer_experience`）里，那么相对路径 `front_of_house::hosting::add_to_waitlist()` 可能仍然有效（如果它们还在同一个父模块下），但绝对路径 `crate::...` 就需要更新了。
*   如果你只把 `eat_at_restaurant` 函数移动到另一个模块（比如 `dining`），而 `front_of_house` 不动，那么绝对路径 `crate::front_of_house::hosting::add_to_waitlist()` 依然有效，但相对路径就需要更新了。
*   **通常更倾向于使用绝对路径**，因为代码定义和调用它们的地方往往是独立移动的。

#### 编译错误：私有性问题 (Privacy)

现在，如果我们尝试编译上面的代码 (Listing 7-3)，会得到错误 (如 Listing 7-4 所示)：

```
error[E0603]: module `hosting` is private
 --> src/lib.rs:9:28
  |
9 |     crate::front_of_house::hosting::add_to_waitlist();
  |                            ^^^^^^^ private module
...
error[E0603]: module `hosting` is private
  --> src/lib.rs:12:21
   |
12 |     front_of_house::hosting::add_to_waitlist();
   |                     ^^^^^^^ private module
...
```

错误信息说 `hosting` 模块是**私有的 (private)**。虽然我们的路径是正确的，但 Rust 不让我们用，因为我们没有权限访问私有的部分。

**Rust 的隐私规则核心：**
*   默认情况下，一个模块里的所有东西（函数、结构体、枚举、模块、常量等）对于其**父模块**和**外部模块**来说都是**私有的**。
*   父模块里的代码**不能**直接访问子模块里私有的东西。
*   子模块里的代码**可以**访问其祖先模块（父模块、父模块的父模块等）里的东西（只要那些东西对子模块可见）。

你可以把这想象成餐厅的后厨：后厨里的事情对顾客（外部）是保密的，但后厨经理（父模块）可以看到并管理餐厅（子模块）里的一切（如果子模块选择公开的话）。

Rust 这样设计是为了**默认隐藏内部实现细节**。这样，你就可以在不破坏外部代码（使用者）的情况下，自由地修改模块内部的实现。

但是，Rust 也提供了**公开 (expose)** 内部东西的机制，那就是使用 `pub` 关键字。

### 使用 `pub` 关键字公开路径 (Exposing Paths with the `pub` Keyword)

为了解决上面 `hosting` 模块私有的问题，我们需要让 `hosting` 模块公开，这样 `eat_at_restaurant` 才能访问它。

修改代码 (类似 Listing 7-5):

```rust
// 文件名: src/lib.rs
// 这个代码仍然不能编译！

mod front_of_house {
    pub mod hosting { // 把 hosting 模块声明为 pub
        fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    crate::front_of_house::hosting::add_to_waitlist();
    front_of_house::hosting::add_to_waitlist();
}
```

编译，仍然有错误 (如 Listing 7-6 所示)：

```
error[E0603]: function `add_to_waitlist` is private
 --> src/lib.rs:9:37
  |
9 |     crate::front_of_house::hosting::add_to_waitlist();
  |                                     ^^^^^^^^^^^^^^^ private function
...
```

这次错误变成了 `add_to_waitlist` 函数是私有的。

**发生了什么？**
*   在 `mod hosting` 前面加上 `pub`，使得 `hosting` **模块本身**变成了公开的。这意味着，如果代码能访问到 `front_of_house`，那么它也能访问到 `hosting` 这个“容器”。
*   但是，**模块公开了，不代表模块里面的内容也自动公开了**。`hosting` 里面的 `add_to_waitlist` 函数仍然是私有的。
*   `pub` 关键字用在模块上，只是允许其祖先模块引用它，并不能访问其内部的私有代码。

我们需要更进一步，把模块内部我们想让外面用的东西也声明为 `pub`。

再修改代码 (如 Listing 7-7):

```rust
// 文件名: src/lib.rs
// 这次代码可以编译了！

mod front_of_house {
    pub mod hosting { // hosting 模块公开
        pub fn add_to_waitlist() {} // add_to_waitlist 函数也公开
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist();

    // 相对路径
    front_of_house::hosting::add_to_waitlist();
}
```

现在代码终于可以编译了！

**为什么这次可以了？**
*   **绝对路径**：
    1.  `crate`：Crate 根。
    2.  `front_of_house`：虽然它本身不是 `pub`，但因为它和 `eat_at_restaurant` 在同一个模块（Crate 根）下，是兄弟关系，所以 `eat_at_restaurant` 可以访问它。
    3.  `hosting`：它被声明为 `pub mod hosting`，并且它的父模块 `front_of_house` 可访问，所以 `hosting` 也可访问。
    4.  `add_to_waitlist`：它被声明为 `pub fn add_to_waitlist()`，并且它的父模块 `hosting` 可访问，所以这个函数调用成功！
*   **相对路径**：
    1.  `front_of_house`：和绝对路径的第二点一样，因为是兄弟模块，所以可访问。
    2.  `hosting` 和 `add_to_waitlist` 因为都加了 `pub`，所以后续路径也有效。

**公开 API (Public API)**
当你写一个库 Crate 给别人用时，所有你标记为 `pub` 的东西（模块、函数、结构体等）就组成了这个库的**公共应用程序接口 (Public API)**。这是你和使用者之间的“合同”，规定了他们可以如何与你的代码交互。管理和演进 Public API 是一个重要的话题，需要考虑兼容性等问题（但这超出了本文的范围）。

### 同时包含二进制和库 Crate 的包的最佳实践

一个 Package 可以同时包含 `src/main.rs`（二进制 Crate 根）和 `src/lib.rs`（库 Crate 根）。
通常的做法是：
*   **`src/lib.rs`**：定义主要的逻辑和模块树。
*   **`src/main.rs`**：只包含最少的代码，主要用来启动可执行程序，并调用库 Crate (`src/lib.rs`) 中的代码。

这样，其他项目就可以通过依赖你的库 Crate 来复用大部分功能。二进制 Crate (`main.rs`) 就像是库 Crate 的一个普通用户，它只能使用库 Crate 公开的 API。这也有助于你设计出更好的 API，因为你自己就是第一个用户！

### 使用 `super` 开始相对路径

你可以用 `super` 关键字来创建从**父模块**开始的相对路径，而不是从当前模块或 Crate 根开始。这有点像文件系统里的 `../` (返回上一级目录)。

当你引用的东西在父模块中，并且你觉得当前模块和父模块的关系比较紧密，将来可能会一起移动时，用 `super` 会比较方便，因为如果它们一起移动到新的位置，这个相对路径可能依然有效。

例子 (Listing 7-8):

```rust
// 文件名: src/lib.rs

fn deliver_order() { println!("订单已送达！(来自根模块)"); }

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        super::deliver_order(); // 调用父模块(crate根)中的 deliver_order
    }

    fn cook_order() { println!("正在烹饪订单..."); }
}

// 为了能调用，我们加个测试函数
// pub fn test_super() {
//     back_of_house::fix_incorrect_order(); // 这会报错，因为 fix_incorrect_order 是私有的
// }
// 要想调用 fix_incorrect_order，需要把它或者 back_of_house 模块设为 pub
// 或者在 back_of_house 模块内部调用它。
```
在 `fix_incorrect_order` (位于 `back_of_house` 模块) 中，`super::deliver_order()`：
*   `super` 指向 `back_of_house` 的父模块，也就是 Crate 根。
*   然后在 Crate 根中找到了 `deliver_order` 函数。

### 公开结构体 (Structs) 和枚举 (Enums)

你也可以用 `pub` 来使结构体和枚举公开，但有一些细节：

*   **结构体 (Structs)**：
    *   用 `pub struct MyStruct { ... }` 会使**结构体本身**公开。
    *   但是，结构体的**字段 (fields)** 默认情况下仍然是**私有的**。
    *   你需要**单独**为每个你想公开的字段加上 `pub`。

    例子 (Listing 7-9):
    ```rust
    // 文件名: src/lib.rs
    mod back_of_house {
        pub struct Breakfast { // Breakfast 结构体公开
            pub toast: String,    // toast 字段公开
            seasonal_fruit: String, // seasonal_fruit 字段私有
        }

        impl Breakfast {
            pub fn summer(toast: &str) -> Breakfast { // 公开的关联函数来创建实例
                Breakfast {
                    toast: String::from(toast),
                    seasonal_fruit: String::from("peaches"), // 内部可以设置私有字段
                }
            }
        }
    }

    pub fn eat_at_restaurant_v2() {
        let mut meal = back_of_house::Breakfast::summer("Rye");
        meal.toast = String::from("Wheat"); // 可以访问和修改公开的 toast 字段
        println!("我想要 {} 吐司，谢谢！", meal.toast);

        // 下面这行如果取消注释会编译错误，因为 seasonal_fruit 是私有的
        // meal.seasonal_fruit = String::from("blueberries");
        // println!("水果是: {}", meal.seasonal_fruit); // 也不能读取私有字段
    }
    ```
    因为 `Breakfast` 有私有字段 `seasonal_fruit`，所以它需要提供一个公开的关联函数（如 `summer`）来创建实例。否则，在 `eat_at_restaurant_v2` 中就无法创建 `Breakfast` 实例，因为它不能直接设置私有字段的值。

*   **枚举 (Enums)**：
    *   如果用 `pub enum MyEnum { ... }` 使枚举公开，那么它的**所有变体 (variants)** 也都会自动变成**公开的**。
    *   你只需要在 `enum` 关键字前加 `pub` 即可。

    例子 (Listing 7-10):
    ```rust
    // 文件名: src/lib.rs (可以接在上面代码后面)
    mod back_of_house_appetizer { // 用不同模块名避免冲突
        pub enum Appetizer { // Appetizer 枚举公开
            Soup,  // Soup 变体自动公开
            Salad, // Salad 变体自动公开
        }
    }

    pub fn order_appetizers() {
        let order1 = back_of_house_appetizer::Appetizer::Soup;
        let order2 = back_of_house_appetizer::Appetizer::Salad;
        // 可以自由使用公开枚举的公开变体
    }
    ```    枚举的变体默认就是公开的（如果枚举本身是公开的），因为如果变体不公开，枚举就没什么用了。而结构体的字段通常有选择性公开的需求，所以它们遵循默认私有的规则。

我们差不多把模块系统的核心概念（模块声明、路径、`pub`、`super`）都讲了。还有一个重要的关键字是 `use`，它能帮我们简化路径的写法，接下来会讲到它，以及如何将 `pub` 和 `use` 结合起来。