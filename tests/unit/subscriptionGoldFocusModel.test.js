import assert from "node:assert/strict";
import test from "node:test";
import { getPlanById } from "../../src/vue/data/subscriptionPlans.js";
import {
  buildCheckoutQuery,
  formatSubscriptionPrice,
  getDisplayPlan,
  getPlanCtaCopy,
  getPlanPriceCopy,
  getPlanSecondaryPriceCopy,
} from "../../src/vue/data/subscriptionGoldFocusModel.js";

test("gold focus display model keeps Gold recommended", () => {
  const gold = getDisplayPlan(getPlanById("gold"));

  assert.equal(gold.id, "gold");
  assert.equal(gold.recommended, true);
  assert.equal(gold.tone, "gold");
  assert.equal(gold.icon, "crown");
  assert.ok(gold.compactBenefits.length >= 3);
});

test("gold focus price and CTA copy are centralized", () => {
  const gold = getDisplayPlan(getPlanById("gold"));
  const vip = getDisplayPlan(getPlanById("vip"));

  assert.equal(formatSubscriptionPrice(20910), "20.910");
  assert.equal(getPlanPriceCopy(gold, "monthly"), "2.091 TL / ay");
  assert.equal(getPlanPriceCopy(gold, "annual"), "20.910 TL / yıl");
  assert.equal(getPlanSecondaryPriceCopy(gold, "annual"), "Aylık karşılığı 1.743 TL");
  assert.equal(getPlanCtaCopy(gold), "GOLD'A GEÇ");
  assert.equal(getPlanCtaCopy(vip), "VIP'E GEÇ");
});

test("selected plan support copy follows the selected plan", () => {
  const plus = getDisplayPlan(getPlanById("plus"));
  const gold = getDisplayPlan(getPlanById("gold"));
  const vip = getDisplayPlan(getPlanById("vip"));

  assert.match(plus.decisionSupport, /Plus/);
  assert.match(gold.decisionSupport, /Gold/);
  assert.match(vip.decisionSupport, /VIP/);
  assert.doesNotMatch(vip.decisionSupport, /Gold/);
});

test("gold focus checkout query follows selected plan and billing", () => {
  assert.deepEqual(buildCheckoutQuery(getPlanById("gold"), "annual"), {
    plan: "gold",
    billing: "annual",
  });
  assert.deepEqual(buildCheckoutQuery(getPlanById("plus"), "monthly"), {
    plan: "plus",
    billing: "monthly",
  });
});
