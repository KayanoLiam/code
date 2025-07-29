import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Kayano code channel",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' }
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    // 将 sidebar 从数组改成对象
    sidebar: {
      // 当 URL 匹配 '/news/' 前缀时，显示这个侧边栏
      '/news/': [
        {
          text: '更新日志',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '2025年5月10日 - 侧边栏优化与Unsafe Rust更新', link: '/news/rewa070510' },
            { text: '2025年5月4日 - Rust函数与结构体章节', link: '/news/rewa070505' }
          ]
        }
      ],
      // 当 URL 匹配 '/Rust/' 前缀时，显示这个侧边栏
      // 注意：'/Rust/Actix_web/' 和 '/Rust/Unsafe Rust/' 也会匹配这个，所以它们的内容应该在这里定义
      '/Rust/': [
        {
          text: 'Rust Basics',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Install', link: '/Rust/Basics/install' },
            { text: 'Hello World', link: '/Rust/Basics/helloworld' },
            { text: 'Hello Cargo', link: '/Rust/Basics/cargo' },
            { text: 'Programming a Guessing Game', link: '/Rust/Basics/Programming_a_Guessing_Game' },
            { text: 'Common Programming Concepts', link: '/Rust/Basics/Common_Programming_Concepts' },
            { text: 'Variables and Mutability', link: '/Rust/Basics/Variables_and_Mutability' },
            { text: 'Data Types', link: '/Rust/Basics/Data_Types' },
            { text: 'Functions', link: '/Rust/Basics/Functions' },
            { text: 'Comments', link: '/Rust/Basics/Comments' },
            { text: 'Control Flow', link: '/Rust/Basics/Control_Flow' },
            { text: 'Understanding Ownership', link: '/Rust/Basics/Understanding_Ownership' },
            { text: 'What Is Ownership', link: '/Rust/Basics/What_Is_Ownership' },
            { text: 'References and Borrowing', link: '/Rust/Basics/References_and_Borrowing' },
            { text: 'The Slice Type', link: '/Rust/Basics/The_Slice_Type' },
            { text: 'Using Structs to Structure Related Data', link: '/Rust/Basics/Using_Structs_to_Structure_Related_Data' },
            { text: 'Defining and Instantiating Structs', link: '/Rust/Basics/Defining_and_Instantiating_Structs' },
            { text: 'An Example Program Using Structs', link: '/Rust/Basics/An_Example_Program_Using_Structs' },
            { text: 'Method Syntax', link: '/Rust/Basics/Method_Syntax' },
            { text: 'Enums and Pattern Matching', link: '/Rust/Basics/Enums_and_Pattern_Matching' },
            { text: 'Defining an Enum', link: '/Rust/Basics/Defining_an_Enum' },
            { text: 'The match Control Flow Construct', link: '/Rust/Basics/The_match_Control_Flow_Construct' },
            { text: 'Concise Control Flow with if let and let else', link: '/Rust/Basics/Concise_Control_Flow_with_if_let_and_let_else' },
            { text: 'Managing Growing Projects with Packages, Crates, and Modules', link: '/Rust/Basics/Managing_Growing_Projects_with_Packages_Crates_and_Modules' },
            { text: 'Packages and Crates', link: '/Rust/Basics/Packages_and_Crates' },
            { text: 'Defining Modules to Control Scope and Privacy', link: '/Rust/Basics/Defining_Modules_to_Control_Scope_and_Privacy' },
            { text: 'Paths for Referring to an Item in the Module Tree', link: '/Rust/Basics/Paths_for_Referring_to_an_Item_in_the_Module_Tree' },
            { text: 'Bringing Paths into Scope with the use Keyword', link: '/Rust/Basics/Bringing_Paths_into_Scope_with_the_use_Keyword' },
            { text: 'Separating Modules into Different Files', link: '/Rust/Basics/Separating_Modules_into_Different_Files' },
          ]
        },
        {
          text: 'Actix-web Basics',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Getting Started', link: '/Rust/Actix_web/Basics/Getting_started' },
            { text: 'Application', link: '/Rust/Actix_web/Basics/Application' },
            { text: 'Server', link: '/Rust/Actix_web/Basics/Server' },
            { text: 'Extractors', link: '/Rust/Actix_web/Basics/Extractors' },
            { text: 'Handlers', link: '/Rust/Actix_web/Basics/Handlers' },
          ]
        },
        {
          text: 'Actix-web Advanced',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Error', link: '/Rust/Actix_web/Advanced/Error' },
            { text: 'URL Dispatch', link: '/Rust/Actix_web/Advanced/URL_Dispatch' },
            { text: 'Requests', link: '/Rust/Actix_web/Advanced/Requests' },
            { text: 'Responses', link: '/Rust/Actix_web/Advanced/Responses' },
            { text: 'Testing', link: '/Rust/Actix_web/Advanced/Testing' },
            { text: 'Middleware', link: '/Rust/Actix_web/Advanced/Middleware' },
            { text: 'Static Files', link: '/Rust/Actix_web/Advanced/Static_Files' },
          ]
        },
        {
          text: 'Actix-web Protocols',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Websocket', link: '/Rust/Actix_web/Protocols/Websockets' },
            { text: 'HTTP/2 and TLS(HTTPS)', link: '/Rust/Actix_web/Protocols/HTTP_2' },
          ]
        },
        {
          text: 'Actix-web Patterns',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Auto Reloading', link: '/Rust/Actix_web/Patterns/Auto_Reloading' },
            { text: 'Databases', link: '/Rust/Actix_web/Patterns/Databases' },
            { text: 'Hosting on Shuttle', link: '/Rust/Actix_web/Patterns/Hosting_on_Shuttle' },
          ]
        },
        {
          text: 'Actix-web Diagrams',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'HTTP Server initialization', link: '/Rust/Actix_web/Diagrams/HTTP_Server_initialization' },
            { text: 'Connection Lifecycle', link: '/Rust/Actix_web/Diagrams/Connection_Lifecycle' },
          ]
        },
        {
          text: 'Unsafe Rust',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Introduction', link: '/Rust/Unsafe Rust/Introduction' },
            { text: 'Meet Safe and Unsafe', link: '/Rust/Unsafe Rust/Meet_Safe_and_Unsafe' },
            { text: 'How Safe and Unsafe Interact', link: '/Rust/Unsafe Rust/How_Safe_and_Unsafe_Interact' },
            { text: 'What Unsafe Rust Can Do', link: '/Rust/Unsafe Rust/What_Unsafe_Rust_Can_Do' },
            { text: 'Working with Unsafe', link: '/Rust/Unsafe Rust/Working_with_Unsafe' },
            { text: 'Data Representation in Rust', link: '/Rust/Unsafe Rust/Data_Representation_in_Rust' },
            { text: 'repr(Rust)', link: '/Rust/Unsafe Rust/repr(Rust)' },
            { text: 'Exotically Sized Types', link: '/Rust/Unsafe Rust/Exotically_Sized_Types' },
            { text: 'Alternative representations', link: '/Rust/Unsafe Rust/Alternative_representations' },
            { text: 'Ownership and Lifetimes', link: '/Rust/Unsafe Rust/Ownership_and_Lifetimes' },
            { text: 'References', link: '/Rust/Unsafe Rust/References' },
            { text: 'Aliasing', link: '/Rust/Unsafe Rust/Aliasing' },
          ]
        }
      ],
      // 当 URL 匹配 '/Python/' 前缀时，显示这个侧边栏
      '/Python/': [
        {
          text: 'Python 开发环境',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'uv - 现代包管理器', link: '/Python/Environment/uv' },
          ]
        },
        {
          text: 'Python 基础',
          collapsible: true,
          collapsed: true,
          items: [
            { text: '变量和赋值', link: '/Python/Basics/variables' },
            { text: '基本数据类型', link: '/Python/Basics/data_types' },
            { text: '字符串详解', link: '/Python/Basics/strings' },
            { text: '集合类型', link: '/Python/Basics/collections' },
            { text: '控制流', link: '/Python/Basics/control_flow' },
            { text: '函数', link: '/Python/Basics/functions' },
            { text: '异常处理', link: '/Python/Basics/exceptions' },
            { text: '文件操作', link: '/Python/Basics/file_operations' },
            { text: '推导式和实用技巧', link: '/Python/Basics/comprehensions' },
          ]
        }
      ],
      // 当 URL 匹配 '/Zig/' 前缀时，显示这个侧边栏
      '/Zig/': [
        {
          text: 'Zig Basics',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Install', link: '/Zig/Basics/install' },
            { text: 'Hello World', link: '/Zig/Basics/helloworld' },
            { text: 'Build System', link: '/Zig/Basics/build_system' },
            { text: 'Common Programming Concepts', link: '/Zig/Basics/Common_Programming_Concepts' },
            { text: 'Variables', link: '/Zig/Basics/Variables' },
            { text: 'Data Types', link: '/Zig/Basics/Data_Types' },
            { text: 'Functions', link: '/Zig/Basics/Functions' },
            { text: 'Comments', link: '/Zig/Basics/Comments' },
            { text: 'Control Flow', link: '/Zig/Basics/Control_Flow' },
            { text: 'Error Handling', link: '/Zig/Basics/Error_Handling' },
            { text: 'Structs', link: '/Zig/Basics/Structs' },
            { text: 'Enums', link: '/Zig/Basics/Enums' },
            { text: 'Unions', link: '/Zig/Basics/Unions' },
            { text: 'Comptime', link: '/Zig/Basics/Comptime' },
          ]
        }
      ],
      // 当 URL 匹配 '/future/' 前缀时，显示这个侧边栏
      '/future/': [
        {
          text: 'Future',
          items: [
            { text: 'Future', link: '/future/future_rewa_070505' },
          ]
        }
      ],
      // （可选）你可以为根路径 '/' 单独配置一个侧边栏，或者让它不显示侧边栏
      // 如果不为 '/' 提供配置，并且你的 Home 链接到 '/'，它可能不显示侧边栏，
      // 或者显示第一个匹配的侧边栏（如果路径是 `/` 的话，通常不会匹配上面带具体路径的）
      // 或者你可以设置一个 "fallback" 侧边栏:
      // '/': [ /* 首页或通用内容的侧边栏 */ ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KayanoLiam' },
      { icon: 'twitter', link: 'https://x.com/KayanoJackal' },
      { icon: 'discord', link: 'https://discord.gg/3BhwGcvP' },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Reddit</title><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>'
        },
        link: 'https://www.reddit.com/u/KayanoJackal/s/GZ86BN3f8u'
      }
    ]
  }
})
