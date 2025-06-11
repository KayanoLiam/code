# Bringing Paths into Scope with the use Keyword(使用 `use` 关键字将路径引入作用域)
怎么用 `use` 关键字把路径“带入”当前作用域，让代码更简洁。

### 使用 `use` 关键字将路径引入作用域

每次调用函数都写一长串路径，确实挺麻烦也容易重复。比如在之前的餐厅例子 (Listing 7-7) 中，不管用绝对路径还是相对路径调用 `add_to_waitlist`，都得带着 `front_of_house::hosting::`。

`use` 关键字可以帮我们解决这个问题。你可以在某个作用域的开头用 `use` 创建一个路径的“快捷方式”，之后在这个作用域里就可以用更短的名字了。

**例子 (Listing 7-11 的思路):**

```rust
// 文件名: src/lib.rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() { println!("客人已加入等候名单。"); }
    }
}

// 使用 use 将 crate::front_of_house::hosting 引入当前作用域（Crate 根作用域）
// 之后，我们就可以用 hosting 来代表 crate::front_of_house::hosting
use crate::front_of_house::hosting;
// 或者，更常见地，我们会引入到模块本身，而不是具体函数，除非有特殊原因
// use crate::front_of_house::hosting::add_to_waitlist; // 这样下面可以直接写 add_to_waitlist()

pub fn eat_at_restaurant() {
    // 现在只需要写 hosting::add_to_waitlist()
    hosting::add_to_waitlist();
    // 如果上面是 use crate::front_of_house::hosting::add_to_waitlist;
    // 这里就可以直接写 add_to_waitlist();
}
```

*   `use crate::front_of_house::hosting;` 这句话就像在文件系统里创建一个符号链接（快捷方式）。
*   在 Crate 根作用域里写了这句 `use` 之后，`hosting` 就成了一个合法的名字，代表 `crate::front_of_house::hosting` 这个模块。
*   通过 `use` 引入的路径同样会检查隐私规则。如果 `hosting` 模块不是 `pub` 的，或者 `front_of_house` 对当前作用域不可见，那么 `use` 语句本身就会报错。

**`use` 的作用域限制：**
`use` 语句创建的快捷方式**只在 `use` 语句所在的作用域内有效**。

看这个例子 (Listing 7-12 的思路):

```rust
// 文件名: src/lib.rs
// 这段代码会编译失败！
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting; // 这个 use 在 Crate 根作用域

mod customer { // 新建了一个子模块 customer
    // eat_at_restaurant 现在在 customer 模块的作用域内
    pub fn eat_at_restaurant() {
        // hosting::add_to_waitlist(); // 编译错误！hosting 在这里未定义
                                   // 因为 Crate 根的 use 对 customer 模块无效
        // 要想修复，可以：
        // 1. 在 customer 模块内部也加一个 use:
        //    use crate::front_of_house::hosting;
        //    hosting::add_to_waitlist();
        // 2. 或者通过 super 访问父作用域中通过 use 引入的 hosting (如果 hosting 本身在父作用域可见)
        //    通常直接在当前模块 use 更清晰
        // 3. 或者使用完整路径
           crate::front_of_house::hosting::add_to_waitlist();
    }
}
```
编译器会报错，说在 `customer` 模块里找不到 `hosting`，因为 Crate 根的 `use` 快捷方式对 `customer` 子模块无效。同时，编译器可能还会警告说 Crate 根的那个 `use` 没被用到（因为它只创建了一个快捷方式，但没有在 Crate 根作用域直接使用这个快捷方式）。

### 创建符合习惯的 `use` 路径 (Idiomatic `use` Paths)

你可能会想，为什么 Listing 7-11 中我们写 `use crate::front_of_house::hosting;` 然后调用 `hosting::add_to_waitlist();`，而不是直接 `use crate::front_of_house::hosting::add_to_waitlist;` 然后直接调用 `add_to_waitlist();` (如 Listing 7-13)？

```rust
// Listing 7-11 的方式 (推荐用于函数)
// use crate::front_of_house::hosting;
// eat_at_restaurant() { hosting::add_to_waitlist(); }

// Listing 7-13 的方式 (不推荐用于函数)
// use crate::front_of_house::hosting::add_to_waitlist;
// eat_at_restaurant() { add_to_waitlist(); }
```

**习惯用法 (Idioms)：**

*   **对于函数**：通常推荐的做法是 `use` 到函数的**父模块**，然后在调用函数时明确写出模块名。
    *   比如 `use crate::front_of_house::hosting;` 然后 `hosting::add_to_waitlist();`。
    *   这样做的好处是：**代码清晰地表明了这个函数不是在当前模块本地定义的**，同时又简化了路径。如果直接 `use` 到函数本身，看代码时 `add_to_waitlist();` 可能会让人误以为它是本地函数。

*   **对于结构体、枚举和其他类型**：通常推荐的做法是 `use` 到**类型本身**。
    *   比如，引入标准库的 `HashMap`：
        ```rust
        // 文件名: src/main.rs
        use std::collections::HashMap; // 直接 use 到 HashMap 类型

        fn main() {
            let mut map = HashMap::new(); // 直接使用 HashMap
            map.insert(1, 2);
        }
        ```
        **(Listing 7-14)**

这个习惯并没有什么特别强硬的理由，只是一种社区逐渐形成的约定，大家习惯了这样读写 Rust 代码。

**例外：名称冲突**
如果用 `use` 引入的两个不同路径下的东西恰好同名，Rust 是不允许的。这时你就不能直接 `use` 到类型本身了。

比如，`std::fmt::Result` 和 `std::io::Result` 都叫 `Result`。

```rust
// 文件名: src/lib.rs
use std::fmt; // 引入父模块
use std::io;  // 引入父模块

fn function1() -> fmt::Result { // 使用时带上父模块名
    // --snip--
    Ok(()) // 假设返回 Ok
}

fn function2() -> io::Result<()> { // 使用时带上父模块名
    // --snip--
    Ok(()) // 假设返回 Ok
}
```
**(Listing 7-15)**
这里，通过在类型前加上父模块名 (`fmt::Result`, `io::Result`) 来区分它们。如果你写 `use std::fmt::Result;` 和 `use std::io::Result;`，那么当你在代码里写 `Result` 时，编译器就不知道你指的是哪个了。

### 使用 `as` 关键字提供新名称 (别名)

对于上面那种名称冲突的情况，除了 `use` 父模块外，还有另一个解决方案：使用 `as` 关键字给引入的类型起一个**别名 (alias)**。

```rust
// 文件名: src/lib.rs
use std::fmt::Result; // 这个 Result 保持原名
use std::io::Result as IoResult; // 将 std::io::Result 重命名为 IoResult

fn function1() -> Result { // 直接使用 fmt::Result
    // --snip--
    Ok(())
}

fn function2() -> IoResult<()> { // 使用别名 IoResult
    // --snip--
    Ok(())
}
```
**(Listing 7-16)**
这里，我们将 `std::io::Result` 重命名为 `IoResult`，这样就不会和 `std::fmt::Result`（它仍然叫 `Result`）冲突了。Listing 7-15 和 Listing 7-16 的方法都被认为是符合习惯的，你可以根据喜好选择。

### 使用 `pub use` 重导出名称 (Re-exporting)

当我们用 `use` 关键字把一个名称引入当前作用域时，这个新引入的名称（快捷方式）默认是**私有的**。也就是说，只有当前模块能用这个快捷方式，其他模块（比如调用我们这个模块代码的外部模块）不能通过这个快捷方式访问。

如果我们想让调用我们代码的外部代码也能像我们一样使用这个快捷方式（就好像这个东西是直接定义在我们模块的公开API里一样），我们可以结合 `pub` 和 `use`，这叫做**重导出 (re-exporting)**。

看例子 (基于 Listing 7-11，修改为 Listing 7-17):

```rust
// 文件名: src/lib.rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

// 将 crate::front_of_house::hosting 模块重导出为当前 Crate 根模块的公开成员
pub use crate::front_of_house::hosting;
// 现在，外部代码如果依赖这个 restaurant Crate，
// 就可以通过 restaurant::hosting::add_to_waitlist() 来调用函数了。

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist(); // 内部仍然可以用快捷方式
}
```

**解释 `pub use`：**
*   `use crate::front_of_house::hosting;` 只是在当前作用域（Crate 根）创建了一个私有的快捷方式 `hosting`。
*   `pub use crate::front_of_house::hosting;` 不仅创建了这个快捷方式，还把它**公开**了。
*   这意味着，如果其他 Crate 依赖了我们这个 `restaurant` Crate，它们原来可能需要写 `restaurant::front_of_house::hosting::add_to_waitlist()` 来调用函数（并且 `front_of_house` 模块本身也需要是 `pub` 的才行）。
*   现在因为有了 `pub use crate::front_of_house::hosting;`，外部代码可以直接写 `restaurant::hosting::add_to_waitlist()`。`hosting` 模块现在看起来就像是直接定义在 `restaurant` Crate 根下一样（对于外部使用者而言）。

**重导出的用处：**
当你的代码内部组织结构和你希望外部使用者感知的API结构不一样时，重导出非常有用。比如餐厅的例子，内部可能有“前厅”、“后厨”的划分，但顾客可能不关心这些，他们只想“点餐”、“预订”。通过 `pub use`，你可以把内部复杂结构中的某些部分以更简洁、更符合用户思维的方式暴露出去。

### 使用外部包 (External Packages)

我们在第二章的猜数字游戏里用过一个叫 `rand` 的外部包来生成随机数。
步骤回顾：
1.  **在 `Cargo.toml` 中添加依赖**：
    ```toml
    # Filename: Cargo.toml
    [dependencies]
    rand = "0.8.5" # 或者最新版本
    ```
    这告诉 Cargo 去 `crates.io` (Rust 的官方包仓库) 下载 `rand` 包及其所有依赖。
2.  **使用 `use` 将其引入作用域**：
    ```rust
    // 在你的 .rs 文件里
    use rand::Rng; // 引入 Rng trait

    fn main() {
        let secret_number = rand::thread_rng().gen_range(1..=100);
        // 注意，像 rand::thread_rng() 这样的函数，如果其父模块 rand 没有被 use，
        // 那么就需要用 Crate 名 rand:: 开头来调用。
        // Rng trait 被 use 后，就可以直接在实现了该 trait 的类型上调用其方法，比如 .gen_range()。
    }
    ```

标准库 `std` 也是一个对我们项目来说“外部”的 Crate，但因为它随 Rust 语言一起发布，所以我们不需要在 `Cargo.toml` 里声明它。但是，要使用 `std` 里的东西，仍然需要用 `use` 把它们引入作用域，比如：
`use std::collections::HashMap;`
这是一个以 `std` (标准库 Crate 名) 开头的绝对路径。

### 使用嵌套路径清理大量的 `use` 列表 (Nested Paths)

如果你从同一个 Crate 或同一个模块引入很多东西，每个都写一行 `use` 会占用很多垂直空间。

比如：
```rust
// use std::cmp::Ordering;
// use std::io;
```
可以合并成一行，使用嵌套路径：
```rust
use std::{cmp::Ordering, io}; // 公共前缀 std::，然后大括号里列出不同的部分
```
**(Listing 7-18)**
这对于从同一个父路径引入多个子项非常有用。

嵌套路径可以用在路径的任何层级。如果一个 `use` 路径是另一个 `use` 路径的子路径，也可以合并。
比如 (Listing 7-19):```rust
// use std::io;
// use std::io::Write;
```
这里 `std::io` 是共同部分，并且它本身也是一个完整的引入项。可以用 `self` 关键字来代表这个共同部分本身：
```rust
use std::io::{self, Write}; // self 代表 std::io, Write 代表 std::io::Write
```
**(Listing 7-20)**
这样一行就同时引入了 `std::io` 和 `std::io::Write`。

### Glob 操作符 (`*`)

如果你想把一个路径下的**所有公开的**东西都引入当前作用域，可以用路径后面跟上 `*` (glob 操作符)：

`use std::collections::*;`

这会把 `std::collections` 模块下所有公开的结构体、枚举、函数等都引入进来。

**谨慎使用 Glob (`*`)！**
*   它会使代码更难理解，因为你不知道作用域里的某个名字具体是从哪里来的。
*   容易造成名称冲突。

Glob 操作符通常用在以下场景：
*   **测试模块**：在写测试时，经常会 `use super::*;` 来引入被测试模块的所有东西，方便测试（第11章会讲）。
*   **Prelude 模式**：某些库可能会定义一个 `prelude` 模块，包含最常用的一些类型和 trait，然后建议用户 `use some_crate::prelude::*;` 来方便地引入这些常用项。标准库也有类似模式。

总的来说，`use` 是一个非常方便的工具，可以大大提高代码的可读性和简洁性，但也要注意遵循社区的习惯用法，并小心 Glob 操作符的滥用。