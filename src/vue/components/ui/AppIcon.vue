<script setup>
import { computed } from "vue";
import { legacySpriteNames } from "../../icons/svgSprite.js";

const props = defineProps({
  name: { type: String, default: "settings" },
  size: { type: [Number, String], default: 20 },
  strokeWidth: { type: [Number, String], default: 2.2 },
  color: { type: String, default: "currentColor" },
  ariaLabel: { type: String, default: "" },
  className: { type: String, default: "" },
});

const pixelSize = computed(() => Number(props.size) || 20);
const spriteName = computed(() => (legacySpriteNames.has(props.name) ? props.name : "settings"));
const spriteHref = computed(() => `#i-${spriteName.value}`);
</script>

<template>
  <svg
    :class="['v-icon', className]"
    :width="pixelSize"
    :height="pixelSize"
    :aria-hidden="ariaLabel ? undefined : 'true'"
    :aria-label="ariaLabel || undefined"
  >
    <use :href="spriteHref"></use>
  </svg>
</template>
