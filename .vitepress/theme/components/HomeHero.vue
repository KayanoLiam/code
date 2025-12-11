<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'

onMounted(() => {
  // Ink Reveal
  const tl = gsap.timeline()
  
  tl.fromTo('.inkan', 
    { opacity: 0, scale: 1.5, rotate: 10 },
    { opacity: 1, scale: 1, rotate: -5, duration: 1, ease: 'elastic.out(1, 0.5)' }
  )
  .fromTo('.tategaki-title',
    { opacity: 0, y: -20 },
    { opacity: 1, y: 0, duration: 2, ease: 'power2.out', stagger: 0.2 },
    "-=0.5"
  )
  .fromTo('.action-area',
    { opacity: 0 },
    { opacity: 1, duration: 1.5 },
    "-=1"
  )
})
</script>

<template>
  <div class="jap-hero">
    <div class="hero-container">
      
      <!-- The Seal (Inkan) -->
      <div class="seal-area">
        <div class="inkan">
          茅野
        </div>
      </div>

      <!-- Vertical Text Area -->
      <div class="text-area">
        <h1 class="tategaki-title">
          <span>茅</span><span>野</span><span>の</span><span>コ</span><span>ー</span><span>ド</span>
        </h1>
        <p class="tategaki-subtitle">
          無常 ・ 不完全 ・ 簡素
        </p>
      </div>

      <!-- Action (Horizontal is better for buttons usually, but let's keep it minimal) -->
      <div class="action-area">
        <a href="/Rust/Basics/install" class="enter-link">
          入室する
        </a>
      </div>

    </div>
  </div>
</template>

<style scoped>
.jap-hero {
  min-height: 85vh; /* Tall canvas */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 600px; /* Canvas area */
  display: flex;
  flex-direction: row-reverse; /* Japanese read right-to-left conventionally in vertical */
  justify-content: center;
  align-items: flex-start;
  gap: 60px;
}

.seal-area {
  position: absolute;
  top: 0;
  right: 10%;
  z-index: 10;
}

.text-area {
  display: flex;
  flex-direction: row-reverse;
  gap: 40px;
  height: 100%;
  align-items: flex-start;
  padding-top: 80px;
}

.tategaki-title {
  writing-mode: vertical-rl;
  font-family: var(--vp-font-family-headings);
  font-size: 5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: 0.2em;
  line-height: 1.5;
  height: 400px; /* Ensure enough height for vertical flow */
}

.tategaki-title span {
  display: inline-block; /* Allows individual animation if needed */
}

.tategaki-subtitle {
  writing-mode: vertical-rl;
  font-family: var(--vp-font-family-base);
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  letter-spacing: 0.3em;
  line-height: 2;
  height: 300px;
  border-left: 1px solid var(--vp-c-divider); /* A guide line */
  padding-left: 20px;
}

.action-area {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
}

.enter-link {
  font-family: var(--vp-font-family-headings);
  font-size: 1.1rem;
  color: var(--jap-red);
  text-decoration: none;
  border: 1px solid var(--jap-red);
  padding: 12px 36px;
  border-radius: 4px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.5);
}

.enter-link:hover {
  background-color: var(--jap-red);
  color: #fff;
}

@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
  }

  .text-area {
    flex-direction: column; /* Back to horizontal stacking for mobile if vertical is too tall? 
                             Actually, let's keep vertical but smaller */
    flex-direction: row-reverse; 
    height: auto;
    padding-top: 0;
  }

  .tategaki-title {
    font-size: 3rem;
    height: auto;
  }

  .tategaki-subtitle {
    height: auto;
    border-left: none;
    border-top: 1px solid var(--vp-c-divider);
    padding-left: 0;
    padding-top: 20px;
  }

  .seal-area {
    position: relative;
    right: auto;
    top: auto;
    margin-bottom: 20px;
  }
  
  .action-area {
      position: relative;
      bottom: auto;
      left: auto;
      transform: none;
      margin-top: 40px;
  }
}
</style>
