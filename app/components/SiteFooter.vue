<script setup lang="ts">
const { site, hours } = useSite()
const root = ref<HTMLElement | null>(null)
const year = new Date().getFullYear()

const scrollTop = () => {
  const { $lenis } = useNuxtApp()
  ;($lenis as import('lenis').default).scrollTo(0, { duration: 1.6 })
}

useReveal(root, ({ gsap, root: el }) => {
  gsap.from(el.querySelectorAll('.ft__word span'), {
    yPercent: 100,
    duration: 1.4,
    ease: 'expo.out',
    stagger: 0.06,
    scrollTrigger: { trigger: el.querySelector('.ft__word'), start: 'top 95%', once: true },
  })
})
</script>

<template>
  <footer ref="root" class="ft">
    <div class="wrap">
      <div class="ft__grid">
        <div class="ft__col">
          <h3 class="eyebrow">Nous trouver</h3>
          <p>
            {{ site.address.street }}<br />
            {{ site.address.zip }} {{ site.address.city }}<br />
            <a :href="site.mapsUrl" target="_blank" rel="noopener" class="link-line">Itinéraire ↗</a>
          </p>
        </div>
        <div class="ft__col">
          <h3 class="eyebrow">Réserver</h3>
          <p>
            <template v-for="p in site.phones" :key="p.href">
              <a :href="p.href" class="link-line">{{ p.display }}</a><br />
            </template>
          </p>
        </div>
        <div class="ft__col">
          <h3 class="eyebrow">Horaires</h3>
          <p class="ft__hours">
            <span v-for="h in hours" :key="h.day">
              <b>{{ h.short }}</b>
              <template v-if="!h.lunch && !h.dinner">Fermé</template>
              <template v-else>
                <template v-if="h.lunch">midi <small>({{ fmtService(h.lunch) }})</small></template>
                <template v-if="h.lunch && h.dinner"> &amp; </template>
                <template v-if="h.dinner">soir <small>({{ fmtService(h.dinner) }})</small></template>
              </template>
            </span>
          </p>
        </div>
        <div class="ft__col">
          <h3 class="eyebrow">Suivre l'ardoise</h3>
          <p>
            <a :href="site.socials.instagram" target="_blank" rel="noopener" class="link-line">Instagram</a><br />
            <a :href="site.socials.facebook" target="_blank" rel="noopener" class="link-line">Facebook</a>
          </p>
        </div>
      </div>
    </div>

    <div class="ft__word display" aria-hidden="true">
      <span>P</span><span>A</span><span>T</span><span>I</span><span>O</span>
    </div>
    <span class="ft__tag script" aria-hidden="true">table pyrénéenne</span>

    <div class="wrap ft__bottom">
      <span>© {{ year }} Le Patio — Ax-les-Thermes</span>
      <span>Crédits photos : {{ site.credits }}</span>
      <span class="ft__legal">
        <NuxtLink to="/mentions-legales" class="link-line">Mentions légales</NuxtLink>
        <NuxtLink to="/confidentialite" class="link-line">Confidentialité</NuxtLink>
        <button class="link-line" @click="scrollTop">Haut de page ↑</button>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.ft {
  position: relative;
  background: var(--ink-deep);
  color: var(--cream);
  padding-top: clamp(4rem, 8vw, 7rem);
  overflow: hidden;
}
.ft__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}
.ft__col h3 {
  margin: 0 0 1.2rem;
  opacity: 0.6;
}
.ft__col p {
  margin: 0;
  font-family: var(--f-narrow);
  font-size: 1.2rem;
  line-height: 1.6;
}
.ft__hours {
  display: grid;
  font-size: 1rem !important;
}
.ft__hours small {
  font-size: 0.78em;
  opacity: 0.6;
  letter-spacing: 0.02em;
}
.ft__hours b {
  display: inline-block;
  width: 3rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.ft__word {
  display: flex;
  justify-content: space-between;
  padding-inline: var(--gutter);
  font-size: 37vw;
  line-height: 0.78;
  margin-top: clamp(3rem, 7vw, 6rem);
  overflow: hidden;
  padding-top: 0.06em;
}
.ft__word span {
  display: block;
}
.ft__tag {
  position: absolute;
  right: calc(var(--gutter) + 2vw);
  bottom: clamp(4rem, 8vw, 8rem);
  font-size: clamp(2.5rem, 7vw, 7rem);
  color: var(--ochre);
  transform: rotate(-6deg);
  pointer-events: none;
}
.ft__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem 2rem;
  padding-block: 1.6rem;
  border-top: 1px solid color-mix(in srgb, var(--cream) 15%, transparent);
  font-size: 0.8rem;
  opacity: 0.7;
  font-family: var(--f-narrow);
  letter-spacing: 0.06em;
}
.ft__legal {
  display: flex;
  gap: 1.5rem;
}
@media (max-width: 900px) {
  .ft__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 520px) {
  .ft__grid {
    grid-template-columns: 1fr;
  }
}
</style>
