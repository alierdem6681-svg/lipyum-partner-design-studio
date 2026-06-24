<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DRAWER_SECTIONS } from "../../utils/constants.js";
import { getRouteMeta } from "../../utils/routeMeta.js";
import DrawerMenuCard from "../components/drawer/DrawerMenuCard.vue";
import DrawerProfileCard from "../components/drawer/DrawerProfileCard.vue";
import AppBottomBar from "../components/ui/AppBottomBar.vue";
import AppDrawer from "../components/ui/AppDrawer.vue";
import AppHeader from "../components/ui/AppHeader.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import AppToast from "../components/ui/AppToast.vue";
import QuickBonusConvertSheet from "../components/wallet/QuickBonusConvertSheet.vue";
import QuickTopUpSheet from "../components/wallet/QuickTopUpSheet.vue";
import MobileLayout from "./MobileLayout.vue";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useNavigationStore } from "../stores/navigationStore.js";
import { useProfileStore } from "../stores/profileStore.js";

const route = useRoute();
const router = useRouter();
const shell = useAppShellStore();
const navigation = useNavigationStore();
const profile = useProfileStore();

const meta = computed(() => getRouteMeta(route.path));
const activeTab = computed(() => meta.value.activeBottomTab || "");
const showBack = computed(() => meta.value.leadingAction === "back");
const rightActions = computed(() => meta.value.trailingActions || []);
const contentRef = ref(null);
const pullDistance = ref(0);
const isPulling = ref(false);
const isRefreshing = ref(false);
const quickBonusOpen = ref(false);
const quickTopUpOpen = ref(false);
let navigationSource = "init";
let pullStartY = 0;
let pullLocked = false;

watch(
  () => route.path,
  (path) => {
    if (navigationSource === "init") navigation.replace(path, "init");
    else if (navigationSource === "app") navigation.push(path, "app");
    else if (navigationSource === "ui-back") navigation.replace(path, "ui-back");
    else if (navigation.stack.includes(path)) navigation.syncFromHistory(path, "history");
    else navigation.push(path, navigationSource);
    navigationSource = "router";
    shell.closeSheet();
    quickBonusOpen.value = false;
    quickTopUpOpen.value = false;
    shell.ctaVariant = meta.value.ctaVariant || "subpage";
    profile.resetBadges();
    isPulling.value = false;
    isRefreshing.value = false;
    pullDistance.value = 0;
  },
  { immediate: true },
);

watch(pullDistance, (value) => {
  contentRef.value?.style.setProperty("--pull-refresh-height", `${value}px`);
});

function navigateTo(target) {
  shell.closeDrawer();
  quickBonusOpen.value = false;
  quickTopUpOpen.value = false;
  navigationSource = "app";
  router.push(target);
}

function openQuickTopUp() {
  shell.closeDrawer();
  shell.closeSheet();
  quickBonusOpen.value = false;
  quickTopUpOpen.value = true;
}

function closeQuickTopUp() {
  quickTopUpOpen.value = false;
}

function openQuickBonusConvert() {
  shell.closeDrawer();
  shell.closeSheet();
  quickTopUpOpen.value = false;
  quickBonusOpen.value = true;
}

function closeQuickBonusConvert() {
  quickBonusOpen.value = false;
}

function completeQuickTopUp(packageInfo) {
  shell.showToast(`${new Intl.NumberFormat("tr-TR").format(packageInfo.credit)} kredi hesabına eklendi.`);
  if (route.path !== "/home") navigateTo("/home");
}

function completeQuickBonusConvert(result) {
  const formatter = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 });
  const message =
    result.mode === "topup"
      ? `${formatter.format(result.totalCredit)} kredi hesabına geçti.`
      : `₺${formatter.format(result.cashAmount)} nakit cüzdana aktarıldı.`;
  shell.showToast(message);
  if (route.path !== "/home") navigateTo("/home");
}

function goBack() {
  const fallback = meta.value.parentRoute || "/home";
  let previous = navigation.pop(fallback);
  if (fallback !== "/home" && previous === "/home") previous = fallback;
  navigationSource = "ui-back";
  router.push(previous);
}

function onHeaderAction(action) {
  if (action === "hamburger") shell.openDrawer();
  if (action === "notifications") navigateTo("/notifications");
  if (action === "profile") navigateTo("/profile");
  if (action === "profile-preview") navigateTo("/partner-card-preview");
  if (action === "partner-share") window.dispatchEvent(new CustomEvent("lipyum:partner-share"));
  if (action === "notification-settings") navigateTo("/notification-settings");
  if (action === "account-transactions") navigateTo("/account-transactions");
  if (action === "wallet-info") {
    shell.openSheet({
      title: "Cüzdan nasıl çalışır?",
      description: "İş bakiyesi ve bonus bakiyesi ayrı takip edilir.",
      body: "İş bakiyesi yüklediğin kullanılabilir bakiyedir. Bonus bakiyesi doğrudan iş alımında veya nakit çekimde kullanılamaz; yalnız bakiye yüklerken indirim sağlar. İptal edilen iş iadeleri bonus olarak görünebilir ve yakın biten bonuslar önce kullanılır.",
      scoreItems: [
        { label: "İş bakiyesi", value: "Kullanılır", description: "İş fırsatı satın almak için kullanılır.", tone: "positive", icon: "wallet" },
        { label: "Bonus bakiyesi", value: "İndirim", description: "Yükleme sırasında kartından çekilecek tutarı düşürür.", tone: "positive", icon: "gift" },
        { label: "Nakit çekim", value: "Yok", description: "Bonus nakde çevrilmez ve tek başına iş aldırmaz.", tone: "neutral", icon: "shield" },
      ],
      note: "Ödeme özetinde cüzdanına eklenecek tutar, kullanılan bonus ve kartından çekilecek tutar ayrı gösterilir.",
    });
  }
  if (action === "info") {
    const infoSheet = meta.value.infoSheet || {};
    shell.openSheet({
      title: infoSheet.title || meta.value.title || "Bilgi",
      description: infoSheet.description || meta.value.subtitle || "Sayfa bilgisi",
      body: infoSheet.body ?? "Bu ekran Lipyum Partner çalışma akışındaki ilgili bilgileri ve aksiyonları gösterir.",
      scoreItems: infoSheet.scoreItems || [],
      note: infoSheet.note || "",
    });
  }
  if (action === "status") {
    shell.openSheet({
      title: "Çalışma durumu",
      description: "Aktif iş alımı",
      body: "Hesabın aktif. Uygun bölgelerde iş almaya devam edebilirsin.",
    });
  }
  if (action === "credit") openQuickTopUp();
  if (action === "workPlan") navigateTo("/working-hours");
  if (action === "support") navigateTo("/support");
  if (action === "activate-dispatch") shell.showToast("İş alımı tekrar aktif hale getirildi.");
}

function handlePopState() {
  navigationSource = "history";
}

function canStartPullRefresh() {
  return !shell.drawerOpen && !shell.activeSheet && !isRefreshing.value && (contentRef.value?.scrollTop || 0) <= 0;
}

function handlePullStart(event) {
  if (!event.touches?.length || !canStartPullRefresh()) {
    pullLocked = false;
    return;
  }
  pullStartY = event.touches[0].clientY;
  pullLocked = true;
}

function handlePullMove(event) {
  if (!pullLocked || !event.touches?.length) return;
  const distance = event.touches[0].clientY - pullStartY;
  if (distance <= 0 || (contentRef.value?.scrollTop || 0) > 0) {
    pullDistance.value = 0;
    isPulling.value = false;
    return;
  }
  event.preventDefault();
  isPulling.value = true;
  pullDistance.value = Math.min(92, Math.round(distance * 0.48));
}

function finishPullRefresh() {
  window.setTimeout(() => {
    isRefreshing.value = false;
    isPulling.value = false;
    pullDistance.value = 0;
  }, 620);
}

function handlePullEnd() {
  if (!pullLocked) return;
  pullLocked = false;
  if (pullDistance.value >= 58) {
    isRefreshing.value = true;
    isPulling.value = false;
    pullDistance.value = 64;
    finishPullRefresh();
    return;
  }
  isPulling.value = false;
  pullDistance.value = 0;
}

onMounted(() => {
  window.addEventListener("popstate", handlePopState);
  window.addEventListener("lipyum:bonus-convert", openQuickBonusConvert);
  window.addEventListener("lipyum:quick-topup", openQuickTopUp);
  window.navigateToPage = navigateTo;
  window.goBack = goBack;
  window.lipyumRouter = { navigateTo, goBack };
});

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
  window.removeEventListener("lipyum:bonus-convert", openQuickBonusConvert);
  window.removeEventListener("lipyum:quick-topup", openQuickTopUp);
  if (window.navigateToPage === navigateTo) delete window.navigateToPage;
  if (window.goBack === goBack) delete window.goBack;
  if (window.lipyumRouter?.navigateTo === navigateTo) delete window.lipyumRouter;
});
</script>

<template>
  <MobileLayout>
    <div class="v-shell">
      <AppHeader
        :title="meta.title"
        :subtitle="meta.subtitle"
        :subtitle-icon="meta.subtitleIcon"
        :variant="meta.headerVariant"
        :show-back="showBack"
        :right-actions="rightActions"
        @back="goBack"
        @menu="shell.openDrawer"
        @action="onHeaderAction"
      />

      <div
        id="appRoot"
        ref="contentRef"
        class="v-shell__content"
        :class="{ 'is-pulling': isPulling, 'is-refreshing': isRefreshing }"
        @touchstart="handlePullStart"
        @touchmove="handlePullMove"
        @touchend="handlePullEnd"
        @touchcancel="handlePullEnd"
      >
        <div
          class="v-pull-refresh"
          :class="{ 'is-visible': pullDistance > 0, 'is-refreshing': isRefreshing }"
          data-testid="pull-refresh-indicator"
          aria-hidden="true"
        >
          <span class="v-pull-refresh__spinner">
            <AppIcon name="refresh" :size="20" />
          </span>
        </div>
        <RouterView />
      </div>

      <AppBottomBar
        v-if="meta.showBottomBar"
        :active-tab="activeTab"
        :cta-variant="meta.ctaVariant"
        :notification-count="shell.notificationCount"
        :show-cta="meta.ctaVariant !== 'hidden'"
        @navigate="navigateTo"
        @cta="navigateTo"
      />

      <AppDrawer
        :open="shell.drawerOpen"
        title="Partner menüsü"
        @close="shell.closeDrawer"
      >
        <DrawerProfileCard />
        <DrawerMenuCard
          v-for="section in DRAWER_SECTIONS"
          :key="section.title"
          :section="section"
          :active-path="route.path"
          @navigate="navigateTo"
        />
      </AppDrawer>

      <AppSheet
        v-if="shell.activeSheet"
        :open="!!shell.activeSheet"
        :title="shell.activeSheet?.title"
        :description="shell.activeSheet?.description"
        @close="shell.closeSheet"
      >
        <div class="v-sheet-content">
          <p v-if="shell.activeSheet?.body" class="v-sheet-copy">{{ shell.activeSheet?.body }}</p>
          <div v-if="shell.activeSheet?.scoreItems?.length" class="v-info-score-list" data-testid="info-score-list">
            <article
              v-for="item in shell.activeSheet.scoreItems"
              :key="item.label"
              :class="['v-info-score-item', `is-${item.tone || 'neutral'}`, { 'has-icon': item.icon }]"
              data-testid="info-score-item"
            >
              <span v-if="item.icon" class="v-info-score-item__icon" aria-hidden="true">
                <AppIcon :name="item.icon" :size="18" />
              </span>
              <span class="v-info-score-item__copy">
                <strong>{{ item.label }}</strong>
                <small>{{ item.description }}</small>
              </span>
              <span class="v-info-score-item__value">{{ item.value }}</span>
            </article>
          </div>
          <p v-if="shell.activeSheet?.note" class="v-info-sheet-note">{{ shell.activeSheet.note }}</p>
        </div>
      </AppSheet>

      <QuickBonusConvertSheet
        :open="quickBonusOpen"
        @close="closeQuickBonusConvert"
        @complete="completeQuickBonusConvert"
      />

      <QuickTopUpSheet
        :open="quickTopUpOpen"
        @close="closeQuickTopUp"
        @complete="completeQuickTopUp"
      />

      <AppToast :message="shell.toast" />
    </div>
  </MobileLayout>
</template>
