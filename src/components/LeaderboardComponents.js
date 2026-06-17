import { LazyLoadButton } from "../utils/lazyList.js";
import { formatCredit } from "../utils/formatters.js";

export function LeagueSelects({ leaderboard = {} } = {}) {
  return `
    <section class="league-select-grid" aria-label="Lig filtreleri">
      <label>
        <span>Sektör Ligi</span>
        <select data-leaderboard-sector aria-label="Sektör Ligi">
          <option value="Beyaz Eşya Tamiri" selected>Beyaz Eşya Tamiri</option>
          <option value="Klima Tamiri">Klima Tamiri</option>
          <option value="Kombi Servisi">Kombi Servisi</option>
          <option value="Ev Temizliği">Ev Temizliği</option>
        </select>
      </label>
      <label>
        <span>Şehir Ligi</span>
        <select data-leaderboard-region aria-label="Şehir Ligi">
          <option value="">Şehirler</option>
          <option value="İstanbul">İstanbul</option>
          <option value="Ankara">Ankara</option>
          <option value="İzmir">İzmir</option>
          <option value="Kayseri">Kayseri</option>
          <option value="Antalya">Antalya</option>
        </select>
      </label>
    </section>
  `;
}

export function LeaderboardHeroCard({ leaderboard = {}, icon = () => "" } = {}) {
  return `
    <section class="leaderboard-hero-card-v4">
      <div class="leaderboard-hero-copy">
        <span>Bu haftaki sıralaman</span>
        <strong>#${leaderboard.myRank}</strong>
        <p>İlk 20 hedefi için performansını artırmaya devam et.</p>
      </div>
      <div class="leaderboard-medal-art" aria-hidden="true">
        <span>${icon("star")}</span>
        <em>${leaderboard.city && leaderboard.city !== "Şehirler" ? `${leaderboard.city} Ligi` : "Sektör Ligi"}</em>
      </div>
      <div class="leaderboard-progress">
        <span>İlk 20 hedefine yakınlık</span>
        <div><i style="width:${leaderboard.targetProgress || 0}%"></i></div>
        <strong>%${leaderboard.targetProgress || 0}</strong>
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
  visibleItems = [],
  visibleCount = 0,
  icon = () => "",
} = {}) {
  return `
    <section class="nearby-rank-card ui-card" aria-label="Sıralamadaki konumun">
      <div class="section-title compact">
        <h2>Sıralamadaki Konumun</h2>
        <span>Lig puanı</span>
      </div>
      <div class="nearby-rank-list">
        ${visibleItems.map((item) => `
          <article class="nearby-rank-row ${item.self ? "is-self" : ""}">
            <span class="nearby-rank-number">#${item.rank}</span>
            <span class="nearby-rank-avatar">${item.initials}</span>
            <strong>${item.name}${item.self ? '<em>SEN</em>' : ""}</strong>
            <span>${formatCredit(item.score)} puan</span>
          </article>
        `).join("")}
      </div>
      ${LazyLoadButton({
        listKey: "leaderboard",
        hasMore: visibleCount < items.length,
        label: "Daha Fazla Sıra Göster",
      })}
    </section>
  `;
}

export function TopRankersCard({ rankers = [] } = {}) {
  return `
    <section class="top-rankers-card ui-card" aria-label="Haftanın en iyileri">
      <div class="section-title compact">
        <h2>Haftanın En İyileri</h2>
        <span>Lig puanı</span>
      </div>
      <div class="top-rankers-grid">
        ${rankers.map((ranker) => `
          <article class="top-ranker is-rank-${ranker.rank}">
            <span class="top-ranker-avatar">${ranker.initials}<em>${ranker.rank}</em></span>
            <strong>${ranker.name}</strong>
            <small>${formatCredit(ranker.score)} Puan</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

export function RewardTiersCard({ rewards = [], icon = () => "" } = {}) {
  return `
    <section class="reward-tiers-card ui-card" aria-label="Ödüller">
      <div class="section-title compact">
        <h2>Ödüller</h2>
        <span>Hafta sonu</span>
      </div>
      <div class="reward-tier-grid">
        ${rewards.map((reward) => `
          <article>
            <span>${icon("gift")}</span>
            <strong>${reward.title}</strong>
            <small>${reward.value}</small>
            <em>${reward.note}</em>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}
