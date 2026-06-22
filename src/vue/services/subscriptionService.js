const wait = (payload) => Promise.resolve({ ok: true, ...payload });

export const subscriptionAnalyticsEvents = [];

export function trackSubscriptionEvent(name, payload = {}) {
  const event = {
    name,
    payload,
    createdAt: new Date().toISOString(),
  };
  subscriptionAnalyticsEvents.push(event);
  return event;
}

export const subscriptionService = {
  purchase({ planId, billingPeriod }) {
    return wait({ action: "purchase", planId, billingPeriod });
  },
  restorePurchases() {
    return wait({ action: "restorePurchases" });
  },
  manageSubscriptions() {
    return wait({ action: "manageSubscriptions" });
  },
  upgrade({ planId }) {
    return wait({ action: "upgrade", planId });
  },
  downgrade({ planId }) {
    return wait({ action: "downgrade", planId });
  },
  reactivate({ planId }) {
    return wait({ action: "reactivate", planId });
  },
  resolvePaymentIssue({ planId }) {
    return wait({ action: "resolvePaymentIssue", planId });
  },
};
