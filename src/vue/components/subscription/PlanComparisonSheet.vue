<script setup>
import { computed } from "vue";
import { BILLING_PERIODS } from "../../data/subscriptionPlans.js";
import AppButton from "../ui/AppButton.vue";
import AppSheet from "../ui/AppSheet.vue";
import PlanCard from "./PlanCard.vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  plans: { type: Array, default: () => [] },
  selectedPlanId: { type: String, default: "plus" },
  billingPeriod: { type: String, default: BILLING_PERIODS.MONTHLY },
});

const emit = defineEmits(["close", "select-plan", "billing-period", "purchase"]);

const billingOptions = computed(() => [
  { id: BILLING_PERIODS.MONTHLY, label: "Aylık" },
  { id: BILLING_PERIODS.ANNUAL, label: "Yıllık · %20 avantaj" },
]);
</script>

<template>
  <AppSheet
    :open="open"
    title="Planları Karşılaştır"
    description="İhtiyacına uygun planı seç."
    data-testid="subscription-plan-sheet"
    @close="emit('close')"
  >
    <div class="subscription-compare">
      <div class="subscription-billing-toggle" role="tablist" aria-label="Faturalama dönemi">
        <button
          v-for="option in billingOptions"
          :key="option.id"
          type="button"
          :class="billingPeriod === option.id ? 'is-active' : ''"
          :data-testid="`subscription-billing-${option.id}`"
          @click="emit('billing-period', option.id)"
        >
          {{ option.label }}
        </button>
      </div>

      <PlanCard
        v-for="plan in plans"
        :key="plan.id"
        :plan="plan"
        :selected="selectedPlanId === plan.id"
        :recommended="plan.recommended"
        :billing-period="billingPeriod"
        :cta-label="plan.id === 'plus' ? '30 GÜN ÜCRETSİZ DENE' : 'PLANI SEÇ'"
        @select="emit('select-plan', $event)"
        @cta="emit('purchase', $event)"
      />

      <section class="subscription-free-diff">
        <h3>Free ve ücretli plan farkı</h3>
        <div class="subscription-diff-row">
          <span>Plus / Gold rozeti</span><small>Free</small><strong>Ücretli</strong>
        </div>
        <div class="subscription-diff-row">
          <span>Hızlı müşteri hizmetleri</span><small>-</small><strong>Var</strong>
        </div>
        <div class="subscription-diff-row">
          <span>Performans önerileri</span><small>Temel</small><strong>Gelişmiş</strong>
        </div>
        <AppButton variant="secondary" full-width data-testid="subscription-compare-close" @click="emit('close')">
          Kapat
        </AppButton>
      </section>
    </div>
  </AppSheet>
</template>
