<script setup>
defineProps({
  rows: { type: Number, default: 3 },
});
</script>

<template>
  <section class="grid gap-3" aria-hidden="true">
    <span
      v-for="index in rows"
      :key="index"
      class="h-16 animate-pulse rounded-card bg-slate-100"
    />
  </section>
</template>
