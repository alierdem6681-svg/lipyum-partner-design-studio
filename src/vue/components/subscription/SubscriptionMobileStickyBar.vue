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
</script>

<template>
  <aside class="sgf-sticky-bar" data-testid="subscription-gold-focus-sticky-bar">
    <span :class="['sgf-sticky-bar__icon', `is-${displayPlan.tone}`]" aria-hidden="true">
      <AppIcon :name="displayPlan.icon" :size="24" />
    </span>
    <span class="sgf-sticky-bar__copy">
      <strong>{{ displayPlan.title }} Plan</strong>
      <b>{{ getPlanPriceCopy(displayPlan, billingPeriod) }}</b>
      <small><AppIcon name="zap" :size="13" /> {{ subscriptionGoldFocusCopy.activationNote }}</small>
    </span>
    <button type="button" class="sgf-sticky-bar__cta" data-testid="subscription-gold-focus-sticky-submit" @click="emit('checkout')">
      {{ getPlanCtaCopy(displayPlan) }}
    </button>
  </aside>
</template>
