# 引用和借用 (References and Borrowing)
咱们接着聊 Rust 的核心概念，这次是紧跟着“所有权”的**引用 (References)** 和 **借用 (Borrowing)**。这俩是解决“所有权”规则有时过于严格（比如我只是想让函数看看我的数据，不想把所有权给它）的关键机制。
**回顾：所有权的“烦恼”**

上一节我们知道，把一个像 `String` 这样拥有堆内存数据的值传给函数，所有权会**转移 (Move)**。看这个例子：

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length_takes_ownership(s1); // s1 的所有权没了！
    println!("The length of '{}' is {}.", "???", len); // 没法再用 s1 了
}

// 这个函数接收 String 的所有权
fn calculate_length_takes_ownership(s: String) -> usize {
    let length = s.len();
    // s 离开作用域被 drop，内存释放
    length // 返回长度
}
// 如果我们还想在 main 函数里继续用 s1 怎么办？
// 函数得把 String 再返回出来，所有权再转移回来，像这样：
fn calculate_length_returns_ownership(s: String) -> (String, usize) {
    let length = s.len();
    (s, length) // 把 String 和长度一起返回
}
// 这样 main 函数调用就得写成：
// let (s2, len) = calculate_length_returns_ownership(s1);
// println!("The length of '{}' is {}.", s2, len);
```

这样来回传递所有权是不是有点麻烦？我只是想让 `calculate_length` 函数用一下 `s1` 来计算个长度而已，并不想失去对 `s1` 的所有权。

**解决方案：引用 (References) - “借”着用，不拿走！**

Rust 提供了一个办法，让你可以在**不转移所有权**的情况下，让代码的其他部分访问一个值。这就是**引用 (Reference)**。

你可以把引用想象成一个“**指向**”某个值的“**指针**”或“**地址**”，但它比 C/C++ 里的裸指针安全得多，因为它受到 Rust 编译器的严格检查。

*   **创建引用:** 使用 **`&`** 操作符。
*   **传递引用:** 把引用（而不是值本身）传递给函数。
*   **函数接收引用:** 函数参数的类型也要声明为引用类型（比如 `&String`）。

我们用引用来重写上面的例子：

```rust
fn main() {
    let s1 = String::from("hello");

    // 创建 s1 的引用 (&s1)，并把它传给函数
    // 注意：s1 的所有权没有移动！
    let len = calculate_length_with_reference(&s1);

    // s1 在这里仍然有效！
    println!("The length of '{}' is {}.", s1, len);
}

// 这个函数接收一个 String 的引用 (&String)
// 注意参数类型是 &String，不是 String
fn calculate_length_with_reference(s: &String) -> usize {
    // s 是一个指向 s1 所拥有的 String 数据的引用
    // 我们可以通过引用 s 来访问数据，比如调用 .len()
    s.len()
} // s (引用) 在这里离开作用域。但因为它不拥有数据，
  // 所以当它离开时，它指向的数据（s1 拥有的 String）不会被 drop！
```

**借用 (Borrowing)：创建引用的动作**

我们把**创建引用的这个动作**叫做**借用 (Borrowing)**。就像你从朋友那里借书：

*   书还是你朋友的（所有权没变）。
*   你只是临时拿来看（通过引用访问）。
*   你看完了得还回去（引用离开作用域）。

**默认是不可变借用 (Immutable Borrows)**

当你像上面那样写 `&s1` 时，你创建的是一个**不可变引用 (immutable reference)**。这意味着：

*   你可以通过这个引用**读取**它指向的数据（比如调用 `.len()`）。
*   但你**不能**通过这个引用**修改**数据！

试试看修改：

```rust
fn main() {
    let s = String::from("hello");
    change_immutable(&s);
}

fn change_immutable(some_string: &String) {
    // some_string.push_str(", world"); // <-- 编译错误！
    // error[E0596]: cannot borrow `*some_string` as mutable, as it is behind a `&` reference
    // help: trait `DerefMut` is required to modify through a dereference, but it is not implemented for `String`
}
```

编译器会阻止你这样做，因为它违反了“不可变借用不能修改数据”的规则。这保证了数据不会在你意想不到的地方被偷偷改掉。

**可变借用 (Mutable Borrows)：我要修改它！**

如果你确实需要让一个函数通过引用来修改它借用的值，你需要创建**可变引用 (mutable reference)**。

*   **前提:** 值本身必须是**可变的**（用 `let mut` 声明）。
*   **创建可变引用:** 使用 **`&mut`** 操作符。
*   **函数接收可变引用:** 函数参数的类型要声明为可变引用类型（比如 `&mut String`）。

看例子：

```rust
fn main() {
    // s 必须是 mut 才能创建 &mut s
    let mut s = String::from("hello");

    println!("修改前: {}", s);

    // 创建 s 的可变引用 (&mut s) 并传递
    change_mutable(&mut s);

    println!("修改后: {}", s); // 输出 "hello, world"
}

// 函数接收一个 String 的可变引用 (&mut String)
fn change_mutable(some_string: &mut String) {
    // 现在可以通过可变引用修改数据了！
    some_string.push_str(", world!");
}
```

**借用规则：保证内存安全的关键 (非常重要！)**

为了防止出现**数据竞争 (Data Races)** 等内存安全问题，Rust 对借用施加了严格的规则，编译器会强制执行：

**核心规则：** 在**任何给定的作用域 (scope)** 内，对于一个特定的数据，你只能拥有以下两种情况**之一**：

1.  **任意数量的不可变引用 (`&T`)。** (可以有很多读者同时看，但不能写)。
2.  **仅仅一个可变引用 (`&mut T`)。** (只能有一个作者在写，且此时不能有任何读者)。

**换句话说：**

*   如果你已经有了一个可变引用 (`&mut T`)，你就**不能**再创建任何其他引用（无论是可变的还是不可变的）指向同一个数据，直到这个可变引用不再使用。
*   如果你已经有了一个或多个不可变引用 (`&T`)，你就**不能**再创建可变引用 (`&mut T`) 指向同一个数据，直到所有这些不可变引用不再使用。

**为什么要有这个规则？防止数据竞争！**

数据竞争通常发生在以下三个条件同时满足时：
1.  两个或更多的“指针”（或引用）并发地访问同一块数据。
2.  其中至少有一个访问是写入操作。
3.  没有使用任何同步机制来控制访问顺序。

数据竞争会导致未定义行为，非常难调试。Rust 的借用规则通过在**编译时**就阻止这种情况的发生来保证安全：

*   如果你有写权限（一个 `&mut`），那么就没有其他任何读写权限。
*   如果你有读权限（一个或多个 `&`），那么就没有写权限。

**看例子理解规则：**

*   **允许多个不可变引用:**
    ```rust
    let s = String::from("hello");
    let r1 = &s; // OK
    let r2 = &s; // OK
    println!("r1={}, r2={}", r1, r2); // 可以同时使用 r1 和 r2 读取
    ```

*   **不允许同时存在可变和不可变引用:**
    ```rust
    let mut s = String::from("hello");
    let r1 = &s;       // 不可变借用开始
    let r2 = &s;       // 又一个不可变借用
    // let r3 = &mut s; // <-- 编译错误！ cannot borrow `s` as mutable because it is also borrowed as immutable
    // println!("{}, {}, and {}", r1, r2, r3); // 如果上面不报错，这里同时使用了不可变和可变引用
    ```
    只要 `r1` 和 `r2` 还可能被使用（在它们的作用域内），你就不能创建 `r3` 这个可变引用。

*   **不允许同时存在多个可变引用:**
    ```rust
    let mut s = String::from("hello");
    let r1 = &mut s; // 第一个可变借用
    // let r2 = &mut s; // <-- 编译错误！ cannot borrow `s` as mutable more than once at a time
    // println!("{}, {}", r1, r2);
    ```

*   **作用域和生命周期很重要 (Non-Lexical Lifetimes - NLL):**
    一个引用的有效范围（生命周期）是从它被创建开始，到它**最后一次被使用**的地方结束。Rust 编译器比我们想象的更聪明（这得益于 NLL），它能精确分析引用的实际使用范围。

    ```rust
    let mut s = String::from("hello");

    let r1 = &s; // 不可变借用 r1 开始
    let r2 = &s; // 不可变借用 r2 开始
    println!("{} and {}", r1, r2);
    // r1 和 r2 在这里被最后一次使用，它们的作用域（生命周期）实际上到这里就结束了！

    // 虽然 r1, r2 的声明还在上面，但因为它们不再被使用了，
    // 所以现在创建可变引用是安全的！
    let r3 = &mut s; // OK
    println!("{}", r3);
    r3.push_str("!");
    ```

**悬垂引用 (Dangling References)：Rust 从根本上杜绝！**

悬垂引用（或悬垂指针）是指一个指针指向的内存地址是无效的（比如内存已经被释放了，或者被挪作他用了）。访问悬垂引用是非常危险的未定义行为。

Rust 的编译器通过**生命周期 (Lifetimes)**（我们后面会详细学）和所有权/借用规则，**保证你绝对不会意外创建出悬垂引用**。

看一个编译器会**阻止**的例子：

```rust
// 这个函数试图返回一个指向函数内部变量的引用
// fn dangle() -> &String { // 返回一个 String 的引用
//     let s = String::from("hello"); // s 是 dangle 函数的局部变量
//     &s // 返回对 s 的引用
// } // s 在这里离开作用域，被 drop，它拥有的内存被释放！

// fn main() {
//     let reference_to_nothing = dangle(); // 如果编译通过，这里会得到一个指向无效内存的悬垂引用！
// }
```

当你尝试编译这段代码时，Rust 编译器会报错，告诉你返回的引用指向的数据 `s` 活得不够久（`s` 在函数结束时就死了，但引用想活得更久，这是不允许的）。编译器在编译时就阻止了悬垂引用的产生！

**总结一下引用和借用规则：**

1.  **引用 (`&` 或 `&mut`)** 允许你访问一个值而**不获取其所有权**。
2.  创建引用的行为叫做**借用**。
3.  在同一作用域内，对同一数据，你可以有：
    *   **多个不可变引用 (`&T`)**，或者
    *   **一个可变引用 (`&mut T`)**。两者不能共存（除非生命周期不重叠）。
4.  引用必须**总是有效的**（不能是悬垂引用），编译器会通过生命周期检查来保证这一点。

引用和借用是 Rust 实现内存安全和灵活性的关键机制。它们让你可以在遵守所有权规则的前提下，高效、安全地共享和修改数据。下一节我们会看到另一个与引用相关的概念：切片 (Slices)。