<script setup>
import appointmentCalendarUrl from "../../../assets/partner-share/appointment_calendar.webp";
import arrowCircleUrl from "../../../assets/partner-share/arrow_circle.webp";
import copyLinkUrl from "../../../assets/partner-share/copy_link.webp";
import ctaSparklesUrl from "../../../assets/partner-share/cta_sparkles.webp";
import facebookUrl from "../../../assets/partner-share/facebook.webp";
import freeCheckBadgeUrl from "../../../assets/partner-share/free_check_badge.webp";
import growthChartUrl from "../../../assets/partner-share/growth_chart_premium.webp";
import heroShieldUrl from "../../../assets/partner-share/hero_shield_verified.webp";
import instagramUrl from "../../../assets/partner-share/instagram.webp";
import messageUrl from "../../../assets/partner-share/message.webp";
import offerDocumentUrl from "../../../assets/partner-share/offer_document.webp";
import storyPlusUrl from "../../../assets/partner-share/story_plus.webp";
import tiktokUrl from "../../../assets/partner-share/tiktok.webp";
import trustShieldUrl from "../../../assets/partner-share/trust_shield.webp";
import websitePreviewUrl from "../../../assets/partner-share/website_profile_preview.webp";
import whatsappUrl from "../../../assets/partner-share/whatsapp.webp";
import xLogoUrl from "../../../assets/partner-share/x_logo.webp";

const emit = defineEmits(["share"]);

const trustChips = [
  { label: "Güven", iconUrl: trustShieldUrl },
  { label: "Teklif", iconUrl: offerDocumentUrl },
  { label: "Randevu", iconUrl: appointmentCalendarUrl },
];

const primaryChannels = [
  { id: "whatsapp", label: "WhatsApp", iconUrl: whatsappUrl, action: "WhatsApp paylaşımı" },
  { id: "copy", label: "Link Kopyala", iconUrl: copyLinkUrl, action: "Kısa link kopyalandı" },
  { id: "message", label: "Mesaj", iconUrl: messageUrl, action: "Mesaj paylaşımı" },
];

const socialChannels = [
  { id: "instagram", label: "Instagram", iconUrl: instagramUrl, action: "Instagram paylaşımı" },
  { id: "facebook", label: "Facebook", iconUrl: facebookUrl, action: "Facebook paylaşımı" },
  { id: "tiktok", label: "TikTok", iconUrl: tiktokUrl, action: "TikTok paylaşımı" },
  { id: "x", label: "X", iconUrl: xLogoUrl, action: "X paylaşımı" },
  { id: "story", label: "Hikaye", iconUrl: storyPlusUrl, action: "Hikaye paylaşımı" },
];

function handleShare(action) {
  emit("share", action);
}
</script>

<template>
  <section class="v-share-options partner-share-sheet" data-testid="partner-share-options">
    <article class="partner-share-hero" data-testid="partner-share-hero">
      <div class="partner-share-hero__visual" aria-hidden="true">
        <img :src="heroShieldUrl" alt="" loading="lazy" />
      </div>
      <div class="partner-share-hero__copy">
        <h3>Mükemmel Profilinle İnsanlara Güven Ver</h3>
        <p>Profilini sosyal medya ve diğer platformlarda paylaş, insanlar seninle iletişime geçebilsin, teklif ve randevu alabilsin.</p>
        <div class="partner-share-trust-chips" aria-label="Profil güven rozetleri">
          <span v-for="chip in trustChips" :key="chip.label">
            <img :src="chip.iconUrl" alt="" loading="lazy" />
            {{ chip.label }}
          </span>
        </div>
      </div>
    </article>

    <article class="partner-share-proof-card" data-testid="partner-share-free-contact">
      <span class="partner-share-proof-card__icon" aria-hidden="true">
        <img :src="freeCheckBadgeUrl" alt="" loading="lazy" />
      </span>
      <p>Seninle doğrudan iletişime geçen, teklif ve randevu isteyen kişiler için <strong>hiçbir ücret ödemezsin.</strong></p>
    </article>

    <article class="partner-share-growth-card" data-testid="partner-share-growth">
      <span class="partner-share-growth-card__chart" aria-hidden="true">
        <img :src="growthChartUrl" alt="" loading="lazy" />
      </span>
      <p>Profil linkini paylaşan firmalar sosyal medya üzerinden x4 kat daha fazla iş alıyor.</p>
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
          <img :src="channel.iconUrl" alt="" loading="lazy" />
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
          <img :src="channel.iconUrl" alt="" loading="lazy" />
        </span>
        <small>{{ channel.label }}</small>
      </button>
    </div>

    <article class="partner-share-website-card" data-testid="partner-share-option-website">
      <span class="partner-share-website-card__preview" aria-hidden="true">
        <img :src="websitePreviewUrl" alt="" loading="lazy" />
      </span>
      <span class="partner-share-website-card__copy">
        <strong>Web sitemde göster</strong>
        <small>Ziyaretçiler tek tıkla sana ulaşsın</small>
      </span>
      <button type="button" data-testid="partner-share-website-add" @click="handleShare('Web sitesine ekleme hazırlandı')">Ekle</button>
    </article>

    <button class="partner-share-start" type="button" data-testid="partner-share-start" @click="handleShare('Ücretsiz paylaşım başlatıldı')">
      <span>
        <img :src="ctaSparklesUrl" alt="" loading="lazy" />
        Ücretsiz Paylaşmaya Başla
      </span>
      <img class="partner-share-start__arrow" :src="arrowCircleUrl" alt="" loading="lazy" />
    </button>
  </section>
</template>
