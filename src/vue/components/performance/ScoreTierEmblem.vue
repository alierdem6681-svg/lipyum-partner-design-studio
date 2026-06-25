<script setup>
import { computed } from "vue";
import AppIcon from "../ui/AppIcon.vue";

const props = defineProps({
  tier: { type: String, required: true },
  tone: { type: String, default: "legend" },
});

const normalizedTier = computed(() => props.tier.toLocaleUpperCase("tr-TR"));
const iconName = computed(() => {
  if (props.tone === "legend") return "crown";
  if (props.tone === "strong") return "star";
  return "shield";
});
</script>

<template>
  <span
    :class="['score-tier-emblem', `is-${tone}`]"
    role="img"
    :aria-label="`${normalizedTier} performans rozeti`"
  >
    <span class="score-tier-emblem__inner" aria-hidden="true">
      <AppIcon :name="iconName" :size="18" :stroke-width="2.4" />
      <strong>{{ normalizedTier }}</strong>
    </span>
  </span>
</template>

<style scoped>
.score-tier-emblem {
  width: 54px;
  height: 54px;
  display: inline-grid;
  place-items: center;
  border: 1px solid var(--color-primary-border);
  border-radius: var(--radius-pill);
  background:
    radial-gradient(circle at 50% 20%, var(--color-surface), transparent 42%),
    var(--color-primary-soft);
  color: var(--color-primary-dark);
  box-shadow: var(--shadow-soft);
}

.score-tier-emblem.is-legend {
  border-color: color-mix(in srgb, var(--color-premium-gold) 42%, var(--color-warning-border));
  background:
    radial-gradient(circle at 50% 18%, var(--color-surface), transparent 42%),
    var(--color-premium-gold-soft);
  color: var(--color-premium-gold);
}

.score-tier-emblem.is-strong {
  border-color: color-mix(in srgb, var(--color-neutral-400) 42%, var(--color-border));
  background:
    radial-gradient(circle at 50% 18%, var(--color-surface), transparent 42%),
    var(--color-neutral-100);
  color: var(--color-neutral-700);
}

.score-tier-emblem__inner {
  display: grid;
  justify-items: center;
  gap: 2px;
}

.score-tier-emblem strong {
  color: currentColor;
  font-size: var(--font-size-micro);
  font-weight: var(--weight-extra-bold);
  line-height: 1;
  letter-spacing: 0;
}
</style>
