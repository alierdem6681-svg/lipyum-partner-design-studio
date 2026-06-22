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
const change = computed(() => performance.lastScoreChange || { oldScore: 81.7, newScore: performance.score, delta: 0.2 });
const nextTask = computed(() => performance.mainTask);
</script>

<template>
  <AppPage title="Görev Tamamlandı" class="performance-flow-page" data-testid="performance-success-page">
    <div class="performance-flow-stack">
      <AppCard class="performance-success-hero">
        <span class="performance-success-check"><AppIcon name="check" :size="44" /></span>
        <h2>Harika!</h2>
        <p>İş bilgilerini eksiksiz girdin.</p>
        <strong>+{{ formatScoreTr(change.delta) }} puan</strong>
      </AppCard>

      <AppCard class="performance-flow-score-card" data-testid="performance-success-score">
        <div class="performance-flow-score-card__top">
          <span>
            <small>Yeni puanın</small>
            <strong>{{ performance.formattedScore }}<em>/100</em></strong>
          </span>
          <span class="performance-flow-change">{{ formatScoreTr(change.oldScore) }} → {{ formatScoreTr(change.newScore) }}</span>
        </div>
        <progress class="performance-flow-progress" :value="performance.score" :max="performance.targetScore" aria-label="Yeni puan ilerlemesi"></progress>
        <div class="performance-flow-score-card__goal">
          <strong>Hedef {{ performance.targetScore }}</strong>
          <strong>{{ performance.formattedRemaining }} puan kaldı</strong>
        </div>
      </AppCard>

      <section v-if="nextTask" class="performance-later-section" aria-label="Sıradaki görev">
        <h2>SIRADAKİ EN İYİ ADIM</h2>
        <AppCard class="performance-next-card">
          <span class="performance-task-icon">
            <AppIcon :name="nextTask.icon" :size="23" />
          </span>
          <span>
            <strong>{{ nextTask.title }}</strong>
            <small>Yaklaşık {{ nextTask.estimatedMinutes }} dakika</small>
            <em>+{{ formatScoreTr(nextTask.scoreDelta) }} puan</em>
          </span>
          <AppButton @click="router.push(nextTask.route)">ŞİMDİ YAP</AppButton>
        </AppCard>
      </section>

      <AppButton variant="secondary" full-width data-testid="performance-back-home" @click="router.push('/performance-score')">
        Ana ekrana dön
      </AppButton>
    </div>
  </AppPage>
</template>
