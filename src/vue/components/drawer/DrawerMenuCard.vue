<script setup>
import AppIcon from "../ui/AppIcon.vue";

const props = defineProps({
  section: { type: Object, required: true },
  activePath: { type: String, default: "" },
});

const emit = defineEmits(["navigate"]);

const toneClasses = {
  green: "drawer-menu-item--green",
  blue: "drawer-menu-item--blue",
  gold: "drawer-menu-item--gold",
  red: "drawer-menu-item--red",
  gray: "drawer-menu-item--gray",
};

function itemClass(item) {
  return [
    props.activePath === item.route ? "is-active" : "",
    toneClasses[item.tone] || toneClasses.gray,
  ];
}

function handleItemClick(item, event) {
  event?.stopPropagation();
  const targetRoute = item.route;
  if (!targetRoute) return;
  emit("navigate", targetRoute);

  window.setTimeout(() => {
    const currentRoute = window.location.hash.replace(/^#/, "") || "/";
    if (currentRoute !== targetRoute) {
      window.location.hash = targetRoute;
    }
  }, 0);
}
</script>

<template>
  <div>
    <div class="drawer-section-title">{{ section.title }}</div>
    <section class="drawer-menu-card" :aria-label="section.title">
      <button
        v-for="item in section.items"
        :key="item.route || item.label"
        class="drawer-menu-item"
        :class="itemClass(item)"
        type="button"
        data-testid="sidebar-menu-item"
        :data-route="item.route"
        :aria-label="item.label"
        :aria-current="activePath === item.route ? 'page' : undefined"
        @click="handleItemClick(item, $event)"
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
