<script setup>
import { computed } from "vue";
import { formatPrice } from "../../data/subscriptionPlans.js";
import AppIcon from "../ui/AppIcon.vue";

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
        `is-${plan.tone || plan.id}`,
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
      <span class="subscription-plan-option__orb" aria-hidden="true">
        <AppIcon :name="plan.icon || 'star'" :size="24" />
      </span>
      <span class="subscription-plan-option__main">
        <strong>{{ plan.title.toLocaleUpperCase("tr-TR") }}</strong>
        <em>{{ plan.targetUser }}</em>
        <small>{{ plan.shortPromise }}</small>
        <span class="subscription-plan-option__benefits">
          <span v-for="benefit in plan.benefits.slice(0, 3)" :key="benefit">{{ benefit }}</span>
        </span>
      </span>
      <span class="subscription-plan-option__price">
        <strong>{{ formatPrice(planPrice(plan)) }} TL</strong>
        <small>/ {{ periodLabel }}</small>
      </span>
      <span class="subscription-plan-option__radio" aria-hidden="true">
        <span></span>
      </span>
    </button>
  </div>
</template>
