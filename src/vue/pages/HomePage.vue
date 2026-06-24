<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import WalletSummaryPanel from "../components/wallet/WalletSummaryPanel.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const score = 81;

const metrics = [
  { label: "Partnerler", value: "34", icon: "users" },
  { label: "Tamamlanan İş", value: "18", icon: "briefcase" },
  { label: "Teklifler", value: "128", icon: "file-text" },
];

const regionActivities = [
  "Mehmet Ali A. az önce Yenişehir ilçesinde bir buzdolabı tamir işi aldı.",
  "Elif Yılmaz bugün Mezitli’de klima bakım talebini tamamladı.",
  "Ahmet Kaya son 10 dakikada Toroslar’da kombi arızasına teklif verdi.",
];

const activeRegionActivity = ref(0);
const currentRegionActivity = computed(() => regionActivities[activeRegionActivity.value]);
let regionActivityTimer = 0;

onMounted(() => {
  regionActivityTimer = window.setInterval(() => {
    activeRegionActivity.value = (activeRegionActivity.value + 1) % regionActivities.length;
  }, 3600);
});

onUnmounted(() => {
  window.clearInterval(regionActivityTimer);
});

function openInfoSheet(title, body) {
  shell.openSheet({
    title,
    description: "Bilgi",
    body,
  });
}

function openConvertSheet() {
  shell.openSheet({
    type: "bonus-convert",
    title: "Krediye Çevir",
    description: "Bonusunu en avantajlı şekilde kullan.",
  });
}
</script>

<template>
  <AppPage title="Ana Sayfa">
    <div class="v-stack v-home-stack">
      <AppCard
        padding="none"
        class="performance-home-card"
        data-testid="home-performance-card"
        data-action="performance-detail"
        aria-label="Performans Skoru"
        @click="$router.push('/performance-score')"
      >
        <div class="performance-card-head">
          <span class="performance-title">Performans Skoru</span>
        </div>

        <div class="performance-home-layout">
          <span class="performance-score-ring">
            <span><strong>{{ score }}</strong></span>
          </span>
          <span class="performance-home-copy">
            <span class="score-level">
              <AppIcon name="star" :size="12" class-name="icon" />
              İyi
            </span>
          </span>
          <button
            class="performance-cta"
            type="button"
            data-testid="home-performance-improve-button"
            data-screen="performanceScore"
            data-action="performanceScore"
            @click.stop="$router.push('/performance-score')"
          >
            <AppIcon name="trend-up" :size="14" class-name="icon" />
            Performansımı Artır
          </button>
        </div>

        <span class="performance-helper">85 puana ulaşmana çok az kaldı.</span>
        <div class="score-progress-wrap">
          <div class="score-progress" aria-label="Performans skoru 81, hedef 85">
            <span></span>
            <i class="score-marker" aria-hidden="true"></i>
          </div>
          <span class="score-marker-label">85</span>
          <span class="score-end-label">100</span>
        </div>
      </AppCard>

      <WalletSummaryPanel
        test-id="home-wallet-card"
        bonus-test-id="home-bonus-card"
        @wallet-info="openInfoSheet('Cüzdan', 'Kredilerini iş almak ve teklif vermek için kullanırsın.')"
        @bonus-info="openInfoSheet('Bonus', 'Bonuslarını kredi yüklerken kullanabilirsin.')"
        @credit="$router.push('/wallet')"
        @convert="openConvertSheet"
      />

      <AppCard padding="none" class="region-home-card" data-testid="home-region-card">
        <div class="region-card-head">
          <h3>Bölgendeki İşler</h3>
          <div class="region-filter-row" aria-label="Bölge iş tarihi filtreleri">
            <button class="chip-btn active" type="button" data-region-filter="Bugün">Bugün</button>
            <button class="chip-btn" type="button" data-region-filter="Dün">Dün</button>
          </div>
        </div>
        <div class="kpi-row">
          <div v-for="item in metrics" :key="item.label" class="kpi-tile">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <em class="region-kpi-icon">
              <AppIcon :name="item.icon" :size="13" class-name="icon" />
            </em>
          </div>
        </div>
        <div
          class="region-activity-board"
          data-testid="home-region-activity"
          role="status"
          aria-live="polite"
          aria-label="Bölgedeki iş bildirimi"
        >
          <div class="region-activity-message">
            <span class="region-activity-dot" aria-hidden="true"></span>
            <Transition name="region-activity-slide" mode="out-in">
              <span :key="currentRegionActivity" data-region-activity-text>{{ currentRegionActivity }}</span>
            </Transition>
          </div>
        </div>
      </AppCard>
    </div>
  </AppPage>
</template>
