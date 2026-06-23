<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import AppPage from "../components/ui/AppPage.vue";
import AppButton from "../components/ui/AppButton.vue";
import BonusUsageCard from "../components/wallet/BonusUsageCard.vue";
import TopUpAmountSelector from "../components/wallet/TopUpAmountSelector.vue";
import WalletPaymentMethodCard from "../components/wallet/WalletPaymentMethodCard.vue";
import WalletPaymentSummary from "../components/wallet/WalletPaymentSummary.vue";
import WalletTopUpStickyCTA from "../components/wallet/WalletTopUpStickyCTA.vue";
import { formatCurrency } from "../data/walletCalculations.js";
import { useWalletStore } from "../stores/walletStore.js";

const wallet = useWalletStore();
const router = useRouter();

const loading = computed(() => wallet.topUpState === "processing");

async function submitTopUp() {
  const transaction = await wallet.mockTopUp();
  if (transaction) router.push("/wallet/top-up/success");
}
</script>

<template>
  <AppPage title="Bakiye Yükle" data-testid="wallet-top-up-page">
    <section class="wallet-page wallet-page--topup">
      <TopUpAmountSelector
        :selected-amount="wallet.selectedTopUpAmount"
        :custom-amount="wallet.customTopUpAmount"
        @select="wallet.selectTopUpAmount"
        @custom="wallet.setCustomTopUpAmount"
      />

      <BonusUsageCard
        v-if="wallet.bonusBalance > 0"
        :bonus-balance="wallet.bonusBalance"
        :max-bonus="wallet.maxApplicableBonus"
        :use-bonus="wallet.useBonus"
        @toggle="wallet.toggleBonusUsage()"
      />

      <WalletPaymentSummary
        :top-up-amount="wallet.topUpSummary.topUpAmount"
        :applied-bonus="wallet.appliedBonus"
        :payable-amount="wallet.payableAmount"
      />

      <WalletPaymentMethodCard :method="wallet.paymentMethod" />

      <section class="wallet-repeat-topup" data-testid="wallet-repeat-topup">
        <span>
          <strong>Son yüklemeni tekrarla</strong>
          <small>Son yükleme: {{ formatCurrency(wallet.lastTopUpAmount) }}</small>
        </span>
        <AppButton variant="secondary" size="sm" @click="wallet.selectTopUpAmount(wallet.lastTopUpAmount)">
          Seç
        </AppButton>
      </section>
    </section>

    <WalletTopUpStickyCTA
      :payable-amount="wallet.payableAmount"
      :top-up-amount="wallet.topUpSummary.topUpAmount"
      :loading="loading"
      @submit="submitTopUp"
    />
  </AppPage>
</template>

