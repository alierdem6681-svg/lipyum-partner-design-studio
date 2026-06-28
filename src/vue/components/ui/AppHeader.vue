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
  "about-edit": "edit",
  "services-edit": "edit",
  "profile-preview": "eye",
  "profile-settings": "settings",
  "wallet-info": "help-circle",
  "account-transactions": "receipt",
  "notification-settings": "settings",
  "regions-settings": "settings",
  "working-hours-settings": "sliders",
  "capacity-settings": "sliders",
  "strategy-settings": "sliders",
  "team-add": "plus",
  "partner-share": "share",
  "performance-rewards": "trophy",
  "subscription-status": "trophy",
  "support-headset": "headphones",
  "support-filter": "sliders",
};

const labelForAction = {
  notifications: "Bildirimler",
  profile: "Profil",
  info: "Sayfa bilgisi",
  "about-edit": "Hakkımda bilgilerini düzenle",
  "services-edit": "Hizmetlerini düzenle",
  "profile-preview": "Önizle",
  "profile-settings": "Profil ayarları",
  "wallet-info": "Cüzdan bilgisi",
  "account-transactions": "Hesap hareketleri",
  "notification-settings": "Bildirim ayarları",
  "regions-settings": "Bölge ayarları",
  "working-hours-settings": "Çalışma saatleri ayarları",
  "capacity-settings": "Kapasite ayarları",
  "strategy-settings": "Strateji ayarları",
  "team-add": "Ekip ekle",
  "partner-share": "Partner kartını paylaş",
  "performance-rewards": "Skor rozet avantajları",
  "subscription-status": "Abonelik durumunu görüntüle",
  "support-headset": "Destek akışı bilgisi",
  "support-filter": "Destek filtreleri",
};

const testIdForAction = {
  notifications: "notification-button",
  profile: "profile-button",
  info: "header-info-button",
  "about-edit": "about-edit-button",
  "services-edit": "services-edit-button",
  "profile-preview": "profile-preview-header-button",
  "profile-settings": "profile-settings-header-button",
  "wallet-info": "wallet-info-button",
  "account-transactions": "account-transactions-header-button",
  "notification-settings": "notification-settings-button",
  "regions-settings": "regions-settings-button",
  "working-hours-settings": "working-hours-settings-button",
  "capacity-settings": "capacity-settings-button",
  "strategy-settings": "strategy-settings-button",
  "team-add": "team-add-button",
  "partner-share": "partner-preview-header-share",
  "performance-rewards": "performance-rewards-button",
  "subscription-status": "subscription-status-button",
  "support-headset": "support-headset-button",
  "support-filter": "support-filter-button",
};

const customerServiceAssetBase = `${import.meta.env.BASE_URL}assets/lipyum-customer-service/`;

const homeStatuses = [
  { action: "status", icon: "check", eyebrow: "Durum: Aktif", label: "₺675 ≈ 2-3 iş", tone: "success" },
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
      rightActions.includes('profile-preview') || rightActions.includes('partner-share') || rightActions.includes('about-edit') || rightActions.includes('services-edit') ? 'has-text-action' : '',
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
      <template v-for="action in (rightIcon ? [rightIcon] : rightActions)" :key="action">
        <span
          v-if="action === 'customer-service-crown'"
          class="v-header__premium-crown"
          data-testid="customer-service-premium-crown"
          aria-hidden="true"
        >
          <img :src="`${customerServiceAssetBase}crown-premium.svg`" alt="" />
        </span>
        <button
          v-else
          class="v-header__action icon-btn page-header-action"
          :class="[
            action === 'profile-preview' || action === 'partner-share' ? 'is-text-action' : '',
            action === 'about-edit' ? 'is-text-action' : '',
            action === 'services-edit' ? 'is-text-action' : '',
            action === 'partner-share' ? 'is-partner-share-action' : '',
            action === 'subscription-status' ? 'is-subscription-status-action' : '',
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
          <span v-if="action === 'about-edit'" class="v-header__action-label">Düzenle</span>
          <span v-if="action === 'services-edit'" class="v-header__action-label">Düzenle</span>
          <span v-if="action === 'notifications'" class="v-header__notify-dot" aria-hidden="true"></span>
        </button>
      </template>
    </div>
  </header>
</template>
