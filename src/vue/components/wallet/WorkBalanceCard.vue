<script setup>
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";
import { formatCurrency } from "../../data/walletCalculations.js";

defineProps({
  balance: { type: Number, required: true },
  jobLabel: { type: String, required: true },
  hasBonus: { type: Boolean, default: false },
});

defineEmits(["top-up", "plain-top-up"]);
</script>

<template>
  <section class="wallet-work-card" data-testid="wallet-work-balance-card" aria-label="İş Bakiyesi">
    <div class="wallet-work-card__top">
      <span>
        <small>İŞ BAKİYESİ</small>
        <strong :aria-label="`${balance} Türk lirası`">{{ formatCurrency(balance) }}</strong>
      </span>
      <span class="wallet-work-card__icon" aria-hidden="true">
        <AppIcon name="wallet" :size="30" />
      </span>
    </div>
    <p>Bu bakiye ile {{ jobLabel }} alabilirsin.</p>
    <AppButton full-width size="lg" icon="plus" data-testid="wallet-top-up-button" @click="$emit('top-up')">
      {{ hasBonus ? "BONUSLA BAKİYE YÜKLE" : "BAKİYE YÜKLE" }}
    </AppButton>
    <button class="wallet-inline-link" type="button" data-testid="wallet-plain-top-up-button" @click="$emit('plain-top-up')">
      Bonus kullanmadan yükle
    </button>
  </section>
</template>

