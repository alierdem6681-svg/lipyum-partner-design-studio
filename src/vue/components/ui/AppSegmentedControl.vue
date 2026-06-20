<script setup>
defineProps({
  options: { type: Array, default: () => [] },
  modelValue: { type: String, default: "" },
  ariaLabel: { type: String, default: "Sekmeler" },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="v-segment" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="{ 'is-active': modelValue === option.value }"
      :aria-selected="modelValue === option.value"
      :aria-pressed="modelValue === option.value"
      role="tab"
      v-bind="option.attrs || {}"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
