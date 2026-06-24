<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import {
  calculateCriteriaMax,
  calculateCriteriaTotal,
  calculateProgressPercent,
  calculateRemainingToTarget,
  performanceBenefits,
  performanceCriteria,
  performanceScoreConfig,
  priorityPerformanceActions,
} from "../data/performanceScoreTasks.js";

const router = useRouter();

const score = computed(() => calculateCriteriaTotal());
const maxScore = computed(() => calculateCriteriaMax());
const remainingToTarget = computed(() => calculateRemainingToTarget(score.value));
const progressPercent = computed(() => calculateProgressPercent(score.value, maxScore.value));

const summaryStats = computed(() => [
  { label: "Seviye", value: performanceScoreConfig.level },
  { label: "Hedef", value: performanceScoreConfig.targetScore },
  { label: "Kalan", value: `${remainingToTarget.value} puan` },
]);

function goTo(route) {
  if (!route) return;
  router.push(route);
}
</script>

<template>
  <AppPage title="Performansımı Artır">
    <div class="performance-improve-page" data-testid="performance-score-flow-page">
      <AppCard class="performance-improve-summary" padding="lg" data-testid="performance-score-card">
        <div class="performance-improve-summary__top">
          <div>
            <AppChip tone="success" icon="trend-up">Gelişim merkezi</AppChip>
            <h2>Performansımı Artır</h2>
            <p>Daha güçlü görünmek için gelişim alanlarını takip et.</p>
          </div>
          <span class="performance-improve-score" aria-label="Mevcut skor 81 / 100">
            <strong>{{ score }}</strong>
            <small>/ {{ maxScore }}</small>
          </span>
        </div>

        <div class="performance-improve-progress" aria-label="Performans skoru ilerlemesi">
          <div>
            <strong>{{ performanceScoreConfig.level }}</strong>
            <span>{{ performanceScoreConfig.targetScore }} hedefi için {{ remainingToTarget }} puan kaldı</span>
          </div>
          <progress :value="score" :max="maxScore"></progress>
        </div>

        <div class="performance-improve-stats">
          <span v-for="item in summaryStats" :key="item.label">
            <small>{{ item.label }}</small>
            <strong>{{ item.value }}</strong>
          </span>
        </div>

        <p class="performance-improve-note">
          Skorun; profil kaliten, müşteri deneyimi, aktiflik, bakiye ve abonelik durumuna göre hesaplanır.
        </p>
      </AppCard>

      <section class="performance-improve-section" aria-label="Öncelikli hamleler" data-testid="performance-priority-actions">
        <div class="performance-improve-section__head">
          <span>Öncelikli 3 hamle</span>
          <strong>En hızlı etki</strong>
        </div>

        <div class="performance-action-list">
          <AppCard
            v-for="(action, index) in priorityPerformanceActions"
            :key="action.id"
            class="performance-action-card"
            padding="md"
            data-testid="performance-priority-card"
          >
            <span class="performance-action-rank">{{ index + 1 }}</span>
            <span class="performance-soft-icon"><AppIcon :name="action.icon" :size="19" /></span>
            <div class="performance-action-copy">
              <strong>{{ action.title }}</strong>
              <span>Mevcut: {{ action.currentValue }}</span>
              <span>Hedef: {{ action.targetValue }}</span>
            </div>
            <div class="performance-action-side">
              <strong>+{{ action.impact }} puan</strong>
              <AppButton size="sm" variant="secondary" :data-testid="`performance-action-${action.id}`" @click="goTo(action.actionRoute)">
                {{ action.actionLabel }}
              </AppButton>
            </div>
          </AppCard>
        </div>
      </section>

      <section class="performance-improve-section" aria-label="Performans alanları" data-testid="performance-criteria-section">
        <div class="performance-improve-section__head">
          <span>Performans alanları</span>
          <strong>{{ performanceCriteria.length }} kriter</strong>
        </div>

        <div class="performance-criteria-list">
          <AppCard
            v-for="criterion in performanceCriteria"
            :key="criterion.id"
            class="performance-criterion-row"
            padding="md"
            data-testid="performance-criterion-row"
          >
            <span class="performance-soft-icon"><AppIcon :name="criterion.icon" :size="19" /></span>
            <div class="performance-criterion-copy">
              <div class="performance-criterion-title">
                <strong>{{ criterion.title }}</strong>
                <AppChip :tone="criterion.status === 'Güçlü' ? 'success' : criterion.status === 'Eksik' ? 'warning' : 'neutral'">
                  {{ criterion.status }}
                </AppChip>
              </div>
              <p>{{ criterion.description }}</p>
              <div class="performance-criterion-values">
                <span><small>Mevcut</small><strong>{{ criterion.currentValue }}</strong></span>
                <span><small>Hedef</small><strong>{{ criterion.targetValue }}</strong></span>
              </div>
            </div>
            <div class="performance-criterion-score">
              <strong>{{ criterion.currentPoints }} / {{ criterion.maxPoints }}</strong>
              <small>puan</small>
              <AppButton
                v-if="criterion.actionLabel"
                size="sm"
                variant="ghost"
                :data-testid="`performance-criterion-action-${criterion.id}`"
                @click="goTo(criterion.actionRoute)"
              >
                {{ criterion.actionLabel }}
              </AppButton>
            </div>
          </AppCard>
        </div>
      </section>

      <AppCard class="performance-benefits-card" padding="lg" data-testid="performance-benefits-card">
        <div class="performance-improve-section__head">
          <span>Yüksek skor ne sağlar?</span>
          <strong>Güvenli avantaj</strong>
        </div>
        <ul>
          <li v-for="benefit in performanceBenefits" :key="benefit">
            <AppIcon name="check" :size="16" />
            <span>{{ benefit }}</span>
          </li>
        </ul>
        <p>
          Yüksek performans skoru, uygun işlerde daha güçlü değerlendirilmeni destekler. İş sayısı bölge, sektör ve talebe göre değişebilir.
        </p>
      </AppCard>
    </div>
  </AppPage>
</template>
