<script setup>
import AppButton from "../ui/AppButton.vue";

const emit = defineEmits(["share"]);

const options = [
  { id: "social", label: "Sosyal medyada paylaş", icon: "share" },
  { id: "website", label: "Web sitemde paylaş", icon: "home" },
  { id: "story", label: "Instagram hikayesi", icon: "image" },
  { id: "post", label: "Gönderi olarak paylaş", icon: "send" },
  { id: "whatsapp", label: "WhatsApp'tan paylaş", icon: "message" },
  { id: "qr", label: "QR kod ile paylaş", icon: "qr" },
  { id: "email", label: "E-posta ile paylaş", icon: "message" },
  { id: "link", label: "Linki kopyala", icon: "share" },
];
</script>

<template>
  <section class="v-share-options" data-testid="partner-share-options">
    <AppButton
      v-for="option in options"
      :key="option.id"
      size="sm"
      variant="secondary"
      :icon="option.icon"
      :data-testid="`partner-share-option-${option.id}`"
      @click="emit('share', option.label)"
    >
      {{ option.label }}
    </AppButton>
  </section>
</template>
