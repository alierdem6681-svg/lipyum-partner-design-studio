<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppCard from "../components/ui/AppCard.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();
const filter = ref("all");
const filters = [
  { label: "Tümü", value: "all" },
  { label: "Aktif", value: "active" },
  { label: "Beklemede", value: "pending" },
];
const partners = [
  { id: "huseyfe", title: "Hüzeyfe A.", body: "Aktif partner, Ümraniye.", status: "active" },
  { id: "murat", title: "Murat K.", body: "Davet beklemede.", status: "pending" },
];
</script>

<template>
  <AppPage title="Davet Ettiğin Partnerler" data-testid="referral-partners-page">
    <div class="v-stack">
      <AppFilterChips v-model="filter" :items="filters" aria-label="Partner filtreleri" data-testid="referral-partner-filter" />
      <div class="v-content-list" role="list">
        <AppCard
          v-for="partner in partners.filter((item) => filter === 'all' || item.status === filter)"
          :key="partner.id"
          padding="md"
          as="button"
          class="v-content-list-item"
          role="listitem"
          data-testid="referral-partner-card"
          @click="router.push(`/referral/partner/${partner.id}`)"
        >
          <span class="v-content-list-item__icon"><AppIcon name="user" :size="20" /></span>
          <span class="v-content-list-item__copy">
            <strong>{{ partner.title }}</strong>
            <small>{{ partner.body }}</small>
          </span>
          <AppIcon name="chevron-right" :size="18" />
        </AppCard>
      </div>
    </div>
  </AppPage>
</template>
