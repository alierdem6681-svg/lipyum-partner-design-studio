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
  { value: "new", label: "Yeni İşler" },
  { value: "active", label: "Aktif" },
  { value: "offers", label: "Tekliflerim" },
  { value: "completed", label: "Tamamlananlar" },
  { value: "problem", label: "Sorunlu" },
];

function openJob(job) {
  jobs.selectJob(job);
  appShell.openSheet("job-detail");
}
</script>

<template>
  <AppPage title="İşlerim">
    <div class="v-stack" data-testid="my-jobs-page">
      <AppFilterChips v-model="jobs.myJobsFilter" :items="filters" aria-label="İşlerim filtreleri" />
      <AppCard
        v-for="job in jobs.filteredMyJobs"
        :key="job.id"
        as="article"
        padding="md"
        data-testid="my-job-card"
      >
        <div class="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><AppIcon name="clipboard" /></span>
          <span class="min-w-0">
            <strong class="block truncate text-card-title font-extrabold text-slate-950">{{ job.title }}</strong>
            <small class="block truncate text-caption font-bold text-slate-500">{{ job.area }}</small>
          </span>
          <AppChip :tone="job.type === 'problem' ? 'warning' : 'success'">{{ job.status }}</AppChip>
        </div>
        <AppButton class="mt-3" full-width size="sm" @click="openJob(job)">{{ job.primary }}</AppButton>
      </AppCard>
      <AppEmptyState v-if="!jobs.filteredMyJobs.length" title="İş bulunamadı" description="Seçili filtreye uygun iş yok." />
    </div>
  </AppPage>
</template>
