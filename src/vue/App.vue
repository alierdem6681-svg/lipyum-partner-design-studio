<script setup>
import { computed, onMounted } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { DRAWER_SECTIONS } from "../utils/constants.js";
import { getRouteMeta } from "../utils/routeMeta.js";
import { useAppShellStore } from "./stores/appShell.js";
import { useCalendarStore } from "./stores/calendar.js";
import { useJobsStore } from "./stores/jobs.js";
import AppBottomBar from "./components/ui/AppBottomBar.vue";
import AppButton from "./components/ui/AppButton.vue";
import AppDrawer from "./components/ui/AppDrawer.vue";
import AppHeader from "./components/ui/AppHeader.vue";
import AppModal from "./components/ui/AppModal.vue";
import AppSheet from "./components/ui/AppSheet.vue";
import AppToast from "./components/ui/AppToast.vue";

const route = useRoute();
const router = useRouter();
const appShell = useAppShellStore();
const jobsStore = useJobsStore();
const calendarStore = useCalendarStore();

const routeMeta = computed(() => getRouteMeta(route.path || "/home"));
const headerTitle = computed(() => (routeMeta.value.headerVariant === "home" ? "Durum: Aktif" : routeMeta.value.title));
const headerSubtitle = computed(() => (routeMeta.value.headerVariant === "home" ? "675 kredi ≈ 2-3 iş" : routeMeta.value.subtitle));
const activeTab = computed(() => routeMeta.value.activeBottomTab || (route.path === "/jobs" ? "work" : ""));
const showBottomBar = computed(() => routeMeta.value.showBottomBar !== false);
const showCta = computed(() => routeMeta.value.ctaVariant !== "hidden");
const screenClass = computed(() => ({ "is-fullscreen-route": route.path === "/partner-card-preview" }));

function navigateTo(routePath, options = {}) {
  if (!routePath) return Promise.resolve();
  return options.replace ? router.replace(routePath) : router.push(routePath);
}

function goBack() {
  if (appShell.activeSheet) {
    appShell.closeSheet();
    return;
  }
  if (appShell.activeModal) {
    appShell.closeModal();
    return;
  }
  if (appShell.drawerOpen) {
    appShell.closeDrawer();
    return;
  }
  if (window.history.state?.back) {
    router.back();
    return;
  }
  router.replace(routeMeta.value.parentRoute || "/home");
}

function handleHeaderAction(action) {
  if (action === "notifications") {
    navigateTo("/notifications");
    return;
  }
  if (action === "profile") {
    navigateTo("/profile");
    return;
  }
  if (action === "notification-settings") {
    appShell.openModal("notification-actions");
    return;
  }
  if (action === "wallet-info") {
    appShell.openSheet("wallet-info");
    return;
  }
  appShell.showToast("Sayfa bilgisi hazır");
}

function closeSheet() {
  jobsStore.clearSelectedJob();
  calendarStore.clearSelectedAppointment();
  appShell.closeSheet();
}

function delegatedShellClick(event) {
  const target = event.target.closest("[data-route], [data-screen], [data-action], [data-open]");
  if (!target) return;
  if (target.dataset.route) {
    event.preventDefault();
    navigateTo(target.dataset.route);
    return;
  }
  if (target.dataset.action === "go-back") {
    event.preventDefault();
    goBack();
    return;
  }
  if (target.dataset.screen === "performanceScore") {
    event.preventDefault();
    navigateTo("/performance-score");
    return;
  }
  if (target.dataset.open) {
    event.preventDefault();
    appShell.openSheet(target.dataset.open === "credit" ? "credit-topup" : target.dataset.open);
  }
}

onMounted(() => {
  window.navigateToPage = (routePath, options) => navigateTo(routePath, options);
  window.goBack = goBack;
  window.lipyumRouter = {
    getCurrentRoute: () => route.path || "/home",
    goBack,
    navigateTo,
    renderRoute: navigateTo,
  };
});
</script>

<template>
  <div class="studio">
    <main class="phone-stage" aria-label="Lipyum Partner mobil arayüzü">
      <section class="phone">
        <div class="phone-screen" :class="screenClass">
          <div class="dynamic-island-demo camera-only" aria-hidden="true"></div>
          <div class="status-bar" aria-hidden="true">
            <span>09:41</span>
            <span class="status-icons">
              <span class="signal"><span></span><span></span><span></span><span></span></span>
              <span>5G</span>
              <span class="battery"><span></span></span>
            </span>
          </div>

          <div class="app">
            <div
              id="appRoot"
              class="app-scroll"
              data-layout="page"
              :data-screen="routeMeta.screen"
              @click="delegatedShellClick"
            >
              <AppHeader
                :title="headerTitle"
                :subtitle="headerSubtitle"
                :variant="routeMeta.headerVariant"
                :leading-action="routeMeta.leadingAction"
                :trailing-actions="routeMeta.trailingActions"
                :notification-count="appShell.notificationCount"
                @menu="appShell.openDrawer()"
                @back="goBack"
                @action="handleHeaderAction"
              />
              <RouterView />
            </div>

            <AppBottomBar
              v-if="showBottomBar"
              :active-tab="activeTab"
              :cta-variant="routeMeta.ctaVariant"
              :notification-count="appShell.notificationCount"
              :show-cta="showCta"
              @navigate="navigateTo"
              @cta="navigateTo"
            />
          </div>
        </div>
      </section>
    </main>

    <AppDrawer
      :open="appShell.drawerOpen"
      title="Lipyum Partner"
      :sections="DRAWER_SECTIONS"
      @close="appShell.closeDrawer()"
      @navigate="(target) => { appShell.closeDrawer(); navigateTo(target); }"
    />

    <AppSheet
      :open="Boolean(appShell.activeSheet)"
      :title="appShell.activeSheet === 'bonus-convert' ? 'Krediye Çevir' : appShell.activeSheet === 'credit-topup' ? 'Bakiye Yükle' : appShell.activeSheet === 'wallet-info' ? 'Cüzdan Bilgisi' : appShell.activeSheet === 'job-detail' ? 'İş Detayı' : appShell.activeSheet === 'appointment-detail' ? 'Randevu Detayı' : appShell.activeSheet === 'partner-share' ? 'Partner Kartını Paylaş' : appShell.activeSheet === 'review-reply' ? 'Yorumu Yanıtla' : 'Detay'"
      :description="appShell.activeSheet === 'bonus-convert' ? 'Bonuslarını kredi yüklerken kullanabilirsin.' : appShell.activeSheet === 'credit-topup' ? 'Mock bakiye yükleme akışı.' : ''"
      @close="closeSheet"
    >
      <div v-if="appShell.activeSheet === 'bonus-convert'" class="grid gap-3">
        <p class="m-0 text-small font-semibold text-slate-600">240 bonusun var. Bu prototipte dönüşüm işlemi başarı bildirimiyle simüle edilir.</p>
        <AppButton full-width icon="refresh" @click="appShell.showToast('Bonus krediye çevrildi'); closeSheet()">Krediye Çevir</AppButton>
      </div>
      <div v-else-if="appShell.activeSheet === 'credit-topup'" class="grid gap-3">
        <p class="m-0 text-small font-semibold text-slate-600">Bakiye yükleme akışı şu an mock olarak çalışıyor.</p>
        <AppButton full-width icon="plus" @click="appShell.showToast('Bakiye yükleme başlatıldı'); closeSheet()">Bakiye Yükle</AppButton>
      </div>
      <div v-else-if="appShell.activeSheet === 'wallet-info'" class="grid gap-2 text-small font-semibold text-slate-600">
        <p>Krediler iş almak için, bonuslar ise kredi yükleme sırasında kullanılır.</p>
      </div>
      <div v-else-if="appShell.activeSheet === 'job-detail' && jobsStore.selectedJob" class="grid gap-3">
        <strong class="text-card-title text-slate-950">{{ jobsStore.selectedJob.title }}</strong>
        <span class="text-small font-semibold text-slate-500">{{ jobsStore.selectedJob.area }} · {{ jobsStore.selectedJob.status }}</span>
        <AppButton full-width icon="phone" @click="appShell.showToast('Mock iş aksiyonu alındı'); closeSheet()">{{ jobsStore.selectedJob.primary }}</AppButton>
      </div>
      <div v-else-if="appShell.activeSheet === 'appointment-detail' && calendarStore.selectedAppointment" class="grid gap-3">
        <strong class="text-card-title text-slate-950">{{ calendarStore.selectedAppointment.title }}</strong>
        <span class="text-small font-semibold text-slate-500">{{ calendarStore.selectedAppointment.time }} · {{ calendarStore.selectedAppointment.customer }}</span>
        <AppButton full-width icon="calendar" @click="appShell.showToast('Randevu notu açıldı'); closeSheet()">Randevuyu Aç</AppButton>
      </div>
      <div v-else-if="appShell.activeSheet === 'partner-share'" class="grid gap-2">
        <button class="partner-share-option" type="button" data-testid="partner-share-whatsapp">WhatsApp ile paylaş</button>
        <button class="partner-share-option" type="button" data-testid="partner-share-website">Web sitesine ekle</button>
        <button class="partner-share-option" type="button" data-testid="partner-share-social-post">Sosyal medya postu</button>
        <button class="partner-share-option" type="button" data-testid="partner-share-story">Hikaye görseli</button>
      </div>
      <div v-else-if="appShell.activeSheet === 'review-reply'" class="grid gap-3">
        <textarea class="min-h-24 rounded-card border border-slate-200 p-3 text-small font-semibold" rows="4">Geri bildiriminiz için teşekkür ederiz.</textarea>
        <AppButton full-width icon="send" @click="appShell.showToast('Yanıt kaydedildi'); closeSheet()">Yanıtı Kaydet</AppButton>
      </div>
    </AppSheet>

    <AppModal
      :open="Boolean(appShell.activeModal)"
      title="Bildirim Seçenekleri"
      description="Liste işlemlerini buradan yönet."
      @close="appShell.closeModal()"
    >
      <div class="grid gap-2">
        <button class="v-list-item" type="button" @click="appShell.showToast('Bildirimler okundu'); appShell.closeModal()">Tümünü Okundu İşaretle</button>
        <button class="v-list-item" type="button" @click="navigateTo('/notification-settings'); appShell.closeModal()">Bildirim Ayarları</button>
      </div>
    </AppModal>

    <AppToast :message="appShell.toast?.message || ''" :tone="appShell.toast?.tone || 'success'" />
  </div>
</template>
