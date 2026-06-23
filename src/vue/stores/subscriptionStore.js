import { defineStore } from "pinia";
import {
  BILLING_PERIODS,
  freeSubscriptionPlan,
  formatPrice,
  getMonthlyEquivalent,
  getPlanById,
  getPlanPrice,
  nextRenewalDate,
  normalizeSubscriptionStatus,
  recommendedPlanId,
  subscriptionPlans,
} from "../data/subscriptionPlans.js";
import { subscriptionService } from "../services/subscriptionService.js";

const STORAGE_KEY = "lipyum.subscription.directPurchase";

function initialState() {
  return {
    status: "free",
    currentPlanId: "free",
    selectedPlanId: recommendedPlanId,
    billingPeriod: "monthly",
    renewalDate: "19 Temmuz 2026",
    paymentPlatform: "App Store",
    cancelAtPeriodEnd: false,
    accessEndsAt: "19 Temmuz 2026",
    paymentIssue: false,
    purchaseState: "idle",
    usedBenefits: [
      { label: "Plus profil rozeti", value: "Aktif", icon: "crown" },
      { label: "Müşteri hizmetleri", value: "2 görüşme", icon: "headphones" },
      { label: "Performans önerileri", value: "4 öneri", icon: "trend-up" },
    ],
    paywallVariant: "value_first",
    lastEvent: null,
  };
}

function safeParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function readStoredState() {
  if (typeof window === "undefined") return initialState();
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  return parsed ? { ...initialState(), ...parsed } : initialState();
}

function writeStoredState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function eventPayload(state, eventName, extra = {}) {
  return {
    event: eventName,
    currentPlan: state.currentPlanId,
    selectedPlan: state.selectedPlanId,
    billingPeriod: state.billingPeriod,
    subscriptionStatus: state.status,
    paywallVariant: state.paywallVariant,
    sourceRoute: typeof window === "undefined" ? "" : window.location.hash,
    ...extra,
  };
}

export const useSubscriptionStore = defineStore("subscription", {
  state: () => readStoredState(),
  getters: {
    plans: () => subscriptionPlans,
    isFree: (state) => state.status === "free",
    isPaid: (state) => state.status === "active",
    isCanceledButActive: (state) => state.status === "canceled_active",
    hasPaymentIssue: (state) => state.status === "payment_issue",
    currentPlan: (state) => (state.currentPlanId === "free" ? freeSubscriptionPlan : getPlanById(state.currentPlanId)),
    selectedPlan: (state) => getPlanById(state.selectedPlanId),
    recommendedPlan: () => getPlanById(recommendedPlanId),
    selectedPrice() {
      return getPlanPrice(this.selectedPlan, this.billingPeriod);
    },
    selectedMonthlyEquivalent() {
      return getMonthlyEquivalent(this.selectedPlan, this.billingPeriod);
    },
    selectedPriceCopy() {
      const suffix = this.billingPeriod === "annual" ? "yıl" : "ay";
      return `${formatPrice(this.selectedPrice)} TL / ${suffix}`;
    },
    selectedMonthlyCopy() {
      return `${formatPrice(this.selectedMonthlyEquivalent)} TL`;
    },
    renewalCopy(state) {
      return BILLING_PERIODS[state.billingPeriod]?.periodCopy || BILLING_PERIODS.monthly.periodCopy;
    },
  },
  actions: {
    persist() {
      writeStoredState(this.$state);
    },
    applyStatus(status, planId = "plus") {
      const normalized = normalizeSubscriptionStatus(status);
      this.status = normalized;
      this.paymentIssue = normalized === "payment_issue";
      this.cancelAtPeriodEnd = normalized === "canceled_active";
      if (normalized === "free" || normalized === "expired") {
        this.currentPlanId = "free";
      } else {
        this.currentPlanId = planId;
        this.selectedPlanId = planId;
      }
      this.persist();
    },
    selectPlan(planId) {
      this.selectedPlanId = getPlanById(planId).id;
      this.lastEvent = eventPayload(this.$state, "plan_select", { selectedPlan: this.selectedPlanId });
      this.persist();
    },
    selectBillingPeriod(period) {
      this.billingPeriod = BILLING_PERIODS[period] ? period : "monthly";
      this.lastEvent = eventPayload(this.$state, "billing_period_change");
      this.persist();
    },
    async mockPurchase(planId = this.selectedPlanId) {
      this.purchaseState = "pending";
      this.selectPlan(planId);
      this.lastEvent = eventPayload(this.$state, "checkout_start");
      this.persist();
      const result = await subscriptionService.purchase(this.selectedPlanId, this.billingPeriod);
      if (!result.ok) {
        this.purchaseState = "failed";
        this.lastEvent = eventPayload(this.$state, "purchase_cancel");
        this.persist();
        return result;
      }
      this.status = "active";
      this.currentPlanId = this.selectedPlanId;
      this.paymentPlatform = result.provider;
      this.renewalDate = nextRenewalDate();
      this.paymentIssue = false;
      this.cancelAtPeriodEnd = false;
      this.purchaseState = "success";
      this.lastEvent = eventPayload(this.$state, "purchase_success");
      this.persist();
      return result;
    },
    async upgradePlan(planId) {
      this.selectPlan(planId);
      const result = await subscriptionService.upgrade(planId);
      if (result.ok) {
        this.currentPlanId = planId;
        this.status = "active";
        this.lastEvent = eventPayload(this.$state, "upgrade_click");
        this.persist();
      }
      return result;
    },
    async downgradePlan(planId) {
      this.selectPlan(planId);
      const result = await subscriptionService.downgrade(planId);
      if (result.ok) {
        this.currentPlanId = planId;
        this.status = "active";
        this.lastEvent = eventPayload(this.$state, "downgrade_click");
        this.persist();
      }
      return result;
    },
    async reactivateMock() {
      const result = await subscriptionService.reactivate();
      if (result.ok) {
        this.status = "active";
        this.cancelAtPeriodEnd = false;
        if (this.currentPlanId === "free") this.currentPlanId = "plus";
        this.lastEvent = eventPayload(this.$state, "reactivate_click");
        this.persist();
      }
      return result;
    },
    async restorePurchasesMock() {
      this.lastEvent = eventPayload(this.$state, "restore_click");
      const result = await subscriptionService.restorePurchases();
      this.purchaseState = result.restored ? "restored" : "no_purchase_found";
      this.lastEvent = eventPayload(this.$state, result.restored ? "restore_success" : "restore_click", {
        restoreResult: result.message,
      });
      this.persist();
      return result;
    },
    async openManageSubscriptionsMock() {
      const result = await subscriptionService.manageSubscription();
      this.lastEvent = eventPayload(this.$state, "manage_subscription_open");
      this.persist();
      return result;
    },
    async resolvePaymentIssueMock() {
      const result = await subscriptionService.resolvePaymentIssue();
      if (result.ok) {
        this.status = "active";
        this.paymentIssue = false;
        this.lastEvent = eventPayload(this.$state, "payment_issue_fix_click");
        this.persist();
      }
      return result;
    },
    resetSubscriptionDemo() {
      this.$patch(initialState());
      this.persist();
    },
  },
});

export { STORAGE_KEY as SUBSCRIPTION_STORAGE_KEY };
