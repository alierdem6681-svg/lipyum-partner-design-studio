<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { formatCurrency } from "../../data/walletCalculations.js";

defineProps({
  bonusBalance: { type: Number, required: true },
  maxBonus: { type: Number, required: true },
  useBonus: { type: Boolean, default: true },
});

defineEmits(["toggle"]);
</script>

<template>
  <section class="wallet-bonus-usage-card" data-testid="wallet-bonus-usage-card">
    <div class="wallet-card-title-row">
      <span class="wallet-soft-icon is-warning"><AppIcon name="gift" :size="20" /></span>
      <span>
        <strong>{{ formatCurrency(bonusBalance) }} bonusun var</strong>
        <small>Bu yüklemede en fazla {{ formatCurrency(maxBonus) }} kullanabilirsin.</small>
      </span>
    </div>
    <button
      :class="['wallet-toggle-row', { 'is-on': useBonus }]"
      type="button"
      role="switch"
      :aria-checked="useBonus ? 'true' : 'false'"
      data-testid="wallet-bonus-toggle"
      @click="$emit('toggle')"
    >
      <span>Bu yüklemede bonusumu kullan</span>
      <em aria-hidden="true"></em>
    </button>
  </section>
</template>

