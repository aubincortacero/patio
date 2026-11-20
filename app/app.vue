<script setup lang="ts">
import type { TransitionProps } from 'vue'

const ready = useRevealReady()
const curtain = ref<HTMLElement | null>(null)

const tools = () => {
  const app = useNuxtApp()
  return {
    gsap: app.$gsap as typeof import('gsap').gsap,
    ScrollTrigger: app.$ScrollTrigger as typeof import('gsap/ScrollTrigger').ScrollTrigger,
    lenis: app.$lenis as import('lenis').default,
    reduced: app.$reducedMotion as boolean,
  }
}

// Transition de page : un rideau bleu monte, la page change, le rideau repart vers le haut.
const transition: TransitionProps = {
  mode: 'out-in',
  css: false,
  onLeave(_el, done) {
    const { gsap, reduced, lenis } = tools()
    ready.value = false
    if (reduced || !curtain.value) return done()
    lenis.stop()
    gsap.set(curtain.value, { visibility: 'visible' })
    gsap.fromTo(
      curtain.value,
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'expo.inOut', onComplete: done },
    )
    gsap.fromTo(curtain.value.querySelector('.curtain__logo'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.35, ease: 'expo.out' })
  },
  onEnter(_el, done) {
    const { gsap, ScrollTrigger, lenis, reduced } = tools()
    const hash = useRoute().hash
    lenis.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    done()
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (reduced || !curtain.value) {
        ready.value = true
        return
      }
      gsap.to(curtain.value, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.9,
        delay: 0.15,
        ease: 'expo.inOut',
        onStart: () => {
          ready.value = true
          lenis.start()
        },
        onComplete: () => {
          gsap.set(curtain.value, { visibility: 'hidden' })
          if (hash) {
            const target = document.querySelector(hash) as HTMLElement | null
            if (target) lenis.scrollTo(target, { offset: -40, duration: 1.4 })
          }
        },
      })
    })
  },
}
</script>

<template>
  <div class="app">
    <SitePreloader />
    <SiteHeader />
    <main>
      <NuxtPage :transition="transition" />
    </main>
    <SiteFooter />
    <div ref="curtain" class="curtain" aria-hidden="true">
      <div class="curtain__logo"><PatioLogo light /></div>
    </div>
  </div>
</template>

<style>
.curtain {
  position: fixed;
  inset: 0;
  z-index: 9400;
  background: var(--ink);
  display: grid;
  place-items: center;
  visibility: hidden;
  clip-path: inset(100% 0 0 0);
  --logo-size: clamp(14px, 1.8vw, 20px);
}
</style>
