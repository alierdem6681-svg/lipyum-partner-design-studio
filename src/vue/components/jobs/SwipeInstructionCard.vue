<script setup>
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  title: { type: String, default: "Sola kaydır, sıradaki işi gör" },
  description: { type: String, default: "Beğenmediğin işleri kolayca geç." },
});
</script>

<template>
  <section class="job-swipe-instruction" data-testid="job-swipe-instruction">
    <span class="job-swipe-instruction__icon" aria-hidden="true">
      <AppIcon name="hand" :size="32" />
    </span>
    <span class="job-swipe-instruction__copy">
      <strong>{{ title }}</strong>
      <small>{{ description }}</small>
    </span>
  </section>
</template>
