import { computed, ref } from "vue";

export function useLazyList(items = [], initialCount = 6, increment = 4) {
  const visibleCount = ref(initialCount);
  const visibleItems = computed(() => items.slice(0, visibleCount.value));
  const hasMore = computed(() => visibleCount.value < items.length);
  const loadMore = () => {
    visibleCount.value = Math.min(items.length, visibleCount.value + increment);
  };

  return {
    visibleCount,
    visibleItems,
    hasMore,
    loadMore,
  };
}
