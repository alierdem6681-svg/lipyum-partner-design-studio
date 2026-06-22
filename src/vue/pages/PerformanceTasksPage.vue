<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { formatScoreTr } from "../../domain/performanceScoreModel.js";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { usePerformanceScoreStore } from "../stores/performanceScoreStore.js";

const router = useRouter();
const performance = usePerformanceScoreStore();
const activeTab = ref("priority");
const visibleTasks = computed(() => (activeTab.value === "completed" ? performance.completedTasks : performance.openTasks));

function openTask(task) {
  if (task.status === "completed") return;
  router.push(task.route);
}
</script>

<template>
  <AppPage title="Tüm Görevler" class="performance-flow-page" data-testid="performance-tasks-page">
    <div class="performance-flow-stack">
      <AppCard class="performance-task-tabs" padding="sm">
        <button :class="{ active: activeTab === 'priority' }" type="button" @click="activeTab = 'priority'">Öncelikli</button>
        <button :class="{ active: activeTab === 'completed' }" type="button" @click="activeTab = 'completed'">Tamamlananlar</button>
      </AppCard>

      <AppCard
        v-for="task in visibleTasks"
        :key="task.id"
        class="performance-task-list-row"
        data-testid="performance-task-row"
      >
        <span class="performance-task-icon">
          <AppIcon :name="task.icon" :size="22" />
        </span>
        <span>
          <strong>{{ task.title }}</strong>
          <small>+{{ formatScoreTr(task.scoreDelta) }} puan · {{ task.estimatedMinutes }} dk</small>
        </span>
        <AppButton
          size="sm"
          :variant="task.status === 'completed' ? 'subtle' : 'secondary'"
          :disabled="task.status === 'completed'"
          @click="openTask(task)"
        >
          {{ task.status === "completed" ? "Tamamlandı" : task.actionLabel }}
        </AppButton>
      </AppCard>
    </div>
  </AppPage>
</template>
