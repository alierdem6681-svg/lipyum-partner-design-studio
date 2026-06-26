export const subscriptionGoldFocusCopy = {
  heroLines: ["Daha güçlü görün.", "Daha çok fırsat yakala."],
  heroCopy: "",
  recommendedBadge: "ÖNERİLEN",
  selectedPlanPrefix: "Sana en uygun plan:",
  selectedPlanSupport: "Fiyat-performans dengesiyle en çok tercih edilen plan.",
  activationNote: "Ödeme sonrası hemen aktif",
  socialProofTitle: "Partnerler Gold’u tercih ediyor",
  socialProofQuote: "Görünürlüğüm arttı, destek taleplerim daha hızlı cevaplanıyor.",
  whyTitle: "Bu plan neden sana uygun?",
  safeTitle: "Güvenli ve şeffaf",
};

export const subscriptionPlanDisplay = {
  plus: {
    icon: "star",
    tone: "green",
    descriptor: "Başlangıç",
    compactBenefits: ["Daha fazla görünürlük", "Standart destek", "Profil kartı güçlendirme"],
    decisionBenefits: ["Plus profil avantajı", "Standart destek", "Profil kartı güçlendirme", "Temel görünürlük"],
  },
  gold: {
    icon: "crown",
    tone: "gold",
    descriptor: "En çok tercih edilen",
    recommended: true,
    compactBenefits: ["Gold profil rozeti", "Öncelikli destek", "Plus’taki her şey", "Gelişmiş paylaşım araçları"],
    decisionBenefits: ["Gold profil rozeti", "Öncelikli destek", "Plus’taki her şey", "Gelişmiş paylaşım araçları"],
  },
  vip: {
    icon: "zap",
    tone: "purple",
    descriptor: "Maksimum destek",
    compactBenefits: ["VIP profil rozeti", "Telefon desteği", "En hızlı destek"],
    decisionBenefits: ["VIP profil rozeti", "Telefon desteği", "En hızlı destek", "Gold’daki her şey"],
  },
};

export const trustTiles = [
  { id: "instant", icon: "zap", title: "Ödeme sonrası hemen aktif", subtitle: "" },
  { id: "secure", icon: "shield", title: "Güvenli ödeme", subtitle: "" },
  { id: "change", icon: "refresh", title: "Dilediğin zaman değiştir", subtitle: "" },
];

export const whyGoldBenefits = [
  { id: "jobs", icon: "check", title: "Daha fazla iş" },
  { id: "profile", icon: "check", title: "Güçlü profil" },
  { id: "cost", icon: "check", title: "Az Öde" },
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
    answer: "Evet. Planını dilediğin zaman değiştirebilirsin; değişiklikler seçilen plana göre uygulanır.",
  },
  {
    id: "annual-benefit",
    question: "Yıllık avantaj nedir?",
    answer: "Yıllık ödeme seçildiğinde 2 ay ücretsiz avantajı gösterilir ve ödeme onayında tekrar belirtilir.",
  },
  {
    id: "activation",
    question: "Ne zaman aktif olur?",
    answer: "Mock satın alma tamamlandığında rozet, destek ve görünürlük avantajları hemen aktif görünür.",
  },
];

export function getDisplayPlan(plan) {
  const display = subscriptionPlanDisplay[plan?.id] || {};
  return {
    ...display,
    ...plan,
    descriptor: display.descriptor || plan?.targetUser || "Plan",
    compactBenefits: display.compactBenefits || plan?.benefits || [],
    decisionBenefits: display.decisionBenefits || plan?.benefits || [],
    icon: display.icon || plan?.icon || "star",
    tone: display.tone || plan?.tone || plan?.id || "green",
  };
}

export function formatSubscriptionPrice(value) {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(Number(value || 0));
}

export function getPlanCtaCopy(plan) {
  const title = String(plan?.title || "Plan").toLocaleUpperCase("tr-TR");
  if (title === "VIP") return "VIP’E GEÇ";
  if (title === "GOLD") return "GOLD’A GEÇ";
  if (title === "PLUS") return "PLUS’A GEÇ";
  return `${title} PLANINA GEÇ`;
}

export function getPlanPriceCopy(plan, billingPeriod = "monthly") {
  const price = billingPeriod === "annual" ? plan?.monthlyEquivalent || plan?.monthlyPrice : plan?.monthlyPrice;
  return `${formatSubscriptionPrice(price)} TL / ay`;
}

export function buildCheckoutQuery(plan, billingPeriod = "monthly") {
  return {
    plan: plan?.id || "gold",
    billing: billingPeriod === "annual" ? "annual" : "monthly",
  };
}
