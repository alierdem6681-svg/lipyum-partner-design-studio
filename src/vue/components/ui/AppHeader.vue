<script setup>
import AppIcon from "./AppIcon.vue";

const emit = defineEmits(["back", "right", "menu", "action"]);
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  subtitleIcon: { type: String, default: "" },
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
  "profile-preview": "eye",
  "wallet-info": "help-circle",
  "account-transactions": "receipt",
  "notification-settings": "settings",
  "partner-share": "share",
  "end-live-chat": "x",
};

const labelForAction = {
  notifications: "Bildirimler",
  profile: "Profil",
  info: "Sayfa bilgisi",
  "profile-preview": "Önizle",
  "wallet-info": "Cüzdan bilgisi",
  "account-transactions": "Hesap hareketleri",
  "notification-settings": "Bildirim ayarları",
  "partner-share": "Partner kartını paylaş",
  "end-live-chat": "Konuşmayı bitir",
};

const testIdForAction = {
  notifications: "notification-button",
  profile: "profile-button",
  info: "header-info-button",
  "profile-preview": "profile-preview-header-button",
  "wallet-info": "wallet-info-button",
  "account-transactions": "account-transactions-header-button",
  "notification-settings": "notification-settings-button",
  "partner-share": "partner-preview-header-share",
  "end-live-chat": "live-support-end-header",
};

const homeStatuses = [
  { action: "status", icon: "check", eyebrow: "Durum: Aktif", label: "675 kredi ≈ 2-3 iş", tone: "success" },
  { action: "credit", icon: "wallet", eyebrow: "Durum: Pasif", label: "Bakiye yok", cta: "Yükle", tone: "warning" },
  { action: "workPlan", icon: "clock", eyebrow: "Durum: Pasif", label: "Çalışma Saati Dışı", tone: "info" },
  { action: "support", icon: "shield", eyebrow: "Durum: Pasif", label: "Hesap askıda", cta: "Destek", tone: "danger" },
  { action: "activate-dispatch", icon: "pause", eyebrow: "Durum: Pasif", label: "Duraklatılmış", cta: "Aç", tone: "neutral" },
];

function statusAriaLabel(status) {
  return `${status.eyebrow}${status.label}${status.cta ? ` ${status.cta}` : ""}`;
}
</script>

<template>
  <header
    class="v-header v-app-header top-nav app-header"
    :class="[
      `${variant || 'subpage'}-header`,
      rightActions.includes('profile-preview') || rightActions.includes('partner-share') || rightActions.includes('end-live-chat') ? 'has-text-action' : '',
    ]"
    :data-header-variant="variant"
    data-testid="app-header"
  >
    <button
      v-if="showBack"
      class="v-header__action icon-btn page-header-action"
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
      class="v-header__action icon-btn page-header-action"
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
        <div
          v-for="status in homeStatuses"
          :key="status.action"
          class="nav-alert-item"
          :class="[status.cta ? 'has-action' : '', status.eyebrow.includes('Pasif') ? 'is-inactive' : '', `nav-alert-item--${status.tone}`]"
          role="button"
          tabindex="0"
          :data-action="status.action"
          :aria-label="statusAriaLabel(status)"
          @click="emit('action', status.action)"
          @keydown.enter.prevent="emit('action', status.action)"
          @keydown.space.prevent="emit('action', status.action)"
        >
          <span class="nav-alert-mark" aria-hidden="true">
            <AppIcon :name="status.icon" :size="18" class-name="icon" />
          </span>
          <span class="nav-alert-copy">
            <strong>{{ status.eyebrow }}</strong>
            <small>{{ status.label }}</small>
          </span>
          <span v-if="status.cta" class="nav-alert-action" aria-hidden="true">{{ status.cta }}</span>
        </div>
      </span>
    </div>
    <div v-else class="v-header__copy page-header-copy">
      <h1>{{ title }}</h1>
      <p v-if="subtitle" :class="{ 'has-subtitle-icon': subtitleIcon }">
        <AppIcon v-if="subtitleIcon" :name="subtitleIcon" :size="13" class-name="v-header__subtitle-icon" />
        <span>{{ subtitle }}</span>
      </p>
    </div>

    <div class="v-header__actions header-actions">
      <button
        v-for="action in (rightIcon ? [rightIcon] : rightActions)"
        :key="action"
        class="v-header__action icon-btn page-header-action"
        :class="[
          action === 'profile-preview' || action === 'partner-share' ? 'is-text-action' : '',
          action === 'end-live-chat' ? 'is-text-action is-danger-action' : '',
          action === 'partner-share' ? 'is-partner-share-action' : '',
        ]"
        type="button"
        :data-testid="testIdForAction[action] || 'header-right-action'"
        :data-action="action"
        :aria-label="rightLabel || labelForAction[action] || action"
        @click="rightIcon ? emit('right') : emit('action', action)"
      >
        <AppIcon :name="iconForAction[action] || action" :size="24" class-name="icon" />
        <span v-if="action === 'profile-preview'" class="v-header__action-label">Önizle</span>
        <span v-if="action === 'partner-share'" class="v-header__action-label">Paylaş</span>
        <span v-if="action === 'end-live-chat'" class="v-header__action-label">Bitir</span>
        <span v-if="action === 'notifications'" class="v-header__notify-dot" aria-hidden="true"></span>
      </button>
    </div>
  </header>
</template>
