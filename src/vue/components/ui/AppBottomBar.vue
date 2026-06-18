<script setup>
import { computed } from "vue";
import { BOTTOM_TABS } from "../../../utils/constants.js";
import AppIcon from "./AppIcon.vue";

const emit = defineEmits(["navigate", "cta"]);

const props = defineProps({
  activeTab: { type: String, default: "home" },
  ctaVariant: { type: String, default: "subpage" },
  notificationCount: { type: [Number, String], default: 0 },
  showCta: { type: Boolean, default: true },
});

const tabs = BOTTOM_TABS;

const ctaClasses = computed(() => [
  "v-bottom__cta",
  `v-bottom__cta--${props.ctaVariant}`,
]);
</script>

<template>
  <nav class="v-bottom" data-testid="app-bottom-bar" aria-label="Alt menü">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['v-bottom__item', tab.featured ? 'is-featured' : '', activeTab === tab.id ? 'is-active' : '']"
      type="button"
      :data-testid="tab.id === 'home' ? 'bottom-tab-home' : tab.id === 'jobs' ? 'bottom-tab-jobs' : tab.id === 'work' ? 'bottom-cta-job' : tab.id === 'calendar' ? 'bottom-tab-calendar' : tab.id === 'wallet' ? 'bottom-tab-wallet' : `bottom-tab-${tab.id}`"
      :data-action="tab.id"
      :aria-label="tab.label"
      :aria-current="activeTab === tab.id ? 'page' : undefined"
      @click="tab.featured ? emit('cta', tab.route) : emit('navigate', tab.route)"
    >
      <span v-if="tab.featured && showCta" :class="ctaClasses">
        <AppIcon :name="tab.icon" :size="ctaVariant === 'home' ? 26 : 23" />
      </span>
      <AppIcon v-else-if="!tab.featured" :name="tab.icon" :size="24" />
      <span class="v-bottom__label">{{ tab.label }}</span>
      <em v-if="tab.featured && notificationCount" class="v-bottom__badge">{{ ` ${notificationCount}` }}</em>
    </button>
  </nav>
</template>
