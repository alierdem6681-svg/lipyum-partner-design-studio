<script setup>
import AppIcon from "./AppIcon.vue";

const emit = defineEmits(["back", "right", "menu", "action"]);
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  headerProfile: { type: Object, default: null },
  showBack: { type: Boolean, default: true },
  variant: { type: String, default: "subpage" },
  rightIcon: { type: String, default: "" },
  rightLabel: { type: String, default: "" },
  rightActions: { type: Array, default: () => [] },
  showDefaultRightAction: { type: Boolean, default: true },
});

const iconForAction = {
  notifications: "bell",
  profile: "user",
  info: "help-circle",
  "wallet-info": "help-circle",
  "notification-settings": "settings",
  premium: "crown",
};

const labelForAction = {
  notifications: "Bildirimler",
  profile: "Profil",
  info: "Sayfa bilgisi",
  "wallet-info": "Cüzdan bilgisi",
  "notification-settings": "Bildirim ayarları",
  premium: "Üyelik ayrıcalığı",
};

const testIdForAction = {
  notifications: "notification-button",
  profile: "profile-button",
  info: "header-info-button",
  "wallet-info": "wallet-info-button",
  "notification-settings": "notification-settings-button",
  premium: "premium-member-icon",
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
    :class="`${variant || 'subpage'}-header`"
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
    <div v-else class="v-header__copy page-header-copy" :class="{ 'v-header__copy--profile': headerProfile }">
      <div v-if="headerProfile" class="v-header-profile" :data-testid="headerProfile.testId || undefined">
        <span class="v-header-profile__avatar" aria-hidden="true">
          <img v-if="headerProfile.photo" :src="headerProfile.photo" :alt="headerProfile.name" />
          <span v-else>{{ headerProfile.initials || "LP" }}</span>
        </span>
        <span class="v-header-profile__copy">
          <h1>{{ headerProfile.name || title }}</h1>
          <p>{{ headerProfile.role || subtitle }}</p>
        </span>
      </div>
      <template v-else>
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
      </template>
    </div>

    <div class="v-header__actions header-actions">
      <template
        v-for="action in (rightIcon ? [rightIcon] : rightActions.length ? rightActions : showDefaultRightAction ? ['info'] : [])"
        :key="action"
      >
        <span
          v-if="action === 'premium'"
          class="v-header__action v-header__action--premium icon-btn page-header-action"
          :data-testid="testIdForAction[action]"
          aria-hidden="true"
        >
          <AppIcon :name="iconForAction[action]" :size="24" class-name="icon" />
        </span>
        <button
          v-else
          class="v-header__action icon-btn page-header-action"
          type="button"
          :data-testid="testIdForAction[action] || 'header-right-action'"
          :data-action="action"
          :aria-label="rightLabel || labelForAction[action] || action"
          @click="rightIcon ? emit('right') : emit('action', action)"
        >
          <AppIcon :name="iconForAction[action] || action" :size="24" class-name="icon" />
          <span v-if="action === 'notifications'" class="v-header__notify-dot" aria-hidden="true"></span>
        </button>
      </template>
    </div>
  </header>
</template>
