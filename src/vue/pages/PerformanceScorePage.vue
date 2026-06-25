<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import {
  calculateCriteriaMax,
  calculateCriteriaTotal,
  getNextTarget,
  performanceActionQueue,
} from "../data/performanceImproveModel.js";

const INITIAL_VISIBLE_ACTIONS = performanceActionQueue.length;
const LOAD_INCREMENT = 3;

const router = useRouter();
const visibleCount = ref(INITIAL_VISIBLE_ACTIONS);
const listSentinel = ref(null);
const selectedAction = ref(null);
const rewardsOpen = ref(false);
const hasUserScrolled = ref(false);
let listObserver;
let scrollRoot;

const badgeAssetBase = `${import.meta.env.BASE_URL}assets/lipyum-badges/`;
const taskAssetBase = `${import.meta.env.BASE_URL}assets/lipyum-task/`;
const completeIconSrc = `${taskAssetBase}lipyum-task-complete-64.webp`;
const rewardBadges = [
  {
    id: "legend",
    score: "95+",
    image: `${badgeAssetBase}lipyum-badge-efsane-256.png`,
    alt: "Efsane performans rozeti",
    discount: "%50'ye kadar daha düşük fiyatla iş alabilirsin",
    jobs: "x3'e kadar daha fazla iş",
    tone: "legend",
  },
  {
    id: "strong",
    score: "90+",
    image: `${badgeAssetBase}lipyum-badge-guclu-256.png`,
    alt: "Güçlü performans rozeti",
    discount: "%30'a kadar daha düşük fiyatla iş alabilirsin",
    jobs: "x2'ye kadar daha fazla iş",
    tone: "strong",
  },
  {
    id: "high",
    score: "85+",
    image: `${badgeAssetBase}lipyum-badge-yuksek-256.png`,
    alt: "Yüksek performans rozeti",
    discount: "%20'ye kadar daha düşük fiyatla iş alabilirsin",
    jobs: "Daha çok iş fırsatında güçlü görünüm",
    tone: "high",
  },
];

const score = computed(() => calculateCriteriaTotal());
const maxScore = computed(() => calculateCriteriaMax());
const nextTarget = computed(() => getNextTarget(score.value));
const orderedActions = computed(() => [
  ...performanceActionQueue.filter((action) => !action.completed),
  ...performanceActionQueue.filter((action) => action.completed),
]);
const visibleActions = computed(() => orderedActions.value.slice(0, visibleCount.value));
const hasMoreActions = computed(() => visibleCount.value < orderedActions.value.length);

function goTo(route) {
  if (!route) return;
  router.push(route);
}

function openAction(action) {
  if (action.completed) return;
  selectedAction.value = action;
}

function closeAction() {
  selectedAction.value = null;
}

function openRewards() {
  rewardsOpen.value = true;
}

function closeRewards() {
  rewardsOpen.value = false;
}

function continueAction() {
  const route = selectedAction.value?.route;
  closeAction();
  goTo(route);
}

function loadMoreActions() {
  if (!hasMoreActions.value) return;
  visibleCount.value = Math.min(orderedActions.value.length, visibleCount.value + LOAD_INCREMENT);
}

function getScrollRoot() {
  return document.querySelector("#appRoot") || document.querySelector(".v-shell__content");
}

function isLoadPointVisible() {
  const node = listSentinel.value;
  const root = getScrollRoot();
  if (!node || !root) return false;
  const nodeRect = node.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  return nodeRect.top <= rootRect.bottom + 16 && nodeRect.bottom >= rootRect.top;
}

async function loadIfSentinelVisible() {
  await nextTick();
  if (hasUserScrolled.value && isLoadPointVisible()) loadMoreActions();
}

function observeSentinel(node) {
  if (!listObserver || !node) return;
  listObserver.observe(node);
}

function handleScroll() {
  const root = scrollRoot || getScrollRoot();
  if (!root) return;
  if (root.scrollTop > 16) hasUserScrolled.value = true;
  loadIfSentinelVisible();
}

function handleScrollIntent() {
  hasUserScrolled.value = true;
  loadIfSentinelVisible();
}

watch(visibleCount, () => {
  loadIfSentinelVisible();
});

watch(listSentinel, (node, oldNode) => {
  if (!listObserver) return;
  if (oldNode) listObserver.unobserve(oldNode);
  observeSentinel(node);
});

onMounted(() => {
  window.addEventListener("lipyum:performance-rewards", openRewards);
  scrollRoot = getScrollRoot();
  scrollRoot?.addEventListener("scroll", handleScroll, { passive: true });
  scrollRoot?.addEventListener("wheel", handleScrollIntent, { passive: true });
  scrollRoot?.addEventListener("touchmove", handleScrollIntent, { passive: true });

  if (!("IntersectionObserver" in window)) return;
  listObserver = new IntersectionObserver(
    (entries) => {
      if (hasUserScrolled.value && entries.some((entry) => entry.isIntersecting)) loadMoreActions();
    },
    {
      root: scrollRoot,
      rootMargin: "90px 0px 140px",
      threshold: 0.01,
    },
  );
  observeSentinel(listSentinel.value);
});

onBeforeUnmount(() => {
  window.removeEventListener("lipyum:performance-rewards", openRewards);
  if (listObserver) listObserver.disconnect();
  scrollRoot?.removeEventListener("scroll", handleScroll);
  scrollRoot?.removeEventListener("wheel", handleScrollIntent);
  scrollRoot?.removeEventListener("touchmove", handleScrollIntent);
});
</script>

<template>
  <AppPage title="Performansımı Artır" data-testid="performance-score-flow-page">
    <div class="performance-growth-page is-compact" data-testid="performance-growth-page">
      <AppCard class="performance-growth-hero is-compact" padding="lg" variant="hero" data-testid="performance-growth-score">
        <div class="performance-growth-hero__top">
          <div class="performance-growth-score" aria-label="Performans skoru 81">
            <strong>{{ score }}</strong>
          </div>
          <div class="performance-growth-copy">
            <span class="performance-growth-kicker">
              <AppIcon name="trophy" :size="13" />
              Sıradaki hedef: {{ nextTarget.title }}
            </span>
            <div class="performance-growth-impact" aria-label="Performans skoru arttıkça kazanımlar">
              <span>
                <AppIcon name="briefcase" :size="13" />
                Daha çok iş al
              </span>
              <span>
                <AppIcon name="wallet" :size="13" />
                Daha ucuza iş al
              </span>
            </div>
          </div>
        </div>

        <div class="performance-growth-progress" aria-label="Performans skoru ilerleme durumu">
          <progress :value="score" :max="maxScore"></progress>
          <div class="performance-growth-progress__labels">
            <span>Mevcut {{ score }}</span>
            <span>Hedef {{ nextTarget.score }}+</span>
          </div>
        </div>
      </AppCard>

      <section class="performance-growth-section" aria-label="Görev listesi">
        <div class="performance-growth-section__head">
          <span>Görev listesi</span>
        </div>

        <div class="performance-task-list" data-testid="performance-growth-action-list">
          <button
            v-for="action in visibleActions"
            :key="action.id"
            type="button"
            :class="['performance-growth-task', `is-tone-${action.tone || 'primary'}`, { 'is-complete': action.completed }]"
            :disabled="action.completed"
            :aria-label="action.completed ? `${action.title} tamamlandı` : `${action.title}, ${action.impact} puan`"
            data-testid="performance-growth-action-card"
            :data-action-id="action.id"
            @click="openAction(action)"
          >
            <span class="performance-growth-icon"><AppIcon :name="action.icon" :size="17" /></span>
            <span class="performance-growth-task__copy">
              <strong>{{ action.title }}</strong>
            </span>
            <span v-if="action.completed" class="performance-growth-task__check" aria-hidden="true">
              <img :src="completeIconSrc" alt="" loading="lazy" />
            </span>
            <span v-else class="performance-growth-task__points">+{{ action.impact }}</span>
          </button>
        </div>

        <div
          ref="listSentinel"
          class="performance-growth-sentinel"
          :data-complete="hasMoreActions ? 'false' : 'true'"
          aria-hidden="true"
        ></div>
      </section>
    </div>

    <AppSheet
      :open="Boolean(selectedAction)"
      :title="selectedAction?.title || ''"
      :description="selectedAction?.reason || ''"
      @close="closeAction"
    >
      <div v-if="selectedAction" class="performance-action-sheet" data-testid="performance-action-sheet">
        <div class="performance-action-sheet__score">
          <span>Skora etkisi</span>
          <strong>+{{ selectedAction.impact }} puan</strong>
        </div>

        <ol class="performance-action-sheet__steps">
          <li v-for="step in selectedAction.steps" :key="step">
            <AppIcon name="check" :size="15" />
            <span>{{ step }}</span>
          </li>
        </ol>

        <AppButton full-width icon-right="chevron-right" @click="continueAction">
          {{ selectedAction.actionLabel }}
        </AppButton>
      </div>
    </AppSheet>

    <AppSheet
      :open="rewardsOpen"
      title="Skor rozet avantajları"
      description="Skorun yükseldikçe iş alma maliyetin düşer."
      @close="closeRewards"
    >
      <div class="performance-reward-sheet" data-testid="performance-reward-sheet">
        <div class="performance-reward-grid">
          <article
            v-for="badge in rewardBadges"
            :key="badge.id"
            class="performance-reward-card"
            :class="`is-${badge.tone}`"
            data-testid="performance-reward-badge-card"
          >
            <figure class="performance-reward-card__media">
              <img class="performance-reward-card__badge" :src="badge.image" :alt="badge.alt" loading="eager" decoding="async" />
            </figure>
            <span class="performance-reward-card__score">{{ badge.score }}</span>
            <div class="performance-reward-card__copy">
              <strong>{{ badge.discount }}</strong>
              <em>{{ badge.jobs }}</em>
            </div>
          </article>
        </div>

        <div class="performance-reward-note">
          <AppIcon name="shield" :size="17" />
          <span>İndirim ve iş fırsatı etkisi bölge, sektör, talep yoğunluğu ve aktif çalışma davranışına göre değişebilir.</span>
        </div>
      </div>
    </AppSheet>
  </AppPage>
</template>
