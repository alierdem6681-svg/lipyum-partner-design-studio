<script setup>
import { useRouter } from "vue-router";
import AppIcon from "../ui/AppIcon.vue";
import { useAppShellStore } from "../../stores/appShellStore.js";
import { useProfileStore } from "../../stores/profileStore.js";

defineProps({
  compact: { type: Boolean, default: false },
  showActions: { type: Boolean, default: true },
});

const router = useRouter();
const shell = useAppShellStore();
const profile = useProfileStore();

function openShareSheet() {
  shell.openSheet({
    title: "Profil paylaşımı",
    description: "Partner kartı",
    body: "Sosyal profil, WhatsApp, QR, e-posta ve link kopyalama seçenekleri hazır.",
  });
}
</script>

<template>
  <section
    :class="['partner-profile-card', compact ? 'partner-profile-card--compact' : '']"
    data-testid="partner-profile-card"
    aria-label="Partner profil kartı"
  >
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

    <div :class="['partner-profile-chips', profile.expandedBadges ? 'is-expanded' : '']" aria-label="Profil rozetleri">
      <span v-for="badge in profile.visibleBadges" :key="badge.label" class="partner-profile-chip">
        <AppIcon :name="badge.icon" :size="14" class-name="icon" />
        {{ badge.label }}
      </span>
      <button
        v-if="profile.hiddenBadgeCount"
        class="partner-profile-chip is-more"
        type="button"
        data-testid="profile-badge-more"
        data-action="toggle-profile-badges"
        aria-label="Ek rozetleri göster"
        :aria-expanded="profile.expandedBadges ? 'true' : 'false'"
        @click="profile.showAllBadges"
      >
        <span>+{{ profile.hiddenBadgeCount }}</span>
      </button>
      <template v-if="profile.expandedBadges">
        <span class="partner-profile-chip-break" aria-hidden="true"></span>
        <span v-for="badge in profile.hiddenBadges" :key="badge.label" class="partner-profile-chip is-extra">
          <AppIcon :name="badge.icon" :size="14" class-name="icon" />
          {{ badge.label }}
        </span>
      </template>
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
        @click="router.push('/partner-card-preview')"
      >
        <AppIcon name="eye" :size="16" class-name="icon" />
        Önizle
      </button>
    </div>
  </section>
</template>
