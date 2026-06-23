<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppPage from "../components/ui/AppPage.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import { formatCurrency } from "../data/walletCalculations.js";
import { useWalletStore } from "../stores/walletStore.js";

const wallet = useWalletStore();
const route = useRoute();
const transaction = computed(() => wallet.transactions.find((item) => item.id === route.params.id) || wallet.transactions[0]);

function formatDate(value) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
</script>

<template>
  <AppPage title="İşlem Detayı" data-testid="wallet-transaction-detail-page">
    <section class="wallet-detail-page" v-if="transaction">
      <div class="wallet-detail-hero">
        <span class="wallet-soft-icon" aria-hidden="true"><AppIcon name="receipt" :size="22" /></span>
        <span>
          <small>{{ transaction.status === "failed" ? "Başarısız" : transaction.status === "pending" ? "Bekliyor" : "Tamamlandı" }}</small>
          <strong>{{ transaction.title }}</strong>
        </span>
      </div>
      <dl class="wallet-detail-list">
        <div>
          <dt>Tarih ve saat</dt>
          <dd>{{ formatDate(transaction.createdAt) }}</dd>
        </div>
        <div>
          <dt>İşlem numarası</dt>
          <dd>{{ transaction.id }}</dd>
        </div>
        <div>
          <dt>Referans</dt>
          <dd>{{ transaction.referenceId }}</dd>
        </div>
        <div>
          <dt>İşlem öncesi bakiye</dt>
          <dd>{{ formatCurrency(transaction.balanceBefore) }}</dd>
        </div>
        <div>
          <dt>İşlem tutarı</dt>
          <dd>{{ transaction.amount ? formatCurrency(transaction.amount) : "-" }}</dd>
        </div>
        <div>
          <dt>Kullanılan bonus</dt>
          <dd>{{ transaction.bonusAmount ? formatCurrency(transaction.bonusAmount) : "-" }}</dd>
        </div>
        <div>
          <dt>İşlem sonrası bakiye</dt>
          <dd>{{ formatCurrency(transaction.balanceAfter) }}</dd>
        </div>
        <div>
          <dt>Ödeme yöntemi</dt>
          <dd>{{ transaction.paymentMethod || "-" }}</dd>
        </div>
        <div v-if="transaction.receiptId">
          <dt>Makbuz</dt>
          <dd>{{ transaction.receiptId }}</dd>
        </div>
        <div v-if="transaction.failureReason" role="alert">
          <dt>Hata nedeni</dt>
          <dd>{{ transaction.failureReason }}</dd>
        </div>
      </dl>
      <AppButton
        v-if="transaction.status === 'failed'"
        full-width
        icon="refresh"
        @click="wallet.retryFailedTopUp(transaction.id)"
      >
        Tekrar Dene
      </AppButton>
      <AppButton full-width variant="secondary" icon="message">Sorun bildir</AppButton>
    </section>
  </AppPage>
</template>

