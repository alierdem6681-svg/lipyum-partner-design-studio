<script setup>
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  method: { type: Object, required: true },
});
</script>

<template>
  <section class="wallet-payment-method" data-testid="wallet-payment-method">
    <span class="wallet-soft-icon"><AppIcon name="credit-card" :size="20" /></span>
    <span>
      <strong>{{ method.label }}</strong>
      <small>{{ method.description }}</small>
    </span>
    <button type="button">Değiştir</button>
  </section>
</template>

