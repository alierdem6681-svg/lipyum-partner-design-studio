<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import PartnerProfileCard from "../components/profile/PartnerProfileCard.vue";
import PartnerShareSheet from "../components/profile/PartnerShareSheet.vue";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useProfileStore } from "../stores/profileStore.js";

const shell = useAppShellStore();
const profile = useProfileStore();
const shareSheetOpen = ref(false);
const profileShareUrl = computed(() => {
  if (typeof window === "undefined") return "https://lipyum.com/profil";
  return `${window.location.origin}${window.location.pathname}#/partner-card-preview`;
});

const previewDetails = [
  {
    id: "services",
    icon: "briefcase",
    title: "Hizmetler",
    subtitle: "Klima bakım, buzdolabı tamiri...",
    value: "+7 Hizmet",
  },
  {
    id: "regions",
    icon: "map-pin",
    title: "Hizmet Bölgeleri",
    subtitle: "Beşiktaş, Şişli, Beyoğlu...",
    value: "+18 Bölge",
  },
  {
    id: "hours",
    icon: "clock",
    title: "Çalışma Saatleri",
    subtitle: "Hafta içi ve cumartesi",
    value: "08:00 - 21:00",
  },
];

const verifiedItems = [
  { id: "tax", icon: "file-text", label: "Vergi Levhası", value: "Doğrulandı" },
  { id: "identity", icon: "shield", label: "TC Kimlik No", value: "Doğrulandı" },
  { id: "phone", icon: "phone", label: "Cep Telefonu", value: "Doğrulandı" },
  { id: "email", icon: "message", label: "Mail Adresi", value: "Doğrulandı" },
  { id: "certificate", icon: "crown", label: "Ustalık Belgesi", value: "Onaylı" },
];

const reviewCards = [
  {
    id: "quick-clean",
    reviews: [
      {
        name: "Emre T.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        date: "2 hafta önce",
        text: "Çok hızlı geldi, işimi temiz çözdü.",
      },
      {
        name: "Seda K.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        date: "1 ay önce",
        text: "Randevu saatine uydu, güven verdi.",
      },
    ],
  },
  {
    id: "trusted-service",
    reviews: [
      {
        name: "Murat Y.",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80",
        date: "3 hafta önce",
        text: "Fiyatı net anlattı, işi sorunsuz tamamladı.",
      },
      {
        name: "Elif A.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        date: "1 ay önce",
        text: "Kısa sürede geldi ve temiz çalıştı.",
      },
    ],
  },
];

function openShareOptions() {
  shareSheetOpen.value = true;
}

function handleShare(payload) {
  const channel = typeof payload === "string" ? "" : payload?.channel;
  const message = typeof payload === "string" ? `${payload} hazırlandı.` : payload?.message || "Paylaşım hazırlandı.";
  if (channel !== "copy") shareSheetOpen.value = false;
  shell.showToast(message);
}

function handleShareError() {
  shell.showToast("Paylaşım başlatılamadı.");
}

function showPreviewAction(action) {
  shell.showToast(`${action} seçeneği hazır.`);
}

onMounted(() => {
  window.addEventListener("lipyum:partner-share", openShareOptions);
});

onBeforeUnmount(() => {
  window.removeEventListener("lipyum:partner-share", openShareOptions);
});
</script>

<template>
  <AppPage title="Profil Kartı" class="partner-card-preview-page" data-testid="partner-card-preview-page">
    <div class="v-stack v-partner-preview-page" data-testid="partner-card-preview">
      <PartnerProfileCard variant="public" :show-actions="false" expand-badges />

      <AppCard
        class="partner-preview-verified"
        variant="elevated"
        padding="md"
        data-testid="partner-preview-verified"
      >
        <div class="partner-preview-verified__header">
          <span class="partner-preview-verified__seal" aria-hidden="true">
            <AppIcon name="shield" :size="21" />
          </span>
          <div class="partner-preview-verified__copy">
            <h2>Doğrulanmış Bilgi ve Belgeler</h2>
            <p>Kimlik, iletişim ve mesleki belgeler kontrol edildi.</p>
          </div>
          <span class="partner-preview-verified__status" aria-label="5 bilgi doğrulandı">
            <AppIcon name="check" :size="12" />
            5/5
          </span>
        </div>
        <div class="partner-preview-verified__grid" aria-label="Doğrulanmış bilgi ve belgeler">
          <span
            v-for="item in verifiedItems"
            :key="item.id"
            class="partner-preview-verified__item"
            :data-testid="`partner-preview-verified-${item.id}`"
          >
            <span class="partner-preview-verified__item-icon" aria-hidden="true">
              <AppIcon :name="item.icon" :size="15" />
            </span>
            <span class="partner-preview-verified__item-copy">
              <strong>{{ item.label }}</strong>
              <small>{{ item.value }}</small>
            </span>
            <span class="partner-preview-verified__check" aria-hidden="true">
              <AppIcon name="check" :size="10" />
            </span>
          </span>
        </div>
      </AppCard>

      <AppCard
        class="partner-preview-details"
        variant="elevated"
        padding="md"
        data-testid="partner-preview-service-summary"
      >
        <div class="partner-preview-details__grid" aria-label="Profil kartı kapsamı">
          <article
            v-for="detail in previewDetails"
            :key="detail.id"
            class="partner-preview-detail"
            :data-testid="`partner-preview-detail-${detail.id}`"
          >
            <span class="partner-preview-detail__icon" aria-hidden="true">
              <AppIcon :name="detail.icon" :size="17" />
            </span>
            <div class="partner-preview-detail__copy">
              <strong>{{ detail.title }}</strong>
              <p>{{ detail.subtitle }}</p>
            </div>
            <strong class="partner-preview-detail__value">{{ detail.value }}</strong>
            <span class="partner-preview-detail__arrow" aria-hidden="true">
              <AppIcon name="chevron-right" :size="18" />
            </span>
          </article>
        </div>
      </AppCard>

      <AppCard class="partner-preview-reviews" variant="elevated" padding="md" data-testid="partner-preview-reviews">
        <div class="partner-preview-reviews__header">
          <h2>Müşteri Yorumları</h2>
        </div>

        <div class="partner-preview-reviews__track" aria-label="Müşteri yorumları">
          <article
            v-for="card in reviewCards"
            :key="card.id"
            class="partner-preview-review-card"
            data-testid="partner-preview-review-card"
          >
            <div
              v-for="review in card.reviews"
              :key="review.name"
              class="partner-preview-review-row"
              data-testid="partner-preview-review-row"
            >
              <img :src="review.avatar" :alt="`${review.name} profil fotoğrafı`" />
              <div class="partner-preview-review-row__copy">
                <div class="partner-preview-review-row__top">
                  <strong>{{ review.name }}</strong>
                  <span>{{ review.date }}</span>
                </div>
                <span class="partner-preview-review-row__stars" aria-label="5 yıldız">★★★★★</span>
                <p>{{ review.text }}</p>
              </div>
            </div>
          </article>
        </div>

        <div class="partner-preview-review-dots" aria-hidden="true">
          <span class="is-active"></span>
          <span></span>
        </div>
      </AppCard>
    </div>

    <nav class="partner-preview-sticky-actions" data-testid="partner-preview-sticky-actions" aria-label="Profil kartı aksiyonları">
      <button type="button" class="partner-preview-sticky-actions__item is-primary" data-testid="partner-preview-action-offer" @click="showPreviewAction('Teklif')">
        <AppIcon name="file-text" :size="16" />
        Teklif Al
      </button>
      <button type="button" class="partner-preview-sticky-actions__item" data-testid="partner-preview-action-appointment" @click="showPreviewAction('Randevu')">
        <AppIcon name="calendar" :size="16" />
        Randevu Al
      </button>
      <button type="button" class="partner-preview-sticky-actions__item" data-testid="partner-preview-action-message" @click="showPreviewAction('Mesaj')">
        <AppIcon name="message" :size="16" />
        Mesaj Yaz
      </button>
    </nav>

    <AppSheet
      :open="shareSheetOpen"
      title="Profilini paylaş"
      description="Daha fazla görünürlük kazan, ücretsiz iletişim al."
      @close="shareSheetOpen = false"
    >
      <PartnerShareSheet
        :partner-name="profile.partner.name"
        :profile-url="profileShareUrl"
        @share="handleShare"
        @error="handleShareError"
      />
    </AppSheet>
  </AppPage>
</template>
