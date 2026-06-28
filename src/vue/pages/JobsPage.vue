<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import JobOpportunityCard from "../components/jobs/JobOpportunityCard.vue";
import { jobOpportunities, jobOpportunityFilters, jobTypePriority } from "../data/jobOpportunitiesData.js";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const activeFilter = ref("all");
const visibleCount = ref(4);
const isLoading = ref(false);
const loadTimer = ref(null);
const loadSentinel = ref(null);
let observer = null;

const sortedJobs = computed(() => [...jobOpportunities].sort((a, b) => {
  const typeDelta = (jobTypePriority[a.type] ?? 9) - (jobTypePriority[b.type] ?? 9);
  if (activeFilter.value === "all" && typeDelta !== 0) return typeDelta;
  return a.droppedAtMinutes - b.droppedAtMinutes;
}));

const filteredJobs = computed(() => {
  if (activeFilter.value === "all") return sortedJobs.value;
  return sortedJobs.value.filter((job) => job.type === activeFilter.value);
});

const visibleJobs = computed(() => filteredJobs.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < filteredJobs.value.length);

watch(activeFilter, () => {
  visibleCount.value = 4;
  nextTick(() => {
    if (observer && loadSentinel.value) observer.observe(loadSentinel.value);
  });
});

onMounted(() => {
  if (!("IntersectionObserver" in window)) return;
  observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) loadMore();
  }, { rootMargin: "180px 0px" });
  if (loadSentinel.value) observer.observe(loadSentinel.value);
});

onBeforeUnmount(() => {
  window.clearTimeout(loadTimer.value);
  observer?.disconnect();
});

function selectFilter(filterId) {
  activeFilter.value = filterId;
}

function loadMore() {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  observer?.unobserve(loadSentinel.value);
  window.clearTimeout(loadTimer.value);
  loadTimer.value = window.setTimeout(() => {
    visibleCount.value = Math.min(visibleCount.value + 3, filteredJobs.value.length);
    isLoading.value = false;
    nextTick(() => {
      if (observer && hasMore.value && loadSentinel.value) observer.observe(loadSentinel.value);
    });
  }, 260);
}

function openJobSheet(job, actionLabel) {
  const body = [
    `${job.service} - ${job.location}`,
    job.status,
    job.duration || job.price ? `${job.duration || ""}${job.duration && job.price ? " • " : ""}${job.price || ""}` : "",
  ].filter(Boolean).join("\n");
  shell.openSheet({
    title: actionLabel,
    description: job.ageLabel,
    body,
  });
}

function handlePrimary(job) {
  if (job.type === "appointment") {
    openJobSheet(job, "Müşteri sizi bekliyor");
    return;
  }
  if (job.type === "quote") {
    openJobSheet(job, "Teklif verme akışı");
    return;
  }
  openJobSheet(job, "İşi satın alma akışı");
}

function handleQuickAction({ job, action }) {
  const messages = {
    call: `${job.service} müşterisi aranıyor.`,
    message: `${job.service} için mesaj hazırlanıyor.`,
    competitors: `${job.service} teklif detayları açıldı.`,
    buy: `${job.service} satın alma özeti açıldı.`,
  };
  shell.showToast(messages[action] || "İşlem hazır.");
}
</script>

<template>
  <AppPage title="İş Al" class="job-cta-page" data-testid="jobs-page">
    <section class="job-cta-hero" aria-label="İş Al">
      <div id="job-cta-title" class="job-cta-hero__title">İş Al</div>
      <p>Size uygun yeni işler</p>
    </section>

    <nav class="job-cta-tabs" aria-label="İş filtreleri">
      <button
        v-for="filter in jobOpportunityFilters"
        :key="filter.id"
        type="button"
        :class="['job-cta-tab', activeFilter === filter.id ? 'is-active' : '']"
        :aria-pressed="activeFilter === filter.id"
        :data-testid="`job-filter-${filter.id}`"
        @click="selectFilter(filter.id)"
      >
        <AppIcon :name="filter.icon" :size="18" />
        <span>{{ filter.label }}</span>
      </button>
    </nav>

    <section v-if="visibleJobs.length" class="job-cta-list" aria-label="Yeni iş listesi" data-testid="job-opportunity-list">
      <JobOpportunityCard
        v-for="job in visibleJobs"
        :key="job.id"
        :job="job"
        @primary="handlePrimary"
        @quick-action="handleQuickAction"
      />

      <div v-if="isLoading" class="job-cta-skeleton" aria-label="Yeni işler yükleniyor">
        <span></span>
        <span></span>
      </div>

      <button
        v-if="hasMore"
        ref="loadSentinel"
        type="button"
        class="job-cta-load-more"
        data-testid="job-load-more"
        :disabled="isLoading"
        @click="loadMore"
      >
        <AppIcon name="chevron-right" :size="18" />
        <span>{{ isLoading ? "Yükleniyor..." : "Daha fazla iş yükle" }}</span>
      </button>
    </section>

    <section v-else class="job-cta-empty" data-testid="job-empty-state">
      <AppIcon name="search" :size="28" />
      <h2>Bu filtrede yeni iş yok</h2>
      <p>Tüm işleri tekrar görmek için filtreyi sıfırla.</p>
      <button type="button" class="job-cta-empty__button" @click="selectFilter('all')">Tüm işleri göster</button>
    </section>
  </AppPage>
</template>
