<script setup>
import { computed } from "vue";

const props = defineProps({
  padding: { type: String, default: "md" },
  variant: { type: String, default: "default" },
  as: { type: String, default: "section" },
});

const paddingClasses = {
  none: "v-card--p-none",
  sm: "v-card--p-sm",
  md: "v-card--p-md",
  lg: "v-card--p-lg",
};

const variantClasses = {
  default: "v-card--default",
  compact: "v-card--compact",
  elevated: "v-card--elevated",
  hero: "v-card--hero",
};

const classes = computed(() => [
  "v-card",
  paddingClasses[props.padding] || paddingClasses.md,
  variantClasses[props.variant] || variantClasses.default,
]);
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
