<script setup lang="ts">
const { site, dishes, producers } = useSite()

useSeoMeta({
  title: 'La carte — Le Patio, Ax-les-Thermes',
  description:
    "L'ardoise du Patio évolue avec les produits locaux et de saison : spécialités ariégeoises, viandes des Pyrénées, focaccia maison et desserts faits maison.",
})

const root = ref<HTMLElement | null>(null)

useReveal(root, ({ gsap, reduced, root: el }) => {
  if (reduced) return
  gsap.from(el.querySelectorAll('.ph__line > span'), { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.1 })
  gsap.from(el.querySelector('.ph__script'), { autoAlpha: 0, rotate: -12, y: 20, duration: 1.4, ease: 'expo.out', delay: 0.5 })

  // Les plats glissent en quinconce
  el.querySelectorAll<HTMLElement>('.dish').forEach((d, i) => {
    gsap.from(d.querySelector('.dish__body'), {
      x: i % 2 ? -60 : 60,
      autoAlpha: 0,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: { trigger: d, start: 'top 75%', once: true },
    })
  })
})

const families = [
  {
    title: 'Les traditions',
    script: "d'Ariège",
    text: "L'azinat et sa rouzole, la mounjetado… les grands plats de la montagne, mijotés longtemps, comme à la maison.",
  },
  {
    title: 'Les viandes',
    script: 'des Pyrénées',
    text: "Agneau, bœuf, porc : Mario sélectionne ses fournisseurs dans les Pyrénées, en Ariège dès qu'il le peut.",
  },
  {
    title: 'Les tapas',
    script: 'à partager',
    text: 'Des tapas confectionnées maison, à partager à plusieurs — avec la focaccia de la maison, toujours.',
  },
  {
    title: 'Les desserts',
    script: 'faits maison',
    text: 'Croustade aux pommes et douceurs du moment, préparés ici, comme tout le reste.',
  },
]
</script>

<template>
  <div ref="root" class="carte">
    <header class="ph wrap">
      <span class="eyebrow">La carte</span>
      <h1 class="display ph__title">
        <span class="ph__line"><span>L'ardoise</span></span>
        <span class="ph__line"><span>du moment</span></span>
      </h1>
      <span class="script ph__script">au fil des saisons</span>
      <div class="ph__intro">
        <p class="lead" data-split>
          Notre carte évolue en fonction des produits locaux et de saison. Nous cuisinons uniquement des produits frais.
        </p>
        <div class="ph__social" data-fade>
          <p>Retrouvez l'ardoise de la semaine sur nos réseaux :</p>
          <div>
            <a :href="site.socials.facebook" target="_blank" rel="noopener" class="btn"><PatioIcon name="facebook" /> Facebook</a>
            <a :href="site.socials.instagram" target="_blank" rel="noopener" class="btn btn--ghost"><PatioIcon name="instagram" /> Instagram</a>
          </div>
        </div>
      </div>
    </header>

    <PatioMarquee :items="producers" />

    <!-- Les familles de la carte -->
    <section class="fam section">
      <div class="wrap">
        <div class="fam__grid" data-stagger>
          <article v-for="(f, i) in families" :key="f.title" class="fam__item">
            <span class="narrow fam__n">0{{ i + 1 }}</span>
            <h2 class="display">{{ f.title }}</h2>
            <span class="script">{{ f.script }}</span>
            <p>{{ f.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Focaccia -->
    <section class="bread">
      <div class="wrap bread__inner">
        <div class="bread__word display" data-split-chars>Focaccia</div>
        <div class="bread__text">
          <span class="script">notre pain, pétri à la main</span>
          <p class="lead" data-fade>
            Elle accompagne chaque repas : pétrie à la main dans notre cuisine, dorée au four, servie tiède. On vous
            prévient, on en redemande souvent.
          </p>
        </div>
      </div>
    </section>

    <!-- Plats passés à l'ardoise -->
    <section class="dishes section">
      <div class="wrap">
        <div class="dishes__head">
          <span class="eyebrow" data-fade>Ils sont passés à l'ardoise</span>
          <h2 class="display h-lg" data-split>Quelques<br />assiettes</h2>
          <p data-fade>Selon la saison et le marché, vous les retrouverez peut-être à votre passage.</p>
        </div>

        <article v-for="(d, i) in dishes" :key="d.name" class="dish" :class="{ 'dish--rev': i % 2 }">
          <div class="frame dish__img" data-reveal-img data-parallax-img>
            <img :src="d.img" :alt="`${d.name} ${d.sub}`" loading="lazy" />
          </div>
          <div class="dish__body">
            <span class="narrow dish__n">{{ String(i + 1).padStart(2, '0') }} / {{ String(dishes.length).padStart(2, '0') }}</span>
            <h3 class="display">{{ d.name }}</h3>
            <span class="script">{{ d.sub }}</span>
            <span class="eyebrow">{{ d.tag }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- Vin -->
    <section class="wine">
      <div class="frame wine__img" data-parallax-img>
        <img src="/images/bar-cocktails.png" alt="Le bar du Patio, ses bouteilles et l'ardoise des cocktails" loading="lazy" />
      </div>
      <div class="wine__body">
        <span class="eyebrow" data-fade>À la cave</span>
        <h2 class="display h-md" data-split>Un verre<br />pour aller avec</h2>
        <p data-fade>
          Des vins pour accompagner l'ardoise, des bières pression au comptoir et une ardoise de cocktails pour
          l'apéritif. Demandez conseil à Valentin.
        </p>
      </div>
    </section>

    <ReserveCta />
  </div>
</template>

<style scoped>
.ph {
  position: relative;
  padding-top: calc(var(--header-h) + clamp(3rem, 8vw, 7rem));
  padding-bottom: clamp(3rem, 6vw, 5rem);
}
.ph__title {
  font-size: clamp(5rem, 17vw, 19rem);
  margin-top: 1.5rem;
}
.ph__line {
  display: block;
  overflow: hidden;
  padding-top: 0.05em;
}
.ph__line > span {
  display: block;
}
.ph__script {
  position: absolute;
  right: var(--gutter);
  top: calc(var(--header-h) + clamp(8rem, 18vw, 18rem));
  font-size: clamp(2.6rem, 6vw, 6.5rem);
  color: var(--cobalt);
  transform: rotate(-6deg);
}
.ph__intro {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  margin-top: clamp(2.5rem, 5vw, 4rem);
  align-items: end;
}
.ph__intro .lead {
  margin: 0;
  max-width: 40rem;
}
.ph__social p {
  margin: 0 0 1rem;
  opacity: 0.75;
}
.ph__social div {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.fam__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid color-mix(in srgb, var(--ink) 20%, transparent);
}
.fam__item {
  padding: 2rem clamp(1rem, 2vw, 2rem) 0 0;
}
.fam__item + .fam__item {
  padding-left: clamp(1rem, 2vw, 2rem);
  border-left: 1px solid color-mix(in srgb, var(--ink) 20%, transparent);
}
.fam__n {
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  opacity: 0.55;
}
.fam__item h2 {
  font-size: clamp(2.4rem, 3.6vw, 3.6rem);
  margin-top: 1.5rem;
}
.fam__item .script {
  display: block;
  font-size: 2.3rem;
  color: var(--cobalt);
  margin: -0.2em 0 0.8rem;
}
.fam__item p {
  margin: 0;
  font-size: 0.98rem;
}

.bread {
  background: var(--ochre);
  color: var(--ink);
  padding-block: clamp(4rem, 9vw, 8rem);
  overflow: hidden;
}
.bread__inner {
  display: grid;
  gap: 1rem;
}
.bread__word {
  font-size: clamp(6rem, 24vw, 26rem);
  line-height: 0.8;
}
.bread__text {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}
.bread__text .script {
  font-size: clamp(2.4rem, 4.5vw, 4.6rem);
  transform: rotate(-4deg);
}
.bread__text .lead {
  margin: 0;
}

.dishes__head {
  display: grid;
  gap: 1.2rem;
  margin-bottom: clamp(3rem, 8vw, 7rem);
}
.dishes__head p {
  max-width: 30rem;
  margin: 0;
  opacity: 0.8;
}
.dish {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(2rem, 6vw, 7rem);
  align-items: center;
  margin-bottom: clamp(4rem, 9vw, 8rem);
}
.dish--rev .dish__img {
  order: 2;
}
.dish__img {
  aspect-ratio: 5 / 4;
}
.dish__body {
  display: grid;
  gap: 0.6rem;
  justify-items: start;
}
.dish__n {
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  opacity: 0.55;
}
.dish__body h3 {
  font-size: clamp(3.4rem, 7vw, 7.5rem);
}
.dish__body .script {
  font-size: clamp(2.4rem, 4vw, 4rem);
  color: var(--cobalt);
  margin: -0.3em 0 0.6rem 8%;
  transform: rotate(-4deg);
}

.wine {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--ink);
  color: var(--cream);
  min-height: 80svh;
}
.wine__img {
  min-height: 60svh;
}
.wine__body {
  padding: clamp(3rem, 7vw, 7rem) var(--gutter);
  display: grid;
  align-content: center;
  gap: 1.4rem;
}
.wine__body p {
  max-width: 30rem;
  margin: 0;
  opacity: 0.85;
}

@media (max-width: 960px) {
  .ph__intro,
  .bread__text,
  .dish,
  .wine {
    grid-template-columns: 1fr;
  }
  .ph__script {
    position: static;
    display: block;
  }
  .fam__grid {
    grid-template-columns: 1fr 1fr;
  }
  .fam__item:nth-child(3) {
    border-left: 0;
    padding-left: 0;
  }
  .fam__item {
    padding-bottom: 2rem;
  }
  .dish--rev .dish__img {
    order: 0;
  }
}
@media (max-width: 560px) {
  .fam__grid {
    grid-template-columns: 1fr;
  }
  .fam__item + .fam__item {
    border-left: 0;
    padding-left: 0;
    border-top: 1px solid color-mix(in srgb, var(--ink) 20%, transparent);
  }
}
</style>
