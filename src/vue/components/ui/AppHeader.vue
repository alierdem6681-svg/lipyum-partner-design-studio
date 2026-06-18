<script setup>
import AppIcon from "./AppIcon.vue";

const emit = defineEmits(["back", "right", "menu", "action"]);
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  showBack: { type: Boolean, default: true },
  variant: { type: String, default: "subpage" },
  rightIcon: { type: String, default: "" },
  rightLabel: { type: String, default: "" },
  rightActions: { type: Array, default: () => [] },
});

const iconForAction = {
  notifications: "bell",
  profile: "user",
  info: "help-circle",
  "wallet-info": "help-circle",
  "notification-settings": "settings",
};

const labelForAction = {
  notifications: "Bildirimler",
  profile: "Profil",
  info: "Bilgi",
};

const homeStatuses = [
  { action: "status", eyebrow: "Durum: Aktif", label: "675 kredi ≈ 2-3 iş" },
  { action: "credit", eyebrow: "Durum: Pasif", label: "Bakiye yok", cta: "Yükle" },
  { action: "workPlan", eyebrow: "Durum: Pasif", label: "Çalışma Saati Dışı" },
  { action: "support", eyebrow: "Durum: Pasif", label: "Hesap askıda", cta: "Destek" },
  { action: "activate-dispatch", eyebrow: "Durum: Pasif", label: "Duraklatılmış", cta: "Aç" },
];

function statusAriaLabel(status) {
  return `${status.eyebrow}${status.label}${status.cta ? ` ${status.cta}` : ""}`;
}
</script>

<template>
  <header class="v-header v-app-header" :data-header-variant="variant" data-testid="app-header">
    <button
      v-if="showBack"
      class="v-header__action"
      type="button"
      data-testid="back-button"
      data-action="go-back"
      aria-label="Geri dön"
      @click="emit('back')"
    >
      <AppIcon name="chevron-left" :size="22" />
    </button>
    <button
      v-else
      class="v-header__action"
      type="button"
      data-testid="hamburger-button"
      data-action="menu"
      aria-label="Menü"
      @click="emit('menu')"
    >
      <AppIcon name="menu" :size="22" />
    </button>

    <div v-if="variant === 'home'" class="v-header-status-viewport" aria-label="Çalışma durumu">
      <div
        v-for="status in homeStatuses"
        :key="status.action"
        class="v-header-status-item"
        role="button"
        tabindex="0"
        :data-action="status.action"
        :aria-label="statusAriaLabel(status)"
        @click="emit('action', status.action)"
        @keydown.enter.prevent="emit('action', status.action)"
        @keydown.space.prevent="emit('action', status.action)"
      >
        <span>{{ status.eyebrow }}</span>
        <strong>{{ status.label }}</strong>
        <em v-if="status.cta">{{ status.cta }}</em>
      </div>
    </div>
    <div v-else class="v-header__copy">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <div class="v-header__actions">
      <button
        v-for="action in (rightIcon ? [rightIcon] : rightActions.length ? rightActions : ['info'])"
        :key="action"
        class="v-header__action"
        type="button"
        :data-testid="action === 'notifications' ? 'notification-button' : action === 'profile' ? 'profile-button' : 'header-right-action'"
        :data-action="action"
        :aria-label="rightLabel || labelForAction[action] || action"
        @click="rightIcon ? emit('right') : emit('action', action)"
      >
        <AppIcon :name="iconForAction[action] || action" :size="22" />
      </button>
    </div>
  </header>
</template>
