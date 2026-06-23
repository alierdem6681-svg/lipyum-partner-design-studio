function delay(result) {
  return new Promise((resolve) => {
    globalThis.setTimeout(() => resolve(result), 120);
  });
}

export const subscriptionService = {
  purchase(planId, billingPeriod) {
    return delay({ ok: true, planId, billingPeriod, provider: "App Store" });
  },
  restorePurchases() {
    return delay({ ok: true, restored: false, message: "Geri yüklenecek satın alma bulunamadı." });
  },
  manageSubscription() {
    return delay({ ok: true, provider: "App Store" });
  },
  upgrade(planId) {
    return delay({ ok: true, planId, changeType: "upgrade" });
  },
  downgrade(planId) {
    return delay({ ok: true, planId, changeType: "downgrade" });
  },
  reactivate() {
    return delay({ ok: true });
  },
  resolvePaymentIssue() {
    return delay({ ok: true });
  },
};
