<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import SupportTicketCard from "../components/support-ticket/SupportTicketCard.vue";
import SupportTicketSummaryCard from "../components/support-ticket/SupportTicketSummaryCard.vue";
import { useSupportTicketStore } from "../stores/supportTicketStore.js";

const router = useRouter();
const support = useSupportTicketStore();

const characterCount = computed(() => support.ticketDraft.description.length);
const selectedCategory = computed(() => support.selectedCategory);
const recentTickets = computed(() => support.tickets.slice(0, 2));
const canSubmit = computed(() => support.ticketDraft.description.trim().length >= 8);

function submitTicket() {
  const ticket = support.submitTicket();
  if (ticket) router.push(`/support/success/${ticket.id}`);
}
</script>

<template>
  <AppPage title="Destek Talebi" class="support-ticket support-ticket-page" data-testid="support-ticket-page">
    <SupportTicketSummaryCard
      :open-count="support.openCount"
      :answered-count="support.answeredCount"
      :resolved-count="support.resolvedCount"
      @primary="support.resetDraft"
    />

    <section class="support-ticket-section" aria-labelledby="supportCategoryTitle">
      <div class="support-ticket-section__head">
        <h2 id="supportCategoryTitle">Konu seç</h2>
      </div>
      <div class="support-ticket-category-grid" role="radiogroup" aria-label="Destek konusu" data-testid="support-category-grid">
        <button
          v-for="category in support.categories"
          :key="category.id"
          :class="['support-ticket-category', { 'is-selected': category.id === support.ticketDraft.categoryId }]"
          type="button"
          :aria-checked="category.id === support.ticketDraft.categoryId"
          role="radio"
          :data-testid="`support-category-${category.id}`"
          @click="support.selectCategory(category.id)"
        >
          <AppIcon :name="category.icon" :size="24" />
          <span>
            <strong>{{ category.title }}</strong>
            <small>{{ category.description }}</small>
          </span>
        </button>
      </div>
    </section>

    <AppCard padding="lg" class="support-ticket-form-card" data-testid="support-ticket-form">
      <div class="support-ticket-section__head">
        <h2>Talep detayı</h2>
      </div>

      <label class="support-ticket-field">
        <span>{{ selectedCategory.fieldLabel }}</span>
        <select
          :value="support.ticketDraft.relatedValue"
          data-testid="support-related-select"
          @change="support.setRelatedValue($event.target.value)"
        >
          <option v-for="option in selectedCategory.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </label>

      <fieldset class="support-ticket-priority">
        <legend>Öncelik</legend>
        <button
          v-for="priority in support.priorityOptions"
          :key="priority.id"
          type="button"
          :class="['support-ticket-priority__option', { 'is-selected': priority.id === support.ticketDraft.priority }]"
          :aria-pressed="priority.id === support.ticketDraft.priority"
          @click="support.selectPriority(priority.id)"
        >
          {{ priority.label }}
        </button>
      </fieldset>

      <label class="support-ticket-field">
        <span>Sorunu kısaca anlat</span>
        <textarea
          :value="support.ticketDraft.description"
          maxlength="500"
          rows="4"
          placeholder="Profilime daha fazla bölge eklemek için yardım istiyorum."
          aria-describedby="supportDescriptionCounter"
          data-testid="support-description"
          @input="support.setDescription($event.target.value)"
        ></textarea>
      </label>
      <p id="supportDescriptionCounter" class="support-ticket-counter" data-testid="support-character-counter">
        {{ characterCount }} / 500
      </p>

      <button class="support-ticket-attachment" type="button" data-testid="support-attachment-add" @click="support.addAttachmentMock">
        <AppIcon name="upload" :size="20" />
        <span>Ek dosya veya ekran görüntüsü ekle</span>
        <small v-if="support.attachments.length">{{ support.attachments.length }} ek</small>
        <AppIcon v-else name="camera" :size="20" />
      </button>
    </AppCard>

    <section class="support-ticket-section" aria-labelledby="recentTicketsTitle">
      <div class="support-ticket-section__head">
        <h2 id="recentTicketsTitle">Taleplerim</h2>
        <button type="button" class="support-ticket-link" @click="router.push('/support/tickets')">
          Tümünü gör
          <AppIcon name="chevron-right" :size="16" />
        </button>
      </div>
      <div class="support-ticket-list">
        <SupportTicketCard
          v-for="ticket in recentTickets"
          :key="ticket.id"
          :ticket="ticket"
          :categories="support.categories"
          :statuses="support.statuses"
          @click="router.push(`/support/tickets/${ticket.id}`)"
        />
      </div>
    </section>

    <div class="support-ticket-sticky">
      <AppButton icon="send" size="lg" full-width :disabled="!canSubmit" data-testid="support-ticket-submit" @click="submitTicket">
        Talebi Gönder
      </AppButton>
    </div>
  </AppPage>
</template>
