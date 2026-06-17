<script setup>
const props = defineProps({
  title: { type: String, default: "" },
  compact: { type: Boolean, default: false },
});
</script>

<template>
  <main :class="['v-page', compact ? 'v-page--compact' : '']" :aria-label="title || undefined">
    <slot />
  </main>
</template>
