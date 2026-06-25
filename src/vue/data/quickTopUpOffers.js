const moneyFormatter = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 0,
});

export const DEFAULT_QUICK_TOPUP_OFFER_ID = "max-value";

export const quickTopUpVisibleOffers = Object.freeze([
  {
    id: "starter",
    balanceAmount: 1692,
    appliedBonus: 0,
    estimatedJobs: "1 iş",
    badge: "",
  },
  {
    id: "recommended",
    balanceAmount: 3383,
    appliedBonus: 90,
    estimatedJobs: "1-2 iş",
    badge: "Önerilen",
  },
  {
    id: "max-value",
    balanceAmount: 8457,
    appliedBonus: 90,
    estimatedJobs: "2-3 iş",
    badge: "En avantajlı",
  },
]);

export const quickTopUpAdditionalOffers = Object.freeze([
  {
    id: "growth",
    balanceAmount: 5074,
    appliedBonus: 90,
    estimatedJobs: "2 iş",
    badge: "",
  },
  {
    id: "pro",
    balanceAmount: 12686,
    appliedBonus: 180,
    estimatedJobs: "4-5 iş",
    badge: "Yüksek bakiye",
  },
]);

export const quickTopUpPaymentMethods = Object.freeze([
  {
    id: "visa-9092",
    label: "Kredi Kartı",
    maskedNumber: "•••• 9092",
    description: "Kayıtlı kart",
  },
  {
    id: "mastercard-4242",
    label: "Kredi Kartı",
    maskedNumber: "•••• 4242",
    description: "Yedek kart",
  },
]);

export function formatQuickTopUpMoney(value) {
  const amount = Number(value);
  return `₺${moneyFormatter.format(Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0)}`;
}

export function formatQuickTopUpTl(value) {
  const amount = Number(value);
  return `TL ${moneyFormatter.format(Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0)}`;
}

export function formatQuickTopUpBonus(value) {
  const amount = Number(value);
  return `${moneyFormatter.format(Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0)} TL Bonus`;
}

export function getQuickTopUpOffers() {
  return [...quickTopUpVisibleOffers, ...quickTopUpAdditionalOffers];
}

export function getQuickTopUpOfferById(id) {
  return getQuickTopUpOffers().find((offer) => offer.id === id)
    || quickTopUpVisibleOffers.find((offer) => offer.id === DEFAULT_QUICK_TOPUP_OFFER_ID)
    || quickTopUpVisibleOffers[0];
}

export function buildQuickTopUpSummary(offer) {
  const balanceAmount = Math.max(0, Math.round(Number(offer?.balanceAmount) || 0));
  const appliedBonus = Math.max(0, Math.min(balanceAmount, Math.round(Number(offer?.appliedBonus) || 0)));
  const payableAmount = Math.max(0, balanceAmount - appliedBonus);

  return {
    offerId: offer?.id || "",
    balanceAmount,
    appliedBonus,
    payableAmount,
    estimatedJobs: offer?.estimatedJobs || "1 iş",
  };
}
