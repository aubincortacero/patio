<script setup lang="ts">
const { site } = useSite()
useSeoMeta({ title: 'Politique de confidentialité — Le Patio' })
</script>

<template>
  <LegalPage eyebrow="Vos données" title="Confidentialité">
    <h2>Données collectées</h2>
    <p>
      Ce site ne contient aucun formulaire et ne collecte aucune donnée personnelle. Les réservations se font par
      téléphone.
    </p>

    <h2>Cookies et services tiers</h2>
    <p>
      Aucun cookie de mesure d'audience ou publicitaire n'est déposé. La carte Google Maps n'est chargée que si vous
      cliquez sur « Afficher la carte » : Google peut alors déposer ses propres cookies, selon sa
      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" class="link-line">politique de confidentialité</a>.
    </p>
    <p>
      Les avis Google sont récupérés par notre serveur : votre navigateur ne contacte Google que pour afficher la photo
      de profil des auteurs d'avis.
    </p>

    <h2>Contact</h2>
    <p>Pour toute question : {{ site.phones[0]!.display }} — {{ site.address.street }}, {{ site.address.zip }} {{ site.address.city }}.</p>
  </LegalPage>
</template>
