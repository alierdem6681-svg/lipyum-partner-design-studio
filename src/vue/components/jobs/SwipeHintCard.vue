<script setup>
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  text: {
    type: String,
    default: "Beğenmediğin işleri sola kaydır, beğendiklerini inceleyip hemen iletişime geç.",
  },
});

defineEmits(["advance"]);
</script>

<template>
  <section class="job-swipe-bottom-hint" data-testid="job-swipe-bottom-hint">
    <span class="job-swipe-bottom-hint__icon" aria-hidden="true">
      <AppIcon name="sparkles" :size="23" />
    </span>
    <p>{{ text }}</p>
    <button type="button" class="job-swipe-bottom-hint__button" @click="$emit('advance')">
      <AppIcon name="chevron-left" :size="18" />
      <span>Sıradaki iş</span>
    </button>
  </section>
</template>
