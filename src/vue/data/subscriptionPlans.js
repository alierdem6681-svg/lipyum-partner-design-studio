export const BILLING_PERIODS = {
  MONTHLY: "monthly",
  ANNUAL: "annual",
};

export const SUBSCRIPTION_STATUSES = {
  FREE: "free",
  TRIAL: "trial",
  ACTIVE: "active",
  CANCELED_ACTIVE: "canceled_active",
  PAYMENT_ISSUE: "payment_issue",
  EXPIRED: "expired",
};

export const SUBSCRIPTION_QUERY_STATE_MAP = {
  free: SUBSCRIPTION_STATUSES.FREE,
  trial: SUBSCRIPTION_STATUSES.TRIAL,
  active: SUBSCRIPTION_STATUSES.ACTIVE,
  canceled: SUBSCRIPTION_STATUSES.CANCELED_ACTIVE,
  "payment-issue": SUBSCRIPTION_STATUSES.PAYMENT_ISSUE,
  expired: SUBSCRIPTION_STATUSES.EXPIRED,
};

export const recommendedPlanId = "plus";

export const subscriptionPlans = [
  {
    id: "gold",
    title: "Gold",
    monthlyPrice: 249,
    annualPrice: 2388,
    monthlyEquivalent: 199,
    annualSavingsPercent: 20,
    trialDays: 30,
    recommended: false,
    targetUser: "Temel profesyonel avantajlar",
    benefits: [
      "Gold profil rozeti",
      "Geliştirilmiş profil kartı",
      "Standart müşteri hizmetleri",
      "Temel performans önerileri",
    ],
    entitlements: ["gold_badge", "profile_card_plus", "customer_service_standard", "basic_performance_tips"],
    badge: "Başlangıç",
    tone: "gold",
    sortOrder: 1,
  },
  {
    id: "plus",
    title: "Plus",
    monthlyPrice: 499,
    annualPrice: 4788,
    monthlyEquivalent: 399,
    annualSavingsPercent: 20,
    trialDays: 30,
    recommended: true,
    recommendationLabel: "Önerilen",
    recommendationReason: "Çalışma şekline uygun",
    targetUser: "Büyümek isteyen partnerler için",
    benefits: [
      "Plus profil rozeti",
      "Hızlı müşteri hizmetleri",
      "Güçlendirilmiş profil kartı",
      "Gelişmiş paylaşım araçları",
      "Performansını geliştiren özel öneriler",
    ],
    entitlements: [
      "plus_badge",
      "customer_service_fast",
      "profile_card_plus",
      "advanced_share_tools",
      "performance_recommendations",
      "live_support",
    ],
    badge: "Önerilen",
    tone: "success",
    sortOrder: 2,
  },
  {
    id: "vip",
    title: "VIP",
    monthlyPrice: 899,
    annualPrice: 8628,
    monthlyEquivalent: 719,
    annualSavingsPercent: 20,
    trialDays: 30,
    recommended: false,
    targetUser: "Maksimum destek isteyen partnerler için",
    benefits: [
      "VIP profil rozeti",
      "Telefon desteği",
      "Öncelikli müşteri hizmetleri",
      "VIP profil görünümü",
      "Gelişmiş performans içgörüleri",
      "Öncelikli profil incelemesi",
    ],
    entitlements: [
      "vip_badge",
      "phone_support",
      "customer_service_priority",
      "vip_profile",
      "advanced_performance_insights",
      "priority_profile_review",
    ],
    badge: "En güçlü",
    tone: "premium",
    sortOrder: 3,
  },
];

export const freePlan = {
  id: "free",
  title: "Free",
  monthlyPrice: 0,
  annualPrice: 0,
  monthlyEquivalent: 0,
  trialDays: 0,
  recommended: false,
  targetUser: "Mevcut temel durum",
  benefits: ["Temel kullanım aktif", "Standart bildirimler", "Temel profil görünümü"],
  entitlements: ["basic_profile"],
  badge: "Mevcut plan",
  sortOrder: 0,
};

export const subscriptionUsageItems = [
  { label: "Plus profil rozeti", value: "Aktif", icon: "crown" },
  { label: "Müşteri hizmetleri", value: "2 görüşme", icon: "headphones" },
  { label: "Performans önerileri", value: "4 öneri", icon: "trend-up" },
];

export const subscriptionTrustLinks = ["Gizli ücret yok", "Satın alımları geri yükle", "Koşullar", "Gizlilik"];

export const paywallRemoteConfig = {
  paywallVariant: "plus_focus",
  trialVariant: "trial_30_days",
  defaultBillingPeriod: BILLING_PERIODS.MONTHLY,
};

export const subscriptionKpis = [
  "Paywall view -> CTA",
  "CTA -> checkout",
  "Checkout -> purchase",
  "Trial start",
  "İlk 24 saat premium özellik aktivasyonu",
  "Trial -> paid",
  "İlk aylık yenileme",
  "İptal oranı",
  "Reactivation",
  "Revenue per paywall view",
];
