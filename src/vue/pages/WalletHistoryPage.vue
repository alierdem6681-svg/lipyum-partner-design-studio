<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppPage from "../components/ui/AppPage.vue";
import WalletTransactionList from "../components/wallet/WalletTransactionList.vue";
import { formatCurrency } from "../data/walletCalculations.js";
import { useWalletStore } from "../stores/walletStore.js";

const wallet = useWalletStore();
const router = useRouter();
const activeFilter = ref("all");

const filters = [
  { id: "all", label: "Tümü" },
  { id: "top_up", label: "Yüklemeler" },
  { id: "job_purchase", label: "İş Alımları" },
  { id: "bonus", label: "Bonuslar" },
  { id: "refund", label: "İadeler" },
];

const filteredTransactions = computed(() => {
  if (activeFilter.value === "all") return wallet.sortedTransactions;
  if (activeFilter.value === "bonus") return wallet.sortedTransactions.filter((item) => item.type.includes("bonus"));
  if (activeFilter.value === "refund") return wallet.sortedTransactions.filter((item) => item.type === "bonus_refund");
  return wallet.sortedTransactions.filter((item) => item.type === activeFilter.value);
});

function openTransaction(transaction) {
  router.push(`/wallet/transaction/${transaction.id}`);
}
</script>

<template>
  <AppPage title="Cüzdan Hareketleri" data-testid="wallet-history-page">
    <section class="wallet-page">
      <section class="wallet-history-summary">
        <span>
          <small>Yüklenen</small>
          <strong>{{ formatCurrency(500) }}</strong>
        </span>
        <span>
          <small>Harcanan</small>
          <strong>{{ formatCurrency(85) }}</strong>
        </span>
        <span>
          <small>Bonus</small>
          <strong>{{ formatCurrency(wallet.bonusBalance) }}</strong>
        </span>
      </section>

      <div class="wallet-filter-row" role="tablist" aria-label="Cüzdan hareketleri filtreleri">
        <button
          v-for="filter in filters"
          :key="filter.id"
          :class="{ 'is-active': activeFilter === filter.id }"
          type="button"
          role="tab"
          :aria-selected="activeFilter === filter.id ? 'true' : 'false'"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>

      <WalletTransactionList
        :transactions="filteredTransactions"
        title="Hareketler"
        :show-all="false"
        @open="openTransaction"
      />

      <section class="wallet-history-note">
        <strong>Bonus iadesi nakit iadesi değildir.</strong>
        <span>Bonuslar yalnız bakiye yüklemede indirim olarak kullanılır.</span>
      </section>
    </section>
  </AppPage>
</template>

