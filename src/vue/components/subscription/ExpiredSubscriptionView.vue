<script setup>
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import SubscriptionTrustFooter from "./SubscriptionTrustFooter.vue";

defineProps({
  store: { type: Object, required: true },
});

const emit = defineEmits(["purchase", "restore"]);
</script>

<template>
  <div class="subscription-state subscription-state--expired" data-testid="subscription-state-expired">
    <section class="subscription-message-card">
      <span class="subscription-expired-icon" aria-hidden="true"><AppIcon name="crown" :size="28" /></span>
      <h2>Plus avantajların sona erdi</h2>
      <p>Daha önce kullandığın avantajlara geri dönebilirsin.</p>
      <ul>
        <li>Plus profil kartı</li>
        <li>Müşteri hizmetleri</li>
        <li>Performans önerileri</li>
      </ul>
      <AppButton full-width data-testid="subscription-return-plus" @click="emit('purchase', 'plus')">
        PLUS’A GERİ DÖN
      </AppButton>
    </section>
    <SubscriptionTrustFooter @restore="emit('restore')" />
  </div>
</template>
