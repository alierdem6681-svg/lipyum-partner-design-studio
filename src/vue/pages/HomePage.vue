<script setup>
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const score = 81;

const metrics = [
  { label: "Partnerler", value: "34", icon: "users" },
  { label: "Tamamlanan Ä°ÅŸ", value: "18", icon: "briefcase" },
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
    title: "Krediye Ã‡evir",
    description: "BonuslarÄ±nÄ± krediye dÃ¶nÃ¼ÅŸtÃ¼r",
    body: "240 bonusun hazÄ±r. Mock akÄ±ÅŸta bonuslarÄ±nÄ± krediye Ã§evirme onayÄ± burada gÃ¶sterilir.",
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
            @click.stop="openInfoSheet('Performans Skoru', 'Profil kaliten, hÄ±zlÄ± dÃ¶nÃ¼ÅŸlerin ve iÅŸ sonuÃ§larÄ±n performans skorunu belirler.')"
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
              Ä°yi
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
            Skorumu ArtÄ±r
          </button>
        </div>

        <span class="performance-helper">85 puana ulaÅŸmana Ã§ok az kaldÄ±.</span>
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
              <span>CÃ¼zdan</span>
            </div>
            <button
              class="wallet-tile-icon"
              type="button"
              data-open="wallet-info"
              data-action="wallet-info"
              aria-label="CÃ¼zdan bilgisi"
              @click="openInfoSheet('CÃ¼zdan', 'Kredilerini iÅŸ almak ve teklif vermek iÃ§in kullanÄ±rsÄ±n.')"
            >
              <AppIcon name="help-circle" :size="17" class-name="icon" />
            </button>
            <span class="wallet-amount"><strong>675</strong><small>kredi</small></span>
            <span class="wallet-subline">â‰ˆ 2-3 iÅŸ alabilirsin</span>
            <div class="wallet-actions">
              <button class="wallet-action-pill" type="button" data-open="credit" data-action="credit" @click="$router.push('/wallet')">
                <AppIcon name="plus" :size="16" class-name="icon" />
                Bakiye YÃ¼kle
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
              @click="openInfoSheet('Bonus', 'BonuslarÄ±nÄ± kredi yÃ¼klerken kullanabilirsin.')"
            >
              <AppIcon name="help-circle" :size="17" class-name="icon" />
            </button>
            <span class="wallet-amount"><strong>240</strong><small>bonus</small></span>
            <span class="wallet-subline">Kredi yÃ¼klerken kullanÄ±lÄ±r.</span>
            <div class="wallet-actions split">
              <button class="wallet-action-pill convert" type="button" data-open="bonus-convert" @click="openConvertSheet">
                <AppIcon name="refresh" :size="16" class-name="icon" />
                Krediye Ã‡evir
              </button>
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard padding="none" class="region-home-card" data-testid="home-region-card">
        <div class="region-card-head">
          <h3>BÃ¶lgendeki Ä°ÅŸler</h3>
          <div class="region-filter-row" aria-label="BÃ¶lge iÅŸ tarihi filtreleri">
            <button class="chip-btn active" type="button" data-region-filter="BugÃ¼n">BugÃ¼n</button>
            <button class="chip-btn" type="button" data-region-filter="DÃ¼n">DÃ¼n</button>
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
          aria-label="BÃ¶lgedeki iÅŸ bildirimi"
        >
          <div class="region-activity-message">
            <span class="region-activity-dot" aria-hidden="true"></span>
            <span data-region-activity-text>Mehmet Ali A. az Ã¶nce YeniÅŸehir ilÃ§esinde bir buzdolabÄ± tamir iÅŸi aldÄ±.</span>
          </div>
        </div>
      </AppCard>
    </div>
  </AppPage>
</template>
