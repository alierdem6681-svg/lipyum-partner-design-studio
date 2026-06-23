<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { formatCurrency } from "../../data/walletCalculations.js";

defineProps({
  enabled: { type: Boolean, default: false },
  threshold: { type: Number, default: 150 },
  amount: { type: Number, default: 500 },
  monthlyLimit: { type: Number, default: 2500 },
});

defineEmits(["toggle", "configure"]);
</script>

<template>
  <section class="wallet-settings-card" data-testid="wallet-auto-top-up">
    <div class="wallet-card-title-row">
      <span class="wallet-soft-icon"><AppIcon name="refresh" :size="20" /></span>
      <span>
        <strong>Otomatik Yükleme</strong>
        <small>Bakiye {{ formatCurrency(threshold) }} altına düştüğünde {{ formatCurrency(amount) }} yükle.</small>
      </span>
    </div>
    <button
      :class="['wallet-toggle-row', { 'is-on': enabled }]"
      type="button"
      role="switch"
      :aria-checked="enabled ? 'true' : 'false'"
      @click="$emit('toggle')"
    >
      <span>{{ enabled ? "Açık" : "Kapalı" }}</span>
      <em aria-hidden="true"></em>
    </button>
    <div class="wallet-settings-card__meta">
      <span>Aylık maksimum</span>
      <strong>{{ formatCurrency(monthlyLimit) }}</strong>
    </div>
  </section>
</template>

