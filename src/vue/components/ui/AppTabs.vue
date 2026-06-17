<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: String, default: "" },
  ariaLabel: { type: String, default: "Sekmeler" },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex min-h-11 gap-1 rounded-pill bg-slate-100 p-1" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="item in items"
      :key="item.value"
      class="min-w-0 flex-1 truncate rounded-pill px-3 text-caption font-bold transition"
      :class="modelValue === item.value ? 'bg-white text-emerald-700 shadow-soft' : 'text-slate-500'"
      type="button"
      role="tab"
      :aria-selected="modelValue === item.value"
      @click="emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
