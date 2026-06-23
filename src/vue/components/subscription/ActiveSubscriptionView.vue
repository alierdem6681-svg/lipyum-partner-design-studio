<script setup>
import { computed } from "vue";
import AppButton from "../ui/AppButton.vue";
import AppCard from "../ui/AppCard.vue";
import AppIcon from "../ui/AppIcon.vue";
import CurrentSubscriptionCard from "./CurrentSubscriptionCard.vue";
import SubscriptionPlanSelector from "./SubscriptionPlanSelector.vue";
import SubscriptionUsageCard from "./SubscriptionUsageCard.vue";
import SubscriptionTrustFooter from "./SubscriptionTrustFooter.vue";
import { formatPrice, planSentenceLabel } from "../../data/subscriptionPlans.js";

const props = defineProps({
  store: { type: Object, required: true },
});

const selectedPlan = computed(() => props.store.selectedPlan);
const currentPlan = computed(() => props.store.currentPlan);
const selectedIsCurrent = computed(() => selectedPlan.value.id === props.store.currentPlanId);
const isUpgrade = computed(() => selectedPlan.value.monthlyPrice > currentPlan.value.monthlyPrice);

async function changePlan() {
  if (selectedIsCurrent.value) return;
  if (isUpgrade.value) await props.store.upgradePlan(selectedPlan.value.id);
  else await props.store.downgradePlan(selectedPlan.value.id);
}
</script>

<template>
  <div class="subscription-flow" data-testid="subscription-active-state">
    <CurrentSubscriptionCard
      :plan="currentPlan"
      :renewal-date="store.renewalDate"
      :payment-platform="store.paymentPlatform"
      @manage="store.openManageSubscriptionsMock"
    />

    <section class="subscription-section-head">
      <strong>PLANINI DEĞİŞTİR</strong>
    </section>

    <SubscriptionPlanSelector
      :plans="store.plans"
      :selected-plan-id="store.selectedPlanId"
      :current-plan-id="store.currentPlanId"
      :billing-period="store.billingPeriod"
      active-mode
      @select="store.selectPlan"
    />

    <AppCard v-if="!selectedIsCurrent" class="subscription-change-card" data-testid="plan-change-card">
      <span class="subscription-blue-pill">{{ isUpgrade ? "DAHA FAZLASI" : "PLAN DEĞİŞİKLİĞİ" }}</span>
      <div>
        <h2>{{ planSentenceLabel(selectedPlan) }}</h2>
        <strong>{{ formatPrice(selectedPlan.monthlyPrice) }} TL / ay</strong>
      </div>
      <p>{{ selectedPlan.shortPromise }}</p>
      <AppButton variant="ghost" full-width data-testid="change-plan-cta" @click="changePlan">
        {{ selectedPlan.title.toLocaleUpperCase("tr-TR") }} AVANTAJLARINI GÖR
      </AppButton>
    </AppCard>

    <SubscriptionUsageCard :items="store.usedBenefits" />

    <section class="subscription-settings-list" aria-label="Ayarlar">
      <h3>AYARLAR</h3>
      <button type="button" data-testid="restore-purchases" @click="store.restorePurchasesMock">
        <span><AppIcon name="refresh" :size="20" /></span>
        <strong>Satın alımları geri yükle</strong>
        <AppIcon name="chevron-right" :size="18" />
      </button>
      <button type="button" @click="store.openManageSubscriptionsMock">
        <span><AppIcon name="credit-card" :size="20" /></span>
        <strong>Fatura ve yenileme bilgileri</strong>
        <AppIcon name="chevron-right" :size="18" />
      </button>
      <button type="button">
        <span><AppIcon name="headphones" :size="20" /></span>
        <strong>Abonelikle ilgili yardım</strong>
        <AppIcon name="chevron-right" :size="18" />
      </button>
    </section>

    <SubscriptionTrustFooter />
  </div>
</template>
