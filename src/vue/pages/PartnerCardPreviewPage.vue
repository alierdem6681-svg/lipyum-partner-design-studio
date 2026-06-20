<script setup>
import { ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import PartnerProfileCard from "../components/profile/PartnerProfileCard.vue";
import PartnerShareSheet from "../components/profile/PartnerShareSheet.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const shareSheetOpen = ref(false);

const insightSections = [
  { title: "Kartın amacı", body: "Müşteriye güven, uzmanlık ve hızlı dönüş sinyallerini tek kartta gösterir." },
  { title: "Kullanım yerleri", body: "Sosyal profil, web sitesi, WhatsApp, QR ve e-posta paylaşımı için uygundur." },
  { title: "Güven etkisi", body: "Puan, rozet ve değerlendirme bilgileri karar sürecini hızlandırır." },
  { title: "Geliştirme önerileri", body: "Yeni iş fotoğrafları ve güncel bölge bilgileri kart etkisini artırır." },
  { title: "Abonelik avantajları", body: "Ücretli planlarda kart görünürlüğü ve destek erişimi güçlenir." },
];

function openShareOptions() {
  shareSheetOpen.value = true;
}

function handleShare(option) {
  shareSheetOpen.value = false;
  shell.showToast(`${option} hazırlandı.`);
}
</script>

<template>
  <AppPage title="Partner Kartı Önizleme" data-testid="partner-card-preview-page">
    <div class="v-stack v-partner-preview-page">
      <AppCard padding="lg">
        <PartnerProfileCard compact />
      </AppCard>

      <AppButton
        icon="share"
        size="lg"
        full-width
        data-testid="partner-preview-share-button"
        @click="openShareOptions"
      >
        Paylaş
      </AppButton>

      <section class="v-content-list" role="list">
        <AppCard
          v-for="section in insightSections"
          :key="section.title"
          padding="md"
          as="article"
          class="v-content-list-item"
          role="listitem"
        >
          <span class="v-content-list-item__copy">
            <strong>{{ section.title }}</strong>
            <small>{{ section.body }}</small>
          </span>
        </AppCard>
      </section>
    </div>

    <AppSheet
      :open="shareSheetOpen"
      title="Nerede paylaşmak istiyorsun?"
      description="Partner kartını istediğin kanalda paylaş."
      @close="shareSheetOpen = false"
    >
      <PartnerShareSheet @share="handleShare" />
    </AppSheet>
  </AppPage>
</template>
