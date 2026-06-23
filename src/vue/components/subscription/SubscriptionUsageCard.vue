<script setup>
import AppCard from "../ui/AppCard.vue";
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  items: { type: Array, default: () => [] },
});
</script>

<template>
  <AppCard class="subscription-usage-card" data-testid="subscription-used-benefits">
    <h3>BU AY KULLANDIĞIN AVANTAJLAR</h3>
    <ul>
      <li v-for="item in items" :key="item.label">
        <span><AppIcon :name="item.icon" :size="21" /></span>
        <strong>{{ item.label }}</strong>
        <em>{{ item.value }}</em>
      </li>
    </ul>
  </AppCard>
</template>
