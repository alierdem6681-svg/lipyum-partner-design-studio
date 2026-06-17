<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  ariaLabel: { type: String, default: "Kaydırmalı kart listesi" },
});
</script>

<template>
  <section class="-mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 py-1 [-webkit-overflow-scrolling:touch]" :aria-label="ariaLabel">
    <article v-for="item in items" :key="item.id || item.title" class="w-[82%] shrink-0 snap-start">
      <slot :item="item" />
    </article>
  </section>
</template>
