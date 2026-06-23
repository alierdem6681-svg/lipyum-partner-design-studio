<script setup>
import { computed, ref } from "vue";
import AppCard from "../components/ui/AppCard.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const score = 81;

const performanceMilestones = [
  { score: 85, label: "İyi", tone: "good" },
  { score: 90, label: "Çok iyi", tone: "strong" },
  { score: 95, label: "Mükemmel", tone: "excellent" },
];

const activeRegionPeriod = ref("today");

const regionPeriodOptions = [
  { label: "Bugün", value: "today", testId: "home-region-filter-today", attrs: { "data-region-filter": "Bugün" } },
  { label: "Dün", value: "yesterday", testId: "home-region-filter-yesterday", attrs: { "data-region-filter": "Dün" } },
];

const regionPeriodData = {
  today: {
    metrics: [
      { label: "Partnerler", value: "34", icon: "users" },
      { label: "Tamamlanan İş", value: "18", icon: "briefcase" },
      { label: "Teklifler", value: "128", icon: "file-text" },
    ],
    activity: "Mehmet Ali A. az önce Yenişehir ilçesinde bir buzdolabı tamir işi aldı.",
  },
  yesterday: {
    metrics: [
      { label: "Partnerler", value: "31", icon: "users" },
      { label: "Tamamlanan İş", value: "22", icon: "briefcase" },
      { label: "Teklifler", value: "104", icon: "file-text" },
    ],
    activity: "Aydın Ç. dün Şişli ilçesinde bir fırın tamiri işi için teklif verdi.",
  },
};

const activeRegionData = computed(() => regionPeriodData[activeRegionPeriod.value] || regionPeriodData.today);
const metrics = computed(() => activeRegionData.value.metrics);
const regionActivityText = computed(() => activeRegionData.value.activity);

function openInfoSheet(title, body) {
  shell.openSheet({
    title,
    description: "Bilgi",
    body,
  });
}

function openConvertSheet() {
  shell.openSheet({
    title: "Krediye Çevir",
    description: "Bonuslarını krediye dönüştür",
    body: "240 bonusun hazır. Mock akışta bonuslarını krediye çevirme onayı burada gösterilir.",
  });
}

function openTopUpSheet() {
  window.dispatchEvent(new CustomEvent("lipyum:quick-topup"));
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
          <div
            class="performance-milestones"
            data-testid="home-performance-milestones"
            aria-label="Performans eşikleri: 85 iyi, 90 çok iyi, 95 mükemmel"
          >
            <div class="performance-milestones__track" aria-hidden="true">
              <span
                v-for="milestone in performanceMilestones"
                :key="milestone.score"
                :class="['performance-milestones__dot', `is-${milestone.tone}`]"
              >
                {{ milestone.score }}
              </span>
            </div>
            <div class="performance-milestones__labels" aria-hidden="true">
              <span v-for="milestone in performanceMilestones" :key="milestone.label">
                {{ milestone.label }}
              </span>
            </div>
          </div>
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
            data-screen="performanceScore"
            data-action="performanceScore"
            data-testid="home-performance-improve-button"
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

      <AppCard padding="none" class="wallet-summary-card" data-testid="home-wallet-card">
        <div class="wallet-summary">
          <div class="wallet-tile credit">
            <div class="wallet-tile-head">
              <span>Cüzdan</span>
            </div>
            <button
              class="wallet-tile-icon"
              type="button"
              data-open="wallet-info"
              data-action="wallet-info"
              aria-label="Cüzdan bilgisi"
              @click="openInfoSheet('Cüzdan', 'Kredilerini iş almak ve teklif vermek için kullanırsın.')"
            >
              <AppIcon name="help-circle" :size="17" class-name="icon" />
            </button>
            <span class="wallet-amount"><strong>675</strong><small>kredi</small></span>
            <span class="wallet-subline">≈ 2-3 iş alabilirsin</span>
            <div class="wallet-actions">
              <button class="wallet-action-pill" type="button" data-open="credit" data-action="credit" @click="openTopUpSheet">
                <AppIcon name="plus" :size="16" class-name="icon" />
                Bakiye Yükle
              </button>
            </div>
          </div>

          <div class="wallet-tile bonus" data-testid="home-bonus-card">
            <div class="wallet-tile-head">
              <span>Bonus</span>
            </div>
            <button
              class="wallet-tile-icon"
              type="button"
              data-open="bonus-info"
              data-action="bonus-info"
              aria-label="Bonus bilgisi"
              @click="openInfoSheet('Bonus', 'Bonuslarını kredi yüklerken kullanabilirsin.')"
            >
              <AppIcon name="help-circle" :size="17" class-name="icon" />
            </button>
            <span class="wallet-amount"><strong>240</strong><small>bonus</small></span>
            <span class="wallet-subline">Kredi yüklerken kullanılır.</span>
            <div class="wallet-actions split">
              <button class="wallet-action-pill convert" type="button" data-open="bonus-convert" @click="openConvertSheet">
                <AppIcon name="refresh" :size="16" class-name="icon" />
                Krediye Çevir
              </button>
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard padding="none" class="region-home-card" data-testid="home-region-card">
        <div class="region-card-head">
          <h3>Bölgendeki İşler</h3>
          <AppFilterChips
            v-model="activeRegionPeriod"
            :items="regionPeriodOptions"
            aria-label="Bölge iş tarihi filtreleri"
            data-testid="home-region-filter"
          />
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
            <span data-region-activity-text>{{ regionActivityText }}</span>
          </div>
        </div>
      </AppCard>
    </div>
  </AppPage>
</template>
