<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  icon: { type: String, default: "settings" },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  right: { type: String, default: "chevron-right" },
});

const emit = defineEmits(["click"]);
</script>

<template>
  <button class="v-list-item" type="button" @click="emit('click')">
    <span class="v-list-item__icon">
      <AppIcon :name="icon" :size="21" />
    </span>
    <span class="v-list-item__copy">
      <strong class="v-list-item__title">{{ title }}</strong>
      <span v-if="subtitle" class="v-list-item__subtitle">{{ subtitle }}</span>
    </span>
    <AppIcon :name="right" :size="19" />
  </button>
</template>
