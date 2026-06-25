<script setup>
import { useRouter } from "vue-router";
import AppPage from "../components/ui/AppPage.vue";

const assetBase = `${import.meta.env.BASE_URL}assets/lipyum-customer-service/`;
const asset = (name) => `${assetBase}${name}`;
const router = useRouter();

function openSubscription() {
  router.push("/subscription");
}
</script>

<template>
  <AppPage title="Müşteri Hizmetleri" class="customer-service-page" data-testid="customer-service-page">
    <section class="customer-service-premium-card" aria-labelledby="customer-service-title">
      <img class="customer-service-rings customer-service-rings--left" :src="asset('gold-rings.svg')" alt="" aria-hidden="true" />
      <img class="customer-service-rings customer-service-rings--right" :src="asset('gold-rings.svg')" alt="" aria-hidden="true" />

      <div class="customer-service-eyebrow">
        <img :src="asset('member-star.svg')" alt="" aria-hidden="true" />
        <span>ÜYE AYRICALIĞI</span>
      </div>

      <div class="customer-service-tiers" aria-label="Plus, Gold ve VIP üyeleri">
        <span>PLUS</span>
        <b>•</b>
        <span>GOLD</span>
        <b>•</b>
        <span class="customer-service-tiers__vip">VIP</span>
      </div>

      <div class="customer-service-divider" aria-hidden="true">
        <i></i>
        <img :src="asset('crown-mini.svg')" alt="" />
        <i></i>
      </div>

      <h2 id="customer-service-title" class="customer-service-title">
        <span>Üyeliğinin</span>
        <span>ayrıcalığı burada.</span>
      </h2>

      <p class="customer-service-description">
        <span>Lipyum Plus, Gold ve VIP üyeleri</span>
        <span>müşteri hizmetlerine tek dokunuşla ulaşabilir.</span>
      </p>

      <img class="customer-service-medallion" :src="asset('headset-medallion.svg')" alt="" aria-hidden="true" />

      <p class="customer-service-label">Lipyum Müşteri Hizmetleri</p>
      <p class="customer-service-phone" data-testid="customer-service-phone-number" aria-label="444 23 68">444 23 68</p>

      <a
        class="customer-service-call"
        href="tel:4442368"
        data-testid="customer-service-call"
        aria-label="444 23 68 numaralı Lipyum Müşteri Hizmetlerini ara"
      >
        <img :src="asset('phone-white.svg')" alt="" aria-hidden="true" />
        <span>444 23 68’i Ara</span>
      </a>

      <p class="customer-service-helper">
        <img :src="asset('shield.svg')" alt="" aria-hidden="true" />
        <span>Arama telefon uygulamanda başlatılır.</span>
      </p>
    </section>

    <section class="customer-service-upgrade-bar" data-testid="customer-service-upgrade" aria-label="Abonelik yükseltme">
      <div class="customer-service-upgrade-bar__copy">
        <strong>Premium desteği aç</strong>
        <small>Plus, Gold veya VIP planını seç.</small>
      </div>
      <button class="customer-service-upgrade-bar__button" type="button" @click="openSubscription">
        Aboneliği Yükselt
      </button>
    </section>
  </AppPage>
</template>
