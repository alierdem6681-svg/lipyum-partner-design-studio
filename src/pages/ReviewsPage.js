import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";
import {
  ReviewFilterChips,
  ReviewList,
  ReviewSummaryCard,
} from "../components/ReviewComponents.js";
import { reviewSummary, reviews } from "../data/mockData.js";
import { createLazyListState, getVisibleItems } from "../utils/lazyList.js";

const filters = [
  { key: "all", label: "Tümü" },
  { key: "five", label: "5 Yıldız" },
  { key: "four", label: "4 Yıldız" },
  { key: "three", label: "3 Yıldız" },
  { key: "two", label: "2 Yıldız" },
  { key: "one", label: "1 Yıldız" },
  { key: "unanswered", label: "Cevaplanmamış" },
];

function filterReviews(items, filter) {
  if (filter === "unanswered") return items.filter((review) => !review.replied);
  if (filter === "five") return items.filter((review) => review.rating === 5);
  if (filter === "four") return items.filter((review) => review.rating === 4);
  if (filter === "three") return items.filter((review) => review.rating === 3);
  if (filter === "two") return items.filter((review) => review.rating === 2);
  if (filter === "one") return items.filter((review) => review.rating === 1);
  return items;
}

export function ReviewsPage({ state = {}, icon = () => "" } = {}) {
  const selectedFilter = state.reviewFilter || "all";
  const activeFilter = filters.some((filter) => filter.key === selectedFilter) ? selectedFilter : "all";
  const filteredReviews = filterReviews(reviews, activeFilter);
  const lazyState = createLazyListState({
    initialCount: 4,
    incrementCount: 3,
    visibleCount: state.lazyListCounts?.reviews || state.reviewVisibleCount || 4,
  });
  const visibleReviews = getVisibleItems(filteredReviews, lazyState.visibleCount);

  return PageContainer({
    className: "reviews-page-v4",
    children: `
      <span class="sr-only" data-testid="reviews-page">Müşteri Yorumları</span>
      ${Header({
        title: "Müşteri Yorumları",
        subtitle: "Değerlendirme ve geri bildirimler",
      })}
      ${ReviewSummaryCard({ summary: reviewSummary, icon })}
      ${ReviewFilterChips({ filters, activeFilter })}
      ${ReviewList({
        reviews: filteredReviews,
        visibleReviews,
        visibleCount: visibleReviews.length,
        icon,
      })}
    `,
  });
}
