<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  text: {
    type: String,
    default: 'SYSTEM_READY // RUST_CORE // PYTHON_SCRIPT // DEPLOY_NOW //'
  },
  direction: {
    type: String,
    default: 'left'
  },
  speed: {
    type: Number,
    default: 20
  }
})

const container = ref(null)
const inner = ref(null)

onMounted(() => {
  const width = inner.value.offsetWidth
  const duration = width / props.speed

  gsap.to(inner.value, {
    x: props.direction === 'left' ? -width / 2 : width / 2,
    duration: duration,
    ease: 'none',
    repeat: -1
  })
})
</script>

<template>
  <div class="marquee-container" ref="container">
    <div class="marquee-inner" ref="inner">
      <span class="marquee-text">{{ text }}</span>
      <span class="marquee-text">{{ text }}</span>
      <span class="marquee-text">{{ text }}</span>
      <span class="marquee-text">{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  width: 100%;
  overflow: hidden;
  background: var(--vp-c-brand-1);
  border-top: 4px solid #000;
  border-bottom: 4px solid #000;
  padding: 8px 0;
  white-space: nowrap;
  position: relative;
  z-index: 50;
}

.marquee-inner {
  display: inline-block;
}

.marquee-text {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 800;
  font-size: 1.2rem;
  color: #000;
  margin-right: 2rem;
  text-transform: uppercase;
}
</style>
