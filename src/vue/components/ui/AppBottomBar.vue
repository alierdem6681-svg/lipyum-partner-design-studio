<script setup>
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";

const emit = defineEmits(["navigate", "cta"]);

const props = defineProps({
  activeTab: { type: String, default: "home" },
  ctaVariant: { type: String, default: "subpage" },
  notificationCount: { type: [Number, String], default: 0 },
  showCta: { type: Boolean, default: true },
});

const tabs = [
  { id: "home", label: "Ana Sayfa", icon: "home", route: "/home" },
  { id: "jobs", label: "İşlerim", icon: "clipboard", route: "/my-jobs" },
  { id: "work", label: "İş Al", icon: "plus", route: "/jobs", featured: true },
  { id: "calendar", label: "Takvim", icon: "calendar", route: "/calendar" },
  { id: "wallet", label: "Cüzdan", icon: "wallet", route: "/wallet" },
];

const ctaClasses = computed(() => [
  "v-bottom__cta",
  `v-bottom__cta--${props.ctaVariant}`,
]);
</script>

<template>
  <nav class="v-bottom" aria-label="Alt menü">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['v-bottom__item', tab.featured ? 'is-featured' : '', activeTab === tab.id ? 'is-active' : '']"
      type="button"
      :aria-label="tab.label"
      :aria-current="activeTab === tab.id ? 'page' : undefined"
      @click="tab.featured ? emit('cta', tab.route) : emit('navigate', tab.route)"
    >
      <span v-if="tab.featured && showCta" :class="ctaClasses">
        <AppIcon :name="tab.icon" :size="ctaVariant === 'home' ? 26 : 23" />
        <em v-if="notificationCount" class="v-bottom__badge">{{ notificationCount }}</em>
      </span>
      <AppIcon v-else-if="!tab.featured" :name="tab.icon" :size="24" />
      <span class="v-bottom__label">{{ tab.label }}</span>
    </button>
  </nav>
</template>
