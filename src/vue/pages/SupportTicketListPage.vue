<script setup>
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import SupportTicketCard from "../components/support-ticket/SupportTicketCard.vue";
import SupportTicketSummaryCard from "../components/support-ticket/SupportTicketSummaryCard.vue";
import { useSupportTicketStore } from "../stores/supportTicketStore.js";

const router = useRouter();
const support = useSupportTicketStore();

const filters = [
  { id: "all", label: "Tümü" },
  { id: "open", label: "Açık" },
  { id: "answered", label: "Yanıtlandı" },
  { id: "resolved", label: "Çözüldü" },
  { id: "urgent", label: "Acil" },
];
</script>

<template>
  <AppPage title="Destek Taleplerim" class="support-ticket support-ticket-page" data-testid="support-ticket-list-page">
    <SupportTicketSummaryCard
      mode="list"
      :open-count="support.openCount"
      :answered-count="support.answeredCount"
      :resolved-count="support.resolvedCount"
      @primary="router.push('/support')"
    />

    <div class="support-ticket-filter-row" role="tablist" aria-label="Talep filtreleri" data-testid="support-ticket-filters">
      <button
        v-for="filter in filters"
        :key="filter.id"
        :class="['support-ticket-filter', { 'is-selected': support.filter === filter.id }]"
        type="button"
        role="tab"
        :aria-selected="support.filter === filter.id"
        @click="support.setFilter(filter.id)"
      >
        {{ filter.label }}
      </button>
    </div>

    <label class="support-ticket-search">
      <AppIcon name="search" :size="20" />
      <input
        :value="support.search"
        type="search"
        placeholder="Talep no veya konu ara"
        aria-label="Talep no veya konu ara"
        data-testid="support-ticket-search"
        @input="support.setSearch($event.target.value)"
      />
    </label>

    <section class="support-ticket-section" aria-labelledby="supportTicketsTitle">
      <div class="support-ticket-section__head">
        <h2 id="supportTicketsTitle">Son talepler</h2>
        <span>{{ support.filteredTickets.length }} talep</span>
      </div>
      <div class="support-ticket-list">
        <SupportTicketCard
          v-for="ticket in support.filteredTickets"
          :key="ticket.id"
          :ticket="ticket"
          :categories="support.categories"
          :statuses="support.statuses"
          @click="router.push(`/support/tickets/${ticket.id}`)"
        />
      </div>
    </section>

    <div class="support-ticket-sticky">
      <AppButton icon="send" size="lg" full-width data-testid="support-new-ticket" @click="router.push('/support')">
        Yeni Talep Oluştur
      </AppButton>
    </div>
  </AppPage>
</template>
