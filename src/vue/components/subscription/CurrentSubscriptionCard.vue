<script setup>
import AppButton from "../ui/AppButton.vue";
import AppCard from "../ui/AppCard.vue";
import { formatPrice } from "../../data/subscriptionPlans.js";

defineProps({
  plan: { type: Object, required: true },
  renewalDate: { type: String, required: true },
  paymentPlatform: { type: String, required: true },
});

const emit = defineEmits(["manage"]);
</script>

<template>
  <AppCard class="subscription-current-card" data-testid="active-subscription-card">
    <span class="subscription-pill">AKTİF</span>
    <div class="subscription-current-card__headline">
      <h2>Lipyum {{ plan.title }}</h2>
      <strong>{{ formatPrice(plan.monthlyPrice) }} TL / ay</strong>
    </div>
    <dl>
      <div>
        <dt>Sonraki yenileme</dt>
        <dd>{{ renewalDate }}</dd>
      </div>
      <div>
        <dt>Ödeme platformu</dt>
        <dd>{{ paymentPlatform }}</dd>
      </div>
    </dl>
    <AppButton variant="ghost" full-width data-testid="manage-subscription" @click="emit('manage')">
      ABONELİĞİ YÖNET
    </AppButton>
  </AppCard>
</template>
