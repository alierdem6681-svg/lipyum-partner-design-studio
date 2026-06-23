<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppMetricCard from "../components/ui/AppMetricCard.vue";
import AppPage from "../components/ui/AppPage.vue";
import { referralPartners } from "../data/referralProgram.js";
import { useAppShellStore } from "../stores/appShellStore.js";

const route = useRoute();
const shell = useAppShellStore();
const partner = computed(() => referralPartners.find((item) => item.id === route.params.id) || referralPartners[0]);
</script>

<template>
  <AppPage title="Partner Detayı" data-testid="referral-partner-detail-page">
    <div class="v-stack">
      <span class="sr-only" data-testid="referral-partner-detail">Partner Detayı</span>
      <AppCard padding="lg" variant="hero" class="v-route-hero">
        <div>
          <h2>{{ partner.name }}</h2>
          <p>{{ partner.city }} · {{ partner.status }} · {{ partner.phone }}</p>
        </div>
        <AppButton icon="send" @click="shell.showToast('WhatsApp davet mesajı yenilendi.')">Davet Et</AppButton>
      </AppCard>
      <div class="v-content-metric-grid">
        <AppMetricCard label="Durum" :value="partner.stage" icon="check" />
        <AppMetricCard label="Kazanç" :value="partner.earnedTotal" icon="wallet" tone="info" />
      </div>
      <AppCard padding="lg">
        <h2>Sıradaki adım</h2>
        <p>{{ partner.nextStep }}</p>
      </AppCard>
    </div>
  </AppPage>
</template>
