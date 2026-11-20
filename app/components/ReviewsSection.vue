<script setup lang="ts">
import type { ReviewsPayload } from '~~/server/api/reviews.get'

const { data } = await useFetch<ReviewsPayload>('/api/reviews', {
  key: 'reviews',
  default: () => ({ source: 'fallback', rating: 4.8, count: 430, url: '', reviews: [] }) as ReviewsPayload,
})

const root = ref<HTMLElement | null>(null)
const rating = computed(() => data.value?.rating ?? 4.8)
const count = computed(() => data.value?.count ?? 430)
const reviews = computed(() => data.value?.reviews ?? [])
const fmt = (n: number, d = 1) => n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d })

const writeUrl = computed(() => data.value?.url || 'https://www.google.com/maps/search/?api=1&query=Restaurant+Le+Patio+Ax-les-Thermes')

useReveal(root, ({ gsap, root: el }) => {
  // Compteurs qui montent
  el.querySelectorAll<HTMLElement>('[data-count]').forEach((n) => {
    const target = Number(n.dataset.count)
    const dec = Number(n.dataset.dec || 0)
    const o = { v: 0 }
    gsap.to(o, {
      v: target,
      duration: 2.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: n, start: 'top 85%', once: true },
      onUpdate: () => (n.textContent = fmt(o.v, dec)),
    })
  })
  // Étoiles
  gsap.from(el.querySelectorAll('.rv__stars svg'), {
    scale: 0,
    rotate: -90,
    duration: 0.9,
    ease: 'back.out(2)',
    stagger: 0.08,
    scrollTrigger: { trigger: el.querySelector('.rv__stars'), start: 'top 85%', once: true },
  })
})
</script>

<template>
  <section ref="root" class="rv section">
    <div class="wrap">
      <div class="rv__head">
        <span class="eyebrow" data-fade>Ils en parlent</span>
        <h2 class="display h-lg" data-split-chars>Vos avis</h2>
        <span class="script rv__script" data-fade data-delay="0.4">merci à vous !</span>
      </div>

      <div class="rv__grid">
        <div class="rv__score">
          <div class="rv__note">
            <span class="display" :data-count="rating" data-dec="1">{{ fmt(rating) }}</span>
            <span class="rv__on narrow">/5</span>
          </div>
          <div class="rv__stars" :aria-label="`Note de ${fmt(rating)} sur 5`">
            <PatioIcon v-for="i in 5" :key="i" name="star" />
          </div>
          <p class="rv__count narrow">
            <span :data-count="count">{{ count }}</span> avis sur
            <PatioIcon name="google" class="rv__g" /> Google
          </p>
          <div class="rv__ctas">
            <a :href="writeUrl" target="_blank" rel="noopener" class="btn">
              Lire tous les avis <PatioIcon name="arrow-up-right" />
            </a>
            <a :href="writeUrl" target="_blank" rel="noopener" class="btn btn--ghost">Laisser un avis</a>
          </div>
        </div>

        <div v-if="reviews.length" class="rv__list" data-stagger>
          <figure v-for="r in reviews.slice(0, 4)" :key="r.author + r.publishedAt" class="rv__card">
            <div class="rv__card-stars">
              <PatioIcon v-for="i in r.rating" :key="i" name="star" />
            </div>
            <blockquote>« {{ r.text.length > 320 ? r.text.slice(0, 320).trim() + '…' : r.text }} »</blockquote>
            <figcaption>
              <img v-if="r.avatar" :src="r.avatar" alt="" width="36" height="36" referrerpolicy="no-referrer" loading="lazy" />
              <span>
                <a v-if="r.authorUrl" :href="r.authorUrl" target="_blank" rel="noopener nofollow">{{ r.author }}</a>
                <template v-else>{{ r.author }}</template>
                <small>{{ r.when }} · Google</small>
              </span>
            </figcaption>
          </figure>
        </div>

        <div v-else class="rv__empty" data-fade>
          <p class="lead">
            Une table qu'on recommande. Merci aux <strong>{{ count }}</strong> convives qui ont pris le temps de partager
            leur passage au Patio.
          </p>
          <span class="script">et à vous, bientôt</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rv {
  background: var(--stone);
}
.rv__head {
  position: relative;
  display: grid;
  gap: 1rem;
  margin-bottom: clamp(3rem, 6vw, 5rem);
}
.rv__script {
  position: absolute;
  left: clamp(14rem, 34vw, 32rem);
  bottom: -0.4em;
  font-size: clamp(2.4rem, 4vw, 4rem);
  color: var(--cobalt);
  transform: rotate(-5deg);
}
.rv__grid {
  display: grid;
  grid-template-columns: minmax(340px, 1fr) 2fr;
  gap: clamp(2rem, 5vw, 6rem);
  align-items: start;
}
.rv__note {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
}
.rv__note .display {
  font-size: clamp(7rem, 15vw, 14rem);
  line-height: 0.8;
}
.rv__on {
  font-size: 1.8rem;
  opacity: 0.5;
}
.rv__stars {
  display: flex;
  gap: 0.25rem;
  color: var(--ochre);
  margin: 1.4rem 0 0.8rem;
}
.rv__stars svg {
  width: 30px;
  height: 30px;
}
.rv__count {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.15rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0 0 2rem;
}
.rv__g {
  width: 18px;
  height: 18px;
}
.rv__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}
.rv__list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: color-mix(in srgb, var(--ink) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--ink) 15%, transparent);
}
.rv__card {
  margin: 0;
  background: var(--paper);
  padding: clamp(1.5rem, 2.5vw, 2.4rem);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  transition: background 0.4s;
}
.rv__card:hover {
  background: var(--cream);
}
.rv__card-stars {
  display: flex;
  gap: 2px;
  color: var(--ochre);
}
.rv__card-stars svg {
  width: 15px;
  height: 15px;
}
.rv__card blockquote {
  margin: 0;
  font-family: var(--f-narrow);
  font-size: 1.15rem;
  line-height: 1.45;
  flex: 1;
}
.rv__card figcaption {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  font-size: 0.95rem;
}
.rv__card figcaption img {
  border-radius: 50%;
}
.rv__card figcaption small {
  display: block;
  font-weight: 400;
  opacity: 0.6;
  font-size: 0.8rem;
}
.rv__empty {
  border-left: 1px solid color-mix(in srgb, var(--ink) 25%, transparent);
  padding-left: clamp(1.5rem, 4vw, 4rem);
  max-width: 44rem;
}
.rv__empty .lead {
  font-size: clamp(1.6rem, 1.2rem + 1.4vw, 2.6rem);
  margin: 0 0 1rem;
}
.rv__empty .script {
  font-size: 3rem;
  color: var(--cobalt);
}

@media (max-width: 900px) {
  .rv__grid {
    grid-template-columns: 1fr;
  }
  .rv__list {
    grid-template-columns: 1fr;
  }
  .rv__script {
    position: static;
  }
}
</style>
