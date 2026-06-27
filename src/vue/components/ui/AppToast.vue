<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  message: { type: String, default: "" },
  tone: { type: String, default: "success" },
});

const toneClasses = {
  success: "is-success",
  warning: "is-warning",
  danger: "is-danger",
  neutral: "is-neutral",
};
</script>

<template>
  <div v-if="message" class="v-toast-region" aria-live="polite" aria-atomic="true" data-testid="app-toast-region">
    <output id="toast" :class="['v-toast', toneClasses[tone] || toneClasses.success]" data-testid="app-toast" role="status">
      <span class="v-toast__icon" aria-hidden="true">
        <AppIcon name="check" :size="16" />
      </span>
      <span class="v-toast__message">{{ message }}</span>
    </output>
  </div>
</template>

<style scoped>
.v-toast-region {
  position: absolute;
  inset-inline: 0;
  bottom: calc(var(--bottom-safe-height, 92px) + 14px);
  z-index: 60;
  display: flex;
  justify-content: center;
  padding-inline: var(--page-x-padding, 12px);
  pointer-events: none;
}

.v-toast {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: center;
  width: min(100%, 372px);
  min-height: 52px;
  gap: 10px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 30%, var(--color-border));
  border-radius: 18px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-primary-soft) 64%, white), var(--color-surface) 68%),
    var(--color-surface);
  box-shadow: var(--shadow-elevated);
  color: var(--text-primary);
  padding: 10px 12px;
}

.v-toast__icon {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 999px;
  background: var(--color-primary-dark);
  color: white;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--color-primary-dark) 24%, transparent);
}

.v-toast__message {
  min-width: 0;
  color: var(--text-primary);
  font-size: var(--font-size-caption);
  font-weight: 850;
  line-height: 1.25;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.v-toast.is-warning {
  border-color: color-mix(in srgb, var(--color-warning) 36%, var(--color-border));
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 13%, white), var(--color-surface) 68%);
}

.v-toast.is-warning .v-toast__icon {
  background: var(--color-warning);
}

.v-toast.is-danger {
  border-color: color-mix(in srgb, var(--color-danger) 32%, var(--color-border));
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-danger) 10%, white), var(--color-surface) 68%);
}

.v-toast.is-danger .v-toast__icon {
  background: var(--color-danger);
}

.v-toast.is-neutral {
  border-color: color-mix(in srgb, var(--text-muted) 24%, var(--color-border));
  background: linear-gradient(135deg, var(--color-neutral-50), var(--color-surface) 70%);
}

.v-toast.is-neutral .v-toast__icon {
  background: var(--text-primary);
}
</style>
