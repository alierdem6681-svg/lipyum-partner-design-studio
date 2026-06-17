<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";

const props = defineProps({
  variant: { type: String, default: "primary" },
  size: { type: String, default: "md" },
  fullWidth: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  icon: { type: String, default: "" },
  iconRight: { type: String, default: "" },
  type: { type: String, default: "button" },
});

const variantClasses = {
  primary: "v-btn--primary",
  secondary: "v-btn--secondary",
  ghost: "v-btn--ghost",
  danger: "v-btn--danger",
  subtle: "v-btn--subtle",
};

const sizeClasses = {
  sm: "v-btn--sm",
  md: "v-btn--md",
  lg: "v-btn--lg",
};

const classes = computed(() => [
  "v-btn",
  variantClasses[props.variant] || variantClasses.primary,
  sizeClasses[props.size] || sizeClasses.md,
  props.fullWidth ? "v-btn--full" : "",
  props.loading ? "is-loading" : "",
]);
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled || loading">
    <AppIcon v-if="icon" :name="icon" :size="18" />
    <span class="v-btn__label"><slot /></span>
    <AppIcon v-if="iconRight" :name="iconRight" :size="18" />
  </button>
</template>
