<script setup>
defineProps({
  modelValue: { type: String, default: "monthly" },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="subscription-billing-toggle" role="group" aria-label="Ödeme dönemi">
    <button
      type="button"
      :class="['subscription-billing-toggle__item', modelValue === 'monthly' ? 'is-active' : '']"
      :aria-pressed="modelValue === 'monthly'"
      data-testid="billing-monthly"
      @click="emit('update:modelValue', 'monthly')"
    >
      Aylık
    </button>
    <button
      type="button"
      :class="['subscription-billing-toggle__item', modelValue === 'annual' ? 'is-active' : '']"
      :aria-pressed="modelValue === 'annual'"
      data-testid="billing-annual"
      @click="emit('update:modelValue', 'annual')"
    >
      Yıllık · %20 avantaj
    </button>
  </div>
</template>
