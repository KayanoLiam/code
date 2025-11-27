<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const titleRef = ref(null)

onMounted(() => {
  // Chaotic Reveal
  const tl = gsap.timeline()
  
  tl.fromTo('.chaos-text', 
    { opacity: 0, scale: 2, rotation: 10 },
    { opacity: 1, scale: 1, rotation: 0, duration: 0.2, stagger: 0.05, ease: 'rough' }
  )
  .to('.chaos-text', {
    x: 'random(-5, 5)',
    y: 'random(-5, 5)',
    duration: 0.1,
    repeat: 10,
    yoyo: true
  })
})
</script>

<template>
  <div class="chaos-hero">
    <div class="noise-bg"></div>
    
    <div class="content-grid">
      <div class="grid-item title-area">
        <h1 class="chaos-title">
          <span class="chaos-text">CODE</span>
          <span class="chaos-text">IS</span>
          <span class="chaos-text highlight">WAR</span>
        </h1>
      </div>
      
      <div class="grid-item info-area">
        <div class="raw-box">
          <div class="label">STATUS:</div>
          <div class="value blink">CRITICAL</div>
        </div>
        <div class="raw-box">
          <div class="label">LOC:</div>
          <div class="value">99999+</div>
        </div>
      </div>

      <div class="grid-item desc-area">
        <p class="manifesto">
          WE BUILD SYSTEMS TO BREAK THEM. <br>
          RUST // PYTHON // WEB <br>
          NO SAFETY. NO MERCY.
        </p>
      </div>
      
      <div class="grid-item action-area">
        <a href="/Rust/Basics/install" class="brutal-btn">
          INITIALIZE_SEQUENCE
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chaos-hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-bottom: var(--nb-border);
  background: #000;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  padding: 20px;
  border: 4px solid var(--vp-c-brand-3); /* Orange Border */
  transform: rotate(-1deg);
}

.grid-item {
  border: var(--nb-border);
  padding: 40px;
  background: #000;
  position: relative;
}

.grid-item::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 100%;
  height: 100%;
  background: var(--vp-c-brand-2);
  z-index: -1;
}

.title-area {
  grid-column: 1 / -1;
  text-align: center;
  border-color: var(--vp-c-brand-1);
}

.chaos-title {
  font-size: 8rem;
  line-height: 0.8;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
}

.chaos-text.highlight {
  color: var(--vp-c-brand-3); /* Orange */
  text-decoration: underline;
}

.info-area {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.raw-box {
  border: 2px solid #fff;
  padding: 10px;
  text-align: center;
}

.label {
  font-size: 0.8rem;
  color: #888;
}

.value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.blink {
  animation: blink 0.5s step-end infinite;
}

.desc-area {
  grid-column: 2 / 3;
  display: flex;
  align-items: center;
}

.manifesto {
  font-family: var(--vp-font-family-mono);
  font-size: 1.5rem;
  line-height: 1.4;
  color: #fff;
}

.action-area {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: 60px;
  border-color: var(--vp-c-brand-3);
}

.brutal-btn {
  font-size: 2rem;
  font-weight: 900;
  background: var(--vp-c-brand-1);
  color: #000;
  padding: 20px 60px;
  text-decoration: none;
  border: 4px solid #000;
  box-shadow: 10px 10px 0px var(--vp-c-brand-2);
  transition: all 0.1s;
}

.brutal-btn:hover {
  transform: translate(-5px, -5px);
  box-shadow: 15px 15px 0px var(--vp-c-brand-3);
  background: #fff;
}

.brutal-btn:active {
  transform: translate(5px, 5px);
  box-shadow: 0 0 0;
}

@keyframes blink {
  50% { opacity: 0; }
}

@media (max-width: 768px) {
  .chaos-title { font-size: 4rem; }
  .content-grid { grid-template-columns: 1fr; transform: none; }
  .desc-area { grid-column: 1 / -1; }
}
</style>
