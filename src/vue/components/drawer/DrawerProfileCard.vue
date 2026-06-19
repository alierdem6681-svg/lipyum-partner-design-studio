<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { useProfileStore } from "../../stores/profileStore.js";

const profile = useProfileStore();
</script>

<template>
  <section class="drawer-profile-card" aria-label="Partner profili">
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
        {{ profile.partner.rating }} Puan · {{ profile.partner.reviewCount }} Değerlendirme
      </span>
    </div>
    <span class="drawer-badges">
      <span v-for="badge in profile.drawerVisibleBadges" :key="badge.label" class="drawer-mini-badge badge-span-2">
        <AppIcon :name="badge.icon" :size="11" class-name="icon" />
        {{ badge.label }}
      </span>
      <button
        v-if="profile.drawerHiddenBadgeCount"
        class="drawer-mini-badge is-more"
        type="button"
        data-action="toggle-drawer-badges"
        :aria-expanded="profile.drawerBadgesExpanded ? 'true' : 'false'"
        @click="profile.showAllDrawerBadges"
      >
        +{{ profile.drawerHiddenBadgeCount }}
      </button>
    </span>
  </section>

  <section class="drawer-work-status-card is-working" aria-label="Çalışma durumu">
    <div class="row">
      <span class="drawer-status-copy">
        <strong>Çalışma Durumu</strong>
        <small>Aktif</small>
      </span>
      <button class="toggle is-on" type="button" id="dispatchToggle" aria-label="Çalışma durumu" aria-pressed="true">
        <span></span>
      </button>
    </div>
  </section>
</template>
