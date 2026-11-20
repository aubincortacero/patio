<script setup lang="ts">
defineProps<{ title: string; eyebrow: string }>()
const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <div ref="root" class="legal">
    <header class="wrap legal__head">
      <span class="eyebrow">{{ eyebrow }}</span>
      <h1 class="display h-lg" data-split>{{ title }}</h1>
    </header>
    <div class="wrap legal__body" data-fade>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.legal {
  padding-bottom: clamp(5rem, 10vw, 9rem);
}
.legal__head {
  padding-top: calc(var(--header-h) + clamp(3rem, 8vw, 7rem));
  padding-bottom: 3rem;
  display: grid;
  gap: 1.2rem;
}
.legal__body {
  max-width: 900px;
  margin-left: var(--gutter);
}
.legal__body :deep(h2) {
  font-family: var(--f-display);
  font-weight: 400;
  font-size: 2rem;
  letter-spacing: 0.02em;
  margin: 2.5rem 0 0.6rem;
}
.legal__body :deep(p),
.legal__body :deep(li) {
  max-width: 44rem;
}
.legal__body :deep(.todo) {
  background: color-mix(in srgb, var(--ochre) 30%, transparent);
  padding: 0 0.3em;
}
</style>
