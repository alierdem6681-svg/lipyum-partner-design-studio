<script setup>
import { ref } from "vue";
import { formatScoreTr } from "../../domain/performanceScoreModel.js";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { usePerformanceScoreStore } from "../stores/performanceScoreStore.js";

const performance = usePerformanceScoreStore();
const openCategoryId = ref("");

function toggleCategory(id) {
  openCategoryId.value = openCategoryId.value === id ? "" : id;
}
</script>

<template>
  <AppPage title="Puanın Nasıl Hesaplanır?" class="performance-flow-page" data-testid="performance-details-page">
    <div class="performance-flow-stack">
      <AppCard
        v-for="category in performance.categories"
        :key="category.id"
        class="performance-detail-card"
        data-testid="performance-detail-category"
      >
        <button type="button" @click="toggleCategory(category.id)">
          <span>
            <strong>{{ category.title }}</strong>
            <small>{{ category.shortDescription }}</small>
          </span>
          <strong>{{ formatScoreTr(category.current) }} / {{ category.max }}</strong>
        </button>
        <progress class="performance-flow-progress" :value="category.current" :max="category.max"></progress>
        <ul v-if="openCategoryId === category.id">
          <li v-for="metric in category.metrics" :key="metric.title">
            <AppIcon name="check" :size="14" />
            <span>{{ metric.title }}</span>
            <small>{{ metric.max }} puan</small>
          </li>
        </ul>
      </AppCard>

      <AppCard class="performance-details-note" padding="sm">
        Her işlemden sonra puanın anlık güncellenir.
      </AppCard>
    </div>
  </AppPage>
</template>
