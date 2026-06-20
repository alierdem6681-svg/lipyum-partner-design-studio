<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import PartnerProfileCard from "../components/profile/PartnerProfileCard.vue";
import PartnerShareSheet from "../components/profile/PartnerShareSheet.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const shareSheetOpen = ref(false);

function openShareOptions() {
  shareSheetOpen.value = true;
}

function handleShare(option) {
  shareSheetOpen.value = false;
  shell.showToast(`${option} hazırlandı.`);
}

onMounted(() => {
  window.addEventListener("lipyum:partner-share", openShareOptions);
});

onBeforeUnmount(() => {
  window.removeEventListener("lipyum:partner-share", openShareOptions);
});
</script>

<template>
  <AppPage title="Partner Kartı Önizleme" data-testid="partner-card-preview-page">
    <div class="v-stack v-partner-preview-page">
      <PartnerProfileCard variant="public" :show-actions="false" expand-badges />
    </div>

    <AppSheet
      :open="shareSheetOpen"
      title="Partner kartını paylaş"
      description="Kanalı seç, ardından paylaşım biçimini belirle."
      @close="shareSheetOpen = false"
    >
      <PartnerShareSheet @share="handleShare" />
    </AppSheet>
  </AppPage>
</template>
