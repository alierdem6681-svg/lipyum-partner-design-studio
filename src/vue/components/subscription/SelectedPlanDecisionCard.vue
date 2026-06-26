<script setup>
import { computed } from "vue";
import AppIcon from "../ui/AppIcon.vue";
import {
  getDisplayPlan,
  getPlanCtaCopy,
  getPlanPriceCopy,
  subscriptionGoldFocusCopy,
} from "../../data/subscriptionGoldFocusModel.js";

const props = defineProps({
  plan: { type: Object, required: true },
  billingPeriod: { type: String, default: "monthly" },
});

const emit = defineEmits(["checkout"]);
const displayPlan = computed(() => getDisplayPlan(props.plan));
const benefits = computed(() => displayPlan.value.decisionBenefits.slice(0, 4));
</script>

<template>
  <section :class="['sgf-decision-card', `is-${displayPlan.tone}`]" data-testid="subscription-selected-plan-card">
    <div class="sgf-decision-card__head">
      <div>
        <p class="sgf-decision-card__eyebrow">
          {{ subscriptionGoldFocusCopy.selectedPlanPrefix }}
          <strong>{{ displayPlan.title }}</strong>
        </p>
        <h2>{{ getPlanPriceCopy(displayPlan, billingPeriod) }}</h2>
        <p>{{ subscriptionGoldFocusCopy.selectedPlanSupport }}</p>
      </div>
      <span :class="['sgf-decision-card__emblem', `is-${displayPlan.tone}`]" aria-hidden="true">
        <AppIcon :name="displayPlan.icon" :size="34" />
      </span>
    </div>

    <div class="sgf-decision-card__benefits" aria-label="Plan avantajları">
      <span v-for="benefit in benefits" :key="benefit">
        <AppIcon name="check" :size="16" />
        <strong>{{ benefit }}</strong>
      </span>
    </div>

    <button class="sgf-primary-cta" type="button" data-testid="subscription-gold-focus-submit" @click="emit('checkout')">
      <AppIcon :name="displayPlan.icon" :size="18" />
      <span>{{ getPlanCtaCopy(displayPlan) }}</span>
    </button>

    <small class="sgf-activation-note">
      <AppIcon name="zap" :size="16" />
      {{ subscriptionGoldFocusCopy.activationNote }}
    </small>
  </section>
</template>
