<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BILLING_PERIODS, SUBSCRIPTION_QUERY_STATE_MAP } from "../data/subscriptionPlans.js";
import AppButton from "../components/ui/AppButton.vue";
import AppPage from "../components/ui/AppPage.vue";
import PlanCard from "../components/subscription/PlanCard.vue";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";
import { useAppShellStore } from "../stores/appShellStore.js";

const router = useRouter();
const route = useRoute();
const shell = useAppShellStore();
const subscription = useSubscriptionStore();

const billingOptions = computed(() => [
  { id: BILLING_PERIODS.MONTHLY, label: "Aylık" },
  { id: BILLING_PERIODS.ANNUAL, label: "Yıllık · %20 avantaj" },
]);

function selectPlan(planId) {
  subscription.selectPlan(planId);
}

async function purchase(planId) {
  if (subscription.isPaid || subscription.isCanceledButActive || subscription.hasPaymentIssue) {
    if ((subscription.selectedPlan.sortOrder || 0) > (subscription.currentPlan.sortOrder || 0)) {
      await subscription.upgradePlan(planId);
    } else {
      await subscription.downgradePlan(planId);
    }
    shell.showToast(`Lipyum ${subscription.currentPlan.title} planı seçildi.`);
    return;
  }

  if (subscription.canStartTrial) {
    subscription.startTrial(planId);
    shell.showToast("30 günlük deneme başladı.");
    router.push("/subscription");
    return;
  }

  await subscription.mockPurchase(planId);
  shell.showToast(`Lipyum ${subscription.currentPlan.title} aktif.`);
  router.push("/subscription");
}

onMounted(() => {
  const queryState = SUBSCRIPTION_QUERY_STATE_MAP[String(route.query.subscriptionState || "")];
  if (queryState) {
    subscription.applyDemoState(queryState);
  }
  subscription.selectBillingPeriod(BILLING_PERIODS.MONTHLY);
  subscription.track("plan_compare_open");
});
</script>

<template>
  <AppPage title="Planları Karşılaştır" class="subscription-page subscription-v2-page" data-testid="subscription-compare-page">
    <div class="subscription-compare-page">
      <div class="subscription-billing-toggle" role="tablist" aria-label="Faturalama dönemi">
        <button
          v-for="option in billingOptions"
          :key="option.id"
          type="button"
          :class="subscription.selectedBillingPeriod === option.id ? 'is-active' : ''"
          :data-testid="`subscription-billing-${option.id}`"
          @click="subscription.selectBillingPeriod(option.id)"
        >
          {{ option.label }}
        </button>
      </div>

      <PlanCard
        v-for="plan in subscription.plans"
        :key="plan.id"
        :plan="plan"
        :selected="subscription.selectedPlanId === plan.id"
        :current="subscription.activePlanId === plan.id"
        :recommended="plan.recommended"
        :billing-period="subscription.selectedBillingPeriod"
        :cta-label="subscription.activePlanId === plan.id ? 'MEVCUT PLAN' : plan.recommended ? '30 GÜN ÜCRETSİZ DENE' : 'PLANI SEÇ'"
        @select="selectPlan"
        @cta="purchase"
      />

      <section class="subscription-free-diff">
        <h3>Free ile ücretli plan farkı</h3>
        <div class="subscription-diff-row">
          <span>Profil rozeti</span><small>Free</small><strong>Gold+</strong>
        </div>
        <div class="subscription-diff-row">
          <span>Müşteri hizmetleri</span><small>Temel</small><strong>Ücretli</strong>
        </div>
        <div class="subscription-diff-row">
          <span>Performans önerileri</span><small>Temel</small><strong>Gelişmiş</strong>
        </div>
        <AppButton variant="secondary" full-width data-testid="subscription-compare-close" @click="router.push('/subscription')">
          Aboneliğime dön
        </AppButton>
      </section>
    </div>
  </AppPage>
</template>
