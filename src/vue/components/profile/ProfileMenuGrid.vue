<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { PROFILE_MENU_ITEMS } from "../../../utils/constants.js";
import ProfileWorkStatusCard from "./ProfileWorkStatusCard.vue";
import ProfileSharePromoCard from "./ProfileSharePromoCard.vue";
import AppIcon from "../ui/AppIcon.vue";
import { useAppShellStore } from "../../stores/appShellStore.js";

const router = useRouter();
const shell = useAppShellStore();
const menuOpen = ref(false);

const menuDetails = {
  "/about": {
    description: "Profil bilgilerinizi tamamlayın",
    status: "Tamam",
    tone: "success",
  },
  "/verifications": {
    description: "Kimlik ve hesap doğrulamalarını tamamla",
    status: "+50 puan",
    tone: "success",
    lockedUntilAboutComplete: true,
  },
  "/photo-gallery": {
    description: "Daha fazla görsel ekleyin",
    status: "+4 puan",
    tone: "success",
  },
  "/services": {
    description: "Hizmet kapsamınızı netleştirin",
    status: "Tamam",
    tone: "success",
  },
  "/regions": {
    description: "Hizmet bölgelerinizi seçin",
    status: "Eksik",
    tone: "warning",
  },
  "/working-hours": {
    description: "Müsaitlik saatlerinizi ayarlayın",
    status: "Tamam",
    tone: "success",
  },
  "/team": {
    description: "Ekibinizi ekleyin",
    status: "+2 puan",
    tone: "success",
  },
  "/capacity": {
    description: "Günlük kapasitenizi belirleyin",
    status: "Tamam",
    tone: "success",
  },
  "/strategy": {
    description: "Büyüme önerilerini inceleyin",
    status: "Yeni",
    tone: "info",
  },
};

const menuItems = computed(() =>
  PROFILE_MENU_ITEMS.map((item) => ({
    ...item,
    ...menuDetails[item.route],
  })),
);

function openMenuItem(item) {
  if (item.lockedUntilAboutComplete) {
    shell.showToast("Hakkımda tam doldurulmadan doğrulamalar açılamaz.");
    return;
  }
  router.push(item.route);
}
</script>

<template>
  <section class="profile-menu-section" data-testid="profile-menu-section" aria-label="Müşteriye görünen profil menüleri">
    <ProfileWorkStatusCard />

    <button
      class="profile-menu-strength-summary"
      type="button"
      data-testid="profile-menu-strength-summary"
      :aria-expanded="menuOpen ? 'true' : 'false'"
      aria-controls="profileMenuList"
      aria-label="Profil gücünüz menüsünü aç"
      @click="menuOpen = !menuOpen"
    >
      <span class="profile-menu-strength-summary__ring" aria-hidden="true">
        <strong>78</strong>
      </span>
      <span class="profile-menu-strength-summary__copy">
        <strong>Profil Gücünüz</strong>
        <small>Harika! Sadece 2 adım kaldı.</small>
      </span>
      <span class="profile-menu-strength-summary__points">
        <strong>+28</strong>
        <small>Puan</small>
      </span>
      <span class="profile-menu-strength-summary__chevron" aria-hidden="true">
        <AppIcon name="chevron-down" :size="18" />
      </span>
    </button>

    <div v-if="menuOpen" class="profile-menu-list" id="profileMenuList" data-testid="profile-menu-list">
      <button
        v-for="item in menuItems"
        :key="item.route"
        class="profile-menu-row"
        type="button"
        data-testid="profile-menu-card"
        data-action="profile-shortcut"
        :data-route="item.route"
        :aria-label="item.label"
        @click="openMenuItem(item)"
      >
        <span class="profile-menu-row__icon" aria-hidden="true">
          <AppIcon :name="item.icon" :size="23" />
        </span>
        <span class="profile-menu-row__copy">
          <span class="profile-menu-row__title">{{ item.label }}</span>
          <span class="profile-menu-row__description">{{ item.description }}</span>
        </span>
        <span :class="['profile-menu-row__status', `is-${item.tone}`]">
          {{ item.status }}
        </span>
        <span class="profile-menu-row__chevron" aria-hidden="true">
          <AppIcon name="chevron-right" :size="18" />
        </span>
      </button>
    </div>

    <ProfileSharePromoCard />
  </section>
</template>
