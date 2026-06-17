import { LazyLoadButton } from "../utils/lazyList.js";

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const renderStars = (rating = 0) => Array.from({ length: 5 }, (_, index) => (
  `<span class="${index < Math.round(rating) ? "is-filled" : ""}">★</span>`
)).join("");

export function ReviewSummaryCard({ summary = {}, icon = () => "" } = {}) {
  return `
    <section class="review-summary-card ui-card" aria-label="Yorum özeti">
      <div class="review-summary-score">
        <strong>${summary.average || "4.8"} <span>★</span></strong>
        <small>${summary.total || 0} değerlendirme</small>
        <em>${icon("trend-up")} +${summary.newLast30Days || 0} yeni yorum · Son 30 gün</em>
      </div>
      <div class="review-summary-gauge" aria-label="Müşteri memnuniyeti ${summary.satisfaction || 0}">
        <span style="--review-score:${summary.satisfaction || 0}"></span>
        <strong>%${summary.satisfaction || 0}</strong>
        <small>Müşteri memnuniyeti</small>
      </div>
    </section>
  `;
}

export function ReviewCollectCard({ icon = () => "" } = {}) {
  return `
    <section class="review-collect-card" aria-label="Yorum toplama">
      <span class="review-collect-icon">${icon("share")}</span>
      <span class="review-collect-copy">
        <strong>Yorum topla</strong>
        <small>Daha çok iş al.</small>
      </span>
      <button class="review-collect-action" type="button" data-action="share-review-link">
        ${icon("share")} Paylaş
      </button>
    </section>
  `;
}

export function ReviewFilterChips({ filters = [], activeFilter = "all" } = {}) {
  return `
    <section class="filter-chip-rail" aria-label="Yorum filtreleri">
      ${filters.map((filter) => `
        <button
          class="filter-chip ${activeFilter === filter.key ? "is-active" : ""}"
          type="button"
          data-review-filter="${filter.key}"
          data-testid="reviews-filter-chip"
        >
          <span class="responsive-button-label">${filter.label}</span>
        </button>
      `).join("")}
    </section>
  `;
}

export function ReviewCard({ review = {}, icon = () => "" } = {}) {
  const needsReply = !review.replied;
  return `
    <article class="review-card-v4" data-testid="review-card">
      <div class="review-card-avatar" aria-hidden="true">${escapeHtml(review.name || "?").trim().slice(0, 1)}</div>
      <div class="review-card-body">
        <div class="review-card-head">
          <span>
            <strong>${escapeHtml(review.name)}</strong>
            <em class="review-stars">${renderStars(review.rating)}</em>
          </span>
          <small>${escapeHtml(review.date || "")}</small>
        </div>
        <p>${escapeHtml(review.text)}</p>
        <div class="review-card-foot">
          <span class="review-service-tag-v4">${icon("settings")} ${escapeHtml(review.service)}</span>
          ${needsReply
            ? `<button class="review-inline-action" type="button" data-action="reply-review" data-testid="review-reply-button" data-review-name="${escapeHtml(review.name)}" data-review-text="${escapeHtml(review.text)}">${icon("message")} Yanıtla</button>`
            : `<span class="review-replied-pill">${icon("check")} Yanıtlandı</span>`}
        </div>
        ${review.reply ? `
          <div class="review-partner-reply">
            <strong>Senin yanıtın</strong>
            <p>${escapeHtml(review.reply)}</p>
          </div>
        ` : ""}
      </div>
    </article>
  `;
}

export function ReviewList({
  reviews = [],
  visibleReviews = [],
  visibleCount = 0,
  icon = () => "",
} = {}) {
  return `
    <section class="review-list-v4" aria-label="Yorum listesi">
      <div class="section-title compact">
        <h2>Son Yorumlar</h2>
        <span>${reviews.length} yorum</span>
      </div>
      ${visibleReviews.length
        ? visibleReviews.map((review) => ReviewCard({ review, icon })).join("")
        : `<div class="empty-state-card">Bu filtrede yorum bulunmuyor.</div>`}
      ${LazyLoadButton({
        listKey: "reviews",
        hasMore: visibleCount < reviews.length,
        label: "Daha Fazla Yorum Göster",
      })}
    </section>
  `;
}
