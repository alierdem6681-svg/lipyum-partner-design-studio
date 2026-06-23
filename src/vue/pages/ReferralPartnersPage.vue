<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppCard from "../components/ui/AppCard.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { referralPartnerFilters, referralPartners } from "../data/referralProgram.js";

const router = useRouter();
const filter = ref("all");
const visibleCount = ref(6);
const loadMoreRef = ref(null);
let observer;

const filteredPartners = computed(() =>
  referralPartners.filter((partner) => filter.value === "all" || partner.filters.includes(filter.value)),
);
const visiblePartners = computed(() => filteredPartners.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < filteredPartners.value.length);

function resetList() {
  visibleCount.value = 6;
}

function loadMore() {
  if (!hasMore.value) return;
  visibleCount.value = Math.min(filteredPartners.value.length, visibleCount.value + 4);
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
  <AppPage title="Davet Ettiğin Partnerler" data-testid="referral-partners-page">
    <div class="referral-partners-page">
      <AppFilterChips
        v-model="filter"
        :items="referralPartnerFilters"
        aria-label="Partner filtreleri"
        data-testid="referral-partner-filter"
        @select="resetList"
      />

      <div class="referral-partner-list" role="list">
        <AppCard
          v-for="partner in visiblePartners"
          :key="partner.id"
          padding="md"
          as="button"
          class="referral-partner-list-card"
          role="listitem"
          data-testid="referral-partner-card"
          @click="router.push(`/referral/partner/${partner.id}`)"
        >
          <span :class="['referral-avatar', `is-${partner.avatarTone}`]">{{ partner.initials }}</span>
          <span class="referral-partner-list-card__copy">
            <strong>{{ partner.name }}</strong>
            <small>{{ partner.city }} · {{ partner.status }}</small>
          </span>
          <span class="referral-partner-list-card__bonus">
            <strong>{{ partner.bonus }}</strong>
            <small>{{ partner.bonusUnit }}</small>
          </span>
          <AppIcon name="chevron-right" :size="18" />
        </AppCard>
      </div>

      <div ref="loadMoreRef" class="referral-lazy-sentinel" aria-hidden="true">
        <span v-if="hasMore"></span>
      </div>
    </div>
  </AppPage>
</template>
