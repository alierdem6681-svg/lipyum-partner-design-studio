import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createPinia, setActivePinia } from "pinia";
import {
  formatPrice,
  getPlanById,
  getPlanPrice,
  normalizeSubscriptionStatus,
  subscriptionPlans,
} from "../../src/vue/data/subscriptionPlans.js";
import { useSubscriptionStore } from "../../src/vue/stores/subscriptionStore.js";

test("subscription plans use Gold Plus VIP direct purchase model", () => {
  assert.deepEqual(subscriptionPlans.map((plan) => plan.id), ["gold", "plus", "vip"]);
  assert.equal(getPlanById("gold").monthlyPrice, 249);
  assert.equal(getPlanById("plus").monthlyPrice, 499);
  assert.equal(getPlanById("vip").monthlyPrice, 899);
  assert.equal(getPlanById("plus").recommended, true);
  assert.equal(formatPrice(4790), "4.790");
});

test("monthly and annual prices are centralized", () => {
  const plus = getPlanById("plus");
  assert.equal(getPlanPrice(plus, "monthly"), 499);
  assert.equal(getPlanPrice(plus, "annual"), 4790);
});

test("status aliases avoid stale subscription states", () => {
  assert.equal(normalizeSubscriptionStatus("canceled"), "canceled_active");
  assert.equal(normalizeSubscriptionStatus("payment-issue"), "payment_issue");
  assert.equal(normalizeSubscriptionStatus("unknown"), "free");
});

test("subscription store purchase, upgrade, downgrade, restore and reset work", async () => {
  setActivePinia(createPinia());
  const store = useSubscriptionStore();

  assert.equal(store.status, "free");
  assert.equal(store.selectedPlanId, "plus");

  store.selectPlan("vip");
  assert.equal(store.selectedPlanId, "vip");
  assert.equal(store.selectedPrice, 899);

  await store.mockPurchase("vip");
  assert.equal(store.status, "active");
  assert.equal(store.currentPlanId, "vip");
  assert.equal(store.purchaseState, "success");

  await store.downgradePlan("gold");
  assert.equal(store.currentPlanId, "gold");

  await store.upgradePlan("plus");
  assert.equal(store.currentPlanId, "plus");

  const restore = await store.restorePurchasesMock();
  assert.equal(restore.ok, true);

  store.applyStatus("payment-issue", "plus");
  assert.equal(store.hasPaymentIssue, true);
  await store.resolvePaymentIssueMock();
  assert.equal(store.status, "active");

  store.resetSubscriptionDemo();
  assert.equal(store.status, "free");
});

test("active subscription source has no free demo wording or fields", () => {
  const root = process.cwd();
  const forbidden = [
    "trial",
    "free trial",
    "ücretsiz deneme",
    "ücretsiz dene",
    "deneme süresi",
    "trialDays",
    "trialEligible",
    "startTrial",
    "trialEndsAt",
  ];
  const sourceDirs = ["src/vue/components/subscription", "src/vue/pages", "src/vue/stores", "src/vue/data", "src/vue/services"];
  const files = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(js|vue)$/.test(entry.name)) files.push(full);
    }
  }

  for (const dir of sourceDirs) walk(path.join(root, dir));

  const failures = [];
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8").toLocaleLowerCase("tr-TR");
    for (const term of forbidden) {
      if (source.includes(term.toLocaleLowerCase("tr-TR"))) {
        failures.push(`${path.relative(root, file)} includes ${term}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});
