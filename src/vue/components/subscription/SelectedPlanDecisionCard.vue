<script setup>
import { computed } from "vue";
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import {
  getDisplayPlan,
  getPlanCtaCopy,
  getPlanPriceCopy,
  getPlanSecondaryPriceCopy,
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
  <section :class="['sgf-decision-card', `is-${displayPlan.tone}`]" data-testid="selected-plan-card">
    <span class="sgf-decision-card__badge">
      {{ displayPlan.recommended ? "SANA UYGUN" : "SEÇİLEN PLAN" }}
    </span>
    <div class="sgf-decision-card__head">
      <div>
        <p class="sgf-decision-card__eyebrow">
          {{ subscriptionGoldFocusCopy.selectedPlanPrefix }} <strong>{{ displayPlan.title }}</strong>
        </p>
        <h2>Lipyum {{ displayPlan.title }}</h2>
        <p>{{ displayPlan.decisionSupport }}</p>
      </div>
      <strong class="sgf-decision-card__price">
        {{ getPlanPriceCopy(displayPlan, billingPeriod) }}
        <small>{{ getPlanSecondaryPriceCopy(displayPlan, billingPeriod) }}</small>
      </strong>
    </div>

    <div class="sgf-decision-card__benefits" aria-label="Plan avantajları">
      <span v-for="benefit in benefits" :key="benefit">
        <AppIcon name="check" :size="16" />
        <strong>{{ benefit }}</strong>
      </span>
    </div>

    <AppButton
      size="lg"
      full-width
      data-testid="selected-plan-cta"
      class="sgf-primary-button"
      @click="emit('checkout')"
    >
      {{ getPlanCtaCopy(displayPlan) }}
    </AppButton>

    <small class="sgf-activation-note">
      <AppIcon name="zap" :size="16" />
      {{ subscriptionGoldFocusCopy.activationNote }}
    </small>
  </section>
</template>
