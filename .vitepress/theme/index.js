import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HomeHero from './components/HomeHero.vue'
import './custom.css'
// @fontsource/outfit imports removed for Wabi-sabi theme (using Google Fonts in custom.css)

export default {
    ...DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('HomeHero', HomeHero)
    }
}
