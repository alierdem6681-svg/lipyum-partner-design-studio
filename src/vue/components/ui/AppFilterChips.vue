<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: String, default: "" },
  ariaLabel: { type: String, default: "Filtreler" },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="-mx-1 flex gap-2 overflow-x-auto px-1 py-1" :aria-label="ariaLabel">
    <button
      v-for="item in items"
      :key="item.value"
      class="h-9 shrink-0 rounded-pill border px-3 text-caption font-bold"
      :class="modelValue === item.value ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'"
      type="button"
      @click="emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
