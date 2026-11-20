<script setup lang="ts">
const { site, spaces } = useSite()

useSeoMeta({
  title: 'Infos & accès — Le Patio, Ax-les-Thermes',
  description: 'Horaires, adresse, téléphone et plan d’accès du restaurant Le Patio, 3 rue Victor Pilhes à Ax-les-Thermes.',
})

const root = ref<HTMLElement | null>(null)
useReveal(root, ({ gsap, reduced, root: el }) => {
  if (reduced) return
  gsap.from(el.querySelectorAll('.ih__line > span'), { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.1 })
})

const faq = [
  {
    q: 'Faut-il réserver ?',
    a: "C'est vivement conseillé, surtout le week-end et pendant les vacances : chaque espace compte 12 à 14 couverts. Un simple appel suffit.",
  },
  {
    q: 'Peut-on réserver une pièce de viande à partager ?',
    a: "Oui ! Travers de porc, gigot d'agneau, côte de bœuf… Précisez-le au moment de réserver votre table.",
  },
  {
    q: 'Vous avez des demandes particulières ?',
    a: "Allergies, régime, anniversaire, table au calme dans le patio : dites-le à Valentin, il fera le nécessaire.",
  },
  {
    q: 'Où se garer ?',
    a: "La rue Victor Pilhes est piétonne : garez-vous sur l'un des parkings du centre d'Ax-les-Thermes, le restaurant est à quelques minutes à pied.",
  },
]
const openFaq = ref(0)
</script>

<template>
  <div ref="root" class="infos-p">
    <header class="ih wrap">
      <span class="eyebrow">Infos & accès</span>
      <h1 class="display ih__title">
        <span class="ih__line"><span>Venir</span></span>
        <span class="ih__line"><span>au Patio</span></span>
      </h1>
      <ClientOnly><OpenStatus class="ih__status" /></ClientOnly>
    </header>

    <section class="wrap ib">
      <div class="ib__col">
        <span class="eyebrow" data-fade>Horaires d'ouverture</span>
        <HoursTable data-fade />
        <p class="ib__note" data-fade>Fermé le dimanche et le lundi. Mardi : service du soir uniquement.</p>
      </div>
      <div class="ib__col" data-fade>
        <MapEmbed />
      </div>
    </section>

    <section class="wrap cards" data-stagger>
      <div class="card">
        <span class="eyebrow">Adresse</span>
        <p class="display">{{ site.address.street }}</p>
        <p>{{ site.address.zip }} {{ site.address.city }}</p>
        <a :href="site.mapsUrl" target="_blank" rel="noopener" class="link-line">Ouvrir dans Google Maps ↗</a>
      </div>
      <div class="card">
        <span class="eyebrow">Téléphone</span>
        <a v-for="p in site.phones" :key="p.href" :href="p.href" class="display card__tel">{{ p.display }}</a>
        <p>Réservations par téléphone</p>
      </div>
      <div class="card">
        <span class="eyebrow">Réseaux</span>
        <a :href="site.socials.instagram" target="_blank" rel="noopener" class="display card__tel">Instagram</a>
        <a :href="site.socials.facebook" target="_blank" rel="noopener" class="display card__tel">Facebook</a>
        <p>L'ardoise de la semaine y est publiée</p>
      </div>
    </section>

    <section class="section wrap rooms">
      <div class="rooms__head">
        <span class="eyebrow" data-fade>Nos salles</span>
        <h2 class="display h-md" data-split>54 couverts,<br />quatre ambiances</h2>
      </div>
      <ul class="rooms__list" data-stagger>
        <li v-for="s in spaces" :key="s.n">
          <span class="rooms__seats"><b class="display">{{ s.seats }}</b><small class="narrow">couverts</small></span>
          <div>
            <b class="display">{{ s.title }}</b>
            <span class="narrow">{{ s.inout }} · {{ s.where }}</span>
          </div>
        </li>
      </ul>
    </section>

    <section class="section faq">
      <div class="wrap faq__grid">
        <div>
          <span class="eyebrow" data-fade>Bon à savoir</span>
          <h2 class="display h-md" data-split>Vos questions</h2>
          <span class="script faq__script" data-fade>on vous répond</span>
        </div>
        <div class="faq__list">
          <div v-for="(f, i) in faq" :key="f.q" class="faq__item" :class="{ 'is-open': openFaq === i }" data-fade>
            <button class="faq__q" :aria-expanded="openFaq === i" @click="openFaq = openFaq === i ? -1 : i">
              <span class="display">{{ f.q }}</span>
              <span class="faq__plus" aria-hidden="true" />
            </button>
            <div class="faq__a">
              <div><p>{{ f.a }}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="expo wrap section">
      <div class="frame expo__img" data-reveal-img>
        <img src="/images/facade-2.jpg" alt="Le logo du Patio sur la vitrine" loading="lazy" />
      </div>
      <div class="expo__body">
        <span class="script expo__script" data-fade>en ce moment au Patio</span>
        <h2 class="display h-md" data-split>Jules Gort expose</h2>
        <p class="lead" data-fade>
          Venez découvrir ses photographies qui mettent en valeur notre magnifique territoire, accrochées aux murs du
          restaurant.
        </p>
      </div>
    </section>

    <ReserveCta />
  </div>
</template>

<style scoped>
.ih {
  position: relative;
  padding-top: calc(var(--header-h) + clamp(3rem, 8vw, 7rem));
  padding-bottom: clamp(3rem, 5vw, 5rem);
}
.ih__title {
  font-size: clamp(5rem, 17vw, 19rem);
  margin-top: 1.5rem;
}
.ih__line {
  display: block;
  overflow: hidden;
  padding-top: 0.05em;
}
.ih__line > span {
  display: block;
}
.ih__status {
  position: absolute;
  right: var(--gutter);
  bottom: clamp(3rem, 5vw, 5rem);
  font-size: 1rem;
}

.ib {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: clamp(2rem, 6vw, 6rem);
  align-items: start;
}
.ib__col > .eyebrow {
  margin-bottom: 2rem;
}
.ib__note {
  margin-top: 1.5rem;
  opacity: 0.7;
  font-size: 0.95rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: color-mix(in srgb, var(--ink) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--ink) 15%, transparent);
  margin-top: clamp(3rem, 7vw, 6rem);
  padding: 0;
}
.card {
  background: var(--cream);
  padding: clamp(1.6rem, 3vw, 2.6rem);
  display: grid;
  align-content: start;
  gap: 0.4rem;
}
.card .eyebrow {
  margin-bottom: 1rem;
}
.card p {
  margin: 0;
}
.card .display {
  font-size: clamp(2rem, 3vw, 2.8rem);
  line-height: 1;
}
.card__tel {
  transition: color 0.3s;
}
.card__tel:hover {
  color: var(--cobalt);
}
.card > p:last-of-type,
.card > a:last-child {
  opacity: 0.75;
}

.rooms {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 3rem;
  align-items: start;
}
.rooms__head .eyebrow {
  margin-bottom: 1.2rem;
}
.rooms__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.rooms__list li {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 1.5rem;
  align-items: center;
  padding: 1.2rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
}
.rooms__list li:first-child {
  border-top: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
}
.rooms__seats {
  display: grid;
  justify-items: start;
  color: var(--cobalt);
  line-height: 0.9;
}
.rooms__seats b {
  font-size: 4.4rem !important;
}
.rooms__seats small {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.rooms__list b {
  display: block;
  font-weight: 400;
  font-size: clamp(1.8rem, 2.6vw, 2.6rem);
}
.rooms__list .narrow {
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 0.85rem;
  opacity: 0.65;
}

.faq {
  background: var(--stone);
}
.faq__grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 3rem;
}
.faq__grid .eyebrow {
  margin-bottom: 1.2rem;
}
.faq__script {
  display: block;
  font-size: 3rem;
  color: var(--cobalt);
  transform: rotate(-5deg);
  margin-top: 0.5rem;
}
.faq__item {
  border-bottom: 1px solid color-mix(in srgb, var(--ink) 20%, transparent);
}
.faq__item:first-child {
  border-top: 1px solid color-mix(in srgb, var(--ink) 20%, transparent);
}
.faq__q {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.4rem 0;
  text-align: left;
}
.faq__q .display {
  font-size: clamp(1.6rem, 2.4vw, 2.4rem);
  line-height: 1;
}
.faq__plus {
  position: relative;
  width: 20px;
  height: 20px;
  flex: none;
}
.faq__plus::before,
.faq__plus::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1.5px;
  background: currentColor;
  transition: transform 0.5s var(--ease-out);
}
.faq__plus::after {
  transform: rotate(90deg);
}
.is-open .faq__plus::after {
  transform: rotate(0);
}
.faq__a {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.6s var(--ease-out);
}
.is-open .faq__a {
  grid-template-rows: 1fr;
}
.faq__a > div {
  overflow: hidden;
}
.faq__a p {
  margin: 0 0 1.5rem;
  max-width: 40rem;
}

.expo {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: clamp(2rem, 6vw, 6rem);
  align-items: center;
}
.expo__img {
  aspect-ratio: 1;
}
.expo__script {
  display: block;
  font-size: clamp(2.4rem, 4vw, 3.8rem);
  color: var(--cobalt);
  transform: rotate(-4deg);
  transform-origin: left;
  margin-bottom: 0.6rem;
}
.expo__body .lead {
  max-width: 34rem;
}

@media (max-width: 960px) {
  .ib,
  .cards,
  .rooms,
  .faq__grid,
  .expo {
    grid-template-columns: 1fr;
  }
  .ih__status {
    position: static;
    margin-top: 1.5rem;
  }
}
</style>
