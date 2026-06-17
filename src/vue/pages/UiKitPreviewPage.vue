<script setup>
import { ref } from "vue";
import LeaderboardMiniCard from "../components/feature/LeaderboardMiniCard.vue";
import ReviewMiniCard from "../components/feature/ReviewMiniCard.vue";
import WalletMiniCard from "../components/feature/WalletMiniCard.vue";
import AppBadge from "../components/ui/AppBadge.vue";
import AppBottomBar from "../components/ui/AppBottomBar.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppEmptyState from "../components/ui/AppEmptyState.vue";
import AppHeader from "../components/ui/AppHeader.vue";
import AppListItem from "../components/ui/AppListItem.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSectionTitle from "../components/ui/AppSectionTitle.vue";
import AppSegmentedControl from "../components/ui/AppSegmentedControl.vue";
import AppSelect from "../components/ui/AppSelect.vue";
import { useNavigation } from "../composables/useNavigation.js";

const props = defineProps({
  navigateTo: { type: Function, default: undefined },
});

const segment = ref("active");
const { navigateTo, goBack } = useNavigation(props.navigateTo);

const listItems = [
  ["Müşteri Yorumları", "Yanıt bekleyen yorumları kontrol et", "message", "/reviews"],
  ["Cüzdan", "Kredi ve bonus hareketlerini izle", "wallet", "/wallet"],
  ["Liderlik Tablosu", "Sıralamanı ve lig puanını gör", "trophy", "/leaderboard"],
];
</script>

<template>
  <AppPage title="Vue UI Kit">
    <div class="v-stack v-ui-kit-preview">
      <AppHeader
        title="Vue UI Kit"
        subtitle="Yeni mobil component standardı"
        right-icon="settings"
        right-label="UI Kit ayarları"
        @back="goBack"
      />

      <AppCard padding="lg" variant="hero" class="v-feature-card">
        <div class="v-feature-card__top">
          <div>
            <h3>V5 foundation hazır</h3>
            <p>Vanilla uygulamayı bozmadan Vue component katmanı çalışıyor.</p>
          </div>
          <AppBadge tone="success">Pilot</AppBadge>
        </div>
        <AppButton full-width icon="briefcase" @click="navigateTo('/vue-job-referral')">
          Vue İş Yönlendirme Pilotunu Aç
        </AppButton>
      </AppCard>

      <AppSectionTitle title="Temel Componentler" action-label="Canlı rota" @action="navigateTo('/home')" />

      <div class="v-ui-kit-preview__grid">
        <WalletMiniCard />
        <WalletMiniCard title="Bonus" amount="240" unit="bonus" icon="gift" />
        <ReviewMiniCard />
        <LeaderboardMiniCard />
      </div>

      <AppCard padding="sm">
        <AppListItem
          v-for="[title, subtitle, icon, route] in listItems"
          :key="route"
          :title="title"
          :subtitle="subtitle"
          :icon="icon"
          @click="navigateTo(route)"
        />
      </AppCard>

      <div class="v-ui-kit-preview__grid">
        <AppSelect label="Sektör Ligi" />
        <AppSelect label="Şehir Ligi" />
      </div>

      <AppSegmentedControl
        v-model="segment"
        :options="[
          { label: 'Aktif', value: 'active' },
          { label: 'Bekleyen', value: 'pending' },
          { label: 'Pasif', value: 'passive' }
        ]"
      />

      <div class="v-ui-kit-preview__grid">
        <AppChip tone="success" icon="check">Aktif</AppChip>
        <AppChip tone="warning">Uyarı</AppChip>
        <AppChip tone="info">Bilgi</AppChip>
        <AppChip tone="danger">Risk</AppChip>
      </div>

      <AppEmptyState
        icon="message"
        title="Boş durum örneği"
        description="Bu component route, liste ve destek ekranlarında kullanılabilir."
      />

      <AppBottomBar
        active-tab="work"
        cta-variant="subpage"
        notification-count="3"
        @navigate="navigateTo"
        @cta="navigateTo"
      />
    </div>
  </AppPage>
</template>
