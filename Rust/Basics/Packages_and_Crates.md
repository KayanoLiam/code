# Packages_and_Crates
Rust 项目里的“包裹”（Package）和“箱子”（Crate）。这俩是 Rust 代码组织的基本单位。

### Crate (箱子/单元)

你可以把 `Crate` 理解成 Rust 代码的一个“单元”或者一个“箱子”。这是编译器一次处理代码的最小单位。就算你不用 `cargo`，直接用 `rustc` 编译一个单独的 `.rs` 文件，那个文件也被编译器看作一个 Crate。

Crate 有两种主要形式：

1.  **二进制 Crate (Binary Crate)**：
    *   这种 Crate 编译出来是**可执行程序**，比如你平时用的命令行工具或者一个服务器程序。
    *   它**必须有一个 `main` 函数**，这个 `main` 函数就是程序跑起来的时候首先执行的地方。
    *   咱们之前用 `cargo new project_name` 创建的项目，默认生成的都是二进制 Crate。

2.  **库 Crate (Library Crate)**：
    *   这种 Crate **没有 `main` 函数**，所以它不能直接编译成可执行程序让你去运行。
    *   它的目的是定义一些功能（比如函数、结构体等），**给其他的项目（二进制 Crate 或其他库 Crate）共享使用**。
    *   比如，之前我们可能用到的 `rand` Crate（用来生成随机数），它就是一个库 Crate。
    *   当 Rust 程序员说“Crate”的时候，他们大多数时候指的就是“库 Crate”，基本上可以把它和咱们平常说的“库”（library）划等号。

**Crate 的根 (Crate Root)**：
编译器编译一个 Crate 时，需要一个“起点”文件，这个文件就是 Crate 的根。
*   对于二进制 Crate，约定的根文件是 `src/main.rs`。
*   对于库 Crate，约定的根文件是 `src/lib.rs`。
这个根文件是构成 Crate 根模块的地方（模块后面会细说）。

### Package (包裹/项目)

`Package` 呢，就像一个“包裹”或者一个“项目”。一个 Package 里面可以装**一个或多个 Crate**，提供一套完整的功能。

关键点：

1.  **`Cargo.toml` 文件**：每个 Package **必定**包含一个 `Cargo.toml` 文件。这个文件非常重要，它描述了这个 Package 的信息（比如名字、版本），以及如何构建它里面的那些 Crate（比如依赖哪些其他的库 Crate）。你可以把它看作是这个“包裹”的“清单”或“说明书”。
2.  **Cargo 本身也是个 Package**：咱们平时用的 `cargo` 命令行工具，它本身也是一个 Package。这个 Package 里包含了一个二进制 Crate（就是我们运行的 `cargo` 命令），还包含了一个库 Crate，这个二进制 Crate 依赖于那个库 Crate 提供的功能。其他项目也可以依赖 Cargo 的库 Crate。
3.  **Crate 数量规则**：
    *   一个 Package **最多只能有一个库 Crate**。
    *   一个 Package **可以有任意多个二进制 Crate**。
    *   一个 Package **至少要包含一个 Crate**（不管是库 Crate 还是二进制 Crate）。

#### 举个例子：`cargo new my-project`

当我们运行 `cargo new my-project` 命令时，会发生什么：

```bash
$ cargo new my-project
     Created binary (application) `my-project` package
$ ls my-project
Cargo.toml # 看，这就是 Package 的清单文件
src        # 源代码目录
$ ls my-project/src
main.rs    # 看，这就是二进制 Crate 的根文件
```

分析一下：
*   `my-project` 目录代表一个 **Package**。
*   里面有个 `Cargo.toml` 文件，确认了这是个 Package。
*   `src/main.rs` 文件是这个 Package 中一个**二进制 Crate**的根。这个二进制 Crate 的名字默认和 Package 的名字一样，也是 `my-project`。

Cargo 有一套约定：
*   如果 Package 目录下有 `src/main.rs`，Cargo 就知道这个 Package 包含一个和 Package同名的**二进制 Crate**，并且 `src/main.rs` 是它的入口。
*   如果 Package 目录下有 `src/lib.rs`，Cargo 就知道这个 Package 包含一个和 Package同名的**库 Crate**，并且 `src/lib.rs` 是它的入口。

所以：
*   一个只有 `src/main.rs` 的 Package（像上面例子那样），它就只包含一个二进制 Crate。
*   如果一个 Package 同时有 `src/main.rs` 和 `src/lib.rs`，那么它就有两个 Crate：一个二进制 Crate 和一个库 Crate，它们的名字都和 Package 的名字相同。
*   如果想让一个 Package 有**多个二进制 Crate** 怎么办？可以在 `src/bin/` 目录下放文件。比如你在 `src/bin/` 下放一个 `another_tool.rs` 文件（里面要有 `main` 函数），那么这个 Package 就会多一个名为 `another_tool` 的二进制 Crate。

**总结一下关系：**

*   **Crate 是编译的基本单元**（一箱货）。可以是能跑的程序（二进制 Crate），也可以是给别人用的代码库（库 Crate）。
*   **Package 是组织和构建 Crate 的单位**（一个大包裹），通过 `Cargo.toml` 文件来管理。一个包裹里可以有一个库箱子，和/或多个可执行程序箱子。

当你用 `cargo build` 或 `cargo run` 时，Cargo 会读取 `Cargo.toml`，然后根据约定找到 `src/main.rs` (构建二进制程序) 或 `src/lib.rs` (构建库)，或者 `src/bin/` 下的文件，然后把这些“Crate 根文件”交给 `rustc` 编译器去编译。