import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/**
 * Lenis (smooth scroll) piloté par le ticker GSAP, pour que ScrollTrigger
 * et le scroll soient parfaitement synchronisés.
 */
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const lenis = new Lenis({
    lerp: reduced ? 1 : 0.09,
    smoothWheel: !reduced,
    wheelMultiplier: 1,
    autoRaf: false,
    anchors: true,
  })

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // Ancre sur la même page (ex. « Le lieu » depuis l'accueil) : scroll fluide.
  useRouter().afterEach((to, from) => {
    if (to.path === from.path && to.hash) {
      const target = document.querySelector<HTMLElement>(to.hash)
      if (target) lenis.scrollTo(target, { offset: -40, duration: 1.4 })
    }
  })

  // Les fonts changent la hauteur des blocs : on recalcule une fois chargées.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())

  return {
    provide: { lenis, gsap, ScrollTrigger, SplitText, reducedMotion: reduced },
  }
})
