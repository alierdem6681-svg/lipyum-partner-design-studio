<script setup>
import AppIcon from "./AppIcon.vue";

defineProps({
  open: { type: Boolean, default: true },
  title: { type: String, default: "Menü" },
  sections: { type: Array, default: () => [] },
});

const emit = defineEmits(["close", "navigate"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 bg-slate-950/35" data-testid="sidebar-overlay" role="presentation" @click.self="emit('close')">
      <aside class="h-full w-[min(88vw,360px)] overflow-y-auto rounded-r-sheet bg-white p-4 shadow-elevated" data-testid="sidebar-drawer" role="dialog" aria-modal="true" :aria-label="title">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="truncate text-card-title font-bold text-slate-950">{{ title }}</h2>
          <button class="grid h-11 w-11 place-items-center rounded-xl border border-slate-200" type="button" data-testid="sidebar-close" aria-label="Kapat" @click="emit('close')">
            <AppIcon name="x" :size="20" />
          </button>
        </div>
        <div class="mb-4 rounded-hero border border-amber-200 bg-amber-50 p-3" data-testid="partner-profile-card">
          <div class="flex items-center gap-3">
            <span class="grid h-12 w-12 place-items-center rounded-card bg-slate-950 text-section-title font-extrabold text-amber-300">AK</span>
            <span class="min-w-0">
              <strong class="block truncate text-card-title font-extrabold text-slate-950">Ahmet Kaya</strong>
              <small class="block truncate text-caption font-bold text-amber-700">Gold Partner · 4.8 Puan</small>
            </span>
          </div>
          <button
            class="mt-3 grid min-h-11 w-full grid-cols-[minmax(0,1fr)_18px] items-center rounded-xl border border-amber-200 bg-white/80 px-3 text-left text-small font-extrabold text-slate-900"
            type="button"
            data-testid="partner-card-preview-button"
            aria-label="Partner kartı önizleme"
            @click="emit('navigate', '/partner-card-preview')"
          >
            <span class="truncate">Partner kartını önizle</span>
            <AppIcon name="chevron-right" :size="17" class="text-slate-400" />
          </button>
        </div>
        <nav class="grid gap-4" aria-label="Sidebar menüsü">
          <section v-for="section in sections" :key="section.title" class="grid gap-2">
            <h3 class="px-1 text-caption font-extrabold text-slate-500">{{ section.title }}</h3>
            <button
              v-for="item in section.items"
              :key="item.route || item.label"
              class="grid min-h-12 grid-cols-[36px_minmax(0,1fr)_18px] items-center gap-2 rounded-card border border-slate-100 bg-white px-2 text-left shadow-soft"
              type="button"
              :aria-label="item.label"
              :aria-current="$route.path === item.route ? 'page' : undefined"
              @click="emit('navigate', item.route)"
            >
              <span class="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <AppIcon :name="item.icon" :size="18" />
              </span>
              <span class="min-w-0 truncate text-small font-extrabold text-slate-900">{{ item.label }}</span>
              <AppIcon name="chevron-right" :size="17" class="text-slate-400" />
            </button>
          </section>
        </nav>
      </aside>
    </div>
  </Teleport>
</template>
