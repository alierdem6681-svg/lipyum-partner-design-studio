<script setup>
import AppPage from "../components/ui/AppPage.vue";
import AppButton from "../components/ui/AppButton.vue";
import AutoTopUpCard from "../components/wallet/AutoTopUpCard.vue";
import BonusExpiryCard from "../components/wallet/BonusExpiryCard.vue";
import BonusRulesCard from "../components/wallet/BonusRulesCard.vue";
import LowBalanceAlertCard from "../components/wallet/LowBalanceAlertCard.vue";
import WalletPaymentMethodCard from "../components/wallet/WalletPaymentMethodCard.vue";
import { useWalletStore } from "../stores/walletStore.js";

const wallet = useWalletStore();
</script>

<template>
  <AppPage title="Cüzdan Ayarları" data-testid="wallet-settings-page">
    <section class="wallet-page">
      <LowBalanceAlertCard
        :enabled="wallet.lowBalanceAlertEnabled"
        :threshold="wallet.lowBalanceThreshold"
        @toggle="wallet.setLowBalanceAlert(!wallet.lowBalanceAlertEnabled)"
        @threshold="wallet.setLowBalanceAlert(wallet.lowBalanceAlertEnabled, $event)"
      />

      <AutoTopUpCard
        :enabled="wallet.autoTopUpEnabled"
        :threshold="wallet.autoTopUpThreshold"
        :amount="wallet.autoTopUpAmount"
        :monthly-limit="wallet.autoTopUpMonthlyLimit"
        @toggle="wallet.configureAutoTopUp({
          enabled: !wallet.autoTopUpEnabled,
          threshold: wallet.autoTopUpThreshold,
          amount: wallet.autoTopUpAmount,
          monthlyLimit: wallet.autoTopUpMonthlyLimit
        })"
      />

      <WalletPaymentMethodCard :method="wallet.paymentMethod" />
      <BonusExpiryCard :bonuses="wallet.expiringBonuses" :pending-bonus="wallet.pendingBonus" />
      <BonusRulesCard />

      <section class="wallet-settings-links">
        <AppButton full-width variant="secondary" icon="receipt">Makbuzlar</AppButton>
        <AppButton full-width variant="secondary" icon="shield">Ödeme güvenliği</AppButton>
        <AppButton full-width variant="secondary" icon="message">Sorun bildir</AppButton>
      </section>
    </section>
  </AppPage>
</template>

