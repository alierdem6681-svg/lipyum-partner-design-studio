<script setup>
import { computed, onMounted, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import {
  PERFORMANCE_STORAGE_KEY,
  calculatePerformanceScore,
  formatPerformanceScore,
  nextPerformanceTask,
  performanceBenefits,
  performanceScoreConfig,
  performanceTasks,
} from "../data/performanceScoreTasks.js";

const completedTaskIds = ref([]);
const selectedTaskId = ref(performanceTasks[0]?.id || "");
const lastCompletedTaskId = ref("");

const completedSet = computed(() => new Set(completedTaskIds.value));
const score = computed(() => calculatePerformanceScore(completedTaskIds.value));
const remainingToTarget = computed(() => Math.max(0, performanceScoreConfig.targetScore - score.value));
const progressValue = computed(() => Math.min(100, Math.round((score.value / performanceScoreConfig.targetScore) * 100)));
const completedCount = computed(() => completedTaskIds.value.length);
const nextTask = computed(() => nextPerformanceTask(completedTaskIds.value));
const selectedTask = computed(() => performanceTasks.find((task) => task.id === selectedTaskId.value) || nextTask.value || performanceTasks[0]);

onMounted(() => {
  const saved = window.localStorage.getItem(PERFORMANCE_STORAGE_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed.completedTaskIds)) {
      const validIds = new Set(performanceTasks.map((task) => task.id));
      completedTaskIds.value = parsed.completedTaskIds.filter((id) => validIds.has(id));
      selectedTaskId.value = nextTask.value?.id || performanceTasks[0]?.id || "";
    }
  } catch {
    window.localStorage.removeItem(PERFORMANCE_STORAGE_KEY);
  }
});

function persist() {
  window.localStorage.setItem(
    PERFORMANCE_STORAGE_KEY,
    JSON.stringify({ completedTaskIds: completedTaskIds.value }),
  );
}

function selectTask(taskId) {
  selectedTaskId.value = taskId;
}

function completeTask(taskId) {
  if (completedSet.value.has(taskId)) return;
  completedTaskIds.value = [...completedTaskIds.value, taskId];
  lastCompletedTaskId.value = taskId;
  persist();
  selectedTaskId.value = nextTask.value?.id || taskId;
}

function resetDemo() {
  completedTaskIds.value = [];
  lastCompletedTaskId.value = "";
  selectedTaskId.value = performanceTasks[0]?.id || "";
  window.localStorage.removeItem(PERFORMANCE_STORAGE_KEY);
}
</script>

<template>
  <AppPage title="Daha Fazla İş Al">
    <div class="performance-score-page" data-testid="performance-score-flow-page">
      <AppCard class="performance-score-hero" padding="lg" data-testid="performance-score-card">
        <div class="performance-score-hero__top">
          <div>
            <AppChip tone="success">Gelişim yolu</AppChip>
            <h2>Skorunu görevlerle yükselt</h2>
            <p>Ne yapacağını seç, görevi tamamla, puanın anında artsın.</p>
          </div>
          <span class="performance-score-hero__score" aria-label="Performans skoru">
            <strong>{{ formatPerformanceScore(score) }}</strong>
            <small>/ 100</small>
          </span>
        </div>

        <div class="performance-score-hero__progress">
          <div>
            <strong>{{ performanceScoreConfig.level }}</strong>
            <span>Hedef {{ performanceScoreConfig.targetScore }}</span>
          </div>
          <progress :value="score" :max="performanceScoreConfig.targetScore"></progress>
          <small v-if="remainingToTarget > 0">{{ formatPerformanceScore(remainingToTarget) }} puan kaldı</small>
          <small v-else>Hedefe ulaştın</small>
        </div>

        <div class="performance-score-steps" aria-label="Puan artırma adımları">
          <span><AppIcon name="target" :size="16" /> Görevi seç</span>
          <span><AppIcon name="check" :size="16" /> Tamamla</span>
          <span><AppIcon name="trend-up" :size="16" /> Puanı gör</span>
        </div>
      </AppCard>

      <AppCard v-if="nextTask" class="performance-now-mission" padding="lg" data-testid="performance-now-card">
        <div class="performance-card-heading">
          <span>Şimdi yap</span>
          <strong>+{{ formatPerformanceScore(nextTask.points) }} puan</strong>
        </div>
        <div class="performance-now-mission__body">
          <span class="performance-task-icon is-primary"><AppIcon :name="nextTask.icon" :size="24" /></span>
          <div>
            <h3>{{ nextTask.title }}</h3>
            <p>{{ nextTask.shortText }}</p>
            <small>Yaklaşık {{ nextTask.minutes }} dakika</small>
          </div>
        </div>
        <AppButton
          class="performance-main-action"
          full-width
          icon="check"
          data-testid="performance-main-task-button"
          @click="completeTask(nextTask.id)"
        >
          {{ nextTask.actionLabel }}
        </AppButton>
        <div class="performance-explain-box">
          <span><strong>Nasıl?</strong> {{ nextTask.how }}</span>
          <span><strong>Ne olur?</strong> {{ nextTask.outcome }}</span>
        </div>
      </AppCard>

      <AppCard v-else class="performance-complete-card" padding="lg" data-testid="performance-all-complete">
        <AppIcon name="badge-check" :size="34" />
        <h3>Bugünkü görevler tamamlandı</h3>
        <p>Skorun için en önemli adımları bitirdin. Yeni görevler eklendiğinde burada görünecek.</p>
        <AppButton variant="secondary" size="sm" @click="resetDemo">Demo görevleri sıfırla</AppButton>
      </AppCard>

      <section class="performance-task-section" aria-label="Puan görevleri">
        <div class="performance-section-head">
          <div>
            <span>Görev kartları</span>
            <strong>{{ completedCount }} / {{ performanceTasks.length }} tamamlandı</strong>
          </div>
          <span>{{ progressValue }}%</span>
        </div>

        <div class="performance-task-list">
          <AppCard
            v-for="task in performanceTasks"
            :key="task.id"
            :class="['performance-task-card', completedSet.has(task.id) ? 'is-complete' : '', selectedTask?.id === task.id ? 'is-selected' : '']"
            padding="md"
            data-testid="performance-task-card"
          >
            <button type="button" class="performance-task-card__main" @click="selectTask(task.id)">
              <span class="performance-task-icon"><AppIcon :name="task.icon" :size="20" /></span>
              <span class="performance-task-card__copy">
                <strong>{{ task.title }}</strong>
                <small>{{ task.shortText }}</small>
              </span>
              <span class="performance-task-card__reward">+{{ formatPerformanceScore(task.points) }}</span>
            </button>

            <div v-if="selectedTask?.id === task.id" class="performance-task-card__detail" data-testid="performance-task-detail">
              <span><strong>Nasıl yapılır?</strong> {{ task.how }}</span>
              <span><strong>Sonuç:</strong> {{ task.outcome }}</span>
            </div>

            <div class="performance-task-card__footer">
              <span>{{ task.priority }} · {{ task.minutes }} dk</span>
              <AppButton
                v-if="!completedSet.has(task.id)"
                size="sm"
                variant="secondary"
                data-testid="performance-task-complete"
                @click="completeTask(task.id)"
              >
                Tamamla
              </AppButton>
              <span v-else class="performance-done-pill" data-testid="performance-task-done">
                <AppIcon name="check" :size="14" />
                Tamamlandı
              </span>
            </div>
          </AppCard>
        </div>
      </section>

      <AppCard v-if="lastCompletedTaskId" class="performance-feedback-card" padding="md" data-testid="performance-score-feedback">
        <AppIcon name="trend-up" :size="20" />
        <span>
          Görev tamamlandı. Yeni skorun
          <strong>{{ formatPerformanceScore(score) }}</strong>
        </span>
      </AppCard>

      <section class="performance-benefit-section" aria-label="Skor artınca ne olur">
        <div class="performance-section-head">
          <div>
            <span>Skor artınca</span>
            <strong>Neyi güçlendirir?</strong>
          </div>
        </div>
        <div class="performance-benefit-list">
          <AppCard v-for="benefit in performanceBenefits" :key="benefit.title" class="performance-benefit-card" padding="md">
            <span class="performance-task-icon"><AppIcon :name="benefit.icon" :size="20" /></span>
            <div>
              <strong>{{ benefit.title }}</strong>
              <small>{{ benefit.text }}</small>
            </div>
          </AppCard>
        </div>
      </section>
    </div>
  </AppPage>
</template>
