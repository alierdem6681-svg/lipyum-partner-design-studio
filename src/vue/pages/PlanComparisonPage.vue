<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import BillingPeriodToggle from "../components/subscription/BillingPeriodToggle.vue";
import SubscriptionBenefitList from "../components/subscription/SubscriptionBenefitList.vue";
import { formatPrice, getPlanPrice, planCtaLabel } from "../data/subscriptionPlans.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

const router = useRouter();
const store = useSubscriptionStore();
const suffix = computed(() => (store.billingPeriod === "annual" ? "yıl" : "ay"));

function goCheckout(planId) {
  store.selectPlan(planId);
  router.push({ path: "/subscription/checkout", query: { plan: planId, billing: store.billingPeriod } });
}
</script>

<template>
  <AppPage title="Planları Karşılaştır" class="subscription-page subscription-page--compare" data-testid="subscription-compare-page">
    <BillingPeriodToggle :model-value="store.billingPeriod" @update:model-value="store.selectBillingPeriod" />

    <div class="subscription-compare-list">
      <AppCard
        v-for="plan in store.plans"
        :key="plan.id"
        :class="['subscription-compare-card', plan.recommended ? 'is-recommended' : '']"
        :data-testid="`compare-plan-${plan.id}`"
      >
        <div class="subscription-compare-card__top">
          <span class="subscription-compare-card__icon" aria-hidden="true">
            <AppIcon name="crown" :size="25" />
          </span>
          <div>
            <span v-if="plan.recommended" class="subscription-pill">ÖNERİLEN</span>
            <h2>{{ plan.title }}</h2>
            <p>{{ plan.targetUser }}</p>
          </div>
          <strong>{{ formatPrice(getPlanPrice(plan, store.billingPeriod)) }} TL / {{ suffix }}</strong>
        </div>
        <SubscriptionBenefitList :benefits="plan.benefits.slice(0, 3)" :tone="plan.id === 'vip' ? 'purple' : plan.id === 'gold' ? 'gold' : 'green'" />
        <AppButton :variant="plan.recommended ? 'primary' : 'ghost'" full-width :data-testid="`compare-select-${plan.id}`" @click="goCheckout(plan.id)">
          {{ planCtaLabel(plan) }}
        </AppButton>
      </AppCard>
    </div>

    <AppCard class="subscription-fit-card">
      <h3>Hangi plan sana uygun?</h3>
      <dl>
        <div v-for="plan in store.plans" :key="plan.id">
          <dt>{{ plan.title }}</dt>
          <dd>{{ plan.targetUser }}</dd>
        </div>
      </dl>
    </AppCard>
    <p class="subscription-fine-print">Tüm fiyatlar otomatik yenilenir. İstediğin zaman mağaza ayarlarından iptal edebilirsin.</p>
  </AppPage>
</template>
