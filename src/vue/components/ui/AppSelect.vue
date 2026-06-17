<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  label: { type: String, required: true },
});
</script>

<template>
  <button class="v-select" type="button" :aria-label="label">
    <span class="v-select__label">{{ label }}</span>
    <AppIcon name="chevron-right" :size="18" />
  </button>
</template>
