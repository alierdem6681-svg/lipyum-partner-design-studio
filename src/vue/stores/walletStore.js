import { defineStore } from "pinia";
import { walletInitialState, walletStatePresets } from "../data/walletMockData.js";
import { walletRules } from "../data/walletRules.js";
import {
  calculateApplicableBonus,
  calculateTopUpSummary,
  clampMoney,
  estimateJobCount,
  formatEstimatedJobRange,
} from "../data/walletCalculations.js";
import { walletService } from "../services/walletService.js";

const STORAGE_KEY = "lipyum.partner.wallet";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readSavedState() {
  if (typeof window === "undefined") return {};
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function buildInitialState() {
  return {
    ...clone(walletInitialState),
    ...readSavedState(),
  };
}

function transactionSort(a, b) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function createTransactionId() {
  return `txn-${Date.now().toString(36)}`;
}

export const useWalletStore = defineStore("wallet", {
  state: buildInitialState,
  getters: {
    selectedAmount(state) {
      return state.selectedTopUpAmount === "custom"
        ? clampMoney(state.customTopUpAmount)
        : clampMoney(state.selectedTopUpAmount);
    },
    estimatedJobCount(state) {
      return estimateJobCount(state.workBalance, walletRules.averageJobAcquisitionCost);
    },
    estimatedJobLabel(state) {
      return formatEstimatedJobRange(state.workBalance, walletRules.averageJobAcquisitionCost);
    },
    isLowBalance(state) {
      return state.workBalance > 0 && state.workBalance <= state.lowBalanceThreshold;
    },
    isZeroBalance(state) {
      return state.workBalance <= 0;
    },
    maxApplicableBonus(state) {
      return calculateApplicableBonus({
        bonusBalance: state.bonusBalance,
        topUpAmount: this.selectedAmount,
        rules: walletRules,
        useBonus: true,
      });
    },
    topUpSummary(state) {
      return calculateTopUpSummary({
        workBalance: state.workBalance,
        bonusBalance: state.bonusBalance,
        topUpAmount: this.selectedAmount,
        rules: walletRules,
        useBonus: state.useBonus,
      });
    },
    appliedBonus() {
      return this.topUpSummary.appliedBonus;
    },
    payableAmount() {
      return this.topUpSummary.payableAmount;
    },
    resultingWorkBalance() {
      return this.topUpSummary.resultingWorkBalance;
    },
    resultingBonusBalance() {
      return this.topUpSummary.resultingBonusBalance;
    },
    recentTransactions(state) {
      return [...state.transactions].sort(transactionSort).slice(0, 3);
    },
    bonusSavingsThisMonth(state) {
      return state.transactions
        .filter((transaction) => transaction.type === "top_up" && transaction.status === "completed")
        .reduce((total, transaction) => total + clampMoney(transaction.bonusAmount), 0);
    },
    nearestBonusExpiry(state) {
      return [...state.expiringBonuses]
        .filter((bonus) => bonus.status === "available")
        .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())[0] || null;
    },
    sortedTransactions(state) {
      return [...state.transactions].sort(transactionSort);
    },
  },
  actions: {
    persist() {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            workBalance: this.workBalance,
            bonusBalance: this.bonusBalance,
            pendingBonus: this.pendingBonus,
            expiringBonuses: this.expiringBonuses,
            transactions: this.transactions,
            selectedTopUpAmount: this.selectedTopUpAmount,
            customTopUpAmount: this.customTopUpAmount,
            useBonus: this.useBonus,
            lowBalanceAlertEnabled: this.lowBalanceAlertEnabled,
            lowBalanceThreshold: this.lowBalanceThreshold,
            autoTopUpEnabled: this.autoTopUpEnabled,
            autoTopUpThreshold: this.autoTopUpThreshold,
            autoTopUpAmount: this.autoTopUpAmount,
            autoTopUpMonthlyLimit: this.autoTopUpMonthlyLimit,
            lastTopUpAmount: this.lastTopUpAmount,
            lastTopUpResult: this.lastTopUpResult,
          }),
        );
      } catch {
        // Local storage can be unavailable in restricted contexts.
      }
    },
    applyPreset(presetName) {
      const preset = walletStatePresets[presetName];
      if (!preset) return;
      Object.assign(this, clone(walletInitialState), clone(preset));
      this.persist();
    },
    selectTopUpAmount(amount) {
      this.selectedTopUpAmount = amount;
      if (amount !== "custom") this.customTopUpAmount = "";
      this.persist();
    },
    setCustomTopUpAmount(amount) {
      this.selectedTopUpAmount = "custom";
      this.customTopUpAmount = clampMoney(amount);
      this.persist();
    },
    toggleBonusUsage(value = !this.useBonus) {
      this.useBonus = Boolean(value);
      this.persist();
    },
    async mockTopUp() {
      const summary = this.topUpSummary;
      if (!summary.topUpAmount || this.topUpState === "processing") return null;
      this.topUpState = "processing";
      await walletService.createTopUp(summary);
      const beforeWork = this.workBalance;
      const beforeBonus = this.bonusBalance;
      this.workBalance = summary.resultingWorkBalance;
      this.bonusBalance = summary.resultingBonusBalance;
      this.lastTopUpAmount = summary.topUpAmount;
      this.topUpState = "success";
      this.lastTopUpResult = {
        ...summary,
        createdAt: new Date().toISOString(),
      };
      const transaction = {
        id: createTransactionId(),
        type: "top_up",
        direction: "in",
        title: "Bakiye yükleme",
        description: summary.appliedBonus ? `Bonus indirimi: ₺${summary.appliedBonus}` : "Bonus kullanılmadı",
        amount: summary.topUpAmount,
        bonusAmount: summary.appliedBonus,
        createdAt: new Date().toISOString(),
        status: "completed",
        referenceType: "payment",
        referenceId: `PAY-${Date.now().toString().slice(-5)}`,
        balanceBefore: beforeWork,
        balanceAfter: this.workBalance,
        bonusBefore: beforeBonus,
        bonusAfter: this.bonusBalance,
        paymentMethod: this.paymentMethod.label,
        receiptId: `RCPT-${Date.now().toString().slice(-5)}`,
        failureReason: "",
        metadata: { source: "wallet_top_up" },
      };
      this.transactions.unshift(transaction);
      this.persist();
      return transaction;
    },
    async retryFailedTopUp(transactionId) {
      const transaction = this.transactions.find((item) => item.id === transactionId);
      if (!transaction) return null;
      await walletService.retryTopUp(transaction);
      transaction.status = "completed";
      transaction.failureReason = "";
      this.persist();
      return transaction;
    },
    setLowBalanceAlert(enabled, threshold = this.lowBalanceThreshold) {
      this.lowBalanceAlertEnabled = Boolean(enabled);
      this.lowBalanceThreshold = clampMoney(threshold);
      this.persist();
    },
    configureAutoTopUp({ enabled, threshold, amount, monthlyLimit }) {
      this.autoTopUpEnabled = Boolean(enabled);
      this.autoTopUpThreshold = clampMoney(threshold);
      this.autoTopUpAmount = clampMoney(amount);
      this.autoTopUpMonthlyLimit = clampMoney(monthlyLimit);
      this.persist();
    },
    disableAutoTopUp() {
      this.autoTopUpEnabled = false;
      this.persist();
    },
    resetWalletDemo() {
      Object.assign(this, clone(walletInitialState));
      if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    },
  },
});

