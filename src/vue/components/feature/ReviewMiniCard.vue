<script setup>
import AppCard from "../ui/AppCard.vue";
import AppBadge from "../ui/AppBadge.vue";

defineProps({
  name: { type: String, default: "Elif Y." },
  score: { type: String, default: "5.0" },
  text: { type: String, default: "Hızlı dönüş yaptı, servis süreci çok düzenliydi." },
});
</script>

<template>
  <AppCard padding="sm" variant="compact" class="v-feature-card">
    <div class="v-feature-card__top">
      <h3>{{ name }}</h3>
      <AppBadge tone="warning">{{ score }}</AppBadge>
    </div>
    <p>{{ text }}</p>
  </AppCard>
</template>
