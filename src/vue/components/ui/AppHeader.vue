<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";

const emit = defineEmits(["back", "menu", "action"]);
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  variant: { type: String, default: "subpage" },
  leadingAction: { type: String, default: "back" },
  trailingActions: { type: Array, default: () => ["info"] },
  notificationCount: { type: [Number, String], default: 0 },
});

const headerClass = computed(() => [
  "app-header",
  props.variant === "home" ? "home-header" : props.variant === "section" ? "section-header" : "subpage-header",
]);

const actionIcons = {
  info: { icon: "settings", label: "Sayfa bilgisi", testId: "header-info-button" },
  notifications: { icon: "bell", label: "Bildirimler", testId: "notification-button" },
  profile: { icon: "user", label: "Profil", testId: "profile-button" },
  "notification-settings": { icon: "settings", label: "Bildirim ayarları", testId: "notification-settings-button" },
  "wallet-info": { icon: "settings", label: "Cüzdan bilgisi", testId: "wallet-info-button" },
};

function onLeadingClick() {
  if (props.leadingAction === "hamburger") emit("menu");
  else emit("back");
}
</script>

<template>
  <header :class="headerClass" data-testid="app-header" :data-header-variant="variant">
    <button
      class="icon-btn icon-only-btn"
      type="button"
      :data-testid="leadingAction === 'hamburger' ? 'hamburger-button' : 'back-button'"
      :data-action="leadingAction === 'hamburger' ? undefined : 'go-back'"
      :aria-label="leadingAction === 'hamburger' ? 'Menü' : 'Geri dön'"
      @click="onLeadingClick"
    >
      <AppIcon :name="leadingAction === 'hamburger' ? 'menu' : 'chevron-left'" :size="22" />
    </button>

    <div class="app-title">
      <h2>{{ title }}</h2>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <div class="header-actions" :class="{ 'header-actions--reserved': !trailingActions.length }">
      <button
        v-for="action in trailingActions"
        :key="action"
        class="icon-btn icon-only-btn"
        type="button"
        :data-testid="(actionIcons[action] || actionIcons.info).testId"
        :aria-label="(actionIcons[action] || actionIcons.info).label"
        @click="emit('action', action)"
      >
        <AppIcon :name="(actionIcons[action] || actionIcons.info).icon" :size="22" />
        <span v-if="action === 'notifications' && notificationCount" class="header-notify-dot" aria-hidden="true" />
      </button>
    </div>
  </header>
</template>
