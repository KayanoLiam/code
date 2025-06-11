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
          text: 'News',
          // collapsible: true, // 可选：是否可折叠
          // collapsed: false, // 可选：默认是否折叠 (如果 collapsible 为 true)
          items: [
            { text: 'Rewa070505', link: '/news/rewa070505' },
            { text: 'Rewa070510', link: '/news/rewa070510' }
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
      { icon: 'github', link: 'https://github.com/KayanoLiam' }
    ]
  }
})