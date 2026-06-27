<script setup>
import { ref } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import {
  managementActionCenter,
  managementApprovals,
  managementDailyTasks,
  managementQuickActions,
  managementReports,
  managementSecurityGates,
  managementSummary,
  managementSystemStatus,
} from "../data/managementPanelModel.js";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const updatedAt = ref(managementSummary.lastUpdate);
const decisions = ref({});

function scrollToSection(id) {
  const target = document.getElementById(`management-${id}`);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function refreshPanel() {
  updatedAt.value = "Az önce";
  shell.showToast("Yönetim paneli güncellendi.");
}

function decideApproval(id, decision) {
  decisions.value = { ...decisions.value, [id]: decision };
  const label = decision === "approved" ? "onaylandı" : decision === "rejected" ? "reddedildi" : "pilot listesine alındı";
  shell.showToast(`Aksiyon ${label}.`);
}
</script>

<template>
  <AppPage title="Yönetim Paneli" compact>
    <section class="management-panel" data-testid="management-panel">
      <section class="management-hero" aria-label="Bugünkü yönetim özeti">
        <div class="management-hero__icon" aria-hidden="true">
          <AppIcon name="sparkles" :size="32" />
        </div>
        <div class="management-hero__copy">
          <div class="management-hero__title">
            <strong>{{ managementSummary.title }}</strong>
            <span>{{ managementSummary.status }}</span>
          </div>
          <p>Beklenen Ek Net Kâr</p>
          <b>{{ managementSummary.netProfit }}</b>
          <em>{{ managementSummary.delta }} {{ managementSummary.deltaLabel }}</em>
        </div>
        <div class="management-hero__meta">
          <div>
            <AppIcon name="file-text" :size="19" />
            <span>Onay</span>
            <strong>{{ managementSummary.approvals }}</strong>
          </div>
          <div>
            <AppIcon name="sparkles" :size="19" />
            <span>Pilot</span>
            <strong>{{ managementSummary.pilots }}</strong>
          </div>
          <p>Son güncelleme<br><strong>{{ updatedAt }}</strong></p>
        </div>
      </section>

      <nav class="management-quick-row" aria-label="Yönetim kısayolları">
        <button
          v-for="action in managementQuickActions"
          :key="action.id"
          type="button"
          class="management-quick"
          @click="scrollToSection(action.target)"
        >
          <AppIcon :name="action.icon" :size="25" />
          <span>{{ action.label }}</span>
        </button>
      </nav>

      <section id="management-actions" class="management-section" aria-labelledby="management-actions-title">
        <header class="management-section__head">
          <h2 id="management-actions-title">Action Center</h2>
          <button type="button" @click="refreshPanel">Yenile <AppIcon name="refresh" :size="15" /></button>
        </header>
        <div class="management-action-list">
          <article
            v-for="item in managementActionCenter"
            :key="item.id"
            :class="['management-action-card', `is-${item.tone}`]"
          >
            <div class="management-action-card__identity">
              <small>Hesap</small>
              <strong>{{ item.account }}</strong>
              <small>Kampanya</small>
              <strong>{{ item.campaign }}</strong>
              <small>Bölge / Sektör</small>
              <strong>{{ item.region }}</strong>
            </div>
            <div class="management-action-card__profit">
              <small>Beklenen Ek Net Kâr</small>
              <strong>{{ item.profit }}</strong>
              <small>Başarı Olasılığı</small>
              <span>{{ item.probability }}%</span>
              <i :style="{ '--progress': `${item.probability}%` }"></i>
            </div>
            <div class="management-action-card__next">
              <small>Kapasite Riski</small>
              <span><b></b>{{ item.risk }}</span>
              <small>Sonraki Adım</small>
              <strong>{{ item.nextStep }}</strong>
              <AppIcon name="chevron-right" :size="22" />
            </div>
          </article>
        </div>
      </section>

      <section id="management-approvals" class="management-section" aria-labelledby="management-approvals-title">
        <header class="management-section__head">
          <h2 id="management-approvals-title">Onay Bekleyenler</h2>
          <span>{{ managementApprovals.length }} aksiyon</span>
        </header>
        <div class="management-approval-list">
          <article v-for="item in managementApprovals" :key="item.id" class="management-approval">
            <span class="management-approval__icon">
              <AppIcon :name="item.icon" :size="21" />
            </span>
            <div class="management-approval__copy">
              <strong>{{ item.title }}</strong>
              <small>{{ item.context }}</small>
            </div>
            <div class="management-approval__metrics">
              <span>{{ item.profit }}</span>
              <em>{{ item.probability }}%</em>
            </div>
            <div class="management-approval__actions">
              <button type="button" class="is-approve" @click="decideApproval(item.id, 'approved')">
                <AppIcon name="check" :size="17" />
                <span>Onay</span>
              </button>
              <button type="button" class="is-reject" @click="decideApproval(item.id, 'rejected')">
                <AppIcon name="x" :size="17" />
                <span>Red</span>
              </button>
              <button type="button" class="is-pilot" @click="decideApproval(item.id, 'pilot')">
                <AppIcon name="sparkles" :size="17" />
                <span>Pilot</span>
              </button>
            </div>
            <p v-if="decisions[item.id]" class="management-approval__result">Karar kaydedildi.</p>
          </article>
        </div>
      </section>

      <section id="management-tasks" class="management-section" aria-labelledby="management-tasks-title">
        <header class="management-section__head">
          <h2 id="management-tasks-title">Günlük Görevler</h2>
          <span>Sabah akışı</span>
        </header>
        <div class="management-task-grid">
          <article v-for="task in managementDailyTasks" :key="task.step" class="management-task">
            <span>{{ task.step }}</span>
            <AppIcon :name="task.icon" :size="25" />
            <strong>{{ task.title }}</strong>
            <small>{{ task.status }}</small>
          </article>
        </div>
      </section>

      <section id="management-reports" class="management-section" aria-labelledby="management-reports-title">
        <header class="management-section__head">
          <h2 id="management-reports-title">Raporlar</h2>
          <span>Özet görünüm</span>
        </header>
        <div class="management-report-grid">
          <article v-for="report in managementReports" :key="report.id" :class="['management-report', `is-${report.tone}`]">
            <small>{{ report.title }}</small>
            <strong>{{ report.value }}</strong>
            <span>{{ report.label }}</span>
            <div v-if="report.spark" class="management-sparkline" aria-hidden="true">
              <i
                v-for="(point, index) in report.spark"
                :key="`${report.id}-${index}`"
                :style="{ height: `${point}%` }"
              ></i>
            </div>
            <div v-else class="management-ring" :style="{ '--ring': `${report.ring}%` }" aria-hidden="true"></div>
          </article>
        </div>
      </section>

      <section id="management-system" class="management-section" aria-labelledby="management-system-title">
        <header class="management-section__head">
          <h2 id="management-system-title">Sistem Durumu</h2>
          <span class="management-ok">Tüm sistemler çalışıyor</span>
        </header>
        <div class="management-status-grid">
          <article v-for="item in managementSystemStatus" :key="item.title" class="management-status">
            <AppIcon :name="item.icon" :size="22" />
            <strong>{{ item.title }}</strong>
            <span>{{ item.value }}</span>
          </article>
        </div>
      </section>

      <section class="management-section management-gates" aria-labelledby="management-gates-title">
        <header class="management-section__head">
          <h2 id="management-gates-title">Güvenlik Kapıları</h2>
        </header>
        <div class="management-gate-row">
          <article v-for="gate in managementSecurityGates" :key="gate.title" :class="['management-gate', `is-${gate.tone}`]">
            <AppIcon :name="gate.icon" :size="21" />
            <strong>{{ gate.title }}</strong>
            <span>{{ gate.value }}</span>
          </article>
        </div>
      </section>
    </section>
  </AppPage>
</template>
