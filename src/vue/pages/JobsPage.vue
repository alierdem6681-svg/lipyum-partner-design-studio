<script setup>
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppEmptyState from "../components/ui/AppEmptyState.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShell.js";
import { useJobsStore } from "../stores/jobs.js";

const jobs = useJobsStore();
const appShell = useAppShellStore();
const filters = [
  { value: "all", label: "Tümü" },
  { value: "ready", label: "Hazır" },
  { value: "pool", label: "Havuz" },
  { value: "offer", label: "Teklif" },
  { value: "direct", label: "Direkt" },
];

function openJob(job) {
  jobs.selectJob(job);
  appShell.openSheet("job-detail");
}
</script>

<template>
  <AppPage title="İş Al">
    <div class="v-stack" data-testid="jobs-page">
      <AppCard padding="md" variant="hero">
        <strong class="block truncate text-section-title font-extrabold text-slate-950">Bugün alabileceğin işler</strong>
        <p class="mt-1 text-small font-semibold leading-normal text-slate-600">Hazır müşteri, havuz ve teklif fırsatları tek yerde.</p>
      </AppCard>
      <AppFilterChips v-model="jobs.jobsFilter" :items="filters" aria-label="İş fırsatı filtreleri" />
      <AppCard
        v-for="job in jobs.filteredAvailableJobs"
        :key="job.id"
        as="article"
        padding="md"
        data-testid="job-card"
      >
        <div class="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><AppIcon name="briefcase" /></span>
          <span class="min-w-0">
            <strong class="block truncate text-card-title font-extrabold text-slate-950">{{ job.title }}</strong>
            <small class="block truncate text-caption font-bold text-slate-500">{{ job.area }} · {{ job.price }}</small>
          </span>
          <AppChip tone="success">{{ job.status }}</AppChip>
        </div>
        <AppButton class="mt-3" full-width size="sm" @click="openJob(job)">{{ job.primary }}</AppButton>
      </AppCard>
      <AppEmptyState v-if="!jobs.filteredAvailableJobs.length" title="Bu filtrede iş yok" description="Yeni fırsatlar geldiğinde burada görünür." />
    </div>
  </AppPage>
</template>
