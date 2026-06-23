export function clampMoney(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.round(number * 100) / 100;
}

export function calculateApplicableBonus({ bonusBalance, topUpAmount, rules, useBonus = true }) {
  if (!useBonus) return 0;
  const amount = clampMoney(topUpAmount);
  const availableBonus = clampMoney(bonusBalance);
  const maxByRate = clampMoney(amount * rules.maxBonusUsageRate);
  return clampMoney(Math.min(availableBonus, rules.maxBonusUsageAmount, maxByRate));
}

export function calculateTopUpSummary({ workBalance, bonusBalance, topUpAmount, rules, useBonus = true }) {
  const amount = clampMoney(topUpAmount);
  const currentWorkBalance = clampMoney(workBalance);
  const currentBonusBalance = clampMoney(bonusBalance);
  const appliedBonus = calculateApplicableBonus({ bonusBalance: currentBonusBalance, topUpAmount: amount, rules, useBonus });
  const payableAmount = clampMoney(amount - appliedBonus);
  return {
    topUpAmount: amount,
    appliedBonus,
    payableAmount,
    resultingWorkBalance: clampMoney(currentWorkBalance + amount),
    resultingBonusBalance: clampMoney(currentBonusBalance - appliedBonus),
  };
}

export function estimateJobCount(workBalance, averageJobAcquisitionCost) {
  const cost = clampMoney(averageJobAcquisitionCost);
  if (!cost) return 0;
  return Math.floor(clampMoney(workBalance) / cost);
}

export function formatEstimatedJobRange(workBalance, averageJobAcquisitionCost) {
  const count = estimateJobCount(workBalance, averageJobAcquisitionCost);
  if (count <= 0) return "0 iş";
  if (count === 1) return "yaklaşık 1 iş";
  return `yaklaşık ${count}-${count + 1} iş`;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(clampMoney(value));
}
