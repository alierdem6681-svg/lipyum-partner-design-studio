<script setup>
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import CurrentSubscriptionCard from "./CurrentSubscriptionCard.vue";
import PlanComparisonSheet from "./PlanComparisonSheet.vue";
import SubscriptionTrustFooter from "./SubscriptionTrustFooter.vue";
import SubscriptionUsageCard from "./SubscriptionUsageCard.vue";

defineProps({
  store: { type: Object, required: true },
  showComparison: { type: Boolean, default: false },
});

const emit = defineEmits(["compare", "close-compare", "select-plan", "billing-period", "purchase", "manage", "restore"]);
</script>

<template>
  <div class="subscription-state subscription-state--active" data-testid="subscription-state-active">
    <CurrentSubscriptionCard
      :plan="store.currentPlan"
      status-label="Aktif"
      :renewal-copy="store.renewalCopy"
      :platform="store.billingPlatform"
      @manage="emit('manage')"
    />
    <SubscriptionUsageCard :items="store.usedBenefits" />

    <section class="subscription-upgrade-card">
      <span class="subscription-upgrade-card__badge">Daha fazlası</span>
      <div>
        <h3>{{ store.currentPlan.id === 'vip' ? 'VIP planın aktif' : store.currentPlan.id === 'pro' ? 'VIP’e geç' : 'Gold’a geç' }}</h3>
        <p>{{ store.currentPlan.id === 'vip' ? 'En yüksek destek seviyesi açık.' : 'Gelişmiş raporlar ve öncelikli destek.' }}</p>
      </div>
      <strong>{{ store.currentPlan.id === 'vip' ? '899 TL / ay' : store.currentPlan.id === 'pro' ? '899 TL / ay' : '499 TL / ay' }}</strong>
      <AppButton variant="secondary" full-width icon-right="chevron-right" @click="emit('compare')">
        PLANLARI GÖR
      </AppButton>
    </section>

    <section class="subscription-settings-list">
      <h3>Ayarlar</h3>
      <button type="button" @click="emit('manage')"><AppIcon name="credit-card" :size="20" /> Fatura ve yenileme bilgileri <AppIcon name="chevron-right" :size="18" /></button>
      <button type="button" data-testid="subscription-active-restore" @click="emit('restore')"><AppIcon name="refresh" :size="20" /> Satın alımları geri yükle <AppIcon name="chevron-right" :size="18" /></button>
      <button type="button"><AppIcon name="headphones" :size="20" /> Abonelikle ilgili yardım <AppIcon name="chevron-right" :size="18" /></button>
    </section>

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
