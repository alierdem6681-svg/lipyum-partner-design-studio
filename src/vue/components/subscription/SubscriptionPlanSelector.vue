<script setup>
defineProps({
  plans: { type: Array, default: () => [] },
  selectedPlanId: { type: String, default: "plus" },
  currentPlanId: { type: String, default: "" },
  recommendedPlanId: { type: String, default: "plus" },
  mode: { type: String, default: "select" },
});

const emit = defineEmits(["select"]);
</script>

<template>
  <div class="subscription-plan-selector" role="list" aria-label="Plan seçimi">
    <button
      v-for="plan in plans"
      :key="plan.id"
      :class="[
        'subscription-plan-choice',
        selectedPlanId === plan.id ? 'is-selected' : '',
        currentPlanId === plan.id ? 'is-current' : '',
      ]"
      type="button"
      role="listitem"
      :data-testid="`subscription-option-${plan.id}`"
      :aria-pressed="selectedPlanId === plan.id"
      :aria-label="`${plan.title} planı, ${plan.monthlyPrice} TL aylık`"
      @click="emit('select', plan.id)"
    >
      <span v-if="plan.id === recommendedPlanId && currentPlanId !== plan.id" class="subscription-plan-choice__badge">
        Önerilen
      </span>
      <span v-else-if="currentPlanId === plan.id" class="subscription-plan-choice__badge">
        Mevcut
      </span>
      <strong>{{ plan.title }}</strong>
      <small>{{ plan.monthlyPrice }} TL/ay</small>
    </button>
  </div>
</template>
