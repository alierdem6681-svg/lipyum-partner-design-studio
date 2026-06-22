<script setup>
import AppButton from "../ui/AppButton.vue";
import CurrentSubscriptionCard from "./CurrentSubscriptionCard.vue";
import SubscriptionTrustFooter from "./SubscriptionTrustFooter.vue";

defineProps({
  store: { type: Object, required: true },
});

const emit = defineEmits(["reactivate", "manage", "restore"]);
</script>

<template>
  <div class="subscription-state subscription-state--canceled" data-testid="subscription-state-canceled">
    <CurrentSubscriptionCard
      :plan="store.currentPlan"
      status-label="Yenilenmeyecek"
      :renewal-copy="store.renewalCopy"
      :platform="store.billingPlatform"
      tone="warning"
      @manage="emit('manage')"
    />
    <section class="subscription-message-card">
      <h2>Plus erişimin aktif</h2>
      <p>Aboneliğin erişim tarihinin sonunda sona erecek ve yenilenmeyecek.</p>
      <AppButton full-width data-testid="subscription-reactivate" @click="emit('reactivate')">
        YENİDEN ETKİNLEŞTİR
      </AppButton>
    </section>
    <SubscriptionTrustFooter @restore="emit('restore')" />
  </div>
</template>
