<script setup lang="ts">
// La carte Google n'est chargée qu'au clic : pas de cookies tiers sans action du visiteur.
const { site } = useSite()
const loaded = ref(false)
</script>

<template>
  <div class="map">
    <iframe
      v-if="loaded"
      :src="site.mapsEmbed"
      title="Plan d'accès au restaurant Le Patio"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    />
    <div v-else class="map__placeholder">
      <svg class="map__lines" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M-20 210 C 80 180, 120 240, 210 200 S 360 120, 430 150" />
        <path d="M-20 90 C 60 120, 140 60, 220 100 S 330 190, 430 170" />
        <path d="M150 -10 C 170 80, 130 160, 180 320" />
        <path d="M290 -10 C 260 90, 320 180, 270 320" />
        <path class="map__river" d="M-20 250 C 100 230, 160 280, 260 250 S 380 210, 430 230" />
      </svg>
      <div class="map__pin">
        <PatioIcon name="pin" />
        <span class="display">Le Patio</span>
      </div>
      <div class="map__actions">
        <button class="btn" @click="loaded = true">Afficher la carte</button>
        <a :href="site.mapsUrl" target="_blank" rel="noopener" class="btn btn--ghost">
          Itinéraire <PatioIcon name="arrow-up-right" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--stone);
  overflow: hidden;
}
iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  filter: grayscale(0.85) sepia(0.15) hue-rotate(190deg) saturate(1.6) contrast(0.95);
}
.map__placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 2rem;
}
.map__lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.map__lines path {
  fill: none;
  stroke: color-mix(in srgb, var(--ink) 18%, transparent);
  stroke-width: 1;
}
.map__lines .map__river {
  stroke: color-mix(in srgb, var(--cobalt) 40%, transparent);
  stroke-width: 6;
}
.map__pin {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.3rem;
}
.map__pin svg {
  width: 38px;
  height: 38px;
}
.map__pin .display {
  font-size: 2rem;
}
.map__actions {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
}
</style>
