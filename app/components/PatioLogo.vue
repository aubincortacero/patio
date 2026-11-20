<script setup lang="ts">
withDefaults(defineProps<{ light?: boolean; tag?: boolean; minimal?: boolean }>(), { light: false, tag: true, minimal: false })
</script>

<template>
  <span class="logo" :class="{ 'logo--light': light }" aria-label="Le Patio, table pyrénéenne">
    <span v-if="!minimal" class="logo__le script" aria-hidden="true">le</span>
    <span class="logo__patio display" aria-hidden="true">Patio</span>
    <span v-if="tag && !minimal" class="logo__tag script" aria-hidden="true">table pyrénéenne</span>
  </span>
</template>

<style scoped>
.logo {
  --c: var(--ink);
  position: relative;
  display: inline-grid;
  justify-items: center;
  color: var(--c);
  font-size: var(--logo-size, 14px);
  line-height: 1;
  padding-bottom: 0.2em;
}
.logo--light {
  --c: var(--cream);
}
.logo__le {
  font-size: 1.7em;
  margin-bottom: -0.3em;
  transform: translateX(-0.15em);
}
.logo__patio {
  font-size: 4.6em;
  letter-spacing: 0.06em;
  line-height: 0.82;
  transform: scaleY(1.08);
  padding-left: 0.06em;
}
.logo__tag {
  font-size: 1.75em;
  white-space: nowrap;
  margin-top: -0.12em;
  transform: translateX(-0.1em);
}
</style>
