import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HomeHero from './components/HomeHero.vue'
import './custom.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/600.css'
import '@fontsource/outfit/700.css'

export default {
    ...DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('HomeHero', HomeHero)
    }
}
