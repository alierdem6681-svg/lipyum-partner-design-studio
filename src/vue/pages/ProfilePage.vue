<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import PartnerProfileCard from "../components/profile/PartnerProfileCard.vue";
import ProfileMenuGrid from "../components/profile/ProfileMenuGrid.vue";
import profilePreviewPremiumUrl from "../../assets/profile-preview-premium.svg";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useProfileStore } from "../stores/profileStore.js";

const profile = useProfileStore();
const shell = useAppShellStore();
const router = useRouter();
const settingsOpen = ref(false);

const settingsActions = [
  { id: "password", label: "Şifre güncelleme", description: "Hesap giriş şifreni yenile.", icon: "shield" },
  { id: "email", label: "E-posta değiştirme", description: "Bildirim ve giriş e-postanı güncelle.", icon: "message" },
  { id: "phone", label: "Telefon no güncelleme", description: "Doğrulama telefonunu değiştir.", icon: "phone" },
  { id: "freeze", label: "Hesap dondurma", description: "Hesabını geçici olarak pasife al.", icon: "pause" },
  { id: "delete", label: "Hesap silme", description: "Kalıcı silme talebini başlat.", icon: "x" },
];

function openSettings() {
  settingsOpen.value = true;
}

function showSettingsAction(action) {
  settingsOpen.value = false;
  shell.showToast(`${action.label} hazırlanıyor.`);
}

onMounted(() => {
  window.addEventListener("lipyum:profile-settings", openSettings);
});

onBeforeUnmount(() => {
  profile.resetBadges();
  window.removeEventListener("lipyum:profile-settings", openSettings);
});
</script>

<template>
  <AppPage title="Profilim" data-testid="profile-page">
    <div class="v-stack v-profile-page profile-page-with-sticky-preview">
      <PartnerProfileCard :show-actions="false" />
      <ProfileMenuGrid />
    </div>

    <button
      class="profile-sticky-preview"
      type="button"
      data-testid="profile-sticky-preview-button"
      aria-label="Profil kartı önizlemesini aç"
      @click="router.push('/partner-card-preview')"
    >
      <span class="profile-sticky-preview__art" aria-hidden="true">
        <img :src="profilePreviewPremiumUrl" alt="" />
      </span>
      <span class="profile-sticky-preview__copy">
        <strong>Önizleme Yap</strong>
        <small>Profil kartını müşteri gözüyle gör</small>
      </span>
      <span class="profile-sticky-preview__arrow" aria-hidden="true">
        <AppIcon name="chevron-right" :size="20" />
      </span>
    </button>

    <AppSheet
      :open="settingsOpen"
      title="Profil Ayarları"
      description="Hesap güvenliği ve iletişim bilgilerini yönet."
      @close="settingsOpen = false"
    >
      <div class="profile-settings-sheet" data-testid="profile-settings-sheet">
        <button
          v-for="action in settingsActions"
          :key="action.id"
          type="button"
          class="profile-settings-sheet__row"
          :data-testid="`profile-settings-${action.id}`"
          @click="showSettingsAction(action)"
        >
          <span class="profile-settings-sheet__icon" aria-hidden="true">
            <AppIcon :name="action.icon" :size="20" />
          </span>
          <span class="profile-settings-sheet__copy">
            <strong>{{ action.label }}</strong>
            <small>{{ action.description }}</small>
          </span>
          <AppIcon name="chevron-right" :size="18" />
        </button>
      </div>
    </AppSheet>
  </AppPage>
</template>
