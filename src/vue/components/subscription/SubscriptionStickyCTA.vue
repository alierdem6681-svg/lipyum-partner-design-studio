<script setup>
import { computed } from "vue";
import { BILLING_PERIODS } from "../../data/subscriptionPlans.js";
import AppButton from "../ui/AppButton.vue";

const props = defineProps({
  plan: { type: Object, required: true },
  billingPeriod: { type: String, default: BILLING_PERIODS.MONTHLY },
  trialEligible: { type: Boolean, default: true },
});

const emit = defineEmits(["cta"]);

const priceLabel = computed(() => {
  if (props.billingPeriod === BILLING_PERIODS.ANNUAL) {
    return `${props.plan.annualPrice.toLocaleString("tr-TR")} TL / yıl`;
  }
  return `${props.plan.monthlyPrice} TL / ay`;
});

const note = computed(() => {
  if (!props.trialEligible) return "Satın alma onayı öncesi yenileme bilgisi gösterilir.";
  return `30 gün ücretsiz, sonra ${props.billingPeriod === BILLING_PERIODS.ANNUAL ? "yıllık" : "aylık"} yenilenir.`;
});
</script>

<template>
  <div class="subscription-sticky-cta" data-testid="subscription-sticky-cta">
    <div class="subscription-sticky-cta__summary">
      <strong>Lipyum {{ plan.title }}</strong>
      <span>{{ priceLabel }}</span>
    </div>
    <p>{{ note }}</p>
    <AppButton full-width size="lg" data-testid="subscription-sticky-button" @click="emit('cta', plan.id)">
      {{ trialEligible ? 'ÜCRETSİZ DENEMEYİ BAŞLAT' : `${plan.title.toUpperCase()}’A GEÇ` }}
    </AppButton>
  </div>
</template>
