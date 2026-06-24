<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { referralActionTasks, referralTaskFilters } from "../data/referralProgram.js";
import { useAppShellStore } from "../stores/appShellStore.js";

const router = useRouter();
const shell = useAppShellStore();
const activeFilter = ref("all");
const visibleCount = ref(5);
const completedTaskIds = ref(new Set());
const skippedTaskIds = ref(new Set());
const loadMoreRef = ref(null);
let observer;

const filteredTasks = computed(() =>
  referralActionTasks.filter((task) => activeFilter.value === "all" || task.filter === activeFilter.value),
);
const visibleTasks = computed(() => filteredTasks.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < filteredTasks.value.length);

function resetList() {
  visibleCount.value = 5;
}

function markContacted(task) {
  completedTaskIds.value = new Set([...completedTaskIds.value, task.id]);
  skippedTaskIds.value = new Set([...skippedTaskIds.value].filter((id) => id !== task.id));
  shell.showToast(`${task.title} için iletişime geçildi.`);
}

function skipTask(task) {
  skippedTaskIds.value = new Set([...skippedTaskIds.value, task.id]);
  shell.showToast(`${task.title} sonraya bırakıldı.`);
}

function getTaskState(task) {
  if (completedTaskIds.value.has(task.id)) return "İletişime geçildi";
  if (skippedTaskIds.value.has(task.id)) return "Atlandı";
  return task.badge;
}

function loadMore() {
  if (!hasMore.value) return;
  visibleCount.value = Math.min(filteredTasks.value.length, visibleCount.value + 4);
}

function observeMore() {
  if (!loadMoreRef.value || typeof IntersectionObserver === "undefined") return;
  observer?.disconnect();
  observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) loadMore();
  });
  observer.observe(loadMoreRef.value);
}

onMounted(() => {
  nextTick(observeMore);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <AppPage title="Referral Görevleri" data-testid="referral-tasks-page">
    <div class="referral-tasks-page">
      <section class="referral-tasks-hero">
        <span><AppIcon name="sparkles" :size="22" /></span>
        <strong>Bugünkü kazanç görevlerin</strong>
        <small>Her partner için sıradaki işi takip et. Görev tamamlandıkça bir sonraki adıma geç.</small>
      </section>

      <AppFilterChips
        v-model="activeFilter"
        :items="referralTaskFilters"
        aria-label="Referral görev filtreleri"
        data-testid="referral-task-filter"
        @select="resetList"
      />

      <div class="referral-task-list referral-task-list--game" role="list">
        <AppCard
          v-for="task in visibleTasks"
          :key="task.id"
          padding="md"
          :class="['referral-task-row referral-task-row--game', completedTaskIds.has(task.id) ? 'is-complete' : '', skippedTaskIds.has(task.id) ? 'is-skipped' : '']"
          role="listitem"
          data-testid="referral-task-row"
        >
          <span class="referral-task-row__icon"><AppIcon :name="task.icon" :size="20" /></span>
          <span class="referral-task-row__copy">
            <strong>{{ task.title }}</strong>
            <small>{{ task.body }}</small>
          </span>
          <span class="referral-task-row__state">{{ getTaskState(task) }}</span>
          <span class="referral-task-row__reward">{{ task.reward }}</span>
          <span class="referral-task-row__next">{{ task.next }}</span>
          <span class="referral-task-row__actions">
            <button type="button" @click="markContacted(task)">İletişime geçtim</button>
            <button type="button" @click="skipTask(task)">Atla</button>
            <button type="button" @click="router.push(`/referral/partner/${task.partnerId}`)">Detay</button>
          </span>
        </AppCard>
      </div>

      <div ref="loadMoreRef" class="referral-lazy-sentinel" aria-hidden="true">
        <span v-if="hasMore"></span>
      </div>

      <AppButton variant="ghost" icon="users" full-width data-testid="referral-tasks-partner-list" @click="router.push('/referral/partners')">
        Davet edilen partnerleri gör
      </AppButton>
    </div>
  </AppPage>
</template>
