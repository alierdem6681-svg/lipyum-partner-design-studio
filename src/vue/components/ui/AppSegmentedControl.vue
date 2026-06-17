<script setup>
defineProps({
  options: { type: Array, default: () => [] },
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="v-segment" role="tablist">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="{ 'is-active': modelValue === option.value }"
      :aria-selected="modelValue === option.value"
      role="tab"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
