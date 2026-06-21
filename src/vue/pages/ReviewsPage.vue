<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { reviewSummary, reviews } from "../../data/mockData.js";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import OnayModal from "../components/ui/OnayModal.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const INITIAL_VISIBLE_COUNT = 4;
const LOAD_INCREMENT = 3;

const shell = useAppShellStore();
const activeFilter = ref("all");
const visibleCount = ref(INITIAL_VISIBLE_COUNT);
const activeReplyId = ref("");
const replyDrafts = ref({});
const sentReplies = ref({});
const pendingReport = ref(null);
const listSentinel = ref(null);
let listObserver;

const filters = [
  { key: "all", label: "Tümü" },
  { key: "unanswered", label: "Yanıtlanmamış" },
  { key: "five", label: "5 Puan" },
  { key: "four", label: "4 Puan" },
  { key: "three", label: "3 Puan" },
  { key: "two", label: "2 Puan" },
  { key: "one", label: "1 Puan" },
];

const filteredReviews = computed(() => {
  if (activeFilter.value === "unanswered") return reviews.filter((review) => !review.replied && !sentReplies.value[review.id]);
  if (activeFilter.value === "five") return reviews.filter((review) => review.rating === 5);
  if (activeFilter.value === "four") return reviews.filter((review) => review.rating === 4);
  if (activeFilter.value === "three") return reviews.filter((review) => review.rating === 3);
  if (activeFilter.value === "two") return reviews.filter((review) => review.rating === 2);
  if (activeFilter.value === "one") return reviews.filter((review) => review.rating === 1);
  return reviews;
});
const visibleReviews = computed(() => filteredReviews.value.slice(0, Math.min(visibleCount.value, filteredReviews.value.length)));
const hasMoreReviews = computed(() => visibleReviews.value.length < filteredReviews.value.length);

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, index) => index < Math.round(rating));
}

function setFilter(filterKey) {
  activeFilter.value = filterKey;
}

function isReviewReplied(review) {
  return review.replied || !!sentReplies.value[review.id];
}

function getReviewReply(review) {
  return sentReplies.value[review.id] || review.reply || "";
}

function openReply(review) {
  activeReplyId.value = activeReplyId.value === review.id ? "" : review.id;
  if (!replyDrafts.value[review.id]) {
    replyDrafts.value = {
      ...replyDrafts.value,
      [review.id]: "Değerli yorumunuz için teşekkür ederiz. Geri bildiriminiz hizmet kalitemizi geliştirmemize yardımcı oluyor.",
    };
  }
}

function sendReply(review) {
  const message = String(replyDrafts.value[review.id] || "").trim();
  if (!message) return;
  sentReplies.value = { ...sentReplies.value, [review.id]: message };
  activeReplyId.value = "";
  shell.showToast("Yanıt gönderildi.");
}

function openReportConfirm(review) {
  pendingReport.value = review;
}

function closeReportConfirm() {
  pendingReport.value = null;
}

function confirmReportReview() {
  if (pendingReport.value) shell.showToast("Yorum bildirimi alındı.");
  pendingReport.value = null;
}

function loadMoreReviews() {
  if (!hasMoreReviews.value) return;
  visibleCount.value = Math.min(filteredReviews.value.length, visibleCount.value + LOAD_INCREMENT);
}

function resetVisibleCount() {
  visibleCount.value = Math.min(INITIAL_VISIBLE_COUNT, Math.max(filteredReviews.value.length, INITIAL_VISIBLE_COUNT));
  activeReplyId.value = "";
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
  return nodeRect.top <= rootRect.bottom + 8 && nodeRect.bottom >= rootRect.top;
}

async function loadIfSentinelVisible() {
  await nextTick();
  if (isLoadPointVisible()) loadMoreReviews();
}

function observeSentinel(node) {
  if (!listObserver || !node) return;
  listObserver.observe(node);
}

watch(filteredReviews, () => {
  resetVisibleCount();
  loadIfSentinelVisible();
});

watch(visibleCount, () => {
  loadIfSentinelVisible();
});

watch(listSentinel, (node, oldNode) => {
  if (!listObserver) return;
  if (oldNode) listObserver.unobserve(oldNode);
  observeSentinel(node);
});

onMounted(() => {
  if (!("IntersectionObserver" in window)) return;
  listObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadMoreReviews();
    },
    {
      root: getScrollRoot(),
      rootMargin: "80px 0px 120px",
      threshold: 0.01,
    },
  );
  observeSentinel(listSentinel.value);
  loadIfSentinelVisible();
});

onBeforeUnmount(() => {
  if (listObserver) listObserver.disconnect();
});
</script>

<template>
  <AppPage title="Müşteri Yorumları" class="reviews-page-v4" data-testid="reviews-page">
    <AppCard class="review-summary-card ui-card" aria-label="Yorum özeti">
      <div class="review-summary-score">
        <strong class="review-summary-rating">
          <span class="review-summary-average">{{ reviewSummary.average }}</span>
          <span class="review-summary-star" aria-hidden="true">★</span>
        </strong>
        <small class="review-summary-count">{{ reviewSummary.total }} değerlendirme</small>
        <em class="review-summary-growth">
          <AppIcon name="trend-up" :size="16" class-name="icon" />
          <span>Son 30 günde +{{ reviewSummary.newLast30Days }} yorum</span>
        </em>
      </div>
      <div class="review-summary-gauge" :aria-label="`Müşteri memnuniyeti yüzde ${reviewSummary.satisfaction}`">
        <span class="review-summary-meter" aria-hidden="true">
          <strong>%{{ reviewSummary.satisfaction }}</strong>
        </span>
        <small>Müşteri memnuniyeti</small>
      </div>
    </AppCard>

    <section class="filter-chip-rail reviews-filter-rail" aria-label="Yorum filtreleri">
      <button
        v-for="filter in filters"
        :key="filter.key"
        :class="['filter-chip', activeFilter === filter.key ? 'is-active' : '']"
        type="button"
        :data-review-filter="filter.key"
        data-testid="reviews-filter-chip"
        @click="setFilter(filter.key)"
      >
        <span class="responsive-button-label">{{ filter.label }}</span>
      </button>
    </section>

    <section class="review-list-v4" aria-label="Yorum listesi">
      <div class="section-title compact">
        <h2>Son Yorumlar</h2>
        <span>{{ filteredReviews.length }} yorum</span>
      </div>

      <article v-for="review in visibleReviews" :key="review.id" class="review-card-v4" data-testid="review-card">
        <div class="review-card-avatar" aria-hidden="true">{{ review.name.trim().slice(0, 1) }}</div>
        <div class="review-card-head">
          <span>
            <strong>{{ review.name }}</strong>
            <em class="review-stars">
              <span v-for="(filled, index) in renderStars(review.rating)" :key="index" :class="filled ? 'is-filled' : ''">★</span>
            </em>
          </span>
          <span class="review-card-actions">
            <small>{{ review.date }}</small>
            <button
              class="review-report-btn"
              type="button"
              data-action="report-review-comment"
              data-testid="review-report-button"
              :data-review-service="review.service"
              :title="review.service"
              :aria-label="`${review.service} yorumunu bildir`"
              @click="openReportConfirm(review)"
            >
              Bildir
            </button>
          </span>
        </div>
        <div class="review-card-body">
          <p>{{ review.text }}</p>
          <div class="review-card-foot">
            <button
              v-if="!isReviewReplied(review)"
              class="review-inline-action"
              type="button"
              data-action="reply-review"
              data-testid="review-reply-button"
              :data-review-name="review.name"
              :data-review-text="review.text"
              @click="openReply(review)"
            >
              <AppIcon name="message" :size="14" /> Yanıtla
            </button>
            <span v-else class="review-replied-pill"><AppIcon name="check" :size="14" /> Yanıtlandı</span>
          </div>
          <form
            v-if="activeReplyId === review.id"
            class="review-reply-editor"
            data-testid="review-reply-editor"
            @submit.prevent="sendReply(review)"
          >
            <textarea
              v-model="replyDrafts[review.id]"
              rows="3"
              data-testid="review-reply-textarea"
              :aria-label="`${review.name} yorumu için yanıt`"
            ></textarea>
            <button type="submit" data-testid="review-reply-submit">Gönder</button>
          </form>
          <div v-if="getReviewReply(review)" class="review-partner-reply">
            <strong>Senin yanıtın</strong>
            <p>{{ getReviewReply(review) }}</p>
          </div>
        </div>
      </article>

      <div v-if="!visibleReviews.length" class="empty-state-card">Bu filtrede yorum bulunmuyor.</div>
      <div
        ref="listSentinel"
        class="review-load-sentinel"
        data-testid="reviews-load-sentinel"
        :data-complete="hasMoreReviews ? 'false' : 'true'"
        aria-hidden="true"
      ></div>
      <div v-if="hasMoreReviews" class="review-more-indicator" aria-hidden="true"><span></span></div>
    </section>

    <OnayModal
      :open="!!pendingReport"
      title="Yorum bildirilsin mi?"
      :message="pendingReport ? `${pendingReport.name} yorumunu inceleme için bildirmek istiyor musun?` : 'Bu yorumu bildirmek istiyor musun?'"
      confirm-label="Bildir"
      cancel-label="Vazgeç"
      @cancel="closeReportConfirm"
      @confirm="confirmReportReview"
    />
  </AppPage>
</template>
