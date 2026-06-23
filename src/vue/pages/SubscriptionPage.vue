<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SUBSCRIPTION_QUERY_STATE_MAP } from "../data/subscriptionPlans.js";
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
const router = useRouter();
const shell = useAppShellStore();
const subscription = useSubscriptionStore();

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
  subscription.track("plan_compare_open");
  router.push("/subscription/compare");
}

function selectPlan(planId) {
  subscription.selectPlan(planId);
}

function selectBillingPeriod(period) {
  subscription.selectBillingPeriod(period);
}

async function purchase(planId) {
  const isManagingPaidPlan = subscription.isPaid || subscription.isCanceledButActive || subscription.hasPaymentIssue;
  if (isManagingPaidPlan) {
    const selectedOrder = subscription.selectedPlan.sortOrder || 0;
    const currentOrder = subscription.currentPlan.sortOrder || 0;
    if (selectedOrder > currentOrder) {
      await subscription.upgradePlan(planId);
    } else if (selectedOrder < currentOrder) {
      await subscription.downgradePlan(planId);
    }
    shell.showToast(`Lipyum ${subscription.currentPlan.title} planı seçildi.`);
    return;
  }

  if (subscription.canStartTrial) {
    subscription.startTrial(planId);
    shell.showToast("30 günlük deneme başladı.");
    return;
  }

  await subscription.mockPurchase(planId);
  shell.showToast(`Lipyum ${subscription.currentPlan.title} aktif.`);
}

async function manageSubscription() {
  await subscription.openManageSubscriptionsMock();
  shell.showToast("Abonelik yönetimi açıldı.");
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
      @compare="openComparison"
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
