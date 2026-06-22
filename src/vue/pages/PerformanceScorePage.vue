<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { formatScoreTr } from "../../domain/performanceScoreModel.js";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { usePerformanceScoreStore } from "../stores/performanceScoreStore.js";

const router = useRouter();
const performance = usePerformanceScoreStore();

const mainTask = computed(() => performance.mainTask);
const laterTasks = computed(() => performance.laterTasks);

function openTask(task) {
  if (!task) return;
  performance.selectTask(task.id);
  router.push(task.route);
}
</script>

<template>
  <AppPage title="Daha Fazla İş Al" class="performance-flow-page" data-testid="performance-score-flow-page">
    <div class="performance-flow-stack">
      <AppCard class="performance-flow-score-card" data-testid="performance-score-card">
        <div class="performance-flow-score-card__top">
          <span>
            <small>Puanın</small>
            <strong>{{ performance.formattedScore }}<em>/100</em></strong>
          </span>
          <span class="performance-flow-status">İyi gidiyor</span>
        </div>
        <div class="performance-flow-score-card__goal">
          <strong>Hedef {{ performance.targetScore }}</strong>
          <strong>{{ performance.formattedRemaining }} puan kaldı</strong>
        </div>
        <progress class="performance-flow-progress" :value="performance.score" :max="performance.targetScore" aria-label="Puan ilerlemesi"></progress>
        <div class="performance-flow-score-card__labels">
          <small>{{ performance.formattedScore }}</small>
          <small>{{ performance.targetScore }}</small>
        </div>
      </AppCard>

      <AppCard v-if="mainTask" class="performance-now-card" data-testid="performance-now-card">
        <span class="performance-now-card__tag">ŞİMDİ YAP</span>
        <div class="performance-now-card__body">
          <span class="performance-task-icon is-primary">
            <AppIcon :name="mainTask.icon" :size="24" />
          </span>
          <span>
            <strong>{{ mainTask.title }}</strong>
            <small>{{ mainTask.shortDescription }}</small>
          </span>
        </div>
        <div class="performance-now-card__meta">
          <span>+{{ formatScoreTr(mainTask.scoreDelta) }} puan</span>
          <span><AppIcon name="clock" :size="17" /> Yaklaşık {{ mainTask.estimatedMinutes }} dakika</span>
        </div>
        <AppButton full-width size="lg" data-testid="performance-main-task-button" @click="openTask(mainTask)">
          {{ mainTask.actionLabel }}
        </AppButton>
      </AppCard>

      <section class="performance-later-section" aria-label="Sonra yap">
        <h2>SONRA YAP</h2>
        <AppCard
          v-for="task in laterTasks"
          :key="task.id"
          class="performance-later-task"
          data-testid="performance-later-task"
        >
          <span class="performance-task-icon">
            <AppIcon :name="task.icon" :size="22" />
          </span>
          <span class="performance-later-task__copy">
            <strong>{{ task.title }}</strong>
            <small>+{{ formatScoreTr(task.scoreDelta) }} puan · {{ task.estimatedMinutes }} dakika</small>
          </span>
          <AppButton size="sm" variant="secondary" @click="openTask(task)">
            {{ task.actionLabel }}
          </AppButton>
        </AppCard>
      </section>

      <AppCard class="performance-summary-row" padding="sm" data-testid="performance-progress-summary">
        <strong>{{ performance.completedTasks.length }} görev tamamlandı · {{ performance.openTasks.length }} görev kaldı</strong>
        <button type="button" @click="router.push('/performance-score/tasks')">Tüm görevleri gör</button>
      </AppCard>

      <button class="performance-details-link" type="button" @click="router.push('/performance-score/details')">
        Puanın nasıl hesaplanır?
      </button>
    </div>
  </AppPage>
</template>
