<script setup>
import AppIcon from "./AppIcon.vue";

const emit = defineEmits(["back", "right", "menu", "action"]);
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  showBack: { type: Boolean, default: true },
  variant: { type: String, default: "subpage" },
  rightIcon: { type: String, default: "" },
  rightLabel: { type: String, default: "" },
  rightActions: { type: Array, default: () => [] },
});

const iconForAction = {
  notifications: "bell",
  profile: "user",
  info: "help-circle",
  "wallet-info": "help-circle",
  "notification-settings": "settings",
};
</script>

<template>
  <header class="v-header v-app-header" :data-header-variant="variant" data-testid="app-header">
    <button
      v-if="showBack"
      class="v-header__action"
      type="button"
      data-testid="back-button"
      aria-label="Geri dön"
      @click="emit('back')"
    >
      <AppIcon name="chevron-left" :size="22" />
    </button>
    <button
      v-else
      class="v-header__action"
      type="button"
      data-testid="hamburger-button"
      aria-label="Menüyü aç"
      @click="emit('menu')"
    >
      <AppIcon name="menu" :size="22" />
    </button>

    <div class="v-header__copy">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <div class="v-header__actions">
      <button
        v-for="action in (rightIcon ? [rightIcon] : rightActions.length ? rightActions : ['info'])"
        :key="action"
        class="v-header__action"
        type="button"
        :data-testid="action === 'notifications' ? 'notification-button' : action === 'profile' ? 'profile-button' : 'header-right-action'"
        :aria-label="rightLabel || action"
        @click="rightIcon ? emit('right') : emit('action', action)"
      >
        <AppIcon :name="iconForAction[action] || action" :size="22" />
      </button>
    </div>
  </header>
</template>
