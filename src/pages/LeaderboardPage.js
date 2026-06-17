import { Header } from "../components/Header.js";
import {
  LeaderboardHeroCard,
  LeagueSelects,
  MyRankSummary,
  NearbyRankList,
  RewardTiersCard,
  TopRankersCard,
} from "../components/LeaderboardComponents.js";
import { PageContainer } from "../components/PageContainer.js";
import { leaderboard } from "../data/mockData.js";
import { createLazyListState, getVisibleItems } from "../utils/lazyList.js";

export function LeaderboardPage({ state = {}, icon = () => "" } = {}) {
  const activeLeaderboard = {
    ...leaderboard,
    sector: state.leaderboardSector || leaderboard.sector,
    city: state.leaderboardRegion || leaderboard.city,
  };
  const lazyState = createLazyListState({
    initialCount: 5,
    incrementCount: 3,
    visibleCount: state.lazyListCounts?.leaderboard || 5,
  });
  const visibleNearby = getVisibleItems(activeLeaderboard.nearby, lazyState.visibleCount);

  return PageContainer({
    className: "leaderboard-page-v4",
    children: `
      <span class="sr-only" data-testid="leaderboard-page">Liderlik Tablosu</span>
      ${Header({
        title: "Liderlik Tablosu",
        subtitle: `${activeLeaderboard.period} · Sıralamanı takip et`,
      })}
      ${LeagueSelects({ leaderboard: activeLeaderboard })}
      ${LeaderboardHeroCard({ leaderboard: activeLeaderboard, icon })}
      ${MyRankSummary({ leaderboard: activeLeaderboard, icon })}
      <section class="leaderboard-cta-card">
        <span>${icon("zap")}</span>
        <strong>Daha çok iş al, sıralamada yüksel!</strong>
        <small>Yeni iş fırsatlarını kaçırma.</small>
      </section>
      ${NearbyRankList({
        items: activeLeaderboard.nearby,
        visibleItems: visibleNearby,
        visibleCount: visibleNearby.length,
        icon,
      })}
      ${TopRankersCard({ rankers: activeLeaderboard.topRankers })}
      ${RewardTiersCard({ rewards: activeLeaderboard.rewards, icon })}
    `,
  });
}
