<script setup>
import AppButton from "../ui/AppButton.vue";
import CurrentSubscriptionCard from "./CurrentSubscriptionCard.vue";
import SubscriptionTrustFooter from "./SubscriptionTrustFooter.vue";

defineProps({
  store: { type: Object, required: true },
});

const emit = defineEmits(["resolve", "manage", "restore"]);
</script>

<template>
  <div class="subscription-state subscription-state--payment" data-testid="subscription-state-payment-issue">
    <CurrentSubscriptionCard
      :plan="store.currentPlan"
      status-label="Ödeme sorunu"
      :renewal-copy="store.renewalCopy"
      :platform="store.billingPlatform"
      tone="warning"
      @manage="emit('manage')"
    />
    <section class="subscription-message-card is-warning">
      <h2>Ödeme alınamadı</h2>
      <p>{{ store.currentPlan.title }} avantajların 3 gün daha açık kalacak.</p>
      <AppButton full-width data-testid="subscription-resolve-payment" @click="emit('resolve')">
        ÖDEME YÖNTEMİNİ GÜNCELLE
      </AppButton>
    </section>
    <SubscriptionTrustFooter @restore="emit('restore')" />
  </div>
</template>
