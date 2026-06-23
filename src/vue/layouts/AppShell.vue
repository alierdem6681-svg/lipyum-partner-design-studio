<script setup>
import { computed, onMounted, onUnmounted, watch } from "vue";
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
let navigationSource = "init";

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
    shell.ctaVariant = meta.value.ctaVariant || "subpage";
    profile.resetBadges();
  },
  { immediate: true },
);

function navigateTo(target) {
  shell.closeDrawer();
  navigationSource = "app";
  router.push(target);
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
  if (action === "wallet-info") {
    shell.openSheet({
      title: "Cüzdan",
      description: "Kredi ve bakiye bilgisi",
      body: "Kredilerini iş almak, teklif vermek ve öne çıkmak için kullanırsın.",
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
  if (action === "credit") navigateTo("/wallet");
  if (action === "workPlan") navigateTo("/working-hours");
  if (action === "support") navigateTo("/support");
  if (action === "activate-dispatch") shell.showToast("İş alımı tekrar aktif hale getirildi.");
}

function handlePopState() {
  navigationSource = "history";
}

onMounted(() => {
  window.addEventListener("popstate", handlePopState);
  window.navigateToPage = navigateTo;
  window.goBack = goBack;
  window.lipyumRouter = { navigateTo, goBack };
});

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
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
        :variant="meta.headerVariant"
        :show-back="showBack"
        :right-actions="rightActions"
        @back="goBack"
        @menu="shell.openDrawer"
        @action="onHeaderAction"
      />

      <div id="appRoot" class="v-shell__content">
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
        @upgrade="navigateTo('/subscription')"
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

      <AppToast :message="shell.toast" />
    </div>
  </MobileLayout>
</template>
