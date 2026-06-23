export const BILLING_PERIODS = {
  monthly: {
    id: "monthly",
    label: "Aylık",
    suffix: "ay",
    periodCopy: "Her ay otomatik yenilenir",
  },
  annual: {
    id: "annual",
    label: "Yıllık",
    suffix: "yıl",
    periodCopy: "Her yıl otomatik yenilenir",
    advantageCopy: "Yıllık %20 avantaj",
  },
};

export const freeSubscriptionPlan = {
  id: "free",
  title: "Free",
  badge: "MEVCUT PLAN",
  shortPromise: "Temel kullanım aktif",
  targetUser: "Temel kullanım",
  entitlements: {
    badge: "Free",
    customerService: "standart destek",
    phoneSupport: false,
    prioritySupport: false,
  },
};

export const subscriptionPlans = [
  {
    id: "gold",
    title: "Gold",
    monthlyPrice: 249,
    annualPrice: 2390,
    monthlyEquivalent: 199,
    targetUser: "Temel profesyonel avantajlar",
    shortPromise: "Profilini daha profesyonel göster.",
    benefits: [
      "Gold profil rozeti",
      "Geliştirilmiş profil kartı",
      "Standart müşteri hizmetleri",
      "Temel performans önerileri",
    ],
    reasons: [
      "Profil kartında profesyonel rozet istiyorsun",
      "Temel destek kanallarını kullanmak istiyorsun",
      "Profilini daha düzenli göstermek istiyorsun",
    ],
    entitlements: {
      badge: "Gold",
      customerService: "standart müşteri hizmetleri",
      phoneSupport: false,
      prioritySupport: false,
    },
    ctaLabel: "GOLD'A GEÇ",
    sentenceLabel: "Gold'a geç",
    badge: "GOLD",
    recommended: false,
    sortOrder: 1,
  },
  {
    id: "plus",
    title: "Plus",
    monthlyPrice: 499,
    annualPrice: 4790,
    monthlyEquivalent: 399,
    targetUser: "Büyümek isteyen partnerler için",
    shortPromise: "Daha hızlı destek ve güçlü profil araçları.",
    benefits: [
      "Plus profil rozeti",
      "Hızlı müşteri hizmetleri",
      "Güçlendirilmiş profil kartı ve paylaşım",
      "Gelişmiş paylaşım araçları",
      "Özel performans önerileri",
    ],
    reasons: [
      "Profil kartını daha güçlü göstermek istiyorsun",
      "Yardıma ihtiyaç duyduğunda hızlı destek istiyorsun",
      "Performansını artıracak net öneriler görmek istiyorsun",
    ],
    entitlements: {
      badge: "Plus",
      customerService: "hızlı müşteri hizmetleri",
      phoneSupport: false,
      prioritySupport: true,
    },
    ctaLabel: "PLUS'A GEÇ",
    sentenceLabel: "Plus'a geç",
    badge: "ÖNERİLEN",
    recommended: true,
    sortOrder: 2,
  },
  {
    id: "vip",
    title: "VIP",
    monthlyPrice: 899,
    annualPrice: 8630,
    monthlyEquivalent: 719,
    targetUser: "Maksimum destek isteyen partnerler için",
    shortPromise: "En güçlü görünüm ve öncelikli destek.",
    benefits: [
      "VIP profil rozeti",
      "Telefon desteği",
      "Öncelikli müşteri hizmetleri",
      "VIP profil görünümü",
      "Gelişmiş performans içgörüleri",
      "Öncelikli profil incelemesi",
    ],
    reasons: [
      "Telefon ve öncelikli destek istiyorsun",
      "Profil görünümünü en güçlü seviyeye taşımak istiyorsun",
      "Yoğun iş akışında daha fazla destek bekliyorsun",
    ],
    entitlements: {
      badge: "VIP",
      customerService: "telefon ve öncelikli destek",
      phoneSupport: true,
      prioritySupport: true,
    },
    ctaLabel: "VIP'E GEÇ",
    sentenceLabel: "VIP'e geç",
    badge: "VIP",
    recommended: false,
    sortOrder: 3,
  },
].sort((a, b) => a.sortOrder - b.sortOrder);

export const recommendedPlanId = "plus";

export const subscriptionStatusAliases = {
  canceled: "canceled_active",
  "payment-issue": "payment_issue",
};

export function normalizeSubscriptionStatus(status) {
  const normalized = subscriptionStatusAliases[status] || status;
  return ["free", "active", "canceled_active", "payment_issue", "expired"].includes(normalized)
    ? normalized
    : "free";
}

export function getPlanById(planId) {
  return subscriptionPlans.find((plan) => plan.id === planId) || subscriptionPlans.find((plan) => plan.id === recommendedPlanId);
}

export function getPlanPrice(plan, billingPeriod = "monthly") {
  if (!plan) return 0;
  return billingPeriod === "annual" ? plan.annualPrice : plan.monthlyPrice;
}

export function getMonthlyEquivalent(plan, billingPeriod = "monthly") {
  if (!plan) return 0;
  return billingPeriod === "annual" ? plan.monthlyEquivalent : plan.monthlyPrice;
}

export function formatPrice(value) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(value);
}

export function planCtaLabel(plan) {
  return plan?.ctaLabel || "";
}

export function planSentenceLabel(plan) {
  return plan?.sentenceLabel || "";
}

export function nextRenewalDate(from = new Date()) {
  const date = new Date(from);
  date.setMonth(date.getMonth() + 1);
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
