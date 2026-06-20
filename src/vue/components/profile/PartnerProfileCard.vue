<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import AppIcon from "../ui/AppIcon.vue";
import ProfileScoreRing from "./ProfileScoreRing.vue";
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

const cardClasses = computed(() => [
  "partner-profile-card",
  `partner-profile-card--${props.variant}`,
  isDrawer.value ? "drawer-profile-card" : "",
  props.compact ? "partner-profile-card--compact" : "",
]);
const badgesClasses = computed(() => ["partner-profile-chips", badgeExpanded.value ? "is-expanded" : ""]);
const moreBadgeClasses = computed(() => ["partner-profile-chip", "is-more"]);

function badgeClass(index) {
  return ["partner-profile-chip", index >= 3 ? "is-extra" : ""];
}

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

function openStrengthSheet() {
  shell.closeDrawer();
  shell.openSheet({
    title: profile.strength.title,
    description: `Profil skoru: ${profile.strength.score}`,
    body: profile.strength.tasks
      .map((task) => `${task.done ? "Tamamlandı" : "Eksik"}: ${task.label}`)
      .join("\n"),
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
    <div class="partner-profile-main">
      <button class="partner-profile-avatar-btn" type="button" aria-label="Profil fotoğrafı ekle">
        <img :src="profile.partner.avatar" :alt="`${profile.partner.name} profil fotoğrafı`" />
        <span class="partner-profile-add" aria-hidden="true">
          <AppIcon name="plus" :size="16" class-name="icon" />
        </span>
      </button>

      <div class="partner-profile-copy">
        <div class="partner-profile-name-row">
          <h3 class="partner-profile-name">{{ profile.partner.name }}</h3>
          <span class="partner-profile-tier">
            <AppIcon name="crown" :size="14" class-name="icon" />
            {{ profile.partner.tier }}
          </span>
        </div>
        <span class="partner-profile-rating">
          <AppIcon name="star" :size="15" class-name="icon" />
          {{ profile.partner.rating }} Puan <span aria-hidden="true">·</span> {{ profile.partner.reviewCount }} Değerlendirme
        </span>
      </div>
    </div>

    <button
      class="partner-profile-score-button"
      type="button"
      data-testid="partner-profile-score-button"
      data-action="open-profile-strength-sheet"
      :aria-label="`Profil skoru ${profile.strength.score}; yapılacakları göster`"
      @click="openStrengthSheet"
    >
      <ProfileScoreRing :score="profile.strength.score" />
    </button>

    <div :class="badgesClasses" aria-label="Profil rozetleri">
      <span v-for="(badge, index) in visibleBadges" :key="badge.label" :class="badgeClass(index)">
        <AppIcon :name="badge.icon" :size="14" class-name="icon" />
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
