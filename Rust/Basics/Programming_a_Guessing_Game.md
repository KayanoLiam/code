# 编程一个猜数字游戏 (Programming a Guessing Game)
一起来做一个经典的编程入门项目——**猜数字游戏**。这个过程会带你认识 Rust 里的不少基本概念，比如变量、匹配、方法、关联函数、怎么用别人写的代码（外部库）等等。咱们边做边学！

**游戏规则很简单：**

1.  程序会偷偷想一个 1 到 100 之间的随机整数。
2.  程序会提示你（玩家）输入一个猜测的数字。
3.  你输入数字后，程序会告诉你猜的数字是太大了还是太小了。
4.  如果你猜对了，程序会恭喜你，然后游戏结束。

**第一步：新建项目**

咱们需要先用 Cargo 创建一个新的项目。打开你的终端（命令行），切换到你存放项目的目录下，然后运行：

```bash
cargo new guessing_game
cd guessing_game
```

*   `cargo new guessing_game`：这命令会创建一个名为 `guessing_game` 的新文件夹，里面包含了 Rust 项目的基本结构（`Cargo.toml` 配置文件和 `src/main.rs` 源码文件）。
*   `cd guessing_game`：进入这个新创建的项目文件夹。

现在看看 `Cargo.toml` 文件，它大概长这样：

```toml
# Filename: Cargo.toml
[package]
name = "guessing_game"
version = "0.1.0"
edition = "2021" # 或者其他版本，比如 2018

[dependencies]
# 这里暂时是空的，后面我们会添加依赖
```

这个文件定义了项目的名字、版本、用的 Rust Edition，以及项目依赖的其他库（我们叫它 Crates）。

再看看 `src/main.rs` 文件，Cargo 已经帮我们生成了一个经典的 "Hello, world!" 程序：

```rust
// Filename: src/main.rs
fn main() {
    println!("Hello, world!");
}
```

咱们可以用 `cargo run` 来编译并运行它：

```bash
cargo run
# 你会看到编译信息，最后输出：
# Hello, world!
```

`cargo run` 这个命令很方便，编译和运行一步到位，特别适合我们这样需要快速修改、测试的场景。

好，现在打开 `src/main.rs`，咱们要在这个文件里写游戏代码了。

**第二步：处理玩家的猜测**

游戏的第一步是让玩家输入猜测的数字，然后我们把这个输入读进来。把 `src/main.rs` 里的代码改成下面这样：

```rust
// Filename: src/main.rs
use std::io; // 引入标准库中的 io 模块

fn main() {
    println!("猜数字游戏!"); // 游戏标题

    println!("请输入你猜的数字："); // 提示用户输入

    // 创建一个可变的变量，用来存储用户输入的字符串
    let mut guess = String::new();

    // 读取用户输入
    io::stdin() // 获取标准输入（键盘）的句柄
        .read_line(&mut guess) // 读取一行输入，存到 guess 变量里
        .expect("读取输入失败"); // 如果读取失败，程序崩溃并显示消息

    // 打印用户输入的猜测
    println!("你猜的数字是：{}", guess);
}
```

我们来一行行看懂这些代码：

*   `use std::io;`
    *   **大白话：** 我们要用到处理输入输出（比如从键盘读数据、往屏幕打印东西）的功能，这些功能在 Rust 的**标准库 (`std`)** 的 `io` 模块里。这行代码就是告诉 Rust：“我要用 `std::io` 里面的东西！”。
    *   **补充：** Rust 标准库里有一些最常用的东西（比如 `String` 类型、`println!` 宏）是默认就能用的，这部分叫“预导入项 (prelude)”。但 `io` 模块不在里面，所以需要我们手动用 `use` 关键字把它“引进来”。
*   `fn main() { ... }`
    *   **大白话：** 和之前一样，`main` 函数是程序的入口，代码从这里开始执行。
*   `println!("...");`
    *   **大白话：** 还是我们熟悉的打印宏，用来在屏幕上显示提示信息。
*   `let mut guess = String::new();`
    *   **大白话：** 这行代码做了几件事，咱们拆开看：
        *   `let`：这是 Rust 里用来**声明变量**的关键字。
        *   `mut`：这个词是 "mutable"（可变的）的缩写。在 Rust 里，变量**默认是不可变的 (immutable)**，意思是一旦给它赋值了，就不能再改了（比如 `let x = 5;` 这个 `x` 就永远是 5）。如果你希望变量的值可以改变，就必须在变量名前面加上 `mut` 关键字。我们这里需要 `guess` 变量能被修改（因为要往里面存用户输入），所以用了 `mut`。
        *   `guess`：这是我们给变量起的名字。
        *   `=`：赋值符号。
        *   `String::new()`：这里创建了一个新的、**空的字符串 (`String`)**。`String` 是 Rust 标准库提供的一种可以增长、包含 UTF-8 文本的字符串类型。
        *   `::new`：这里的 `::` 语法表示 `new` 是 `String` 类型的一个**关联函数 (associated function)**。你可以把它想象成其他语言里的“静态方法”。`String::new()` 就是调用 `String` 类型的 `new` 函数，来创建一个新的空字符串实例。
    *   **总结：** 这整行代码创建了一个名为 `guess` 的**可变**变量，并把它初始化为一个空的 `String`。
*   `io::stdin()`
    *   **大白话：** 调用 `io` 模块里的 `stdin` 函数。这个函数会返回一个代表“标准输入”的对象，通常就是你的键盘输入。
*   `.read_line(&mut guess)`
    *   **大白话：** 这是在调用“标准输入”对象上的一个**方法 (method)**，叫做 `read_line`。方法就像是附加在某个特定类型的值上的函数。
    *   **作用：** `read_line` 会读取用户在终端里输入的一整行内容（直到按下回车键），然后把这些内容**追加**到一个字符串变量里。
    *   **`&mut guess`**：这里是把我们的 `guess` 变量传给了 `read_line`。但是注意前面的 `&mut`：
        *   `&` 表示我们传递的是一个**引用 (reference)**。引用允许你让代码的不同部分访问同一份数据，而不需要把数据复制多份，效率更高。你可以暂时把引用理解为“数据的地址”或者“指向数据的指针”。在 Rust 里用引用很安全。
        *   `mut`：因为 `read_line` 需要**修改** `guess` 变量的内容（把用户输入加进去），所以我们需要传递一个**可变引用 (`&mut`)**。如果只写 `&guess`（不可变引用），`read_line` 就无法修改它，编译会报错。
*   `.expect("读取输入失败")`
    *   **大白话：** `read_line` 函数在读取输入时可能会出错（比如操作系统层面发生 I/O 错误）。为了处理这种可能性，`read_line` 实际上返回的不是读取到的字节数，而是一个叫做 `Result` 的特殊类型。
    *   **`Result` 是什么？** 它是一个**枚举 (enum)**，代表一个操作可能成功 (`Ok`)，也可能失败 (`Err`)。
        *   如果读取成功，`read_line` 返回 `Ok(读取的字节数)`。
        *   如果读取失败，`read_line` 返回 `Err(错误信息)`。
    *   **`.expect()` 方法：** `Result` 类型有一个 `expect` 方法。它的作用是：
        *   如果 `Result` 是 `Ok(值)`，`expect` 会把里面的“值”取出来返回给你。
        *   如果 `Result` 是 `Err(错误)`，`expect` 会让程序**立即崩溃 (panic!)**，并打印你传给 `expect` 的消息（这里是 "读取输入失败"）以及一些错误细节。
    *   **为什么要用 `expect`？** Rust 编译器会检查你是否处理了 `Result` 可能的失败情况。如果你调用 `read_line` 但不处理 `Result`（比如不调用 `.expect()` 或其他处理方法），编译器会给你一个警告，提醒你可能忽略了错误。在这个简单的游戏中，我们不打算写复杂的错误处理逻辑，如果连读取输入都失败了，就直接让程序崩溃好了，所以用了 `expect`。后面我们会学习更优雅的错误处理方式。
    *   **代码换行：** 原本可以写成一行 `io::stdin().read_line(&mut guess).expect(...)`，但为了可读性，我们用 `.` 把方法调用换行了。
*   `println!("你猜的数字是：{}", guess);`
    *   **大白话：** 打印用户输入的内容。注意这里 `guess` 变量现在包含了用户输入的那一行字符串（可能还包括结尾的回车换行符）。
    *   `{}` 是一个**占位符**，`println!` 会把后面跟着的 `guess` 变量的值填到这个位置。

**测试一下第一部分！**

现在运行 `cargo run`：

```bash
cargo run
# 输出:
# 猜数字游戏!
# 请输入你猜的数字：
# (程序会在这里等待你输入)
```

你输入一个数字，比如 `42`，然后按回车：

```bash
42 # 这是你输入的
# 输出:
# 你猜的数字是：42
# (后面还有一个换行符，虽然你看不到)
```

很好！我们现在能获取用户的输入并打印出来了。

**第三步：生成秘密数字**

接下来，我们需要让程序生成一个秘密的随机数字，让玩家来猜。这个数字每次运行程序时都应该是不同的，不然就没意思了。我们把它限制在 1 到 100 之间。

Rust 的标准库里目前没有内置随机数生成功能。但是，Rust 有一个强大的包（库）生态系统，我们可以很方便地使用别人写好的库。我们需要用到一个叫做 `rand` 的库（crate）。

**引入外部库 (`rand` Crate)**

*   **Crate 是什么？** 在 Rust 里，一个库或者一个可执行程序都叫做一个 Crate。我们正在写的 `guessing_game` 是一个二进制 Crate (binary crate)，因为它能生成可执行文件。`rand` 是一个库 Crate (library crate)，它提供代码给其他程序用，但它本身不能单独运行。
*   **告诉 Cargo 我们需要 `rand`：** 打开 `Cargo.toml` 文件，在 `[dependencies]` 部分下面加上一行：

    ```toml
    # Filename: Cargo.toml
    [dependencies]
    rand = "0.8.5" # 或者 Cargo 推荐的最新兼容版本
    ```
    *   `rand = "0.8.5"`：这告诉 Cargo 我们的项目依赖 `rand` 这个 Crate，并且我们需要一个版本号大致在 `0.8.5` 左右（具体来说是 `^0.8.5`，表示 >= 0.8.5 且 < 0.9.0 的任何版本都行，这利用了语义化版本控制 SemVer 的规则）。这能保证我们教程里的代码能用，同时也能用到 `rand` 0.8.x 系列的最新修复。
*   **让 Cargo 下载并编译依赖：** 现在，回到终端，**不需要修改 `main.rs`**，直接运行 `cargo build`：

    ```bash
    cargo build
    # 你会看到 Cargo 输出很多信息：
    # Updating crates.io index (更新可用库列表)
    # Downloading rand v0.8.5 (下载 rand 库)
    # Downloading other dependencies... (rand 可能还依赖其他库，Cargo 也会一起下载)
    # Compiling other dependencies... (编译所有下载的库)
    # Compiling guessing_game v0.1.0 (...) (最后编译我们自己的项目)
    # Finished ...
    ```
    Cargo 会自动从官方仓库 Crates.io 下载 `rand` 以及 `rand` 所依赖的所有其他库，并把它们编译好。
*   **`Cargo.lock` 文件：** 你会发现项目目录下多了一个 `Cargo.lock` 文件。这个文件记录了 Cargo 这次实际下载和使用的**所有依赖库的确切版本号**。下次你或者别人再编译这个项目时，Cargo 会优先使用 `Cargo.lock` 里记录的版本，保证了每次构建的结果都是一样的（可重现构建），非常重要！这个文件通常应该和你的代码一起提交到版本控制系统（如 Git）。
*   **更新库版本：** 如果你想更新依赖到 `Cargo.toml` 允许的最新版本，可以运行 `cargo update`。

**生成随机数**

现在我们可以在代码里使用 `rand` 库了。修改 `src/main.rs`：

```rust
// Filename: src/main.rs
use std::io;
use rand::Rng; // 引入 rand Crate 中的 Rng trait

fn main() {
    println!("猜数字游戏!");

    // 生成一个 1 到 100 之间的随机数
    let secret_number = rand::thread_rng().gen_range(1..=100);

    // 临时打印出秘密数字，方便我们测试
    println!("秘密数字是：{}", secret_number);

    println!("请输入你猜的数字：");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("读取输入失败");

    println!("你猜的数字是：{}", guess);
}
```

新加的代码解释：

*   `use rand::Rng;`
    *   **大白话：** 我们要用 `rand` 库里生成随机数的方法，这些方法被定义在一个叫做 `Rng` 的**特性 (Trait)** 里。Trait 有点像其他语言里的接口（Interface）或者抽象基类，它定义了一组方法签名。我们需要把这个 `Rng` trait 引入到当前作用域，才能调用它里面定义的方法（比如 `gen_range`）。
*   `let secret_number = rand::thread_rng().gen_range(1..=100);`
    *   `rand::thread_rng()`: 调用 `rand` 库的 `thread_rng` 函数。它会给我们一个随机数生成器，这个生成器是当前线程本地的，并且由操作系统提供种子（比较常用的一种随机数源）。
    *   `.gen_range(1..=100)`: 在拿到的随机数生成器上调用 `gen_range` 方法（这个方法就来自我们引入的 `Rng` trait）。
    *   `1..=100`: 这是一种**范围表达式 (range expression)**。`..=` 表示这是一个**包含**开始值（1）和结束值（100）的范围。`gen_range` 就会在这个范围内（包括 1 和 100）随机生成一个整数。
    *   **总结：** 这行代码生成了一个 1 到 100 之间的随机整数，并把它存到了不可变的 `secret_number` 变量里。
*   `println!("秘密数字是：{}", secret_number);`
    *   **大白话：** 为了方便我们开发和测试，暂时把这个秘密数字打印出来。等游戏做完了，我们会删掉这行。

**再测试一下！**

运行 `cargo run` 几次：

```bash
cargo run
# 输出:
# 猜数字游戏!
# 秘密数字是：67
# 请输入你猜的数字：
# ...

cargo run
# 输出:
# 猜数字游戏!
# 秘密数字是：23
# 请输入你猜的数字：
# ...
```

你应该看到每次运行生成的秘密数字都不同，并且都在 1 到 100 之间。

**第四步：比较猜测的数字和秘密数字**

现在我们有了用户的输入（一个字符串 `guess`）和秘密数字（一个整数 `secret_number`），是时候比较它们了。继续修改 `src/main.rs`：

```rust
// Filename: src/main.rs
use rand::Rng;
use std::cmp::Ordering; // 引入比较结果类型 Ordering
use std::io;

fn main() {
    println!("猜数字游戏!");
    let secret_number = rand::thread_rng().gen_range(1..=100);
    // println!("秘密数字是：{}", secret_number); // 暂时保留或注释掉

    println!("请输入你猜的数字：");
    let mut guess = String::new();
    io::stdin()
        .read_line(&mut guess)
        .expect("读取输入失败");

    // 将字符串类型的 guess 转换为数字类型
    // 注意：这里我们重新声明了一个叫 guess 的变量，这叫“遮蔽 (shadowing)”
    let guess: u32 = guess // 使用旧的 guess (String)
        .trim() // 去掉首尾空白（比如换行符）
        .parse() // 尝试将字符串解析成数字
        .expect("请输入一个数字！"); // 如果解析失败，崩溃并提示

    println!("你猜的数字是：{}", guess); // 现在打印的是数字类型的 guess

    // 比较 guess 和 secret_number
    match guess.cmp(&secret_number) {
        Ordering::Less => println!("太小了!"), // Less 表示猜的数字 < 秘密数字
        Ordering::Greater => println!("太大了!"), // Greater 表示猜的数字 > 秘密数字
        Ordering::Equal => println!("猜对了!"), // Equal 表示猜的数字 == 秘密数字
    }
}
```

新加的代码解释：

*   `use std::cmp::Ordering;`
    *   **大白话：** 我们需要比较两个值的大小关系，比较的结果有三种可能：小于、大于或等于。Rust 把这三种结果定义在一个叫做 `Ordering` 的枚举 (enum) 里，它有三个**变体 (variants)**：`Less`, `Greater`, `Equal`。我们需要把它引入进来。
*   `let guess: u32 = guess.trim().parse().expect("请输入一个数字！");`
    *   **类型不匹配问题：** 我们之前的 `guess` 是 `String` 类型，而 `secret_number` 是一个整数类型（Rust 默认会推断为 `i32`，但我们稍后会指定为 `u32`）。Rust 是强类型语言，不允许直接比较字符串和数字。所以，我们需要先把用户输入的字符串 `guess` 转换成数字。
    *   **遮蔽 (Shadowing)：** 注意我们又用 `let guess` 声明了一个变量，名字也叫 `guess`！这是 Rust 允许的，叫做**遮蔽 (shadowing)**。新的 `guess` 变量会“遮盖”住旧的同名变量。这样做通常是为了进行类型转换，让我们可以在后续代码中方便地使用同一个名字，而不用另外起名（比如 `guess_str` 和 `guess_num`）。
    *   **`: u32` 类型注解：** `let guess: u32` 这里的冒号 `:` 和 `u32` 是在明确告诉 Rust：“这个新的 `guess` 变量，我希望它的类型是 `u32`”。`u32` 代表**无符号 32 位整数**（只能是 0 或正整数），对于 1-100 这个范围来说足够了。这个类型注解也帮助 Rust 推断出我们前面生成的 `secret_number` 也应该是 `u32` 类型，这样它们就可以互相比较了。
    *   `guess.trim()`: 这个 `guess` 指的是旧的、字符串类型的 `guess`。`.trim()` 方法会去掉字符串开头和结尾的所有空白字符（空格、制表符、换行符等）。用户输入数字后按回车，`read_line` 会把换行符也读进去（比如输入 `42` 变成 `"42\n"`），`trim()` 可以把这个换行符去掉，得到 `"42"`。
    *   `.parse()`: 这个方法尝试把（`trim` 之后的）字符串解析成我们指定的类型（根据 `: u32` 的注解，就是 `u32` 类型）。`parse` 也可能失败（比如用户输入了 "abc"），所以它也返回一个 `Result` 类型。
    *   `.expect("请输入一个数字！")`: 和之前一样，我们用 `expect` 来处理 `parse` 返回的 `Result`。如果解析成功 (`Ok(数字)`), 就返回那个数字。如果解析失败 (`Err(错误)`), 就崩溃并提示用户输入一个数字。
    *   **总结：** 这行代码获取了用户输入的字符串，去掉了首尾空白，尝试把它解析成一个 `u32` 类型的数字，如果成功就存到新的 `guess` 变量里，如果失败就让程序崩溃。
*   `match guess.cmp(&secret_number) { ... }`
    *   `guess.cmp(&secret_number)`: 现在两个 `guess` 和 `secret_number` 都是 `u32` 类型了，可以比较了！`.cmp()` 方法会比较两者的大小，并返回一个 `Ordering` 枚举的变体 (`Less`, `Greater`, 或 `Equal`)。注意这里传给 `cmp` 的是 `&secret_number`（一个引用）。
    *   `match ... { ... }`: 我们用 `match` 表达式来处理 `cmp` 返回的 `Ordering` 结果。`match` 会看 `cmp` 返回的是哪个变体，然后执行对应 `=>` 后面的代码。
        *   `Ordering::Less => println!("太小了!")`: 如果 `guess` 小于 `secret_number`，就打印 "太小了!"。
        *   `Ordering::Greater => println!("太大了!")`: 如果 `guess` 大于 `secret_number`，就打印 "太大了!"。
        *   `Ordering::Equal => println!("猜对了!")`: 如果 `guess` 等于 `secret_number`，就打印 "猜对了!"。
    *   `match` 表达式非常强大，是 Rust 里常用的控制流工具，后面会学到更多用法。

**再再测试一下！**

运行 `cargo run`：

```bash
cargo run
# 输出:
# 猜数字游戏!
# 秘密数字是：58 # 假设这次是 58
# 请输入你猜的数字：
#   76 # 你输入，注意前面有空格
# 输出:
# 你猜的数字是：76 # 这是转换后的数字
# 太大了!
```

再运行一次，尝试猜对：

```bash
cargo run
# 输出:
# 猜数字游戏!
# 秘密数字是：23
# 请输入你猜的数字：
# 23
# 输出:
# 你猜的数字是：23
# 猜对了!
```

很棒！核心的比较逻辑已经能工作了。但现在的问题是，程序猜一次就结束了，我们需要让玩家能反复猜测。

**第五步：循环猜测**

我们需要加一个循环，让用户可以一直猜，直到猜对为止。Rust 提供了 `loop` 关键字来创建一个无限循环。修改代码：

```rust
// Filename: src/main.rs
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("猜数字游戏!");
    let secret_number = rand::thread_rng().gen_range(1..=100);
    // println!("秘密数字是：{}", secret_number);

    // 开始无限循环
    loop {
        println!("请输入你猜的数字："); // 这部分及之后都在循环内

        let mut guess = String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("读取输入失败");

        let guess: u32 = guess.trim().parse().expect("请输入一个数字！");
        println!("你猜的数字是：{}", guess);

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("太小了!"),
            Ordering::Greater => println!("太大了!"),
            Ordering::Equal => println!("猜对了!"), // 猜对了也还在循环里
        }
    } // loop 结束
}
```

我们把从“请输入你猜的数字：”开始到 `match` 结束的整块代码放到了 `loop { ... }` 里面。

**运行测试：**

```bash
cargo run
# ...
# 请输入你猜的数字：
# 50
# 你猜的数字是：50
# 太小了!
# 请输入你猜的数字： # 又开始问了
# 80
# 你猜的数字是：80
# 太大了!
# 请输入你猜的数字： # 还在问
# 70
# 你猜的数字是：70
# 猜对了!
# 请输入你猜的数字： # 猜对了还在问！
```

现在玩家可以一直猜了，但有两个问题：
1.  猜对了之后游戏还在继续。
2.  如果玩家输入的不是数字，程序会因为 `expect("请输入一个数字！")` 而崩溃。

**第六步：猜对后退出**

我们需要在猜对的时候跳出 `loop` 循环。可以使用 `break` 关键字。修改 `match` 的 `Ordering::Equal` 分支：

```rust
// ... 省略前面的代码 ...
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("太小了!"),
            Ordering::Greater => println!("太大了!"),
            Ordering::Equal => { // 猜对了执行这里的代码块
                println!("猜对了!");
                break; // 跳出当前的 loop 循环！
            }
        }
// ... 省略后面的代码 ...
```

现在，当 `guess` 等于 `secret_number` 时，程序会打印 "猜对了!"，然后执行 `break;`，跳出 `loop` 循环。因为 `loop` 是 `main` 函数里最后的东西，所以退出循环也就结束了整个程序。

**第七步：优雅地处理无效输入**

现在还剩下一个问题：如果用户输入了 "quit" 或者 "abc" 这样无法解析成数字的东西，程序会因为 `parse().expect(...)` 而崩溃。我们不希望程序崩溃，而是想提示用户重新输入。

我们需要修改处理 `parse()` 返回的 `Result` 的方式。之前用 `expect` 是简单粗暴地崩溃，现在我们用 `match` 来更细致地处理：

```rust
// ... 省略前面的代码 ...
        let mut guess = String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("读取输入失败"); // 读取失败还是让它崩溃

        // 使用 match 处理 parse() 返回的 Result
        let guess: u32 = match guess.trim().parse() {
            // 如果 parse 成功 (Ok)，返回 Ok 里面包含的数字 num
            Ok(num) => num,
            // 如果 parse 失败 (Err)，不关心具体的错误信息（用 _ 匹配所有 Err）
            Err(_) => {
                println!("请输入有效的数字！"); // 提示用户
                continue; // 跳过本次循环的剩余部分，直接开始下一次循环
            }
        };

        println!("你猜的数字是：{}", guess); // 只有输入有效数字时才会执行到这里

        match guess.cmp(&secret_number) {
            // ... 比较逻辑不变 ...
            Ordering::Equal => {
                println!("猜对了!");
                break;
            }
        }
// ... 省略后面的代码 ...
```

改动解释：

*   我们把 `let guess: u32 = guess.trim().parse().expect(...)` 换成了 `let guess: u32 = match guess.trim().parse() { ... };`。
*   `match guess.trim().parse()`：对 `parse()` 返回的 `Result` 进行匹配。
*   `Ok(num) => num`: 如果 `parse()` 成功，返回 `Ok` 变体，里面包含了解析出的数字 `num`。这个分支就把 `num` 作为 `match` 表达式的结果，赋值给新的 `guess` 变量。
*   `Err(_) => { ... }`: 如果 `parse()` 失败，返回 `Err` 变体。我们用 `_`（下划线）作为一个“通配符”模式，表示我们不关心 `Err` 里面具体的错误信息是什么，只要是 `Err` 就匹配这个分支。
    *   `println!("请输入有效的数字！");`: 打印一个提示。
    *   `continue;`: 这个关键字告诉程序，立即结束**当前这次**循环迭代，跳到 `loop` 的开头，重新开始下一次迭代（也就是重新提示用户输入）。这样，后面的 `println!("你猜的数字是：...")` 和比较逻辑就不会被执行了。

**最后测试！**

运行 `cargo run`：

```bash
cargo run
# 输出:
# 猜数字游戏!
# 请输入你猜的数字：
# abc # 输入无效内容
# 输出:
# 请输入有效的数字！
# 请输入你猜的数字： # 重新提示输入
# 10
# 输出:
# 你猜的数字是：10
# 太小了!
# 请输入你猜的数字：
# 90
# 输出:
# 你猜的数字是：90
# 太大了!
# 请输入你猜的数字： # 假设秘密数字是 60
# 60
# 输出:
# 你猜的数字是：60
# 猜对了!
# (程序结束)
```

完美！现在游戏行为符合预期了。

**第八步：收尾工作**

我们之前为了测试方便，加了一行打印秘密数字的代码。现在游戏完成了，应该把它删掉，让游戏更有挑战性。

把 `main` 函数里的这行删掉或注释掉：

```rust
// println!("秘密数字是：{}", secret_number);
```

**最终完整代码：**

```rust
// Filename: src/main.rs
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("猜数字游戏!");

    // 1. 生成秘密数字
    let secret_number = rand::thread_rng().gen_range(1..=100);

    // 5. 开始循环
    loop {
        println!("请输入你猜的数字：");

        // 2. 获取用户输入 (String)
        let mut guess = String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("读取输入失败");

        // 3. 将输入转换为数字 (u32)，处理无效输入
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("请输入有效的数字！");
                continue; // 无效输入，跳过本次循环
            }
        };

        println!("你猜的数字是：{}", guess);

        // 4. 比较数字并给出提示
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("太小了!"),
            Ordering::Greater => println!("太大了!"),
            Ordering::Equal => {
                println!("猜对了!");
                break; // 猜对了，跳出循环
            }
        }
    } // loop 结束
}
```

**恭喜！** 你已经用 Rust 完成了一个完整的猜数字游戏！

**总结一下你在这个过程中接触到的 Rust 概念：**

*   **项目管理:** `cargo new`, `cargo run`, `cargo build`, `Cargo.toml`, `Cargo.lock`
*   **基本语法:** `fn main`, `println!`, `let`, `mut` (可变性), `;` (语句结束)
*   **常用类型:** `String` (可增长字符串), `u32` (无符号整数), `Result` (处理可能失败的操作), `Ordering` (比较结果)
*   **模块和库:** `use` (导入模块/类型), 标准库 (`std::io`, `std::cmp`), 外部库/Crate (`rand`)
*   **函数和方法:** 关联函数 (`String::new`), 方法 (`trim`, `parse`, `cmp`, `expect`, `read_line`, `gen_range`)
*   **控制流:** `match` (模式匹配), `loop` (无限循环), `break` (跳出循环), `continue` (跳到下次循环)
*   **变量特性:** 遮蔽 (Shadowing)
*   **引用:** `&` (不可变引用), `&mut` (可变引用)
*   **错误处理 (初级):** `expect` (失败时崩溃), `match` 配合 `Result` (处理或忽略错误)
*   **特性 (Trait) 初览:** `Rng` (定义了随机数生成器的方法)

这只是 Rust 的冰山一角，但你已经通过动手实践掌握了非常多的基础知识！接下来的学习会更深入地探讨这些概念。