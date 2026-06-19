<script setup>
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  section: { type: Object, required: true },
  activePath: { type: String, default: "" },
});

const emit = defineEmits(["navigate"]);
</script>

<template>
  <div>
    <div class="drawer-section-title">{{ section.title }}</div>
    <section class="drawer-menu-card" :aria-label="section.title">
      <button
        v-for="item in section.items"
        :key="item.route || item.label"
        class="drawer-menu-item"
        :class="activePath === item.route ? 'is-active' : ''"
        type="button"
        data-testid="sidebar-menu-item"
        :data-route="item.route"
        :style="{ '--drawer-item-color': item.color || '#344054' }"
        :aria-label="item.label"
        :aria-current="activePath === item.route ? 'page' : undefined"
        @click="emit('navigate', item.route)"
      >
        <span class="drawer-menu-icon">
          <AppIcon :name="item.icon" :size="17" class-name="icon" />
        </span>
        <span class="drawer-menu-copy">
          <strong>{{ item.label }}</strong>
          <small v-if="item.description">{{ item.description }}</small>
        </span>
        <AppIcon name="chevron-right" :size="17" class-name="icon" />
      </button>
    </section>
  </div>
</template>
