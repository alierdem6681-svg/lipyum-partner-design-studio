<script setup>
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  title: { type: String, default: "Bonus" },
  amount: { type: Number, default: 240 },
  subtitle: { type: String, default: "Kredi yüklerken kullanılır." },
  showInfo: { type: Boolean, default: false },
  showAction: { type: Boolean, default: false },
  actionLabel: { type: String, default: "Krediye Çevir" },
  compact: { type: Boolean, default: false },
  testId: { type: String, default: undefined },
});

const emit = defineEmits(["info", "action"]);
</script>

<template>
  <div :class="['wallet-tile', 'bonus', 'bonus-balance-tile', { 'is-compact': compact }]" :data-testid="testId">
    <div class="wallet-tile-head">
      <span>{{ title }}</span>
    </div>
    <button
      v-if="showInfo"
      class="wallet-tile-icon"
      type="button"
      data-open="bonus-info"
      data-action="bonus-info"
      aria-label="Bonus hesap hareketleri"
      @click="emit('info')"
    >
      <AppIcon name="receipt" :size="17" class-name="icon" />
    </button>
    <span class="wallet-amount"><strong>₺{{ amount }}</strong><small>bonus</small></span>
    <span class="wallet-subline">{{ subtitle }}</span>
    <div v-if="showAction" class="wallet-actions split">
      <button class="wallet-action-pill convert" type="button" data-open="bonus-convert" @click="emit('action')">
        <AppIcon name="refresh" :size="16" class-name="icon" />
        {{ actionLabel }}
      </button>
    </div>
  </div>
</template>
