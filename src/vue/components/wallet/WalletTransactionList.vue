<script setup>
import WalletTransactionRow from "./WalletTransactionRow.vue";

defineProps({
  transactions: { type: Array, default: () => [] },
  title: { type: String, default: "Son İşlemler" },
  showAll: { type: Boolean, default: true },
});

defineEmits(["open", "all"]);
</script>

<template>
  <section class="wallet-transaction-list" data-testid="wallet-transaction-list">
    <div class="wallet-section-head">
      <h2>{{ title }}</h2>
      <button v-if="showAll" type="button" @click="$emit('all')">Tümünü gör</button>
    </div>
    <div class="wallet-transaction-list__items">
      <WalletTransactionRow
        v-for="transaction in transactions"
        :key="transaction.id"
        :transaction="transaction"
        @open="$emit('open', $event)"
      />
    </div>
  </section>
</template>

