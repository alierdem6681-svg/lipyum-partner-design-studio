<script setup>
import { ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";

const selected = ref(null);
const jobs = [
  { type: "Direkt İş", title: "Klima arızası", area: "Karşıyaka", price: "₺1.850", tag: "Hazır müşteri" },
  { type: "Havuz", title: "Bulaşık makinesi", area: "Bostanlı", price: "Teklif ver", tag: "Havuz işi" },
  { type: "Teklif", title: "Buzdolabı tamiri", area: "Alsancak", price: "₺2.400", tag: "Teklif bekliyor" },
];
</script>

<template>
  <AppPage title="İş Al">
    <div class="v-stack">
      <AppCard padding="lg" class="v-job-hero">
        <h2>Yeni iş fırsatlarını yakala</h2>
        <p>Hazır işler, havuz ve teklif fırsatları tek ekranda.</p>
      </AppCard>
      <div class="v-filter-row">
        <AppChip tone="success">Hazır işler</AppChip>
        <AppChip tone="info">Havuz</AppChip>
        <AppChip tone="warning">Teklif</AppChip>
      </div>
      <AppCard v-for="job in jobs" :key="job.title" padding="md" class="v-job-card" data-testid="job-card">
        <div>
          <AppChip tone="neutral">{{ job.type }}</AppChip>
          <h3>{{ job.title }}</h3>
          <p>{{ job.area }} · {{ job.tag }}</p>
        </div>
        <strong>{{ job.price }}</strong>
        <AppButton size="sm" @click="selected = job">Detay</AppButton>
      </AppCard>
    </div>
    <AppSheet v-if="selected" :open="!!selected" :title="selected.title" :description="selected.area" @close="selected = null">
      <p class="v-sheet-copy">Mock iş detayı. Müşteriyi arama, teklif verme ve işi kabul etme aksiyonları burada gösterilir.</p>
    </AppSheet>
  </AppPage>
</template>
