<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { formatCurrency } from "../../data/walletCalculations.js";

defineProps({
  payableAmount: { type: Number, required: true },
  topUpAmount: { type: Number, required: true },
  loading: { type: Boolean, default: false },
});

defineEmits(["submit"]);
</script>

<template>
  <div class="wallet-sticky-cta" data-testid="wallet-top-up-sticky">
    <button type="button" :disabled="loading" data-testid="wallet-top-up-submit" @click="$emit('submit')">
      <span><AppIcon name="shield" :size="16" /> {{ formatCurrency(payableAmount) }} ÖDE</span>
      <strong>{{ formatCurrency(topUpAmount) }} BAKİYE YÜKLE</strong>
    </button>
  </div>
</template>

