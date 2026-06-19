<script setup>
import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppPage from "../components/ui/AppPage.vue";
import PartnerProfileCard from "../components/profile/PartnerProfileCard.vue";
import ProfileMenuGrid from "../components/profile/ProfileMenuGrid.vue";
import ProfileStrengthCard from "../components/profile/ProfileStrengthCard.vue";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useProfileStore } from "../stores/profileStore.js";

const router = useRouter();
const shell = useAppShellStore();
const profile = useProfileStore();

onBeforeUnmount(() => profile.resetBadges());

function shareProfile() {
  shell.openSheet({
    title: "Profil paylaşımı",
    description: "Partner kartı",
    body: "Profil bağlantısı, WhatsApp ve sosyal profil paylaşım seçenekleri hazırlandı.",
  });
}
</script>

<template>
  <AppPage title="Profilim" data-testid="profile-page">
    <div class="v-stack v-profile-page">
      <AppCard padding="lg" variant="hero" class="v-route-hero">
        <div>
          <h2>Profilim</h2>
          <p>Partner kartı, güven sinyalleri ve görünürlük ayarları tek yerden yönetilir.</p>
        </div>
        <div class="v-content-actions">
          <AppButton size="sm" icon="share" @click="shareProfile">Paylaş</AppButton>
          <AppButton size="sm" variant="secondary" icon="eye" @click="router.push('/partner-card-preview')">
            Önizle
          </AppButton>
        </div>
      </AppCard>

      <AppCard padding="lg">
        <PartnerProfileCard />
      </AppCard>

      <ProfileStrengthCard />
      <ProfileMenuGrid />
    </div>
  </AppPage>
</template>
