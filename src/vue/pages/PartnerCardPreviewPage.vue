<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import PartnerProfileCard from "../components/profile/PartnerProfileCard.vue";
import PartnerShareSheet from "../components/profile/PartnerShareSheet.vue";
import { getActiveRouteContent } from "../data/activeRouteContent.js";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const shareSheetOpen = ref(false);

function itemTitles(route, limit = 3) {
  return (
    getActiveRouteContent(route)
      ?.sections?.flatMap((section) => section.items || [])
      .slice(0, limit)
      .map((item) => item.title) || []
  );
}

function itemTitlesWithBody(route, limit = 2) {
  return (
    getActiveRouteContent(route)
      ?.sections?.flatMap((section) => section.items || [])
      .slice(0, limit)
      .map((item) => `${item.title} ${item.body}`) || []
  );
}

const previewDetails = [
  {
    id: "services",
    icon: "briefcase",
    title: "Verilen hizmetler",
    value: itemTitles("/services").join(", "),
    meta: "Öne çıkan aktif hizmetler",
  },
  {
    id: "regions",
    icon: "map-pin",
    title: "Hizmet bölgeleri",
    value: itemTitles("/regions").join(", "),
    meta: "Ana ve yakın çalışma bölgeleri",
  },
  {
    id: "hours",
    icon: "clock",
    title: "Çalışma saatleri",
    value: itemTitlesWithBody("/working-hours").join(" · "),
    meta: "Acil işler uygunluğa göre alınır",
  },
];

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
    <div class="v-stack v-partner-preview-page" data-testid="partner-card-preview">
      <PartnerProfileCard variant="public" :show-actions="false" expand-badges />

      <AppCard
        class="partner-preview-details"
        variant="elevated"
        padding="md"
        data-testid="partner-preview-service-summary"
      >
        <div class="partner-preview-details__header">
          <span class="partner-preview-details__mark" aria-hidden="true">
            <AppIcon name="sparkles" :size="16" />
          </span>
          <div>
            <p>Profilde görünen kapsam</p>
            <strong>Hizmet, bölge ve saat özeti</strong>
          </div>
        </div>

        <div class="partner-preview-details__grid" aria-label="Partner profil kapsamı">
          <article
            v-for="detail in previewDetails"
            :key="detail.id"
            class="partner-preview-detail"
            :data-testid="`partner-preview-detail-${detail.id}`"
          >
            <span class="partner-preview-detail__icon" aria-hidden="true">
              <AppIcon :name="detail.icon" :size="17" />
            </span>
            <div class="partner-preview-detail__copy">
              <h3>{{ detail.title }}</h3>
              <p>{{ detail.value }}</p>
              <small>{{ detail.meta }}</small>
            </div>
          </article>
        </div>
      </AppCard>
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
