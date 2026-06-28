<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import SupportTicketStatusChip from "../components/support-ticket/SupportTicketStatusChip.vue";
import { useSupportTicketStore } from "../stores/supportTicketStore.js";
import { useAppShellStore } from "../stores/appShellStore.js";

const route = useRoute();
const router = useRouter();
const support = useSupportTicketStore();
const shell = useAppShellStore();
const replyText = ref("");
const replyInput = ref(null);

const ticket = computed(() => support.getTicket(String(route.params.ticketId || "")));
const category = computed(() => support.categories.find((item) => item.id === ticket.value?.categoryId) || support.categories[0]);
const priority = computed(() => support.priorityOptions.find((item) => item.id === ticket.value?.priority) || support.priorityOptions[0]);

function submitReply() {
  if (!ticket.value || !replyText.value.trim()) return;
  support.addReply(ticket.value.id, replyText.value);
  replyText.value = "";
  shell.showToast("Yanıt eklendi.");
}

function addAttachment() {
  shell.showToast("Dosya ekleme akışı hazır.");
}

function focusReply() {
  replyInput.value?.focus();
}

function markResolved() {
  if (!ticket.value) return;
  support.markResolved(ticket.value.id);
  shell.showToast("Talep çözüldü olarak işaretlendi.");
}
</script>

<template>
  <AppPage title="Talep Detayı" class="support-ticket support-ticket-page support-ticket-page--composer" data-testid="support-ticket-detail-page">
    <template v-if="ticket">
      <AppCard padding="lg" variant="hero" class="support-ticket-detail-hero">
        <span class="support-ticket-detail-hero__icon" aria-hidden="true">
          <AppIcon :name="category.icon" :size="30" />
        </span>
        <div class="support-ticket-detail-hero__title">
          <strong>{{ ticket.subject }}</strong>
          <small>{{ ticket.ticketNo }} · {{ category.title }}</small>
        </div>
        <SupportTicketStatusChip :status="ticket.status" :statuses="support.statuses" />

        <div class="support-ticket-detail-meta">
          <span><AppIcon name="calendar" :size="17" /> Oluşturuldu: 12 dk önce</span>
          <span><AppIcon name="sliders" :size="17" /> Öncelik: {{ priority.label }}</span>
        </div>

        <button class="support-ticket-related" type="button">
          <AppIcon name="briefcase" :size="20" />
          <span>İlgili kayıt: <b>{{ ticket.relatedValue }}</b></span>
          <AppIcon name="chevron-right" :size="18" />
        </button>
      </AppCard>

      <section class="support-ticket-section" aria-labelledby="ticketConversationTitle">
        <div class="support-ticket-section__head">
          <h2 id="ticketConversationTitle">Görüşme</h2>
        </div>
        <div class="support-ticket-thread" data-testid="support-ticket-thread">
          <article
            v-for="message in ticket.messages"
            :key="message.id"
            :class="['support-ticket-message', `is-${message.author}`]"
          >
            <span class="support-ticket-message__avatar" aria-hidden="true">
              <AppIcon :name="message.author === 'partner' ? 'user' : message.author === 'support' ? 'headphones' : 'info'" :size="18" />
            </span>
            <p>{{ message.text }}</p>
            <time>{{ message.createdAt }}</time>
          </article>
          <div v-if="ticket.attachments.length" class="support-ticket-attachment-list">
            <span v-for="attachment in ticket.attachments" :key="attachment.name">
              <AppIcon name="file-text" :size="17" />
              {{ attachment.name }}
              <small>{{ attachment.size }}</small>
            </span>
          </div>
        </div>
      </section>

      <AppCard padding="md" class="support-ticket-actions">
        <h2>Hızlı işlemler</h2>
        <div>
          <AppButton variant="secondary" icon="message" @click="focusReply">Yanıt yaz</AppButton>
          <AppButton variant="secondary" icon="upload" @click="addAttachment">Dosya ekle</AppButton>
          <AppButton variant="secondary" icon="check" data-testid="support-ticket-resolve" @click="markResolved">Çözüldü işaretle</AppButton>
        </div>
      </AppCard>

      <div class="support-ticket-composer" data-testid="support-ticket-composer">
        <input
          ref="replyInput"
          v-model="replyText"
          maxlength="500"
          aria-label="Talebe yanıt yaz"
          placeholder="Yanıt yaz..."
          data-testid="support-ticket-reply-input"
          @keydown.enter.prevent="submitReply"
        />
        <button type="button" aria-label="Dosya ekle" @click="addAttachment">
          <AppIcon name="upload" :size="20" />
        </button>
        <button type="button" aria-label="Yanıt gönder" data-testid="support-ticket-reply-submit" @click="submitReply">
          <AppIcon name="send" :size="20" />
        </button>
      </div>
    </template>
    <AppCard v-else padding="lg" class="support-ticket-empty">
      <h2>Talep bulunamadı</h2>
      <p>Aradığın destek talebi bulunamadı.</p>
      <AppButton @click="router.push('/support/tickets')">Destek Taleplerime Dön</AppButton>
    </AppCard>
  </AppPage>
</template>
