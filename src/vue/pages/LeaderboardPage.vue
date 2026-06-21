<script setup>
import { computed, ref } from "vue";
import { leaderboard as sourceLeaderboard } from "../../data/mockData.js";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const leaderboardPeriod = "8-14 Haziran 2026 haftası";
const sector = ref(sourceLeaderboard.sector);
const city = ref("");
const sectorOptions = ["Beyaz Eşya Tamiri", "Klima Tamiri", "Kombi Servisi", "Ev Temizliği"];
const cityOptions = ["İstanbul", "Ankara", "İzmir", "Kayseri", "Antalya"];
const rankerPhotos = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=180&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=180&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=180&q=80",
];

const activeLeaderboard = computed(() => ({
  ...sourceLeaderboard,
  sector: sector.value || "Sektör Ligi",
  city: city.value || "Şehirler",
}));
const leagueLabel = computed(() => (city.value ? `${city.value} Ligi` : "Sektör Ligi"));
const progress = computed(() => Math.max(0, Math.min(100, Number(activeLeaderboard.value.targetProgress) || 0)));
const windowItems = computed(() => {
  const items = activeLeaderboard.value.nearby || [];
  const selfIndex = items.findIndex((item) => item.self);
  const windowStart = selfIndex >= 0 ? Math.max(0, selfIndex - 2) : 0;
  return items.slice(windowStart, windowStart + 5);
});
const topRankers = computed(() =>
  (activeLeaderboard.value.topRankers || []).map((ranker, index) => ({
    ...ranker,
    photo: rankerPhotos[index],
  })),
);
const rewardTotal = computed(() =>
  (activeLeaderboard.value.rewards || []).reduce((total, reward) => {
    const value = Number(String(reward.value).replace(/\D/g, ""));
    const count = getRewardRecipientCount(reward.title);
    return total + (Number.isFinite(value) ? value * count : 0);
  }, 0),
);

function formatCredit(value) {
  return new Intl.NumberFormat("tr-TR").format(Number(value) || 0);
}

function getRewardRecipientCount(title = "") {
  const match = String(title).match(/\d+/);
  return Math.max(1, Number(match?.[0]) || 1);
}

function selectSector(event) {
  sector.value = event.target.value;
  if (sector.value) city.value = "";
}

function selectCity(event) {
  city.value = event.target.value;
  if (city.value) sector.value = "";
}
</script>

<template>
  <AppPage title="Liderlik Tablosu" class="leaderboard-page-v4" data-testid="leaderboard-page">
    <section class="league-select-grid" aria-label="Lig filtreleri">
      <label>
        <span>Sektör Ligi</span>
        <select
          :value="sector"
          data-leaderboard-sector
          data-testid="leaderboard-sector-select"
          aria-label="Sektör Ligi"
          @change="selectSector"
        >
          <option value="">Sektör Ligi</option>
          <option v-for="option in sectorOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </label>
      <label>
        <span>Şehir Ligi</span>
        <select
          :value="city"
          data-leaderboard-region
          data-testid="leaderboard-city-select"
          aria-label="Şehir Ligi"
          @change="selectCity"
        >
          <option value="">Şehir Ligi</option>
          <option v-for="option in cityOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </label>
    </section>

    <AppCard class="top-rankers-card ui-card" aria-label="Geçen haftanın en iyileri" data-testid="leaderboard-top-rankers-card">
      <span class="top-rankers-confetti confetti-one" aria-hidden="true"></span>
      <span class="top-rankers-confetti confetti-two" aria-hidden="true"></span>
      <span class="top-rankers-confetti confetti-three" aria-hidden="true"></span>
      <span class="top-rankers-confetti confetti-four" aria-hidden="true"></span>
      <div class="top-rankers-head">
        <div class="top-rankers-title">
          <h2>Geçen Haftanın En İyileri</h2>
        </div>
        <span class="top-rankers-score-label">Lig puanı</span>
      </div>
      <div class="top-rankers-stage">
        <div class="top-rankers-grid">
          <article v-for="ranker in topRankers" :key="ranker.rank" :class="`top-ranker is-rank-${ranker.rank}`">
            <span class="top-ranker-medal" aria-label="Sıra">{{ ranker.rank }}</span>
            <span class="top-ranker-avatar">
              <img :src="ranker.photo" :alt="`${ranker.name} profil fotoğrafı`" loading="lazy" />
            </span>
            <strong>{{ ranker.name }}</strong>
            <small>{{ formatCredit(ranker.score) }} Puan</small>
          </article>
        </div>
      </div>
    </AppCard>

    <section class="leaderboard-hero-card-v4 is-progress-72" data-testid="leaderboard-hero-card">
      <span class="leaderboard-hero-glow glow-one" aria-hidden="true"></span>
      <span class="leaderboard-hero-glow glow-two" aria-hidden="true"></span>
      <span class="leaderboard-hero-spark spark-one" aria-hidden="true"></span>
      <span class="leaderboard-hero-spark spark-two" aria-hidden="true"></span>
      <div class="leaderboard-hero-copy">
        <span class="leaderboard-hero-eyebrow">Geçen hafta sıralaman</span>
        <div class="leaderboard-rank-line"><strong>#{{ activeLeaderboard.myRank }}</strong></div>
        <div class="leaderboard-hero-chips" aria-label="Lig dönemi ve puan">
          <span><AppIcon name="calendar" :size="14" /> {{ leaderboardPeriod }}</span>
          <span><AppIcon name="trophy" :size="14" /> {{ formatCredit(activeLeaderboard.myScore) }} puan</span>
        </div>
      </div>
      <div class="leaderboard-medal-art" aria-hidden="true">
        <span><AppIcon name="star" :size="28" /></span>
        <em>{{ leagueLabel }}</em>
      </div>
      <div class="leaderboard-progress">
        <span>İlk 20 hedefine yakınlık</span>
        <strong>%{{ progress }}</strong>
        <div aria-hidden="true"><i></i></div>
      </div>
    </section>

    <section class="rank-summary-grid" aria-label="Sıralama özeti">
      <article>
        <span><AppIcon name="bar-chart" :size="18" /></span>
        <strong>{{ activeLeaderboard.myJobs }}</strong>
        <small>Tamamlanan iş</small>
      </article>
      <article>
        <span><AppIcon name="trophy" :size="18" /></span>
        <strong>{{ formatCredit(activeLeaderboard.myScore) }}</strong>
        <small>Lig puanım</small>
      </article>
      <article>
        <span><AppIcon name="trend-up" :size="18" /></span>
        <strong>{{ activeLeaderboard.targetRank }}</strong>
        <small>Hedefim</small>
      </article>
    </section>

    <section class="leaderboard-cta-card">
      <span><AppIcon name="zap" :size="18" /></span>
      <strong>Daha çok iş al, sıralamada yüksel!</strong>
      <small>Yeni iş fırsatlarını kaçırma.</small>
    </section>

    <AppCard class="nearby-rank-card ui-card" aria-label="Sıralamadaki konumun" data-testid="leaderboard-nearby-card">
      <div class="section-title compact">
        <h2>Sıralamadaki Konumun</h2>
        <span>Lig puanı</span>
      </div>
      <div class="nearby-rank-list">
        <article
          v-for="item in windowItems"
          :key="item.rank"
          :class="['nearby-rank-row', item.self ? 'is-self' : '']"
          data-testid="leaderboard-rank-row"
        >
          <span class="nearby-rank-number">#{{ item.rank }}</span>
          <span class="nearby-rank-avatar">{{ item.initials }}</span>
          <strong>{{ item.self ? "Sen" : item.name }}</strong>
          <span>{{ formatCredit(item.score) }} puan</span>
        </article>
      </div>
    </AppCard>

    <AppCard class="reward-tiers-card ui-card" aria-label="Ödüller" data-testid="leaderboard-rewards-card">
      <span class="reward-tiers-spark spark-one" aria-hidden="true"></span>
      <span class="reward-tiers-spark spark-two" aria-hidden="true"></span>
      <span class="reward-tiers-spark spark-three" aria-hidden="true"></span>
      <div class="reward-tiers-head">
        <span><AppIcon name="sparkles" :size="14" /> Haftalık ödül havuzu</span>
      </div>
      <div class="reward-program">
        <div class="reward-program-hero">
          <span>Toplam havuz</span>
          <strong>{{ formatCredit(rewardTotal) }} Bonus</strong>
          <small>En iyi sıralamalar vitrinde daha görünür olur.</small>
        </div>
        <div class="reward-path-list">
          <article
            v-for="(reward, index) in activeLeaderboard.rewards"
            :key="reward.title"
            :class="index === 0 ? 'is-prime' : index === 1 ? 'is-podium' : 'is-goal'"
          >
            <span class="reward-path-icon"><AppIcon :name="index === 0 ? 'crown' : index === 1 ? 'trophy' : 'gift'" :size="19" /></span>
            <span class="reward-path-copy">
              <strong>{{ reward.title }}</strong>
              <small>{{ reward.value }} · {{ reward.note.replace(/^\+\s*/, "") }}</small>
            </span>
          </article>
        </div>
      </div>
    </AppCard>
  </AppPage>
</template>
