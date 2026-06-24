<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppPage from "../components/ui/AppPage.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import BonusBalanceCard from "../components/wallet/BonusBalanceCard.vue";
import WalletInfoSheet from "../components/wallet/WalletInfoSheet.vue";
import WalletQuickSettings from "../components/wallet/WalletQuickSettings.vue";
import WalletStatusBanner from "../components/wallet/WalletStatusBanner.vue";
import WalletTransactionList from "../components/wallet/WalletTransactionList.vue";
import WorkBalanceCard from "../components/wallet/WorkBalanceCard.vue";
import { useWalletStore } from "../stores/walletStore.js";

const wallet = useWalletStore();
const route = useRoute();
const router = useRouter();

const walletStatus = computed(() => {
  if (wallet.isZeroBalance) return "zero";
  if (wallet.isLowBalance) return "low";
  return "normal";
});

function openTopUp(useBonus = true) {
  wallet.toggleBonusUsage(useBonus);
  router.push("/wallet/top-up");
}

function openTransaction(transaction) {
  router.push(`/wallet/transaction/${transaction.id}`);
}

onMounted(() => {
  if (route.query.walletState) wallet.applyPreset(String(route.query.walletState));
});
</script>

<template>
  <AppPage title="Cüzdanım" data-testid="wallet-page">
    <section class="wallet-page">
      <WalletStatusBanner :status="walletStatus" :job-label="wallet.estimatedJobLabel" />

      <WorkBalanceCard
        :balance="wallet.workBalance"
        :job-label="wallet.estimatedJobLabel"
        :has-bonus="wallet.bonusBalance > 0"
        @top-up="openTopUp(true)"
        @plain-top-up="openTopUp(false)"
      />

      <BonusBalanceCard
        :balance="wallet.bonusBalance"
        :max-bonus="wallet.maxApplicableBonus"
        :savings="wallet.bonusSavingsThisMonth"
        @rules="wallet.$patch({ topUpState: 'info' })"
      />

      <WalletQuickSettings
        :alert-enabled="wallet.lowBalanceAlertEnabled"
        :threshold="wallet.lowBalanceThreshold"
        :auto-top-up-enabled="wallet.autoTopUpEnabled"
        :auto-top-up-amount="wallet.autoTopUpAmount"
      />

      <WalletTransactionList
        :transactions="wallet.recentTransactions"
        @open="openTransaction"
        @all="router.push('/wallet/history')"
      />

      <AppCard class="wallet-actions-card" padding="md">
        <AppButton full-width variant="secondary" icon="settings" @click="router.push('/wallet/settings')">
          Cüzdan Ayarları
        </AppButton>
      </AppCard>
    </section>

    <AppSheet
      :open="wallet.topUpState === 'info'"
      title="Cüzdan nasıl çalışır?"
      description="İş bakiyesi ve bonus bakiyesi ayrı takip edilir."
      @close="wallet.$patch({ topUpState: 'idle' })"
    >
      <WalletInfoSheet />
    </AppSheet>
  </AppPage>
</template>
