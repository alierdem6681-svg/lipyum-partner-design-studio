<script setup>
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppBadge from "../components/ui/AppBadge.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

const shell = useAppShellStore();
const subscription = useSubscriptionStore();
const plans = [
  { id: "Free", title: "Free", body: "Temel görünürlük ve standart destek.", perks: ["Temel profil", "Standart bildirim"] },
  { id: "Plus", title: "Plus", body: "Daha fazla görünürlük ve destek hakkı.", perks: ["Müşteri Hizmetleri", "Profil kart avantajı"] },
  { id: "Pro", title: "Pro", body: "Öncelikli destek ve gelişmiş raporlar.", perks: ["Öncelikli dönüş", "Yüksek görünürlük"] },
  { id: "VIP", title: "VIP", body: "Maksimum görünürlük ve özel destek.", perks: ["VIP destek", "Public kart güçlendirme"] },
];

function selectPlan(plan) {
  subscription.selectPlan(plan.id === "Free" ? null : plan.id);
  shell.showToast(`${plan.title} planı seçildi.`);
}
</script>

<template>
  <AppPage title="Aboneliğim" data-testid="subscription-page">
    <div class="v-stack">
      <AppCard padding="lg" variant="hero" class="v-route-hero">
        <div>
          <h2>Aboneliğim</h2>
          <p data-testid="subscription-active-plan">Aktif plan: {{ subscription.activeSubscriptionPlan || "Free" }}</p>
        </div>
        <AppBadge :tone="subscription.hasPaidSubscription ? 'premium' : 'neutral'">
          {{ subscription.hasPaidSubscription ? "Ücretli erişim aktif" : "Temel plan" }}
        </AppBadge>
      </AppCard>
      <div class="v-plan-grid">
        <AppCard v-for="plan in plans" :key="plan.id" padding="md" as="article" class="v-plan-card">
          <h3>{{ plan.title }}</h3>
          <p>{{ plan.body }}</p>
          <ul>
            <li v-for="perk in plan.perks" :key="perk">{{ perk }}</li>
          </ul>
          <AppButton
            size="sm"
            :variant="(subscription.activeSubscriptionPlan || 'Free') === plan.id ? 'secondary' : 'primary'"
            :data-testid="`subscription-plan-${plan.id.toLowerCase()}`"
            @click="selectPlan(plan)"
          >
            {{ (subscription.activeSubscriptionPlan || "Free") === plan.id ? "Aktif plan" : "Planı seç" }}
          </AppButton>
        </AppCard>
      </div>
    </div>
  </AppPage>
</template>
