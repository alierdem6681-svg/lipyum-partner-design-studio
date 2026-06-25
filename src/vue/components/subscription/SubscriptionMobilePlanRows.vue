<script setup>
import { computed } from "vue";
import AppIcon from "../ui/AppIcon.vue";
import {
  getDisplayPlan,
  getPlanPriceCopy,
  getPlanSecondaryPriceCopy,
  subscriptionGoldFocusCopy,
} from "../../data/subscriptionGoldFocusModel.js";

const props = defineProps({
  plans: { type: Array, required: true },
  selectedPlanId: { type: String, required: true },
  billingPeriod: { type: String, default: "monthly" },
});

const emit = defineEmits(["select"]);
const displayPlans = computed(() => props.plans.map((plan) => getDisplayPlan(plan)));
</script>

<template>
  <section class="sgf-plan-rows" aria-label="Abonelik planları" data-testid="subscription-gold-focus-plan-selector">
    <button
      v-for="plan in displayPlans"
      :key="plan.id"
      type="button"
      :class="[
        'sgf-plan-row',
        `is-${plan.tone || plan.id}`,
        selectedPlanId === plan.id ? 'is-selected' : '',
      ]"
      :aria-selected="selectedPlanId === plan.id"
      :aria-pressed="selectedPlanId === plan.id"
      :data-testid="`subscription-plan-${plan.id}`"
      @click="emit('select', plan.id)"
    >
      <span v-if="plan.recommended" class="sgf-plan-row__badge">{{ subscriptionGoldFocusCopy.recommendedBadge }}</span>
      <span class="sgf-plan-row__icon" aria-hidden="true">
        <AppIcon :name="plan.icon" :size="22" />
      </span>
      <span class="sgf-plan-row__copy">
        <strong>{{ plan.title.toLocaleUpperCase("tr-TR") }}</strong>
        <small>{{ plan.descriptor }}</small>
      </span>
      <span class="sgf-plan-row__price">
        <strong>{{ getPlanPriceCopy(plan, billingPeriod) }}</strong>
        <small>{{ getPlanSecondaryPriceCopy(plan, billingPeriod) }}</small>
      </span>
      <span class="sgf-plan-row__radio" aria-hidden="true">
        <span></span>
      </span>
    </button>
  </section>
</template>
