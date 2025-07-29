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
      link: /Rust/Basics/install
    - theme: brand
      text: Zig
      link: /Zig/Basics/install
    # - theme: brand
    #   text: Solana
    #   link: /solana/solana
    - theme: alt
      text: Python
      link: /Python/Environment/uv
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
    details: Rust 是一门由 Mozilla 开发的系统编程语言，通过独特的所有权与借用机制在编译期保障内存安全，同时提供高性能和并发支持。
  - title: Zig
    details: Zig 是一门通用的系统编程语言和工具链，旨在构建健壮、最优和可复用的软件。它注重简单性、性能和安全，并提供对内存的精细控制。
  - title: Python
    details: Python 是一门高级、动态类型的解释型编程语言，以简洁易读的语法和丰富的标准库著称，广泛应用于 Web 开发、数据分析、人工智能等领域。
  - title: Actix-web
    details: Actix-web 是基于 Rust 的高性能异步网页框架，构建在 Actix actor 系统之上，提供灵活的路由、中间件和 WebSocket 支持。
  - title: Unsafe Rust
    details: Unsafe Rust 是 Rust 语言中允许绕过部分编译时安全检查的代码区域，开发者可以使用原始指针、调用 `unsafe` 函数、操作 `static mut`、定义 `unsafe` trait 等，但必须自行保证内存和并发安全。
---
