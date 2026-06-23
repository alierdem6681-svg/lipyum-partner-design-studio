<script setup>
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import { formatPrice, getPlanPrice, planCtaLabel } from "../../data/subscriptionPlans.js";

const props = defineProps({
  plan: { type: Object, required: true },
  billingPeriod: { type: String, default: "monthly" },
});

const emit = defineEmits(["checkout"]);

function priceCopy() {
  const suffix = props.billingPeriod === "annual" ? "yıl" : "ay";
  return `${formatPrice(getPlanPrice(props.plan, props.billingPeriod))} TL / ${suffix}`;
}
</script>

<template>
  <section class="subscription-sticky-cta" aria-label="Satın alma işlemi">
    <span :class="['subscription-sticky-cta__icon', `is-${plan.tone || plan.id}`]" aria-hidden="true">
      <AppIcon :name="plan.icon || 'star'" :size="22" />
    </span>
    <div>
      <strong>Lipyum {{ plan.title }}</strong>
      <span>{{ priceCopy() }}</span>
      <small>Ödeme sonrası hemen aktif</small>
    </div>
    <AppButton size="lg" data-testid="subscription-sticky-cta" @click="emit('checkout')">
      {{ planCtaLabel(plan) }}
    </AppButton>
  </section>
</template>
