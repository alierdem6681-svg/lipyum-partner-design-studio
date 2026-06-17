import { LazyLoadButton } from "../utils/lazyList.js";
import { formatCredit } from "../utils/formatters.js";

const toneIcon = {
  success: "check",
  info: "gift",
  warning: "alert",
  neutral: "wallet",
};

export function WalletSummaryCards({ summary = {}, icon = () => "" } = {}) {
  return `
    <section class="wallet-summary-grid-v4" aria-label="Cüzdan özeti">
      <article class="wallet-summary-card-v4">
        <div class="wallet-card-title">
          <span class="wallet-card-icon is-credit">${icon("wallet")}</span>
          <strong>Cüzdan</strong>
        </div>
        <div class="wallet-card-metric"><strong>${formatCredit(summary.credit || 0)}</strong><span>kredi</span></div>
        <small><i></i> ≈ ${summary.estimatedJobs || "2-3"} iş alabilirsin</small>
        <button class="wallet-card-action is-primary" type="button" data-open="credit">${icon("plus")} Bakiye Yükle</button>
      </article>
      <article class="wallet-summary-card-v4">
        <div class="wallet-card-title">
          <span class="wallet-card-icon is-bonus">${icon("gift")}</span>
          <strong>Bonus</strong>
        </div>
        <div class="wallet-card-metric"><strong>${formatCredit(summary.bonus || 0)}</strong><span>bonus</span></div>
        <small><i class="is-blue"></i> Kredi yüklerken kullanılır.</small>
        <button class="wallet-card-action is-outline" type="button" data-open="bonus-convert">${icon("refresh")} Krediye Çevir</button>
      </article>
    </section>
  `;
}

export function WalletActionGrid({ actions = [], icon = () => "" } = {}) {
  return `
    <section class="wallet-action-grid" aria-label="Cüzdan işlemleri">
      ${actions.map((action) => `
        <button class="wallet-action-tile is-${action.tone || "neutral"}" type="button" data-route="${action.route}">
          <span>${icon(action.icon || "wallet")}</span>
          <strong class="responsive-label">${action.label}</strong>
        </button>
      `).join("")}
    </section>
  `;
}

export function TransactionCard({ transaction = {}, icon = () => "" } = {}) {
  const tone = transaction.tone || "neutral";
  return `
    <article class="transaction-card-v4 is-${tone}">
      <span class="transaction-icon">${icon(toneIcon[tone] || "wallet")}</span>
      <span class="transaction-copy">
        <strong>${transaction.title}</strong>
        <small>${transaction.description}</small>
      </span>
      <span class="transaction-side">
        <strong>${transaction.amount}</strong>
        <small>${transaction.date}</small>
      </span>
    </article>
  `;
}

export function TransactionList({
  transactions = [],
  visibleTransactions = [],
  visibleCount = 0,
  icon = () => "",
} = {}) {
  return `
    <section class="transaction-list-v4" aria-label="Cüzdan hareketleri">
      <div class="section-title compact">
        <h2>Son Hareketler</h2>
        <span>${transactions.length} işlem</span>
      </div>
      ${visibleTransactions.map((transaction) => TransactionCard({ transaction, icon })).join("")}
      ${LazyLoadButton({
        listKey: "wallet",
        hasMore: visibleCount < transactions.length,
        label: "Daha Fazla Hareket Göster",
      })}
    </section>
  `;
}
