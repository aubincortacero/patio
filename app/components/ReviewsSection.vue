<script setup lang="ts">
import type { ReviewsPayload, PatioReview } from '~~/server/api/reviews.get'

const { data } = await useFetch<ReviewsPayload>('/api/reviews', {
  key: 'reviews',
  default: () => ({ source: 'fallback', rating: 4.8, count: 430, url: '', reviews: [] }) as ReviewsPayload,
})

const root = ref<HTMLElement | null>(null)
const quoteEl = ref<HTMLElement | null>(null)
const metaEl = ref<HTMLElement | null>(null)
const progress = ref<HTMLElement | null>(null)

const rating = computed(() => data.value?.rating ?? 4.8)
const count = computed(() => data.value?.count ?? 430)
const fmt = (n: number, d = 1) => n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d })
const gUrl = computed(() => data.value?.url || 'https://www.google.com/maps/search/?api=1&query=Restaurant+Le+Patio+Ax-les-Thermes')

/**
 * En développement, sans clé Google, des avis d'APERÇU clairement identifiés
 * permettent de valider la mise en page. Ils ne sont jamais rendus en production.
 */
const isPreview = computed(() => import.meta.dev && !data.value?.reviews?.length)
const PREVIEW: PatioReview[] = Array.from({ length: 5 }, (_, i) => ({
  author: `Aperçu ${i + 1}`,
  rating: 5,
  text:
    i % 2
      ? "Texte d'aperçu, plus court, pour juger de la mise en page avec un avis bref."
      : "Texte d'aperçu — le flux Google n'est pas encore connecté. Ajoutez NUXT_GOOGLE_PLACES_KEY dans le fichier .env et les vrais avis du Patio s'afficheront ici, un par un, avec le nom de leur auteur.",
  when: 'dev uniquement',
}))
const reviews = computed<PatioReview[]>(() => (data.value?.reviews?.length ? data.value.reviews : isPreview.value ? PREVIEW : []))
const n = computed(() => reviews.value.length)
const index = ref(0)
const current = computed(() => reviews.value[index.value])
const clip = (t: string) => {
  const flat = t.replace(/\s*\n+\s*/g, ' ')
  return flat.length > 620 ? flat.slice(0, 620).replace(/\s+\S*$/, '') + '…' : flat
}
const isLong = computed(() => (current.value?.text.length ?? 0) > 300)

/* ---------------- Changement d'avis ---------------- */
type Gsap = typeof import('gsap').gsap
type Split = InstanceType<typeof import('gsap/SplitText').SplitText>
let split: Split | undefined
let busy = false
let autoplay: gsap.core.Tween | undefined
const paused = ref(false)

const tools = () => {
  const app = useNuxtApp()
  return {
    gsap: app.$gsap as Gsap,
    SplitText: app.$SplitText as typeof import('gsap/SplitText').SplitText,
    reduced: app.$reducedMotion as boolean,
  }
}

const splitIn = () => {
  const { gsap, SplitText, reduced } = tools()
  if (!quoteEl.value) return
  split?.revert()
  if (reduced) return
  split = SplitText.create(quoteEl.value, { type: 'lines', mask: 'lines' })
  gsap.from(split.lines, { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.07 })
  gsap.fromTo(metaEl.value, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, delay: 0.35 })
}

const go = (dir: 1 | -1 | number, absolute = false) => {
  if (busy || n.value < 2) return
  const next = absolute ? dir : (index.value + dir + n.value) % n.value
  if (next === index.value) return
  const { gsap, reduced } = tools()
  autoplay?.kill()
  if (reduced || !split) {
    index.value = next
    nextTick(startAutoplay)
    return
  }
  busy = true
  gsap.to(metaEl.value, { autoAlpha: 0, duration: 0.3 })
  gsap.to(split.lines, {
    yPercent: -105,
    duration: 0.55,
    ease: 'expo.in',
    stagger: 0.04,
    onComplete: () => {
      index.value = next
      nextTick(() => {
        splitIn()
        busy = false
        startAutoplay()
      })
    },
  })
}

const startAutoplay = () => {
  const { gsap, reduced } = tools()
  if (reduced || !progress.value || n.value < 2) return
  autoplay?.kill()
  autoplay = gsap.fromTo(progress.value, { scaleX: 0 }, { scaleX: 1, duration: 9, ease: 'none', onComplete: () => go(1) })
  if (paused.value) autoplay.pause()
}
watch(paused, (p) => (p ? autoplay?.pause() : autoplay?.resume()))

// Glisser au doigt (mobile)
let x0 = 0
const onDown = (e: PointerEvent) => (x0 = e.clientX)
const onUp = (e: PointerEvent) => {
  const dx = e.clientX - x0
  if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1)
}

onBeforeUnmount(() => {
  autoplay?.kill()
  split?.revert()
})

useReveal(root, ({ gsap, ScrollTrigger, root: el }) => {
  el.querySelectorAll<HTMLElement>('[data-count]').forEach((node) => {
    const target = Number(node.dataset.count)
    const dec = Number(node.dataset.dec || 0)
    const o = { v: 0 }
    gsap.to(o, {
      v: target,
      duration: 2,
      ease: 'expo.out',
      scrollTrigger: { trigger: node, start: 'top 85%', once: true },
      onUpdate: () => (node.textContent = fmt(o.v, dec)),
    })
  })
  if (quoteEl.value) {
    gsap.set(quoteEl.value, { autoAlpha: 0 })
    ScrollTrigger.create({
      trigger: quoteEl.value,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.set(quoteEl.value, { autoAlpha: 1 })
        splitIn()
        startAutoplay()
      },
    })
  }
})
</script>

<template>
  <section ref="root" class="rv">
    <div class="wrap rv__grid">
      <!-- Colonne gauche : titre & note -->
      <aside class="rv__side">
        <span class="eyebrow" data-fade>Ils en parlent</span>
        <h2 class="display rv__title" data-split-chars>Vos avis</h2>
        <div class="rv__note" data-fade>
          <span class="display" :data-count="rating" data-dec="1">{{ fmt(rating) }}</span>
          <div>
            <div class="rv__stars" :aria-label="`Note de ${fmt(rating)} sur 5`">
              <PatioIcon v-for="i in 5" :key="i" name="star" />
            </div>
            <p class="narrow"><span :data-count="count">{{ count }}</span>&nbsp;avis sur Google</p>
          </div>
        </div>
        <div class="rv__links narrow" data-fade>
          <a :href="gUrl" target="_blank" rel="noopener" class="link-line">Lire tous les avis ↗</a>
          <a :href="gUrl" target="_blank" rel="noopener" class="link-line">Laisser un avis ↗</a>
        </div>
      </aside>

      <!-- Un avis à la fois -->
      <div
        v-if="current"
        class="rv__stage"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
        @pointerdown="onDown"
        @pointerup="onUp"
      >
        <span class="rv__mark display" aria-hidden="true">“</span>
        <span v-if="isPreview" class="rv__preview narrow">Aperçu dev — flux Google non connecté</span>

        <figure class="rv__fig" aria-live="polite">
          <blockquote ref="quoteEl" :key="index" class="rv__quote narrow" :class="{ 'is-long': isLong }">{{ clip(current.text) }}</blockquote>
          <figcaption ref="metaEl" class="rv__meta">
            <span class="rv__dash" />
            <span class="rv__author">
              <a v-if="current.authorUrl" :href="current.authorUrl" target="_blank" rel="noopener nofollow">{{ current.author }}</a>
              <template v-else>{{ current.author }}</template>
            </span>
            <span class="rv__when narrow">
              <span class="rv__mini-stars"><PatioIcon v-for="s in current.rating" :key="s" name="star" /></span>
              <template v-if="current.when">{{ current.when }} · Google</template>
            </span>
          </figcaption>
        </figure>

        <nav class="rv__nav narrow" aria-label="Navigation des avis">
          <span class="rv__count">
            <b class="display">{{ String(index + 1).padStart(2, '0') }}</b>
            <span>/ {{ String(n).padStart(2, '0') }}</span>
          </span>
          <span class="rv__bar"><span ref="progress" /></span>
          <button class="link-line" @click="go(-1)">Précédent</button>
          <button class="link-line" @click="go(1)">Suivant</button>
        </nav>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rv {
  background: var(--stone);
  padding-block: clamp(5rem, 10vw, 9rem);
  overflow: hidden;
}
.rv__grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.8fr) 2fr;
  gap: clamp(3rem, 7vw, 8rem);
  align-items: start;
}

/* ----- côté ----- */
.rv__title {
  font-size: clamp(3.2rem, 6vw, 6rem);
  margin: 1rem 0 2.4rem;
}
.rv__note {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding-block: 1.4rem;
  border-block: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
}
.rv__note > .display {
  font-size: clamp(4rem, 6vw, 5.5rem);
  line-height: 0.8;
}
.rv__note p {
  margin: 0.45rem 0 0;
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.rv__stars {
  display: flex;
  gap: 2px;
  color: var(--ochre);
}
.rv__stars svg {
  width: 18px;
  height: 18px;
}
.rv__links {
  display: grid;
  justify-items: start;
  gap: 0.6rem;
  margin-top: 1.6rem;
  font-size: 0.9rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 500;
}

/* ----- scène ----- */
.rv__stage {
  position: relative;
  padding-top: clamp(3rem, 6vw, 5rem);
  touch-action: pan-y;
}
.rv__mark {
  position: absolute;
  top: -0.18em;
  left: -0.08em;
  font-size: clamp(14rem, 24vw, 22rem);
  line-height: 1;
  color: var(--ink);
  opacity: 0.07;
  pointer-events: none;
}
.rv__preview {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: var(--ochre);
  padding: 0.3em 0.7em;
}
.rv__fig {
  position: relative;
  margin: 0;
  min-height: clamp(260px, 24vw, 340px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2.4rem;
}
.rv__quote {
  margin: 0;
  font-size: clamp(1.7rem, 1.1rem + 1.9vw, 3.1rem);
  line-height: 1.14;
  font-weight: 400;
  letter-spacing: -0.005em;
  text-wrap: pretty;
  max-width: 24em;
}
.rv__quote.is-long {
  font-size: clamp(1.35rem, 0.95rem + 1.2vw, 2.1rem);
  line-height: 1.22;
  max-width: 34em;
}
.rv__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem 1.1rem;
}
.rv__dash {
  width: 3rem;
  height: 1px;
  background: currentColor;
}
.rv__author {
  font-family: var(--f-display);
  font-size: 1.7rem;
  letter-spacing: 0.03em;
  line-height: 1;
  padding-top: 0.1em;
}
.rv__when {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.65;
}
.rv__mini-stars {
  display: inline-flex;
  gap: 1px;
  color: var(--ochre);
}
.rv__mini-stars svg {
  width: 12px;
  height: 12px;
}

/* ----- navigation ----- */
.rv__nav {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 2rem;
  margin-top: clamp(2.5rem, 5vw, 4rem);
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 500;
}
.rv__nav button {
  text-transform: inherit;
  letter-spacing: inherit;
  font-weight: inherit;
}
.rv__count {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
}
.rv__count b {
  font-weight: 400;
  font-size: 1.9rem;
  letter-spacing: 0.02em;
  line-height: 1;
}
.rv__count span {
  opacity: 0.5;
}
.rv__bar {
  position: relative;
  height: 1px;
  background: color-mix(in srgb, var(--ink) 18%, transparent);
}
.rv__bar span {
  position: absolute;
  inset: 0;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left;
}

@media (max-width: 960px) {
  .rv__grid {
    grid-template-columns: 1fr;
  }
  .rv__nav {
    gap: 1.2rem;
  }
}
</style>
