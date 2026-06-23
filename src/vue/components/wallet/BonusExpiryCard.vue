<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { formatCurrency } from "../../data/walletCalculations.js";

defineProps({
  bonuses: { type: Array, default: () => [] },
  pendingBonus: { type: Number, default: 0 },
});

function formatDate(value) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long" }).format(new Date(value));
}
</script>

<template>
  <section class="wallet-settings-card" data-testid="wallet-bonus-expiry-card">
    <div class="wallet-card-title-row">
      <span class="wallet-soft-icon is-warning"><AppIcon name="gift" :size="20" /></span>
      <span>
        <strong>Bonuslarım</strong>
        <small>Yakında sona erecek bonusları ve bekleyen iadeleri takip et.</small>
      </span>
    </div>
    <div class="wallet-bonus-expiry-list">
      <article v-for="bonus in bonuses" :key="bonus.id">
        <span>{{ bonus.source }}</span>
        <strong>{{ formatCurrency(bonus.amount) }} · {{ formatDate(bonus.expiresAt) }}</strong>
      </article>
      <article v-if="pendingBonus" class="is-pending">
        <span>Bekleyen bonus</span>
        <strong>{{ formatCurrency(pendingBonus) }} bonus iadesi inceleniyor</strong>
      </article>
    </div>
  </section>
</template>

