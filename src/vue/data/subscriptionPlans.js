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

export const subscriptionPlans = [
  {
    id: "plus",
    title: "Plus",
    monthlyPrice: 249,
    annualPrice: 2388,
    monthlyEquivalent: 199,
    trialDays: 30,
    recommended: true,
    targetUser: "Çoğu partner için",
    benefits: [
      "Plus profil rozeti",
      "Güçlendirilmiş profil kartı",
      "Müşteri hizmetleri erişimi",
      "Canlı destek",
      "Performans önerileri",
      "Gelişmiş paylaşım araçları",
    ],
    entitlements: ["plus_badge", "customer_service", "live_support", "profile_tools"],
    badge: "Önerilen",
    tone: "success",
    sortOrder: 1,
  },
  {
    id: "pro",
    title: "Gold",
    monthlyPrice: 499,
    annualPrice: 4788,
    monthlyEquivalent: 399,
    trialDays: 0,
    recommended: false,
    targetUser: "Yoğun çalışanlar için",
    benefits: [
      "Plus avantajlarının tamamı",
      "Gelişmiş performans raporları",
      "Öncelikli destek",
      "Gelişmiş profil görünürlüğü",
      "Ek büyüme içgörüleri",
    ],
    entitlements: ["plus_all", "advanced_reports", "priority_support", "growth_insights"],
    badge: "Daha fazla",
    tone: "info",
    sortOrder: 2,
  },
  {
    id: "vip",
    title: "VIP",
    monthlyPrice: 899,
    annualPrice: 8628,
    monthlyEquivalent: 719,
    trialDays: 0,
    recommended: false,
    targetUser: "Maksimum destek isteyenler için",
    benefits: [
      "Gold avantajlarının tamamı",
      "Telefon desteği",
      "VIP profil görünümü",
      "Öncelikli profil incelemesi",
      "Özel destek deneyimi",
    ],
    entitlements: ["pro_all", "phone_support", "vip_profile", "profile_review"],
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
  benefits: ["Temel profil", "Standart bildirimler", "Temel paylaşım"],
  entitlements: ["basic_profile"],
  badge: "Mevcut",
  sortOrder: 0,
};

export const subscriptionUsageItems = [
  { label: "Plus profil rozeti", value: "Aktif", icon: "user" },
  { label: "Müşteri hizmetleri", value: "2 görüşme", icon: "headphones" },
  { label: "Performans önerileri", value: "4 öneri", icon: "trend-up" },
];

export const subscriptionTrustLinks = ["Koşullar", "Gizlilik", "Satın alımları geri yükle"];

export const paywallRemoteConfig = {
  paywallVariant: "plus_focus",
  trialVariant: "trial_30_days",
  defaultBillingPeriod: BILLING_PERIODS.MONTHLY,
};

export const subscriptionKpis = [
  "Paywall view → CTA",
  "CTA → checkout",
  "Checkout → purchase",
  "Trial start",
  "İlk 24 saat premium özellik aktivasyonu",
  "Trial → paid",
  "İlk aylık yenileme",
  "İptal oranı",
  "Reactivation",
  "Revenue per paywall view",
];
