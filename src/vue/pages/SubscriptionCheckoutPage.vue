<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import SubscriptionBenefitList from "../components/subscription/SubscriptionBenefitList.vue";
import { formatPrice, getPlanById, getPlanPrice, planCtaLabel } from "../data/subscriptionPlans.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

const route = useRoute();
const router = useRouter();
const store = useSubscriptionStore();
const selectedPlan = computed(() => store.selectedPlan);
const suffix = computed(() => (store.billingPeriod === "annual" ? "yıl" : "ay"));
const periodLabel = computed(() => (store.billingPeriod === "annual" ? "Yıllık" : "Aylık"));
const renewalDate = computed(() => store.renewalDate);

onMounted(() => {
  const planId = typeof route.query.plan === "string" ? route.query.plan : store.selectedPlanId;
  store.selectPlan(getPlanById(planId).id);
  store.selectBillingPeriod(route.query.billing === "annual" ? "annual" : "monthly");
});

async function confirmPurchase() {
  await store.mockPurchase(selectedPlan.value.id);
  router.push({ path: "/subscription", query: { subscriptionState: "active", plan: selectedPlan.value.id } });
}
</script>

<template>
  <AppPage title="Satın Almayı Onayla" class="subscription-page subscription-page--checkout" data-testid="subscription-checkout-page">
    <AppCard class="subscription-checkout-hero">
      <span class="subscription-pill">SEÇİLEN PLAN</span>
      <div class="subscription-checkout-hero__top">
        <h2>Lipyum {{ selectedPlan.title }}</h2>
        <strong>{{ formatPrice(getPlanPrice(selectedPlan, store.billingPeriod)) }} TL / {{ suffix }}</strong>
      </div>
      <h3>Ödeme sonrası hemen aktif</h3>
      <p>Her {{ store.billingPeriod === "annual" ? "yıl" : "ay" }} aynı tarihte otomatik yenilenir.</p>
    </AppCard>

    <AppCard class="subscription-checkout-benefits">
      <h2>Hemen açılacak avantajlar</h2>
      <SubscriptionBenefitList :benefits="selectedPlan.benefits.slice(0, 4)" />
    </AppCard>

    <AppCard class="subscription-summary-card">
      <h2>Ödeme özeti</h2>
      <dl>
        <div>
          <dt>Plan</dt>
          <dd>Lipyum {{ selectedPlan.title }}</dd>
        </div>
        <div>
          <dt>Dönem</dt>
          <dd>{{ periodLabel }}</dd>
        </div>
        <div>
          <dt>Bugün ödenecek</dt>
          <dd>{{ formatPrice(getPlanPrice(selectedPlan, store.billingPeriod)) }} TL</dd>
        </div>
        <div>
          <dt>Sonraki yenileme</dt>
          <dd>{{ renewalDate }}</dd>
        </div>
      </dl>
    </AppCard>

    <AppCard class="subscription-payment-method">
      <span><AppIcon name="credit-card" :size="23" /></span>
      <div>
        <small>Ödeme yöntemi</small>
        <strong>{{ store.paymentPlatform }}</strong>
      </div>
      <button type="button">Değiştir</button>
    </AppCard>

    <AppButton full-width size="lg" data-testid="confirm-purchase" @click="confirmPurchase">
      {{ formatPrice(getPlanPrice(selectedPlan, store.billingPeriod)) }} TL ÖDE VE {{ planCtaLabel(selectedPlan) }}
    </AppButton>
    <p class="subscription-fine-print">Ödemeyi onaylayarak otomatik yenilemeyi kabul edersin. Koşullar · Gizlilik · Satın alımları geri yükle</p>
  </AppPage>
</template>
