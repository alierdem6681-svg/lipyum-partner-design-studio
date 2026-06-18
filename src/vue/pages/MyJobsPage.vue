<script setup>
import { ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppPage from "../components/ui/AppPage.vue";

const active = ref("Yeni İşler");
const tabs = ["Yeni İşler", "Aktif", "Tekliflerim", "Tamamlananlar", "Sorunlu"];
const list = [
  { title: "Kombi bakımı", status: "Yeni", area: "Bornova", time: "Bugün 14:30" },
  { title: "Çamaşır makinesi", status: "Aktif", area: "Karşıyaka", time: "Bugün 16:00" },
  { title: "Klima montajı", status: "Teklif", area: "Konak", time: "Yarın" },
];
</script>

<template>
  <AppPage title="İşlerim">
    <div class="v-stack">
      <div class="v-filter-row">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['v-tab-chip', active === tab ? 'is-active' : '']"
          type="button"
          @click="active = tab"
        >
          {{ tab }}
        </button>
      </div>
      <AppCard v-for="job in list" :key="job.title" padding="md" class="v-job-card">
        <div>
          <AppChip :tone="job.status === 'Yeni' ? 'success' : job.status === 'Teklif' ? 'warning' : 'info'">{{ job.status }}</AppChip>
          <h3>{{ job.title }}</h3>
          <p>{{ job.area }} · {{ job.time }}</p>
        </div>
        <AppButton size="sm">Aç</AppButton>
      </AppCard>
    </div>
  </AppPage>
</template>
