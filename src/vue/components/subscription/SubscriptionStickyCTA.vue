<script setup>
import AppButton from "../ui/AppButton.vue";

defineProps({
  title: { type: String, default: "Lipyum Plus" },
  price: { type: String, default: "249 TL / ay" },
  note: { type: String, default: "30 gün ücretsiz, sonra aylık yenilenir." },
  ctaLabel: { type: String, default: "ÜCRETSİZ DENEMEYİ BAŞLAT" },
});

const emit = defineEmits(["cta"]);
</script>

<template>
  <div class="subscription-sticky-cta" data-testid="subscription-sticky-cta">
    <div>
      <strong>{{ title }}</strong>
      <span>{{ price }}</span>
    </div>
    <p>{{ note }}</p>
    <AppButton full-width size="lg" data-testid="subscription-sticky-button" @click="emit('cta')">
      {{ ctaLabel }}
    </AppButton>
  </div>
</template>
