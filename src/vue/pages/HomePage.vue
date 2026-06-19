<script setup>
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const score = 81;

const metrics = [
  { label: "Partnerler", value: "34", icon: "users" },
  { label: "Tamamlanan İş", value: "18", icon: "briefcase" },
  { label: "Teklifler", value: "128", icon: "file-text" },
];

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
          <button
            class="performance-info-btn text"
            type="button"
            data-open="performance-info"
            aria-label="Performans skoru nedir?"
            @click.stop="openInfoSheet('Performans Skoru', 'Profil kaliten, hızlı dönüşlerin ve iş sonuçların performans skorunu belirler.')"
          >
            Nedir?
          </button>
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
            @click.stop="$router.push('/performance-score')"
          >
            <AppIcon name="trend-up" :size="14" class-name="icon" />
            Skorumu Artır
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
              <button class="wallet-action-pill" type="button" data-open="credit" data-action="credit" @click="$router.push('/wallet')">
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
            <span data-region-activity-text>Mehmet Ali A. az önce Yenişehir ilçesinde bir buzdolabı tamir işi aldı.</span>
          </div>
        </div>
      </AppCard>
    </div>
  </AppPage>
</template>
