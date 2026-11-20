import type { PatioReview } from '../api/reviews.get'

/**
 * Sélection manuelle d'avis Google, utilisée quand l'API Places n'est pas configurée.
 *
 * Avis copiés tels quels depuis la fiche Google du Patio (texte non modifié).
 * Auteurs et dates non renseignés : ajoutez `author` (nom affiché par Google)
 * et `when` (ex. « il y a 2 mois ») si vous les avez.
 */
export const manualReviews: PatioReview[] = [
  {
    author: 'Avis Google',
    rating: 5,
    text: "Superbe soirée, anniversaire de ma femme, les plats étaient succulent, le vin aussi, le patron est super sympa, nous reviendrons car les produits sont de qualité et frais",
    when: '',
  },
  {
    author: 'Avis Google',
    rating: 5,
    text: "Tout juste excellent. Bravo au chef Filippé... A la hauteur de sa réputation .et merci aussi pour le plat sur mesure pour notre végétarienne.. C était divin.",
    when: '',
  },
  {
    author: 'Avis Google',
    rating: 5,
    text: "Ce restaurant un peu coincé dans la rue mérite le détour. Façade bleue et jaune, petite terrasse, il se définit comme une table pyrénéenne. À l'intérieur, une salle moderne, des mange-debout, des chaises métal, un grand bar et en retrait un patio sympa. En cuisine, Mario vous régale de viandes locales ou toujours pyrénéennes, choisies pour leur qualité gustative. Ici tout est maison, des tapas au dessert. Mounjetado, tartiflette. Une cuisine pleine de parfums, de saveurs et d'originalité. Valentin, en salle, associe sympathie et professionnalisme. Adresse Futée !",
    when: '',
  },
  {
    author: 'Avis Google',
    rating: 5,
    text: "Absolument excellent. Les entrées, plats et desserts étaient parfaits, c’était tout simplement délicieux. Les cocktails étaient eux aussi exceptionnels (le london mule au sirop de basilic était incroyable). Le service, lui aussi était au niveau des plats, les serveurs/patron étaient hyper agréables et au top niveau recommandation.\nEn gros, ce restaurant mérite largement sa place de meilleur restaurant d’Ax.",
    when: '',
  },
  {
    author: 'Avis Google',
    rating: 5,
    text: "Très belle expérience dans ce restaurant, que ce soit dans l’assiette ou dans ce charmant patio où nous nous sommes régalés. Merci à Filipé pour ses bons petits plats, copieux et délicieux, ainsi qu’au serveur qui nous a gentiment servis avec le sourire. Nous reviendrons avec plaisir.\nJe recommande ++",
    when: '',
  },
]
