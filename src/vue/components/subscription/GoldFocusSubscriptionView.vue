<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../ui/AppButton.vue";
import AppCard from "../ui/AppCard.vue";
import AppIcon from "../ui/AppIcon.vue";
import SelectedPlanDecisionCard from "./SelectedPlanDecisionCard.vue";
import SubscriptionMobilePlanRows from "./SubscriptionMobilePlanRows.vue";
import SubscriptionMobileStickyBar from "./SubscriptionMobileStickyBar.vue";
import {
  buildCheckoutQuery,
  faqPreviewItems,
  getAssetPath,
  getDisplayPlan,
  safeAndTransparentItems,
  subscriptionGoldFocusCopy,
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
const crownOrb = getAssetPath("lipyum-gold-crown-orb.svg");
const trustedShield = getAssetPath("lipyum-trusted-shield.svg");

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
  <div class="subscription-flow subscription-gold-focus-shell" data-testid="subscription-free-state">
    <div class="subscription-gold-focus" data-testid="subscription-gold-focus-view">
      <AppCard class="sgf-current-plan" padding="sm">
        <span class="sgf-current-plan__icon" aria-hidden="true">
          <AppIcon name="user" :size="21" />
        </span>
        <span>
          <small>MEVCUT PLAN</small>
          <strong>Free</strong>
          <em>Temel kullanım aktif</em>
        </span>
        <AppIcon name="chevron-right" :size="20" />
      </AppCard>

      <section class="sgf-hero" data-testid="subscription-gold-focus-hero">
        <div class="sgf-hero__copy">
          <h2>
            <span v-for="line in subscriptionGoldFocusCopy.heroLines" :key="line">{{ line }}</span>
          </h2>
          <p>{{ subscriptionGoldFocusCopy.heroCopy }}</p>
        </div>
        <span class="sgf-hero__orb" aria-hidden="true">
          <img :src="crownOrb" alt="" />
        </span>
      </section>

      <section class="sgf-section-head">
        <strong>Planını seç</strong>
        <span>{{ store.billingPeriod === "annual" ? "Yıllık ödeme" : "Aylık ödeme" }}</span>
      </section>

      <div class="sgf-billing-toggle" role="group" aria-label="Ödeme dönemi seçimi">
        <button
          type="button"
          :class="{ 'is-active': store.billingPeriod === 'monthly' }"
          :aria-pressed="store.billingPeriod === 'monthly'"
          data-testid="billing-monthly"
          @click="selectBilling('monthly')"
        >
          <strong>Aylık</strong>
          <small>Aylık ödeme</small>
        </button>
        <button
          type="button"
          :class="{ 'is-active': store.billingPeriod === 'annual' }"
          :aria-pressed="store.billingPeriod === 'annual'"
          data-testid="billing-annual"
          @click="selectBilling('annual')"
        >
          <strong>Yıllık · 2 ay ücretsiz</strong>
          <small>%16 avantaj</small>
        </button>
      </div>

      <SubscriptionMobilePlanRows
        :plans="store.plans"
        :selected-plan-id="store.selectedPlanId"
        :billing-period="store.billingPeriod"
        @select="selectPlan"
      />

      <SelectedPlanDecisionCard :plan="selectedPlan" :billing-period="store.billingPeriod" @checkout="checkout" />

      <section class="sgf-trust-tiles" aria-label="Abonelik güvenceleri">
        <span v-for="tile in trustTiles" :key="tile.id" data-testid="subscription-gold-focus-trust-tile">
          <AppIcon :name="tile.icon" :size="20" />
          <strong>{{ tile.title }}</strong>
          <small>{{ tile.subtitle }}</small>
        </span>
      </section>

      <AppCard class="sgf-social-proof" padding="sm" data-testid="subscription-gold-focus-social-proof">
        <div class="sgf-social-proof__avatars" aria-hidden="true">
          <span>A</span>
          <span>M</span>
          <span>+128</span>
        </div>
        <div>
          <strong>{{ subscriptionGoldFocusCopy.socialProofTitle }}</strong>
          <p>"{{ subscriptionGoldFocusCopy.socialProofQuote }}"</p>
        </div>
        <span class="sgf-social-proof__stars" aria-label="5 yıldız">★★★★★</span>
      </AppCard>

      <AppCard class="sgf-why" padding="sm" data-testid="subscription-gold-focus-why">
        <h3>{{ subscriptionGoldFocusCopy.whyTitle }}</h3>
        <div>
          <span v-for="item in whyGoldBenefits" :key="item.id">
            <AppIcon :name="item.icon" :size="15" />
            <strong>{{ item.title }}</strong>
          </span>
        </div>
      </AppCard>

      <AppButton
        variant="secondary"
        size="lg"
        full-width
        data-testid="compare-plans-link"
        @click="router.push('/subscription/compare')"
      >
        TÜM PLANLARI KARŞILAŞTIR
      </AppButton>

      <AppCard class="sgf-safe" padding="sm" data-testid="subscription-gold-focus-safe">
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
          <img :src="trustedShield" alt="" />
        </span>
      </AppCard>

      <section class="sgf-faq" aria-label="Sıkça sorulan sorular">
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

      <SubscriptionMobileStickyBar :plan="selectedPlan" :billing-period="store.billingPeriod" @checkout="checkout" />
    </div>
  </div>
</template>
