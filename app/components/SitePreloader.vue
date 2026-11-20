<script setup lang="ts">
const ready = useRevealReady()
const done = ref(false)
const root = ref<HTMLElement | null>(null)

onMounted(async () => {
  const { $gsap, $lenis, $SplitText, $reducedMotion } = useNuxtApp()
  const gsap = $gsap as typeof import('gsap').gsap
  const lenis = $lenis as import('lenis').default
  const SplitText = $SplitText as typeof import('gsap/SplitText').SplitText

  if ($reducedMotion || !root.value) {
    done.value = true
    ready.value = true
    return
  }

  lenis.stop()
  await document.fonts?.ready
  const el = root.value!
  const letters = el.querySelectorAll('.pl__patio span')
  const tag = el.querySelector('.pl__tag')!
  const le = el.querySelector('.pl__le')!
  const words = SplitText.create(el.querySelector('.pl__base')!, { type: 'words', mask: 'words' })

  gsap.set(el.querySelector('.pl__logo'), { autoAlpha: 1 })

  const tl = gsap.timeline({
    defaults: { ease: 'expo.out' },
    onComplete: () => {
      done.value = true
    },
  })

  tl.from(letters, { yPercent: 110, duration: 1.3, stagger: 0.07 }, 0.15)
    .from(le, { autoAlpha: 0, y: 10, duration: 1 }, 0.55)
    .fromTo(tag, { clipPath: 'inset(-20% 100% -20% 0)' }, { clipPath: 'inset(-20% 0% -20% 0)', duration: 1.6, ease: 'power2.inOut' }, 0.75)
    .from(words.words, { yPercent: 110, duration: 0.9, stagger: 0.05 }, 0.9)
    .to(el.querySelector('.pl__logo'), { yPercent: -18, autoAlpha: 0, duration: 0.8, ease: 'expo.in' }, '+=0.35')
    .to(el.querySelector('.pl__base'), { autoAlpha: 0, duration: 0.4 }, '<')
    .add(() => {
      ready.value = true
      lenis.start()
    }, '-=0.1')
    .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.2')
})
</script>

<template>
  <div v-if="!done" ref="root" class="pl" aria-hidden="true">
    <div class="pl__logo">
      <span class="pl__le script">le</span>
      <span class="pl__patio display"><span>P</span><span>A</span><span>T</span><span>I</span><span>O</span></span>
      <span class="pl__tag script">table pyrénéenne</span>
    </div>
    <p class="pl__base narrow">Ax-les-Thermes — Ariège</p>
  </div>
</template>

<style scoped>
.pl {
  position: fixed;
  inset: 0;
  z-index: 9500;
  background: var(--ink);
  color: var(--cream);
  display: grid;
  place-items: center;
  clip-path: inset(0 0 0% 0);
}
.pl__logo {
  display: grid;
  justify-items: center;
  font-size: clamp(14px, 2.6vw, 28px);
  visibility: hidden;
}
.pl__le {
  font-size: 1.8em;
  margin-bottom: -0.25em;
}
.pl__patio {
  font-size: 5.6em;
  letter-spacing: 0.06em;
  display: flex;
  overflow: hidden;
  line-height: 0.85;
  padding-top: 0.04em;
}
.pl__patio span {
  display: block;
}
.pl__tag {
  font-size: 2em;
  margin-top: -0.05em;
}
.pl__base {
  position: absolute;
  bottom: 2.4rem;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  opacity: 0.7;
}
</style>
