import { defineStore } from "pinia";
import {
  PERFORMANCE_CATEGORIES,
  PERFORMANCE_STORAGE_KEY,
  calculateTotalScore,
  completePerformanceTask,
  createInitialPerformanceState,
  formatScoreTr,
  getRemainingToTarget,
  rankTasks,
  restorePerformanceState,
  serializePerformanceState,
} from "../../domain/performanceScoreModel.js";

function readStoredState() {
  if (typeof window === "undefined") return createInitialPerformanceState();
  return restorePerformanceState(window.localStorage.getItem(PERFORMANCE_STORAGE_KEY));
}

export const usePerformanceScoreStore = defineStore("performanceScore", {
  state: () => readStoredState(),
  getters: {
    formattedScore: (state) => formatScoreTr(state.animatedScore),
    formattedRealScore: (state) => formatScoreTr(state.score),
    remainingScore: (state) => getRemainingToTarget(state.score, state.targetScore),
    formattedRemaining: (state) => formatScoreTr(getRemainingToTarget(state.score, state.targetScore)),
    progressPercent: (state) => Math.min(100, Math.max(0, (state.score / state.targetScore) * 100)),
    progressToHundred: (state) => Math.min(100, Math.max(0, state.score)),
    openTasks: (state) => rankTasks(state.tasks),
    completedTasks: (state) => state.tasks.filter((task) => task.status === "completed"),
    mainTask() {
      return this.openTasks[0] || null;
    },
    laterTasks() {
      return this.openTasks.slice(1, 3);
    },
    categories: (state) =>
      PERFORMANCE_CATEGORIES.map((category) => ({
        ...category,
        current: state.categoryScores[category.id] ?? category.current,
      })),
  },
  actions: {
    persist() {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(PERFORMANCE_STORAGE_KEY, serializePerformanceState(this.$state));
      }
    },
    animateScore(from, to) {
      if (typeof window === "undefined" || typeof window.requestAnimationFrame !== "function") {
        this.animatedScore = to;
        this.persist();
        return;
      }

      const start = window.performance.now();
      const duration = 700;
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        this.animatedScore = Math.round((from + (to - from) * progress) * 10) / 10;
        if (progress < 1) {
          window.requestAnimationFrame(step);
          return;
        }
        this.animatedScore = to;
        this.persist();
      };
      window.requestAnimationFrame(step);
    },
    completeTask(taskId) {
      const beforeScore = calculateTotalScore(this.categoryScores);
      const result = completePerformanceTask(this.$state, taskId);
      if (!result.changed) return result;

      this.$patch(result.state);
      this.animatedScore = beforeScore;
      this.persist();
      this.animateScore(beforeScore, result.state.score);
      return result;
    },
    selectTask(taskId) {
      this.selectedTaskId = taskId;
      this.persist();
    },
    resetPerformanceDemo() {
      this.$patch(createInitialPerformanceState());
      this.persist();
    },
  },
});
