<script setup>
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();
const supportPhoneNumber = "4442368";
const supportPhoneLabel = "444 23 68";
</script>

<template>
  <AppPage title="Müşteri Hizmetleri" class="customer-service-page">
    <AppCard class="customer-service-hero ui-card" data-testid="customer-service-page">
      <div class="customer-service-hero-copy">
        <span class="customer-service-eyebrow"><AppIcon name="headphones" :size="14" /> Destek hattı</span>
        <h2>İş, müşteri ve ödeme konularında destek al.</h2>
        <p>Ekibimizle telefon, yazılı talep veya canlı destek üzerinden iletişime geçebilirsin.</p>
      </div>
      <div class="customer-service-hero-art" aria-hidden="true">
        <span><AppIcon name="phone" :size="26" /></span>
        <strong>444</strong>
        <small>destek hattı</small>
      </div>
    </AppCard>

    <AppCard class="customer-service-phone-card ui-card has-access" aria-label="Müşteri hizmetleri telefonu">
      <div class="customer-service-phone-copy">
        <span class="customer-service-phone-icon"><AppIcon name="phone" :size="20" /></span>
        <div>
          <small>Müşteri hizmetleri numarası</small>
          <strong data-testid="customer-service-phone-number">{{ supportPhoneLabel }}</strong>
        </div>
      </div>
      <p>Bu numaradan müşteri hizmetlerine doğrudan ulaşabilirsin.</p>
      <a
        class="primary-btn"
        :href="`tel:${supportPhoneNumber}`"
        data-action="start-customer-service-call"
        data-testid="customer-service-call"
      >
        <AppIcon name="phone" :size="18" /> Telefonla ara
      </a>
    </AppCard>

    <section class="customer-service-proof-grid" aria-label="Destek kanalları">
      <article>
        <span><AppIcon name="file-text" :size="20" /></span>
        <strong>Talep oluştur</strong>
        <small>Konunu yaz, ekibimiz takip etsin.</small>
      </article>
      <article>
        <span><AppIcon name="message" :size="20" /></span>
        <strong>Canlı destek</strong>
        <small>Müsait temsilciyle görüş.</small>
      </article>
      <article>
        <span><AppIcon name="phone" :size="20" /></span>
        <strong>Telefon</strong>
        <small>Acil konularda doğrudan ara.</small>
      </article>
    </section>

    <AppCard class="customer-service-sales-card ui-card">
      <div>
        <span class="customer-service-eyebrow"><AppIcon name="shield" :size="14" /> Yardım seçenekleri</span>
        <h3>Konuna göre en uygun destek kanalını seç.</h3>
        <p>Yazılı talep ve canlı destek kayıtları uygulama içinde takip edilir.</p>
      </div>
      <div class="customer-service-actions">
        <AppButton class="primary-btn" icon="file-text" data-testid="customer-service-ticket" @click="router.push('/support/new')">
          Talep Oluştur
        </AppButton>
        <AppButton variant="secondary" icon="message" data-testid="customer-service-live" @click="router.push('/support/live')">
          Canlı Destek
        </AppButton>
      </div>
    </AppCard>
  </AppPage>
</template>
