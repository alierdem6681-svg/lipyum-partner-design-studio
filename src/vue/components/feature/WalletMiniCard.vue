<script setup>
import AppCard from "../ui/AppCard.vue";
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  title: { type: String, default: "Cüzdan" },
  amount: { type: String, default: "675" },
  unit: { type: String, default: "kredi" },
  icon: { type: String, default: "wallet" },
});
</script>

<template>
  <AppCard padding="sm" variant="compact" class="v-feature-card">
    <div class="v-feature-card__top">
      <h3>{{ title }}</h3>
      <AppIcon :name="icon" :size="22" />
    </div>
    <div>
      <span class="v-feature-card__metric">{{ amount }}</span>
      <p>{{ unit }}</p>
    </div>
  </AppCard>
</template>
