<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  ariaLabel: { type: String, default: "Kaydırmalı kart listesi" },
  edgeBleed: { type: Boolean, default: true },
});
</script>

<template>
  <section
    :class="[
      'flex snap-x snap-mandatory gap-3 overflow-x-auto py-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
      edgeBleed ? '-mx-3 px-3' : 'mx-0 px-0',
    ]"
    :aria-label="ariaLabel"
  >
    <article v-for="item in items" :key="item.id || item.title" :class="[edgeBleed ? 'w-[82%]' : 'w-[84%]', 'shrink-0 snap-start']">
      <slot :item="item" />
    </article>
  </section>
</template>
