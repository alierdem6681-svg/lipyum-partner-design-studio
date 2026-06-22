import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import { createPinia, setActivePinia } from "pinia";
import {
  BILLING_PERIODS,
  SUBSCRIPTION_STATUSES,
  subscriptionPlans,
} from "../../src/vue/data/subscriptionPlans.js";
import { subscriptionService } from "../../src/vue/services/subscriptionService.js";
import { useSubscriptionStore } from "../../src/vue/stores/subscriptionStore.js";

describe("subscription conversion model", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("defines Plus, Gold and VIP with exact monthly prices", () => {
    assert.deepEqual(
      subscriptionPlans.map((plan) => [plan.id, plan.monthlyPrice]),
      [
        ["plus", 249],
        ["pro", 499],
        ["vip", 899],
      ],
    );
  });

  test("keeps Plus as the recommended default plan without making Free purchasable", () => {
    const store = useSubscriptionStore();
    assert.equal(store.recommendedPlan.id, "plus");
    assert.equal(store.freePlan.id, "free");
    assert.equal(store.plans.some((plan) => plan.id === "free"), false);
    assert.equal(store.selectedPlan.id, "plus");
  });

  test("calculates yearly total and monthly equivalent from single source plan data", () => {
    const plus = subscriptionPlans.find((plan) => plan.id === "plus");
    assert.equal(plus.annualPrice, 2388);
    assert.equal(plus.monthlyEquivalent, 199);
  });

  test("supports state transitions for trial, active, canceled and payment issue", async () => {
    const store = useSubscriptionStore();

    store.startTrial("plus");
    assert.equal(store.subscriptionStatus, SUBSCRIPTION_STATUSES.TRIAL);
    assert.equal(store.activePlanId, "plus");
    assert.equal(store.canStartTrial, false);

    await store.mockPurchase("vip");
    assert.equal(store.subscriptionStatus, SUBSCRIPTION_STATUSES.ACTIVE);
    assert.equal(store.activePlanId, "vip");
    assert.equal(store.hasPaidSubscription, true);

    store.cancelMock();
    assert.equal(store.subscriptionStatus, SUBSCRIPTION_STATUSES.CANCELED_ACTIVE);
    assert.equal(store.cancelAtPeriodEnd, true);

    await store.reactivateMock();
    assert.equal(store.subscriptionStatus, SUBSCRIPTION_STATUSES.ACTIVE);
    assert.equal(store.cancelAtPeriodEnd, false);

    store.applyDemoState(SUBSCRIPTION_STATUSES.PAYMENT_ISSUE);
    assert.equal(store.hasPaymentIssue, true);
    await store.resolvePaymentIssueMock();
    assert.equal(store.subscriptionStatus, SUBSCRIPTION_STATUSES.ACTIVE);
  });

  test("switches billing period and calls mock billing adapter", async () => {
    const store = useSubscriptionStore();
    store.selectBillingPeriod(BILLING_PERIODS.ANNUAL);
    assert.equal(store.selectedBillingPeriod, BILLING_PERIODS.ANNUAL);

    const result = await subscriptionService.purchase({ planId: "pro", billingPeriod: BILLING_PERIODS.ANNUAL });
    assert.equal(result.ok, true);
    assert.equal(result.planId, "pro");
    assert.equal(result.billingPeriod, BILLING_PERIODS.ANNUAL);
  });
});
