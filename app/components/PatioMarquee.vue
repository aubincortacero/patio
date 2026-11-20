<script setup lang="ts">
const props = withDefaults(defineProps<{ items: string[]; speed?: number; dark?: boolean }>(), { speed: 40, dark: false })

const track = ref<HTMLElement | null>(null)
let tween: gsap.core.Tween | undefined
let off: (() => void) | undefined

onMounted(() => {
  const { $gsap, $lenis, $reducedMotion } = useNuxtApp()
  const gsap = $gsap as typeof import('gsap').gsap
  const lenis = $lenis as import('lenis').default
  if (!track.value || $reducedMotion) return

  tween = gsap.to(track.value, { xPercent: -50, duration: props.speed, ease: 'none', repeat: -1 })

  // La vitesse et le sens suivent le scroll
  let dir = 1
  const onScroll = ({ velocity, direction }: { velocity: number; direction: number }) => {
    if (direction) dir = direction
    const boost = 1 + Math.min(Math.abs(velocity) * 0.12, 6)
    gsap.to(tween!, { timeScale: dir * boost, duration: 0.3, overwrite: true })
    gsap.to(tween!, { timeScale: dir, duration: 1.2, delay: 0.3, ease: 'power2.out' })
  }
  lenis.on('scroll', onScroll)
  off = () => lenis.off('scroll', onScroll)
})

onBeforeUnmount(() => {
  tween?.kill()
  off?.()
})
</script>

<template>
  <div class="mq" :class="{ 'mq--dark': dark }" aria-hidden="true">
    <div ref="track" class="mq__track">
      <template v-for="k in 2" :key="k">
        <span v-for="it in items" :key="k + it" class="mq__item">
          <span class="display">{{ it }}</span>
          <span class="mq__sep">✳</span>
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.mq {
  overflow: hidden;
  border-block: 1px solid color-mix(in srgb, var(--ink) 20%, transparent);
  padding-block: 1.1rem;
  background: var(--cream);
}
.mq--dark {
  background: var(--ink);
  color: var(--cream);
  border-color: transparent;
}
.mq__track {
  display: flex;
  width: max-content;
}
.mq__item {
  display: inline-flex;
  align-items: center;
  gap: 2.2rem;
  padding-right: 2.2rem;
  white-space: nowrap;
}
.mq__item .display {
  font-size: clamp(2.2rem, 5vw, 4.6rem);
  line-height: 1;
  padding-top: 0.08em;
}
.mq__sep {
  font-size: 1.4rem;
  color: var(--ochre);
}
</style>
