<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppIcon from "../ui/AppIcon.vue";
import SelectedPlanDecisionCard from "./SelectedPlanDecisionCard.vue";
import SubscriptionMobilePlanRows from "./SubscriptionMobilePlanRows.vue";
import {
  buildCheckoutQuery,
  faqPreviewItems,
  getDisplayPlan,
  subscriptionGoldFocusCopy,
  safeAndTransparentItems,
  trustTiles,
  whyGoldBenefits,
} from "../../data/subscriptionGoldFocusModel.js";
import "../../styles/subscription-gold-focus.css";

const props = defineProps({
  store: { type: Object, required: true },
});

const router = useRouter();
const openFaqId = ref("");

const selectedPlan = computed(() => getDisplayPlan(props.store.selectedPlan));

function selectBilling(period) {
  props.store.selectBillingPeriod(period);
}

function selectPlan(planId) {
  props.store.selectPlan(planId);
}

function checkout() {
  router.push({
    path: "/subscription/checkout",
    query: buildCheckoutQuery(selectedPlan.value, props.store.billingPeriod),
  });
}

function toggleFaq(id) {
  openFaqId.value = openFaqId.value === id ? "" : id;
}
</script>

<template>
  <div class="subscription-gold-focus" data-testid="subscription-gold-focus-view">
    <section class="sgf-hero" data-testid="subscription-gold-focus-hero">
      <div class="sgf-hero__copy">
        <h2>
          <span>Daha <em>güçlü</em> görün.</span>
          <span>Daha çok <em>fırsat</em> yakala.</span>
        </h2>
        <p v-if="subscriptionGoldFocusCopy.heroCopy">{{ subscriptionGoldFocusCopy.heroCopy }}</p>
      </div>
      <span class="sgf-hero__orb" aria-hidden="true">
        <AppIcon name="crown" :size="32" />
      </span>
    </section>

    <section class="sgf-billing-toggle" aria-label="Ödeme dönemi seçimi">
      <button
        type="button"
        :class="{ 'is-active': store.billingPeriod === 'monthly' }"
        data-testid="subscription-gold-focus-billing-monthly"
        @click="selectBilling('monthly')"
      >
        <strong>Aylık</strong>
        <small>Esnek ödeme</small>
      </button>
      <button
        type="button"
        :class="{ 'is-active': store.billingPeriod === 'annual' }"
        data-testid="subscription-gold-focus-billing-annual"
        @click="selectBilling('annual')"
      >
        <strong>Yıllık · 2 ay ücretsiz</strong>
        <small>%16 tasarruf</small>
      </button>
    </section>

    <SubscriptionMobilePlanRows
      :plans="store.plans"
      :selected-plan-id="store.selectedPlanId"
      :billing-period="store.billingPeriod"
      @select="selectPlan"
    />

    <SelectedPlanDecisionCard :plan="selectedPlan" :billing-period="store.billingPeriod" @checkout="checkout" />

    <section class="sgf-trust-tiles" aria-label="Abonelik güvenceleri">
      <span v-for="tile in trustTiles" :key="tile.id" data-testid="subscription-gold-focus-trust-tile">
        <AppIcon :name="tile.icon" :size="21" />
        <strong>{{ tile.title }}</strong>
        <small v-if="tile.subtitle">{{ tile.subtitle }}</small>
      </span>
    </section>

    <section class="sgf-social-proof" data-testid="subscription-gold-focus-social-proof">
      <span class="sgf-social-proof__avatar" aria-hidden="true">LP</span>
      <div>
        <strong>{{ subscriptionGoldFocusCopy.socialProofTitle }}</strong>
        <p>“{{ subscriptionGoldFocusCopy.socialProofQuote }}”</p>
        <span class="sgf-social-proof__stars" aria-label="5 yıldız">★★★★★</span>
      </div>
    </section>

    <section class="sgf-why" data-testid="subscription-gold-focus-why">
      <h3>{{ subscriptionGoldFocusCopy.whyTitle }}</h3>
      <div>
        <span v-for="item in whyGoldBenefits" :key="item.id">
          <AppIcon :name="item.icon" :size="15" />
          <strong>{{ item.title }}</strong>
        </span>
      </div>
    </section>

    <section class="sgf-safe" data-testid="subscription-gold-focus-safe">
      <div>
        <h3>{{ subscriptionGoldFocusCopy.safeTitle }}</h3>
        <ul>
          <li v-for="item in safeAndTransparentItems" :key="item">
            <AppIcon name="check" :size="14" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <span class="sgf-safe__shield" aria-hidden="true">
        <AppIcon name="shield" :size="42" />
      </span>
    </section>

    <section class="sgf-faq" aria-label="Sıkça Sorulan Sorular">
      <button
        v-for="item in faqPreviewItems"
        :key="item.id"
        type="button"
        class="sgf-faq__row"
        :class="{ 'is-open': openFaqId === item.id }"
        data-testid="subscription-gold-focus-faq-row"
        @click="toggleFaq(item.id)"
      >
        <span>
          <strong>{{ item.question }}</strong>
          <small v-if="openFaqId === item.id">{{ item.answer }}</small>
        </span>
        <AppIcon name="chevron-right" :size="17" />
      </button>
    </section>
  </div>
</template>
