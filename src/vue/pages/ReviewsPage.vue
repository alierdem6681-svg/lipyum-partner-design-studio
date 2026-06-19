<script setup>
import { computed, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppMetricCard from "../components/ui/AppMetricCard.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const filter = ref("all");
const visibleCount = ref(2);
const filters = [
  { label: "Tümü", value: "all" },
  { label: "5 yıldız", value: "five" },
  { label: "Yanıt bekleyen", value: "pending" },
];
const reviews = [
  { title: "Çok hızlı destek", body: "Aynı gün gelip sorunu çözdü.", rating: 5, pending: true },
  { title: "Temiz işçilik", body: "İş sonrası alanı temiz bıraktı.", rating: 5, pending: false },
  { title: "Zamanında geldi", body: "Randevu saatine sadık kaldı.", rating: 4, pending: true },
];
const visibleReviews = computed(() => reviews
  .filter((item) => filter.value === "all" || (filter.value === "five" ? item.rating === 5 : item.pending))
  .slice(0, visibleCount.value));

function openAction(label) {
  shell.openSheet({ title: label, description: "Yorum aksiyonu", body: `${label} akışı hazırlandı.` });
}
</script>

<template>
  <AppPage title="Müşteri Yorumları" data-testid="reviews-page">
    <div class="v-stack">
      <div class="v-content-metric-grid">
        <AppMetricCard label="Puan" value="4.8" icon="star" />
        <AppMetricCard label="Yorum" value="126" icon="message" tone="info" />
      </div>
      <AppFilterChips v-model="filter" :items="filters" aria-label="Yorum filtreleri" data-testid="reviews-filter" />
      <div class="v-content-list" role="list">
        <AppCard v-for="review in visibleReviews" :key="review.title" padding="md" as="article" class="v-content-list-item" role="listitem">
          <span class="v-content-list-item__icon"><AppIcon name="star" :size="20" /></span>
          <span class="v-content-list-item__copy">
            <strong>{{ review.title }}</strong>
            <small>{{ review.body }}</small>
          </span>
          <AppButton size="sm" variant="ghost" @click="openAction('Yanıtla')">Yanıtla</AppButton>
        </AppCard>
      </div>
      <AppButton variant="secondary" @click="openAction('Uygunsuz yorum bildir')">Raporla</AppButton>
      <AppButton v-if="visibleCount < reviews.length" variant="ghost" @click="visibleCount += 2">Daha fazla yükle</AppButton>
    </div>
  </AppPage>
</template>
