<script setup>
import { BILLING_PERIODS } from "../../data/subscriptionPlans.js";
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import RecommendedPlanCard from "./RecommendedPlanCard.vue";
import SubscriptionPlanSelector from "./SubscriptionPlanSelector.vue";
import SubscriptionStickyCTA from "./SubscriptionStickyCTA.vue";
import SubscriptionTrustFooter from "./SubscriptionTrustFooter.vue";
import TrialTimeline from "./TrialTimeline.vue";

defineProps({
  store: { type: Object, required: true },
});

const emit = defineEmits(["compare", "select-plan", "billing-period", "purchase", "restore"]);
</script>

<template>
  <div class="subscription-state subscription-state--free" data-testid="subscription-state-free">
    <section class="subscription-current-plan-card">
      <span>Mevcut plan</span>
      <div>
        <strong>Free</strong>
        <small>Temel kullanım aktif</small>
      </div>
      <em aria-hidden="true"><AppIcon name="user" :size="24" /></em>
    </section>

    <section class="subscription-plan-section" aria-label="Plan seçimi">
      <div class="subscription-section-row">
        <h3>Planı seç</h3>
        <span>{{ store.selectedBillingPeriod === BILLING_PERIODS.MONTHLY ? 'Aylık ödeme' : 'Yıllık ödeme' }}</span>
      </div>

      <div class="subscription-billing-toggle" role="tablist" aria-label="Faturalama dönemi">
        <button
          type="button"
          :class="store.selectedBillingPeriod === BILLING_PERIODS.MONTHLY ? 'is-active' : ''"
          data-testid="subscription-billing-monthly"
          @click="emit('billing-period', BILLING_PERIODS.MONTHLY)"
        >
          Aylık
        </button>
        <button
          type="button"
          :class="store.selectedBillingPeriod === BILLING_PERIODS.ANNUAL ? 'is-active' : ''"
          data-testid="subscription-billing-annual"
          @click="emit('billing-period', BILLING_PERIODS.ANNUAL)"
        >
          Yıllık · %20 avantaj
        </button>
      </div>

      <SubscriptionPlanSelector
        :plans="store.plans"
        :selected-plan-id="store.selectedPlanId"
        :recommended-plan-id="store.recommendedPlan.id"
        @select="emit('select-plan', $event)"
      />
    </section>

    <RecommendedPlanCard
      :selected-plan="store.selectedPlan"
      :billing-period="store.selectedBillingPeriod"
      :trial-eligible="store.canStartTrial"
      @cta="emit('purchase', $event)"
    />

    <TrialTimeline :plan-title="store.selectedPlan.title" :monthly-price="store.selectedPlan.monthlyPrice" />

    <AppButton variant="secondary" full-width data-testid="subscription-compare-open" @click="emit('compare')">
      TÜM PLANLARI KARŞILAŞTIR
    </AppButton>

    <SubscriptionTrustFooter @restore="emit('restore')" />

    <SubscriptionStickyCTA
      :plan="store.selectedPlan"
      :billing-period="store.selectedBillingPeriod"
      :trial-eligible="store.canStartTrial"
      @cta="emit('purchase', $event)"
    />
  </div>
</template>
