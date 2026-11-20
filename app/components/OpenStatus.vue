<script setup lang="ts">
const status = useOpenStatus()
</script>

<template>
  <span class="status" :class="{ 'is-open': status?.open }" aria-live="polite">
    <span class="status__dot" />
    <span class="status__label">{{ status?.label ?? 'Horaires' }}</span>
  </span>
</template>

<style scoped>
.status {
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  font-family: var(--f-narrow);
  font-weight: 500;
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
}
.status__dot {
  position: relative;
  width: 7px;
  height: 7px;
  background: #b9563f;
  border-radius: 50%;
}
.is-open .status__dot {
  background: #3e9b61;
}
.is-open .status__dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid #3e9b61;
  animation: ping 1.8s var(--ease-out) infinite;
}
@keyframes ping {
  from {
    transform: scale(0.4);
    opacity: 1;
  }
  to {
    transform: scale(1.6);
    opacity: 0;
  }
}
</style>
