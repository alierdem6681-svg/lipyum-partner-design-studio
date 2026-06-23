<script setup>
import AppButton from "../ui/AppButton.vue";
import AppCard from "../ui/AppCard.vue";
import SubscriptionBenefitList from "./SubscriptionBenefitList.vue";

defineProps({
  store: { type: Object, required: true },
});

const previousBenefits = ["Plus profil kartı", "Müşteri hizmetleri", "Performans önerileri"];
</script>

<template>
  <div class="subscription-flow" data-testid="subscription-expired-state">
    <AppCard class="subscription-state-card">
      <span class="subscription-muted-pill">SÜRESİ DOLDU</span>
      <h2>Plus avantajların sona erdi</h2>
      <p>Daha önce kullandığın avantajları yeniden açabilirsin.</p>
      <SubscriptionBenefitList :benefits="previousBenefits" />
      <AppButton full-width data-testid="return-to-plus" @click="store.selectPlan('plus')">
        PLUS'A GERİ DÖN
      </AppButton>
    </AppCard>
  </div>
</template>
