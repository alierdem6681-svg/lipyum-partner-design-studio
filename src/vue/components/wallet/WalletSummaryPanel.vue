<script setup>
import AppCard from "../ui/AppCard.vue";
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  testId: { type: String, default: "wallet-summary-card" },
  bonusTestId: { type: String, default: "wallet-bonus-card" },
});

const emit = defineEmits(["wallet-info", "bonus-info", "credit", "convert"]);
</script>

<template>
  <AppCard padding="none" class="wallet-summary-card" :data-testid="testId">
    <div class="wallet-summary">
      <div class="wallet-tile credit">
        <div class="wallet-tile-head">
          <span>Cüzdan</span>
        </div>
        <button
          class="wallet-tile-icon"
          type="button"
          data-open="wallet-info"
          data-action="wallet-info"
          aria-label="Cüzdan bilgisi"
          @click="emit('wallet-info')"
        >
          <AppIcon name="help-circle" :size="17" class-name="icon" />
        </button>
        <span class="wallet-amount"><strong>675</strong><small>kredi</small></span>
        <span class="wallet-subline">≈ 2-3 iş alabilirsin</span>
        <div class="wallet-actions">
          <button class="wallet-action-pill" type="button" data-open="credit" data-action="credit" @click="emit('credit')">
            <AppIcon name="plus" :size="16" class-name="icon" />
            Bakiye Yükle
          </button>
        </div>
      </div>

      <div class="wallet-tile bonus" :data-testid="bonusTestId">
        <div class="wallet-tile-head">
          <span>Bonus</span>
        </div>
        <button
          class="wallet-tile-icon"
          type="button"
          data-open="bonus-info"
          data-action="bonus-info"
          aria-label="Bonus bilgisi"
          @click="emit('bonus-info')"
        >
          <AppIcon name="help-circle" :size="17" class-name="icon" />
        </button>
        <span class="wallet-amount"><strong>240</strong><small>bonus</small></span>
        <span class="wallet-subline">Kredi yüklerken kullanılır.</span>
        <div class="wallet-actions split">
          <button class="wallet-action-pill convert" type="button" data-open="bonus-convert" @click="emit('convert')">
            <AppIcon name="refresh" :size="16" class-name="icon" />
            Krediye Çevir
          </button>
        </div>
      </div>
    </div>
  </AppCard>
</template>
