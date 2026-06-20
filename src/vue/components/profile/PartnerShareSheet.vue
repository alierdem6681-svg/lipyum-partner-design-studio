<script setup>
import { computed, ref } from "vue";
import AppButton from "../ui/AppButton.vue";
import AppIcon from "../ui/AppIcon.vue";

const emit = defineEmits(["share"]);

const shortLink = "lipyum.com/f54s3f2";
const selectedChannelId = ref("whatsapp");

const channels = [
  { id: "whatsapp", label: "Whatsapp", icon: "message", options: ["Birine gönder", "Durum olarak paylaş", "Gruba gönder"] },
  { id: "website", label: "Web Sitesi", icon: "home", options: ["Rozet alanına ekle", "Buton olarak ekle", "Embed kodu al"] },
  { id: "instagram", label: "Instagram", icon: "image", options: ["Hikaye", "Gönderi", "Reels"] },
  { id: "facebook", label: "Facebook", icon: "share", options: ["Gönderi", "Hikaye", "Sayfada paylaş"] },
  { id: "tiktok", label: "Tik Tok", icon: "video", options: ["Profil bağlantısı", "Video açıklaması", "QR ekranı"] },
  { id: "x", label: "X", icon: "send", options: ["Post", "DM", "Profil linki"] },
  { id: "thread", label: "Thread", icon: "message", options: ["Thread paylaşımı", "Yanıt olarak paylaş", "Profil linki"] },
];

const selectedChannel = computed(() => channels.find((channel) => channel.id === selectedChannelId.value) || channels[0]);

function selectChannel(channelId) {
  selectedChannelId.value = channelId;
}

function testIdFrom(value) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function shareOption(option) {
  emit("share", `${selectedChannel.value.label} - ${option}`);
}
</script>

<template>
  <section class="v-share-options partner-share-sheet" data-testid="partner-share-options">
    <div class="partner-share-channel-grid" aria-label="Paylaşım kanalları">
      <button
        v-for="channel in channels"
        :key="channel.id"
        class="partner-share-channel"
        :class="channel.id === selectedChannelId ? 'is-active' : ''"
        type="button"
        :data-testid="`partner-share-option-${channel.id}`"
        :aria-pressed="channel.id === selectedChannelId ? 'true' : 'false'"
        @click="selectChannel(channel.id)"
      >
        <AppIcon :name="channel.icon" :size="18" />
        <span>{{ channel.label }}</span>
      </button>
    </div>

    <div class="partner-share-suboptions" :data-testid="`partner-share-suboptions-${selectedChannel.id}`">
      <strong>{{ selectedChannel.label }} seçenekleri</strong>
      <AppButton
        v-for="option in selectedChannel.options"
        :key="option"
        size="sm"
        variant="secondary"
        icon="send"
        :data-testid="`partner-share-suboption-${selectedChannel.id}-${testIdFrom(option)}`"
        @click="shareOption(option)"
      >
        {{ option }}
      </AppButton>
    </div>

    <div class="partner-share-quick">
      <button class="partner-share-qr" type="button" data-testid="partner-share-qr" @click="emit('share', 'QR ile paylaş')">
        <AppIcon name="qr" :size="22" />
        <span>
          <strong>QR ile paylaş</strong>
          <small>Müşteri kamerayla hızlıca açar.</small>
        </span>
      </button>
      <button class="partner-share-link" type="button" data-testid="partner-share-short-link" @click="emit('share', 'Kısa link kopyalandı')">
        <span>
          <strong>Kısa link</strong>
          <small>{{ shortLink }}</small>
        </span>
        <AppIcon name="copy" :size="20" />
      </button>
    </div>
  </section>
</template>
