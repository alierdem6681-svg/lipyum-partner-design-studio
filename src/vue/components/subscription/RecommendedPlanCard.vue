<script setup>
import { computed } from "vue";
import { BILLING_PERIODS } from "../../data/subscriptionPlans.js";
import AppBadge from "../ui/AppBadge.vue";
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import SubscriptionBenefitList from "./SubscriptionBenefitList.vue";

const props = defineProps({
  selectedPlan: { type: Object, required: true },
  billingPeriod: { type: String, default: BILLING_PERIODS.MONTHLY },
  trialEligible: { type: Boolean, default: true },
});

const emit = defineEmits(["cta"]);

const price = computed(() => {
  if (props.billingPeriod === BILLING_PERIODS.ANNUAL) {
    return {
      main: `${props.selectedPlan.annualPrice.toLocaleString("tr-TR")} TL`,
      suffix: "/ yıl",
      note: `Aylık karşılığı ${props.selectedPlan.monthlyEquivalent} TL`,
      renewal: `${props.selectedPlan.annualPrice.toLocaleString("tr-TR")} TL/yıl olarak yenilenir.`,
    };
  }

  return {
    main: `${props.selectedPlan.monthlyPrice} TL`,
    suffix: "/ ay",
    note: `Günde yaklaşık ${(props.selectedPlan.monthlyPrice / 30).toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} TL`,
    renewal: `${props.selectedPlan.monthlyPrice} TL/ay olarak yenilenir.`,
  };
});

const ctaLabel = computed(() => {
  if (props.trialEligible) return "30 GÜN ÜCRETSİZ DENE";
  return `${props.selectedPlan.title.toUpperCase()}’A GEÇ`;
});
</script>

<template>
  <section class="subscription-selected-card" data-testid="subscription-recommended-card">
    <div class="subscription-selected-card__top">
      <AppBadge :tone="selectedPlan.recommended ? 'success' : 'neutral'">
        {{ selectedPlan.recommended ? 'Sana uygun' : 'Doğrudan geçebilirsin' }}
      </AppBadge>
      <span class="subscription-selected-card__icon" aria-hidden="true">
        <AppIcon :name="selectedPlan.id === 'vip' ? 'trophy' : selectedPlan.id === 'gold' ? 'crown' : 'sparkles'" :size="24" />
      </span>
    </div>

    <div class="subscription-selected-card__price">
      <span>
        <strong>Lipyum {{ selectedPlan.title }}</strong>
        <small>{{ price.note }}</small>
      </span>
      <span>
        <strong>{{ price.main }}</strong>
        <small>{{ price.suffix }}</small>
      </span>
    </div>

    <SubscriptionBenefitList :items="selectedPlan.benefits.slice(0, 4)" :tone="selectedPlan.tone" />

    <AppButton full-width size="lg" data-testid="subscription-primary-cta" @click="emit('cta', selectedPlan.id)">
      {{ ctaLabel }}
    </AppButton>

    <p class="subscription-cta-note">
      <template v-if="trialEligible">
        30 gün ücretsiz. Sonrasında {{ price.renewal }} İstediğin zaman iptal edebilirsin.
      </template>
      <template v-else>
        Satın alma öncesi fiyat, yenileme ve iptal bilgileri açıkça gösterilir.
      </template>
    </p>
  </section>
</template>
