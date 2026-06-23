<script setup>
import { computed } from "vue";
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

const accessCopy = computed(() => {
  if (subscription.customerServiceLevel === "phone") return "Telefon ve öncelikli destek hattın açık.";
  if (subscription.customerServiceLevel === "priority") return "Öncelikli müşteri hizmetleri erişimin açık.";
  if (subscription.customerServiceLevel === "fast") return "Hızlı müşteri hizmetleri erişimin açık.";
  if (subscription.customerServiceLevel === "standard") return "Standart müşteri hizmetleri erişimin açık.";
  return "telefonla ulaşım sadece ücretli abonelerde aktifleşir";
});

const hasPhoneAccess = computed(() => subscription.customerServiceLevel === "phone");
const hasSupportAccess = computed(() => subscription.customerServiceLevel !== "none");
</script>

<template>
  <AppPage title="Müşteri Hizmetleri" class="customer-service-page">
    <AppCard class="customer-service-hero ui-card" data-testid="customer-service-page">
      <div class="customer-service-hero-copy">
        <span class="customer-service-eyebrow"><AppIcon name="sparkles" :size="14" /> Öncelikli destek</span>
        <h2>İş, müşteri ve ödeme konularında hızlı destek al.</h2>
        <p>Destek seviyesi aktif abonelik planına göre belirlenir.</p>
      </div>
      <div class="customer-service-hero-art" aria-hidden="true">
        <span><AppIcon name="phone" :size="26" /></span>
        <strong>{{ subscription.currentPlan.title }}</strong>
        <small>{{ hasSupportAccess ? 'erişim açık' : 'plan gerekli' }}</small>
      </div>
    </AppCard>

    <AppCard :class="['customer-service-phone-card', 'ui-card', hasSupportAccess ? 'has-access' : '']" aria-label="Müşteri hizmetleri telefonu">
      <div class="customer-service-phone-copy">
        <span class="customer-service-phone-icon"><AppIcon :name="hasSupportAccess ? 'phone' : 'crown'" :size="20" /></span>
        <div>
          <small>Müşteri hizmetleri numarası</small>
          <strong data-testid="customer-service-phone-number">{{ supportPhoneLabel }}</strong>
        </div>
      </div>
      <p>{{ accessCopy }}</p>
      <a
        v-if="hasPhoneAccess"
        class="primary-btn"
        :href="`tel:${supportPhoneNumber}`"
        data-action="start-customer-service-call"
        data-testid="customer-service-call"
      >
        <AppIcon name="phone" :size="18" /> Telefonla ara
      </a>
      <AppButton
        v-else-if="!hasSupportAccess"
        class="primary-btn customer-service-upgrade-btn"
        icon="crown"
        data-testid="customer-service-upgrade"
        @click="router.push('/subscription')"
      >
        Destek planlarını incele
      </AppButton>
    </AppCard>

    <section class="customer-service-proof-grid" aria-label="Abonelik destek avantajları">
      <article>
        <span><AppIcon name="shield" :size="20" /></span>
        <strong>Gold</strong>
        <small>Standart müşteri hizmetleri.</small>
      </article>
      <article>
        <span><AppIcon name="zap" :size="20" /></span>
        <strong>Plus</strong>
        <small>Hızlı müşteri hizmetleri.</small>
      </article>
      <article>
        <span><AppIcon name="phone" :size="20" /></span>
        <strong>VIP</strong>
        <small>Telefon ve öncelikli destek.</small>
      </article>
    </section>

    <AppCard class="customer-service-sales-card ui-card">
      <div>
        <span class="customer-service-eyebrow"><AppIcon name="crown" :size="14" /> Plan etkisi</span>
        <h3>Destek seviyen abonelik planına göre açılır.</h3>
        <p>Gold, Plus ve VIP planlarını karşılaştırarak ihtiyacına uygun destek seviyesini seçebilirsin.</p>
      </div>
      <AppButton class="primary-btn" icon="sparkles" data-testid="customer-service-plans" @click="router.push('/subscription')">
        Abonelikleri incele
      </AppButton>
    </AppCard>
  </AppPage>
</template>
