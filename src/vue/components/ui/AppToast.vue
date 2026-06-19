<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  message: { type: String, default: "" },
  tone: { type: String, default: "success" },
});

const toneClasses = {
  success: "bg-emerald-700 text-white",
  warning: "bg-amber-600 text-white",
  danger: "bg-red-600 text-white",
  neutral: "bg-slate-900 text-white",
};
</script>

<template>
  <output
    v-if="message"
    id="toast"
    class="fixed bottom-28 left-1/2 z-50 flex min-h-11 max-w-[86vw] -translate-x-1/2 items-center gap-2 rounded-pill px-4 text-caption font-bold shadow-elevated"
    :class="toneClasses[tone] || toneClasses.success"
  >
    <AppIcon name="check" :size="17" />
    <span class="truncate">{{ message }}</span>
  </output>
</template>
