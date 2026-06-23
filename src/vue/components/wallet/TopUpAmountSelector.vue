<script setup>
import { formatCurrency } from "../../data/walletCalculations.js";
import { walletRules } from "../../data/walletRules.js";

defineProps({
  selectedAmount: { type: [Number, String], default: walletRules.defaultTopUpAmount },
  customAmount: { type: [Number, String], default: "" },
});

const emit = defineEmits(["select", "custom"]);
</script>

<template>
  <section class="wallet-amount-selector" data-testid="wallet-amount-selector">
    <div class="wallet-section-head">
      <h2>Tutar seç</h2>
      <span>Önerilen: {{ formatCurrency(walletRules.defaultTopUpAmount) }}</span>
    </div>
    <div class="wallet-amount-selector__grid" role="radiogroup" aria-label="Bakiye yükleme tutarı">
      <button
        v-for="amount in walletRules.defaultTopUpAmounts"
        :key="amount"
        :class="{ 'is-selected': selectedAmount === amount }"
        type="button"
        role="radio"
        :aria-checked="selectedAmount === amount ? 'true' : 'false'"
        data-testid="wallet-top-up-amount"
        @click="emit('select', amount)"
      >
        <strong>{{ formatCurrency(amount) }}</strong>
        <small v-if="amount === walletRules.defaultTopUpAmount">Önerilen</small>
      </button>
      <label :class="['wallet-custom-amount', { 'is-selected': selectedAmount === 'custom' }]">
        <span>Diğer</span>
        <input
          :value="customAmount"
          inputmode="numeric"
          aria-label="Diğer yükleme tutarı"
          placeholder="Tutar"
          data-testid="wallet-custom-amount"
          @input="emit('custom', $event.target.value)"
        />
      </label>
    </div>
  </section>
</template>

