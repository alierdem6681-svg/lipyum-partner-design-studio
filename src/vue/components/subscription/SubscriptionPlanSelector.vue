<script setup>
import { computed } from "vue";
import { formatPrice } from "../../data/subscriptionPlans.js";

const props = defineProps({
  plans: { type: Array, required: true },
  selectedPlanId: { type: String, required: true },
  currentPlanId: { type: String, default: "free" },
  billingPeriod: { type: String, default: "monthly" },
  activeMode: { type: Boolean, default: false },
});

const emit = defineEmits(["select"]);

const periodLabel = computed(() => (props.billingPeriod === "annual" ? "yıl" : "ay"));

function planPrice(plan) {
  return props.billingPeriod === "annual" ? plan.annualPrice : plan.monthlyPrice;
}
</script>

<template>
  <div class="subscription-plan-selector" role="listbox" aria-label="Plan seç">
    <button
      v-for="plan in plans"
      :key="plan.id"
      type="button"
      :class="[
        'subscription-plan-option',
        selectedPlanId === plan.id ? 'is-selected' : '',
        currentPlanId === plan.id ? 'is-current' : '',
      ]"
      :aria-selected="selectedPlanId === plan.id"
      :aria-pressed="selectedPlanId === plan.id"
      :data-testid="`subscription-plan-${plan.id}`"
      @click="emit('select', plan.id)"
    >
      <span v-if="plan.recommended && !activeMode" class="subscription-plan-option__badge">ÖNERİLEN</span>
      <span v-if="currentPlanId === plan.id && activeMode" class="subscription-plan-option__badge">MEVCUT</span>
      <strong>{{ plan.title.toLocaleUpperCase("tr-TR") }}</strong>
      <small>{{ formatPrice(planPrice(plan)) }} TL/{{ periodLabel }}</small>
    </button>
  </div>
</template>
