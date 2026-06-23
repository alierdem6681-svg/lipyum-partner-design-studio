<script setup>
import AppIcon from "../ui/AppIcon.vue";

const rules = [
  "Bonus doğrudan iş alımında kullanılamaz.",
  "Bonus nakde çevrilemez.",
  "Yükleme sırasında ödeme tutarını düşürür.",
  "Yakın biten bonuslar önce kullanılır.",
];
</script>

<template>
  <section class="wallet-settings-card" data-testid="wallet-bonus-rules-card">
    <div class="wallet-card-title-row">
      <span class="wallet-soft-icon is-warning"><AppIcon name="shield" :size="20" /></span>
      <span>
        <strong>Bonus Kuralları</strong>
        <small>Bonus bakiyenin nasıl kullanılacağını açıkça gösterir.</small>
      </span>
    </div>
    <ul class="wallet-rule-list">
      <li v-for="rule in rules" :key="rule">
        <AppIcon name="check" :size="15" />
        <span>{{ rule }}</span>
      </li>
    </ul>
  </section>
</template>

