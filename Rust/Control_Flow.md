# 控制流 (Control Flow)
**控制流 (Control Flow)**，也就是怎么控制你的 Rust 代码**不**总是从上到下一行接一行地执行。我们需要根据不同的情况走不同的“路线”，或者重复执行某段代码。

最常用的控制流“路标”和“圈圈”就是 `if` 表达式和循环 (`loop`, `while`, `for`)。

**1. `if` 表达式：走哪条路？看条件！**

`if` 允许你的代码根据一个**条件**是否满足来**分支**执行。就像走到一个岔路口，路牌上写着条件，满足就走左边，不满足就走右边（或者直接往前走）。

*   **基本结构:** `if 条件 { ... } else { ... }`
    *   `if` 关键字后面跟着一个**条件**表达式。
    *   如果**条件为真 (`true`)**，就执行紧跟在后面的大括号 `{}` 里的代码块（也叫 `if` 的 "arm" 或分支）。
    *   `else` 是可选的。如果提供了 `else`，并且**条件为假 (`false`)**，就执行 `else` 后面的代码块。
    *   如果没有 `else`，条件为假时就直接跳过 `if` 代码块，继续执行后面的代码。

看例子：

```rust
// Filename: src/main.rs
fn main() {
    let number = 3;

    if number < 5 { // 条件：number 是否小于 5？ (是，true)
        println!("条件为真"); // 执行这行
    } else {
        println!("条件为假"); // 不执行这行
    }

    let number2 = 7;
    if number2 < 5 { // 条件：number2 是否小于 5？ (否，false)
         println!("条件2为真"); // 不执行
    } else {
        println!("条件2为假"); // 执行这行
    }

    let number3 = 10;
    if number3 == 10 { // 只有 if，没有 else
        println!("条件3为真"); // 执行
    }
    // 条件3结束后，继续往下执行
}
```

运行结果：

```
条件为真
条件2为假
条件3为真
```

*   **条件必须是 `bool` 类型！**
    *   在 Rust 里，`if` 后面的条件**必须**计算出一个**布尔值 (`true` 或 `false`)**。
    *   你不能像某些语言（如 C, JavaScript）那样直接放一个数字，让它自动转换成 `true` (非零) 或 `false` (零)。
    *   比如 `if number { ... }` （假设 `number` 是整数 3）是**错误**的！编译器会报错，说期望 `bool` 类型，但找到了整数。
    *   你需要明确地写出比较：`if number != 0 { ... }` (如果 number 不等于 0)。

*   **`else if`：多个岔路口**
    *   如果你有多个互斥的条件需要判断，可以用 `else if` 连接起来。
    *   Rust 会**按顺序**检查每个 `if` 或 `else if` 的条件。一旦找到**第一个**为 `true` 的条件，就执行它对应的代码块，然后**跳过**后面所有的 `else if` 和 `else`。

    ```rust
    // Filename: src/main.rs
    fn main() {
        let number = 6;

        if number % 4 == 0 { // 6 % 4 != 0 (false)
            println!("数字能被 4 整除");
        } else if number % 3 == 0 { // 6 % 3 == 0 (true)
            println!("数字能被 3 整除"); // 执行这个，然后结束 if-else if-else 结构
        } else if number % 2 == 0 { // 虽然 6 % 2 == 0，但不会检查这里了
            println!("数字能被 2 整除");
        } else {
            println!("数字不能被 4, 3, 或 2 整除");
        }
    }
    ```
    运行结果：
    ```
    数字能被 3 整除
    ```
    *   **注意：** 如果 `else if` 太多，代码可能会变得混乱。这时可以考虑用更强大的 `match` 表达式（后面章节会讲）。

*   **`if` 是表达式：可以用来赋值！**
    *   因为 `if` 是一个**表达式**（还记得吗？表达式会产生一个值），你可以把它放在 `let` 语句的右边，用来给变量赋值。
    *   **前提：** `if` 的**所有**分支（包括 `else` 分支，如果有的话）返回的值**必须是相同类型**的！

    ```rust
    // Filename: src/main.rs
    fn main() {
        let condition = true;

        // number 的值取决于 condition
        let number = if condition { // condition 为 true，执行这个分支
            5 // 这个分支的值是 5 (i32 类型)
        } else {
            6 // 这个分支的值是 6 (也是 i32 类型)
              // 如果这里写 "six" (字符串)，就会编译错误，因为类型不匹配！
        }; // 注意这里有个分号，因为整个 let 语句需要分号

        println!("number 的值是: {number}"); // 输出 number 的值是: 5
    }
    ```

**2. 循环 (Loops)：重复执行代码**

有时候你需要一遍又一遍地执行某段代码。Rust 提供了三种循环结构：

*   **`loop`：无限循环（需要手动跳出）**
    *   `loop { ... }` 会创建一个**无限循环**，它会一直执行大括号里的代码，直到你明确告诉它停止。
    *   **跳出循环：** 使用 `break` 关键字。
    *   **跳过本次迭代：** 使用 `continue` 关键字，会跳过当前循环中 `continue` 后面的代码，直接开始下一次循环。
    *   **从循环返回值：** `loop` 也可以是一个表达式！你可以让 `break` 带一个值，这个值就会成为整个 `loop` 表达式的值。

    ```rust
    // Filename: src/main.rs
    fn main() {
        let mut counter = 0;

        // loop 用来赋值给 result
        let result = loop {
            counter += 1; // 计数器加 1
            println!("counter is {}", counter);

            if counter == 10 {
                // 当 counter 到 10 时，跳出循环
                // 并把 counter * 2 (即 20) 作为 loop 的返回值
                break counter * 2;
            }
            // 如果 counter < 5，跳过后面的打印，直接下次循环
            if counter < 5 {
                 continue;
            }
            println!("...counter is 5 or more...");

        }; // loop 表达式结束，用分号结束 let 语句

        println!("循环结束，result 是 {result}"); // 输出 20
    }
    ```
    *   **循环标签 (Loop Labels):** 如果你有嵌套循环（循环里套循环），`break` 和 `continue` 默认只对**最内层**的循环起作用。如果你想跳出外层循环，可以给外层循环起一个**标签**（以单引号 `'` 开头，比如 `'outer_loop:`），然后在 `break` 或 `continue` 后面加上这个标签名。

    ```rust
    fn main() {
        let mut count = 0;
        'counting_up: loop { // 外层循环标签 'counting_up
            println!("count = {count}");
            let mut remaining = 10;
            loop { // 内层循环没有标签
                println!("remaining = {remaining}");
                if remaining == 9 {
                    break; // 只跳出内层循环
                }
                if count == 2 {
                    break 'counting_up; // 跳出带有 'counting_up 标签的外层循环！
                }
                remaining -= 1;
            } // 内层循环结束
            count += 1;
        } // 外层循环结束
        println!("End count = {count}"); // 输出 End count = 2
    }
    ```

*   **`while`：条件循环**
    *   `while 条件 { ... }`：当**条件为真 (`true`)** 时，重复执行大括号里的代码。每次循环开始前都会检查条件。一旦条件变为假 (`false`)，循环就结束。
    *   这对于“只要满足某个条件就一直做某事”的场景很方便。

    ```rust
    // Filename: src/main.rs
    fn main() {
        let mut number = 3;

        while number != 0 { // 只要 number 不等于 0 就循环
            println!("{number}!");
            number -= 1; // 每次循环 number 减 1
        } // 当 number 变成 0 时，条件为 false，循环结束

        println!("LIFTOFF!!!");
    }
    ```
    运行结果：
    ```
    3!
    2!
    1!
    LIFTOFF!!!
    ```

*   **`for`：遍历集合（最常用、最安全）**
    *   `for 元素 in 集合 { ... }`：这是 Rust 里**最常用**也**最推荐**的循环方式，特别适合用来遍历一个**集合**（比如数组、向量、范围等）中的每一个元素。
    *   它会自动迭代集合中的每个元素，把当前元素绑定到你指定的变量（比如 `element`）上，然后执行大括号里的代码。
    *   **优点：** 更简洁、更安全。你不需要自己管理索引，不容易出错（比如索引越界），编译器通常也能更好地优化它。

    ```rust
    // Filename: src/main.rs
    fn main() {
        let a = [10, 20, 30, 40, 50]; // 一个数组

        // 使用 for 循环遍历数组 a 中的每个元素
        for element in a { // 不需要自己写索引 index
            println!("值是: {element}"); // 直接用 element
        }

        // 倒计时例子，用 for 和 Range
        // (1..4) 是一个范围，包含 1, 2, 3 (不包含 4)
        // .rev() 方法将范围反转，变成 3, 2, 1
        for number in (1..4).rev() {
            println!("{number}!");
        }
        println!("LIFTOFF!!!");
    }
    ```
    运行结果：
    ```
    值是: 10
    值是: 20
    值是: 30
    值是: 40
    值是: 50
    3!
    2!
    1!
    LIFTOFF!!!
    ```
    对比用 `while` 循环遍历数组（需要手动管理 `index` 并检查边界 `index < 5`），`for` 循环显然更简单、更不易出错。

**总结一下控制流：**

*   **`if/else if/else`:** 根据**布尔**条件执行不同的代码分支。`if` 本身是表达式，可以用于赋值（要求所有分支返回同类型值）。
*   **`loop`:** 无限循环，用 `break` 跳出（可以带返回值），用 `continue` 跳到下次迭代。可以用标签 `break 'label;` 控制嵌套循环。
*   **`while`:** 条件为真时循环。
*   **`for`:** **遍历**集合中的每个元素，是 Rust 中最常用、最推荐的循环方式，更安全、更简洁。

掌握了这些控制流结构，你就能编写出能根据不同情况做出反应、能重复执行任务的更复杂的程序了！