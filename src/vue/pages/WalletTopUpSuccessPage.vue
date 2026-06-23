<script setup>
import { useRouter } from "vue-router";
import AppPage from "../components/ui/AppPage.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import { formatCurrency, formatEstimatedJobRange } from "../data/walletCalculations.js";
import { walletRules } from "../data/walletRules.js";
import { useWalletStore } from "../stores/walletStore.js";

const wallet = useWalletStore();
const router = useRouter();
const result = wallet.lastTopUpResult || wallet.topUpSummary;
</script>

<template>
  <AppPage title="Bakiye yüklendi" data-testid="wallet-top-up-success-page">
    <section class="wallet-success-page">
      <div class="wallet-success-page__icon" aria-hidden="true">
        <AppIcon name="check" :size="42" />
      </div>
      <h1>Bakiye yüklendi</h1>
      <dl class="wallet-success-summary">
        <div>
          <dt>Cüzdanına eklenen</dt>
          <dd>{{ formatCurrency(result.topUpAmount) }}</dd>
        </div>
        <div>
          <dt>Kartından çekilen</dt>
          <dd>{{ formatCurrency(result.payableAmount) }}</dd>
        </div>
        <div>
          <dt>Kullanılan bonus</dt>
          <dd>{{ formatCurrency(result.appliedBonus) }}</dd>
        </div>
        <div>
          <dt>Yeni iş bakiyesi</dt>
          <dd>{{ formatCurrency(wallet.workBalance) }}</dd>
        </div>
        <div>
          <dt>Kalan bonus</dt>
          <dd>{{ formatCurrency(wallet.bonusBalance) }}</dd>
        </div>
      </dl>
      <p>Yaklaşık {{ formatEstimatedJobRange(wallet.workBalance, walletRules.averageJobAcquisitionCost) }} alabilirsin.</p>
      <AppButton full-width size="lg" icon="briefcase" @click="router.push('/jobs')">İŞ AL</AppButton>
      <AppButton full-width variant="secondary" @click="router.push('/wallet')">Cüzdana dön</AppButton>
    </section>
  </AppPage>
</template>

