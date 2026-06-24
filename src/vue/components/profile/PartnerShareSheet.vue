<script setup>
import AppIcon from "../ui/AppIcon.vue";

const emit = defineEmits(["share"]);

const trustChips = [
  { label: "Güven", icon: "shield" },
  { label: "Teklif", icon: "file-text" },
  { label: "Randevu", icon: "calendar" },
];

const primaryChannels = [
  { id: "whatsapp", label: "WhatsApp", icon: "message", action: "WhatsApp paylaşımı" },
  { id: "copy", label: "Link Kopyala", icon: "copy", action: "Kısa link kopyalandı" },
  { id: "message", label: "Mesaj", icon: "message", action: "Mesaj paylaşımı" },
];

const socialChannels = [
  { id: "instagram", label: "Instagram", icon: "image", action: "Instagram paylaşımı" },
  { id: "facebook", label: "Facebook", icon: "share", action: "Facebook paylaşımı" },
  { id: "tiktok", label: "TikTok", icon: "video", action: "TikTok paylaşımı" },
  { id: "x", label: "X", icon: "x", action: "X paylaşımı" },
  { id: "story", label: "Hikaye", icon: "plus", action: "Hikaye paylaşımı" },
];

function handleShare(action) {
  emit("share", action);
}
</script>

<template>
  <section class="v-share-options partner-share-sheet" data-testid="partner-share-options">
    <article class="partner-share-hero" data-testid="partner-share-hero">
      <div class="partner-share-hero__visual" aria-hidden="true">
        <span class="partner-share-shield">
          <AppIcon name="shield" :size="70" />
          <AppIcon name="check" :size="34" class-name="partner-share-shield__check" />
        </span>
      </div>
      <div class="partner-share-hero__copy">
        <h3>Mükemmel Profilinle İnsanlara Güven Ver</h3>
        <p>Profilini sosyal medya ve diğer platformlarda paylaş, insanlar seninle iletişime geçebilsin.</p>
        <div class="partner-share-trust-chips" aria-label="Profil güven rozetleri">
          <span v-for="chip in trustChips" :key="chip.label">
            <AppIcon :name="chip.icon" :size="13" />
            {{ chip.label }}
          </span>
        </div>
      </div>
    </article>

    <article class="partner-share-proof-card" data-testid="partner-share-free-contact">
      <span class="partner-share-proof-card__icon" aria-hidden="true">
        <AppIcon name="check" :size="22" />
      </span>
      <p>Seninle doğrudan iletişime geçen, teklif ve randevu isteyen kişiler için <strong>hiçbir ücret ödemezsin.</strong></p>
    </article>

    <article class="partner-share-growth-card" data-testid="partner-share-growth">
      <span class="partner-share-growth-card__chart" aria-hidden="true">
        <AppIcon name="bar-chart" :size="38" />
      </span>
      <p>Profil linkini paylaşan firmalar sosyal medya üzerinden daha fazla ilgi alabilir.</p>
      <strong>x4</strong>
    </article>

    <div class="partner-share-section-title">Hemen paylaş</div>

    <div class="partner-share-primary-grid" aria-label="Hızlı paylaşım kanalları">
      <button
        v-for="channel in primaryChannels"
        :key="channel.id"
        class="partner-share-primary-action"
        type="button"
        :data-testid="`partner-share-option-${channel.id}`"
        @click="handleShare(channel.action)"
      >
        <span :class="['partner-share-social-icon', `is-${channel.id}`]" aria-hidden="true">
          <AppIcon :name="channel.icon" :size="22" />
        </span>
        <small>{{ channel.label }}</small>
      </button>
    </div>

    <div class="partner-share-social-row" aria-label="Sosyal paylaşım kanalları">
      <button
        v-for="channel in socialChannels"
        :key="channel.id"
        class="partner-share-social-action"
        type="button"
        :data-testid="`partner-share-option-${channel.id}`"
        @click="handleShare(channel.action)"
      >
        <span :class="['partner-share-social-icon', `is-${channel.id}`]" aria-hidden="true">
          <AppIcon :name="channel.icon" :size="18" />
        </span>
        <small>{{ channel.label }}</small>
      </button>
    </div>

    <article class="partner-share-website-card" data-testid="partner-share-option-website">
      <span class="partner-share-website-card__preview" aria-hidden="true">
        <i></i>
        <b></b>
        <em></em>
      </span>
      <span class="partner-share-website-card__copy">
        <strong>Web sitemde göster</strong>
        <small>Ziyaretçiler tek tıkla sana ulaşsın</small>
      </span>
      <button type="button" data-testid="partner-share-website-add" @click="handleShare('Web sitesine ekleme hazırlandı')">Ekle</button>
    </article>

    <button class="partner-share-start" type="button" data-testid="partner-share-start" @click="handleShare('Ücretsiz paylaşım başlatıldı')">
      <span>
        <AppIcon name="sparkles" :size="18" />
        Ücretsiz Paylaşmaya Başla
      </span>
      <AppIcon name="chevron-right" :size="22" />
    </button>
  </section>
</template>
