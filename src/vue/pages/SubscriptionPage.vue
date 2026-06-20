<script setup>
import AppBadge from "../components/ui/AppBadge.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

const shell = useAppShellStore();
const subscription = useSubscriptionStore();
const plans = [
  {
    id: "Free",
    title: "Free",
    price: "0 TL",
    body: "Temel görünürlük ve standart destek.",
    promise: "Başlangıç seviyesi",
    icon: "shield",
    perks: ["Temel profil", "Standart bildirim", "Public kart önizleme"],
  },
  {
    id: "Plus",
    title: "Plus",
    price: "249 TL",
    body: "Daha fazla görünürlük ve destek hakkı.",
    promise: "Büyüme planı",
    icon: "sparkles",
    perks: ["Müşteri Hizmetleri", "Profil kart avantajı", "Öncelikli görünürlük"],
  },
  {
    id: "Pro",
    title: "Pro",
    price: "499 TL",
    body: "Öncelikli destek ve gelişmiş raporlar.",
    promise: "Yoğun iş akışı",
    icon: "crown",
    featured: true,
    perks: ["Öncelikli dönüş", "Yüksek görünürlük", "Liderlik avantajı"],
  },
  {
    id: "VIP",
    title: "VIP",
    price: "899 TL",
    body: "Maksimum görünürlük ve özel destek.",
    promise: "En güçlü seviye",
    icon: "trophy",
    perks: ["VIP destek", "Public kart güçlendirme", "Telefon destek önceliği"],
  },
];

function selectPlan(plan) {
  subscription.selectPlan(plan.id === "Free" ? null : plan.id);
  shell.showToast(`${plan.title} planı seçildi.`);
}
</script>

<template>
  <AppPage title="Aboneliğim" class="subscription-page" data-testid="subscription-page">
    <AppCard class="subscription-hero">
      <div class="subscription-hero-top">
        <span class="subscription-plan-badge">
          <AppIcon name="crown" :size="16" />
          <span data-testid="subscription-active-plan">Aktif plan: {{ subscription.activeSubscriptionPlan || "Free" }}</span>
        </span>
        <AppBadge :tone="subscription.hasPaidSubscription ? 'premium' : 'neutral'">
          {{ subscription.hasPaidSubscription ? "Ücretli erişim aktif" : "Temel plan" }}
        </AppBadge>
      </div>
      <h2>Aboneliğim</h2>
      <p>Profil, destek ve görünürlük avantajlarını tek plan üzerinden yönet.</p>
      <div class="subscription-mini-benefits">
        <span><AppIcon name="phone" :size="14" /> Müşteri Hizmetleri</span>
        <span><AppIcon name="star" :size="14" /> Public kart avantajı</span>
        <span><AppIcon name="trend-up" :size="14" /> Görünürlük artışı</span>
      </div>
    </AppCard>

    <section class="subscription-rail-wrap" aria-label="Abonelik planları">
      <div class="subscription-rail-hint">
        <strong>Planını seç</strong>
        <span>Free / Plus / Pro / VIP</span>
      </div>
      <div class="subscription-rail">
        <AppCard
          v-for="plan in plans"
          :key="plan.id"
          :class="['subscription-card', plan.featured ? 'featured' : '']"
          as="article"
        >
          <div class="subscription-card-head">
            <span class="subscription-plan-icon"><AppIcon :name="plan.icon" :size="20" /></span>
            <span class="subscription-title-block">
              <h3>{{ plan.title }}</h3>
              <small>{{ plan.promise }}</small>
            </span>
          </div>
          <p class="subscription-price"><strong>{{ plan.price }}</strong><small>/ ay</small></p>
          <p class="subscription-promise">{{ plan.body }}</p>
          <div class="subscription-feature-list">
            <span v-for="perk in plan.perks" :key="perk"><AppIcon name="check" :size="14" /> {{ perk }}</span>
          </div>
          <div class="subscription-card-actions">
            <AppButton
              class="subscription-plan-cta"
              size="sm"
              :variant="(subscription.activeSubscriptionPlan || 'Free') === plan.id ? 'secondary' : 'primary'"
              :data-testid="`subscription-plan-${plan.id.toLowerCase()}`"
              @click="selectPlan(plan)"
            >
              {{ (subscription.activeSubscriptionPlan || "Free") === plan.id ? "Aktif plan" : "Planı seç" }}
            </AppButton>
            <small>{{ plan.id === "Free" ? "Yükseltme gerektirmez" : "Anında mock geçiş" }}</small>
          </div>
        </AppCard>
      </div>
      <div class="subscription-dots" aria-hidden="true"><span></span><span></span><span></span></div>
    </section>

    <AppCard class="subscription-current-card">
      <div class="subscription-current-row">
        <span>
          <strong>{{ subscription.activeSubscriptionPlan || "Free" }}</strong>
          <small>Geçerli abonelik planı</small>
        </span>
        <span class="subscription-status-pill">{{ subscription.hasPaidSubscription ? "Aktif" : "Temel" }}</span>
      </div>
      <div class="subscription-cancel-box">
        <p>Plan seçimi mock akıştır. Müşteri Hizmetleri erişimi aktif abonelik durumuna bağlıdır.</p>
      </div>
    </AppCard>
  </AppPage>
</template>
