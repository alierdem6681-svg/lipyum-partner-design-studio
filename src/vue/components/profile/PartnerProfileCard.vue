<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import AppIcon from "../ui/AppIcon.vue";
import { useAppShellStore } from "../../stores/appShellStore.js";
import { useProfileStore } from "../../stores/profileStore.js";

const props = defineProps({
  variant: { type: String, default: "page" },
  compact: { type: Boolean, default: false },
  showActions: { type: Boolean, default: true },
});

const router = useRouter();
const shell = useAppShellStore();
const profile = useProfileStore();

const isDrawer = computed(() => props.variant === "drawer");
const cardClasses = computed(() => [
  "partner-profile-card",
  `partner-profile-card--${props.variant}`,
  props.compact ? "partner-profile-card--compact" : "",
]);
const badgeExpanded = computed(() => (isDrawer.value ? profile.drawerBadgesExpanded : profile.expandedBadges));
const visibleBadges = computed(() => (isDrawer.value ? profile.drawerVisibleBadges : profile.visibleBadges));
const hiddenBadgeCount = computed(() => (isDrawer.value ? profile.drawerHiddenBadgeCount : profile.hiddenBadgeCount));
const moreTestId = computed(() => (isDrawer.value ? "drawer-profile-badge-more" : "profile-badge-more"));
const moreAction = computed(() => (isDrawer.value ? "toggle-drawer-badges" : "toggle-profile-badges"));

function showAllBadges() {
  if (isDrawer.value) profile.showAllDrawerBadges();
  else profile.showAllBadges();
}

function drawerBadgeClass(index) {
  return [
    "drawer-mini-badge",
    "badge-span-2",
    index >= 3 ? "is-extra" : "",
  ];
}

function openShareSheet() {
  shell.closeDrawer();
  shell.openSheet({
    title: "Profil paylaşımı",
    description: "Partner kartı",
    body: "Sosyal profil, WhatsApp, QR, e-posta ve link kopyalama seçenekleri hazır.",
  });
}

function openPreview() {
  shell.closeDrawer();
  router.push("/partner-card-preview");
}
</script>

<template>
  <section
    v-if="isDrawer"
    class="drawer-profile-card"
    data-testid="partner-profile-card"
    aria-label="Partner profili"
  >
    <div class="drawer-avatar" aria-hidden="true">{{ profile.partner.initials }}</div>
    <div class="drawer-profile-copy">
      <div class="drawer-name-row">
        <h3>{{ profile.partner.name }}</h3>
        <span class="drawer-badge">
          <AppIcon name="crown" :size="12" class-name="icon" />
          {{ profile.partner.tier }}
        </span>
      </div>
      <span class="drawer-rating">
        <AppIcon name="star" :size="12" class-name="icon" />
        {{ profile.partner.rating }} Puan <span aria-hidden="true">·</span> {{ profile.partner.reviewCount }} Değerlendirme
      </span>
    </div>
    <span class="drawer-badges">
      <span
        v-for="(badge, index) in visibleBadges"
        :key="badge.label"
        :class="drawerBadgeClass(index)"
      >
        <AppIcon :name="badge.icon" :size="11" class-name="icon" />
        {{ badge.label }}
      </span>
      <button
        v-if="hiddenBadgeCount"
        class="drawer-mini-badge is-more"
        type="button"
        :data-testid="moreTestId"
        :data-action="moreAction"
        aria-label="Ek rozetleri göster"
        :aria-expanded="badgeExpanded ? 'true' : 'false'"
        @click="showAllBadges"
      >
        +{{ hiddenBadgeCount }}
      </button>
    </span>
  </section>

  <section v-else :class="cardClasses" data-testid="partner-profile-card" aria-label="Partner profil kartı">
    <div class="partner-profile-main">
      <button class="partner-profile-avatar-btn" type="button" aria-label="Profil fotoğrafı ekle">
        <img :src="profile.partner.avatar" :alt="`${profile.partner.name} profil fotoğrafı`" />
        <span class="partner-profile-add" aria-hidden="true">
          <AppIcon name="plus" :size="16" class-name="icon" />
        </span>
      </button>

      <div class="partner-profile-copy">
        <h3 class="partner-profile-name">{{ profile.partner.name }}</h3>
        <span class="partner-profile-tier">
          <AppIcon name="crown" :size="14" class-name="icon" />
          {{ profile.partner.tier }}
        </span>
        <span class="partner-profile-rating">
          <AppIcon name="star" :size="15" class-name="icon" />
          {{ profile.partner.rating }} Puan <span aria-hidden="true">·</span> {{ profile.partner.reviewCount }} Değerlendirme
        </span>
      </div>
    </div>

    <div :class="['partner-profile-chips', badgeExpanded ? 'is-expanded' : '']" aria-label="Profil rozetleri">
      <span
        v-for="(badge, index) in visibleBadges"
        :key="badge.label"
        :class="['partner-profile-chip', index >= 3 ? 'is-extra' : '']"
      >
        <AppIcon :name="badge.icon" :size="14" class-name="icon" />
        {{ badge.label }}
      </span>
      <button
        v-if="hiddenBadgeCount"
        class="partner-profile-chip is-more"
        type="button"
        :data-testid="moreTestId"
        :data-action="moreAction"
        aria-label="Ek rozetleri göster"
        :aria-expanded="badgeExpanded ? 'true' : 'false'"
        @click="showAllBadges"
      >
        <span>+{{ hiddenBadgeCount }}</span>
      </button>
    </div>

    <div v-if="showActions" class="partner-profile-actions">
      <button
        class="ghost-action"
        type="button"
        data-testid="partner-share-button"
        data-action="open-partner-share"
        @click="openShareSheet"
      >
        <AppIcon name="share" :size="16" class-name="icon" />
        Paylaş
      </button>
      <button
        class="ghost-action"
        type="button"
        data-testid="partner-preview-button"
        data-action="profile-preview"
        @click="openPreview"
      >
        <AppIcon name="eye" :size="16" class-name="icon" />
        Önizle
      </button>
    </div>
  </section>
</template>
