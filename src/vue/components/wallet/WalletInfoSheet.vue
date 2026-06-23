<script setup>
import AppIcon from "../ui/AppIcon.vue";

const items = [
  ["İş bakiyesi", "Yüklediğin ve iş fırsatı satın almak için kullandığın bakiyedir.", "wallet"],
  ["Bonus bakiyesi", "İptal veya kampanyalardan gelir; yükleme sırasında indirim sağlar.", "gift"],
  ["Bonus kullanımı", "Bonus doğrudan iş alımında veya nakit çekimde kullanılamaz.", "shield"],
  ["Son kullanım", "Yakın biten bonuslar önce kullanılır ve süreleri ayarlarda görünür.", "clock"],
];
</script>

<template>
  <div class="wallet-info-sheet" data-testid="wallet-info-sheet">
    <article v-for="item in items" :key="item[0]">
      <span class="wallet-soft-icon is-warning" aria-hidden="true"><AppIcon :name="item[2]" :size="18" /></span>
      <span>
        <strong>{{ item[0] }}</strong>
        <small>{{ item[1] }}</small>
      </span>
    </article>
  </div>
</template>

