<script setup>
import { formatCurrency } from "../../data/walletCalculations.js";

defineProps({
  topUpAmount: { type: Number, required: true },
  appliedBonus: { type: Number, required: true },
  payableAmount: { type: Number, required: true },
});
</script>

<template>
  <section class="wallet-payment-summary" data-testid="wallet-payment-summary">
    <h2>Ödeme Özeti</h2>
    <dl>
      <div>
        <dt>Cüzdanına eklenecek</dt>
        <dd>{{ formatCurrency(topUpAmount) }}</dd>
      </div>
      <div>
        <dt>Kullanılan bonus</dt>
        <dd>-{{ formatCurrency(appliedBonus) }}</dd>
      </div>
      <div class="is-total">
        <dt>Kartından çekilecek</dt>
        <dd>{{ formatCurrency(payableAmount) }}</dd>
      </div>
    </dl>
    <p v-if="appliedBonus">{{ formatCurrency(appliedBonus) }} bonus avantajı kullandın</p>
  </section>
</template>

