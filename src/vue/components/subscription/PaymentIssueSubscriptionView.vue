<script setup>
import AppButton from "../ui/AppButton.vue";
import AppCard from "../ui/AppCard.vue";
</script>

<template>
  <div class="subscription-flow" data-testid="subscription-payment-issue-state">
    <AppCard class="subscription-state-card is-warning">
      <span class="subscription-muted-pill">ÖDEME GEREKİYOR</span>
      <h2>Ödeme alınamadı</h2>
      <p>Plus avantajların 3 gün daha açık kalacak.</p>
      <AppButton full-width data-testid="resolve-payment-issue" @click="$emit('resolve')">
        ÖDEME YÖNTEMİNİ GÜNCELLE
      </AppButton>
    </AppCard>
  </div>
</template>
