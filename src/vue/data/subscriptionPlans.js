export const USD_TRY_RATE = 46.4761;

function usdToTry(usd) {
  return Math.round(usd * USD_TRY_RATE);
}

function annualPriceFromMonthly(monthlyPrice) {
  return monthlyPrice * 10;
}

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
    advantageCopy: "Yıllık · 2 ay ücretsiz",
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
    id: "plus",
    title: "Plus",
    usdPrice: 20,
    monthlyPrice: usdToTry(20),
    targetUser: "Başlangıç",
    shortPromise: "Daha görünür bir profil ve temel destek.",
    benefits: [
      "Daha fazla görünürlük",
      "Standart destek",
      "Profil kartı güçlendirme",
      "Temel performans önerileri",
    ],
    reasons: [
      "Profilini ücretsiz kullanımdan daha güçlü göstermek istiyorsun",
      "Destek ihtiyacında standart müşteri hizmetlerine ulaşmak istiyorsun",
      "Düşük maliyetle abonelik avantajlarını başlatmak istiyorsun",
    ],
    entitlements: {
      badge: "Plus",
      customerService: "standart müşteri hizmetleri",
      phoneSupport: false,
      prioritySupport: false,
    },
    ctaLabel: "PLUS'A GEÇ",
    sentenceLabel: "Plus'a geç",
    badge: "PLUS",
    tone: "green",
    icon: "star",
    recommended: false,
    sortOrder: 1,
  },
  {
    id: "gold",
    title: "Gold",
    usdPrice: 45,
    monthlyPrice: usdToTry(45),
    targetUser: "En iyi değer",
    shortPromise: "Daha hızlı destek ve daha güçlü görünüm.",
    benefits: [
      "Gold profil rozeti",
      "Öncelikli destek",
      "Plus'taki her şey",
      "Gelişmiş paylaşım araçları",
      "Özel performans önerileri",
    ],
    reasons: [
      "Daha güçlü görünmek ve daha hızlı destek almak istiyorsun",
      "Profil kartını daha ikna edici hale getirmek istiyorsun",
      "Fiyat ve performans dengesinde en avantajlı planı istiyorsun",
    ],
    entitlements: {
      badge: "Gold",
      customerService: "öncelikli müşteri hizmetleri",
      phoneSupport: false,
      prioritySupport: true,
    },
    ctaLabel: "GOLD'A GEÇ",
    sentenceLabel: "Gold'a geç",
    badge: "ÖNERİLEN",
    tone: "gold",
    icon: "crown",
    recommended: true,
    sortOrder: 2,
  },
  {
    id: "vip",
    title: "VIP",
    usdPrice: 75,
    monthlyPrice: usdToTry(75),
    targetUser: "Maksimum",
    shortPromise: "En yüksek görünürlük ve ayrıcalıklı deneyim.",
    benefits: [
      "VIP profil rozeti",
      "Telefon desteği",
      "En hızlı destek",
      "Gold'daki her şey",
      "VIP profil görünümü",
      "Öncelikli profil incelemesi",
    ],
    reasons: [
      "Telefon ve en hızlı destek istiyorsun",
      "Profil görünümünü en güçlü seviyeye taşımak istiyorsun",
      "Yoğun iş akışında en yüksek destek deneyimini istiyorsun",
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
    tone: "purple",
    icon: "zap",
    recommended: false,
    sortOrder: 3,
  },
]
  .map((plan) => ({
    ...plan,
    annualPrice: annualPriceFromMonthly(plan.monthlyPrice),
    monthlyEquivalent: Math.round(annualPriceFromMonthly(plan.monthlyPrice) / 12),
  }))
  .sort((a, b) => a.sortOrder - b.sortOrder);

export const recommendedPlanId = "gold";

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
