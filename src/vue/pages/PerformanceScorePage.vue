<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import AppBadge from "../components/ui/AppBadge.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import {
  calculateCriteriaMax,
  calculateCriteriaTotal,
  calculateRemainingToTarget,
  getNextTarget,
  getStatusTone,
  highScoreBenefits,
  performanceCriteria,
  performanceTargets,
  priorityPerformanceActions,
} from "../data/performanceImproveModel.js";

const router = useRouter();

const score = computed(() => calculateCriteriaTotal());
const maxScore = computed(() => calculateCriteriaMax());
const nextTarget = computed(() => getNextTarget(score.value));
const nextTargetRemaining = computed(() => calculateRemainingToTarget(score.value, nextTarget.value.score));
const strongCriteriaCount = computed(() => performanceCriteria.filter((criterion) => criterion.status === "Güçlü").length);
const improveCriteriaCount = computed(() => performanceCriteria.filter((criterion) => criterion.status === "Geliştirilebilir").length);

function goTo(route) {
  if (!route) return;
  router.push(route);
}
</script>

<template>
  <AppPage title="Performansımı Artır" data-testid="performance-score-flow-page">
    <div class="performance-growth-page" data-testid="performance-growth-page">
      <AppCard class="performance-growth-hero" padding="lg" variant="hero" data-testid="performance-growth-score">
        <div class="performance-growth-hero__top">
          <div class="performance-growth-score">
            <strong>{{ score }}</strong>
            <span>/ {{ maxScore }}</span>
          </div>
          <div class="performance-growth-copy">
            <AppChip tone="success" icon="trend-up">Gelişim rehberi</AppChip>
            <h2>{{ nextTarget.title }} seviyesine {{ nextTargetRemaining }} puan kaldı</h2>
            <p>
              Skorun; profil kaliten, müşteri deneyimi, aktiflik, bakiye ve abonelik durumuna göre hesaplanır.
            </p>
          </div>
        </div>

        <div class="performance-growth-progress" aria-label="Performans skoru ilerleme durumu">
          <progress :value="score" :max="maxScore"></progress>
          <div class="performance-growth-progress__labels">
            <span>Mevcut {{ score }}</span>
            <span>Hedef {{ nextTarget.score }}</span>
          </div>
        </div>

        <div class="performance-growth-summary" aria-label="Performans özeti">
          <span>
            <small>Güçlü</small>
            <strong>{{ strongCriteriaCount }}</strong>
          </span>
          <span>
            <small>Gelişecek</small>
            <strong>{{ improveCriteriaCount }}</strong>
          </span>
          <span>
            <small>Sıradaki</small>
            <strong>{{ nextTarget.title }}</strong>
          </span>
        </div>
      </AppCard>

      <section class="performance-growth-section" aria-label="Skor hedefleri">
        <div class="performance-growth-section__head">
          <span>Skor hedefleri</span>
        </div>
        <div class="performance-target-grid">
          <AppCard
            v-for="target in performanceTargets"
            :key="target.score"
            class="performance-target-card"
            :class="{ 'is-next': target.score === nextTarget.score }"
            padding="md"
            data-testid="performance-target-card"
          >
            <span>{{ target.title }}</span>
            <strong>{{ target.label }}</strong>
            <small>{{ calculateRemainingToTarget(score, target.score) }} puan kaldı</small>
          </AppCard>
        </div>
      </section>

      <section class="performance-growth-section" aria-label="Öncelikli hamleler">
        <div class="performance-growth-section__head">
          <span>Öncelikli hamleler</span>
        </div>
        <div class="performance-action-grid">
          <AppCard
            v-for="action in priorityPerformanceActions"
            :key="action.id"
            class="performance-growth-action"
            padding="md"
            data-testid="performance-growth-action-card"
          >
            <span class="performance-growth-icon"><AppIcon :name="action.icon" :size="18" /></span>
            <div>
              <strong>{{ action.title }}</strong>
              <p>{{ action.description }}</p>
            </div>
            <div class="performance-growth-action__side">
              <AppBadge tone="success">+{{ action.impact }} puan</AppBadge>
              <AppButton size="sm" variant="secondary" :data-testid="`performance-action-${action.id}`" @click="goTo(action.route)">
                {{ action.actionLabel }}
              </AppButton>
            </div>
          </AppCard>
        </div>
      </section>

      <section class="performance-growth-section" aria-label="Performans kriterleri">
        <div class="performance-growth-section__head">
          <span>Performans alanları</span>
          <strong>{{ performanceCriteria.length }} kriter</strong>
        </div>

        <div class="performance-criteria-grid">
          <AppCard
            v-for="criterion in performanceCriteria"
            :key="criterion.id"
            class="performance-growth-criterion"
            padding="md"
            data-testid="performance-growth-criterion-row"
          >
            <div class="performance-growth-criterion__head">
              <span class="performance-growth-icon"><AppIcon :name="criterion.icon" :size="18" /></span>
              <div>
                <strong>{{ criterion.title }}</strong>
                <small>{{ criterion.currentValue }}</small>
              </div>
              <AppBadge :tone="getStatusTone(criterion.status)">{{ criterion.status }}</AppBadge>
            </div>

            <p>{{ criterion.description }}</p>

            <div class="performance-growth-criterion__progress">
              <progress :value="criterion.currentPoints" :max="criterion.maxPoints"></progress>
              <span>{{ criterion.currentPoints }} / {{ criterion.maxPoints }} puan</span>
            </div>

            <div class="performance-growth-criterion__target">
              <span>
                <small>Hedef</small>
                <strong>{{ criterion.targetValue }}</strong>
              </span>
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

      <AppCard class="performance-growth-benefits" padding="lg" data-testid="performance-growth-benefits">
        <div class="performance-growth-section__head">
          <span>Yüksek skor ne sağlar?</span>
          <strong>Garanti değil, güçlü sinyal</strong>
        </div>
        <ul>
          <li v-for="benefit in highScoreBenefits" :key="benefit">
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
