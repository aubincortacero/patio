<script setup lang="ts">
defineProps<{ name: 'arrow' | 'arrow-up-right' | 'phone' | 'facebook' | 'instagram' | 'star' | 'pin' | 'close' | 'google' }>()
</script>

<template>
  <svg v-if="name === 'arrow'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <path d="M3 12h17M14 6l6 6-6 6" />
  </svg>
  <svg v-else-if="name === 'arrow-up-right'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
  <svg v-else-if="name === 'phone'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
  <svg v-else-if="name === 'facebook'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21h2.9Z" />
  </svg>
  <svg v-else-if="name === 'instagram'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="0" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
  <svg v-else-if="name === 'star'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 2.8 2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 17l-5.8 3.3 1.4-6.4L2.7 9.5l6.5-.7L12 2.8Z" />
  </svg>
  <svg v-else-if="name === 'pin'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
  <svg v-else-if="name === 'close'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
  <svg v-else-if="name === 'google'" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" />
    <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z" />
    <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6Z" />
  </svg>
</template>
