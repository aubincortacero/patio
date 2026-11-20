export const site = {
  name: 'Le Patio',
  tagline: 'table pyrénéenne',
  city: 'Ax-les-Thermes',
  address: {
    street: '3 rue Victor Pilhes',
    zip: '09110',
    city: 'Ax-les-Thermes',
  },
  phones: [
    { label: 'Restaurant', display: '05 61 64 07 37', href: 'tel:+33561640737' },
    { label: 'Portable', display: '06 85 41 81 89', href: 'tel:+33685418189' },
  ],
  socials: {
    facebook: 'https://www.facebook.com/people/Le-Patio/61553739789248/',
    instagram: 'https://www.instagram.com/lepatio_tablepyreneenne/',
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Restaurant+Le+Patio+3+Rue+Victor+Pilhes+09110+Ax-les-Thermes',
  mapsEmbed:
    'https://www.google.com/maps?q=Restaurant+Le+Patio,+3+Rue+Victor+Pilhes,+09110+Ax-les-Thermes&z=16&output=embed',
  credits: 'Marion Kieu, Jules Gort et le restaurant Le Patio',
}

/** Horaires — index 0 = lundi. Chaque service : [ouverture, fermeture] en heures décimales. */
export type Service = [number, number]
export const hours: { day: string; short: string; lunch: Service | null; dinner: Service | null }[] = [
  { day: 'Lundi', short: 'Lun', lunch: null, dinner: null },
  { day: 'Mardi', short: 'Mar', lunch: null, dinner: [17, 22] },
  { day: 'Mercredi', short: 'Mer', lunch: [12, 14], dinner: [17, 22] },
  { day: 'Jeudi', short: 'Jeu', lunch: [12, 14], dinner: [17, 22] },
  { day: 'Vendredi', short: 'Ven', lunch: [12, 14], dinner: [17, 22] },
  { day: 'Samedi', short: 'Sam', lunch: [12, 14], dinner: [17, 22] },
  { day: 'Dimanche', short: 'Dim', lunch: null, dinner: null },
]

export const fmtHour = (h: number) => {
  const m = Math.round((h % 1) * 60)
  return `${Math.floor(h)}h${m ? String(m).padStart(2, '0') : ''}`
}
export const fmtService = (s: Service | null) => (s ? `${fmtHour(s[0])} – ${fmtHour(s[1])}` : 'Fermé')

export const spaces = [
  {
    n: '01',
    title: 'La terrasse bistro',
    seats: 12,
    inout: 'Extérieur',
    where: 'Sur la rue piétonne Victor Pilhes',
    text: "En extérieur, une terrasse bistro de 12 couverts sous le store, sur la rue piétonne Victor Pilhes.",
    img: '/images/facade-jour-2.png',
  },
  {
    n: '02',
    title: 'Le patio intime',
    seats: 14,
    inout: 'Extérieur',
    where: "À l'arrière du restaurant",
    text: "Toujours en extérieur, notre patio intime de 14 couverts, à l'abri des regards à l'arrière du restaurant.",
    img: null,
  },
  {
    n: '03',
    title: 'La salle côté bar',
    seats: 14,
    inout: 'Intérieur',
    where: 'Mange-debout & tabourets',
    text: "À l'intérieur, la salle côté bar de 14 couverts, équipée de mange-debout et de tabourets, pour profiter d'une atmosphère conviviale.",
    img: '/images/la-salle-du-bar-avec-des-manges-debouts.jpg',
  },
  {
    n: '04',
    title: 'La salle chalet',
    seats: 14,
    inout: 'Intérieur',
    where: 'Ambiance chalet de montagne',
    text: 'Une salle de 14 couverts, assis, pour déguster nos tapas, plats et desserts confectionnés maison dans une ambiance chalet de montagne.',
    img: '/images/salle-chalet-baie.png',
  },
]

export const dishes = [
  { name: "L'Azinat", sub: 'et sa rouzole', tag: 'Tradition ariégeoise', img: '/images/lazinat-et-sa-rouzole.jpg' },
  { name: 'La Mounjetado', sub: 'haricots & charcuterie', tag: 'Tradition ariégeoise', img: '/images/la-mounjetado.jpg' },
  { name: 'Côte de bœuf', sub: 'à partager', tag: 'Sur réservation', img: '/images/cote-de-boeuf.jpg' },
  { name: "Duo d'agneau", sub: 'des Pyrénées', tag: 'Viande', img: '/images/le-duo-dagneau.jpg' },
  { name: "Côtes d'agneau", sub: 'grillées', tag: 'Viande', img: '/images/les-cotes-dagneau-baronnes.jpg' },
  { name: 'Tartare de bœuf', sub: 'coupé au couteau', tag: 'Viande', img: '/images/tartare-de-boeuf.jpg' },
  { name: 'Tataki de bœuf', sub: 'mi-cuit', tag: 'Viande', img: '/images/tataki-de-boeuf.jpg' },
  { name: 'Risotto', sub: 'de saison', tag: 'Selon le marché', img: '/images/risotto.jpg' },
  { name: 'Croustade', sub: 'aux pommes', tag: 'Dessert maison', img: '/images/croustade-aux-pommes.jpg' },
]

export const producers = [
  "Truites d'Aston",
  "Fromages d'Unac",
  "Fromages d'Orgeix",
  'Focaccia maison',
  'Agneau des Pyrénées',
  'Viandes d’Ariège',
  'Légumes de saison',
  'Desserts maison',
]

export const gallery = [
  { src: '/images/facade-jour-2.png', alt: 'La façade jaune et bleue du Patio, rue Victor Pilhes' },
  { src: '/images/boeuf-legumes.png', alt: 'Bœuf tranché, légumes sautés et sésame' },
  { src: '/images/bar-cocktails.png', alt: "Le bar et l'ardoise des cocktails" },
  { src: '/images/cote-de-boeuf-grill.png', alt: 'Côte de bœuf saisie sur la plancha' },
  { src: '/images/salle-chalet-baie.png', alt: 'La salle chalet et sa baie vitrée' },
  { src: '/images/facade.jpg', alt: 'La façade du Patio, de nuit, rue Victor Pilhes' },
  { src: '/images/la-salle-du-bar-avec-des-manges-debouts.jpg', alt: 'La salle côté bar, pierre et porte bleue' },
  { src: '/images/cote-de-boeuf-2.jpg', alt: 'Découpe de la côte de bœuf en cuisine' },
  { src: '/images/lazinat-et-sa-rouzole.jpg', alt: "L'azinat et sa rouzole" },
  { src: '/images/la-salle-du-restaurant.jpg', alt: 'La salle chalet' },
  { src: '/images/tataki-de-boeuf.jpg', alt: 'Tataki de bœuf' },
  { src: '/images/la-cuisine.jpg', alt: 'En cuisine, tout est fait main' },
  { src: '/images/la-mounjetado.jpg', alt: 'La mounjetado' },
  { src: '/images/facade-2.jpg', alt: 'Le logo du Patio sur la vitrine' },
  { src: '/images/le-duo-dagneau.jpg', alt: "Le duo d'agneau" },
  { src: '/images/vin-rouge-pic-saint-loup.jpg', alt: 'Vin rouge Pic Saint-Loup' },
  { src: '/images/la-salle-du-restaurant-2.jpg', alt: 'La salle chalet vue d’en haut' },
  { src: '/images/tartare-de-boeuf.jpg', alt: 'Tartare de bœuf' },
  { src: '/images/cote-de-boeuf.jpg', alt: 'Côte de bœuf' },
  { src: '/images/risotto.jpg', alt: 'Risotto' },
  { src: '/images/les-cotes-dagneau-baronnes.jpg', alt: "Côtes d'agneau" },
  { src: '/images/croustade-aux-pommes.jpg', alt: 'Croustade aux pommes' },
  { src: '/images/les-menus.jpg', alt: 'La carte du Patio' },
]

export const useSite = () => ({ site, hours, spaces, dishes, producers, gallery })
