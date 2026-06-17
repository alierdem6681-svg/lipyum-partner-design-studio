<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";

const props = defineProps({
  tone: { type: String, default: "neutral" },
  selected: { type: Boolean, default: false },
  icon: { type: String, default: "" },
});

const toneClasses = {
  neutral: "v-chip--neutral",
  success: "v-chip--success",
  info: "v-chip--info",
  warning: "v-chip--warning",
  danger: "v-chip--danger",
};

const classes = computed(() => [
  "v-chip",
  toneClasses[props.tone] || toneClasses.neutral,
  props.selected ? "is-selected" : "",
]);
</script>

<template>
  <span :class="classes">
    <AppIcon v-if="icon" :name="icon" :size="15" />
    <span><slot /></span>
  </span>
</template>
