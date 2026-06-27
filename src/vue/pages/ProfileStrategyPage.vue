<script setup>
import { computed, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const storageKey = "lipyum:profile-strategy";

const strategyOptions = [
  {
    id: "low_cost",
    icon: "shield",
    title: "Düşük maliyet modu",
    description: "Daha az ödeme yaparsın, iş yönlendirme hızın azalabilir.",
    metrics: [
      { icon: "wallet", label: "Maliyet düşük" },
      { icon: "users", label: "Fırsat daha sınırlı" },
    ],
  },
  {
    id: "balanced",
    icon: "sliders",
    title: "Dengeli mod",
    description: "Günlük iş akışı ve maliyet dengeli ilerler.",
    recommended: true,
    metrics: [
      { icon: "wallet", label: "Dengeli maliyet" },
      { icon: "users", label: "Dengeli fırsat" },
    ],
  },
  {
    id: "high_jobs",
    icon: "trend-up",
    title: "Yüksek iş alma modu",
    description: "Daha fazla komisyonla daha çok iş fırsatı hedeflersin.",
    metrics: [
      { icon: "wallet", label: "Maliyet yüksek" },
      { icon: "zap", label: "Fırsat önceliği yüksek" },
    ],
  },
];

const initialStrategy = window.localStorage.getItem(storageKey) || "balanced";
const selectedStrategy = ref(strategyOptions.some((item) => item.id === initialStrategy) ? initialStrategy : "balanced");

const selectedOption = computed(
  () => strategyOptions.find((item) => item.id === selectedStrategy.value) || strategyOptions[1],
);

const scaleClass = computed(() => `is-${selectedStrategy.value.replace("_", "-")}`);

function selectStrategy(id) {
  selectedStrategy.value = id;
}

function saveStrategy() {
  window.localStorage.setItem(storageKey, selectedStrategy.value);
  shell.showToast(`${selectedOption.value.title} kaydedildi.`);
}
</script>

<template>
  <AppPage title="Strateji" class="profile-strategy-page" data-testid="profile-strategy-page">
    <section class="profile-strategy-summary" aria-labelledby="strategy-summary-title">
      <span class="profile-strategy-summary__icon" aria-hidden="true">
        <AppIcon :name="selectedOption.icon" :size="42" />
      </span>
      <div class="profile-strategy-summary__copy">
        <span>Şu anki stratejin</span>
        <h2 id="strategy-summary-title">{{ selectedOption.title }}</h2>
        <p>{{ selectedOption.description }}</p>
        <span v-if="selectedOption.recommended" class="profile-strategy-badge">
          <AppIcon name="star" :size="14" />
          Önerilen
        </span>
      </div>

      <div :class="['profile-strategy-scale', scaleClass]" aria-hidden="true">
        <span class="profile-strategy-scale__track">
          <span class="profile-strategy-scale__dot is-low"></span>
          <span class="profile-strategy-scale__dot is-mid"></span>
          <span class="profile-strategy-scale__dot is-high"></span>
        </span>
        <span class="profile-strategy-scale__labels">
          <small>Az maliyet</small>
          <small>Denge</small>
          <small>Daha çok iş</small>
        </span>
      </div>
    </section>

    <section class="profile-strategy-section" aria-labelledby="strategy-options-title">
      <h2 id="strategy-options-title">Strateji seç</h2>
      <div class="profile-strategy-list" role="radiogroup" aria-label="İş alma stratejisi">
        <button
          v-for="option in strategyOptions"
          :key="option.id"
          class="profile-strategy-option"
          :class="{ 'is-selected': selectedStrategy === option.id }"
          type="button"
          role="radio"
          :aria-checked="selectedStrategy === option.id ? 'true' : 'false'"
          :data-testid="`strategy-option-${option.id}`"
          @click="selectStrategy(option.id)"
        >
          <span class="profile-strategy-option__icon" aria-hidden="true">
            <AppIcon :name="option.icon" :size="30" />
          </span>
          <span class="profile-strategy-option__copy">
            <span class="profile-strategy-option__title">
              {{ option.title }}
              <span v-if="option.recommended" class="profile-strategy-mini-badge">Önerilen</span>
            </span>
            <span class="profile-strategy-option__description">{{ option.description }}</span>
          </span>
          <span class="profile-strategy-option__check" aria-hidden="true">
            <AppIcon v-if="selectedStrategy === option.id" name="check" :size="18" />
          </span>
          <span class="profile-strategy-option__metrics">
            <span v-for="metric in option.metrics" :key="metric.label" class="profile-strategy-metric">
              <AppIcon :name="metric.icon" :size="16" />
              {{ metric.label }}
            </span>
          </span>
        </button>
      </div>
    </section>

    <section class="profile-strategy-info" aria-labelledby="strategy-info-title">
      <h2 id="strategy-info-title">Nasıl çalışır?</h2>
      <div class="profile-strategy-info__rows">
        <p>
          <span aria-hidden="true"><AppIcon name="refresh" :size="18" /></span>
          Strateji değişince iş yönlendirme önceliğin güncellenir.
        </p>
        <p>
          <span aria-hidden="true"><AppIcon name="clock" :size="18" /></span>
          Kapasite ve çalışma saatlerin dikkate alınır.
        </p>
        <p>
          <span aria-hidden="true"><AppIcon name="settings" :size="18" /></span>
          İstediğin zaman tekrar değiştirebilirsin.
        </p>
      </div>
    </section>

    <div class="profile-strategy-save">
      <AppButton size="lg" full-width icon="check" type="button" @click="saveStrategy">
        Stratejiyi Kaydet
      </AppButton>
    </div>
  </AppPage>
</template>

<style scoped>
.profile-strategy-page {
  display: grid;
  gap: var(--space-4);
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
}

.profile-strategy-summary,
.profile-strategy-option,
.profile-strategy-info {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.profile-strategy-summary {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-5);
}

.profile-strategy-summary__icon,
.profile-strategy-option__icon,
.profile-strategy-info__rows span {
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
}

.profile-strategy-summary__icon {
  width: 72px;
  height: 72px;
}

.profile-strategy-summary__copy {
  min-width: 0;
}

.profile-strategy-summary__copy > span:first-child {
  display: block;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold, 700);
}

.profile-strategy-summary h2,
.profile-strategy-section h2,
.profile-strategy-info h2 {
  margin: 0;
  color: var(--color-text);
  letter-spacing: 0;
}

.profile-strategy-summary h2 {
  margin-top: var(--space-1);
  font-size: clamp(1.55rem, 7vw, 2rem);
  line-height: 1.08;
  font-weight: var(--font-weight-bold, 800);
}

.profile-strategy-summary p,
.profile-strategy-option__description,
.profile-strategy-info__rows p {
  color: var(--color-text-muted);
  line-height: 1.35;
}

.profile-strategy-summary p {
  margin: var(--space-2) 0 0;
  font-size: var(--font-size-sm);
}

.profile-strategy-badge,
.profile-strategy-mini-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  border: 1px solid var(--color-primary-border);
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  font-weight: var(--font-weight-bold, 800);
}

.profile-strategy-badge {
  min-height: 30px;
  margin-top: var(--space-3);
  padding: 0 var(--space-3);
  font-size: var(--font-size-sm);
}

.profile-strategy-mini-badge {
  flex: none;
  min-height: 24px;
  padding: 0 var(--space-2);
  font-size: var(--font-size-xs);
}

.profile-strategy-scale {
  grid-column: 1 / -1;
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.profile-strategy-scale__track {
  position: relative;
  display: block;
  height: 2px;
  margin: 0 var(--space-2);
  background: var(--color-border);
}

.profile-strategy-scale__dot {
  position: absolute;
  top: 50%;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--color-neutral-300);
  transform: translate(-50%, -50%);
}

.profile-strategy-scale__dot.is-low {
  left: 0;
}

.profile-strategy-scale__dot.is-mid {
  left: 50%;
}

.profile-strategy-scale__dot.is-high {
  left: 100%;
}

.profile-strategy-scale.is-low-cost .is-low,
.profile-strategy-scale.is-balanced .is-mid,
.profile-strategy-scale.is-high-jobs .is-high {
  width: 28px;
  height: 28px;
  border: 4px solid var(--color-surface);
  background: var(--color-primary-dark);
  box-shadow: 0 0 0 2px var(--color-primary-dark);
}

.profile-strategy-scale__labels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold, 700);
}

.profile-strategy-scale__labels small:nth-child(2) {
  text-align: center;
}

.profile-strategy-scale__labels small:nth-child(3) {
  text-align: right;
}

.profile-strategy-scale.is-low-cost .profile-strategy-scale__labels small:first-child,
.profile-strategy-scale.is-balanced .profile-strategy-scale__labels small:nth-child(2),
.profile-strategy-scale.is-high-jobs .profile-strategy-scale__labels small:nth-child(3) {
  color: var(--color-primary-dark);
}

.profile-strategy-section {
  display: grid;
  gap: var(--space-3);
}

.profile-strategy-section h2,
.profile-strategy-info h2 {
  font-size: var(--font-size-lg, 1.125rem);
  font-weight: var(--font-weight-bold, 800);
}

.profile-strategy-list {
  display: grid;
  gap: var(--space-3);
}

.profile-strategy-option {
  position: relative;
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 30px;
  gap: var(--space-3);
  align-items: start;
  width: 100%;
  min-height: 118px;
  padding: var(--space-4);
  color: inherit;
  text-align: left;
}

.profile-strategy-option.is-selected {
  border-color: var(--color-primary-dark);
  background: color-mix(in srgb, var(--color-primary-soft) 72%, var(--color-surface));
  box-shadow: 0 12px 24px color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.profile-strategy-option__icon {
  width: 54px;
  height: 54px;
}

.profile-strategy-option__copy {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
}

.profile-strategy-option__title {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  color: var(--color-text);
  font-size: var(--font-size-md, 1rem);
  font-weight: var(--font-weight-bold, 800);
  line-height: 1.2;
}

.profile-strategy-option__description {
  font-size: var(--font-size-sm);
}

.profile-strategy-option__check {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1.5px solid var(--color-border-strong, var(--color-border));
  border-radius: 999px;
  color: transparent;
}

.profile-strategy-option.is-selected .profile-strategy-option__check {
  border-color: var(--color-primary-dark);
  background: var(--color-primary-dark);
  color: var(--color-surface);
}

.profile-strategy-option__metrics {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-2);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.profile-strategy-metric {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold, 700);
}

.profile-strategy-metric .v-icon {
  flex: none;
  color: var(--color-primary-dark);
}

.profile-strategy-info {
  padding: var(--space-4);
}

.profile-strategy-info__rows {
  display: grid;
  margin-top: var(--space-2);
}

.profile-strategy-info__rows p {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: var(--space-3);
  align-items: center;
  margin: 0;
  padding: var(--space-3) 0;
  font-size: var(--font-size-sm);
}

.profile-strategy-info__rows p + p {
  border-top: 1px solid var(--color-border);
}

.profile-strategy-info__rows span {
  width: 32px;
  height: 32px;
}

.profile-strategy-save {
  position: fixed;
  right: max(var(--space-4), env(safe-area-inset-right));
  bottom: max(var(--space-4), env(safe-area-inset-bottom));
  left: max(var(--space-4), env(safe-area-inset-left));
  z-index: 25;
}

.profile-strategy-save :deep(.v-btn) {
  min-height: 56px;
  border-radius: var(--radius-card-compact);
  background: var(--color-primary-dark);
  color: var(--color-surface);
  box-shadow: 0 14px 26px color-mix(in srgb, var(--color-primary-dark) 22%, transparent);
}

@media (max-width: 340px) {
  .profile-strategy-page {
    gap: var(--space-3);
  }

  .profile-strategy-summary,
  .profile-strategy-option {
    padding: var(--space-4);
  }

  .profile-strategy-summary {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: var(--space-3);
  }

  .profile-strategy-summary__icon {
    width: 58px;
    height: 58px;
  }

  .profile-strategy-option {
    grid-template-columns: 48px minmax(0, 1fr) 28px;
  }

  .profile-strategy-option__icon {
    width: 46px;
    height: 46px;
  }

  .profile-strategy-option__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
