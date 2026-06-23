<script setup>
import { useRouter } from "vue-router";
import AppIcon from "./AppIcon.vue";

defineProps({
  open: { type: Boolean, default: true },
  title: { type: String, default: "Partner menüsü" },
});

const emit = defineEmits(["close"]);
const router = useRouter();

function openUpgrade() {
  emit("close");
  router.push("/subscription");
}
</script>

<template>
  <div
    v-if="open"
    class="sheet-layer show"
    data-sheet="menu"
    role="presentation"
    data-testid="sidebar-overlay"
    @click.self="emit('close')"
  >
    <section class="sheet partner-menu" role="dialog" data-testid="sidebar-drawer" :aria-label="title">
      <div class="drawer-menu-head">
        <button
          class="drawer-upgrade-banner"
          type="button"
          data-testid="sidebar-upgrade-banner"
          aria-label="Plus avantajlarını keşfet"
          @click="openUpgrade"
        >
          <span class="drawer-upgrade-copy">
            <strong>Müşterilere Plus olarak görün</strong>
            <small>Plus ile %18 daha fazla iş al</small>
          </span>
          <span class="drawer-upgrade-cta">Yükselt</span>
        </button>
        <button
          class="drawer-close-btn"
          type="button"
          data-close
          data-testid="sidebar-close"
          aria-label="Menüyü kapat"
          @click="emit('close')"
        >
          <AppIcon name="x" :size="20" class-name="icon" />
        </button>
      </div>
      <div class="drawer-scroll">
        <slot />
      </div>
    </section>
  </div>
</template>
