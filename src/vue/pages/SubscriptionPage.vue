<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import AppPage from "../components/ui/AppPage.vue";
import ActiveSubscriptionView from "../components/subscription/ActiveSubscriptionView.vue";
import CanceledSubscriptionView from "../components/subscription/CanceledSubscriptionView.vue";
import ExpiredSubscriptionView from "../components/subscription/ExpiredSubscriptionView.vue";
import FreeSubscriptionView from "../components/subscription/FreeSubscriptionView.vue";
import PaymentIssueSubscriptionView from "../components/subscription/PaymentIssueSubscriptionView.vue";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";
import { normalizeSubscriptionStatus } from "../data/subscriptionPlans.js";

const route = useRoute();
const store = useSubscriptionStore();

function applyQuery() {
  const status = normalizeSubscriptionStatus(route.query.subscriptionState);
  const plan = typeof route.query.plan === "string" ? route.query.plan : undefined;
  const billing = route.query.billing === "annual" ? "annual" : "monthly";

  if (route.query.subscriptionState) store.applyStatus(status, plan || "gold");
  if (plan) store.selectPlan(plan);
  else if (store.status === "free") store.selectPlan("gold");
  store.selectBillingPeriod(billing);
}

onMounted(() => {
  applyQuery();
  store.lastEvent = {
    event: "subscription_page_view",
    subscriptionStatus: store.status,
    selectedPlan: store.selectedPlanId,
    billingPeriod: store.billingPeriod,
    paywallVariant: store.paywallVariant,
  };
});

watch(() => route.query, applyQuery);
</script>

<template>
  <AppPage title="Abonelik" class="subscription-page" data-testid="subscription-page">
    <FreeSubscriptionView v-if="store.status === 'free'" :store="store" />
    <ActiveSubscriptionView v-else-if="store.status === 'active'" :store="store" />
    <CanceledSubscriptionView v-else-if="store.status === 'canceled_active'" :store="store" />
    <PaymentIssueSubscriptionView
      v-else-if="store.status === 'payment_issue'"
      :store="store"
      @resolve="store.resolvePaymentIssueMock"
    />
    <ExpiredSubscriptionView v-else :store="store" />
  </AppPage>
</template>
