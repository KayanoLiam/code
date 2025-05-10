# Separating Modules into Different Files(将模块分离到不同的文件中)
怎么把一个大模块的代码拆分到不同的文件里去，让项目结构更清晰，代码更好管理。

之前咱们的例子都是把好几个模块定义在同一个 `.rs` 文件里。当模块变得越来越大，代码都堆在一个文件里就不太好找了。

### 将模块分离到不同文件

咱们还是用之前的餐厅例子（基于 Listing 7-17 的结构），目标是把模块拆分到单独的文件里。假设我们的 Crate 根文件是 `src/lib.rs`（对于二进制 Crate，根文件是 `src/main.rs`，操作方法是一样的）。

#### 步骤1：提取 `front_of_house` 模块

1.  **修改 `src/lib.rs`**：
    把 `front_of_house` 模块大括号 `{}` 里的代码删掉，只留下模块声明 `mod front_of_house;`。
    `src/lib.rs` 会变成这样 (类似 Listing 7-21)：

    ```rust
    // 文件名: src/lib.rs
    // 注意：这行代码暂时会让编译失败，直到我们创建对应的文件

    mod front_of_house; // 告诉编译器 front_of_house 模块的代码在别处

    // 下面的 pub use 和函数定义保持不变
    pub use crate::front_of_house::hosting;

    pub fn eat_at_restaurant() {
        hosting::add_to_waitlist(); // 假设 add_to_waitlist 依然存在且可访问
    }
    ```

2.  **创建 `src/front_of_house.rs` 文件**：
    新建一个文件，路径是 `src/front_of_house.rs`。把之前从 `src/lib.rs` 里 `front_of_house` 模块大括号中删掉的代码，粘贴到这个新文件里 (类似 Listing 7-22)。

    ```rust
    // 文件名: src/front_of_house.rs

    // 原来 front_of_house 模块里的内容现在放在这里
    pub mod hosting { // 假设 hosting 模块的内容我们暂时还放在这里，或者下一步再拆分
        pub fn add_to_waitlist() {
            println!("(来自 src/front_of_house.rs) 客人已加入等候名单。");
        }
    }
    // 如果 front_of_house 模块还有其他内容，也放在这里
    ```

    **编译器如何找到这个文件？**
    当编译器在 `src/lib.rs` (Crate 根) 看到 `mod front_of_house;` 这句声明时，它就会自动去以下两个地方之一查找 `front_of_house` 模块的代码：
    *   `src/front_of_house.rs` (这是新的、更推荐的方式)
    *   `src/front_of_house/mod.rs` (这是旧的方式，依然支持)

    **重要提示**：`mod` 声明不是其他语言里的 `#include`。你只需要在你的模块树中用 `mod` 声明一次模块。一旦编译器知道了这个文件是你项目的一部分（并且通过 `mod` 语句的位置知道了它在模块树中的位置），其他文件要引用这个模块里的代码时，应该使用正常的路径（绝对路径或相对路径），而不是再次用 `mod` 去“包含”它。

#### 步骤2：提取子模块 `hosting`

现在，我们想把 `hosting` 模块也提取到它自己的文件里。因为 `hosting` 是 `front_of_house` 的子模块，所以处理方式略有不同。我们会把 `hosting` 模块的文件放在一个以其父模块命名的目录中，也就是 `src/front_of_house/` 目录。

1.  **修改 `src/front_of_house.rs`**：
    把 `hosting` 模块大括号里的代码删掉，只留下声明 `pub mod hosting;`。
    `src/front_of_house.rs` 会变成这样：

    ```rust
    // 文件名: src/front_of_house.rs

    pub mod hosting; // 告诉编译器 hosting 子模块的代码在别处

    // 如果 front_of_house 模块还有其他直接定义的内容，保留在这里
    ```

2.  **创建 `src/front_of_house/hosting.rs` 文件**：
    首先，在 `src/` 目录下创建一个名为 `front_of_house` 的新文件夹。
    然后，在这个 `src/front_of_house/` 文件夹里，创建一个名为 `hosting.rs` 的新文件。把之前从 `src/front_of_house.rs` 里 `hosting` 模块大括号中删掉的代码，粘贴到这个新文件里。

    ```rust
    // 文件名: src/front_of_house/hosting.rs

    // 原来 hosting 模块里的内容现在放在这里
    pub fn add_to_waitlist() {
        println!("(来自 src/front_of_house/hosting.rs) 客人已加入等候名单。");
    }
    // 如果 hosting 模块还有其他内容，也放在这里
    ```

    **编译器如何找到这个子模块文件？**
    当编译器在 `src/front_of_house.rs` (父模块文件) 中看到 `pub mod hosting;` 这句声明时，它会在**父模块对应的目录**下查找 `hosting` 子模块的代码：
    *   `src/front_of_house/hosting.rs` (新的、推荐的方式)
    *   `src/front_of_house/hosting/mod.rs` (旧的方式，依然支持)

    如果错误地把 `hosting.rs` 直接放在 `src/` 目录下，编译器会以为你想在 Crate 根声明一个叫 `hosting` 的模块，而不是作为 `front_of_house` 的子模块，这就会导致错误。这种文件和目录结构与模块树的对应关系，是编译器查找规则的一部分。

### 备选的文件路径风格 (Alternate File Paths / 旧风格)

我们上面介绍的是 Rust 编译器查找模块文件最常用和推荐的方式。但 Rust 也支持一种旧的风格，主要区别在于使用名为 `mod.rs` 的文件。

*   对于在 **Crate 根**声明的模块（比如 `mod my_module;` 在 `src/lib.rs` 或 `src/main.rs` 中）：
    *   新风格: `src/my_module.rs`
    *   旧风格: `src/my_module/mod.rs` (模块代码在 `my_module` 文件夹下的 `mod.rs` 文件里)

*   对于**子模块**（比如在 `src/parent_module.rs` 中声明 `mod my_submodule;`）：
    *   新风格: `src/parent_module/my_submodule.rs`
    *   旧风格: `src/parent_module/my_submodule/mod.rs` (模块代码在 `parent_module/my_submodule` 文件夹下的 `mod.rs` 文件里)

**注意：**
*   如果你对同一个模块同时使用了新旧两种风格的文件（比如同时存在 `src/my_module.rs` 和 `src/my_module/mod.rs`），编译器会报错。
*   在一个项目中混用两种风格（比如模块 A 用新风格，模块 B 用旧风格）是允许的，但可能会让其他人阅读你的项目时感到困惑。
*   **使用 `mod.rs` 文件的主要缺点**：你的项目里可能会出现很多个都叫 `mod.rs` 的文件，当你在编辑器里同时打开它们时，很容易搞混。因此，**推荐使用 `<module_name>.rs` 的新风格**。

通过这种方式将模块代码分散到不同的文件后，你的模块树结构保持不变。之前在 `eat_at_restaurant` 函数中的调用（比如 `hosting::add_to_waitlist();`）不需要做任何修改，即使它们的定义现在位于不同的文件中。这种技术使得当模块逐渐变大时，你可以很方便地将它们移动到新文件中。

还要注意，`src/lib.rs` 中的 `pub use crate::front_of_house::hosting;` 语句也没有改变。`use` 关键字本身不影响哪些文件会被编译进 Crate。是 `mod` 关键字声明了模块，然后 Rust 根据模块名去查找对应的文件来获取该模块的代码。

### 总结一下模块文件分离

*   当一个模块变得很大时，可以将其内容移到一个单独的文件中。
*   **对于在 Crate 根声明的模块 `foo`**：
    *   在 Crate 根文件（`src/lib.rs` 或 `src/main.rs`）中写 `mod foo;`。
    *   模块 `foo` 的代码放在 `src/foo.rs` 文件中。
*   **对于模块 `parent` 的子模块 `bar`**：
    *   在 `parent` 模块的文件（比如 `src/parent.rs` 或 `src/parent/mod.rs`）中写 `mod bar;`。
    *   子模块 `bar` 的代码放在 `src/parent/bar.rs` 文件中。

这种方式让你的项目结构更加清晰，代码更容易导航和维护。

到这里，我们已经学习了如何将一个包（Package）拆分成多个单元（Crate），以及如何将一个单元拆分成多个模块（Module），并且可以通过绝对或相对路径来引用不同模块中的项。`use` 语句可以帮助我们简化路径的写法，而 `pub` 关键字则控制了哪些定义是公开的。模块的代码还可以分散到不同的文件中进行管理。