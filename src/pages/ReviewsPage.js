import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";
import {
  ReviewCollectCard,
  ReviewFilterChips,
  ReviewList,
  ReviewSummaryCard,
} from "../components/ReviewComponents.js";
import { reviewSummary, reviews } from "../data/mockData.js";
import { createLazyListState, getVisibleItems } from "../utils/lazyList.js";

const filters = [
  { key: "all", label: "Tümü" },
  { key: "unanswered", label: "Yanıt Bekleyen" },
  { key: "low", label: "Düşük Puan" },
  { key: "five", label: "5 Yıldız" },
  { key: "four", label: "4 Yıldız" },
];

function filterReviews(items, filter) {
  if (filter === "unanswered") return items.filter((review) => !review.replied);
  if (filter === "low") return items.filter((review) => review.rating <= 3);
  if (filter === "five") return items.filter((review) => review.rating === 5);
  if (filter === "four") return items.filter((review) => review.rating === 4);
  return items;
}

export function ReviewsPage({ state = {}, icon = () => "" } = {}) {
  const activeFilter = state.reviewFilter || "all";
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
      ${Header({
        title: "Müşteri Yorumları",
        subtitle: "Değerlendirme ve geri bildirimler",
      })}
      ${ReviewSummaryCard({ summary: reviewSummary, icon })}
      ${ReviewCollectCard({ icon })}
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
