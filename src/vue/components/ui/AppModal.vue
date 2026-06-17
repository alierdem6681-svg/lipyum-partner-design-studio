<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  open: { type: Boolean, default: true },
  closeLabel: { type: String, default: "Kapat" },
});

const emit = defineEmits(["close"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4" role="presentation">
      <section
        class="w-full max-w-sm rounded-sheet border border-slate-200 bg-white p-4 shadow-elevated"
        role="dialog"
        aria-modal="true"
        :aria-label="title || closeLabel"
      >
        <div class="flex items-start justify-between gap-3">
          <span class="min-w-0">
            <h2 class="truncate text-card-title font-bold text-slate-950">{{ title }}</h2>
            <p v-if="description" class="mt-1 truncate text-caption font-semibold text-slate-500">{{ description }}</p>
          </span>
          <button class="grid h-11 w-11 place-items-center rounded-xl border border-slate-200" type="button" :aria-label="closeLabel" @click="emit('close')">
            <AppIcon name="x" :size="20" />
          </button>
        </div>
        <div class="mt-4">
          <slot />
        </div>
      </section>
    </div>
  </Teleport>
</template>
