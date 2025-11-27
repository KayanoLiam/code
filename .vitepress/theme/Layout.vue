<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import HomeHero from './components/HomeHero.vue'
import Marquee from './components/Marquee.vue'

const { Layout } = DefaultTheme

let lenis

onMounted(() => {
  // Initialize Lenis for smooth scrolling
  lenis = new Lenis({
    duration: 1.2,
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
    <div class="crt-overlay"></div>
    <div class="background-layer"></div>
    
    <div class="top-marquee">
      <Marquee text="WARNING: EXTREME_DESIGN_MODE_ACTIVATED // SYSTEM_UNSTABLE //" :speed="50" />
    </div>

    <Layout>
      <template #home-hero-before>
        <HomeHero />
      </template>
    </Layout>
  </div>
</template>

<style scoped>
.theme-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.top-marquee {
  position: sticky;
  top: 0;
  z-index: 100;
}

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  /* Cyber Grid Pattern - EXTREME */
  background-color: #000;
  background-image: 
    linear-gradient(rgba(204, 255, 0, 0.15) 2px, transparent 2px),
    linear-gradient(90deg, rgba(204, 255, 0, 0.15) 2px, transparent 2px);
  background-size: 60px 60px;
  pointer-events: none;
}

/* Add a vignette to focus center */
.background-layer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, #000 90%);
}
</style>

