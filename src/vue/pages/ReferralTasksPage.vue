<script setup>
import { computed, ref, watch } from "vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppModal from "../components/ui/AppModal.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const selectedFilter = ref("all");
const activeIndex = ref(0);
const dragStartX = ref(0);
const dragDeltaX = ref(0);
const isDragging = ref(false);
const resultTask = ref(null);

const filters = [
  { label: "Tümü", value: "all" },
  { label: "Kayıt Olmalı", value: "register" },
  { label: "İş Aldır", value: "job" },
  { label: "Bakiye Yüklet", value: "topup" },
  { label: "Profil Tamamlat", value: "profile" },
];

const tasks = [
  {
    id: "ayse-register",
    category: "register",
    name: "Ayşe Durmaz Koç",
    title: "Kayıt olmasını sağla",
    body: "Davet linkini tekrar gönder, kayıt adımını birlikte tamamlayın.",
    reward: "100 TL",
    next: "Kayıt olunca ilk bonus açılır.",
    tone: "green",
    initials: "AD",
  },
  {
    id: "mehmet-job",
    category: "job",
    name: "Mehmet Yılmaz Arı",
    title: "İlk işini aldır",
    body: "Uygun işi seçmesine yardım et; ilk iş tamamlanınca bonus kazanırsın.",
    reward: "500 TL",
    next: "İş aldığında kazanç adımı ilerler.",
    tone: "amber",
    initials: "MY",
  },
  {
    id: "derya-topup",
    category: "topup",
    name: "Derya Aksoy Tunç",
    title: "Bakiye yüklet",
    body: "Bakiye yüklediğinde her yüklemeden pay kazanma döngüsü başlar.",
    reward: "%3",
    next: "Yükleme sonrası pasif gelir başlar.",
    tone: "blue",
    initials: "DA",
  },
  {
    id: "selin-profile",
    category: "profile",
    name: "Selin Karaca Öz",
    title: "Profilini tamamlat",
    body: "Hizmet, bölge ve çalışma saatlerini tamamlat; iş alma ihtimali artsın.",
    reward: "250 TL",
    next: "Profil tamamlanınca iş alma görevi açılır.",
    tone: "violet",
    initials: "SK",
  },
];

const resultOptions = [
  "Aradım, ulaşamadım",
  "Davet gönderdim",
  "Kayıt oldu",
  "İş aldı",
  "Bakiye yükledi",
];

const filteredTasks = computed(() =>
  selectedFilter.value === "all" ? tasks : tasks.filter((task) => task.category === selectedFilter.value),
);
const activeTask = computed(() => filteredTasks.value[activeIndex.value] || null);

watch(selectedFilter, () => {
  activeIndex.value = 0;
  dragDeltaX.value = 0;
});

function beginDrag(event) {
  if (!activeTask.value) return;
  isDragging.value = true;
  dragStartX.value = event.clientX;
  dragDeltaX.value = 0;
  event.currentTarget?.setPointerCapture?.(event.pointerId);
}

function updateDrag(event) {
  if (!isDragging.value) return;
  dragDeltaX.value = event.clientX - dragStartX.value;
}

function finishDrag() {
  if (!isDragging.value) return;
  const shouldSkip = dragDeltaX.value <= -72;
  isDragging.value = false;
  dragStartX.value = 0;
  dragDeltaX.value = 0;
  if (shouldSkip) skipTask();
}

function skipTask() {
  if (!filteredTasks.value.length) return;
  activeIndex.value = (activeIndex.value + 1) % filteredTasks.value.length;
  shell.showToast("Görev atlandı, sıradaki görev açıldı.");
}

function openResult(task) {
  resultTask.value = task;
}

function saveResult(option) {
  shell.showToast(`${resultTask.value?.name || "Partner"} için sonuç kaydedildi: ${option}`);
  resultTask.value = null;
  skipTask();
}
</script>

<template>
  <AppPage title="Görevlerim" data-testid="referral-tasks-page">
    <div class="v-stack v-referral-tasks">
      <section class="v-referral-task-intro">
        <span><AppIcon name="zap" :size="16" /> Sıradaki en değerli adım</span>
        <h2>Bir görevi seç, sonucu kaydet, kazanç adımını ilerlet.</h2>
        <p>Sola kaydırırsan görevi atlarsın. Sonuç seçersen kayıt tutulur ve sıradaki görev açılır.</p>
      </section>

      <AppFilterChips v-model="selectedFilter" :items="filters" aria-label="Görev filtreleri" data-testid="referral-task-filter" />

      <section class="v-referral-task-deck" aria-live="polite">
        <article
          v-if="activeTask"
          :key="activeTask.id"
          :class="['v-referral-swipe-card', `v-referral-swipe-card--${activeTask.tone}`, isDragging ? 'is-dragging' : '']"
          data-testid="referral-task-card"
          @pointerdown="beginDrag"
          @pointermove="updateDrag"
          @pointerup="finishDrag"
          @pointercancel="finishDrag"
        >
          <div class="v-referral-swipe-card__top">
            <span class="v-referral-avatar">{{ activeTask.initials }}</span>
            <span>
              <strong>{{ activeTask.name }}</strong>
              <small>{{ activeTask.title }}</small>
            </span>
            <em>{{ activeTask.reward }}</em>
          </div>

          <p>{{ activeTask.body }}</p>

          <div class="v-referral-swipe-card__next">
            <AppIcon name="target" :size="17" />
            <span>{{ activeTask.next }}</span>
          </div>

          <div class="v-referral-swipe-card__actions">
            <button type="button" @pointerdown.stop @click.stop="skipTask">Atla</button>
            <button type="button" class="is-primary" data-testid="referral-result-button" @pointerdown.stop @click.stop="openResult(activeTask)">Sonuç</button>
          </div>
        </article>

        <article v-else class="v-referral-swipe-empty">
          <AppIcon name="check" :size="24" />
          <strong>Bu filtrede görev yok</strong>
          <small>Başka bir filtre seçerek devam edebilirsin.</small>
        </article>
      </section>
    </div>

    <AppModal
      :open="!!resultTask"
      title="Sonuç"
      :description="resultTask ? `${resultTask.name} için sonucu seç` : ''"
      @close="resultTask = null"
    >
      <div class="v-referral-result-options">
        <button v-for="option in resultOptions" :key="option" type="button" @click="saveResult(option)">
          <span>{{ option }}</span>
          <AppIcon name="chevron-right" :size="17" />
        </button>
      </div>
    </AppModal>
  </AppPage>
</template>
