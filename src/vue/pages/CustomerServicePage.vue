<script setup>
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

const router = useRouter();
const subscription = useSubscriptionStore();
</script>

<template>
  <AppPage title="Müşteri Hizmetleri">
    <div class="v-stack">
      <AppCard padding="lg" variant="hero" data-testid="customer-service-page" class="v-route-hero">
        <div>
          <h2>Öncelikli destek hattı</h2>
          <p>Telefonla ulaşım sadece ücretli abonelerde aktifleştirilir; plan bilgisi aktif abonelik üzerinden okunur.</p>
        </div>
      </AppCard>

      <AppCard padding="lg" class="v-subscription-access">
        <span class="v-content-list-item__icon"><AppIcon :name="subscription.hasPaidSubscription ? 'phone' : 'crown'" :size="22" /></span>
        <div>
          <h3>Telefon desteği</h3>
          <p>{{ subscription.hasPaidSubscription ? `${subscription.activeSubscriptionPlan} planı aktif.` : "telefonla ulaşım sadece ücretli abonelerde aktifleştirilir" }}</p>
          <strong data-testid="customer-service-phone-number">444 23 68</strong>
        </div>
        <AppButton icon="crown" data-testid="customer-service-upgrade" @click="router.push('/subscription')">
          Aboneliğim
        </AppButton>
      </AppCard>
    </div>
  </AppPage>
</template>
