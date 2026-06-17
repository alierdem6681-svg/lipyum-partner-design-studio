<script setup>
import { computed } from "vue";

const props = defineProps({
  tone: { type: String, default: "neutral" },
  count: { type: [Number, String], default: "" },
});

const toneClasses = {
  neutral: "v-badge--neutral",
  success: "v-badge--success",
  info: "v-badge--info",
  warning: "v-badge--warning",
  danger: "v-badge--danger",
  premium: "v-badge--premium",
  notification: "v-badge--notification",
};

const classes = computed(() => ["v-badge", toneClasses[props.tone] || toneClasses.neutral]);
</script>

<template>
  <span :class="classes">
    <slot>{{ count }}</slot>
  </span>
</template>
