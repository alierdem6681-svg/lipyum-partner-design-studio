<script setup>
import { computed } from "vue";
import AppCard from "../ui/AppCard.vue";
import AppIcon from "../ui/AppIcon.vue";
import SupportTicketStatusChip from "./SupportTicketStatusChip.vue";

const props = defineProps({
  ticket: { type: Object, required: true },
  categories: { type: Array, required: true },
  statuses: { type: Object, required: true },
});

const category = computed(() => props.categories.find((item) => item.id === props.ticket.categoryId) || props.categories[0]);
</script>

<template>
  <AppCard as="button" padding="md" class="support-ticket-card" data-testid="support-ticket-card">
    <span class="support-ticket-card__icon" aria-hidden="true">
      <AppIcon :name="category.icon" :size="24" />
    </span>
    <span class="support-ticket-card__copy">
      <strong>{{ ticket.ticketNo }}</strong>
      <span>{{ ticket.subject }}</span>
      <small>{{ category.title }} · {{ ticket.updatedAt.includes("T") ? "12 dk önce" : ticket.updatedAt }}</small>
    </span>
    <SupportTicketStatusChip :status="ticket.status" :statuses="statuses" />
    <span v-if="ticket.unread" class="support-ticket-card__dot" aria-label="Okunmamış yanıt"></span>
    <AppIcon class="support-ticket-card__chevron" name="chevron-right" :size="18" aria-hidden="true" />
  </AppCard>
</template>
