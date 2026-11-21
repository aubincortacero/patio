// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts'],
  css: ['~/assets/css/main.css'],

  fonts: {
    families: [
      { name: 'Bebas Neue', provider: 'google', global: true, weights: [400] },
      { name: 'Barlow Condensed', provider: 'google', global: true, weights: [300, 400, 500, 600] },
      { name: 'Barlow', provider: 'google', global: true, weights: [300, 400, 500, 600], styles: ['normal', 'italic'] },
      { name: 'Sacramento', provider: 'google', global: true, weights: [400] },
    ],
  },

  // Site NON référencé : en-tête X-Robots-Tag sur toutes les réponses (pages, images, API).
  // À retirer, avec la balise meta robots ci-dessous et public/robots.txt, pour la mise en ligne officielle.
  routeRules: {
    '/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex' } },
  },

  runtimeConfig: {
    // Clé Google Places API (New) — à définir dans .env : NUXT_GOOGLE_PLACES_KEY
    googlePlacesKey: '',
    // Optionnel : Place ID Google du restaurant — NUXT_GOOGLE_PLACE_ID
    // S'il est absent, il est retrouvé automatiquement via une recherche texte.
    googlePlaceId: '',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Le Patio — Table pyrénéenne à Ax-les-Thermes',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            "Le Patio, table pyrénéenne à Ax-les-Thermes. Cuisine maison, produits locaux et de saison, focaccia pétrie à la main. Terrasse, patio intime, salle bar et salle chalet.",
        },
        { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
        { name: 'theme-color', content: '#11126a' },
        { property: 'og:type', content: 'restaurant' },
        { property: 'og:title', content: 'Le Patio — Table pyrénéenne' },
        { property: 'og:image', content: '/images/facade.jpg' },
      ],
      link: [{ rel: 'icon', type: 'image/jpeg', href: '/images/le-patio-logo-en-300.jpg' }],
    },
  },
})
