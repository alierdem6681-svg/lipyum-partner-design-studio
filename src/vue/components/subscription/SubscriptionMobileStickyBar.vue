<script setup>
import { computed } from "vue";
import AppButton from "../ui/AppButton.vue";
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
      <AppIcon :name="displayPlan.icon" :size="22" />
    </span>
    <span class="sgf-sticky-bar__copy">
      <strong>Lipyum {{ displayPlan.title }}</strong>
      <b>{{ getPlanPriceCopy(displayPlan, billingPeriod) }}</b>
      <small><AppIcon name="zap" :size="13" /> {{ subscriptionGoldFocusCopy.activationNote }}</small>
    </span>
    <AppButton size="md" data-testid="subscription-sticky-cta" class="sgf-sticky-bar__cta" @click="emit('checkout')">
      {{ getPlanCtaCopy(displayPlan) }}
    </AppButton>
  </aside>
</template>
