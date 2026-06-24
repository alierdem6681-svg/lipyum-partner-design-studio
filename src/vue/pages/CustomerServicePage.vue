<script setup>
import { computed } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

const subscription = useSubscriptionStore();
const supportLevel = computed(() => subscription.currentPlan?.entitlements?.customerService || "Plus, Gold ve VIP müşteri hizmetleri");
const hasPremiumSupport = computed(() => subscription.currentPlanId !== "free");
</script>

<template>
  <AppPage title="Müşteri Hizmetleri">
    <section class="v-customer-service-page" data-testid="customer-service-page" aria-labelledby="customer-service-title">
      <div class="v-customer-service-hero">
        <span class="v-customer-service-kicker">
          <AppIcon name="star" :size="15" />
          ÜYE AYRICALIĞI
        </span>

        <p class="v-customer-service-tier" aria-label="Plus, Gold ve VIP üyelerine özel">
          <span>PLUS</span>
          <span aria-hidden="true">•</span>
          <span>GOLD</span>
          <span aria-hidden="true">•</span>
          <strong>VIP</strong>
        </p>

        <div class="v-customer-service-divider" aria-hidden="true">
          <span></span>
          <AppIcon name="crown" :size="20" />
          <span></span>
        </div>

        <div class="v-customer-service-copy">
          <h2 id="customer-service-title">Üyeliğinin ayrıcalığı burada.</h2>
          <p>Lipyum Plus, Gold ve VIP üyeleri müşteri hizmetlerine tek dokunuşla ulaşabilir.</p>
          <p v-if="hasPremiumSupport" class="v-customer-service-entitlement">
            Mevcut destek seviyen: {{ supportLevel }}.
            <strong>{{ supportLevel.charAt(0).toUpperCase() + supportLevel.slice(1) }} hakkın aktif.</strong>
          </p>
        </div>

        <div class="v-customer-service-contact">
          <span class="v-customer-service-contact-icon" aria-hidden="true">
            <AppIcon name="headphones" :size="34" />
          </span>
          <p>Lipyum Müşteri Hizmetleri</p>
          <strong data-testid="customer-service-phone-number">444 23 68</strong>
        </div>

        <a class="v-customer-service-call" data-testid="customer-service-call" href="tel:4442368" aria-label="444 23 68 numarasını ara">
          <AppIcon name="phone" :size="23" />
          <span>444 23 68’i Ara</span>
        </a>

        <p class="v-customer-service-note">
          <AppIcon name="shield" :size="16" />
          Arama telefon uygulamanda başlatılır.
        </p>
      </div>
    </section>
  </AppPage>
</template>
