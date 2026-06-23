<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { formatCurrency } from "../../data/walletCalculations.js";

defineProps({
  balance: { type: Number, required: true },
  maxBonus: { type: Number, required: true },
  savings: { type: Number, required: true },
});

defineEmits(["rules"]);
</script>

<template>
  <section class="wallet-bonus-card" data-testid="wallet-bonus-balance-card" aria-label="Bonus Bakiyesi">
    <div class="wallet-card-title-row">
      <span class="wallet-soft-icon is-warning" aria-hidden="true"><AppIcon name="gift" :size="20" /></span>
      <span>
        <small>BONUS BAKİYESİ</small>
        <strong :aria-label="`${balance} Türk lirası bonus`">{{ formatCurrency(balance) }}</strong>
      </span>
    </div>
    <p>Bakiye yüklerken indirim olarak kullanabilirsin.</p>
    <div class="wallet-bonus-card__note">
      <span>Bir sonraki yüklemede</span>
      <strong>en fazla {{ formatCurrency(maxBonus) }} bonus kullanabilirsin</strong>
    </div>
    <div class="wallet-bonus-card__footer">
      <button type="button" @click="$emit('rules')">Bonus kuralları</button>
      <span>Bu ay bonusla {{ formatCurrency(savings) }} tasarruf ettin</span>
    </div>
  </section>
</template>

