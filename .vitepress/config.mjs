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
      // {
      //   text:'Python',
      //   items:[
      //     {text:'Install/安装'}
      //   ]
      // }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
