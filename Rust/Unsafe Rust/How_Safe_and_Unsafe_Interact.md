# How Safe and Unsafe Interact
我们来把“安全与不安全如何交互”这部分用大白话捋一捋。

**核心思想：**

Safe Rust 和 Unsafe Rust 并不是两个完全隔离的世界，它们需要互相沟通。`unsafe` 关键字就是它们之间的“**关卡**”或者说“**接口**”。

**`unsafe` 关键字的作用：**

1.  **设立关卡 (声明契约)：**
    *   用在 **函数** 或 **Trait 定义** 前面 (`unsafe fn ...` 或 `unsafe trait ...`)，意思是：“嘿，调用这个函数或实现这个 Trait 有一些**编译器检查不了的规则（契约）**，使用者/实现者必须自己看文档，确保满足这些规则，否则可能出大事！” 这就像给危险设备贴上警告标签。
    *   **例子：**
        *   标准库的 `slice::get_unchecked(index)` 函数是 `unsafe fn`。它的契约是：你传进来的 `index` 必须在 slice 的有效范围内。编译器不检查，**你自己保证**。
        *   标准库的 `Send` 和 `Sync` 是 `unsafe trait`。它们的契约是：如果你给你的类型实现了 `Send`，你必须保证把它移动到其他线程是安全的；实现了 `Sync`，你必须保证在多个线程间共享它的引用是安全的。**你自己保证**。

2.  **通过关卡 (履行契约)：**
    *   用在 **代码块** 前面 (`unsafe { ... }`)，意思是：“我（程序员）向你（编译器）保证，这个代码块里执行的所有 `unsafe` 操作，我都已经仔细检查过了，**满足了它们各自的契约/规则**。放行吧！” 这就像是你签了个“生死状”，表示你知道风险并已确认安全。
    *   **例子：**
        *   `let val = unsafe { *raw_pointer };` // 你保证 `raw_pointer` 是有效的。
        *   `let elem = unsafe { my_slice.get_unchecked(0) };` // 你保证索引 0 是有效的。
    *   用在 **Trait 实现** 前面 (`unsafe impl MyUnsafeTrait for MyType { ... }`)，意思是：“我保证，我对这个 `unsafe trait` 的实现，严格遵守了它定义的所有契约/规则。”
    *   **例子:**
        *   `unsafe impl Send for MyType {}` // 你保证 MyType 确实可以安全地在线程间移动。

**标准库里的 `unsafe` 例子：**

*   **函数：**
    *   `slice::get_unchecked()`: 不检查索引，越界就 UB (Undefined Behavior)。
    *   `mem::transmute()`: 强制类型转换，无视类型安全，非常危险。
    *   裸指针 (`*const T`, `*mut T`) 的 `offset()` 方法: 指针偏移，如果偏移出界，就是 UB。
    *   所有 FFI (调用 C 函数等): C 代码里干啥 Rust 都不知道，所以调用是 `unsafe`。
*   **Traits (目前稳定版里主要是这几个)：**
    *   `Send`: 标记类型可以安全地**移动**到别的线程。
    *   `Sync`: 标记类型可以安全地在多个线程间**共享**（通过引用）。
    *   `GlobalAlloc`: 允许你自定义整个程序的内存分配器（非常底层）。

**为啥要这么麻烦？核心原则：健全性 (Soundness)**

Safe Rust 有一条**黄金法则**：**无论你怎么写 Safe Rust 代码，永远、永远不会导致未定义行为 (Undefined Behavior, UB)。** UB 就是程序崩溃、内存损坏、安全漏洞的根源。

**信任关系不对等：**

*   **Safe Rust 信任 Unsafe Rust:** 为了保证上面那条黄金法则，Safe Rust 必须假设它调用的任何 `unsafe` 代码（包括标准库内部的）都是被正确实现的，遵守了该遵守的规则。
*   **Unsafe Rust 不能轻易信任 Safe Rust:** 反过来，如果一段 `unsafe` 代码需要依赖某些 Safe Rust 代码（比如泛型参数的某个 Trait 实现），它就**不能**想当然地认为这些 Safe Rust 代码一定是完美的。

**`BTreeMap` 的例子说明了这一点：**

*   `BTreeMap` (有序映射表) 需要 Key 实现 `Ord` Trait (定义了全序关系)。
*   实现 `Ord` Trait 本身是 **Safe Rust**。
*   `BTreeMap` 内部为了性能，用了很多 **Unsafe Rust** 代码。
*   **问题来了：** 如果某个用户写了一个**有问题**的 `Ord` 实现（比如 `a < b` 和 `b < a` 同时为 true，这违反了全序关系），虽然写这个实现是 Safe Rust，但如果 `BTreeMap` 内部的 `unsafe` 代码完全信任了这个错误的 `Ord` 实现，就可能导致内存访问错误，从而引发 **UB**。
*   **这是不允许的！** 因为 Safe Rust（实现 `Ord`）不应该导致 UB。
*   **所以：** `BTreeMap` 内部的 `unsafe` 代码**必须**写得足够健壮，即使面对一个行为不符合 `Ord` 预期的实现，也**最多**是让 `BTreeMap` 的行为变得混乱、不正确，但**绝不能**导致 UB。
*   **对比：** `BTreeMap` 可以信任像整数、切片这些核心类型的实现，因为它们是语言自带的、范围有限、风险可控。但它不能无条件信任**任何**用户提供的泛型 `Ord` 实现，因为用户可能犯错。

**`unsafe trait` 的意义：解决信任泛型的问题**

*   如果 `unsafe` 代码实在无法防御某个 Trait 的错误实现（比如错误的 `Ord`），那就可以把这个 Trait 标记为 `unsafe trait`。
*   `unsafe trait UnsafeOrd { ... }` ( hypothetical )
*   这样，想实现 `UnsafeOrd` 的人就必须写 `unsafe impl UnsafeOrd for ...`，明确表示：“我保证我的实现没问题！”
*   这时，`BTreeMap` 内部的 `unsafe` 代码就可以**信任**这个 `UnsafeOrd` 实现。如果出错了，责任就在于 `unsafe impl` 的那一方，符合 Rust 的安全模型。

**为啥 `Send` 和 `Sync` 是 `unsafe trait`？**

*   线程安全太根本、太复杂了。一段 `unsafe` 代码几乎不可能有办法去检查一个完全陌生的类型是否真的线程安全。唯一的办法就是让类型的作者用 `unsafe impl` 来做保证。
*   `GlobalAlloc` 也类似，内存分配是全局性的，如果分配器实现错了，依赖它的代码（如 `Box`, `Vec`）根本无法防御，只能信任。

**`Send` 和 `Sync` 的特殊处理：**

*   虽然它们是 `unsafe trait`，但 Rust 编译器很聪明。如果一个类型的所有成员都是 `Send`/`Sync` 的，编译器通常可以**自动**、安全地为这个类型实现 `Send`/`Sync`。这大大减少了需要手动写 `unsafe impl Send/Sync` 的情况。

**总结：**

Rust 通过 `unsafe` 关键字在 Safe 和 Unsafe 之间划清界限。目标是让 Safe Rust 尽可能易用和绝对安全，而把保证安全的责任集中到 Unsafe Rust 的编写者身上。写 Unsafe Rust 需要格外小心，必须理解并遵守各种底层规则（契约）。这本书剩下的内容，主要就是讲解这些规则以及如何小心地使用 Unsafe Rust。