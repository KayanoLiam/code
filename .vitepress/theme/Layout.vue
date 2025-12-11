<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import HomeHero from './components/HomeHero.vue'

const { Layout } = DefaultTheme

let lenis

onMounted(() => {
  // Initialize Lenis for smooth scrolling (Zen mode)
  lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
})

onUnmounted(() => {
  if (lenis) {
    lenis.destroy()
  }
})
</script>

<template>
  <div class="theme-container">
    <Layout>
      <template #home-hero-before>
        <HomeHero />
      </template>
    </Layout>
  </div>
</template>

<style scoped>
.theme-container {
  width: 100%;
  min-height: 100vh;
  /* Wabi-sabi background handled in global CSS, but we can add a subtle texture here if needed */
}
</style>
