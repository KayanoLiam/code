
# 定义和实例化结构体 (Defining and Instantiating Structs)
咱们来深入学习**结构体 (Structs)**，看看怎么**定义**它们，以及怎么创建它们的**实例**。

**回顾：Struct vs. Tuple**

我们知道元组（Tuple）和结构体（Struct）都能把多个相关的值打包在一起，而且里面的值可以是不同类型的。

*   **元组的缺点：** 元素没名字，只能靠索引（`.0`, `.1`）访问，不直观，容易搞错顺序。
*   **结构体的优点：** 给每个“部分”（我们叫它**字段 Field**）都起了**名字**，非常清晰。访问时用 `实例名.字段名`，一看就懂。结构体比元组更灵活，因为你不依赖顺序来访问值。

**如何定义一个结构体 (Define a Struct)**

就像给你的“自定义盒子”画设计蓝图。

1.  使用 `struct` 关键字。
2.  给你的结构体起一个有意义的名字（通常用**大驼峰命名法 CamelCase**，比如 `UserProfile`, `Rectangle`）。这个名字应该能描述你组合的这堆数据的意义。
3.  在大括号 `{}` 里面，定义每个**字段 (field)** 的**名字**和**类型**，用逗号 `,` 分隔。字段名用**蛇形命名法 (snake_case)**。

看例子，定义一个表示用户账户信息的 `User` 结构体：

```rust
// Filename: src/main.rs

// 定义 User 结构体
struct User {
    active: bool,        // 是否活跃 (布尔值)
    username: String,    // 用户名 (可变的 String 类型)
    email: String,       // 邮箱 (可变的 String 类型)
    sign_in_count: u64,  // 登录次数 (64位无符号整数)
} // 注意：结构体定义末尾没有分号 ;

// main 函数暂时为空，我们只是先定义了结构体
fn main() {
    // 后面我们会在这里创建 User 实例
}
```
这个 `User` 结构体就定义好了，它是一个新的**类型**，就像 `i32` 或 `String` 一样。它规定了每个 `User` 都必须包含 `active`, `username`, `email`, `sign_in_count` 这四个字段，并且指定了它们的类型。

**如何实例化一个结构体 (Instantiate a Struct)**

有了蓝图，我们就可以根据它创建具体的“用户盒子”了，这个过程叫**实例化**。

1.  写出结构体的名字。
2.  紧跟着一对大括号 `{}`。
3.  在大括号里，写出 `字段名: 值,` 的键值对。
4.  **顺序不重要：** 你提供字段值的顺序**不需要**和定义时的顺序一样。
5.  **必须提供所有字段的值**（除非后面学到默认值或者其他技巧）。

看例子，创建一个 `User` 实例：

```rust
// Filename: src/main.rs
// (假设上面已经定义了 User struct)

fn main() {
    // 创建一个 User 实例，并绑定到变量 user1
    let user1 = User {
        email: String::from("someone@example.com"), // 邮箱字段
        username: String::from("someusername123"), // 用户名字段
        active: true,                             // 是否活跃字段
        sign_in_count: 1,                         // 登录次数字段
    }; // 注意这里有分号，因为 let 语句需要分号

    // 现在 user1 就是一个 User 类型的值了
}
```

**访问和修改结构体字段**

*   **访问字段:** 使用**点号 (`.`)** 加上字段名。
    ```rust
    // (接上例)
    let user_email = user1.email; // 获取 user1 的邮箱
    println!("用户的邮箱是: {}", user_email);
    ```
*   **修改字段:** 如果结构体实例是**可变的 (mutable)**（用 `let mut` 声明），你就可以通过点号修改字段的值。
    ```rust
    // Filename: src/main.rs
    // (假设上面已经定义了 User struct)
    fn main() {
        // 创建一个可变的 User 实例
        let mut user1 = User {
            email: String::from("someone@example.com"),
            username: String::from("someusername123"),
            active: true,
            sign_in_count: 1,
        };

        println!("修改前的邮箱: {}", user1.email);

        // 修改 email 字段的值
        user1.email = String::from("anotheremail@example.com");

        println!("修改后的邮箱: {}", user1.email);
        // user1.sign_in_count = 2; // 也可以修改其他字段
    }
    ```
    **注意：** Rust 不允许只把结构体的某个字段标记为可变。要修改任何字段，**整个实例必须**用 `let mut` 声明为可变。

**使用函数创建结构体实例**

可以写一个函数来专门负责创建结构体实例，这样更方便。函数可以接收参数，并返回一个创建好的实例。

```rust
// Filename: src/main.rs
// (假设上面已经定义了 User struct)

// 这个函数接收 email 和 username，返回一个新的 User 实例
fn build_user(email: String, username: String) -> User {
    // 创建并返回 User 实例
    User {
        active: true, // active 和 sign_in_count 使用固定值
        username: username, // 字段名: 参数名
        email: email,       // 字段名: 参数名
        sign_in_count: 1,
    } // 这是函数最后一个表达式，没有分号，所以会作为返回值
}

fn main() {
    let user_email = String::from("test@example.com");
    let user_name = String::from("testuser");
    let new_user = build_user(user_email, user_name);

    println!("新用户的邮箱: {}", new_user.email);
}
```

**字段初始化简写语法 (Field Init Shorthand)**

在 `build_user` 函数里，我们写了 `username: username` 和 `email: email`。当**函数参数名**和**结构体字段名完全一样**时，Rust 提供了一种简写方式：可以**只写一次名字**。

```rust
// Filename: src/main.rs
// (假设上面已经定义了 User struct)

// 使用字段初始化简写
fn build_user_shorthand(email: String, username: String) -> User {
    User {
        active: true,
        username, // 等价于 username: username
        email,    // 等价于 email: email
        sign_in_count: 1,
    }
}

fn main() {
    // ... 调用方式不变 ...
    let user_email = String::from("test@example.com");
    let user_name = String::from("testuser");
    let new_user = build_user_shorthand(user_email, user_name);
    println!("新用户的用户名: {}", new_user.username);
}
```
这个简写能让代码更简洁，特别是当字段很多的时候。

**结构体更新语法 (Struct Update Syntax)：复用旧实例的值**

有时候你想创建一个新实例，它的大部分字段值和另一个已有的实例一样，只有少数几个字段不同。你可以一个个字段复制，但很麻烦。Rust 提供了“**结构体更新语法**”。

*   使用 `..实例名` 的语法，把它放在**最后**。
*   这表示：所有**没有**在这个新实例里**显式指定**的字段，都从 `..` 后面的那个实例里**复制**对应的值。

看例子：

```rust
// Filename: src/main.rs
// (假设上面已经定义了 User struct 和 user1 实例)
fn main() {
    let user1 = User { /* ... user1 的初始化 ... */
        email: String::from("user1@example.com"),
        username: String::from("userone"),
        active: true,
        sign_in_count: 10,
     };

    // 创建 user2，只想改 email，其他用 user1 的
    let user2 = User {
        email: String::from("user2@example.com"), // 显式指定 email
        ..user1 // 剩下的 username, active, sign_in_count 都从 user1 获取
    };

    println!("User2 username: {}", user2.username); // 输出 userone
    println!("User2 active: {}", user2.active);     // 输出 true

    // 注意所有权！
    // println!("User1 username: {}", user1.username); // <-- 编译错误！

    // 为什么 user1.username 不能用了？
    // 因为 struct update syntax 使用了 `=`，它会像赋值一样移动数据。
    // user1 的 username 字段是 String 类型（拥有堆数据，不是 Copy）。
    // 当创建 user2 时，user1 的 username 的所有权被 *移动 (move)* 给了 user2。
    // 所以 user1 作为一个整体就不能再被使用了 (因为它的一部分数据没了)。

    // 但是，如果只用了 user1 中实现了 Copy trait 的字段，user1 仍然部分有效：
    let user3 = User {
        email: String::from("user3@example.com"),
        username: String::from("userthree"), // user3 有自己的 username
        ..user1 // 这里只用了 user1 的 active (bool, Copy) 和 sign_in_count (u64, Copy)
    };
    // 此时 user1 仍然是有效的，因为 String 字段没有被移动！
    println!("User1 email after user3: {}", user1.email); // OK

}
```

**关键点：** 结构体更新语法会**移动 (move)** 那些没有实现 `Copy` trait 的字段的所有权（比如 `String`）。如果所有被复用的字段都实现了 `Copy`（比如 `bool`, `u64`），那么原来的实例仍然完全有效。

**元组结构体 (Tuple Structs)：有名字的元组**

有时候你想要一个像元组那样结构简单（元素没名字）的类型，但又想给这个整体类型起个名字，让它和其他元组区分开。这时可以用**元组结构体**。

*   **定义：** `struct 名字(类型1, 类型2, ...);` 用圆括号 `()` 包裹类型，结尾有分号 `;`。
*   **实例化：** `let 实例名 = 名字(值1, 值2, ...);`

```rust
// Filename: src/main.rs

// 定义两个元组结构体
struct Color(i32, i32, i32); // 代表 RGB 颜色
struct Point(i32, i32, i32); // 代表三维空间点

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);

    // black 和 origin 是不同的类型！即使内部都是三个 i32
    // let some_color: Color = origin; // 错误！类型不匹配

    // 访问元素：像元组一样用点号 + 索引
    let red_value = black.0;
    let x_coordinate = origin.0;

    println!("Black's red value: {}", red_value);
    println!("Origin's x coordinate: {}", x_coordinate);

    // 也可以解构，但需要写上类型名
    let Point(x, y, z) = origin;
    println!("Origin coordinates: x={}, y={}, z={}", x, y, z);
}
```
元组结构体在你希望区分不同用途的元组，但给每个字段命名又显得啰嗦时很有用。

**单元结构体 (Unit-Like Structs)：没有字段的结构体**

你甚至可以定义一个**没有任何字段**的结构体！它叫做**单元结构体**，因为它表现得像单元类型 `()`。

*   **定义：** `struct 名字;` 只有一个名字和分号。
*   **实例化：** `let 实例名 = 名字;`

```rust
// Filename: src/main.rs

// 定义一个单元结构体
struct AlwaysEqual;

fn main() {
    // 实例化
    let subject1 = AlwaysEqual;
    let subject2 = AlwaysEqual;
    // subject1 和 subject2 都是 AlwaysEqual 类型
    // 这个类型本身不存储任何数据
}
```
单元结构体有什么用呢？它通常在你需要实现某个**特性 (Trait)**，但这个特性不需要任何数据来存储时很有用（比如，你想定义一个类型，让它的所有实例都永远相等，你不需要存任何数据来实现这个逻辑）。我们会在第 10 章学习 Trait 时看到它的用途。

**结构体数据的“所有权”问题 (重要！)**

在上面 `User` 的例子里，我们给 `username` 和 `email` 字段用了 `String` 类型，而不是字符串切片 `&str`。

```rust
struct User {
    // ...
    username: String, // 拥有数据的 String
    email: String,    // 拥有数据的 String
    // ...
}
```

这是**故意**的选择。因为我们希望**每个 `User` 实例都完全拥有它自己的所有数据**。这样，只要 `User` 实例本身是有效的，它的所有字段数据也保证是有效的。

**能不能在结构体里存储引用 (`&str`) 呢？**

可以，但是会更复杂！如果你尝试这样做：

```rust
// 这段代码编译不过！
// struct UserWithRef {
//     username: &str, // 存储字符串切片 (引用)
//     email: &str,    // 存储字符串切片 (引用)
//     // ...
// }
```

编译器会报错，告诉你“缺少生命周期说明符 (missing lifetime specifier)”。为什么？

因为**引用本身不拥有数据**，它只是“指向”别处的数据。编译器需要确保这个引用指向的数据活得**足够久**，至少要和包含这个引用的结构体实例活得一样久，否则就会产生**悬垂引用**！

为了向编译器证明这一点，你需要使用 Rust 的一个高级特性叫做**生命周期 (Lifetimes)**，我们会在第 10 章详细学习。

**目前的结论：** 在学习生命周期之前，为了简单和安全，**优先在你的结构体中使用拥有所有权的类型**（比如 `String`, `Vec<T>` 等），而不是引用类型（比如 `&str`, `&[T]`）。

**总结一下定义和实例化结构体：**

1.  **定义 (`struct Name { field: Type, ... }`)**: 创建自定义类型蓝图，用大括号和命名字段。
2.  **实例化 (`Name { field: value, ... }`)**: 根据蓝图创建具体值，用大括号和键值对，顺序不重要。
3.  **访问/修改 (`instance.field`)**: 用点号访问。修改需要实例是 `mut`。
4.  **字段初始化简写**: 参数名和字段名相同时，可以只写一次。
5.  **结构体更新语法 (`..instance`)**: 用另一个实例的值填充未显式指定的字段（注意所有权移动！）。
6.  **元组结构体 (`struct Name(Type, ...);`)**: 有名字的元组，用 `.`+索引访问。
7.  **单元结构体 (`struct Name;`)**: 没有字段的结构体。
8.  **所有权**: 默认情况下，结构体应该**拥有**其所有数据（使用 `String` 而不是 `&str`），以避免生命周期的复杂性。

结构体是 Rust 中组织数据、构建自定义类型的强大工具！