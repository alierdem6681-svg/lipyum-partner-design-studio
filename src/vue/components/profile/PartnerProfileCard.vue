<script setup>
import AppBadge from "../ui/AppBadge.vue";
import { useProfileStore } from "../../stores/profileStore.js";

defineProps({
  compact: { type: Boolean, default: false },
});

const profile = useProfileStore();
</script>

<template>
  <section :class="['v-profile-card', compact ? 'v-profile-card--compact' : '']" data-testid="partner-profile-card">
    <div class="v-profile-card__avatar">{{ profile.partner.initials }}</div>
    <div class="v-profile-card__copy">
      <h2>{{ profile.partner.name }}</h2>
      <p>{{ profile.partner.title }} · {{ profile.partner.specialty }}</p>
      <span>{{ profile.partner.rating }} puan · {{ profile.partner.reviewCount }} değerlendirme</span>
    </div>
    <div class="v-profile-card__badges">
      <AppBadge v-for="badge in profile.visibleBadges" :key="badge" tone="success">{{ badge }}</AppBadge>
      <button
        v-if="profile.hiddenBadgeCount"
        class="v-badge-more"
        type="button"
        data-testid="profile-badge-more"
        aria-label="Ek rozetleri göster"
        @click="profile.showAllBadges"
      >
        +{{ profile.hiddenBadgeCount }}
      </button>
    </div>
  </section>
</template>
