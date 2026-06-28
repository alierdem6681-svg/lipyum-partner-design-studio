<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import SupportTicketStatusChip from "../components/support-ticket/SupportTicketStatusChip.vue";
import { useSupportTicketStore } from "../stores/supportTicketStore.js";

const route = useRoute();
const router = useRouter();
const support = useSupportTicketStore();

const ticket = computed(() => support.getTicket(String(route.params.ticketId || "")) || support.tickets[0]);
const category = computed(() => support.categories.find((item) => item.id === ticket.value?.categoryId) || support.categories[0]);
const priority = computed(() => support.priorityOptions.find((item) => item.id === ticket.value?.priority) || support.priorityOptions[0]);
</script>

<template>
  <AppPage title="Talep Oluşturuldu" class="support-ticket support-ticket-page" data-testid="support-ticket-success-page">
    <AppCard padding="lg" variant="hero" class="support-ticket-success-hero">
      <span class="support-ticket-success-hero__icon" aria-hidden="true">
        <AppIcon name="headphones" :size="42" />
        <i><AppIcon name="check" :size="18" /></i>
      </span>
      <h2>Talebin başarıyla alındı</h2>
      <p>Destek ekibimiz konuyu incelemeye başladı.</p>
      <div class="support-ticket-success-hero__status">
        <strong>{{ ticket.ticketNo }}</strong>
        <SupportTicketStatusChip :status="ticket.status" :statuses="support.statuses" />
      </div>
      <span class="support-ticket-success-hero__time">
        <AppIcon name="clock" :size="18" />
        İlk güncelleme: ortalama 30 dk içinde
      </span>
    </AppCard>

    <AppCard padding="lg" class="support-ticket-summary-list">
      <h2>Talep özeti</h2>
      <dl>
        <div>
          <dt><AppIcon :name="category.icon" :size="18" /> Konu</dt>
          <dd>{{ category.title }}</dd>
        </div>
        <div>
          <dt><AppIcon name="briefcase" :size="18" /> İlgili kayıt</dt>
          <dd>{{ ticket.relatedValue }}</dd>
        </div>
        <div>
          <dt><AppIcon name="sliders" :size="18" /> Öncelik</dt>
          <dd>{{ priority.label }}</dd>
        </div>
        <div>
          <dt><AppIcon name="file-text" :size="18" /> Ek</dt>
          <dd>{{ ticket.attachments.length || 0 }} dosya</dd>
        </div>
      </dl>
    </AppCard>

    <AppCard padding="lg" class="support-ticket-next-steps">
      <h2>Sırada ne var?</h2>
      <ol>
        <li><AppIcon name="send" :size="18" /> Talebin operasyon ekibine iletildi.</li>
        <li><AppIcon name="file-text" :size="18" /> Güncellemeleri Taleplerim ekranında görebilirsin.</li>
        <li><AppIcon name="bell" :size="18" /> Yanıt geldiğinde bildirim alırsın.</li>
      </ol>
    </AppCard>

    <div class="support-ticket-success-actions">
      <AppButton icon="send" size="lg" full-width data-testid="support-success-view-ticket" @click="router.push(`/support/tickets/${ticket.id}`)">
        Talebi Görüntüle
      </AppButton>
      <AppButton variant="secondary" icon="plus" size="lg" full-width @click="router.push('/support')">
        Yeni Talep Oluştur
      </AppButton>
      <AppButton variant="ghost" icon="chevron-left" size="lg" full-width @click="router.push('/support/tickets')">
        Destek taleplerime dön
      </AppButton>
    </div>
  </AppPage>
</template>
