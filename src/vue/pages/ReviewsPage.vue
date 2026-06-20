<script setup>
import { computed, ref } from "vue";
import { reviewSummary, reviews } from "../../data/mockData.js";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const activeFilter = ref("all");
const visibleCount = ref(4);

const filters = [
  { key: "all", label: "Tümü" },
  { key: "five", label: "5 Yıldız" },
  { key: "four", label: "4 Yıldız" },
  { key: "three", label: "3 Yıldız" },
  { key: "two", label: "2 Yıldız" },
  { key: "one", label: "1 Yıldız" },
  { key: "unanswered", label: "Cevaplanmamış" },
];

const filteredReviews = computed(() => {
  if (activeFilter.value === "unanswered") return reviews.filter((review) => !review.replied);
  if (activeFilter.value === "five") return reviews.filter((review) => review.rating === 5);
  if (activeFilter.value === "four") return reviews.filter((review) => review.rating === 4);
  if (activeFilter.value === "three") return reviews.filter((review) => review.rating === 3);
  if (activeFilter.value === "two") return reviews.filter((review) => review.rating === 2);
  if (activeFilter.value === "one") return reviews.filter((review) => review.rating === 1);
  return reviews;
});
const visibleReviews = computed(() => filteredReviews.value.slice(0, visibleCount.value));

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, index) => index < Math.round(rating));
}

function openReply(review) {
  shell.openSheet({
    title: "Yanıtla",
    description: review.name,
    body: "Yorum yanıtı için hızlı aksiyon hazırlandı.",
  });
}

function reportReview(review) {
  shell.openSheet({
    title: "Yorumu bildir",
    description: review.name,
    body: "Uygunsuz yorum bildirimi mock akışı hazırlandı.",
  });
}
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
          <span>+{{ reviewSummary.newLast30Days }} yeni yorum</span>
          <small>Son 30 gün</small>
        </em>
      </div>
      <div class="review-summary-gauge" :aria-label="`Müşteri memnuniyeti yüzde ${reviewSummary.satisfaction}`">
        <span class="review-summary-meter" aria-hidden="true">
          <strong>%{{ reviewSummary.satisfaction }}</strong>
        </span>
        <small>Müşteri memnuniyeti</small>
      </div>
    </AppCard>

    <section class="filter-chip-rail" aria-label="Yorum filtreleri">
      <button
        v-for="filter in filters"
        :key="filter.key"
        :class="['filter-chip', activeFilter === filter.key ? 'is-active' : '']"
        type="button"
        :data-review-filter="filter.key"
        data-testid="reviews-filter-chip"
        @click="activeFilter = filter.key"
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
              :aria-label="`${review.name} yorumunu bildir`"
              @click="reportReview(review)"
            >
              Bildir
            </button>
          </span>
        </div>
        <div class="review-card-body">
          <p>{{ review.text }}</p>
          <div class="review-card-foot">
            <span class="review-service-tag-v4"><AppIcon name="settings" :size="14" /> {{ review.service }}</span>
            <button
              v-if="!review.replied"
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
          <div v-if="review.reply" class="review-partner-reply">
            <strong>Senin yanıtın</strong>
            <p>{{ review.reply }}</p>
          </div>
        </div>
      </article>

      <div v-if="!visibleReviews.length" class="empty-state-card">Bu filtrede yorum bulunmuyor.</div>
      <AppButton
        v-if="visibleReviews.length < filteredReviews.length"
        class="lazy-load-button"
        variant="secondary"
        data-list-key="reviews"
        @click="visibleCount += 3"
      >
        Daha Fazla Yorum Göster
      </AppButton>
    </section>
  </AppPage>
</template>
