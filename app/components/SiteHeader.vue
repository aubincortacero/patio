<script setup lang="ts">
const { site } = useSite()
const route = useRoute()

const links = [
  { to: '/carte', label: 'La carte' },
  { to: '/#lieu', label: 'Le lieu' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/infos', label: 'Infos & accès' },
]

const open = ref(false)
const hidden = ref(false)
const scrolled = ref(false)
const menuEl = ref<HTMLElement | null>(null)

watch(() => route.fullPath, () => (open.value = false))

watch(open, (v) => {
  const { $lenis, $gsap } = useNuxtApp()
  const lenis = $lenis as import('lenis').default
  const gsap = $gsap as typeof import('gsap').gsap
  if (v) lenis.stop()
  else lenis.start()
  if (!menuEl.value) return
  const items = menuEl.value.querySelectorAll('.menu__item > *')
  if (v) {
    gsap.set(menuEl.value, { visibility: 'visible' })
    gsap.fromTo(menuEl.value, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
    gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.06, delay: 0.35 })
  } else {
    gsap.to(menuEl.value, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.7,
      ease: 'expo.inOut',
      onComplete: () => {
        if (menuEl.value) gsap.set(menuEl.value, { visibility: 'hidden' })
      },
    })
  }
})

onMounted(() => {
  const { $lenis } = useNuxtApp()
  const lenis = $lenis as import('lenis').default
  lenis.on('scroll', ({ scroll, direction }: { scroll: number; direction: number }) => {
    scrolled.value = scroll > 40
    if (open.value) return
    if (scroll < 200) hidden.value = false
    else if (direction === 1) hidden.value = true
    else if (direction === -1) hidden.value = false
  })
})
</script>

<template>
  <header class="header" :class="{ 'is-hidden': hidden, 'is-scrolled': scrolled, 'is-open': open }">
    <div class="header__inner wrap">
      <NuxtLink to="/" class="header__logo" aria-label="Le Patio — accueil">
        <PatioLogo minimal />
      </NuxtLink>

      <nav class="header__nav" aria-label="Navigation principale">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="header__link link-line"
          :active-class="l.to.includes('#') ? 'is-anchor' : undefined"
        >{{ l.label }}</NuxtLink>
      </nav>

      <div class="header__right">
        <ClientOnly><OpenStatus class="header__status" /></ClientOnly>
        <a :href="site.socials.instagram" target="_blank" rel="noopener" class="header__icon" aria-label="Instagram">
          <PatioIcon name="instagram" />
        </a>
        <a :href="site.socials.facebook" target="_blank" rel="noopener" class="header__icon" aria-label="Facebook">
          <PatioIcon name="facebook" />
        </a>
        <a :href="site.phones[0]!.href" class="btn header__cta">Réserver</a>
        <button class="header__burger" :aria-expanded="open" aria-controls="menu" aria-label="Menu" @click="open = !open">
          <span /><span />
        </button>
      </div>
    </div>

    <div id="menu" ref="menuEl" class="menu">
      <div class="menu__inner wrap">
        <nav class="menu__nav">
          <div v-for="(l, i) in [{ to: '/', label: 'Accueil' }, ...links]" :key="l.to" class="menu__item">
            <NuxtLink :to="l.to" class="display" @click="open = false">
              <small class="narrow">0{{ i + 1 }}</small>{{ l.label }}
            </NuxtLink>
          </div>
        </nav>
        <div class="menu__foot">
          <div class="menu__item"><a :href="site.phones[0]!.href" class="lead">{{ site.phones[0]!.display }}</a></div>
          <div class="menu__item"><span>{{ site.address.street }}, {{ site.address.city }}</span></div>
          <div class="menu__item menu__socials">
            <a :href="site.socials.instagram" target="_blank" rel="noopener">Instagram</a>
            <a :href="site.socials.facebook" target="_blank" rel="noopener">Facebook</a>
          </div>
          <span class="script menu__script">à très vite !</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  transition: transform 0.7s var(--ease-out);
}
.header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: color-mix(in srgb, var(--cream) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
  opacity: 0;
  transition: opacity 0.5s;
}
.header.is-scrolled::before {
  opacity: 1;
}
.header.is-hidden {
  transform: translateY(-100%);
}
.header.is-open::before {
  opacity: 0;
}
.header__inner {
  position: relative;
  z-index: 2;
  height: var(--header-h);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
}
.header__logo {
  justify-self: start;
  --logo-size: 11px;
  transition: color 0.4s;
}
.is-open .header__logo :deep(.logo) {
  --c: var(--cream);
}
.header__nav {
  display: flex;
  gap: clamp(1.4rem, 2.6vw, 2.8rem);
  font-family: var(--f-narrow);
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.header__right {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 1.1rem;
}
.header__status {
  margin-right: 0.6rem;
}
.header__icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ink) 25%, transparent);
  transition: background 0.3s, color 0.3s;
}
.header__icon svg {
  width: 17px;
  height: 17px;
}
.header__icon:hover {
  background: var(--ink);
  color: var(--cream);
}
.header__cta {
  padding: 0.85em 1.3em;
  font-size: 0.85rem;
}
.header__burger {
  display: none;
  width: 44px;
  height: 44px;
  position: relative;
}
.header__burger span {
  position: absolute;
  left: 10px;
  right: 10px;
  height: 1.5px;
  background: currentColor;
  transition: transform 0.5s var(--ease-out), background 0.3s;
}
.header__burger span:first-child {
  top: 17px;
}
.header__burger span:last-child {
  top: 26px;
}
.is-open .header__burger {
  color: var(--cream);
}
.is-open .header__burger span:first-child {
  transform: translateY(4.5px) rotate(45deg);
}
.is-open .header__burger span:last-child {
  transform: translateY(-4.5px) rotate(-45deg);
}

/* ----- menu plein écran ----- */
.menu {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: var(--ink);
  color: var(--cream);
  visibility: hidden;
  clip-path: inset(0 0 100% 0);
}
.menu__inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: calc(var(--header-h) + 4vh);
  padding-bottom: 2.5rem;
}
.menu__item {
  overflow: hidden;
}
.menu__item > * {
  display: inline-block;
}
.menu__nav a {
  font-size: clamp(3.4rem, 13vw, 7rem);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.menu__nav small {
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  opacity: 0.5;
  margin-top: 0.6em;
}
.menu__foot {
  position: relative;
  display: grid;
  gap: 0.4rem;
  font-family: var(--f-narrow);
}
.menu__socials {
  display: flex;
  gap: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.85rem;
  margin-top: 0.8rem;
}
.menu__socials > a {
  margin-right: 1.5rem;
}
.menu__script {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 3rem;
  color: var(--stone-2);
  transform: rotate(-6deg);
}

@media (max-width: 1180px) {
  .header__status {
    display: none;
  }
}
@media (max-width: 960px) {
  :root {
    --header-h: 72px;
  }
  .header__inner {
    grid-template-columns: 1fr auto;
  }
  .header__nav,
  .header__icon {
    display: none;
  }
  .header__burger {
    display: block;
  }
  .header__logo {
    --logo-size: 8px;
  }
}
@media (max-width: 420px) {
  .header__cta {
    display: none;
  }
}
</style>
