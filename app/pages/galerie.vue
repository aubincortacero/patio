<script setup lang="ts">
const { gallery, site } = useSite()

useSeoMeta({
  title: 'Galerie — Le Patio, Ax-les-Thermes',
  description: 'La salle, la terrasse, la cuisine et les assiettes du Patio, table pyrénéenne à Ax-les-Thermes.',
})

const root = ref<HTMLElement | null>(null)
const lb = ref<HTMLElement | null>(null)
const current = ref(-1)

const open = (i: number) => {
  current.value = i
}
const close = () => {
  current.value = -1
}
const go = (d: number) => {
  current.value = (current.value + d + gallery.length) % gallery.length
}

watch(current, (v, old) => {
  const { $lenis, $gsap } = useNuxtApp()
  const lenis = $lenis as import('lenis').default
  const gsap = $gsap as typeof import('gsap').gsap
  if (v >= 0 && old < 0) {
    lenis.stop()
    nextTick(() => gsap.fromTo(lb.value, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }))
  } else if (v < 0) {
    lenis.start()
  }
  if (v >= 0) {
    nextTick(() =>
      gsap.fromTo(lb.value!.querySelector('.lb__img'), { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.out' }),
    )
  }
})

const onKey = (e: KeyboardEvent) => {
  if (current.value < 0) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') go(1)
  if (e.key === 'ArrowLeft') go(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (current.value >= 0) (useNuxtApp().$lenis as import('lenis').default).start()
})

useReveal(root, ({ gsap, reduced, root: el }) => {
  if (reduced) return
  gsap.from(el.querySelectorAll('.gh__line > span'), { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.1 })
  el.querySelectorAll<HTMLElement>('.gal__item').forEach((item) => {
    gsap.from(item, {
      y: 80,
      autoAlpha: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: item, start: 'top 95%', once: true },
    })
  })
})
</script>

<template>
  <div ref="root" class="gal">
    <header class="gh wrap">
      <span class="eyebrow">Galerie</span>
      <h1 class="display gh__title">
        <span class="gh__line"><span>Le Patio</span></span>
        <span class="gh__line"><span>en images</span></span>
      </h1>
      <span class="script gh__script">entrez, c'est ouvert</span>
    </header>

    <section class="wrap gal__grid">
      <button
        v-for="(g, i) in gallery"
        :key="g.src"
        class="gal__item frame"
        :class="`gal__item--${i % 6}`"
        :aria-label="`Agrandir : ${g.alt}`"
        @click="open(i)"
      >
        <img :src="g.src" :alt="g.alt" loading="lazy" />
        <span class="gal__cap narrow">{{ g.alt }}</span>
      </button>
    </section>

    <p class="wrap gal__credits narrow">Crédits photos : {{ site.credits }}</p>

    <Teleport to="body">
      <div v-if="current >= 0" ref="lb" class="lb" role="dialog" aria-modal="true" :aria-label="gallery[current]!.alt" @click.self="close">
        <button class="lb__close" aria-label="Fermer" @click="close"><PatioIcon name="close" /></button>
        <button class="lb__nav lb__nav--prev" aria-label="Photo précédente" @click="go(-1)"><PatioIcon name="arrow" /></button>
        <figure class="lb__fig">
          <img :key="current" class="lb__img" :src="gallery[current]!.src" :alt="gallery[current]!.alt" />
          <figcaption class="narrow">
            <span>{{ String(current + 1).padStart(2, '0') }} / {{ gallery.length }}</span>
            {{ gallery[current]!.alt }}
          </figcaption>
        </figure>
        <button class="lb__nav" aria-label="Photo suivante" @click="go(1)"><PatioIcon name="arrow" /></button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.gh {
  position: relative;
  padding-top: calc(var(--header-h) + clamp(3rem, 8vw, 7rem));
  padding-bottom: clamp(3rem, 6vw, 6rem);
}
.gh__title {
  font-size: clamp(5rem, 17vw, 19rem);
  margin-top: 1.5rem;
}
.gh__line {
  display: block;
  overflow: hidden;
  padding-top: 0.05em;
}
.gh__line > span {
  display: block;
}
.gh__script {
  position: absolute;
  right: var(--gutter);
  bottom: clamp(2rem, 5vw, 5rem);
  font-size: clamp(2.6rem, 6vw, 6.5rem);
  color: var(--cobalt);
  transform: rotate(-6deg);
}

.gal__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: clamp(0.6rem, 1.4vw, 1.4rem);
  grid-auto-flow: dense;
}
.gal__item {
  display: block;
  aspect-ratio: 1;
  cursor: zoom-in;
  grid-column: span 2;
}
.gal__item--0 {
  grid-column: span 3;
  grid-row: span 2;
}
.gal__item--3 {
  grid-column: span 3;
}
.gal__item--4 {
  grid-column: span 3;
}
.gal__item img {
  transition: transform 1.2s var(--ease-out), filter 0.6s;
}
.gal__item:hover img {
  transform: scale(1.05);
}
.gal__cap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 2rem 1rem 0.9rem;
  color: var(--cream);
  text-align: left;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(transparent, rgba(10, 11, 69, 0.8));
  transform: translateY(100%);
  transition: transform 0.6s var(--ease-out);
}
.gal__item:hover .gal__cap,
.gal__item:focus-visible .gal__cap {
  transform: none;
}
.gal__credits {
  padding-block: 3rem 6rem;
  opacity: 0.7;
  letter-spacing: 0.06em;
}

.lb {
  position: fixed;
  inset: 0;
  z-index: 9300;
  background: color-mix(in srgb, var(--ink-deep) 96%, transparent);
  color: var(--cream);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}
.lb__fig {
  margin: 0;
  display: grid;
  justify-items: center;
  gap: 1rem;
}
.lb__img {
  max-height: 80svh;
  max-width: 100%;
  object-fit: contain;
}
.lb__fig figcaption {
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.9rem;
}
.lb__fig figcaption span {
  opacity: 0.55;
  margin-right: 1rem;
}
.lb__close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
}
.lb__nav {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--cream) 30%, transparent);
  transition: background 0.3s, color 0.3s;
}
.lb__nav:hover {
  background: var(--cream);
  color: var(--ink);
}
.lb__nav svg,
.lb__close svg {
  width: 26px;
  height: 26px;
}
.lb__nav--prev svg {
  transform: rotate(180deg);
}

@media (max-width: 800px) {
  .gal__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .gal__item,
  .gal__item[class*='gal__item--'] {
    grid-column: span 1;
    grid-row: span 1;
  }
  .gal__item--0 {
    grid-column: span 2 !important;
  }
  .gh__script {
    position: static;
    display: block;
  }
  .lb {
    grid-template-columns: 1fr 1fr;
    padding: 1rem;
  }
  .lb__fig {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  .lb__nav {
    justify-self: center;
  }
}
</style>
