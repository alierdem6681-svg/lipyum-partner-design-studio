<script setup>
import AppButton from "../ui/AppButton.vue";
import AppCard from "../ui/AppCard.vue";

defineProps({
  store: { type: Object, required: true },
});
</script>

<template>
  <div class="subscription-flow" data-testid="subscription-canceled-state">
    <AppCard class="subscription-state-card">
      <span class="subscription-muted-pill">YENİLENMEYECEK</span>
      <h2>Plus erişimin {{ store.accessEndsAt }} tarihine kadar aktif</h2>
      <p>Aboneliğin bu tarihte sona erecek ve yenilenmeyecek.</p>
      <AppButton full-width data-testid="reactivate-subscription" @click="store.reactivateMock">
        YENİDEN ETKİNLEŞTİR
      </AppButton>
    </AppCard>
  </div>
</template>
