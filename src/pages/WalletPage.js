import { Header } from "../components/Header.js";
import { PageContainer } from "../components/PageContainer.js";
import {
  TransactionList,
  WalletActionGrid,
  WalletSummaryCards,
} from "../components/WalletComponents.js";
import { walletActions, walletSummary, walletTransactions } from "../data/mockData.js";
import { createLazyListState, getVisibleItems } from "../utils/lazyList.js";

export function WalletPage({ state = {}, icon = () => "" } = {}) {
  const lazyState = createLazyListState({
    initialCount: 5,
    incrementCount: 4,
    visibleCount: state.lazyListCounts?.wallet || 5,
  });
  const visibleTransactions = getVisibleItems(walletTransactions, lazyState.visibleCount);

  return PageContainer({
    className: "wallet-page-v4",
    children: `
      <span class="sr-only" data-testid="wallet-page">Cüzdan</span>
      ${Header({
        title: "Cüzdan",
        subtitle: "Kredi, bonus ve hareketlerin",
        showBack: true,
        rightAction: `
          <button class="icon-btn icon-only-btn page-header-action" type="button" data-open="wallet-info" data-testid="wallet-info-button" aria-label="Cüzdan bilgisi">
            <svg class="icon"><use href="#i-help-circle"></use></svg>
          </button>
        `,
      })}
      ${WalletSummaryCards({ summary: walletSummary, icon })}
      ${WalletActionGrid({ actions: walletActions, icon })}
      ${TransactionList({
        transactions: walletTransactions,
        visibleTransactions,
        visibleCount: visibleTransactions.length,
        icon,
      })}
      <section class="wallet-info-card ui-card">
        <strong>Güvenli kullanım</strong>
        <p>Kredi hareketlerin, bonus dönüşümleri ve iade kayıtların bu ekranda tek yerden takip edilir.</p>
      </section>
    `,
  });
}
