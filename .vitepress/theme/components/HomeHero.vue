<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const titleRef = ref(null)
const descRef = ref(null)

onMounted(() => {
  // Glitch reveal effect
  const tl = gsap.timeline()
  
  tl.fromTo('.glitch-text', 
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.1, stagger: 0.05, ease: 'steps(3)' }
  )
  .to('.glitch-text', {
    x: 5, duration: 0.05, yoyo: true, repeat: 5
  })
  .fromTo(descRef.value,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.5, ease: 'power1.out' }
  )
})
</script>

<template>
  <div class="home-hero">
    <div class="content">
      <div class="glitch-wrapper" ref="titleRef">
        <h1 class="title glitch-text" data-text="CRAFTING">CRAFTING</h1>
        <h1 class="title glitch-text" data-text="DIGITAL">DIGITAL</h1>
        <h1 class="title glitch-text highlight" data-text="CHAOS">CHAOS</h1>
      </div>
      
      <div class="desc-box" ref="descRef">
        <p class="description">
          // RUST_ <br>
          // PYTHON_ <br>
          // WEB_DEV_ <br>
          > ELEVATING CODE TO ART FORM_
        </p>
      </div>
      
      <div class="actions">
        <a href="/Rust/Basics/install" class="action-btn primary">
          [ START_LEARNING ]
        </a>
        <a href="https://github.com/KayanoLiam" target="_blank" class="action-btn secondary">
          [ GITHUB_REPO ]
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-bottom: var(--nb-border);
}

.content {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.title {
  font-family: var(--vp-font-family-base);
  font-size: 6rem;
  font-weight: 900;
  line-height: 0.9;
  margin: 0;
  text-transform: uppercase;
  color: #fff;
  position: relative;
}

.title.highlight {
  color: var(--vp-c-brand-1);
  text-shadow: 4px 4px 0px var(--vp-c-brand-2);
}

/* Glitch Effect */
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--vp-c-bg);
}

.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 #ff00c1;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 #00fff9;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

.desc-box {
  border: var(--nb-border);
  padding: 20px;
  background: #000;
  box-shadow: var(--nb-shadow);
  max-width: 500px;
}

.description {
  font-family: var(--vp-font-family-mono);
  font-size: 1.2rem;
  color: var(--vp-c-brand-1);
  margin: 0;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.action-btn {
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  font-size: 1.2rem;
  text-decoration: none;
  padding: 15px 30px;
  border: 2px solid var(--vp-c-brand-1);
  text-transform: uppercase;
  transition: all 0.1s;
}

.action-btn.primary {
  background: var(--vp-c-brand-1);
  color: #000;
  box-shadow: var(--nb-shadow);
}

.action-btn.primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--nb-shadow-hover);
}

.action-btn.secondary {
  background: transparent;
  color: var(--vp-c-brand-1);
}

.action-btn.secondary:hover {
  background: var(--vp-c-brand-1);
  color: #000;
}

@keyframes glitch-anim {
  0% { clip: rect(30px, 9999px, 10px, 0); }
  20% { clip: rect(80px, 9999px, 90px, 0); }
  40% { clip: rect(10px, 9999px, 50px, 0); }
  60% { clip: rect(40px, 9999px, 20px, 0); }
  80% { clip: rect(70px, 9999px, 60px, 0); }
  100% { clip: rect(20px, 9999px, 80px, 0); }
}

@keyframes glitch-anim2 {
  0% { clip: rect(10px, 9999px, 80px, 0); }
  20% { clip: rect(60px, 9999px, 10px, 0); }
  40% { clip: rect(30px, 9999px, 50px, 0); }
  60% { clip: rect(90px, 9999px, 20px, 0); }
  80% { clip: rect(20px, 9999px, 70px, 0); }
  100% { clip: rect(50px, 9999px, 30px, 0); }
}

@media (max-width: 768px) {
  .title { font-size: 3rem; }
  .actions { flex-direction: column; }
}
</style>
