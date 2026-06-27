<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import {
  createDefaultWorkingHoursState,
  formatOpenDaysCount,
  formatWorkingRange,
  isWorkingDayOpen,
  workingHourPresets,
  workingWeekDays,
} from "../data/workingHoursModel.js";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const state = reactive(createDefaultWorkingHoursState());
const saveState = ref("idle");
const showSettingsHint = ref(false);

const todayId = computed(() => {
  const index = new Date().getDay();
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][index];
});

const todayOpen = computed(() => isWorkingDayOpen(state.openDays, todayId.value));
const openDaysCount = computed(() => formatOpenDaysCount(state.openDays));
const workingRange = computed(() => formatWorkingRange(state.startTime, state.endTime));

function setPreset(preset) {
  state.activePreset = preset.id;
  if (preset.id !== "custom") {
    state.openDays = [...preset.days];
  }
}

function toggleDay(dayId) {
  state.activePreset = "custom";
  if (isWorkingDayOpen(state.openDays, dayId)) {
    state.openDays = state.openDays.filter((id) => id !== dayId);
    return;
  }
  state.openDays = [...state.openDays, dayId];
}

function toggleToday() {
  toggleDay(todayId.value);
}

function saveWorkingHours() {
  saveState.value = "saved";
  shell.showToast("Çalışma saatlerin kaydedildi.");
  window.setTimeout(() => {
    saveState.value = "idle";
  }, 1800);
}

function openSettingsHint() {
  showSettingsHint.value = true;
  shell.showToast("Haftalık planını gün bazında düzenleyebilirsin.");
  window.setTimeout(() => {
    showSettingsHint.value = false;
  }, 2200);
}

onMounted(() => {
  window.addEventListener("lipyum:working-hours-settings", openSettingsHint);
});

onUnmounted(() => {
  window.removeEventListener("lipyum:working-hours-settings", openSettingsHint);
});
</script>

<template>
  <AppPage title="Çalışma Saatlerim" data-testid="working-hours-page">
    <div class="working-hours-page">
      <section class="working-hours-status" aria-labelledby="working-hours-status-title">
        <span class="working-hours-status__icon" aria-hidden="true">
          <AppIcon name="clock" :size="24" />
        </span>
        <div class="working-hours-status__copy">
          <span class="working-hours-status__eyebrow">Canlı profil</span>
          <h2 id="working-hours-status-title">{{ todayOpen ? "Bugün açıksın" : "Bugün kapalısın" }}</h2>
          <p>
            {{
              todayOpen
                ? `${workingRange} arasında iş alabilirsin`
                : "Müşterilere bugün kapalı görünürsün"
            }}
          </p>
          <span class="working-hours-status__badge">
            <AppIcon name="eye" :size="14" />
            {{ todayOpen ? "Canlı profilinde görünür" : "Canlı profilinde kapalı" }}
          </span>
        </div>
        <button
          class="working-hours-toggle"
          :class="{ 'is-on': todayOpen }"
          type="button"
          role="switch"
          :aria-checked="todayOpen"
          data-testid="working-hours-today-toggle"
          @click="toggleToday"
        >
          <span aria-hidden="true"></span>
        </button>
      </section>

      <section class="working-hours-section" aria-labelledby="working-hours-preset-title">
        <div class="working-hours-section__head">
          <h2 id="working-hours-preset-title">Hazır çalışma planı</h2>
          <span>{{ openDaysCount }}</span>
        </div>
        <div class="working-hours-presets" data-testid="working-hours-presets">
          <button
            v-for="preset in workingHourPresets"
            :key="preset.id"
            class="working-hours-preset"
            type="button"
            :aria-pressed="state.activePreset === preset.id"
            @click="setPreset(preset)"
          >
            <span>{{ preset.label }}</span>
            <small>{{ preset.description }}</small>
          </button>
        </div>
      </section>

      <section class="working-hours-time-card" aria-labelledby="working-hours-range-title">
        <div class="working-hours-section__head">
          <h2 id="working-hours-range-title">Varsayılan saat</h2>
          <span>Her açık gün</span>
        </div>
        <div class="working-hours-time-grid">
          <label class="working-hours-time-field">
            <span>Başlangıç</span>
            <input v-model="state.startTime" type="time" aria-label="Başlangıç saati" />
          </label>
          <label class="working-hours-time-field">
            <span>Bitiş</span>
            <input v-model="state.endTime" type="time" aria-label="Bitiş saati" />
          </label>
        </div>
        <button class="working-hours-secondary-action" type="button" @click="openSettingsHint">
          <AppIcon name="plus" :size="16" />
          <span>Saat aralığı ekle</span>
        </button>
      </section>

      <section class="working-hours-week" aria-labelledby="working-hours-week-title">
        <div class="working-hours-section__head">
          <h2 id="working-hours-week-title">Haftalık plan</h2>
          <span>{{ openDaysCount }}</span>
        </div>

        <div
          v-if="showSettingsHint"
          class="working-hours-inline-note"
          role="status"
          data-testid="working-hours-settings-note"
        >
          Günlere dokunarak çalışma planını hızlıca açıp kapatabilirsin.
        </div>

        <div class="working-hours-day-list" role="list">
          <button
            v-for="day in workingWeekDays"
            :key="day.id"
            class="working-hours-day-row"
            :class="{ 'is-open': isWorkingDayOpen(state.openDays, day.id) }"
            type="button"
            role="checkbox"
            :aria-checked="isWorkingDayOpen(state.openDays, day.id)"
            :data-testid="`working-hours-day-${day.id}`"
            @click="toggleDay(day.id)"
          >
            <span class="working-hours-day-row__icon" aria-hidden="true">
              <AppIcon :name="isWorkingDayOpen(state.openDays, day.id) ? 'check' : 'x'" :size="16" />
            </span>
            <span class="working-hours-day-row__copy">
              <strong>{{ day.label }}</strong>
              <small>{{ isWorkingDayOpen(state.openDays, day.id) ? "Açık" : "Kapalı" }}</small>
            </span>
            <span class="working-hours-day-row__range">
              {{ isWorkingDayOpen(state.openDays, day.id) ? workingRange : "Kapalı" }}
            </span>
          </button>
        </div>
      </section>

      <div class="working-hours-save-bar">
        <button
          class="working-hours-save-button"
          type="button"
          data-testid="working-hours-save-button"
          @click="saveWorkingHours"
        >
          <AppIcon :name="saveState === 'saved' ? 'check' : 'clock'" :size="18" />
          <span>{{ saveState === "saved" ? "Kaydedildi" : "Kaydet" }}</span>
        </button>
      </div>
    </div>
  </AppPage>
</template>

<style scoped>
.working-hours-page {
  display: grid;
  gap: var(--space-4);
  padding-bottom: calc(82px + env(safe-area-inset-bottom, 0px));
}

.working-hours-status,
.working-hours-time-card,
.working-hours-week {
  border: 1px solid color-mix(in srgb, var(--color-primary) 20%, var(--color-border));
  border-radius: var(--radius-card);
  background:
    radial-gradient(circle at 92% 10%, color-mix(in srgb, var(--color-primary-soft) 82%, transparent), transparent 32%),
    var(--color-surface);
  box-shadow: var(--shadow-card);
}

.working-hours-status {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

.working-hours-status__icon,
.working-hours-day-row__icon {
  display: inline-grid;
  place-items: center;
  color: var(--color-primary-dark);
  background: var(--color-primary-soft);
}

.working-hours-status__icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
}

.working-hours-status__copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.working-hours-status__eyebrow,
.working-hours-section__head span,
.working-hours-time-field span,
.working-hours-preset small,
.working-hours-day-row__copy small {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 850;
  line-height: var(--line-tight);
}

.working-hours-status h2,
.working-hours-section__head h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--font-size-body);
  font-weight: 950;
  line-height: var(--line-tight);
}

.working-hours-status p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  font-weight: 760;
  line-height: 1.25;
}

.working-hours-status__badge {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  border-radius: 999px;
  padding: 5px 8px;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  font-size: 11px;
  font-weight: 900;
}

.working-hours-toggle {
  position: relative;
  width: 54px;
  height: 34px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-neutral-100);
  padding: 3px;
  color: inherit;
}

.working-hours-toggle span {
  display: block;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-surface);
  box-shadow: 0 4px 10px color-mix(in srgb, var(--text-primary) 14%, transparent);
  transition: transform var(--lp-transition-fast), background var(--lp-transition-fast);
}

.working-hours-toggle.is-on {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.working-hours-toggle.is-on span {
  transform: translateX(20px);
}

.working-hours-section {
  display: grid;
  gap: 10px;
}

.working-hours-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.working-hours-presets {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
}

.working-hours-preset {
  display: grid;
  min-height: 46px;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  color: var(--text-primary);
  font-family: var(--font-family-base);
  text-align: center;
  box-shadow: 0 6px 14px color-mix(in srgb, var(--text-primary) 4%, transparent);
}

.working-hours-preset span {
  font-size: 12px;
  font-weight: 950;
  line-height: 1;
}

.working-hours-preset small {
  display: none;
}

.working-hours-preset[aria-pressed="true"] {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.working-hours-time-card,
.working-hours-week {
  display: grid;
  gap: 12px;
  padding: 14px;
}

.working-hours-time-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.working-hours-time-field {
  display: grid;
  gap: 6px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: color-mix(in srgb, var(--color-neutral-50) 78%, var(--color-surface));
  padding: 11px 12px;
}

.working-hours-time-field input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-family-base);
  font-size: 20px;
  font-weight: 950;
  line-height: 1;
}

.working-hours-secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  border: 1px dashed var(--color-primary-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  font-family: var(--font-family-base);
  font-size: var(--font-size-small);
  font-weight: 920;
}

.working-hours-inline-note {
  border: 1px solid var(--color-primary-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  padding: 10px 12px;
  font-size: var(--font-size-small);
  font-weight: 850;
  line-height: 1.25;
}

.working-hours-day-list {
  display: grid;
  gap: 8px;
}

.working-hours-day-row {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card-compact);
  background: var(--color-surface);
  color: var(--text-primary);
  padding: 9px 10px;
  font-family: var(--font-family-base);
  text-align: left;
}

.working-hours-day-row.is-open {
  border-color: color-mix(in srgb, var(--color-primary) 34%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary-soft) 52%, var(--color-surface));
}

.working-hours-day-row__icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
}

.working-hours-day-row:not(.is-open) .working-hours-day-row__icon {
  color: var(--text-muted);
  background: var(--color-neutral-100);
}

.working-hours-day-row__copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.working-hours-day-row__copy strong,
.working-hours-day-row__range {
  color: var(--text-primary);
  font-size: var(--font-size-small);
  font-weight: 930;
  line-height: var(--line-tight);
}

.working-hours-day-row__range {
  white-space: nowrap;
  color: var(--color-primary-dark);
}

.working-hours-day-row:not(.is-open) .working-hours-day-row__range {
  color: var(--text-muted);
}

.working-hours-save-bar {
  position: sticky;
  z-index: 12;
  bottom: 0;
  display: grid;
  margin: 0 calc(var(--page-padding-x, 14px) * -1);
  padding: 10px var(--page-padding-x, 14px) calc(10px + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(180deg, transparent, var(--color-app-bg) 24%, var(--color-app-bg));
}

.working-hours-save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 52px;
  border: 0;
  border-radius: var(--radius-card-compact);
  background: var(--color-primary-dark);
  color: var(--color-surface);
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  font-weight: 950;
  box-shadow: 0 12px 24px color-mix(in srgb, var(--color-primary-dark) 22%, transparent);
}

@media (max-width: 359px) {
  .working-hours-status {
    grid-template-columns: 42px 1fr auto;
    padding: 12px;
  }

  .working-hours-status__icon {
    width: 42px;
    height: 42px;
  }

  .working-hours-presets {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .working-hours-day-row {
    grid-template-columns: 32px minmax(0, 1fr);
  }

  .working-hours-day-row__range {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
