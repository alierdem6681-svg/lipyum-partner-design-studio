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
const badgeExpanded = computed(() => (isDrawer.value ? profile.drawerBadgesExpanded : profile.expandedBadges));
const visibleBadges = computed(() => (isDrawer.value ? profile.drawerVisibleBadges : profile.visibleBadges));
const hiddenBadgeCount = computed(() => (isDrawer.value ? profile.drawerHiddenBadgeCount : profile.hiddenBadgeCount));
const moreTestId = computed(() => (isDrawer.value ? "drawer-profile-badge-more" : "profile-badge-more"));
const moreAction = computed(() => (isDrawer.value ? "toggle-drawer-badges" : "toggle-profile-badges"));

const cardClasses = computed(() =>
  isDrawer.value
    ? ["drawer-profile-card", "partner-profile-card--drawer"]
    : [
        "partner-profile-card",
        `partner-profile-card--${props.variant}`,
        props.compact ? "partner-profile-card--compact" : "",
      ],
);
const mainClasses = computed(() => (isDrawer.value ? ["drawer-profile-main"] : ["partner-profile-main"]));
const avatarClasses = computed(() => (isDrawer.value ? ["drawer-avatar"] : ["partner-profile-avatar-btn"]));
const copyClasses = computed(() => (isDrawer.value ? ["drawer-profile-copy"] : ["partner-profile-copy"]));
const nameRowClasses = computed(() => (isDrawer.value ? ["drawer-name-row"] : ["partner-profile-name-row"]));
const nameClasses = computed(() => (isDrawer.value ? [] : ["partner-profile-name"]));
const tierClasses = computed(() => (isDrawer.value ? ["drawer-badge"] : ["partner-profile-tier"]));
const ratingClasses = computed(() => (isDrawer.value ? ["drawer-rating"] : ["partner-profile-rating"]));
const badgesClasses = computed(() =>
  isDrawer.value
    ? ["drawer-badges"]
    : ["partner-profile-chips", badgeExpanded.value ? "is-expanded" : ""],
);

function badgeClass(index) {
  return isDrawer.value
    ? ["drawer-mini-badge", "badge-span-2", index >= 3 ? "is-extra" : ""]
    : ["partner-profile-chip", index >= 3 ? "is-extra" : ""];
}

const moreBadgeClasses = computed(() =>
  isDrawer.value ? ["drawer-mini-badge", "is-more"] : ["partner-profile-chip", "is-more"],
);

function showAllBadges() {
  if (isDrawer.value) profile.showAllDrawerBadges();
  else profile.showAllBadges();
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
    :class="cardClasses"
    data-testid="partner-profile-card"
    data-component="PartnerProfileCard"
    :data-profile-card-variant="variant"
    :aria-label="isDrawer ? 'Partner profili' : 'Partner profil kartı'"
  >
    <div :class="mainClasses">
      <button
        :class="avatarClasses"
        type="button"
        :aria-label="isDrawer ? 'Partner profil kartı' : 'Profil fotoğrafı ekle'"
      >
        <span v-if="isDrawer" aria-hidden="true">{{ profile.partner.initials }}</span>
        <img v-else :src="profile.partner.avatar" :alt="`${profile.partner.name} profil fotoğrafı`" />
        <span v-if="!isDrawer" class="partner-profile-add" aria-hidden="true">
          <AppIcon name="plus" :size="16" class-name="icon" />
        </span>
      </button>

      <div :class="copyClasses">
        <div :class="nameRowClasses">
          <h3 :class="nameClasses">{{ profile.partner.name }}</h3>
          <span :class="tierClasses">
            <AppIcon name="crown" :size="isDrawer ? 12 : 14" class-name="icon" />
            {{ profile.partner.tier }}
          </span>
        </div>
        <span :class="ratingClasses">
          <AppIcon name="star" :size="isDrawer ? 12 : 15" class-name="icon" />
          {{ profile.partner.rating }} Puan <span aria-hidden="true">·</span> {{ profile.partner.reviewCount }} Değerlendirme
        </span>
      </div>
    </div>

    <div :class="badgesClasses" aria-label="Profil rozetleri">
      <span v-for="(badge, index) in visibleBadges" :key="badge.label" :class="badgeClass(index)">
        <AppIcon :name="badge.icon" :size="isDrawer ? 11 : 14" class-name="icon" />
        {{ badge.label }}
      </span>
      <button
        v-if="hiddenBadgeCount"
        :class="moreBadgeClasses"
        type="button"
        :data-testid="moreTestId"
        :data-action="moreAction"
        aria-label="Ek rozetleri göster"
        :aria-expanded="badgeExpanded ? 'true' : 'false'"
        @click="showAllBadges"
      >
        <span v-if="!isDrawer">+{{ hiddenBadgeCount }}</span>
        <template v-else>+{{ hiddenBadgeCount }}</template>
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
