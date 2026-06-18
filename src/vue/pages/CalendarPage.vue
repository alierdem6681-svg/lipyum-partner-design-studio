<script setup>
import { ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";

const activeSheet = ref(null);
const appointments = [
  { time: "10:00", name: "Ayşe Hanım", service: "Saç Boya", staff: "Elif" },
  { time: "11:30", name: "Mehmet Bey", service: "Sakal Tıraşı", staff: "Ali" },
  { time: "14:00", name: "Zeynep Hanım", service: "Fön", staff: "Elif" },
];
const workers = [
  { name: "Elif", hours: "09:00-18:00", count: "3 randevu" },
  { name: "Ali", hours: "10:00-20:00", count: "2 randevu" },
];

function openSheet(title, description) {
  activeSheet.value = { title, description };
}
</script>

<template>
  <AppPage title="Takvim">
    <div class="v-stack">
      <div class="v-section-title">
        <h2>Bugünkü Randevular</h2>
        <span class="v-section-title__action">3 kayıt</span>
      </div>
      <AppCard padding="lg" class="v-calendar-list-card">
        <div
          v-for="item in appointments"
          :key="`${item.time}-${item.name}`"
          class="v-appointment-row"
          role="button"
          tabindex="0"
          data-contract-ignore="true"
          @click="openSheet(item.name, `${item.service} · ${item.staff}`)"
          @keydown.enter.prevent="openSheet(item.name, `${item.service} · ${item.staff}`)"
          @keydown.space.prevent="openSheet(item.name, `${item.service} · ${item.staff}`)"
        >
          <div>
            <strong>{{ item.time }} {{ item.name }}</strong>
            <small>{{ item.service }} · {{ item.staff }}</small>
          </div>
          <AppChip tone="success">Onaylı</AppChip>
        </div>
      </AppCard>

      <div class="v-section-title">
        <h2>Çalışanlar</h2>
        <span class="v-section-title__action">Müsaitlik</span>
      </div>
      <AppCard padding="lg" class="v-calendar-list-card">
        <div v-for="worker in workers" :key="worker.name" class="v-worker-row">
          <div>
            <strong>{{ worker.name }}</strong>
            <small>{{ worker.hours }}</small>
          </div>
          <AppChip tone="info">{{ worker.count }}</AppChip>
        </div>
      </AppCard>

      <AppCard padding="lg" class="v-calendar-service-card">
        <div class="v-section-title">
          <h2>Hizmet Süreleri</h2>
          <AppChip tone="info">Kuaför</AppChip>
        </div>
        <div class="v-mini-table">
          <div><span>Saç Boya</span><strong>90 dk</strong></div>
          <div><span>Fön</span><strong>30 dk</strong></div>
          <div><span>Sakal Tıraşı</span><strong>25 dk</strong></div>
        </div>
        <div class="v-chip-row">
          <AppChip tone="danger">Elif 10:00 dolu</AppChip>
          <AppChip tone="success">Elif 16:00 müsait</AppChip>
          <AppChip tone="success">Ali 15:30 müsait</AppChip>
        </div>
      </AppCard>

      <AppCard padding="lg">
        <AppChip tone="info" icon="qr">Randevu Linki</AppChip>
        <h3 class="v-calendar-link-title">Müşterilerin senden ücretsiz randevu alsın</h3>
        <p class="v-calendar-link-copy">Kendi linkinden gelen müşteriler senin müşterindir. Bu randevulardan komisyon alınmaz.</p>
        <div class="v-action-row">
          <AppButton full-width data-action="share" @click="openSheet('Linki Paylaş', 'Randevu linki paylaşım mock akışı.')">
            <AppIcon name="share" :size="16" /> Linki Paylaş
          </AppButton>
          <AppButton full-width variant="secondary" data-open="qr" @click="openSheet('QR Göster', 'Randevu QR mock görünümü.')">
            <AppIcon name="qr" :size="16" /> QR Göster
          </AppButton>
        </div>
      </AppCard>
    </div>

    <AppSheet v-if="activeSheet" :open="!!activeSheet" :title="activeSheet.title" :description="activeSheet.description" @close="activeSheet = null">
      <p class="v-sheet-copy">Bu V12-C mock akışında beklenen randevu sonucu doğrulanır.</p>
    </AppSheet>
  </AppPage>
</template>
