<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../../components/ui/AppButton.vue";
import AppCard from "../../components/ui/AppCard.vue";
import AppChip from "../../components/ui/AppChip.vue";
import AppFilterChips from "../../components/ui/AppFilterChips.vue";
import AppIcon from "../../components/ui/AppIcon.vue";
import AppPage from "../../components/ui/AppPage.vue";
import { getActiveRouteContent } from "../../data/activeRouteContent.js";
import { useAppShellStore } from "../../stores/appShellStore.js";

const props = defineProps({
  routePath: { type: String, required: true },
  variant: { type: String, default: "rich" },
  pageTestId: { type: String, default: "" },
});

const router = useRouter();
const shell = useAppShellStore();
const selectedFilter = ref("Tümü");
const page = computed(() => getActiveRouteContent(props.routePath));
const testId = computed(() => props.pageTestId || `route-specific-${props.routePath.replace(/\W+/g, "-")}`);

function isInteractive(item) {
  return Boolean(item?.route || item?.type || item?.action);
}

function handleAction(action) {
  if (!action) return;
  if (action.route || action.type === "route") {
    router.push(action.route);
    return;
  }
  shell.openSheet({
    title: action.title || action.label || "İşlem",
    description: page.value?.title || "Lipyum Partner",
    body: action.body || `${action.title || action.label || "Seçilen işlem"} hazırlandı.`,
  });
}
</script>

<template>
  <AppPage v-if="page" :title="page.title" :data-testid="testId">
    <div :class="['v-stack v-rich-route', `v-rich-route--${variant}`]">
      <AppCard padding="lg" class="v-rich-route__hero">
        <div>
          <AppChip tone="success">{{ page.title }}</AppChip>
          <h2>{{ page.title }}</h2>
          <p>{{ page.lead }}</p>
        </div>
        <div v-if="page.actions?.length" class="v-content-actions">
          <AppButton
            v-for="action in page.actions"
            :key="action.label"
            size="sm"
            :icon="action.icon"
            @click="handleAction(action)"
          >
            {{ action.label }}
          </AppButton>
        </div>
      </AppCard>

      <div v-if="page.metrics?.length" class="v-content-metric-grid">
        <AppCard v-for="metric in page.metrics" :key="metric.label" padding="md" class="v-content-metric">
          <AppIcon :name="metric.icon" :size="18" />
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </AppCard>
      </div>

      <AppFilterChips
        v-if="page.filters?.length"
        v-model="selectedFilter"
        :items="page.filters.map((filter) => ({ label: filter, value: filter }))"
        aria-label="Filtreler"
        data-testid="content-filter-chips"
      />

      <section v-for="section in page.sections" :key="section.title" class="v-content-section">
        <div class="v-section-title">
          <h2>{{ section.title }}</h2>
        </div>
        <div class="v-content-list" role="list">
          <component
            v-for="item in section.items"
            :is="isInteractive(item) ? AppCard : 'article'"
            :key="item.title"
            padding="md"
            :as="isInteractive(item) ? 'button' : undefined"
            :class="['v-content-list-item', !isInteractive(item) ? 'v-content-list-item--static v-card v-card--p-md v-card--default' : '']"
            role="listitem"
            @click="handleAction(item)"
          >
            <span class="v-content-list-item__icon"><AppIcon :name="item.icon" :size="20" /></span>
            <span class="v-content-list-item__copy">
              <strong>{{ item.title }}</strong>
              <small>{{ item.body }}</small>
            </span>
            <AppIcon v-if="isInteractive(item)" name="chevron-right" :size="18" />
          </component>
        </div>
      </section>
    </div>
  </AppPage>
</template>
