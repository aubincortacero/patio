<script setup lang="ts">
const { site } = useSite()
useSeoMeta({ title: 'Mentions légales — Le Patio' })
</script>

<template>
  <LegalPage eyebrow="Informations" title="Mentions légales">
    <h2>Éditeur du site</h2>
    <p>
      Restaurant Le Patio — table pyrénéenne<br />
      {{ site.address.street }}, {{ site.address.zip }} {{ site.address.city }}<br />
      Téléphone : {{ site.phones[0]!.display }}<br />
      Raison sociale : <span class="todo">[à compléter]</span> — SIRET : <span class="todo">[à compléter]</span><br />
      Directeur de la publication : <span class="todo">[à compléter]</span>
    </p>

    <h2>Hébergement</h2>
    <p><span class="todo">[Nom, adresse et téléphone de l'hébergeur à compléter]</span></p>

    <h2>Propriété intellectuelle</h2>
    <p>
      L'ensemble des contenus de ce site (textes, logo, photographies) est la propriété du restaurant Le Patio ou de
      leurs auteurs respectifs. Crédits photos : {{ site.credits }}. Toute reproduction sans autorisation est interdite.
    </p>

    <h2>Avis clients</h2>
    <p>
      Les avis affichés sur ce site proviennent de Google et sont repris tels quels, avec le nom de leur auteur, via
      l'API Google Places. Ils ne sont ni modifiés ni sélectionnés manuellement.
    </p>
  </LegalPage>
</template>
