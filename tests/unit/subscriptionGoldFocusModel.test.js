import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCheckoutQuery,
  faqPreviewItems,
  formatSubscriptionPrice,
  getDisplayPlan,
  getPlanCtaCopy,
  getPlanPriceCopy,
  safeAndTransparentItems,
  trustTiles,
  whyGoldBenefits,
} from "../../src/vue/data/subscriptionGoldFocusModel.js";

test("subscription Gold focus formatting and CTA copy are stable", () => {
  const gold = { id: "gold", title: "Gold", monthlyPrice: 2025, monthlyEquivalent: 1688 };
  assert.equal(formatSubscriptionPrice(2025), "2.025");
  assert.equal(getPlanCtaCopy(gold), "GOLD’A GEÇ");
  assert.equal(getPlanPriceCopy(gold, "monthly"), "2.025 TL / ay");
});

test("subscription Gold focus display plan merges project plan data with UI manifest", () => {
  const plan = getDisplayPlan({ id: "gold", title: "Gold", monthlyPrice: 2025 });
  assert.equal(plan.icon, "crown");
  assert.equal(plan.tone, "gold");
  assert.equal(plan.recommended, true);
  assert.equal(plan.descriptor, "En çok tercih edilen");
  assert.equal(plan.decisionBenefits.includes("Öncelikli destek"), true);
});

test("checkout query uses selected plan and billing period", () => {
  assert.deepEqual(buildCheckoutQuery({ id: "vip" }, "annual"), { plan: "vip", billing: "annual" });
  assert.deepEqual(buildCheckoutQuery({ id: "plus" }, "monthly"), { plan: "plus", billing: "monthly" });
});

test("compact supporting sections stay intentionally short", () => {
  assert.equal(trustTiles.length, 3);
  assert.equal(whyGoldBenefits.length, 3);
  assert.equal(safeAndTransparentItems.length, 4);
  assert.equal(faqPreviewItems.length, 3);
});
