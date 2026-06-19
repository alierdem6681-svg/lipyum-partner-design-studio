<script setup>
import AppButton from "../ui/AppButton.vue";

defineProps({
  open: { type: Boolean, default: false },
});

const emit = defineEmits(["share"]);

const options = [
  "Sosyal profil",
  "Web sitesi embed",
  "Hikaye",
  "Gönderi",
  "WhatsApp",
  "QR",
  "E-posta",
  "Link kopyala",
];
</script>

<template>
  <section class="v-share-options" data-testid="partner-share-options">
    <AppButton
      v-for="option in options"
      :key="option"
      size="sm"
      variant="secondary"
      @click="emit('share', option)"
    >
      {{ option }}
    </AppButton>
  </section>
</template>
