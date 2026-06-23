<script setup>
import AppIcon from "../ui/AppIcon.vue";
import { formatCurrency } from "../../data/walletCalculations.js";

defineProps({
  alertEnabled: { type: Boolean, default: false },
  threshold: { type: Number, default: 0 },
  autoTopUpEnabled: { type: Boolean, default: false },
  autoTopUpAmount: { type: Number, default: 0 },
});
</script>

<template>
  <section class="wallet-quick-settings" data-testid="wallet-quick-settings">
    <div>
      <span class="wallet-soft-icon"><AppIcon name="bell" :size="18" /></span>
      <span>
        <strong>Düşük bakiye uyarısı</strong>
        <small>{{ alertEnabled ? `${formatCurrency(threshold)} altında bildirim gönder` : "Kapalı" }}</small>
      </span>
    </div>
    <div>
      <span class="wallet-soft-icon"><AppIcon name="refresh" :size="18" /></span>
      <span>
        <strong>Otomatik yükleme</strong>
        <small>{{ autoTopUpEnabled ? `${formatCurrency(autoTopUpAmount)} otomatik yüklenir` : "Kapalı" }}</small>
      </span>
    </div>
  </section>
</template>

