<script setup lang="ts">
const { site, spaces, dishes, producers, gallery } = useSite()

useSeoMeta({
  title: 'Le Patio — Table pyrénéenne à Ax-les-Thermes',
  ogTitle: 'Le Patio — Table pyrénéenne à Ax-les-Thermes',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: 'Le Patio — table pyrénéenne',
        servesCuisine: ['Pyrénéenne', 'Française', 'Fait maison'],
        telephone: '+33561640737',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '3 rue Victor Pilhes',
          postalCode: '09110',
          addressLocality: 'Ax-les-Thermes',
          addressCountry: 'FR',
        },
        sameAs: [site.socials.facebook, site.socials.instagram],
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday'], opens: '17:00', closes: '22:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '12:00', closes: '14:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '17:00', closes: '22:00' },
        ],
      }),
    },
  ],
})

const root = ref<HTMLElement | null>(null)
const preview = ref<HTMLElement | null>(null)
const activeDish = ref(-1)

useReveal(root, ({ gsap, ScrollTrigger, reduced, root: el }) => {
  const $ = <T extends Element = HTMLElement>(s: string) => el.querySelector<T>(s)!
  const $$ = (s: string) => el.querySelectorAll<HTMLElement>(s)

  /* ---------- HERO : intro ---------- */
  if (!reduced) {
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })
    intro
      .from($$('.hero__letter'), { yPercent: 105, duration: 1.5, stagger: 0.07 })
      .fromTo($('.hero__tag'), { clipPath: 'inset(-30% 100% -30% 0)' }, { clipPath: 'inset(-30% 0% -30% 0)', duration: 1.8, ease: 'power2.inOut' }, 0.7)
      .from($$('.hero__meta > *'), { autoAlpha: 0, y: 16, duration: 1, stagger: 0.08 }, 0.6)
      .from($('.reveal__frame'), { yPercent: 30, duration: 1.6 }, 0.4)

    // Le titre s'éloigne doucement
    gsap.to($('.hero__title'), {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: $('.hero'), start: 'top top', end: 'bottom top', scrub: true },
    })
  }

  const mm = gsap.matchMedia()

  /* ---------- Photo 16/9 qui grandit au scroll ---------- */
  mm.add('(min-width: 0px)', () => {
    if (reduced) {
      gsap.set($('.reveal__frame'), { scale: 1 })
      return
    }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: $('.reveal'), start: 'top top', end: '+=90%', scrub: true, pin: true, refreshPriority: 2 },
    })
    // Le scale garde le ratio 16/9 à chaque instant
    tl.fromTo($('.reveal__frame'), { scale: 0.5 }, { scale: 1, ease: 'power1.inOut', duration: 1 })
      .fromTo($('.reveal__frame img'), { scale: 1.2 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .fromTo($$('.reveal__caption > *'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.06, ease: 'power2.out', duration: 0.2 }, 0.78)
  })

  /* ---------- Les 4 ambiances : scroll horizontal ---------- */
  mm.add('(min-width: 961px)', () => {
    if (reduced) return
    const track = $('.spaces__track')
    const dist = () => track.scrollWidth - window.innerWidth
    const tween = gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: $('.spaces'),
        start: 'top top',
        end: () => `+=${dist()}`,
        scrub: 0.6,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        refreshPriority: 1,
      },
    })
    // Parallaxe des images dans le défilement horizontal
    $$('.space__img img').forEach((img) => {
      gsap.fromTo(
        img,
        { xPercent: -10 },
        {
          xPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: img.closest('.space'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        },
      )
    })
    gsap.to($('.spaces__progress span'), {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: $('.spaces'), start: 'top top', end: () => `+=${dist()}`, scrub: true },
    })
  })

  /* ---------- Ardoise : image qui suit le curseur ---------- */
  mm.add('(hover: hover) and (min-width: 961px)', () => {
    const p = preview.value!
    const xTo = gsap.quickTo(p, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(p, 'y', { duration: 0.6, ease: 'power3' })
    const list = $('.slate__list')
    const move = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    list.addEventListener('mousemove', move)
    return () => list.removeEventListener('mousemove', move)
  })

  /* ---------- Focaccia : le mot « main » qui se dessine ---------- */
  if (!reduced) {
    gsap.fromTo(
      $('.foca__script'),
      { clipPath: 'inset(-30% 100% -30% 0)' },
      { clipPath: 'inset(-30% 0% -30% 0)', duration: 2, ease: 'power2.inOut', scrollTrigger: { trigger: $('.foca'), start: 'top 55%', once: true } },
    )
  }

  ScrollTrigger.refresh()
})

const heroLetters = ['P', 'A', 'T', 'I', 'O']
const pick = (src: string) => gallery.find((g) => g.src.endsWith(src))
const galleryPicks = [
  pick('boeuf-legumes.png'),
  pick('la-salle-du-bar-avec-des-manges-debouts.jpg'),
  pick('bar-cocktails.png'),
  pick('lazinat-et-sa-rouzole.jpg'),
  pick('salle-chalet-baie.png'),
  pick('la-cuisine.jpg'),
]
</script>

<template>
  <div ref="root" class="home">
    <!-- ============ HERO ============ -->
    <section class="hero">
      <div class="hero__meta wrap">
        <span class="eyebrow">Ax-les-Thermes — Ariège</span>
        <span class="hero__meta-mid narrow">Cuisine maison · Produits locaux · Focaccia pétrie à la main</span>
      </div>
      <h1 class="hero__title">
        <span class="sr-only">Le Patio, table pyrénéenne à Ax-les-Thermes</span>
        <span class="hero__patio display" aria-hidden="true">
          <span v-for="l in heroLetters" :key="l" class="hero__mask"><span class="hero__letter">{{ l }}</span></span>
        </span>
        <span class="hero__tag script" aria-hidden="true">table pyrénéenne</span>
      </h1>
    </section>

    <!-- ============ IMAGE PLEIN ÉCRAN ============ -->
    <section class="reveal">
      <div class="reveal__frame">
        <img src="/images/facade-jour.png" alt="La façade bleue et jaune du Patio et sa terrasse, rue Victor Pilhes" />
        <div class="reveal__caption wrap">
          <span class="eyebrow">Rue Victor Pilhes</span>
          <p class="display">Au cœur d'Ax,<br />une table de montagne.</p>
          <span class="script">bienvenue chez nous</span>
        </div>
      </div>
    </section>

    <!-- ============ MANIFESTE ============ -->
    <section class="manifesto section">
      <div class="wrap manifesto__grid">
        <span class="eyebrow" data-fade>Le Patio</span>
        <div>
          <p class="manifesto__text narrow" data-words-scrub>
            Nous vous accueillons toute l'année avec notre ardoise. Des produits d'ici — les truites d'Aston, les fromages
            d'Unac et d'Orgeix — une cuisine maison, généreuse, qui suit les saisons. Et quatre salles pour la partager.
          </p>
          <div class="manifesto__foot" data-fade>
            <NuxtLink to="/carte" class="btn">Découvrir la carte <PatioIcon name="arrow" /></NuxtLink>
            <span class="script manifesto__script">à très vite !</span>
          </div>
        </div>
      </div>
    </section>

    <PatioMarquee :items="producers" dark />

    <!-- ============ FOCACCIA ============ -->
    <section class="foca section">
      <div class="wrap foca__grid">
        <div class="foca__media">
          <div class="frame foca__img" data-reveal-img data-parallax-img>
            <img src="/images/la-cuisine.jpg" alt="Mains en cuisine, tout est préparé à la main" loading="lazy" />
          </div>
          <div class="foca__badge" data-speed="0.12">
            <span class="display">100%</span>
            <span class="narrow">fait maison</span>
          </div>
        </div>

        <div class="foca__content">
          <span class="eyebrow" data-fade>Le pain de la maison</span>
          <h2 class="foca__title display" data-split-chars>Focaccia</h2>
          <span class="foca__script script">pétrie à la main</span>
          <p class="lead" data-split>
            Ici, le pain ne vient pas d'ailleurs. Notre focaccia est pétrie à la main dans notre cuisine, dorée au four,
            arrosée d'huile d'olive et servie tiède à table.
          </p>
          <p data-fade>
            C'est souvent la première chose que l'on goûte au Patio, et souvent celle dont on se souvient. Un petit
            conseil : gardez-en un morceau pour la sauce.
          </p>
          <ol class="foca__steps" data-stagger>
            <li><b class="display">01</b><span>Pétrie</span></li>
            <li><b class="display">02</b><span>Levée</span></li>
            <li><b class="display">03</b><span>Dorée</span></li>
            <li><b class="display">04</b><span>Partagée</span></li>
          </ol>
        </div>
      </div>
    </section>

    <!-- ============ L'ARDOISE ============ -->
    <section class="slate section">
      <div class="wrap">
        <div class="slate__head">
          <div>
            <span class="eyebrow" data-fade>L'ardoise</span>
            <h2 class="display h-lg" data-split>Au fil des<br />saisons</h2>
          </div>
          <p class="lead slate__intro" data-split>
            Notre carte évolue en fonction des produits locaux et de saison. Nous cuisinons uniquement des produits frais —
            voici quelques assiettes qui sont passées sur l'ardoise.
          </p>
        </div>

        <ul class="slate__list" @mouseleave="activeDish = -1">
          <li v-for="(d, i) in dishes" :key="d.name" class="slate__row" :class="{ 'is-active': activeDish === i }" data-fade @mouseenter="activeDish = i">
            <span class="slate__num narrow">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="slate__name display">{{ d.name }}</span>
            <span class="slate__sub script">{{ d.sub }}</span>
            <span class="slate__tag narrow">{{ d.tag }}</span>
            <img class="slate__thumb" :src="d.img" :alt="d.name" loading="lazy" />
          </li>
        </ul>

        <div class="slate__foot" data-fade>
          <p>
            L'ardoise du moment est publiée chaque semaine sur
            <a :href="site.socials.facebook" target="_blank" rel="noopener" class="link-line">Facebook</a> et
            <a :href="site.socials.instagram" target="_blank" rel="noopener" class="link-line">Instagram</a>.
          </p>
          <NuxtLink to="/carte" class="btn btn--cream">Toute la carte <PatioIcon name="arrow" /></NuxtLink>
        </div>
      </div>

      <div ref="preview" class="slate__preview" :class="{ 'is-visible': activeDish >= 0 }" aria-hidden="true">
        <div class="slate__preview-inner">
          <img v-for="(d, i) in dishes" :key="d.img" :src="d.img" alt="" :class="{ 'is-on': activeDish === i }" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- ============ LES AMBIANCES ============ -->
    <section id="lieu" class="spaces">
      <div class="spaces__track">
        <div class="spaces__intro">
          <span class="eyebrow">Le lieu</span>
          <h2 class="display">Quatre<br />ambiances,<br />54<br />couverts.</h2>
          <span class="script spaces__script">choisissez la vôtre</span>
          <p class="narrow">Deux espaces en extérieur — la terrasse et le patio — et deux salles à l'intérieur : côté bar et chalet.</p>
        </div>

        <article v-for="s in spaces" :key="s.n" class="space" :class="{ 'space--text': !s.img }">
          <div class="space__img">
            <img v-if="s.img" :src="s.img" :alt="s.title" loading="lazy" />
            <div v-else class="space__secret">
              <span class="script">à l'abri<br />des regards</span>
            </div>
          </div>
          <div class="space__body">
            <div class="space__top">
              <span class="display space__n">{{ s.n }}</span>
              <span class="space__seats">
                <b class="display">{{ s.seats }}</b>
                <small class="narrow">couverts</small>
              </span>
            </div>
            <h3 class="display space__title">{{ s.title }}</h3>
            <span class="eyebrow">{{ s.inout }} · {{ s.where }}</span>
            <p>{{ s.text }}</p>
          </div>
        </article>
      </div>
      <div class="spaces__progress wrap" aria-hidden="true"><span /></div>
    </section>

    <!-- ============ L'ÉQUIPE ============ -->
    <section class="team section">
      <div class="wrap">
        <div class="team__head">
          <span class="eyebrow" data-fade>La maison</span>
          <h2 class="display h-lg" data-split>Deux visages,<br />une même envie</h2>
        </div>

        <div class="team__grid">
          <article class="person">
            <div class="frame person__img" data-reveal-img data-parallax-img>
              <img src="/images/cote-de-boeuf-grill.png" alt="En cuisine, une côte de bœuf saisie" loading="lazy" />
            </div>
            <div class="person__body">
              <span class="eyebrow" data-fade>En cuisine</span>
              <h3 class="display person__name" data-split-chars>Mario</h3>
              <span class="script person__script" data-fade>avec générosité</span>
              <p data-fade>
                Notre chef est issu d'une famille d'éleveurs de Siguer, dans la vallée du Vicdessos. Il cuisine les
                produits locaux et de saison avec générosité, et sélectionne nos fournisseurs dans les Pyrénées — en
                Ariège dès qu'il le peut.
              </p>
            </div>
          </article>

          <article class="person person--alt">
            <div class="frame person__img" data-reveal-img data-parallax-img>
              <img src="/images/la-salle-du-bar-avec-des-manges-debouts.jpg" alt="La salle côté bar du Patio" loading="lazy" />
            </div>
            <div class="person__body">
              <span class="eyebrow" data-fade>En salle</span>
              <h3 class="display person__name" data-split-chars>Valentin</h3>
              <span class="script person__script" data-fade>et son rire légendaire</span>
              <p data-fade>
                Plus de dix ans d'expérience en restauration dans plusieurs établissements d'Ax-les-Thermes. Il saura vous
                accueillir avec son rire légendaire et prendre en compte vos demandes spécifiques.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ============ À PARTAGER ============ -->
    <section class="share">
      <div class="frame share__bg" data-parallax-img>
        <img src="/images/cote-de-boeuf.jpg" alt="" loading="lazy" />
      </div>
      <div class="wrap share__inner">
        <span class="eyebrow" data-fade>Sur réservation</span>
        <h2 class="display h-lg" data-split>Les pièces<br />à partager</h2>
        <p class="lead" data-fade>Travers de porc, gigot d'agneau, côte de bœuf… Réservez-les avec votre table, on s'occupe du reste.</p>
        <a :href="site.phones[0]!.href" class="btn btn--cream" data-fade><PatioIcon name="phone" /> {{ site.phones[0]!.display }}</a>
      </div>
    </section>

    <!-- ============ AVIS GOOGLE ============ -->
    <ReviewsSection />

    <!-- ============ GALERIE ============ -->
    <section class="pics section">
      <div class="wrap">
        <div class="pics__head">
          <h2 class="display h-lg" data-split>En images</h2>
          <NuxtLink to="/galerie" class="btn btn--ghost" data-fade>Toute la galerie <PatioIcon name="arrow" /></NuxtLink>
        </div>
        <div class="pics__grid">
          <NuxtLink
            v-for="(g, i) in galleryPicks"
            :key="g!.src"
            to="/galerie"
            class="frame pics__item"
            :class="`pics__item--${i}`"
            :data-speed="[0.04, 0.12, 0.02, 0.1, 0.05, 0.14][i]"
          >
            <img :src="g!.src" :alt="g!.alt" loading="lazy" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ============ INFOS ============ -->
    <section class="infos section">
      <div class="wrap infos__grid">
        <div>
          <span class="eyebrow" data-fade>Horaires</span>
          <h2 class="display h-md infos__title" data-split>Nous trouver</h2>
          <HoursTable data-fade />
          <div class="infos__addr" data-fade>
            <p class="narrow">
              <b>{{ site.address.street }}</b><br />{{ site.address.zip }} {{ site.address.city }}
            </p>
            <NuxtLink to="/infos" class="btn btn--ghost">Accès & infos <PatioIcon name="arrow" /></NuxtLink>
          </div>
        </div>
        <div data-fade>
          <MapEmbed />
          <p class="infos__expo">
            <span class="script">en ce moment</span>
            <b>Jules Gort expose au Patio</b> — venez découvrir ses photographies qui mettent en valeur notre magnifique
            territoire.
          </p>
        </div>
      </div>
    </section>

    <ReserveCta />
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ---------------- HERO ---------------- */
.hero {
  position: relative;
  padding-top: calc(var(--header-h) + clamp(1rem, 3vh, 2.5rem));
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.hero__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-block: 1.1rem;
  border-top: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
  font-size: 0.85rem;
}
.hero__meta-mid {
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 500;
}
.hero__title {
  position: relative;
  margin: auto 0 0;
  display: grid;
  justify-items: center;
  padding-bottom: 14vh;
  font-weight: 400;
}
.hero__patio {
  display: flex;
  font-size: clamp(9rem, 39vw, 44rem);
  line-height: 0.8;
  letter-spacing: 0.04em;
}
.hero__mask {
  display: block;
  overflow: hidden;
  padding-top: 0.06em;
}
.hero__letter {
  display: block;
  transform-origin: bottom;
}
.hero__tag {
  font-size: clamp(2.6rem, 8.6vw, 9.5rem);
  margin-top: -0.18em;
  transform: translateX(-0.25em) rotate(-3deg);
  position: relative;
  z-index: 2;
  color: var(--cobalt);
  white-space: nowrap;
}

/* ---------------- REVEAL ---------------- */
.reveal {
  position: relative;
  height: 100svh;
  margin-top: -30svh;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}
.reveal__frame {
  position: relative;
  width: min(76vw, calc((100svh - 180px) * 16 / 9));
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--ink-deep);
  transform: scale(0.5);
  transform-origin: 50% 0%;
}
.reveal__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.reveal__frame::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(10, 11, 69, 0.75));
}
.reveal__caption {
  position: absolute;
  inset: auto 0 0;
  z-index: 2;
  color: var(--cream);
  padding-bottom: clamp(2rem, 6vh, 4rem);
  display: grid;
  gap: 0.8rem;
}
.reveal__caption.wrap {
  padding-inline: clamp(1.2rem, 3vw, 2.8rem);
  padding-bottom: clamp(1.2rem, 3vw, 2.6rem);
}
.reveal__caption .display {
  font-size: clamp(1.8rem, 3.8vw, 4.4rem);
  margin: 0;
}
.reveal__caption .script {
  font-size: clamp(1.6rem, 2.4vw, 2.8rem);
  color: var(--ochre);
}

/* ---------------- MANIFESTE ---------------- */
.manifesto__grid {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
}
.manifesto__text {
  font-size: clamp(2rem, 1.2rem + 3vw, 4.6rem);
  line-height: 1.08;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: -0.005em;
  margin: 0 0 3rem;
}
.manifesto__foot {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  flex-wrap: wrap;
}
.manifesto__script {
  font-size: clamp(2.6rem, 4vw, 4rem);
  color: var(--cobalt);
  transform: rotate(-5deg);
}

/* ---------------- FOCACCIA ---------------- */
.foca__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 7vw, 8rem);
  align-items: center;
}
.foca__media {
  position: relative;
}
.foca__img {
  aspect-ratio: 4 / 5;
}
.foca__badge {
  position: absolute;
  right: -1.5rem;
  bottom: 12%;
  background: var(--ochre);
  color: var(--ink);
  width: clamp(120px, 12vw, 170px);
  aspect-ratio: 1;
  display: grid;
  place-content: center;
  text-align: center;
  line-height: 1;
}
.foca__badge .display {
  font-size: clamp(2.6rem, 4vw, 3.8rem);
}
.foca__badge .narrow {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
}
.foca__content {
  position: relative;
}
.foca__title {
  font-size: clamp(5rem, 12vw, 12rem);
  margin-top: 1.2rem;
}
.foca__script {
  display: block;
  font-size: clamp(2.8rem, 5vw, 5.4rem);
  color: var(--cobalt);
  margin: -0.35em 0 1.5rem 18%;
  transform: rotate(-4deg);
}
.foca__steps {
  list-style: none;
  margin: 2.5rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid color-mix(in srgb, var(--ink) 25%, transparent);
}
.foca__steps li {
  padding-top: 1rem;
  display: grid;
  gap: 0.2rem;
  font-family: var(--f-narrow);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.85rem;
}
.foca__steps b {
  font-size: 2.2rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--cobalt);
}

/* ---------------- ARDOISE ---------------- */
.slate {
  background: var(--ink);
  color: var(--cream);
}
.slate__head {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
  align-items: end;
  margin-bottom: clamp(3rem, 7vw, 6rem);
}
.slate__head .eyebrow {
  margin-bottom: 1.2rem;
}
.slate__intro {
  opacity: 0.85;
  margin: 0;
}
.slate__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid color-mix(in srgb, var(--cream) 22%, transparent);
}
.slate__row {
  position: relative;
  display: grid;
  grid-template-columns: 4rem auto 1fr auto;
  align-items: baseline;
  gap: 1.5rem;
  padding: clamp(1rem, 1.6vw, 1.5rem) 0;
  border-bottom: 1px solid color-mix(in srgb, var(--cream) 22%, transparent);
  transition: color 0.4s, padding 0.6s var(--ease-out);
  cursor: default;
}
.slate__row::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--cream);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.55s var(--ease-out);
  z-index: 0;
}
.slate__row > * {
  position: relative;
  z-index: 1;
}
.slate__row.is-active {
  color: var(--ink);
  padding-left: 1.5rem;
}
.slate__row.is-active::before {
  transform: scaleY(1);
}
.slate__num {
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
}
.slate__name {
  font-size: clamp(2.4rem, 5.4vw, 5.6rem);
  line-height: 0.95;
}
.slate__sub {
  font-size: clamp(1.8rem, 2.6vw, 2.8rem);
  color: var(--ochre);
}
.slate__row.is-active .slate__sub {
  color: var(--cobalt);
}
.slate__tag {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.7;
  padding-right: 1.5rem;
}
.slate__thumb {
  display: none;
}
.slate__foot {
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.slate__foot p {
  margin: 0;
  opacity: 0.85;
}
.slate__preview {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  pointer-events: none;
  width: clamp(220px, 20vw, 320px);
  aspect-ratio: 4 / 5;
  margin: calc(clamp(220px, 20vw, 320px) * -0.625) 0 0 calc(clamp(220px, 20vw, 320px) * -0.5);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.4s, scale 0.5s var(--ease-out);
}
.slate__preview.is-visible {
  opacity: 1;
}
.slate__preview-inner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform: rotate(-3deg);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.5);
}
.slate__preview img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  clip-path: inset(100% 0 0 0);
  transition: clip-path 0.6s var(--ease-out);
}
.slate__preview img.is-on {
  clip-path: inset(0 0 0 0);
  z-index: 2;
}

/* ---------------- AMBIANCES ---------------- */
.spaces {
  position: relative;
  background: var(--cream);
  overflow: hidden;
}
.spaces__track {
  display: flex;
  height: 100svh;
  width: max-content;
  align-items: stretch;
}
.spaces__intro {
  width: min(42vw, 640px);
  padding: calc(var(--header-h) + 3rem) var(--gutter) 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2rem;
}
.spaces__intro h2 {
  font-size: clamp(3.6rem, 7vw, 8rem);
}
.spaces__script {
  font-size: clamp(2.4rem, 3.5vw, 3.6rem);
  color: var(--cobalt);
  transform: rotate(-5deg);
  transform-origin: left;
}
.spaces__intro p {
  max-width: 22rem;
  font-size: 1.1rem;
  opacity: 0.8;
}
.space {
  width: min(78vw, 1100px);
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: clamp(1.5rem, 3vw, 3rem);
  padding: calc(var(--header-h) + 2rem) clamp(1.5rem, 3vw, 3rem) 5rem;
  border-left: 1px solid color-mix(in srgb, var(--ink) 15%, transparent);
}
.space__img {
  position: relative;
  overflow: hidden;
  background: var(--stone);
}
.space__img img {
  position: absolute;
  inset: 0;
  width: 120%;
  max-width: none;
  left: -10%;
  height: 100%;
  object-fit: cover;
}
.space__secret {
  position: absolute;
  inset: 0;
  background: var(--ink);
  color: var(--cream);
  display: grid;
  place-items: center;
  text-align: center;
  background-image: repeating-linear-gradient(90deg, transparent 0 46px, color-mix(in srgb, var(--cream) 7%, transparent) 46px 47px);
}
.space__secret .script {
  font-size: clamp(3.4rem, 6vw, 6.5rem);
  line-height: 0.9;
  transform: rotate(-6deg);
}
.space__body {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 1rem;
}
.space__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: auto;
}
.space__n {
  font-size: 1.4rem;
  opacity: 0.4;
}
.space__seats {
  display: grid;
  justify-items: end;
  line-height: 0.85;
}
.space__seats b {
  font-size: clamp(5rem, 9vw, 9rem);
  font-weight: 400;
  color: var(--cobalt);
}
.space__seats small {
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.8rem;
}
.space__title {
  font-size: clamp(2.6rem, 4.4vw, 4.6rem);
}
.space__body p {
  margin: 0;
  max-width: 28rem;
}
.spaces__progress {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  height: 1px;
}
.spaces__progress::before,
.spaces__progress span {
  content: '';
  position: absolute;
  left: var(--gutter);
  right: var(--gutter);
  height: 1px;
}
.spaces__progress::before {
  background: color-mix(in srgb, var(--ink) 15%, transparent);
}
.spaces__progress span {
  display: block;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left;
}

/* ---------------- ÉQUIPE ---------------- */
.team__head {
  margin-bottom: clamp(3rem, 7vw, 6rem);
}
.team__head .eyebrow {
  margin-bottom: 1.2rem;
}
.team__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 6vw, 7rem);
}
.person--alt {
  margin-top: clamp(4rem, 14vw, 14rem);
}
.person__img {
  aspect-ratio: 4 / 5;
  margin-bottom: 2rem;
}
.person__name {
  font-size: clamp(4rem, 8vw, 8rem);
  margin-top: 0.8rem;
}
.person__script {
  display: block;
  font-size: clamp(2.2rem, 3.4vw, 3.4rem);
  color: var(--cobalt);
  margin: -0.4em 0 1rem 12%;
  transform: rotate(-4deg);
}
.person__body p {
  max-width: 32rem;
}

/* ---------------- À PARTAGER ---------------- */
.share {
  position: relative;
  min-height: 90svh;
  display: grid;
  align-items: end;
  color: var(--cream);
  overflow: hidden;
}
.share__bg {
  position: absolute;
  inset: 0;
  background: var(--ink-deep);
}
.share__bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(10, 11, 69, 0.88), rgba(10, 11, 69, 0.3) 70%);
}
.share__inner {
  position: relative;
  padding-block: clamp(4rem, 10vw, 9rem);
  display: grid;
  justify-items: start;
  gap: 1.4rem;
}
.share__inner .lead {
  max-width: 34rem;
  margin: 0;
}

/* ---------------- GALERIE ---------------- */
.pics__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  margin-bottom: clamp(3rem, 6vw, 5rem);
  flex-wrap: wrap;
}
.pics__grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(0.8rem, 1.6vw, 1.6rem);
  align-items: start;
}
.pics__item {
  display: block;
  aspect-ratio: 1;
}
.pics__item img {
  transition: transform 1.2s var(--ease-out);
}
.pics__item:hover img {
  transform: scale(1.06);
}
.pics__item--0 {
  grid-column: 1 / 5;
}
.pics__item--1 {
  grid-column: 6 / 10;
  margin-top: 8vw;
}
.pics__item--2 {
  grid-column: 10 / 13;
  margin-top: 2vw;
}
.pics__item--3 {
  grid-column: 2 / 5;
}
.pics__item--4 {
  grid-column: 5 / 9;
  margin-top: 6vw;
}
.pics__item--5 {
  grid-column: 9 / 13;
  margin-top: 12vw;
}

/* ---------------- INFOS ---------------- */
.infos {
  border-top: 1px solid color-mix(in srgb, var(--ink) 15%, transparent);
}
.infos__grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: clamp(2.5rem, 6vw, 7rem);
}
.infos__title {
  margin: 1.2rem 0 2.5rem;
}
.infos__addr {
  margin-top: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.infos__addr p {
  margin: 0;
  font-size: 1.3rem;
  line-height: 1.35;
}
.infos__expo {
  margin: 1.6rem 0 0;
  padding: 1.4rem 1.6rem;
  background: var(--stone);
  font-size: 1rem;
}
.infos__expo .script {
  display: block;
  font-size: 2.2rem;
  color: var(--cobalt);
  margin-bottom: 0.3rem;
}

/* ---------------- RESPONSIVE ---------------- */
@media (max-width: 960px) {
  .hero__meta-mid {
    display: none;
  }
  .hero {
    min-height: 82svh;
  }
  .hero__title {
    padding-bottom: 22vh;
  }
  .reveal {
    margin-top: -26svh;
  }
  .reveal__frame {
    width: 90vw;
  }
  .manifesto__grid,
  .foca__grid,
  .slate__head,
  .team__grid,
  .infos__grid {
    grid-template-columns: 1fr;
  }
  .foca__badge {
    right: 1rem;
  }
  .person--alt {
    margin-top: 0;
  }
  .slate__row {
    grid-template-columns: 1fr auto;
    grid-template-areas: 'name thumb' 'sub thumb' 'tag thumb';
    gap: 0.2rem 1rem;
    align-items: center;
  }
  .slate__num {
    display: none;
  }
  .slate__name {
    grid-area: name;
  }
  .slate__sub {
    grid-area: sub;
  }
  .slate__tag {
    grid-area: tag;
  }
  .slate__thumb {
    display: block;
    grid-area: thumb;
    width: 84px;
    height: 84px;
    object-fit: cover;
  }
  .slate__preview {
    display: none;
  }

  .spaces__track {
    flex-direction: column;
    width: auto;
    height: auto;
  }
  .spaces__intro {
    width: auto;
    padding: 5rem var(--gutter) 2rem;
  }
  .space {
    width: auto;
    grid-template-columns: 1fr;
    padding: 2rem var(--gutter) 3rem;
    border-left: 0;
    border-top: 1px solid color-mix(in srgb, var(--ink) 15%, transparent);
  }
  .space__img {
    aspect-ratio: 4 / 3;
  }
  .space__img img {
    width: 100%;
    left: 0;
  }
  .space__top {
    margin-bottom: 0;
  }
  .spaces__progress {
    display: none;
  }

  .pics__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .pics__item[class*='pics__item--'] {
    grid-column: auto;
    margin-top: 0;
  }
  .pics__item:nth-child(even) {
    margin-top: 2.5rem;
  }
}
</style>
