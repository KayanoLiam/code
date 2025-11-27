<script setup>
import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'
import Lenis from 'lenis'
import gsap from 'gsap'
import HomeHero from './components/HomeHero.vue'

const { Layout } = DefaultTheme
const route = useRoute()

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

  // Integrate Lenis with GSAP ScrollTrigger if needed later
  // gsap.ticker.add((time) => {
  //   lenis.raf(time * 1000)
  // })
  
  // Page transition effect
  const el = document.querySelector('.VPContent')
  if (el) {
    gsap.fromTo(el, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }
})

onUnmounted(() => {
  if (lenis) {
    lenis.destroy()
  }
})

// Trigger animations on route change
watch(
  () => route.path,
  () => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    
    nextTick(() => {
      const el = document.querySelector('.VPContent')
      if (el) {
        gsap.fromTo(el, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
        )
      }
    })
  }
)
</script>

<template>
  <div class="theme-container">
    <div class="background-layer"></div>
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

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  /* Cyber Grid Pattern */
  background-color: #000;
  background-image: 
    linear-gradient(rgba(204, 255, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(204, 255, 0, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
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
