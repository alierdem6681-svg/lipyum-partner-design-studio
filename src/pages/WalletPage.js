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
      ${Header({
        title: "Cüzdan",
        subtitle: "Kredi, bonus ve hareketlerin",
        showBack: true,
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
