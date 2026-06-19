import { Header } from "../components/Header.js";
import {
  LeaderboardHeroCard,
  LeagueSelects,
  MyRankSummary,
  NearbyRankList,
  TopRankersCard,
} from "../components/LeaderboardComponents.js";
import { PageContainer } from "../components/PageContainer.js";
import { leaderboard } from "../data/mockData.js";

export function LeaderboardPage({ state = {}, icon = () => "" } = {}) {
  const activeCity = state.leaderboardRegion || "";
  const activeSector = activeCity ? "" : state.leaderboardSector || leaderboard.sector;
  const activeLeaderboard = {
    ...leaderboard,
    sector: activeSector,
    city: activeCity,
  };

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
      })}
      ${TopRankersCard({ rankers: activeLeaderboard.topRankers, icon })}
    `,
  });
}
