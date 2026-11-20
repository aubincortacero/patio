<script setup lang="ts">
const { hours } = useSite()
const today = ref(-1)
onMounted(() => {
  const wd = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short' }).format(new Date())
  today.value = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(wd)
})
</script>

<template>
  <table class="hours">
    <thead>
      <tr>
        <th scope="col"><span class="sr">Jour</span></th>
        <th scope="col">Midi</th>
        <th scope="col">Soir</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(h, i) in hours" :key="h.day" :class="{ 'is-today': i === today, 'is-closed': !h.lunch && !h.dinner }">
        <th scope="row">
          {{ h.day }}
          <span v-if="i === today" class="hours__today">aujourd'hui</span>
        </th>
        <td>{{ fmtService(h.lunch) }}</td>
        <td>{{ fmtService(h.dinner) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.hours {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--f-narrow);
  font-size: clamp(1.05rem, 1rem + 0.4vw, 1.3rem);
}
thead th {
  text-align: left;
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.6;
  padding-bottom: 0.8rem;
}
tbody tr {
  border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  transition: background 0.3s;
}
tbody tr:last-child {
  border-bottom: 1px solid color-mix(in srgb, currentColor 18%, transparent);
}
tbody th,
td {
  padding: 0.85rem 0;
  text-align: left;
  font-weight: 400;
}
tbody th {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  width: 40%;
}
.is-closed td {
  opacity: 0.4;
}
.is-today {
  background: color-mix(in srgb, var(--ochre) 18%, transparent);
}
.is-today th {
  padding-left: 0.8rem;
}
.hours__today {
  font-family: var(--f-script);
  text-transform: none;
  letter-spacing: 0;
  font-weight: 400;
  font-size: 1.5em;
  margin-left: 0.4rem;
  color: var(--cobalt);
}
.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
</style>
