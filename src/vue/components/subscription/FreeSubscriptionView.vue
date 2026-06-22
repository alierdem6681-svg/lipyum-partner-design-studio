<script setup>
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import PlanComparisonSheet from "./PlanComparisonSheet.vue";
import RecommendedPlanCard from "./RecommendedPlanCard.vue";
import SubscriptionTrustFooter from "./SubscriptionTrustFooter.vue";
import TrialTimeline from "./TrialTimeline.vue";

defineProps({
  store: { type: Object, required: true },
  showComparison: { type: Boolean, default: false },
});

const emit = defineEmits(["compare", "close-compare", "select-plan", "billing-period", "purchase", "restore"]);
</script>

<template>
  <div class="subscription-state subscription-state--free" data-testid="subscription-state-free">
    <section class="subscription-intro-card">
      <span class="subscription-intro-card__pill">Şu an Free</span>
      <span class="subscription-intro-card__icon" aria-hidden="true">
        <AppIcon name="crown" :size="28" />
      </span>
      <h2>İş alma gücünü büyüt</h2>
      <p>Sana en uygun planı seçtik: <strong>Lipyum Plus</strong></p>
    </section>

    <section class="subscription-section-label">Sana önerilen</section>
    <RecommendedPlanCard
      :plan="store.plans"
      :selected-plan="store.selectedPlan"
      :billing-period="store.selectedBillingPeriod"
      @select-plan="emit('select-plan', $event)"
      @cta="emit('purchase', $event)"
    />

    <TrialTimeline :monthly-price="store.recommendedPlan.monthlyPrice" />

    <section class="subscription-simple-card">
      <h3>Neden Plus?</h3>
      <ul>
        <li>Müşteriye daha profesyonel görün.</li>
        <li>Yardıma ihtiyaç duyduğunda hızlı destek al.</li>
        <li>Profil kartını daha güçlü paylaş.</li>
      </ul>
    </section>

    <AppButton variant="secondary" full-width data-testid="subscription-compare-open" @click="emit('compare')">
      DİĞER PLANLARI KARŞILAŞTIR
    </AppButton>

    <SubscriptionTrustFooter @restore="emit('restore')" />

    <PlanComparisonSheet
      :open="showComparison"
      :plans="store.plans"
      :selected-plan-id="store.selectedPlanId"
      :billing-period="store.selectedBillingPeriod"
      @close="emit('close-compare')"
      @select-plan="emit('select-plan', $event)"
      @billing-period="emit('billing-period', $event)"
      @purchase="emit('purchase', $event)"
    />
  </div>
</template>
