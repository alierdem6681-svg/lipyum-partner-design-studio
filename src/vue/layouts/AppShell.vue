<script setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DRAWER_SECTIONS } from "../../utils/constants.js";
import { getRouteMeta } from "../../utils/routeMeta.js";
import AppBottomBar from "../components/ui/AppBottomBar.vue";
import AppDrawer from "../components/ui/AppDrawer.vue";
import AppHeader from "../components/ui/AppHeader.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import MobileLayout from "./MobileLayout.vue";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useNavigationStore } from "../stores/navigationStore.js";

const route = useRoute();
const router = useRouter();
const shell = useAppShellStore();
const navigation = useNavigationStore();

const meta = computed(() => getRouteMeta(route.path));
const activeTab = computed(() => meta.value.activeBottomTab || "");
const showBack = computed(() => meta.value.leadingAction === "back");
const rightActions = computed(() => meta.value.trailingActions || []);

watch(
  () => route.path,
  (path) => {
    navigation.push(path, "router");
    shell.ctaVariant = meta.value.ctaVariant || "subpage";
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

      <AppDrawer :open="shell.drawerOpen" title="Lipyum Partner" @close="shell.closeDrawer">
        <div class="v-drawer-menu">
          <section v-for="section in DRAWER_SECTIONS" :key="section.title" class="v-drawer-menu__section">
            <h3>{{ section.title }}</h3>
            <button
              v-for="item in section.items"
              :key="item.route"
              class="v-drawer-menu__item"
              type="button"
              :aria-current="route.path === item.route ? 'page' : undefined"
              @click="navigateTo(item.route)"
            >
              <span class="v-drawer-menu__icon"><AppIcon :name="item.icon" :size="20" /></span>
              <span>{{ item.label }}</span>
              <AppIcon name="chevron-right" :size="18" />
            </button>
          </section>
        </div>
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
    </div>
  </MobileLayout>
</template>
