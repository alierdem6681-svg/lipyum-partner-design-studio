<script setup>
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  items: { type: Array, default: () => [] },
  tone: { type: String, default: "success" },
});
</script>

<template>
  <ul class="subscription-benefit-list">
    <li v-for="item in items" :key="item" class="subscription-benefit-list__item">
      <span :class="['subscription-benefit-list__icon', `is-${tone}`]" aria-hidden="true">
        <AppIcon name="check" :size="17" />
      </span>
      <span>{{ item }}</span>
    </li>
  </ul>
</template>
