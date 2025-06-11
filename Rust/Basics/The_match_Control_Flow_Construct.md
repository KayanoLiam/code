# The match Control Flow Construct
这部分讲的是 `match` 这个“控制流程的玩意儿”。

`match` 是 Rust 里一个特别牛的工具，它能让你拿一个值去跟一堆“模式”（patterns）挨个比对，哪个模式对上了，就执行对应的那块代码。这些“模式”可以是具体的值、变量名、通配符等等好多东西（第19章会细讲）。`match` 之所以厉害，就是因为模式能表达的东西特多，而且编译器会帮你检查，确保你把所有可能的情况都考虑到了。

**`match` 就像个硬币分拣机：**
硬币从一个带孔的轨道滑下来，碰到第一个大小合适的孔，就掉进去。`match` 也一样，你的值会挨个去匹配 `match` 里的模式，碰到第一个“合身”的模式，值就“掉进”关联的那块代码里去执行。

**用硬币举个例子：**
咱们写个函数，它接收一个不认识的美国硬币，然后像数硬币机一样，判断是哪种硬币，并返回它的面值（单位是美分）。

```rust
// 先定义一个硬币的枚举
enum Coin {
    Penny,    // 1 美分硬币
    Nickel,   // 5 美分硬币
    Dime,     // 10 美分硬币
    Quarter,  // 25 美分硬币 (夸特)
}

// 这个函数根据硬币种类返回面值
fn value_in_cents(coin: Coin) -> u8 { // 返回 u8 类型 (0-255 的整数)
    match coin { // 开始匹配 coin 这个值
        Coin::Penny => 1,           // 如果 coin 是 Penny，就返回 1
        Coin::Nickel => 5,          // 如果 coin 是 Nickel，就返回 5
        Coin::Dime => 10,           // 如果 coin 是 Dime，就返回 10
        Coin::Quarter => 25,         // 如果 coin 是 Quarter，就返回 25
    } // match 表达式结束，整个表达式的值就是匹配上的那个分支返回的值
}
```

**拆解一下 `value_in_cents` 函数里的 `match`：**

1.  先是 `match` 关键字，后面跟着一个表达式，这里是 `coin` 这个变量。这看着跟 `if` 语句有点像，但有个大区别：`if` 后面的条件必须是个布尔值（真或假），但 `match` 后面的表达式可以是任何类型。这里 `coin` 的类型是我们上面定义的 `Coin` 枚举。

2.  接下来是 `match` 的“分支”（arms）。每个分支有两部分：一个**模式** (pattern) 和一些**代码**。
    *   第一个分支的模式是 `Coin::Penny`。
    *   然后是一个 `=>` 操作符，它把模式和要执行的代码分开。
    *   这个分支的代码很简单，就是值 `1`。
    *   每个分支之间用逗号 `,` 分隔。

3.  `match` 表达式执行的时候，它会把 `coin` 的值，按顺序跟每个分支的模式进行比较。
    *   如果一个模式匹配上了 `coin` 的值，那么与这个模式相关联的代码就会被执行。
    *   如果这个模式没匹配上，程序会继续尝试下一个分支，就像硬币分拣机一样。
    *   你可以有任意多个分支，上面例子里有四个。

4.  每个分支关联的代码本身也是一个表达式。匹配上的那个分支的表达式的结果值，就会成为整个 `match` 表达式的返回值。
    *   比如，如果 `coin` 是 `Coin::Penny`，那么 `match coin { ... }` 整个表达式的值就是 `1`。

5.  如果分支的代码很简单（就像上面例子里那样，每个分支只返回一个值），通常不用花括号 `{}`。但如果你想在一个分支里执行多行代码，就**必须**用花括号 `{}`，这时分支末尾的逗号就可有可无了。
    例如：

    ```rust
    fn value_in_cents(coin: Coin) -> u8 {
        match coin {
            Coin::Penny => { // Penny 分支用了花括号
                println!("幸运的一美分！"); // 打印一句话
                1 // 最后返回 1
            }
            Coin::Nickel => 5,
            Coin::Dime => 10,
            Coin::Quarter => 25,
        }
    }
    ```
    如果传入 `Coin::Penny`，它会先打印 "幸运的一美分！"，然后这个分支返回 `1`。

**能绑定到值的模式 (Patterns That Bind to Values)**

`match` 分支还有个有用的特性：它们可以把匹配到的值里面的某些部分“绑定”到变量上。这样我们就能从枚举的变体里把数据提取出来。

**举个例子：带州名的夸特硬币**
假设从1999年到2008年，美国发行的夸特硬币（25美分）背面有代表不同州的设计。其他硬币没有这个州设计，所以只有夸特硬币有这个额外信息。我们可以把这个信息加到 `Coin` 枚举里，修改 `Quarter` 变体，让它包含一个 `UsState`（美国州名）的值：

```rust
#[derive(Debug)] // 这个注解能让我们方便地打印 UsState 的值
enum UsState {
    Alabama,
    Alaska,
    // ... 其他州名
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState), // Quarter 变体现在包含一个 UsState 类型的值
}
```

现在，假设我们有个朋友在收集所有50个州的夸特硬币。我们在整理硬币的时候，如果碰到夸特硬币，就喊出州名，看朋友有没有。

在 `match` 表达式里，我们给匹配 `Coin::Quarter` 变体的模式添加一个变量叫 `state`。当匹配到 `Coin::Quarter` 时，这个 `state` 变量就会绑定到那个夸特硬币的州名上。然后我们就可以在分支的代码里使用这个 `state` 变量了：

```rust
fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => { // 注意这里：Coin::Quarter(state)
                                 // 如果 coin 是 Quarter 类型，state 就会绑定到它里面的 UsState 值
            println!("来自 {:?} 州的夸特硬币!", state); // 使用 state 变量
            25
        }
    }
}
```
如果我们调用 `value_in_cents(Coin::Quarter(UsState::Alaska))`：
*   `coin` 的值就是 `Coin::Quarter(UsState::Alaska)`。
*   `match` 依次比较，直到 `Coin::Quarter(state)` 这个模式。
*   这时，模式匹配成功！`state` 变量就会被赋值为 `UsState::Alaska`。
*   然后我们就可以在 `println!` 里用 `state` 了，从而把 `Coin` 枚举 `Quarter` 变体内部的州名取出来了。

**用 `match` 处理 `Option<T>`**

前面我们说，想从 `Option<T>` 的 `Some` 情况里把里面的 `T` 值取出来。我们也可以用 `match` 来处理 `Option<T>`，就像处理 `Coin` 枚举一样！比较的不是硬币种类，而是 `Option<T>` 的变体 (`Some` 或 `None`)，但 `match` 的工作方式是一样的。

假设我们要写个函数，它接收一个 `Option<i32>`：
*   如果里面有值（是 `Some(i32)`），就把那个值加 1。
*   如果里面没值（是 `None`），函数就应该返回 `None`，并且不尝试做任何运算。

用 `match` 写这个函数非常简单：

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,          // 如果 x 是 None，就返回 None
        Some(i) => Some(i + 1), // 如果 x 是 Some(i)，那么 i 就绑定到那个整数值，
                               // 然后返回一个新的 Some，里面是 i + 1
    }
}

let five = Some(5);
let six = plus_one(five); // six 会是 Some(6)
let none = plus_one(None); // none 会是 None
```

分析一下 `plus_one(five)` 的执行：
1.  调用 `plus_one(five)`，函数体里的 `x` 就是 `Some(5)`。
2.  进入 `match x { ... }`：
    *   第一个分支 `None => None,`： `Some(5)` 跟 `None` 模式不匹配，跳过。
    *   第二个分支 `Some(i) => Some(i + 1),`： `Some(5)` 跟 `Some(i)` 模式匹配吗？匹配！它们都是 `Some` 变体。变量 `i` 会绑定到 `Some` 里面包含的值，所以 `i` 得到值 `5`。然后执行分支的代码 `Some(i + 1)`，也就是 `Some(5 + 1)`，结果是 `Some(6)`。这个 `Some(6)` 就是整个 `match` 表达式的结果，也是函数的返回值。

再分析一下 `plus_one(None)` 的执行：
1.  调用 `plus_one(None)`，函数体里的 `x` 就是 `None`。
2.  进入 `match x { ... }`：
    *   第一个分支 `None => None,`： `None` 跟 `None` 模式匹配！执行分支代码，返回 `None`。
    *   因为第一个分支就匹配了，所以不会再看其他分支了。

把 `match` 和枚举结合起来用，在很多情况下都非常有用。你会在 Rust 代码里经常看到这种模式：对一个枚举进行 `match`，把数据绑定到变量上，然后根据它执行代码。刚开始可能有点绕，但习惯了之后，你会希望所有语言都有这功能。这玩意儿一直都是用户非常喜欢的一个特性。

**`match` 必须是穷尽的 (Matches Are Exhaustive)**

`match` 还有一点非常重要：**分支的模式必须覆盖所有可能性。**
想想我们 `plus_one` 函数的这个版本，它有个 bug，编译不过：

```rust
// 这代码编译不通过！
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        Some(i) => Some(i + 1),
        // 哎呀，我们忘了处理 None 的情况！
    }
}
```
我们没有处理 `None` 的情况，所以这代码会出问题。幸运的是，Rust 知道怎么抓住这种 bug。如果我们尝试编译这段代码，会得到一个错误：

```
error[E0004]: non-exhaustive patterns: `None` not covered
   --> src/main.rs:3:15
    |
3   |         match x {
    |               ^ pattern `None` not covered
    |
note: `Option<i32>` defined here
...
    = note: the matched value is of type `Option<i32>`
help: ensure that all possible cases are being handled by adding a match arm with a wildcard pattern or an explicit pattern as shown
    |
4   ~             Some(i) => Some(i + 1),
5   ~             None => todo!(), // 编译器提示你加上 None 分支
    |
```
Rust 知道我们没有覆盖所有可能的情况，甚至知道我们忘了哪个模式（`None`）！在 Rust 里，`match` 是**穷尽的 (exhaustive)**：我们必须把每一种可能性都考虑到，代码才能有效。特别是在处理 `Option<T>` 的时候，Rust 强制我们显式处理 `None` 的情况，这就保护了我们不会在可能遇到 `null` (在 Rust 里是 `None`) 的时候还想当然地以为有值，从而避免了前面提到的那个“十亿美元的错误”。

**通配模式和 `_` 占位符 (Catch-all Patterns and the `_` Placeholder)**

使用枚举时，我们有时可能想对某几个特定的值采取特殊行动，但对所有其他值采取一个默认行动。

想象一下我们在实现一个游戏：
*   如果掷骰子掷出 3，玩家不动，但得到一顶新帽子。
*   如果掷出 7，玩家失去一顶帽子。
*   对于所有其他点数，玩家在棋盘上移动相应的格数。

下面是一个实现这个逻辑的 `match`（骰子结果是写死的，其他逻辑用空函数体表示，因为具体实现不重要）：

```rust
let dice_roll = 9; // 假设掷骰子结果是 9
match dice_roll {
    3 => add_fancy_hat(),     // 如果是 3，调用 add_fancy_hat
    7 => remove_fancy_hat(),    // 如果是 7，调用 remove_fancy_hat
    other => move_player(other), // 对于其他任何数字 (other)，调用 move_player，并把这个数字传进去
}

fn add_fancy_hat() { /* ... */ }
fn remove_fancy_hat() { /* ... */ }
fn move_player(num_spaces: u8) { /* ... */ }
```
*   前两个分支的模式是具体的值 `3` 和 `7`。
*   最后一个分支，覆盖了所有其他可能的值，它的模式是我们起名叫 `other` 的变量。`other` 分支运行的代码会使用这个变量，把它传给 `move_player` 函数。

这段代码能编译通过，即使我们没有列出 `u8`（0-255的整数）所有可能的值，因为最后一个模式 `other` 会匹配所有未被前面分支明确列出的值。这个“**通配模式**” (catch-all pattern) 满足了 `match` 必须是穷尽的要求。
**注意**：我们必须把通配分支放在最后，因为模式是按顺序匹配的。如果把通配分支放前面，后面的具体分支就永远没机会运行了，Rust 会警告你！

Rust 还有一个特殊的模式 `_` (下划线)，当我们想要一个通配模式，但**不关心**那个值具体是什么，也**不想使用**那个值的时候，就可以用它。`_` 匹配任何值，但**不会**把值绑定到任何变量上。这告诉 Rust 我们不打算用这个值，所以 Rust 也不会警告我们有个未使用的变量。

我们改一下游戏规则：现在，如果掷出的不是 3 或 7，就必须重掷。我们不再需要使用那个通配的值了，所以可以把代码改成用 `_`：

```rust
let dice_roll = 9;
match dice_roll {
    3 => add_fancy_hat(),
    7 => remove_fancy_hat(),
    _ => reroll(), // 对于其他任何情况 (不关心具体是几)，调用 reroll
}

fn add_fancy_hat() { /* ... */ }
fn remove_fancy_hat() { /* ... */ }
fn reroll() { /* ... */ }
```
这个例子也满足了穷尽性的要求，因为我们在最后一个分支明确地忽略了所有其他值；我们没有忘记任何情况。

最后，我们再改一次游戏规则：如果掷出的不是 3 或 7，你的回合就什么也不发生。我们可以用“单元值”（unit value，就是那个空元组 `()`，之前在元组类型那里提到过）作为 `_` 分支的代码：

```rust
let dice_roll = 9;
match dice_roll {
    3 => add_fancy_hat(),
    7 => remove_fancy_hat(),
    _ => (), // 对于其他任何情况，啥也不干 (空元组表示“无操作”)
}

fn add_fancy_hat() { /* ... */ }
fn remove_fancy_hat() { /* ... */ }
```
这里，我们明确告诉 Rust：对于所有没有被前面模式匹配到的值，我们不关心它是什么，也不想执行任何代码。

关于模式和匹配，第19章还有更多内容。现在，我们要去看一下 `if let` 语法了，它在 `match` 表达式显得有点啰嗦的情况下会很有用。

总结一下这部分：
1.  `match` 是个强大的控制流工具，根据值匹配不同的模式来执行代码。
2.  `match` 的模式可以很简单（比如具体值），也可以很复杂（比如从枚举变体里提取数据并绑定到变量）。
3.  `match` 必须是**穷尽的**，编译器会检查你是否覆盖了所有可能性，这能防止很多 bug，特别是配合 `Option<T>` 使用时。
4.  可以用变量名（如 `other`）作为通配模式来捕获所有剩余情况并使用其值。
5.  可以用 `_` 作为通配模式来匹配所有剩余情况但忽略其值。
6.  `match` 分支的代码可以是简单的表达式，也可以是 `{}` 包裹的复杂代码块。

懂了吗？`match` 是 Rust 的一个核心特性，用熟了会非常爽！