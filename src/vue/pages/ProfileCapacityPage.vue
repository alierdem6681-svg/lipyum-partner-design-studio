<script setup>
import { computed, reactive, ref } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const capacityMode = ref("team");
const saveState = ref("idle");
const singleCapacity = ref(12);
const usedCapacityToday = ref(5);

const teams = reactive([
  { id: "klima", name: "Klima Ekibi", icon: "refresh", workingHours: "09:00 - 18:00", capacity: 5, usedToday: 2 },
  { id: "kombi", name: "Kombi Ekibi", icon: "flame", workingHours: "09:00 - 18:00", capacity: 4, usedToday: 2 },
  { id: "beyaz-esya", name: "Beyaz Eşya Ekibi", icon: "briefcase", workingHours: "10:00 - 17:00", capacity: 3, usedToday: 1 },
]);

const modes = [
  { id: "team", label: "Ekip bazlı", icon: "users" },
  { id: "single", label: "Tek kapasite", icon: "user" },
  { id: "today", label: "Bugün özel", icon: "calendar" },
];

const teamCapacityTotal = computed(() => teams.reduce((total, team) => total + team.capacity, 0));
const teamUsedTotal = computed(() => teams.reduce((total, team) => total + team.usedToday, 0));
const totalCapacity = computed(() => (capacityMode.value === "team" ? teamCapacityTotal.value : singleCapacity.value));
const usedToday = computed(() => (capacityMode.value === "team" ? teamUsedTotal.value : Math.min(usedCapacityToday.value, totalCapacity.value)));
const capacityCopy = computed(() =>
  capacityMode.value === "team" ? "Ekip kapasitelerinden otomatik hesaplanır" : "Günlük iş alma sınırın olarak kullanılır",
);

function clamp(value, min = 0, max = 99) {
  return Math.min(max, Math.max(min, value));
}

function adjustTotalCapacity(delta) {
  if (capacityMode.value !== "team") {
    singleCapacity.value = clamp(singleCapacity.value + delta, 1);
    usedCapacityToday.value = Math.min(usedCapacityToday.value, singleCapacity.value);
    return;
  }

  const targetTeam = teams[teams.length - 1];
  targetTeam.capacity = clamp(targetTeam.capacity + delta, 1);
}

function adjustTeamCapacity(teamId, delta) {
  const team = teams.find((item) => item.id === teamId);
  if (!team) return;
  team.capacity = clamp(team.capacity + delta, 1);
  team.usedToday = Math.min(team.usedToday, team.capacity);
}

function selectMode(modeId) {
  capacityMode.value = modeId;
  shell.showToast(modeId === "team" ? "Ekip bazlı kapasite aktif." : modeId === "today" ? "Bugüne özel kapasite seçildi." : "Tek kapasite seçildi.");
}

function saveCapacity() {
  saveState.value = "saved";
  shell.showToast("Kapasite ayarların kaydedildi.");
  window.setTimeout(() => {
    saveState.value = "idle";
  }, 1800);
}
</script>

<template>
  <AppPage title="Kapasitem" data-testid="profile-capacity-page">
    <div class="profile-capacity-page">
      <section class="profile-capacity-summary" aria-labelledby="capacity-summary-title">
        <span class="profile-capacity-summary__icon" aria-hidden="true">
          <AppIcon name="briefcase" :size="34" />
        </span>
        <div class="profile-capacity-summary__copy">
          <h2 id="capacity-summary-title">Günlük toplam kapasite</h2>
          <div class="profile-capacity-value" aria-live="polite">
            <strong>{{ totalCapacity }}</strong>
            <span>iş / gün</span>
          </div>
          <p>{{ capacityCopy }}</p>
          <span class="profile-capacity-chip">Bugün {{ usedToday }} / {{ totalCapacity }} dolu</span>
        </div>
        <div class="profile-capacity-progress">
          <progress
            class="profile-capacity-progress__bar"
            :value="usedToday"
            :max="totalCapacity"
            aria-label="Bugünkü kapasite doluluğu"
          >
            {{ usedToday }} / {{ totalCapacity }}
          </progress>
          <span class="profile-capacity-progress__labels">
            <small>{{ usedToday }} iş</small>
            <small>{{ totalCapacity }} iş</small>
          </span>
        </div>
      </section>

      <section class="profile-capacity-card profile-capacity-company" aria-labelledby="company-capacity-title">
        <h2 id="company-capacity-title">Firma kapasitesi</h2>
        <div class="profile-capacity-stepper" aria-label="Firma günlük kapasitesi">
          <button type="button" aria-label="Firma kapasitesini azalt" @click="adjustTotalCapacity(-1)">
            <AppIcon name="minus" :size="18" />
          </button>
          <output aria-live="polite">{{ totalCapacity }}</output>
          <button type="button" aria-label="Firma kapasitesini artır" @click="adjustTotalCapacity(1)">
            <AppIcon name="plus" :size="18" />
          </button>
        </div>
        <p>Kapasite dolduğunda yeni iş yönlendirmesi yavaşlar.</p>
      </section>

      <section class="profile-capacity-modes" aria-label="Kapasite modu seçimi">
        <button
          v-for="mode in modes"
          :key="mode.id"
          type="button"
          class="profile-capacity-mode"
          :aria-pressed="capacityMode === mode.id"
          @click="selectMode(mode.id)"
        >
          <AppIcon :name="mode.icon" :size="19" />
          <span>{{ mode.label }}</span>
        </button>
      </section>

      <section class="profile-capacity-card profile-capacity-teams" aria-labelledby="team-capacity-title">
        <div class="profile-capacity-section-head">
          <h2 id="team-capacity-title">Ekip kapasiteleri</h2>
          <span>{{ teams.length }} ekip</span>
        </div>

        <div class="profile-capacity-team-list" role="list">
          <article v-for="team in teams" :key="team.id" class="profile-capacity-team-row" role="listitem">
            <span class="profile-capacity-team-row__icon" aria-hidden="true">
              <AppIcon :name="team.icon" :size="25" />
            </span>
            <span class="profile-capacity-team-row__copy">
              <strong>{{ team.name }}</strong>
              <small>{{ team.workingHours }}</small>
              <progress class="profile-capacity-mini-bar" :value="team.usedToday" :max="team.capacity" aria-hidden="true"></progress>
            </span>
            <span class="profile-capacity-row-stepper" :aria-label="`${team.name} günlük kapasitesi`">
              <button type="button" :aria-label="`${team.name} kapasitesini azalt`" @click="adjustTeamCapacity(team.id, -1)">
                <AppIcon name="minus" :size="17" />
              </button>
              <output aria-live="polite">{{ team.capacity }} <small>iş</small></output>
              <button type="button" :aria-label="`${team.name} kapasitesini artır`" @click="adjustTeamCapacity(team.id, 1)">
                <AppIcon name="plus" :size="17" />
              </button>
            </span>
          </article>
        </div>
      </section>

      <section class="profile-capacity-card profile-capacity-info" aria-labelledby="capacity-info-title">
        <span class="profile-capacity-info__icon" aria-hidden="true">
          <AppIcon name="shield" :size="25" />
        </span>
        <div>
          <h2 id="capacity-info-title">Kapasiten dolduğunda fazla iş gönderimi sınırlanır.</h2>
          <p>İstersen ekip bazında kapasiteyi gün içinde değiştirebilirsin.</p>
        </div>
      </section>

      <div class="profile-capacity-save-bar">
        <button class="profile-capacity-save-button" type="button" data-testid="capacity-save-button" @click="saveCapacity">
          <AppIcon :name="saveState === 'saved' ? 'check' : 'check'" :size="19" />
          <span>{{ saveState === "saved" ? "Kaydedildi" : "Kaydet" }}</span>
        </button>
      </div>
    </div>
  </AppPage>
</template>

<style scoped>
.profile-capacity-page {
  display: grid;
  gap: var(--space-4);
  padding-bottom: calc(90px + env(safe-area-inset-bottom, 0px));
}

.profile-capacity-summary,
.profile-capacity-card,
.profile-capacity-modes {
  border: 1px solid color-mix(in srgb, var(--color-border) 90%, transparent);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.profile-capacity-summary {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4);
}

.profile-capacity-summary__icon,
.profile-capacity-team-row__icon,
.profile-capacity-info__icon {
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
}

.profile-capacity-summary__icon {
  width: 72px;
  height: 72px;
}

.profile-capacity-summary__copy {
  min-width: 0;
}

.profile-capacity-summary h2,
.profile-capacity-card h2,
.profile-capacity-section-head h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-card-title);
  font-weight: 900;
  line-height: var(--line-tight);
  letter-spacing: 0;
}

.profile-capacity-value {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 6px;
  color: var(--text-primary);
}

.profile-capacity-value strong {
  font-size: 44px;
  font-weight: 950;
  line-height: 1;
}

.profile-capacity-value span {
  font-size: var(--font-size-body-lg);
  font-weight: 760;
}

.profile-capacity-summary p,
.profile-capacity-company p,
.profile-capacity-info p {
  margin: 8px 0 0;
  color: var(--text-muted);
  font-size: var(--font-size-small);
  font-weight: 650;
  line-height: 1.35;
}

.profile-capacity-chip {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  min-height: 32px;
  margin-top: 12px;
  border: 1px solid color-mix(in srgb, var(--color-primary-dark) 24%, var(--color-border));
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  padding: 0 12px;
  font-size: var(--font-size-small);
  font-weight: 850;
}

.profile-capacity-progress {
  grid-column: 1 / -1;
  display: grid;
  gap: 8px;
}

.profile-capacity-progress__bar,
.profile-capacity-mini-bar {
  overflow: hidden;
  width: 100%;
  border-radius: 999px;
  border: 0;
  background: var(--color-neutral-100);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-border) 82%, transparent);
  appearance: none;
}

.profile-capacity-progress__bar {
  height: 12px;
}

.profile-capacity-mini-bar {
  display: block;
  height: 8px;
}

.profile-capacity-progress__bar::-webkit-progress-bar,
.profile-capacity-mini-bar::-webkit-progress-bar {
  border-radius: inherit;
  background: var(--color-neutral-100);
}

.profile-capacity-progress__bar::-webkit-progress-value,
.profile-capacity-mini-bar::-webkit-progress-value,
.profile-capacity-progress__bar::-moz-progress-bar,
.profile-capacity-mini-bar::-moz-progress-bar {
  border-radius: inherit;
  background: var(--color-primary-dark);
}

.profile-capacity-progress__labels {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
}

.profile-capacity-progress__labels small {
  font-size: var(--font-size-small);
  font-weight: 820;
}

.profile-capacity-card {
  padding: var(--space-4);
}

.profile-capacity-company {
  text-align: center;
}

.profile-capacity-stepper {
  display: grid;
  grid-template-columns: 56px 74px 56px;
  width: fit-content;
  min-height: 54px;
  overflow: hidden;
  margin: var(--space-4) auto 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
}

.profile-capacity-stepper button,
.profile-capacity-stepper output,
.profile-capacity-row-stepper button,
.profile-capacity-row-stepper output {
  display: inline-grid;
  place-items: center;
  border: 0;
  border-left: 1px solid var(--color-border);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-weight: 920;
}

.profile-capacity-stepper button:first-child,
.profile-capacity-row-stepper button:first-child {
  border-left: 0;
}

.profile-capacity-stepper button,
.profile-capacity-row-stepper button {
  color: var(--color-primary-dark);
  cursor: pointer;
}

.profile-capacity-stepper output {
  font-size: 32px;
}

.profile-capacity-modes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
  padding: var(--space-3);
}

.profile-capacity-mode {
  display: inline-flex;
  min-width: 0;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: var(--font-size-small);
  font-weight: 850;
  white-space: nowrap;
  cursor: pointer;
}

.profile-capacity-mode[aria-pressed="true"] {
  border-color: var(--color-primary-dark);
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent);
}

.profile-capacity-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.profile-capacity-section-head span {
  color: var(--color-primary-dark);
  font-size: var(--font-size-body);
  font-weight: 900;
}

.profile-capacity-team-list {
  display: grid;
  gap: var(--space-3);
}

.profile-capacity-team-row {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-3);
  min-height: 82px;
  border: 1px solid color-mix(in srgb, var(--color-border) 86%, transparent);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  padding: 10px;
}

.profile-capacity-team-row__icon {
  width: 52px;
  height: 52px;
}

.profile-capacity-team-row__copy {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.profile-capacity-team-row__copy strong {
  overflow: hidden;
  color: var(--text-primary);
  font-size: var(--font-size-body);
  font-weight: 900;
  line-height: var(--line-tight);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-capacity-team-row__copy small {
  color: var(--text-muted);
  font-size: var(--font-size-small);
  font-weight: 650;
  line-height: 1.2;
}

.profile-capacity-mini-bar {
  width: min(112px, 100%);
  height: 7px;
  margin-top: 4px;
}

.profile-capacity-row-stepper {
  display: grid;
  grid-template-columns: 42px 58px 42px;
  min-height: 44px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
}

.profile-capacity-row-stepper output {
  font-size: var(--font-size-body-lg);
}

.profile-capacity-row-stepper output small {
  margin-left: 2px;
  font-size: var(--font-size-small);
  font-weight: 760;
}

.profile-capacity-info {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  align-items: center;
  gap: var(--space-3);
}

.profile-capacity-info__icon {
  width: 52px;
  height: 52px;
}

.profile-capacity-save-bar {
  position: sticky;
  z-index: 10;
  bottom: 0;
  margin: 0 calc(var(--page-padding-x, 14px) * -1);
  padding: 10px var(--page-padding-x, 14px) calc(10px + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(180deg, transparent, var(--color-app-bg) 24%, var(--color-app-bg));
}

.profile-capacity-save-button {
  display: inline-flex;
  width: 100%;
  min-height: 54px;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: 0;
  border-radius: var(--radius-card-compact);
  background: var(--color-primary-dark);
  color: var(--color-surface);
  box-shadow: 0 12px 24px color-mix(in srgb, var(--color-primary-dark) 22%, transparent);
  font-family: var(--font-family-base);
  font-size: var(--font-size-body-lg);
  font-weight: 950;
  cursor: pointer;
}

@media (max-width: 359px) {
  .profile-capacity-summary {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: var(--space-3);
    padding: var(--space-3);
  }

  .profile-capacity-summary__icon {
    width: 58px;
    height: 58px;
  }

  .profile-capacity-value strong {
    font-size: 36px;
  }

  .profile-capacity-modes {
    grid-template-columns: 1fr;
  }

  .profile-capacity-team-row {
    grid-template-columns: 42px minmax(0, 1fr);
  }

  .profile-capacity-team-row__icon {
    width: 42px;
    height: 42px;
  }

  .profile-capacity-row-stepper {
    grid-column: 1 / -1;
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
