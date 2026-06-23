<script setup>
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  benefits: { type: Array, default: () => [] },
  tone: { type: String, default: "green" },
});
</script>

<template>
  <ul class="subscription-benefit-list">
    <li v-for="benefit in benefits" :key="benefit" class="subscription-benefit-list__item">
      <span :class="['subscription-benefit-list__icon', `is-${tone}`]" aria-hidden="true">
        <AppIcon name="check" :size="17" />
      </span>
      <span>{{ benefit }}</span>
    </li>
  </ul>
</template>
