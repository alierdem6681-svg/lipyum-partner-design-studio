import test from "node:test";
import assert from "node:assert/strict";
import {
  createLazyListState,
  getNextVisibleCount,
  getVisibleItems,
  hasMoreItems,
} from "../../src/utils/lazyList.js";

test("lazy list state clamps counts", () => {
  const state = createLazyListState({ initialCount: 4, incrementCount: 3, visibleCount: 2 });
  assert.equal(state.visibleCount, 4);
  assert.equal(state.incrementCount, 3);
});

test("visible items and hasMore behave predictably", () => {
  const items = [1, 2, 3, 4, 5];
  assert.deepEqual(getVisibleItems(items, 3), [1, 2, 3]);
  assert.equal(hasMoreItems(items, 3), true);
  assert.equal(hasMoreItems(items, 5), false);
  assert.equal(getNextVisibleCount({ total: 5, visibleCount: 3, incrementCount: 4 }), 5);
});
