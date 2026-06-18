<script setup>
import { ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";

const active = ref("incoming");
const activeSheet = ref(null);
const tabs = [
  { id: "incoming", label: "Yeni İşler" },
  { id: "active", label: "Aktif" },
  { id: "offers", label: "Tekliflerim" },
  { id: "done", label: "Tamamlananlar" },
  { id: "issues", label: "Sorunlu" },
];

function openSheet(title, description) {
  activeSheet.value = { title, description };
}
</script>

<template>
  <AppPage title="İşlerim">
    <div class="v-stack">
      <div class="v-tab-scroll v-myjobs-tabs" role="tablist" aria-label="İş durumu">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="v-tab-pill tab-pill"
          :class="active === tab.id ? 'active is-active' : ''"
          type="button"
          @click="active = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <AppCard padding="md" class="v-golden-job-card v-priority-card v-myjobs-card">
        <div class="v-golden-job-top">
          <div class="v-golden-job-title">
            <AppChip tone="success" class="v-myjobs-status-chip">Yeni İş</AppChip>
            <h3>Klima Montajı</h3>
            <p><AppIcon name="map-pin" :size="15" /> Sakarya / Karasu</p>
          </div>
          <AppIcon name="chevron-right" :size="20" />
        </div>

        <div class="v-kpi-row">
          <div><span>Talep zamanı</span><strong>Bugün 15:12</strong></div>
          <div><span>Son teyit</span><strong>15:18</strong></div>
          <div><span>Servis istiyor</span><strong>Evet</strong></div>
        </div>

        <p class="v-meta-line"><AppIcon name="check" :size="15" /> Müşteri servis ücretini biliyor · 260 kredi kullanıldı</p>
        <p class="v-assurance-line"><AppIcon name="check" :size="15" /> Müşteri kaynaklı iptalde nakit iade güvencesi görünür.</p>

        <div class="v-action-row">
          <AppButton full-width data-action="call" @click="openSheet('Müşteriyi Ara', 'Klima Montajı müşterisi için arama mock akışı.')">
            <AppIcon name="phone" :size="16" /> Müşteriyi Ara
          </AppButton>
          <AppButton full-width variant="secondary" data-action="issue" @click="openSheet('Sorun Bildir', 'Bu iş için destek talebi mock akışı.')">
            <AppIcon name="alert" :size="16" /> Sorun Bildir
          </AppButton>
        </div>
      </AppCard>
    </div>

    <AppSheet v-if="activeSheet" :open="!!activeSheet" :title="activeSheet.title" :description="activeSheet.description" @close="activeSheet = null">
      <p class="v-sheet-copy">Bu V12-C mock akışında beklenen sonuç doğrulanır.</p>
    </AppSheet>
  </AppPage>
</template>
