<script setup>
import { useRouter } from "vue-router";
import { PROFILE_MENU_ITEMS } from "../../../utils/constants.js";
import AppIcon from "../ui/AppIcon.vue";

const router = useRouter();
</script>

<template>
  <section class="profile-menu-section" data-testid="profile-menu-section" aria-label="Müşteriye görünen profil menüleri">
    <div class="profile-menu-grid" id="profileMenuGrid" data-testid="profile-menu-grid">
      <button
        v-for="item in PROFILE_MENU_ITEMS"
        :key="item.route"
        class="profile-menu-card"
        type="button"
        data-testid="profile-menu-card"
        data-action="profile-shortcut"
        :data-route="item.route"
        :aria-label="item.label"
        @click="router.push(item.route)"
      >
        <span class="profile-menu-icon-wrap" aria-hidden="true">
          <AppIcon :name="item.icon" :size="25" />
        </span>
        <span class="profile-menu-label">{{ item.label }}</span>
      </button>
    </div>
  </section>
</template>
