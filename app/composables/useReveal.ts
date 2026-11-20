import type { Ref } from 'vue'

type Tools = {
  gsap: typeof import('gsap').gsap
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
  SplitText: typeof import('gsap/SplitText').SplitText
  reduced: boolean
  root: HTMLElement
}

/**
 * Le "ready" passe à true quand le préloader ou le rideau de transition
 * a fini de couvrir l'écran : on ne lance les animations qu'à ce moment-là.
 */
export const useRevealReady = () => useState('reveal-ready', () => false)

const waitReady = (ready: Ref<boolean>) =>
  new Promise<void>((resolve) => {
    if (ready.value) return resolve()
    const stop = watch(ready, (v) => {
      if (v) {
        stop()
        resolve()
      }
    })
  })

/**
 * Animations déclaratives au scroll, via data-attributes :
 *  - data-split         : titres/paragraphes révélés ligne par ligne
 *  - data-split-chars   : gros titres révélés lettre par lettre
 *  - data-fade          : apparition douce
 *  - data-stagger       : enfants apparaissent en cascade
 *  - data-reveal-img    : image dévoilée en rideau
 *  - data-parallax-img  : image en parallaxe dans son cadre
 *  - data-speed="0.2"   : élément en parallaxe
 *  - data-words-scrub   : texte qui s'allume mot à mot au scroll
 */
export function useReveal(root: Ref<HTMLElement | null>, extra?: (t: Tools) => void) {
  let ctx: gsap.Context | undefined
  let alive = true
  const ready = useRevealReady()

  onMounted(async () => {
    root.value?.setAttribute('data-reveal-scope', '')
    const { $gsap, $ScrollTrigger, $SplitText, $reducedMotion } = useNuxtApp()
    const gsap = $gsap as Tools['gsap']
    const ScrollTrigger = $ScrollTrigger as Tools['ScrollTrigger']
    const SplitText = $SplitText as Tools['SplitText']
    const reduced = $reducedMotion as boolean

    await document.fonts?.ready
    if (!alive || !root.value) return

    const el = root.value
    // Pose les états initiaux tout de suite (évite le flash), puis attend le rideau.
    // Un composant enfant qui a son propre useReveal gère ses éléments lui-même.
    const q = (s: string) =>
      Array.from(el.querySelectorAll<HTMLElement>(s)).filter((n) => n.parentElement?.closest('[data-reveal-scope]') === el)
    if (!reduced) {
      gsap.set(q('[data-fade]'), { autoAlpha: 0, y: 40 })
      gsap.set(q('[data-stagger] > *'), { autoAlpha: 0, y: 36 })
      gsap.set(q('[data-reveal-img]'), { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set(q('[data-split], [data-split-chars]'), { autoAlpha: 0 })
    }

    await waitReady(ready)
    if (!alive) return

    ctx = gsap.context(() => {
      const tools: Tools = { gsap, ScrollTrigger, SplitText, reduced, root: el }

      if (reduced) {
        gsap.set(q('[data-split], [data-split-chars]'), { autoAlpha: 1 })
        extra?.(tools)
        return
      }

      q('[data-split]').forEach((node) => {
        gsap.set(node, { autoAlpha: 1 })
        SplitText.create(node, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line-inner',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.08,
              delay: Number(node.dataset.delay || 0),
              scrollTrigger: { trigger: node, start: 'top 88%', once: true },
            }),
        })
      })

      q('[data-split-chars]').forEach((node) => {
        gsap.set(node, { autoAlpha: 1 })
        SplitText.create(node, {
          type: 'chars',
          mask: 'chars',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 105,
              duration: 1.2,
              ease: 'expo.out',
              stagger: 0.035,
              delay: Number(node.dataset.delay || 0),
              scrollTrigger: { trigger: node, start: 'top 90%', once: true },
            }),
        })
      })

      q('[data-fade]').forEach((node) => {
        gsap.to(node, {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: 'expo.out',
          delay: Number(node.dataset.delay || 0),
          scrollTrigger: { trigger: node, start: 'top 90%', once: true },
        })
      })

      q('[data-stagger]').forEach((node) => {
        gsap.to(node.children, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        })
      })

      q('[data-reveal-img]').forEach((node) => {
        const img = node.querySelector('img')
        const tl = gsap.timeline({ scrollTrigger: { trigger: node, start: 'top 85%', once: true } })
        tl.to(node, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
        if (img) tl.from(img, { scale: 1.3, duration: 1.8, ease: 'expo.out' }, 0.15)
      })

      q('[data-parallax-img]').forEach((node) => {
        const img = node.querySelector('img')
        if (!img) return
        gsap.fromTo(
          img,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      q('[data-speed]').forEach((node) => {
        const s = Number(node.dataset.speed || 0.1)
        gsap.to(node, {
          y: () => -s * window.innerHeight,
          ease: 'none',
          scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
        })
      })

      q('[data-words-scrub]').forEach((node) => {
        const split = SplitText.create(node, { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.1 },
          {
            opacity: 1,
            stagger: 0.12,
            ease: 'power1.out',
            scrollTrigger: { trigger: node, start: 'top 90%', end: 'bottom 72%', scrub: 0.8 },
          },
        )
      })

      extra?.(tools)
    }, el)

    // Les pins (créés dans extra) doivent être calculés avant les déclencheurs situés plus bas,
    // sinon ces derniers ignorent l'espace ajouté par les pins et se déclenchent trop tôt.
    ScrollTrigger.sort()
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  onBeforeUnmount(() => {
    alive = false
    ctx?.revert()
  })
}
