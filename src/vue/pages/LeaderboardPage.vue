<script setup>
import { computed, ref } from "vue";
import { leaderboard as sourceLeaderboard } from "../../data/mockData.js";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const sector = ref(sourceLeaderboard.sector);
const city = ref(sourceLeaderboard.city || "");
const sectorOptions = ["Beyaz Eşya Tamiri", "Klima Tamiri", "Kombi Servisi", "Ev Temizliği"];
const cityOptions = ["İstanbul", "Ankara", "İzmir", "Kayseri", "Antalya"];

const activeLeaderboard = computed(() => ({
  ...sourceLeaderboard,
  sector: sector.value,
  city: city.value,
}));
const leagueLabel = computed(() =>
  activeLeaderboard.value.city && activeLeaderboard.value.city !== "Şehirler"
    ? `${activeLeaderboard.value.city} Ligi`
    : "Sektör Ligi",
);
const progress = computed(() => Math.max(0, Math.min(100, Number(activeLeaderboard.value.targetProgress) || 0)));
const windowItems = computed(() => {
  const items = activeLeaderboard.value.nearby || [];
  const selfIndex = items.findIndex((item) => item.self);
  const windowStart = selfIndex >= 0 ? Math.max(0, selfIndex - 2) : 0;
  return items.slice(windowStart, windowStart + 5);
});

function formatCredit(value) {
  return new Intl.NumberFormat("tr-TR").format(Number(value) || 0);
}
</script>

<template>
  <AppPage title="Liderlik Tablosu" class="leaderboard-page-v4" data-testid="leaderboard-page">
    <section class="league-select-grid" aria-label="Lig filtreleri">
      <label>
        <span>Sektör Ligi</span>
        <select v-model="sector" data-leaderboard-sector data-testid="leaderboard-sector-select" aria-label="Sektör Ligi">
          <option v-for="option in sectorOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </label>
      <label>
        <span>Şehir Ligi</span>
        <select v-model="city" data-leaderboard-region data-testid="leaderboard-city-select" aria-label="Şehir Ligi">
          <option value="">Şehirler</option>
          <option v-for="option in cityOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </label>
    </section>

    <section class="leaderboard-hero-card-v4 is-progress-72" data-testid="leaderboard-hero-card">
      <span class="leaderboard-hero-glow glow-one" aria-hidden="true"></span>
      <span class="leaderboard-hero-glow glow-two" aria-hidden="true"></span>
      <span class="leaderboard-hero-spark spark-one" aria-hidden="true"></span>
      <span class="leaderboard-hero-spark spark-two" aria-hidden="true"></span>
      <div class="leaderboard-hero-copy">
        <span class="leaderboard-hero-eyebrow">Bu haftaki sıralaman</span>
        <div class="leaderboard-rank-line"><strong>#{{ activeLeaderboard.myRank }}</strong></div>
        <p><b>İlk 20’ye çok yakınsın.</b> 2 güçlü iş daha seni vitrine taşır.</p>
        <div class="leaderboard-hero-chips" aria-label="Lig motivasyonu">
          <span><AppIcon name="zap" :size="14" /> +{{ Math.max(1, activeLeaderboard.myRank - 20) }} sıra hedef</span>
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
        <small>Bu haftaki işlerim</small>
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

    <AppCard class="top-rankers-card ui-card" aria-label="Haftanın en iyileri" data-testid="leaderboard-top-rankers-card">
      <span class="top-rankers-confetti confetti-one" aria-hidden="true"></span>
      <span class="top-rankers-confetti confetti-two" aria-hidden="true"></span>
      <span class="top-rankers-confetti confetti-three" aria-hidden="true"></span>
      <span class="top-rankers-confetti confetti-four" aria-hidden="true"></span>
      <div class="top-rankers-head">
        <div class="top-rankers-title">
          <span><AppIcon name="sparkles" :size="14" /> Haftanın vitrini</span>
          <h2>Haftanın En İyileri</h2>
        </div>
        <span class="top-rankers-score-label">Lig puanı</span>
      </div>
      <div class="top-rankers-stage">
        <div class="top-rankers-grid">
          <article v-for="ranker in activeLeaderboard.topRankers" :key="ranker.rank" :class="`top-ranker is-rank-${ranker.rank}`">
            <span class="top-ranker-medal">{{ ranker.rank }}</span>
            <span class="top-ranker-avatar"><span>{{ ranker.initials }}</span></span>
            <strong>{{ ranker.name }}</strong>
            <small>{{ formatCredit(ranker.score) }} Puan</small>
            <em>{{ ranker.rank === 1 ? "Haftanın lideri" : ranker.rank === 2 ? "Gümüş seri" : "Bronz seri" }}</em>
          </article>
        </div>
      </div>
    </AppCard>

    <AppCard class="reward-tiers-card ui-card" aria-label="Ödüller" data-testid="leaderboard-rewards-card">
      <span class="reward-tiers-spark spark-one" aria-hidden="true"></span>
      <span class="reward-tiers-spark spark-two" aria-hidden="true"></span>
      <span class="reward-tiers-spark spark-three" aria-hidden="true"></span>
      <div class="reward-tiers-head">
        <span><AppIcon name="sparkles" :size="14" /> Kazanılacak ödüller</span>
        <h2>Ödüller</h2>
        <p>Sıralamada yüksel, bonusu ve özel rozeti kap.</p>
      </div>
      <div class="reward-tier-grid">
        <article
          v-for="(reward, index) in activeLeaderboard.rewards"
          :key="reward.title"
          :class="index === 0 ? 'is-gold' : index === 1 ? 'is-emerald' : 'is-amber'"
        >
          <span class="reward-tier-ribbon">{{ index === 0 ? "Zirve" : index === 1 ? "Podyum" : "Hedef" }}</span>
          <span class="reward-tier-icon"><AppIcon :name="index === 0 ? 'crown' : index === 1 ? 'trophy' : 'gift'" :size="20" /></span>
          <strong>{{ reward.title }}</strong>
          <small>{{ reward.value }}</small>
          <em>{{ reward.note.replace(/^\+\s*/, "") }}</em>
        </article>
      </div>
    </AppCard>
  </AppPage>
</template>
