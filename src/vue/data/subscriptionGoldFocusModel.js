export const subscriptionGoldFocusCopy = {
  heroLines: ["Daha güçlü görün.", "Daha hızlı destek al.", "Daha çok fırsat yakala."],
  heroCopy: "Gold ile profil rozetin, öncelikli destek ve gelişmiş araçların ödeme sonrası hemen aktif olur.",
  recommendedBadge: "ÖNERİLEN",
  selectedPlanPrefix: "Sana en uygun plan:",
  selectedPlanSupport: "Gold, görünürlük ve destek dengesinde en güçlü seçenektir.",
  activationNote: "Ödeme sonrası hemen aktif",
  socialProofTitle: "Partnerler Gold'u tercih ediyor",
  socialProofQuote: "Profilim daha güçlü görünüyor ve destek taleplerim daha hızlı sonuçlanıyor.",
  whyTitle: "Bu plan neden sana uygun?",
  safeTitle: "Güvenli ve şeffaf",
};

export const subscriptionPlanDisplay = {
  plus: {
    icon: "star",
    tone: "plus",
    descriptor: "Başlangıç",
    decisionSupport: "Plus, temel görünürlük ve standart destek avantajlarını hemen açar.",
    compactBenefits: ["Daha fazla görünürlük", "Standart destek", "Profil kartı güçlendirme"],
    decisionBenefits: ["Plus profil rozeti", "Standart destek", "Profil kartı güçlendirme", "Temel performans önerileri"],
  },
  gold: {
    icon: "crown",
    tone: "gold",
    descriptor: "En iyi değer",
    recommended: true,
    decisionSupport: "Gold, görünürlük ve destek dengesinde en güçlü seçenektir.",
    compactBenefits: ["Gold profil rozeti", "Öncelikli destek", "Plus'taki her şey", "Gelişmiş paylaşım araçları"],
    decisionBenefits: ["Gold profil rozeti", "Öncelikli destek", "Plus'taki her şey", "Gelişmiş paylaşım araçları"],
  },
  vip: {
    icon: "zap",
    tone: "vip",
    descriptor: "Maksimum",
    decisionSupport: "VIP, telefon desteği ve en hızlı destek isteyen partnerler içindir.",
    compactBenefits: ["VIP profil rozeti", "Telefon desteği", "En hızlı destek"],
    decisionBenefits: ["VIP profil rozeti", "Telefon desteği", "En hızlı destek", "Gold'daki her şey"],
  },
};

export const trustTiles = [
  { id: "instant", icon: "zap", title: "Hemen aktif", subtitle: "Ödeme sonrası açılır" },
  { id: "secure", icon: "shield", title: "Güvenli ödeme", subtitle: "Korumalı işlem" },
  { id: "change", icon: "refresh", title: "Plan değişimi", subtitle: "Dilediğin zaman" },
];

export const whyGoldBenefits = [
  { id: "visibility", icon: "check", title: "Profilini daha güçlü göstermek istiyorsun" },
  { id: "support", icon: "check", title: "Yardıma daha hızlı ulaşmak istiyorsun" },
  { id: "tools", icon: "check", title: "Paylaşım ve büyüme araçlarını kullanmak istiyorsun" },
];

export const safeAndTransparentItems = [
  "Gizli ücret yok",
  "Her ay otomatik yenilenir",
  "İstediğin zaman iptal edebilirsin",
  "Satın alımları geri yükleyebilirsin",
];

export const faqPreviewItems = [
  {
    id: "change-plan",
    question: "Planımı değiştirebilir miyim?",
    answer: "Evet. Planını dilediğin zaman değiştirebilirsin; seçtiğin plan ödeme onayında tekrar gösterilir.",
  },
  {
    id: "annual-benefit",
    question: "Yıllık avantaj nedir?",
    answer: "Yıllık ödeme seçildiğinde toplam yıllık tutar ve aylık karşılığı açıkça gösterilir.",
  },
  {
    id: "activation",
    question: "Ne zaman aktif olur?",
    answer: "Satın alma tamamlandığında rozet, destek ve görünürlük avantajları hemen aktif görünür.",
  },
];

export function getAssetPath(fileName) {
  const base = typeof import.meta !== "undefined" ? import.meta.env.BASE_URL : "/";
  return `${base}assets/subscription-gold-focus/${fileName}`;
}

export function getDisplayPlan(plan) {
  const display = subscriptionPlanDisplay[plan?.id] || {};
  return {
    ...plan,
    ...display,
    descriptor: display.descriptor || plan?.targetUser || "Plan",
    compactBenefits: display.compactBenefits || plan?.benefits || [],
    decisionBenefits: display.decisionBenefits || plan?.benefits || [],
    decisionSupport: display.decisionSupport || subscriptionGoldFocusCopy.selectedPlanSupport,
    icon: display.icon || plan?.icon || "star",
    tone: display.tone || plan?.tone || plan?.id || "plus",
    recommended: Boolean(display.recommended || plan?.recommended),
  };
}

export function formatSubscriptionPrice(value) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(Number(value || 0));
}

export function getPlanCtaCopy(plan) {
  const title = String(plan?.title || "Plan").toLocaleUpperCase("tr-TR");
  if (title === "VIP") return "VIP'E GEÇ";
  if (title === "GOLD") return "GOLD'A GEÇ";
  if (title === "PLUS") return "PLUS'A GEÇ";
  return `${title} PLANINA GEÇ`;
}

export function getPlanPriceCopy(plan, billingPeriod = "monthly") {
  const price = billingPeriod === "annual" ? plan?.annualPrice : plan?.monthlyPrice;
  const suffix = billingPeriod === "annual" ? "yıl" : "ay";
  return `${formatSubscriptionPrice(price)} TL / ${suffix}`;
}

export function getPlanSecondaryPriceCopy(plan, billingPeriod = "monthly") {
  if (billingPeriod === "annual") {
    return `Aylık karşılığı ${formatSubscriptionPrice(plan?.monthlyEquivalent)} TL`;
  }

  const daily = Number(plan?.monthlyPrice || 0) / 30;
  return `Günde yaklaşık ${daily.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`;
}

export function buildCheckoutQuery(plan, billingPeriod = "monthly") {
  return {
    plan: plan?.id || "gold",
    billing: billingPeriod === "annual" ? "annual" : "monthly",
  };
}
