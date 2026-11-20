<script setup lang="ts">
const { site } = useSite()
const root = ref<HTMLElement | null>(null)

useReveal(root, ({ gsap, root: el }) => {
  gsap.fromTo(
    el.querySelector('.cta__big'),
    { xPercent: 12 },
    {
      xPercent: -12,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  )
})
</script>

<template>
  <section ref="root" class="cta">
    <div class="cta__big display" aria-hidden="true">Une table ? Une table ? Une table ?</div>
    <div class="wrap cta__inner">
      <div>
        <span class="eyebrow" data-fade>Réservation</span>
        <h2 class="display h-md" data-split>On vous garde<br />une place au chaud</h2>
        <span class="script cta__script" data-fade data-delay="0.3">un coup de fil suffit</span>
      </div>
      <div class="cta__phones" data-stagger>
        <a v-for="p in site.phones" :key="p.href" :href="p.href" class="cta__phone">
          <small class="narrow">{{ p.label }}</small>
          <span class="display">{{ p.display }}</span>
          <PatioIcon name="arrow" />
        </a>
        <p class="cta__note">
          Pièces de viande à partager (travers de porc, gigot d'agneau, côte de bœuf…) : pensez à les réserver en même
          temps que votre table.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  background: var(--ink);
  color: var(--cream);
  padding-block: clamp(5rem, 11vw, 10rem);
  overflow: hidden;
}
.cta__big {
  position: absolute;
  top: 50%;
  left: 0;
  white-space: nowrap;
  font-size: clamp(10rem, 28vw, 30rem);
  transform: translateY(-50%);
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--cream) 14%, transparent);
  pointer-events: none;
  line-height: 1;
}
.cta__inner {
  position: relative;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(2.5rem, 6vw, 7rem);
  align-items: end;
}
.cta .eyebrow {
  margin-bottom: 1.4rem;
}
.cta__script {
  display: block;
  font-size: clamp(2.4rem, 4vw, 3.6rem);
  color: var(--ochre);
  margin-top: 1rem;
  transform: rotate(-4deg);
  transform-origin: left;
}
.cta__phones {
  display: grid;
}
.cta__phone {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 1.4rem 0;
  border-top: 1px solid color-mix(in srgb, var(--cream) 25%, transparent);
  transition: padding 0.5s var(--ease-out), color 0.3s;
}
.cta__phone:hover {
  padding-left: 1rem;
  color: var(--ochre);
}
.cta__phone small {
  grid-column: 1 / -1;
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.6;
}
.cta__phone .display {
  font-size: clamp(2.6rem, 5vw, 4.8rem);
  line-height: 1;
}
.cta__phone svg {
  width: 36px;
  height: 36px;
  transition: transform 0.5s var(--ease-out);
}
.cta__phone:hover svg {
  transform: translateX(8px);
}
.cta__note {
  border-top: 1px solid color-mix(in srgb, var(--cream) 25%, transparent);
  padding-top: 1.4rem;
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.75;
  max-width: 34rem;
}
@media (max-width: 900px) {
  .cta__inner {
    grid-template-columns: 1fr;
  }
}
</style>
