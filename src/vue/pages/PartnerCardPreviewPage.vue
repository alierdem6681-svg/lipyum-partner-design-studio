<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import PartnerProfileCard from "../components/profile/PartnerProfileCard.vue";
import PartnerShareSheet from "../components/profile/PartnerShareSheet.vue";
import { getActiveRouteContent } from "../data/activeRouteContent.js";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useProfileStore } from "../stores/profileStore.js";

const shell = useAppShellStore();
const router = useRouter();
const profile = useProfileStore();
const shareSheetOpen = ref(false);

function itemsFor(route, limit = 3) {
  return (
    getActiveRouteContent(route)
      ?.sections?.flatMap((section) => section.items || [])
      .slice(0, limit) || []
  );
}

function compactList(items, limit = 2) {
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
    eyebrow: "Hizmetler",
    value: compactList(serviceItems),
    meta: `${serviceItems.length} aktif hizmet`,
    metaTone: "dot",
  },
  {
    id: "regions",
    icon: "map-pin",
    eyebrow: "Bölgeler",
    value: compactList(regionItems),
    meta: `${regionItems.length} hizmet bölgesi`,
    metaTone: "dot",
  },
  {
    id: "hours",
    icon: "clock",
    eyebrow: "Çalışma saatleri",
    value: `${hourItems[0]?.title || "Hafta içi"} ${hourItems[0]?.body || "09:00 - 19:00"}`,
    meta: "Bugün 19:00’a kadar açık",
    metaTone: "pill",
  },
];

function editProfileDetails() {
  router.push("/profile");
}

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
            <strong>{{ profile.partner.name }}’nın hizmet bilgileri</strong>
            <p>Hizmet verdiği alanlar, bölgeler ve çalışma saatleri.</p>
          </div>
          <button
            class="partner-preview-details__edit"
            type="button"
            data-testid="partner-preview-edit-details"
            @click="editProfileDetails"
          >
            <AppIcon name="edit" :size="14" />
            Düzenle
          </button>
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
              <span>{{ detail.eyebrow }}</span>
              <p>{{ detail.value }}</p>
              <small :class="detail.metaTone === 'pill' ? 'is-pill' : ''">{{ detail.meta }}</small>
            </div>
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
