import { defineStore } from "pinia";
import {
  BILLING_PERIODS,
  SUBSCRIPTION_STATUSES,
  freePlan,
  paywallRemoteConfig,
  subscriptionPlans,
  subscriptionUsageItems,
} from "../data/subscriptionPlans.js";
import { subscriptionService, trackSubscriptionEvent } from "../services/subscriptionService.js";

const STORAGE_KEY = "lipyum.subscription.demo.v1";
const DAY_MS = 24 * 60 * 60 * 1000;

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS).toISOString();
}

function safeParse(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function readStoredState() {
  if (typeof window === "undefined") return {};
  return safeParse(window.localStorage.getItem(STORAGE_KEY)) || {};
}

function writeStoredState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      subscriptionStatus: state.subscriptionStatus,
      activePlanId: state.activePlanId,
      selectedPlanId: state.selectedPlanId,
      selectedBillingPeriod: state.selectedBillingPeriod,
      trialEligible: state.trialEligible,
      trialStartedAt: state.trialStartedAt,
      trialEndsAt: state.trialEndsAt,
      nextRenewalAt: state.nextRenewalAt,
      cancelAtPeriodEnd: state.cancelAtPeriodEnd,
      accessEndsAt: state.accessEndsAt,
      billingPlatform: state.billingPlatform,
      paymentIssue: state.paymentIssue,
      purchaseState: state.purchaseState,
      usedBenefits: state.usedBenefits,
      paywallVariant: state.paywallVariant,
    }),
  );
}

function normalizePlanId(planId) {
  if (!planId) return null;
  const value = String(planId).toLowerCase();
  return subscriptionPlans.some((plan) => plan.id === value) ? value : null;
}

function demoDates() {
  const now = new Date();
  return {
    trialStartedAt: now.toISOString(),
    trialEndsAt: addDays(now, 30),
    nextRenewalAt: addDays(now, 30),
    accessEndsAt: addDays(now, 30),
  };
}

function formatDateTr(value) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export const useSubscriptionStore = defineStore("subscription", {
  state: () => {
    const stored = readStoredState();
    const dates = demoDates();
    return {
      subscriptionStatus: stored.subscriptionStatus || SUBSCRIPTION_STATUSES.FREE,
      activePlanId: stored.activePlanId || null,
      selectedPlanId: stored.selectedPlanId || "plus",
      selectedBillingPeriod: stored.selectedBillingPeriod || paywallRemoteConfig.defaultBillingPeriod,
      trialEligible: stored.trialEligible ?? true,
      trialStartedAt: stored.trialStartedAt || null,
      trialEndsAt: stored.trialEndsAt || dates.trialEndsAt,
      nextRenewalAt: stored.nextRenewalAt || dates.nextRenewalAt,
      cancelAtPeriodEnd: stored.cancelAtPeriodEnd || false,
      accessEndsAt: stored.accessEndsAt || dates.accessEndsAt,
      billingPlatform: stored.billingPlatform || "App Store",
      paymentIssue: stored.paymentIssue || null,
      purchaseState: stored.purchaseState || "idle",
      usedBenefits: stored.usedBenefits || subscriptionUsageItems,
      paywallVariant: stored.paywallVariant || paywallRemoteConfig.paywallVariant,
      analyticsLog: [],
    };
  },
  getters: {
    plans: () => subscriptionPlans,
    freePlan: () => freePlan,
    recommendedPlan: () => subscriptionPlans.find((plan) => plan.recommended) || subscriptionPlans[0],
    selectedPlan: (state) => subscriptionPlans.find((plan) => plan.id === state.selectedPlanId) || subscriptionPlans[0],
    currentPlan(state) {
      return subscriptionPlans.find((plan) => plan.id === state.activePlanId) || freePlan;
    },
    isFree: (state) => state.subscriptionStatus === SUBSCRIPTION_STATUSES.FREE,
    isTrial: (state) => state.subscriptionStatus === SUBSCRIPTION_STATUSES.TRIAL,
    isPaid: (state) => state.subscriptionStatus === SUBSCRIPTION_STATUSES.ACTIVE,
    isCanceledButActive: (state) => state.subscriptionStatus === SUBSCRIPTION_STATUSES.CANCELED_ACTIVE,
    hasPaymentIssue: (state) => state.subscriptionStatus === SUBSCRIPTION_STATUSES.PAYMENT_ISSUE,
    isExpired: (state) => state.subscriptionStatus === SUBSCRIPTION_STATUSES.EXPIRED,
    hasPaidSubscription(state) {
      return [
        SUBSCRIPTION_STATUSES.TRIAL,
        SUBSCRIPTION_STATUSES.ACTIVE,
        SUBSCRIPTION_STATUSES.CANCELED_ACTIVE,
        SUBSCRIPTION_STATUSES.PAYMENT_ISSUE,
      ].includes(state.subscriptionStatus);
    },
    activeSubscriptionPlan() {
      return this.hasPaidSubscription ? this.currentPlan.title : null;
    },
    canStartTrial: (state) => state.trialEligible && state.subscriptionStatus === SUBSCRIPTION_STATUSES.FREE,
    daysRemaining(state) {
      const end = state.subscriptionStatus === SUBSCRIPTION_STATUSES.TRIAL ? state.trialEndsAt : state.accessEndsAt;
      const diff = Math.ceil((new Date(end).getTime() - Date.now()) / DAY_MS);
      return Math.max(0, diff);
    },
    renewalCopy() {
      if (this.isTrial) return `Deneme bitişi: ${formatDateTr(this.trialEndsAt)}`;
      if (this.isCanceledButActive) return `Erişim bitişi: ${formatDateTr(this.accessEndsAt)}`;
      if (this.hasPaymentIssue) return "Avantajların 3 gün daha açık";
      if (this.isPaid) return `Sonraki yenileme: ${formatDateTr(this.nextRenewalAt)}`;
      return "Free kullanım";
    },
  },
  actions: {
    persist() {
      writeStoredState(this.$state);
    },
    track(name, payload = {}) {
      const event = trackSubscriptionEvent(name, {
        currentPlan: this.currentPlan.id,
        selectedPlan: this.selectedPlanId,
        billingPeriod: this.selectedBillingPeriod,
        paywallVariant: this.paywallVariant,
        subscriptionState: this.subscriptionStatus,
        sourceRoute: "/subscription",
        ...payload,
      });
      this.analyticsLog.push(event);
      return event;
    },
    applyDemoState(status) {
      const dates = demoDates();
      this.subscriptionStatus = status;
      this.activePlanId = status === SUBSCRIPTION_STATUSES.FREE || status === SUBSCRIPTION_STATUSES.EXPIRED ? null : "plus";
      this.selectedPlanId = this.activePlanId || "plus";
      this.trialEligible = status === SUBSCRIPTION_STATUSES.FREE;
      this.trialStartedAt = status === SUBSCRIPTION_STATUSES.TRIAL ? dates.trialStartedAt : null;
      this.trialEndsAt = dates.trialEndsAt;
      this.nextRenewalAt = dates.nextRenewalAt;
      this.cancelAtPeriodEnd = status === SUBSCRIPTION_STATUSES.CANCELED_ACTIVE;
      this.accessEndsAt = status === SUBSCRIPTION_STATUSES.PAYMENT_ISSUE ? addDays(new Date(), 3) : dates.accessEndsAt;
      this.paymentIssue = status === SUBSCRIPTION_STATUSES.PAYMENT_ISSUE ? "Ödeme alınamadı" : null;
      this.purchaseState = "idle";
      this.persist();
      this.track("subscription_page_view", { demoState: status });
    },
    startTrial(planId = "plus") {
      const normalized = normalizePlanId(planId) || "plus";
      const dates = demoDates();
      this.activePlanId = normalized;
      this.selectedPlanId = normalized;
      this.subscriptionStatus = SUBSCRIPTION_STATUSES.TRIAL;
      this.trialEligible = false;
      this.trialStartedAt = dates.trialStartedAt;
      this.trialEndsAt = dates.trialEndsAt;
      this.nextRenewalAt = dates.nextRenewalAt;
      this.purchaseState = "trial_started";
      this.persist();
      this.track("trial_cta_click", { selectedPlan: normalized });
      this.track("purchase_success", { selectedPlan: normalized, type: "trial" });
    },
    selectPlan(planId) {
      const normalized = normalizePlanId(planId);
      this.selectedPlanId = normalized || "plus";
      if (!normalized) {
        this.activePlanId = null;
        this.subscriptionStatus = SUBSCRIPTION_STATUSES.FREE;
      }
      this.persist();
      this.track("recommended_plan_view", { selectedPlan: this.selectedPlanId });
    },
    selectBillingPeriod(period) {
      this.selectedBillingPeriod = period === BILLING_PERIODS.ANNUAL ? BILLING_PERIODS.ANNUAL : BILLING_PERIODS.MONTHLY;
      this.persist();
      this.track("billing_period_change");
    },
    async mockPurchase(planId = this.selectedPlanId) {
      const normalized = normalizePlanId(planId) || "plus";
      this.purchaseState = "loading";
      this.track("checkout_start", { selectedPlan: normalized });
      await subscriptionService.purchase({ planId: normalized, billingPeriod: this.selectedBillingPeriod });
      this.activePlanId = normalized;
      this.selectedPlanId = normalized;
      this.subscriptionStatus = SUBSCRIPTION_STATUSES.ACTIVE;
      this.nextRenewalAt = addDays(new Date(), this.selectedBillingPeriod === BILLING_PERIODS.ANNUAL ? 365 : 30);
      this.cancelAtPeriodEnd = false;
      this.paymentIssue = null;
      this.purchaseState = "success";
      this.persist();
      this.track("purchase_success", { selectedPlan: normalized });
    },
    async upgradePlan(planId) {
      const normalized = normalizePlanId(planId) || "pro";
      await subscriptionService.upgrade({ planId: normalized });
      this.activePlanId = normalized;
      this.selectedPlanId = normalized;
      this.subscriptionStatus = SUBSCRIPTION_STATUSES.ACTIVE;
      this.persist();
      this.track("upgrade_click", { selectedPlan: normalized });
    },
    async downgradePlan(planId) {
      const normalized = normalizePlanId(planId) || "plus";
      await subscriptionService.downgrade({ planId: normalized });
      this.activePlanId = normalized;
      this.selectedPlanId = normalized;
      this.persist();
      this.track("downgrade_click", { selectedPlan: normalized });
    },
    cancelMock() {
      this.subscriptionStatus = SUBSCRIPTION_STATUSES.CANCELED_ACTIVE;
      this.cancelAtPeriodEnd = true;
      this.accessEndsAt = this.nextRenewalAt;
      this.persist();
      this.track("purchase_cancel");
    },
    async reactivateMock() {
      await subscriptionService.reactivate({ planId: this.activePlanId || "plus" });
      this.subscriptionStatus = SUBSCRIPTION_STATUSES.ACTIVE;
      this.cancelAtPeriodEnd = false;
      this.persist();
      this.track("reactivate_click");
    },
    async restorePurchasesMock() {
      await subscriptionService.restorePurchases();
      this.track("restore_click");
      this.track("restore_success");
    },
    async openManageSubscriptionsMock() {
      await subscriptionService.manageSubscriptions();
      this.track("manage_subscription_open");
    },
    async resolvePaymentIssueMock() {
      await subscriptionService.resolvePaymentIssue({ planId: this.activePlanId || "plus" });
      this.subscriptionStatus = SUBSCRIPTION_STATUSES.ACTIVE;
      this.paymentIssue = null;
      this.persist();
      this.track("payment_issue_fix_click");
    },
    resetSubscriptionDemo() {
      if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
      const dates = demoDates();
      this.subscriptionStatus = SUBSCRIPTION_STATUSES.FREE;
      this.activePlanId = null;
      this.selectedPlanId = "plus";
      this.selectedBillingPeriod = BILLING_PERIODS.MONTHLY;
      this.trialEligible = true;
      this.trialStartedAt = null;
      this.trialEndsAt = dates.trialEndsAt;
      this.nextRenewalAt = dates.nextRenewalAt;
      this.cancelAtPeriodEnd = false;
      this.accessEndsAt = dates.accessEndsAt;
      this.paymentIssue = null;
      this.purchaseState = "idle";
      this.persist();
    },
  },
});
