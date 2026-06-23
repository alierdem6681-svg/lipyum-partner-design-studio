<script setup>
import AppButton from "../ui/AppButton.vue";
import AppCard from "../ui/AppCard.vue";
import AppIcon from "../ui/AppIcon.vue";
import { formatPrice, getMonthlyEquivalent, getPlanPrice, planCtaLabel } from "../../data/subscriptionPlans.js";
import SubscriptionBenefitList from "./SubscriptionBenefitList.vue";

const props = defineProps({
  plan: { type: Object, required: true },
  billingPeriod: { type: String, default: "monthly" },
});

const emit = defineEmits(["checkout"]);

function priceCopy() {
  const suffix = props.billingPeriod === "annual" ? "yıl" : "ay";
  return `${formatPrice(getPlanPrice(props.plan, props.billingPeriod))} TL / ${suffix}`;
}

function dailyCopy() {
  const monthly = getMonthlyEquivalent(props.plan, props.billingPeriod);
  const daily = monthly / 30;
  return `Günde yaklaşık ${daily.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`;
}
</script>

<template>
  <AppCard class="subscription-selected-card" data-testid="selected-plan-card">
    <span class="subscription-pill">SANA UYGUN</span>
    <div class="subscription-selected-card__top">
      <div>
        <h2>Lipyum {{ plan.title }}</h2>
        <p>{{ dailyCopy() }}</p>
      </div>
      <strong>{{ priceCopy() }}</strong>
    </div>

    <h3>Ödeme sonrası hemen açılanlar</h3>
    <SubscriptionBenefitList :benefits="plan.benefits.slice(0, 4)" />

    <div class="subscription-activation-note">
      <AppIcon name="zap" :size="16" />
      <span>Ödeme tamamlanınca özellikler hemen aktif olur</span>
    </div>

    <AppButton full-width size="lg" data-testid="selected-plan-cta" @click="emit('checkout')">
      {{ planCtaLabel(plan) }}
    </AppButton>
  </AppCard>
</template>
