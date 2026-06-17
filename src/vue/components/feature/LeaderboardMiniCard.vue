<script setup>
import AppCard from "../ui/AppCard.vue";
import AppBadge from "../ui/AppBadge.vue";

defineProps({
  rank: { type: String, default: "#37" },
  score: { type: String, default: "845 puan" },
  title: { type: String, default: "Sıralamadaki Konumun" },
});
</script>

<template>
  <AppCard padding="sm" variant="compact" class="v-feature-card">
    <div class="v-feature-card__top">
      <h3>{{ title }}</h3>
      <AppBadge tone="success">{{ rank }}</AppBadge>
    </div>
    <p>{{ score }}</p>
  </AppCard>
</template>
