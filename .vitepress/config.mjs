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

    sidebar: [
      {
        text: 'News',
        items: [
          { text: 'Rewa070505', link: '/news/rewa070505' }
        ]
      },
      {
        text: 'Rust',
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
          { text: 'Method Syntax', link: '/Rust/Method_Syntax' }
        ]
      },
      {
        text: 'Actix-web',
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
        text:'Unsafe Rust',
        items:[
          { text: 'Introduction', link: '/Rust/Unsafe Rust/Introduction' },
          { text: 'Meet Safe and Unsafe', link: '/Rust/Unsafe Rust/Meet_Safe_and_Unsafe' },
          { text: 'How Safe and Unsafe Interact', link: '/Rust/Unsafe Rust/How_Safe_and_Unsafe_Interact' },
          { text: 'What Unsafe Rust Can Do', link: '/Rust/Unsafe Rust/What_Unsafe_Rust_Can_Do' },
        ]
      },
      {
        text:'Future',
        items:[
          { text: 'Future', link: '/future/future_rewa_070505' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/KayanoLiam' }
    ]
  }
})
