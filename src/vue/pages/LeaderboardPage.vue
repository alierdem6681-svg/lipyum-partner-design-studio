<script setup>
import { ref } from "vue";
import AppCard from "../components/ui/AppCard.vue";
import AppMetricCard from "../components/ui/AppMetricCard.vue";
import AppPage from "../components/ui/AppPage.vue";

const city = ref("Ümraniye");
const sector = ref("Klima");
const rows = [
  { rank: "#1", name: "Gizli Partner", status: "Çok güçlü yanıt hızı" },
  { rank: "#7", name: "Ahmet Kaya", status: "Senin sıran" },
  { rank: "#8", name: "Gizli Partner", status: "Profil kalitesi yüksek" },
];
</script>

<template>
  <AppPage title="Liderlik Tablosu" data-testid="leaderboard-page">
    <div class="v-stack">
      <div class="v-content-metric-grid">
        <AppMetricCard label="Sıra" value="#7" icon="trophy" />
        <AppMetricCard label="Bölge" :value="city" icon="map-pin" tone="info" />
      </div>
      <div class="v-select-row">
        <label>
          <span>Şehir</span>
          <select v-model="city" data-testid="leaderboard-city">
            <option>Ümraniye</option>
            <option>Ataşehir</option>
          </select>
        </label>
        <label>
          <span>Sektör</span>
          <select v-model="sector" data-testid="leaderboard-sector">
            <option>Klima</option>
            <option>Beyaz eşya</option>
          </select>
        </label>
      </div>
      <div class="v-content-list" role="list">
        <AppCard v-for="row in rows" :key="row.rank" padding="md" as="article" class="v-content-list-item" role="listitem">
          <span class="v-rank-pill">{{ row.rank }}</span>
          <span class="v-content-list-item__copy">
            <strong>{{ row.name }}</strong>
            <small>{{ row.status }}</small>
          </span>
        </AppCard>
      </div>
    </div>
  </AppPage>
</template>
