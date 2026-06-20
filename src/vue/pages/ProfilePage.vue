<script setup>
import { onBeforeUnmount } from "vue";
import AppPage from "../components/ui/AppPage.vue";
import PartnerProfileCard from "../components/profile/PartnerProfileCard.vue";
import ProfileMenuGrid from "../components/profile/ProfileMenuGrid.vue";
import { useProfileStore } from "../stores/profileStore.js";

const profile = useProfileStore();

onBeforeUnmount(() => profile.resetBadges());
</script>

<template>
  <AppPage title="Profilim" data-testid="profile-page">
    <div class="v-stack v-profile-page">
      <PartnerProfileCard :show-actions="false" />
      <ProfileMenuGrid />
    </div>
  </AppPage>
</template>
