<script setup>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { formatScoreTr } from "../../domain/performanceScoreModel.js";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { usePerformanceScoreStore } from "../stores/performanceScoreStore.js";

const router = useRouter();
const performance = usePerformanceScoreStore();
const task = computed(() => performance.tasks.find((item) => item.id === "job-result"));

const form = reactive({
  totalFee: "",
  travelFee: "",
  laborFee: "",
  materialFee: "",
  resultDescription: "",
  beforePhoto: false,
  afterPhoto: false,
  customerApproved: false,
  warranty: false,
});

const canSubmit = computed(
  () =>
    form.totalFee.trim() &&
    form.laborFee.trim() &&
    form.materialFee.trim() &&
    form.resultDescription.trim().length >= 10 &&
    form.beforePhoto &&
    form.afterPhoto &&
    form.customerApproved,
);

function submitTask() {
  const result = performance.completeTask("job-result");
  if (!result.changed && !performance.lastScoreChange) return;
  router.push("/performance-score/success");
}
</script>

<template>
  <AppPage title="İş Bilgilerini Gir" class="performance-flow-page" data-testid="performance-task-page">
    <div class="performance-flow-stack">
      <AppCard class="performance-task-reward">
        <AppIcon name="star" :size="24" />
        <span>
          <small>Bu görevin ödülü</small>
          <strong>+{{ formatScoreTr(task?.scoreDelta || 0) }} puan</strong>
        </span>
        <strong>{{ task?.estimatedMinutes || 3 }} dk</strong>
      </AppCard>

      <form class="performance-task-form" data-testid="performance-task-form" @submit.prevent="submitTask">
        <label>
          <span>Toplam alınan ücret</span>
          <input v-model="form.totalFee" data-testid="job-total-fee" inputmode="numeric" placeholder="₺ 2.450" />
        </label>
        <label>
          <span>Yol masrafı</span>
          <input v-model="form.travelFee" data-testid="job-travel-fee" inputmode="numeric" placeholder="₺ 150" />
        </label>
        <label>
          <span>İşçilik ücreti</span>
          <input v-model="form.laborFee" data-testid="job-labor-fee" inputmode="numeric" placeholder="₺ 1.200" />
        </label>
        <label>
          <span>Parça / malzeme tutarı</span>
          <input v-model="form.materialFee" data-testid="job-material-fee" inputmode="numeric" placeholder="₺ 1.100" />
        </label>
        <label>
          <span>İş sonucu</span>
          <textarea
            v-model="form.resultDescription"
            data-testid="job-result-description"
            rows="3"
            placeholder="Arıza giderildi. Parça değiştirildi."
          ></textarea>
        </label>

        <AppCard class="performance-task-option" padding="sm">
          <span class="performance-task-icon"><AppIcon name="image" :size="22" /></span>
          <span>
            <strong>Öncesi fotoğrafı</strong>
            <small>İş başlamadan önceki görsel</small>
          </span>
          <button type="button" data-testid="job-before-photo" @click="form.beforePhoto = true">
            {{ form.beforePhoto ? "Tamam" : "Ekle" }}
          </button>
        </AppCard>

        <AppCard class="performance-task-option" padding="sm">
          <span class="performance-task-icon"><AppIcon name="image" :size="22" /></span>
          <span>
            <strong>Sonrası fotoğrafı</strong>
            <small>İş tamamlandıktan sonraki görsel</small>
          </span>
          <button type="button" data-testid="job-after-photo" @click="form.afterPhoto = true">
            {{ form.afterPhoto ? "Tamam" : "Ekle" }}
          </button>
        </AppCard>

        <AppCard class="performance-task-option" padding="sm">
          <span class="performance-task-icon"><AppIcon name="check" :size="22" /></span>
          <span>
            <strong>Müşteri dijital onayı</strong>
            <small>İşin tamamlandığı onaylandı</small>
          </span>
          <button type="button" data-testid="job-customer-approval" @click="form.customerApproved = true">
            {{ form.customerApproved ? "Tamam" : "Onayla" }}
          </button>
        </AppCard>

        <AppCard class="performance-task-option" padding="sm">
          <span class="performance-task-icon"><AppIcon name="shield" :size="22" /></span>
          <span>
            <strong>Garanti / kalite belgesi</strong>
            <small>İstersen belge seçebilirsin</small>
          </span>
          <button type="button" data-testid="job-warranty" @click="form.warranty = !form.warranty">
            {{ form.warranty ? "Seçildi" : "Seç" }}
          </button>
        </AppCard>

        <AppButton
          class="performance-task-submit"
          full-width
          size="lg"
          type="submit"
          :disabled="!canSubmit"
          data-testid="job-submit"
        >
          KAYDET VE TAMAMLA
        </AppButton>
      </form>
    </div>
  </AppPage>
</template>
