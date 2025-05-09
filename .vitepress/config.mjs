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
          text: 'Rust', // 可以给一个更具体的标题
          collapsible: true,
          items: [
            { text: 'Install', link: '/Rust/install' },
            { text: 'Hello World', link: '/Rust/helloworld' },
            { text: 'Hello Cargo', link: '/Rust/cargo' },
            { text: 'Programming a Guessing Game', link: '/Rust/Programming_a_Guessing_Game' },
            { text: 'Common Programming Concepts', link: '/Rust/Common_Programming_Concepts' },
            { text: 'Variables and Mutability', link: '/Rust/Variables_and_Mutability' },
            { text: 'Data Types', link: '/Rust/Data_Types' },
            { text: 'Functions', link: '/Rust/Functions' },
            { text: 'Comments', link: '/Rust/Comments' },
            { text: 'Control Flow', link: '/Rust/Control_Flow' },
            { text: 'Understanding Ownership', link: '/Rust/Understanding_Ownership' },
            { text: 'What Is Ownership', link: '/Rust/What_Is_Ownership' },
            { text: 'References and Borrowing', link: '/Rust/References_and_Borrowing' },
            { text: 'The Slice Type', link: '/Rust/The_Slice_Type' },
            { text: 'Using Structs to Structure Related Data', link: '/Rust/Using_Structs_to_Structure_Related_Data' },
            { text: 'Defining and Instantiating Structs', link: '/Rust/Defining_and_Instantiating_Structs' },
            { text: 'An Example Program Using Structs', link: '/Rust/An_Example_Program_Using_Structs' },
            { text: 'Method Syntax', link: '/Rust/Method_Syntax' },
            { text: 'Enums and Pattern Matching', link: '/Rust/Enums_and_Pattern_Matching' },
            { text: 'Defining an Enum', link: '/Rust/Defining_an_Enum' },
            { text: 'The match Control Flow Construct', link: '/Rust/The_match_Control_Flow_Construct' },
          ]
        },
        {
          text: 'Actix-web',
          collapsible: true,
          collapsed: true, // 默认折叠，因为内容较多
          items: [
            { text: 'Getting Started', link: '/Rust/Actix_web/Basics/Getting_started' },
            { text: 'Application', link: '/Rust/Actix_web/Basics/Application' },
            { text: 'Server', link: '/Rust/Actix_web/Basics/Server' },
            { text: 'Extractors', link: '/Rust/Actix_web/Basics/Extractors' },
            { text: 'Handlers', link: '/Rust/Actix_web/Basics/Handlers' },
            { text: 'Error', link: '/Rust/Actix_web/Advanced/Error' },
            { text: 'URL Dispatch', link: '/Rust/Actix_web/Advanced/URL_Dispatch' },
            { text: 'Requests', link: '/Rust/Actix_web/Advanced/Requests' },
            { text: 'Responses', link: '/Rust/Actix_web/Advanced/Responses' },
            { text: 'Testing', link: '/Rust/Actix_web/Advanced/Testing' },
            { text: 'Middleware', link: '/Rust/Actix_web/Advanced/Middleware' },
            { text: 'Static Files', link: '/Rust/Actix_web/Advanced/Static_Files' },
            { text: 'Websocket', link: '/Rust/Actix_web/Protocols/Websockets' },
            { text: 'HTTP/2 and TLS(HTTPS)', link: '/Rust/Actix_web/Protocols/HTTP_2' },
            { text: 'Auto Reloading', link: '/Rust/Actix_web/Patterns/Auto_Reloading' },
            { text: 'Databases', link: '/Rust/Actix_web/Patterns/Databases' },
            { text: 'Hosting on Shuttle', link: '/Rust/Actix_web/Patterns/Hosting_on_Shuttle' },
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