<script setup>
import { computed } from "vue";
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import CurrentSubscriptionCard from "./CurrentSubscriptionCard.vue";
import SubscriptionPlanSelector from "./SubscriptionPlanSelector.vue";
import SubscriptionTrustFooter from "./SubscriptionTrustFooter.vue";
import SubscriptionUsageCard from "./SubscriptionUsageCard.vue";

const props = defineProps({
  store: { type: Object, required: true },
});

const emit = defineEmits(["compare", "select-plan", "purchase", "manage", "restore"]);

const selectedChangeType = computed(() => {
  if (props.store.selectedPlanId === props.store.activePlanId) return "current";
  const currentOrder = props.store.currentPlan.sortOrder || 0;
  const selectedOrder = props.store.selectedPlan.sortOrder || 0;
  return selectedOrder > currentOrder ? "upgrade" : "downgrade";
});

const upgradePlan = computed(() => props.store.plans.find((plan) => plan.id === "vip") || props.store.plans.at(-1));
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

    <section class="subscription-plan-section" aria-label="Plan değiştirme">
      <div class="subscription-section-row">
        <h3>Planını değiştir</h3>
        <span>{{ selectedChangeType === 'current' ? 'Mevcut plan' : selectedChangeType === 'upgrade' ? 'Üst plana geç' : 'Planı düşür' }}</span>
      </div>
      <SubscriptionPlanSelector
        :plans="store.plans"
        :selected-plan-id="store.selectedPlanId"
        :current-plan-id="store.activePlanId"
        :recommended-plan-id="store.recommendedPlan.id"
        mode="manage"
        @select="emit('select-plan', $event)"
      />
      <AppButton
        v-if="selectedChangeType !== 'current'"
        full-width
        data-testid="subscription-change-plan"
        @click="emit('purchase', store.selectedPlanId)"
      >
        {{ selectedChangeType === 'upgrade' ? `${store.selectedPlan.title.toUpperCase()}’E GEÇ` : `${store.selectedPlan.title.toUpperCase()}’A DÜŞ` }}
      </AppButton>
    </section>

    <SubscriptionUsageCard :items="store.usedBenefits" />

    <section v-if="store.currentPlan.id !== 'vip'" class="subscription-upgrade-card">
      <span class="subscription-upgrade-card__badge">Daha fazlası</span>
      <div>
        <h3>VIP’e geç</h3>
        <p>Telefon desteği ve VIP profil görünümü.</p>
      </div>
      <strong>{{ upgradePlan.monthlyPrice }} TL / ay</strong>
      <AppButton variant="secondary" full-width icon-right="chevron-right" @click="emit('select-plan', 'vip')">
        VIP AVANTAJLARINI GÖR
      </AppButton>
    </section>

    <section class="subscription-settings-list">
      <h3>Ayarlar</h3>
      <button type="button" @click="emit('manage')">
        <AppIcon name="credit-card" :size="20" /> Fatura ve yenileme bilgileri <AppIcon name="chevron-right" :size="18" />
      </button>
      <button type="button" data-testid="subscription-active-restore" @click="emit('restore')">
        <AppIcon name="refresh" :size="20" /> Satın alımları geri yükle <AppIcon name="chevron-right" :size="18" />
      </button>
      <button type="button">
        <AppIcon name="headphones" :size="20" /> Abonelikle ilgili yardım <AppIcon name="chevron-right" :size="18" />
      </button>
    </section>

    <SubscriptionTrustFooter @restore="emit('restore')" />
  </div>
</template>
