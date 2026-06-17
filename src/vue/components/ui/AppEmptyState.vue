<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  icon: { type: String, default: "message" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
});
</script>

<template>
  <div class="v-empty">
    <div>
      <span class="v-empty__icon">
        <AppIcon :name="icon" :size="24" />
      </span>
      <h3>{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
      <slot />
    </div>
  </div>
</template>
