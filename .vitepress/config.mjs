import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "site",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Rust',
        items: [
          { text: 'Install/安装', link: '/Rust/install' },
          { text: 'Hello World', link: '/Rust/helloworld' },
          { text: 'cargo包管理器', link: '/Rust/cargo' }
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
          {text:'HTTP Server initialization',link:'/Rust/Actix_web/Diagrams/HTTP_Server_initialization'},
          {text:'Connection Lifecycle',link:'/Rust/Actix_web/Diagrams/Connection_Lifecycle'},
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
