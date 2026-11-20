import { hours, fmtHour } from './useSite'

/** Statut "ouvert / fermé" calculé à l'heure de Paris, côté client. */
export function useOpenStatus() {
  const status = ref<{ open: boolean; label: string } | null>(null)

  const compute = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Paris',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date())
    const wd = parts.find((p) => p.type === 'weekday')!.value
    const h = Number(parts.find((p) => p.type === 'hour')!.value)
    const m = Number(parts.find((p) => p.type === 'minute')!.value)
    const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(wd)
    const now = h + m / 60

    const today = hours[day]!
    for (const s of [today.lunch, today.dinner]) {
      if (s && now >= s[0] && now < s[1]) {
        return { open: true, label: `Ouvert · jusqu'à ${fmtHour(s[1])}` }
      }
    }
    // Prochain service
    for (let i = 0; i < 8; i++) {
      const d = hours[(day + i) % 7]!
      for (const s of [d.lunch, d.dinner]) {
        if (!s) continue
        if (i === 0 && s[0] <= now) continue
        const when = i === 0 ? "aujourd'hui" : i === 1 ? 'demain' : d.day.toLowerCase()
        return { open: false, label: `Fermé · ouvre ${when} à ${fmtHour(s[0])}` }
      }
    }
    return { open: false, label: 'Fermé' }
  }

  let id: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    status.value = compute()
    id = setInterval(() => (status.value = compute()), 60_000)
  })
  onBeforeUnmount(() => clearInterval(id))

  return status
}
