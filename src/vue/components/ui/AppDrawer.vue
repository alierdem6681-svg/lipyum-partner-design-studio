<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  open: { type: Boolean, default: true },
  title: { type: String, default: "Menü" },
});

const emit = defineEmits(["close"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 bg-slate-950/35" role="presentation" @click.self="emit('close')">
      <aside class="h-full w-[min(88vw,360px)] overflow-y-auto rounded-r-sheet bg-white p-4 shadow-elevated" role="dialog" aria-modal="true" :aria-label="title">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="truncate text-card-title font-bold text-slate-950">{{ title }}</h2>
          <button class="grid h-11 w-11 place-items-center rounded-xl border border-slate-200" type="button" aria-label="Kapat" @click="emit('close')">
            <AppIcon name="x" :size="20" />
          </button>
        </div>
        <slot />
      </aside>
    </div>
  </Teleport>
</template>
