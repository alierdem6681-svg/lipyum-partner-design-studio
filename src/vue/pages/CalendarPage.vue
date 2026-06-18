<script setup>
import { ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppPage from "../components/ui/AppPage.vue";

const selectedDay = ref("Bugün");
const days = ["Bugün", "Yarın", "Cmt", "Paz", "Pzt"];
const appointments = [
  { time: "10:30", title: "Klima arızası", area: "Karşıyaka" },
  { time: "14:00", title: "Kombi bakımı", area: "Bornova" },
];
</script>

<template>
  <AppPage title="Takvim">
    <div class="v-stack">
      <div class="v-filter-row">
        <button
          v-for="day in days"
          :key="day"
          :class="['v-tab-chip', selectedDay === day ? 'is-active' : '']"
          type="button"
          @click="selectedDay = day"
        >
          {{ day }}
        </button>
      </div>
      <AppCard padding="lg">
        <div class="v-section-title">
          <h2>Bugünkü Randevular</h2>
          <AppChip tone="success">2 iş</AppChip>
        </div>
      </AppCard>
      <AppCard v-for="item in appointments" :key="item.time" padding="md" class="v-job-card">
        <strong class="v-calendar-time">{{ item.time }}</strong>
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.area }}</p>
        </div>
        <AppButton size="sm">Detay</AppButton>
      </AppCard>
    </div>
  </AppPage>
</template>
