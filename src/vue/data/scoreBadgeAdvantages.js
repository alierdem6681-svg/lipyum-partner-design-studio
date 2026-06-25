export const scoreBadgeAdvantagesCopy = {
  title: "Skor rozet avantajları",
  subtitle: "Skor yükseldikçe maliyetin düşer.",
  note:
    "İndirim ve iş fırsatı etkisi bölge, sektör, talep yoğunluğu ve aktif çalışma davranışına göre değişebilir.",
};

export const scoreBadgeBenefitTiers = [
  {
    id: "legend",
    tier: "EFSANE",
    score: "95+",
    tone: "legend",
    headlineStrong: "%50'ye kadar",
    headlineRest: "daha düşük fiyatla iş alabilirsin",
    secondary: "x3'e kadar daha fazla iş",
    secondaryIcon: "trend-up",
    emphasis: "primary",
    ariaLabel:
      "Efsane rozeti, doksan beş üstü skor, yüzde elliye kadar daha düşük fiyatla iş alabilirsin, üç kata kadar daha fazla iş.",
  },
  {
    id: "strong",
    tier: "GÜÇLÜ",
    score: "90+",
    tone: "strong",
    headlineStrong: "%30'a kadar",
    headlineRest: "daha düşük fiyatla iş alabilirsin",
    secondary: "x2'ye kadar daha fazla iş",
    secondaryIcon: "trend-up",
    emphasis: "standard",
    ariaLabel:
      "Güçlü rozeti, doksan üstü skor, yüzde otuza kadar daha düşük fiyatla iş alabilirsin, iki kata kadar daha fazla iş.",
  },
  {
    id: "high",
    tier: "YÜKSEK",
    score: "85+",
    tone: "high",
    headlineStrong: "%20'ye kadar",
    headlineRest: "daha düşük fiyatla iş alabilirsin",
    secondary: "Daha çok iş fırsatında güçlü görünüm",
    secondaryIcon: "user",
    emphasis: "standard",
    ariaLabel:
      "Yüksek rozeti, seksen beş üstü skor, yüzde yirmiye kadar daha düşük fiyatla iş alabilirsin, daha çok iş fırsatında güçlü görünüm.",
  },
];

export function getScoreBadgeTierByScore(score) {
  const numericScore = Number(score) || 0;
  if (numericScore >= 95) return scoreBadgeBenefitTiers[0];
  if (numericScore >= 90) return scoreBadgeBenefitTiers[1];
  if (numericScore >= 85) return scoreBadgeBenefitTiers[2];
  return null;
}

export function getScoreBadgeBenefitCopy(tierId) {
  return scoreBadgeBenefitTiers.find((tier) => tier.id === tierId) || null;
}
