<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { formatCurrency } from "../../data/walletCalculations.js";

defineProps({
  enabled: { type: Boolean, default: true },
  threshold: { type: Number, default: 150 },
});

defineEmits(["toggle", "threshold"]);
</script>

<template>
  <section class="wallet-settings-card" data-testid="wallet-low-balance-alert">
    <div class="wallet-card-title-row">
      <span class="wallet-soft-icon"><AppIcon name="bell" :size="20" /></span>
      <span>
        <strong>Düşük Bakiye Uyarısı</strong>
        <small>Bakiyem belirlediğim tutarın altına düşünce bildirim gönder.</small>
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
    <div class="wallet-chip-row" role="radiogroup" aria-label="Uyarı eşiği">
      <button
        v-for="amount in [100, 150, 250]"
        :key="amount"
        :class="{ 'is-selected': threshold === amount }"
        type="button"
        @click="$emit('threshold', amount)"
      >
        {{ formatCurrency(amount) }}
      </button>
    </div>
  </section>
</template>

