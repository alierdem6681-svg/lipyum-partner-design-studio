<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: "" },
  tone: { type: String, default: "success" },
});

const toneClasses = {
  success: "bg-emerald-50 text-emerald-700",
  info: "bg-blue-50 text-blue-700",
  warning: "bg-amber-50 text-amber-700",
  neutral: "bg-slate-100 text-slate-600",
};
</script>

<template>
  <article class="rounded-card border border-slate-200 bg-white p-3 shadow-soft">
    <span v-if="icon" class="mb-2 grid h-9 w-9 place-items-center rounded-xl" :class="toneClasses[tone] || toneClasses.success">
      <AppIcon :name="icon" :size="19" />
    </span>
    <strong class="block truncate text-metric-md font-extrabold text-slate-950">{{ value }}</strong>
    <small class="block truncate text-caption font-bold text-slate-500">{{ label }}</small>
  </article>
</template>
