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

function itemsFor(route, limit = 3) {
  return (
    getActiveRouteContent(route)
      ?.sections?.flatMap((section) => section.items || [])
      .slice(0, limit) || []
  );
}

function compactList(items, limit = 3) {
  const labels = items.slice(0, limit).map((item) => item.title);
  const extraCount = Math.max(0, items.length - limit);
  return `${labels.join(", ")}${extraCount ? ` +${extraCount}` : ""}`;
}

const serviceItems = itemsFor("/services");
const regionItems = itemsFor("/regions");
const hourItems = itemsFor("/working-hours", 2);

const previewDetails = [
  {
    id: "services",
    icon: "briefcase",
    title: "Hizmetler",
    subtitle: compactList(serviceItems),
    value: `${serviceItems.length} aktif hizmet`,
  },
  {
    id: "regions",
    icon: "map-pin",
    title: "Bölgeler",
    subtitle: "Ana ve yakın servis alanı",
    value: `${regionItems.length} bölge`,
  },
  {
    id: "hours",
    icon: "clock",
    title: "Saatler",
    subtitle: `${hourItems[1]?.title || "Cumartesi"} ${hourItems[1]?.body || "10:00 - 16:00"}`,
    value: hourItems[0]?.body || "09:00 - 19:00",
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
              <strong>{{ detail.title }}</strong>
              <p>{{ detail.subtitle }}</p>
            </div>
            <strong class="partner-preview-detail__value">{{ detail.value }}</strong>
            <span class="partner-preview-detail__arrow" aria-hidden="true">
              <AppIcon name="chevron-right" :size="18" />
            </span>
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
