<script setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DRAWER_SECTIONS } from "../../utils/constants.js";
import { getRouteMeta } from "../../utils/routeMeta.js";
import DrawerMenuCard from "../components/drawer/DrawerMenuCard.vue";
import DrawerProfileCard from "../components/drawer/DrawerProfileCard.vue";
import AppBottomBar from "../components/ui/AppBottomBar.vue";
import AppDrawer from "../components/ui/AppDrawer.vue";
import AppHeader from "../components/ui/AppHeader.vue";
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

watch(
  () => route.path,
  (path) => {
    navigation.push(path, "router");
    shell.ctaVariant = meta.value.ctaVariant || "subpage";
    profile.resetBadges();
  },
  { immediate: true },
);

function navigateTo(target) {
  shell.closeDrawer();
  router.push(target);
}

function goBack() {
  const previous = navigation.pop(meta.value.parentRoute || "/home");
  router.push(previous);
}

function onHeaderAction(action) {
  if (action === "hamburger") shell.openDrawer();
  if (action === "notifications") navigateTo("/notifications");
  if (action === "profile") navigateTo("/profile");
}
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
        <p class="v-sheet-copy">{{ shell.activeSheet?.body }}</p>
      </AppSheet>

      <AppToast :message="shell.toast" />
    </div>
  </MobileLayout>
</template>
