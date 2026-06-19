<script setup>
import { onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShell.js";
import { useHomeStore } from "../stores/home.js";

const router = useRouter();
const appShell = useAppShellStore();
const home = useHomeStore();
let ticker = 0;

onMounted(() => {
  window.clearInterval(ticker);
  ticker = window.setInterval(() => home.nextActivity(), 4200);
});

onBeforeUnmount(() => {
  window.clearInterval(ticker);
});
</script>

<template>
  <AppPage title="Ana Sayfa">
    <div class="v-stack">
      <AppCard padding="md" variant="hero" data-testid="home-status-card">
        <div class="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-3">
          <span class="min-w-0">
            <strong class="block truncate text-section-title font-extrabold text-slate-950">Hazırsın</strong>
            <small class="mt-1 block text-small font-bold leading-normal text-slate-600">Yeni iş, teklif veya havuz fırsatı olduğunda bildirim alırsın.</small>
          </span>
          <span class="grid h-11 w-11 place-items-center rounded-pill bg-emerald-50 text-emerald-700">
            <AppIcon name="sparkles" :size="23" />
          </span>
        </div>
      </AppCard>

      <AppCard padding="md" variant="elevated" data-testid="home-performance-card">
        <div class="mb-3 flex items-start justify-between gap-3">
          <h2 class="m-0 truncate text-section-title font-extrabold text-slate-950">Performans Skoru</h2>
          <button class="h-10 shrink-0 rounded-xl border border-slate-200 bg-white px-3 text-caption font-extrabold text-slate-700" type="button">Nedir?</button>
        </div>
        <div class="grid grid-cols-[78px_minmax(0,1fr)] items-center gap-4">
          <div class="grid h-[72px] w-[72px] place-items-center rounded-pill border-[8px] border-emerald-500 bg-white text-center">
            <strong class="text-metric-md font-extrabold leading-none text-slate-950">{{ home.performance.score }}</strong>
          </div>
          <div class="min-w-0">
            <AppChip tone="success" icon="star">{{ home.performance.level }}</AppChip>
            <p class="mt-2 truncate rounded-xl bg-slate-50 px-3 py-2 text-caption font-bold text-slate-700">{{ home.performance.nextTarget }} puana ulaşmana çok az kaldı.</p>
            <div class="mt-2 grid grid-cols-[minmax(0,1fr)_34px] items-center gap-2">
              <span class="h-2 overflow-hidden rounded-pill bg-slate-200"><i class="block h-full rounded-pill bg-emerald-500" :style="{ width: `${home.performance.progress}%` }"></i></span>
              <strong class="text-right text-caption font-extrabold text-slate-700">100</strong>
            </div>
          </div>
        </div>
        <AppButton class="mt-3" full-width icon="trend-up" data-screen="performanceScore" data-testid="home-score-boost-button">Skorumu Artır</AppButton>
      </AppCard>

      <section class="grid grid-cols-2 gap-3" aria-label="Cüzdan ve bonus">
        <AppCard padding="md" data-testid="home-wallet-card">
          <span class="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><AppIcon name="wallet" /></span>
          <strong class="block truncate text-metric-md font-extrabold text-slate-950">{{ home.wallet.credit }} <small class="text-body font-bold text-slate-500">kredi</small></strong>
          <small class="mt-1 block truncate text-caption font-bold text-slate-500">≈ {{ home.wallet.estimatedJobs }} iş alabilirsin</small>
          <AppButton class="mt-3" full-width size="sm" icon="plus" @click="router.push('/wallet')">Bakiye Yükle</AppButton>
        </AppCard>
        <AppCard padding="md" data-testid="home-bonus-card">
          <span class="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><AppIcon name="gift" /></span>
          <strong class="block truncate text-metric-md font-extrabold text-slate-950">{{ home.wallet.bonus }} <small class="text-body font-bold text-slate-500">bonus</small></strong>
          <small class="mt-1 block truncate text-caption font-bold text-slate-500">Kredi yüklerken kullanılır.</small>
          <AppButton class="mt-3" full-width size="sm" variant="ghost" icon="refresh" @click="appShell.openSheet('bonus-convert')">Krediye Çevir</AppButton>
        </AppCard>
      </section>

      <AppCard padding="sm" data-testid="home-region-card">
        <div class="grid grid-cols-3 divide-x divide-slate-100 overflow-hidden rounded-card border border-slate-200 bg-white">
          <article class="p-3">
            <small class="block truncate text-caption font-bold text-slate-500">Partnerler</small>
            <strong class="block truncate text-card-title font-extrabold text-slate-950">34</strong>
          </article>
          <article class="p-3">
            <small class="block truncate text-caption font-bold text-slate-500">Tamamlanan</small>
            <strong class="block truncate text-card-title font-extrabold text-slate-950">18</strong>
          </article>
          <article class="p-3">
            <small class="block truncate text-caption font-bold text-slate-500">Teklifler</small>
            <strong class="block truncate text-card-title font-extrabold text-slate-950">128</strong>
          </article>
        </div>
        <p class="mt-3 truncate text-caption font-bold text-slate-600"><span class="mr-1 inline-block h-2 w-2 rounded-pill bg-emerald-500"></span>{{ home.activeActivity }}</p>
      </AppCard>

      <AppCard padding="md">
        <div class="flex items-center justify-between gap-3">
          <span class="min-w-0">
            <strong class="block truncate text-card-title font-extrabold text-slate-950">Paketlerle daha fazla görünürlük</strong>
            <small class="block truncate text-caption font-bold text-slate-500">Plus avantajlarını keşfet.</small>
          </span>
          <AppButton size="sm" @click="router.push('/packages')">Paketler</AppButton>
        </div>
      </AppCard>
    </div>
  </AppPage>
</template>
