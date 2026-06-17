<script setup>
import { computed } from "vue";
import { resolveIcon } from "../../icons/iconMap.js";

const props = defineProps({
  name: { type: String, default: "settings" },
  size: { type: [Number, String], default: 20 },
  strokeWidth: { type: [Number, String], default: 2.2 },
  color: { type: String, default: "currentColor" },
  ariaLabel: { type: String, default: "" },
  className: { type: String, default: "" },
});

const IconComponent = computed(() => resolveIcon(props.name));
const pixelSize = computed(() => Number(props.size) || 20);
</script>

<template>
  <component
    :is="IconComponent"
    :class="['v-icon', className]"
    :size="pixelSize"
    :stroke-width="Number(strokeWidth) || 2.2"
    :color="color"
    :aria-hidden="ariaLabel ? undefined : 'true'"
    :aria-label="ariaLabel || undefined"
  />
</template>
