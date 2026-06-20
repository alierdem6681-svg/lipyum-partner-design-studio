<script setup>
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

const router = useRouter();
const subscription = useSubscriptionStore();
const supportPhoneNumber = "4442368";
const supportPhoneLabel = "444 23 68";
</script>

<template>
  <AppPage title="Müşteri Hizmetleri" class="customer-service-page">
    <AppCard class="customer-service-hero ui-card" data-testid="customer-service-page">
      <div class="customer-service-hero-copy">
        <span class="customer-service-eyebrow"><AppIcon name="sparkles" :size="14" /> Öncelikli destek hattı</span>
        <h2>Bekleme yok. Dağınık mesaj yok. Direkt çözüm.</h2>
        <p>Müşteri, iş ve ödeme konularında hızlı karar gerektiğinde telefon hattı ücretli aboneler için öne alınır.</p>
      </div>
      <div class="customer-service-hero-art" aria-hidden="true">
        <span><AppIcon name="phone" :size="26" /></span>
        <strong>3 dk</strong>
        <small>hedef dönüş</small>
      </div>
    </AppCard>

    <AppCard
      :class="['customer-service-phone-card', 'ui-card', subscription.hasPaidSubscription ? 'has-access' : '']"
      aria-label="Müşteri hizmetleri telefonu"
    >
      <div class="customer-service-phone-copy">
        <span class="customer-service-phone-icon"><AppIcon :name="subscription.hasPaidSubscription ? 'phone' : 'crown'" :size="20" /></span>
        <div>
          <small>Müşteri hizmetleri numarası</small>
          <strong data-testid="customer-service-phone-number">{{ supportPhoneLabel }}</strong>
        </div>
      </div>
      <p>
        {{
          subscription.hasPaidSubscription
            ? `${subscription.activeSubscriptionPlan} üyeliğin aktif. Bu numaradan müşteri hizmetlerine doğrudan bağlanabilirsin.`
            : "Bu numara herkes tarafından görülebilir; telefonla ulaşım sadece ücretli abonelerde aktifleşir."
        }}
      </p>
      <a
        v-if="subscription.hasPaidSubscription"
        class="primary-btn"
        :href="`tel:${supportPhoneNumber}`"
        data-action="start-customer-service-call"
        data-testid="customer-service-call"
      >
        <AppIcon name="phone" :size="18" /> Telefonla ara
      </a>
      <AppButton
        v-else
        class="primary-btn customer-service-upgrade-btn"
        icon="crown"
        data-testid="customer-service-upgrade"
        @click="router.push('/subscription')"
      >
        Telefon desteğini aç
      </AppButton>
    </AppCard>

    <section class="customer-service-proof-grid" aria-label="Abonelik avantajları">
      <article>
        <span><AppIcon name="zap" :size="20" /></span>
        <strong>Öncelik sırası</strong>
        <small>Acil işlerde destek kuyruğunda öne çık.</small>
      </article>
      <article>
        <span><AppIcon name="shield" :size="20" /></span>
        <strong>Daha net çözüm</strong>
        <small>Kredi, ilan ve müşteri konularını tek görüşmede toparla.</small>
      </article>
      <article>
        <span><AppIcon name="trend-up" :size="20" /></span>
        <strong>Daha çok iş odağı</strong>
        <small>Destek beklerken kaçan fırsatları azalt.</small>
      </article>
    </section>

    <AppCard class="customer-service-sales-card ui-card">
      <div>
        <span class="customer-service-eyebrow"><AppIcon name="crown" :size="14" /> Üyelik etkisi</span>
        <h3>Telefon desteği, yoğun günde kendini amorti eder.</h3>
        <p>Bir iş kaçırmamak, yanlış plan kullanmamak veya ödeme konusunu hızlı netleştirmek çoğu zaman planın değerini çıkarır.</p>
      </div>
      <div class="customer-service-sales-metrics" aria-label="Öne çıkan faydalar">
        <span><strong>1</strong><small>tek aramayla net aksiyon</small></span>
        <span><strong>VIP</strong><small>telefon destek hattı</small></span>
      </div>
      <AppButton class="primary-btn" icon="sparkles" data-testid="customer-service-plans" @click="router.push('/subscription')">
        Abonelikleri incele
      </AppButton>
    </AppCard>
  </AppPage>
</template>
