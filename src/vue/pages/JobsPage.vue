<script setup>
import SwipeInstructionCard from "../components/jobs/SwipeInstructionCard.vue";
import SwipeJobDeck from "../components/jobs/SwipeJobDeck.vue";
import SwipeHintCard from "../components/jobs/SwipeHintCard.vue";
import JobMatchEmptyState from "../components/jobs/JobMatchEmptyState.vue";
import AppPage from "../components/ui/AppPage.vue";
import { swipeBottomHint, swipeInstruction } from "../data/jobSwipeModel.js";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useJobSwipeStore } from "../stores/jobSwipeStore.js";

const shell = useAppShellStore();
const store = useJobSwipeStore();

function openCallSchedule(job) {
  store.openCallSchedule(job.id);
  shell.openSheet({
    title: "Ara, Randevu Ver",
    description: `${job.title} · ${job.location}`,
    body: [
      `${job.customer.name} için telefon görüşmesi ve randevu akışı hazır.`,
      `Müşteri puanı: ${job.customer.rating.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} · ${job.customer.reviewCount} değerlendirme`,
      `Beklenen kazanç: ${job.earningLabel}`,
    ].join("\n"),
    note: "Bu mock akış gerçek ödeme veya arama başlatmaz; randevu adımı için güvenli önizleme sağlar.",
  });
}

function openCustomer(job) {
  store.openCallSchedule(job.id);
  shell.openSheet({
    title: job.customer.name,
    description: "Müşteri özeti",
    body: `${job.title} için ${job.location} konumunda destek bekliyor.\nTelefon: ${job.customer.phone}`,
  });
}
</script>

<template>
  <AppPage title="İş Al" class="job-swipe-page" data-testid="jobs-page">
    <div class="job-swipe-shell" data-testid="job-swipe-page" aria-label="İş al kaydırmalı liste">
      <SwipeInstructionCard :title="swipeInstruction.title" :description="swipeInstruction.description" />

      <SwipeJobDeck
        v-if="store.hasJobs"
        :job="store.currentJob"
        :next-job="store.nextJob"
        @advance="store.advanceJob"
        @cta="openCallSchedule"
        @open-customer="openCustomer"
      />
      <JobMatchEmptyState v-else @reset="store.resetDeck" />

      <SwipeHintCard :text="swipeBottomHint.text" @advance="store.advanceJob('button')" />
    </div>
  </AppPage>
</template>
