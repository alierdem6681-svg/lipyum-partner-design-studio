<script setup>
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const metrics = [
  { label: "Partnerler", value: "34", icon: "users" },
  { label: "Tamamlanan", value: "18", icon: "briefcase" },
  { label: "Teklifler", value: "128", icon: "file-text" },
];

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
    <div class="v-stack">
      <AppCard padding="lg" data-testid="home-performance-card" class="v-home-performance-card">
        <div class="v-home-row">
          <div>
            <h2 class="v-home-title">Performans Skoru</h2>
            <AppButton variant="ghost" size="sm" @click="$router.push('/performance-score')">Nedir?</AppButton>
            <div class="v-score-orbit"><strong>81</strong></div>
          </div>
          <div class="v-home-performance-copy">
            <AppChip tone="success">İyi</AppChip>
            <AppButton size="sm" @click="$router.push('/performance-score')">
              <AppIcon name="trend-up" :size="16" /> Skorumu Artır
            </AppButton>
          </div>
        </div>
        <p class="v-progress-copy">85 puana ulaşmana çok az kaldı.</p>
        <div class="v-progress"><span class="v-progress__fill v-progress__fill--81" /></div>
        <div class="v-progress-scale"><span>85</span><span>100</span></div>
      </AppCard>

      <AppCard padding="lg" data-testid="home-wallet-card" class="v-home-wallet-summary-card">
        <div class="v-home-wallet-grid">
          <div>
            <span class="v-card-kicker">Cüzdan</span>
            <strong class="v-home-metric">675<small>kredi</small></strong>
            <p>≈ 2-3 iş alabilirsin</p>
            <AppButton variant="secondary" size="sm" full-width @click="$router.push('/wallet')">
              <AppIcon name="plus" :size="16" /> Bakiye Yükle
            </AppButton>
          </div>
          <div data-testid="home-bonus-card">
            <span class="v-card-kicker">Bonus</span>
            <strong class="v-home-metric">240<small>bonus</small></strong>
            <p>Kredi yüklerken kullanılır.</p>
            <AppButton variant="ghost" size="sm" full-width @click="openConvertSheet">
              <AppIcon name="refresh" :size="16" /> Krediye Çevir
            </AppButton>
          </div>
        </div>
      </AppCard>

      <AppCard padding="lg" data-testid="home-region-card">
        <div class="v-section-title">
          <h2>Bölgendeki İşler</h2>
          <div class="v-region-day-tabs">
            <button class="is-active" type="button">Bugün</button>
            <button type="button">Dün</button>
          </div>
        </div>
        <div class="v-stat-grid">
          <div v-for="item in metrics" :key="item.label">
            <AppIcon :name="item.icon" :size="18" />
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>
        <p class="v-home-feed">Mehmet Ali A. az önce Yenişehir ilçesinde bir buzdolabı tamir işi aldı.</p>
      </AppCard>
    </div>
  </AppPage>
</template>
