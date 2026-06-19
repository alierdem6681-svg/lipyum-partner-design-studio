import { formatCredit } from "../utils/formatters.js";

export function LeagueSelects({ leaderboard = {} } = {}) {
  const sectorOptions = ["Beyaz Eşya Tamiri", "Klima Tamiri", "Kombi Servisi", "Ev Temizliği"];
  const cityOptions = ["İstanbul", "Ankara", "İzmir", "Kayseri", "Antalya"];
  const activeSector = leaderboard.city ? "" : leaderboard.sector;
  return `
    <section class="league-select-grid" aria-label="Lig filtreleri">
      <label>
        <span>Sektör Ligi</span>
        <select data-leaderboard-sector data-testid="leaderboard-sector-select" aria-label="Sektör Ligi">
          <option value="" ${activeSector ? "" : "selected"}>Sektör Ligi</option>
          ${sectorOptions.map((sector) => `<option value="${sector}" ${activeSector === sector ? "selected" : ""}>${sector}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Şehir Ligi</span>
        <select data-leaderboard-region data-testid="leaderboard-city-select" aria-label="Şehir Ligi">
          <option value="" ${leaderboard.city ? "" : "selected"}>Şehirler</option>
          ${cityOptions.map((city) => `<option value="${city}" ${leaderboard.city === city ? "selected" : ""}>${city}</option>`).join("")}
        </select>
      </label>
    </section>
  `;
}

export function LeaderboardHeroCard({ leaderboard = {}, icon = () => "" } = {}) {
  const leagueLabel = leaderboard.city && leaderboard.city !== "Şehirler" ? `${leaderboard.city} Ligi` : "Sektör Ligi";
  const progress = Math.max(0, Math.min(100, Number(leaderboard.targetProgress) || 0));
  return `
    <section class="leaderboard-hero-card-v4" data-testid="leaderboard-hero-card" style="--leaderboard-progress:${progress}%">
      <span class="leaderboard-hero-glow glow-one" aria-hidden="true"></span>
      <span class="leaderboard-hero-glow glow-two" aria-hidden="true"></span>
      <span class="leaderboard-hero-spark spark-one" aria-hidden="true"></span>
      <span class="leaderboard-hero-spark spark-two" aria-hidden="true"></span>
      <div class="leaderboard-hero-copy">
        <span class="leaderboard-hero-eyebrow">Bu haftaki sıralaman</span>
        <div class="leaderboard-rank-line">
          <strong>#${leaderboard.myRank}</strong>
        </div>
        <p><b>İlk 20’ye çok yakınsın.</b> 2 güçlü iş daha seni vitrine taşır.</p>
        <div class="leaderboard-hero-chips" aria-label="Lig motivasyonu">
          <span>${icon("zap")} +${Math.max(1, leaderboard.myRank - 20)} sıra hedef</span>
          <span>${icon("trophy")} ${formatCredit(leaderboard.myScore)} puan</span>
        </div>
      </div>
      <div class="leaderboard-medal-art" aria-hidden="true">
        <span>${icon("star")}</span>
        <em>${leagueLabel}</em>
      </div>
      <div class="leaderboard-progress">
        <span>İlk 20 hedefine yakınlık</span>
        <strong>%${progress}</strong>
        <div aria-hidden="true"><i></i></div>
      </div>
    </section>
  `;
}

export function MyRankSummary({ leaderboard = {}, icon = () => "" } = {}) {
  const items = [
    { label: "Bu haftaki işlerim", value: leaderboard.myJobs, icon: "bar-chart" },
    { label: "Lig puanım", value: formatCredit(leaderboard.myScore), icon: "trophy" },
    { label: "Hedefim", value: leaderboard.targetRank, icon: "trend-up" },
  ];
  return `
    <section class="rank-summary-grid" aria-label="Sıralama özeti">
      ${items.map((item) => `
        <article>
          <span>${icon(item.icon)}</span>
          <strong>${item.value}</strong>
          <small>${item.label}</small>
        </article>
      `).join("")}
    </section>
  `;
}

export function NearbyRankList({
  items = [],
} = {}) {
  const selfIndex = items.findIndex((item) => item.self);
  const windowStart = selfIndex >= 0 ? Math.max(0, selfIndex - 2) : 0;
  const windowItems = items.slice(windowStart, windowStart + 5);
  return `
    <section class="nearby-rank-card ui-card" aria-label="Sıralamadaki konumun" data-testid="leaderboard-nearby-card">
      <div class="section-title compact">
        <h2>Sıralamadaki Konumun</h2>
        <span>Lig puanı</span>
      </div>
      <div class="nearby-rank-list">
        ${windowItems.map((item) => `
          <article class="nearby-rank-row ${item.self ? "is-self" : ""}" data-testid="leaderboard-rank-row">
            <span class="nearby-rank-number">#${item.rank}</span>
            <span class="nearby-rank-avatar">${item.initials}</span>
            <strong>${item.self ? "Sen" : item.name}</strong>
            <span>${formatCredit(item.score)} puan</span>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

export function TopRankersCard({ rankers = [], icon = () => "" } = {}) {
  const rankLabels = {
    1: "Haftanın lideri",
    2: "Gümüş seri",
    3: "Bronz seri",
  };
  return `
    <section class="top-rankers-card ui-card" aria-label="Haftanın en iyileri" data-testid="leaderboard-top-rankers-card">
      <span class="top-rankers-confetti confetti-one" aria-hidden="true"></span>
      <span class="top-rankers-confetti confetti-two" aria-hidden="true"></span>
      <span class="top-rankers-confetti confetti-three" aria-hidden="true"></span>
      <span class="top-rankers-confetti confetti-four" aria-hidden="true"></span>
      <div class="top-rankers-head">
        <div class="top-rankers-title">
          <span>${icon("sparkles")} Haftanın En İyileri</span>
        </div>
        <span class="top-rankers-score-label">Lig puanı</span>
      </div>
      <div class="top-rankers-stage">
        <div class="top-rankers-grid">
          ${rankers.map((ranker) => `
            <article class="top-ranker is-rank-${ranker.rank}">
              <span class="top-ranker-medal">${ranker.rank}</span>
              <span class="top-ranker-avatar">
                <span>${ranker.initials}</span>
              </span>
              <strong>${ranker.name}</strong>
              <small>${formatCredit(ranker.score)} Puan</small>
              <em>${rankLabels[ranker.rank] || "Vitrinde"}</em>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

export function RewardTiersCard({ rewards = [], icon = () => "" } = {}) {
  const rewardStyles = [
    { className: "is-gold", iconName: "crown", label: "Zirve" },
    { className: "is-emerald", iconName: "trophy", label: "Podyum" },
    { className: "is-amber", iconName: "gift", label: "Hedef" },
  ];
  return `
    <section class="reward-tiers-card ui-card" aria-label="Ödüller" data-testid="leaderboard-rewards-card">
      <span class="reward-tiers-spark spark-one" aria-hidden="true"></span>
      <span class="reward-tiers-spark spark-two" aria-hidden="true"></span>
      <span class="reward-tiers-spark spark-three" aria-hidden="true"></span>
      <div class="reward-tiers-head">
        <span>${icon("sparkles")} Kazanılacak ödüller</span>
        <h2>Ödüller</h2>
        <p>Sıralamada yüksel, bonusu ve özel rozeti kap.</p>
      </div>
      <div class="reward-tier-grid">
        ${rewards.map((reward, index) => {
          const style = rewardStyles[index] || rewardStyles[2];
          return `
          <article class="${style.className}">
            <span class="reward-tier-ribbon">${style.label}</span>
            <span class="reward-tier-icon">${icon(style.iconName)}</span>
            <strong>${reward.title}</strong>
            <small>${reward.value}</small>
            <em>${reward.note.replace(/^\+\s*/, "")}</em>
          </article>
        `;
        }).join("")}
      </div>
    </section>
  `;
}
