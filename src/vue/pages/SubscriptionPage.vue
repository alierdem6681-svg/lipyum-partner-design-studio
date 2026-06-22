<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { SUBSCRIPTION_QUERY_STATE_MAP, SUBSCRIPTION_STATUSES } from "../data/subscriptionPlans.js";
import ActiveSubscriptionView from "../components/subscription/ActiveSubscriptionView.vue";
import CanceledSubscriptionView from "../components/subscription/CanceledSubscriptionView.vue";
import ExpiredSubscriptionView from "../components/subscription/ExpiredSubscriptionView.vue";
import FreeSubscriptionView from "../components/subscription/FreeSubscriptionView.vue";
import PaymentIssueSubscriptionView from "../components/subscription/PaymentIssueSubscriptionView.vue";
import TrialSubscriptionView from "../components/subscription/TrialSubscriptionView.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

const route = useRoute();
const shell = useAppShellStore();
const subscription = useSubscriptionStore();
const showComparison = ref(false);

const stateComponent = computed(() => {
  if (subscription.isTrial) return TrialSubscriptionView;
  if (subscription.isPaid) return ActiveSubscriptionView;
  if (subscription.isCanceledButActive) return CanceledSubscriptionView;
  if (subscription.hasPaymentIssue) return PaymentIssueSubscriptionView;
  if (subscription.isExpired) return ExpiredSubscriptionView;
  return FreeSubscriptionView;
});

function applyQueryState() {
  const queryState = SUBSCRIPTION_QUERY_STATE_MAP[String(route.query.subscriptionState || "")];
  if (queryState) subscription.applyDemoState(queryState);
}

function openComparison() {
  showComparison.value = true;
  subscription.track("plan_compare_open");
}

function closeComparison() {
  showComparison.value = false;
}

function selectPlan(planId) {
  subscription.selectPlan(planId);
}

function selectBillingPeriod(period) {
  subscription.selectBillingPeriod(period);
}

async function purchase(planId) {
  if (planId === "plus" && subscription.canStartTrial) {
    subscription.startTrial(planId);
    shell.showToast("30 günlük Plus denemen başladı.");
    return;
  }
  await subscription.mockPurchase(planId);
  shell.showToast(`${subscription.currentPlan.title} planı aktif.`);
}

async function manageSubscription() {
  await subscription.openManageSubscriptionsMock();
  shell.showToast("Abonelik yönetimi mock olarak açıldı.");
}

async function restorePurchases() {
  await subscription.restorePurchasesMock();
  shell.showToast("Satın alımlar kontrol edildi.");
}

async function reactivate() {
  await subscription.reactivateMock();
  shell.showToast("Abonelik yeniden etkinleştirildi.");
}

async function resolvePaymentIssue() {
  await subscription.resolvePaymentIssueMock();
  shell.showToast("Ödeme yöntemi güncellendi.");
}

onMounted(() => {
  applyQueryState();
  subscription.track("subscription_page_view");
});

watch(
  () => route.query.subscriptionState,
  () => applyQueryState(),
);
</script>

<template>
  <AppPage title="Aboneliğim" class="subscription-page subscription-v2-page" data-testid="subscription-page">
    <component
      :is="stateComponent"
      :store="subscription"
      :show-comparison="showComparison"
      @compare="openComparison"
      @close-compare="closeComparison"
      @select-plan="selectPlan"
      @billing-period="selectBillingPeriod"
      @purchase="purchase"
      @manage="manageSubscription"
      @restore="restorePurchases"
      @reactivate="reactivate"
      @resolve="resolvePaymentIssue"
    />
  </AppPage>
</template>
