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

const testIdForAction = {
  notifications: "notification-button",
  profile: "profile-button",
  info: "header-info-button",
  "wallet-info": "wallet-info-button",
  "notification-settings": "notification-settings-button",
};

const homeStatuses = [
  { action: "status", icon: "check", eyebrow: "Durum: Aktif", label: "675 kredi ≈ 2-3 iş", color: "#067647", bg: "#ecfdf3", border: "#abefc6" },
  { action: "credit", icon: "wallet", eyebrow: "Durum: Pasif", label: "Bakiye yok", cta: "Yükle", color: "#92400e", bg: "#fffaeb", border: "#fedf89" },
  { action: "workPlan", icon: "clock", eyebrow: "Durum: Pasif", label: "Çalışma Saati Dışı", color: "#175cd3", bg: "#eff4ff", border: "#b2ccff" },
  { action: "support", icon: "shield", eyebrow: "Durum: Pasif", label: "Hesap askıda", cta: "Destek", color: "#b42318", bg: "#fef3f2", border: "#fecdca" },
  { action: "activate-dispatch", icon: "clock", eyebrow: "Durum: Pasif", label: "Duraklatılmış", cta: "Aç", color: "#475467", bg: "#f2f4f7", border: "#d0d5dd" },
];

function statusAriaLabel(status) {
  return `${status.eyebrow}${status.label}${status.cta ? ` ${status.cta}` : ""}`;
}
</script>

<template>
  <header class="v-header v-app-header top-nav" :data-header-variant="variant" data-testid="app-header">
    <button
      v-if="showBack"
      class="v-header__action icon-btn"
      type="button"
      data-testid="back-button"
      data-action="go-back"
      aria-label="Geri dön"
      @click="emit('back')"
    >
      <AppIcon name="chevron-left" :size="24" class-name="icon" />
    </button>
    <button
      v-else
      class="v-header__action icon-btn"
      type="button"
      data-testid="hamburger-button"
      data-action="menu"
      aria-label="Menü"
      @click="emit('menu')"
    >
      <AppIcon name="menu" :size="24" class-name="icon" />
    </button>

    <div
      v-if="variant === 'home'"
      class="v-header-status-viewport nav-alert-ticker nav-status-pill"
      role="status"
      aria-live="polite"
      aria-label="İş alımı durumları"
    >
      <span class="nav-alert-track">
        <button
          v-for="status in homeStatuses"
          :key="status.action"
          class="nav-alert-item"
          :class="status.cta ? 'has-action' : ''"
          type="button"
          :data-action="status.action"
          :aria-label="statusAriaLabel(status)"
          :style="{ '--nav-alert-color': status.color, '--nav-alert-bg': status.bg, '--nav-alert-border': status.border }"
          @click="emit('action', status.action)"
        >
          <span class="nav-alert-mark" aria-hidden="true">
            <AppIcon :name="status.icon" :size="18" class-name="icon" />
          </span>
          <span class="nav-status-copy">
            <strong>{{ status.eyebrow }}</strong>
            <small>{{ status.label }}</small>
          </span>
          <em v-if="status.cta">{{ status.cta }}</em>
        </button>
      </span>
    </div>
    <div v-else class="v-header__copy">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <div class="v-header__actions">
      <button
        v-for="action in (rightIcon ? [rightIcon] : rightActions.length ? rightActions : ['info'])"
        :key="action"
        class="v-header__action icon-btn"
        type="button"
        :data-testid="testIdForAction[action] || 'header-right-action'"
        :data-action="action"
        :aria-label="rightLabel || labelForAction[action] || action"
        @click="rightIcon ? emit('right') : emit('action', action)"
      >
        <AppIcon :name="iconForAction[action] || action" :size="24" class-name="icon" />
        <span v-if="action === 'notifications'" class="v-header__notify-dot" aria-hidden="true"></span>
      </button>
    </div>
  </header>
</template>
