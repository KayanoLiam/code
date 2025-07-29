# Zig 入门：第一个程序 "Hello, world!"
来，咱们用 Zig 跟世界打个招呼！写第一个程序 "Hello, world!"，过程超简单。

**1. 创建代码文件**

*   **找个地方：** 在你电脑上随便哪个位置，比如桌面，新建一个文件。
*   **命名文件：** 把文件名改成 `hello.zig`。`.zig` 是 Zig 代码文件的专属后缀。
*   **写代码：** 用记事本或任何代码编辑器打开 `hello.zig`，把下面这段酷酷的代码粘进去：

```zig
const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Hello, {s}!\n", .{"world"});
}
```

*   **保存！** 别忘了保存文件。

**代码解释（人话版）：**

*   `const std = @import("std");`：这行是告诉 Zig：“嘿，我要用你的标准库（standard library）”，里面有很多现成的工具。
*   `pub fn main() !void { ... }`：这是程序的“大门”，所有 Zig 程序都从 `main` 函数开始跑。`pub` 表示这个函数是公开的。
*   `const stdout = ...`：这行是拿到“标准输出”，简单说就是你的那个黑乎乎的终端窗口。
*   `try stdout.print(...)`：这就是打印命令了！它会把 "Hello, world!" 显示在你的终端上。`try` 是用来处理可能发生的错误的，很安全。

**2. 编译和运行（一步到位！）**

Zig 有个超方便的命令，可以把编译和运行合成一步。

*   **打开终端：** Windows 用户打开“命令提示符”或“PowerShell”，macOS/Linux 用户打开“终端”。
*   **进入文件目录：** 用 `cd` 命令切换到你保存 `hello.zig` 文件的那个目录。比如你放桌面了，就 `cd Desktop`。
*   **运行命令：** 在终端里敲下面这个命令，然后回车：

```bash
zig run hello.zig
```

*   **发生了什么？**
    *   `zig run` 这个命令会先在后台悄悄地把你的 `hello.zig` 代码编译成电脑能懂的机器码。
    *   编译成功后，它会立刻运行这个程序。
    *   如果一切顺利...

**3. 看结果！**

你会在终端上看到它打印出来：

```
Hello, world!
```

**另一种方式：分开编译和运行**

你也可以像传统方式那样，先编译再运行，感受一下过程：

1.  **编译：** 在终端里运行：
    ```bash
    zig build-exe hello.zig
    ```
    这会生成一个可执行文件，在 Windows 上是 `hello.exe`，在 Mac/Linux 上是 `hello`。

2.  **运行：**
    *   Windows: `.\hello.exe`
    *   macOS/Linux: `./hello`

    同样会看到 "Hello, world!"。

**总结一下：**

1.  **建文件：** `hello.zig`
2.  **写代码：** 粘入上面的代码。
3.  **打开终端，cd 到目录。**
4.  **一步到位运行：** `zig run hello.zig`
5.  **看结果：** 屏幕上出现 "Hello, world!"

看吧，超简单！你已经成功运行了你的第一个 Zig 程序！是不是特有成就感？
