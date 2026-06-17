<script setup>
import AppIcon from "./AppIcon.vue";

const emit = defineEmits(["back", "right"]);
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  showBack: { type: Boolean, default: true },
  rightIcon: { type: String, default: "" },
  rightLabel: { type: String, default: "" },
});
</script>

<template>
  <header class="v-header v-app-header">
    <button
      v-if="showBack"
      class="v-header__action"
      type="button"
      aria-label="Geri dön"
      @click="emit('back')"
    >
      <AppIcon name="chevron-left" :size="22" />
    </button>
    <span v-else class="v-header__spacer" aria-hidden="true" />

    <div class="v-header__copy">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <button
      v-if="rightIcon"
      class="v-header__action"
      type="button"
      :aria-label="rightLabel || title"
      @click="emit('right')"
    >
      <AppIcon :name="rightIcon" :size="22" />
    </button>
    <span v-else class="v-header__spacer" aria-hidden="true" />
  </header>
</template>
