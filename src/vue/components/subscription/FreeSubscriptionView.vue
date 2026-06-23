<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import AppCard from "../ui/AppCard.vue";
import AppIcon from "../ui/AppIcon.vue";
import BillingPeriodToggle from "./BillingPeriodToggle.vue";
import SelectedPlanCard from "./SelectedPlanCard.vue";
import SubscriptionPlanSelector from "./SubscriptionPlanSelector.vue";
import SubscriptionStickyCTA from "./SubscriptionStickyCTA.vue";
import SubscriptionTrustFooter from "./SubscriptionTrustFooter.vue";

const props = defineProps({
  store: { type: Object, required: true },
});

const router = useRouter();
const selectedPlan = computed(() => props.store.selectedPlan);

function goCheckout() {
  router.push({
    path: "/subscription/checkout",
    query: { plan: selectedPlan.value.id, billing: props.store.billingPeriod },
  });
}
</script>

<template>
  <div class="subscription-flow" data-testid="subscription-free-state">
    <AppCard class="subscription-free-card">
      <span class="subscription-free-card__icon" aria-hidden="true">
        <AppIcon name="user" :size="24" />
      </span>
      <div>
        <h2>Mevcut planın: <strong>Free</strong></h2>
        <p>Temel kullanım aktif</p>
      </div>
      <AppIcon name="chevron-right" :size="22" />
    </AppCard>

    <section class="subscription-hero-direct">
      <div>
        <h2>Daha <strong>güçlü</strong> görün.<br />Daha <strong>hızlı</strong> destek al.</h2>
        <p>Sana uygun planı seç ve avantajlarını hemen aç.</p>
      </div>
      <span aria-hidden="true"><AppIcon name="zap" :size="28" /></span>
    </section>

    <section class="subscription-section-head">
      <strong>PLANINI SEÇ</strong>
      <span>{{ store.billingPeriod === "annual" ? "Yıllık ödeme" : "Aylık ödeme" }}</span>
    </section>

    <BillingPeriodToggle :model-value="store.billingPeriod" @update:model-value="store.selectBillingPeriod" />

    <SubscriptionPlanSelector
      :plans="store.plans"
      :selected-plan-id="store.selectedPlanId"
      :billing-period="store.billingPeriod"
      @select="store.selectPlan"
    />

    <SelectedPlanCard :plan="selectedPlan" :billing-period="store.billingPeriod" @checkout="goCheckout" />

    <section class="subscription-value-strip" aria-label="Abonelik güvenceleri">
      <span><AppIcon name="zap" :size="18" /> Ödeme sonrası hemen aktif</span>
      <span><AppIcon name="shield" :size="18" /> Güvenli ödeme</span>
      <span><AppIcon name="refresh" :size="18" /> Planını değiştir</span>
    </section>

    <AppCard class="subscription-social-proof">
      <div class="subscription-social-proof__avatars" aria-hidden="true">
        <span>A</span>
        <span>M</span>
        <span>+128</span>
      </div>
      <div>
        <strong>Partnerler daha güçlü görünmek için plan seçiyor</strong>
        <p>Profil rozetin, destek seviyen ve paylaşım araçların ödeme sonrası açılır.</p>
      </div>
      <span class="subscription-social-proof__stars" aria-label="5 yıldız">★★★★★</span>
    </AppCard>

    <AppCard class="subscription-reason-card" data-testid="subscription-plan-reasons">
      <h3>Bu plan neden sana uygun?</h3>
      <ul>
        <li v-for="reason in selectedPlan.reasons" :key="reason">{{ reason }}</li>
      </ul>
    </AppCard>

    <button class="subscription-compare-link" type="button" data-testid="compare-plans-link" @click="router.push('/subscription/compare')">
      TÜM PLANLARI KARŞILAŞTIR
    </button>

    <SubscriptionTrustFooter />
    <AppCard class="subscription-faq-card">
      <button type="button">Planımı değiştirebilir miyim? <AppIcon name="chevron-right" :size="18" /></button>
      <button type="button">Yıllık avantaj nedir? <AppIcon name="chevron-right" :size="18" /></button>
      <button type="button">Ne zaman aktif olur? <AppIcon name="chevron-right" :size="18" /></button>
    </AppCard>
    <SubscriptionStickyCTA :plan="selectedPlan" :billing-period="store.billingPeriod" @checkout="goCheckout" />
  </div>
</template>
