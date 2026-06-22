<script setup>
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import CurrentSubscriptionCard from "./CurrentSubscriptionCard.vue";
import SubscriptionTrustFooter from "./SubscriptionTrustFooter.vue";

defineProps({
  store: { type: Object, required: true },
});

const emit = defineEmits(["manage", "restore"]);
</script>

<template>
  <div class="subscription-state subscription-state--trial" data-testid="subscription-state-trial">
    <CurrentSubscriptionCard
      :plan="store.currentPlan"
      status-label="Deneme aktif"
      :renewal-copy="store.renewalCopy"
      :platform="store.billingPlatform"
      @manage="emit('manage')"
    />

    <section class="subscription-focus-card">
      <span aria-hidden="true"><AppIcon name="clock" :size="22" /></span>
      <h2>Plus denemenin {{ store.daysRemaining }} günü kaldı</h2>
      <p>Deneme bitmeden önce Plus avantajlarını deneyebilirsin.</p>
      <div class="subscription-next-list">
        <button type="button">Plus profil kartını önizle</button>
        <button type="button">Müşteri hizmetlerini kullan</button>
        <button type="button">Performans önerilerini incele</button>
      </div>
    </section>

    <AppButton full-width data-testid="subscription-trial-manage" @click="emit('manage')">
      ABONELİĞİ YÖNET
    </AppButton>
    <SubscriptionTrustFooter @restore="emit('restore')" />
  </div>
</template>
