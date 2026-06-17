<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: "check" },
  tone: { type: String, default: "success" },
});

const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  neutral: "border-slate-200 bg-white text-slate-600",
};
</script>

<template>
  <span class="inline-flex h-8 max-w-full items-center gap-1.5 rounded-pill border px-3 text-caption font-bold" :class="toneClasses[tone] || toneClasses.success">
    <AppIcon :name="icon" :size="15" />
    <span class="truncate">{{ label }}</span>
  </span>
</template>
