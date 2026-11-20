<script setup lang="ts">
// Barre de progression du scroll, en haut de l'écran (remplace la scrollbar native).
const bar = ref<HTMLElement | null>(null)
let off: (() => void) | undefined

onMounted(() => {
  const lenis = useNuxtApp().$lenis as import('lenis').default
  const update = () => {
    if (bar.value) bar.value.style.transform = `scaleX(${lenis.progress || 0})`
  }
  lenis.on('scroll', update)
  window.addEventListener('resize', update)
  update()
  off = () => {
    lenis.off('scroll', update)
    window.removeEventListener('resize', update)
  }
})
onBeforeUnmount(() => off?.())
</script>

<template>
  <div class="sp" aria-hidden="true"><span ref="bar" class="sp__bar" /></div>
</template>

<style scoped>
.sp {
  position: fixed;
  inset: 0 0 auto;
  height: 3px;
  z-index: 9600;
  pointer-events: none;
}
.sp__bar {
  display: block;
  height: 100%;
  background: var(--cobalt);
  transform: scaleX(0);
  transform-origin: left;
}
</style>
