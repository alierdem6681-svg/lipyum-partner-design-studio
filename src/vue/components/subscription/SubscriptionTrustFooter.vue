<script setup>
import AppCard from "../ui/AppCard.vue";
import AppIcon from "../ui/AppIcon.vue";

const trustItems = [
  { icon: "check", label: "Gizli ücret yok" },
  { icon: "refresh", label: "Her ay otomatik yenilenir" },
  { icon: "shield", label: "İstediğin zaman iptal et" },
  { icon: "credit-card", label: "Satın alımları geri yükle" },
];
</script>

<template>
  <AppCard class="subscription-trust-card" data-testid="subscription-trust-footer">
    <h3>Güvenli ve şeffaf</h3>
    <ul>
      <li v-for="item in trustItems" :key="item.label">
        <AppIcon :name="item.icon" :size="19" />
        <span>{{ item.label }}</span>
      </li>
    </ul>
    <p>Koşullar ve Gizlilik bilgileri ödeme adımında tekrar gösterilir.</p>
  </AppCard>
</template>
