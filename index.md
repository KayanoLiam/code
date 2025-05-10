---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Kayano code channel"
  text: "A Rust and Python Site"
  tagline: 我想用大白话来讲一些很难讲的东西(好像有语病bushi)
  actions:
    - theme: brand
      text: What's new
      link: /news/rewa070505
    - theme: brand
      text: Rust
      link: /Rust/install
    # - theme: brand
    #   text: Solana
    #   link: /solana/solana
    - theme: alt
      text: Python
      link: /api-examples
    - theme: alt
      text: Actix-web
      link: /Rust/Actix_web/Basics/Getting_started
    - theme: alt
      text: Unsafe Rust
      link: /Rust/Unsafe Rust/Introduction
    - theme: alt
      text: Future
      link: /future/future_rewa_070505

features:
  - title: Rust
    details: Rust 是一门系统编程语言，通过所有权模型和借用检查器在编译期确保内存安全和线程安全，同时不依赖垃圾回收器，兼顾高性能和可靠性。学习这门语言，可能要求你有一定的编程基础。
  - title: Python
    details: Python 是一门高级编程语言，通过自动垃圾回收机制管理内存，使得开发者能更专注于业务逻辑而非底层的内存管理。虽然它有全局解释器锁（GIL）在某些情况下限制了多线程并行性，但其丰富的库和易用性使其在Web开发、数据科学、人工智能等领域广泛应用，兼顾开发效率和功能强大。学习这门语言通常被认为是比较容易上手的，非常适合初学者入门编程。
  - title: Actix-web
    details: Actix-web的中文教程,根据英文版本进行通俗化解释之后的版本。Actix-Web 是一个基于 Rust 的高性能 Web 框架，它充分利用 Rust 的内存安全与并发优势，并基于 Actor 模型和异步编程范式，来实现非阻塞的高并发处理和卓越的性能表现，同时保持了 Rust 语言固有的内存安全和线程安全特性，无需垃圾回收器的介入。这使其在构建需要极致性能和高并发的API服务、微服务等场景下表现出色，兼顾极高性能和强大的并发处理能力。学习和使用该框架，通常要求开发者对 Rust 语言本身及异步编程模型有较好的理解。
  - title: Unsafe Rust
    details: Rust的黑魔法，需要有一定的基础。被称为死灵书。是英文书《Rustonomicon》的通俗解释版本。Unsafe Rust 是 Rust 语言中的一个关键字和代码块标记，它允许开发者在特定代码块中暂时搁置 Rust 编译器的一些严格安全检查（如借用检查器的部分规则），以便执行那些编译器无法静态验证其内存安全和线程安全的操作。这些操作通常包括解引用裸指针、调用非 Rust 的外部函数接口（FFI）、访问或修改可变的静态变量等，是与系统底层交互或优化性能时不可或缺的手段。虽然 Unsafe Rust 赋予了程序员更强的控制力和灵活性，但同时也意味着开发者必须自行承担起确保这部分代码内存安全的责任，因为编译器的保护网在这里被显式地“打开了一个口子”。它使得 Rust 能够构建出安全的抽象，即便底层实现依赖于不安全的操作，兼顾对系统底层的极致控制能力和语言整体的内存安全（通过将不安全操作封装并隔离）。使用 Unsafe Rust 要求开发者对内存布局、生命周期以及潜在的并发问题有深刻理解和极高的审慎态度。
---

