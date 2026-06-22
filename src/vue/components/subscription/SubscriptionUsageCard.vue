<script setup>
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  items: { type: Array, default: () => [] },
});
</script>

<template>
  <section class="subscription-usage-card" data-testid="subscription-usage-card">
    <h3>Bu ay kullandığın avantajlar</h3>
    <div class="subscription-usage-card__list">
      <div v-for="item in items" :key="item.label" class="subscription-usage-card__item">
        <span aria-hidden="true"><AppIcon :name="item.icon" :size="20" /></span>
        <strong>{{ item.label }}</strong>
        <em>{{ item.value }}</em>
      </div>
    </div>
  </section>
</template>
