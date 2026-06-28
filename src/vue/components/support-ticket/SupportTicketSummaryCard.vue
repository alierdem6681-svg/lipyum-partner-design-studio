<script setup>
import AppCard from "../ui/AppCard.vue";
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  openCount: { type: Number, default: 0 },
  answeredCount: { type: Number, default: 0 },
  resolvedCount: { type: Number, default: 0 },
  mode: { type: String, default: "create" },
});

defineEmits(["primary"]);
</script>

<template>
  <AppCard padding="lg" variant="hero" class="support-ticket-summary" data-testid="support-ticket-summary">
    <span class="support-ticket-summary__icon" aria-hidden="true">
      <AppIcon name="headphones" :size="36" />
    </span>
    <div class="support-ticket-summary__copy">
      <h2>{{ mode === "list" ? "Destek durumun" : "Nasıl yardımcı olabiliriz?" }}</h2>
      <p>{{ mode === "list" ? "Açık ve geçmiş taleplerini tek ekranda takip et." : "Talebini 1 dakikada oluştur." }}</p>
    </div>
    <div class="support-ticket-summary__stats" aria-label="Destek durum özeti">
      <span><AppIcon name="file-text" :size="17" /> <b>{{ openCount }}</b> açık</span>
      <span><AppIcon name="clock" :size="17" /> <b>{{ answeredCount }}</b> yanıt</span>
      <span><AppIcon name="check" :size="17" /> <b>{{ resolvedCount }}</b> çözüldü</span>
    </div>
    <AppButton icon="send" full-width size="lg" @click="$emit('primary')">
      {{ mode === "list" ? "Yeni Talep" : "Yeni Talep Oluştur" }}
    </AppButton>
  </AppCard>
</template>
