<script setup>
import { useRoute } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppMetricCard from "../components/ui/AppMetricCard.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const route = useRoute();
const shell = useAppShellStore();
</script>

<template>
  <AppPage title="Partner Detayı" data-testid="referral-partner-detail-page">
    <div class="v-stack">
      <span class="sr-only" data-testid="referral-partner-detail">Partner Detayı</span>
      <AppCard padding="lg" variant="hero" class="v-route-hero">
        <div>
          <h2>Partner Detayı</h2>
          <p>{{ route.params.id }} davet durum ve kazanç özeti.</p>
        </div>
        <AppButton icon="send" @click="shell.showToast('WhatsApp davet mesajı yenilendi.')">Davet Et</AppButton>
      </AppCard>
      <div class="v-content-metric-grid">
        <AppMetricCard label="Durum" value="Aktif" icon="check" />
        <AppMetricCard label="Kazanç" value="₺240" icon="wallet" tone="info" />
      </div>
      <AppCard padding="lg">
        <h2>Kazanç geçmişi</h2>
        <p>İlk iş tamamlama bonusu ve yönlendirme kayıtları burada listelenir.</p>
      </AppCard>
    </div>
  </AppPage>
</template>
