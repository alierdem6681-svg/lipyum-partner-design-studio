<script setup>
import AppBadge from "../ui/AppBadge.vue";
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import SubscriptionBenefitList from "./SubscriptionBenefitList.vue";

defineProps({
  plan: { type: Object, required: true },
  selectedPlan: { type: Object, required: true },
  billingPeriod: { type: String, default: "monthly" },
  ctaLabel: { type: String, default: "30 GÜN ÜCRETSİZ DENE" },
});

const emit = defineEmits(["select-plan", "cta"]);

function planPrice(plan, billingPeriod) {
  if (billingPeriod === "annual") {
    return {
      value: `${plan.annualPrice.toLocaleString("tr-TR")} TL`,
      suffix: "/ yıl",
      note: `aylık karşılığı ${plan.monthlyEquivalent} TL`,
    };
  }
  return {
    value: `${plan.monthlyPrice} TL`,
    suffix: "/ ay",
    note: plan.id === "plus" ? "günde yaklaşık 8,30 TL" : plan.targetUser,
  };
}
</script>

<template>
  <section class="subscription-recommended" data-testid="subscription-recommended-card">
    <div class="subscription-recommended__plan-picker" aria-label="Plan seçenekleri">
      <button
        v-for="item in plan"
        :key="item.id"
        :class="['subscription-plan-option', selectedPlan.id === item.id ? 'is-active' : '']"
        type="button"
        :data-testid="`subscription-option-${item.id}`"
        @click="emit('select-plan', item.id)"
      >
        <strong>{{ item.title }}</strong>
        <small>{{ item.monthlyPrice }} TL/ay</small>
      </button>
    </div>

    <div class="subscription-recommended__detail">
      <div class="subscription-recommended__top">
        <AppBadge v-if="selectedPlan.recommended" tone="success">Önerilen</AppBadge>
        <span v-else class="subscription-muted-label">Doğrudan geçebilirsin</span>
        <span class="subscription-recommended__icon" aria-hidden="true">
          <AppIcon :name="selectedPlan.id === 'vip' ? 'trophy' : selectedPlan.id === 'pro' ? 'crown' : 'sparkles'" :size="24" />
        </span>
      </div>
      <div class="subscription-recommended__price">
        <span>
          <strong>{{ selectedPlan.title }}</strong>
          <small>{{ planPrice(selectedPlan, billingPeriod).note }}</small>
        </span>
        <span>
          <strong>{{ planPrice(selectedPlan, billingPeriod).value }}</strong>
          <small>{{ planPrice(selectedPlan, billingPeriod).suffix }}</small>
        </span>
      </div>
      <SubscriptionBenefitList :items="selectedPlan.benefits.slice(0, 4)" :tone="selectedPlan.tone" />
      <AppButton full-width size="lg" data-testid="subscription-primary-cta" @click="emit('cta', selectedPlan.id)">
        {{ selectedPlan.id === 'plus' ? ctaLabel : `${selectedPlan.title.toUpperCase()} PLANINI SEÇ` }}
      </AppButton>
      <p class="subscription-cta-note">
        <template v-if="selectedPlan.id === 'plus'">30 gün ücretsiz. Sonrasında 249 TL/ay. İstediğin zaman iptal edebilirsin.</template>
        <template v-else>Satın alma öncesi fiyat ve yenileme bilgisi açıkça gösterilir.</template>
      </p>
    </div>
  </section>
</template>
