export function createLazyListState({
  initialCount = 6,
  incrementCount = 4,
  visibleCount,
} = {}) {
  const safeInitial = Math.max(1, Number(initialCount) || 1);
  const safeIncrement = Math.max(1, Number(incrementCount) || 1);
  return {
    initialCount: safeInitial,
    incrementCount: safeIncrement,
    visibleCount: Math.max(safeInitial, Number(visibleCount) || safeInitial),
  };
}

export function getVisibleItems(items = [], visibleCount = 0) {
  return items.slice(0, Math.max(0, Number(visibleCount) || 0));
}

export function hasMoreItems(items = [], visibleCount = 0) {
  return getVisibleItems(items, visibleCount).length < items.length;
}

export function getNextVisibleCount({
  total = 0,
  visibleCount = 0,
  incrementCount = 4,
} = {}) {
  return Math.min(
    Math.max(0, Number(total) || 0),
    Math.max(0, Number(visibleCount) || 0) + Math.max(1, Number(incrementCount) || 1),
  );
}

export function LazyLoadButton({
  listKey,
  hasMore = false,
  label = "Daha Fazla Göster",
} = {}) {
  if (!hasMore) return "";
  return `
    <button
      class="lazy-load-button"
      type="button"
      data-action="load-more-list"
      data-list-key="${listKey}"
    >
      <span class="responsive-button-label">${label}</span>
    </button>
  `;
}
