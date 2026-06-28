<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useLiveSupportStore } from "../stores/liveSupportStore.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

const route = useRoute();
const router = useRouter();
const shell = useAppShellStore();
const support = useLiveSupportStore();
const subscription = useSubscriptionStore();
const messageListRef = ref(null);

const canSend = computed(() => support.messageDraft.trim().length > 0 && !support.isSending && !support.isClosed);
const showChat = computed(() => support.isActive || support.isResolved || support.isClosed);
const firstAgentMessageId = computed(() => support.messages.find((message) => message.sender === "agent")?.id || "");
const currentPlan = computed(() => subscription.currentPlan || { id: "free", title: "Free" });
const currentPlanId = computed(() => currentPlan.value?.id || "free");
const supportLevelRows = [
  { id: "free", label: "Free", time: "Standart sıra", description: "Yoğunluğa göre yanıtlanır.", icon: "clock" },
  { id: "plus", label: "Plus", time: "Ortalama 5 dk", description: "Destek taleplerin daha hızlı açılır.", icon: "headphones" },
  { id: "gold", label: "Gold", time: "Ortalama 2 dk", description: "Öncelikli canlı destek alırsın.", icon: "crown" },
  { id: "vip", label: "VIP", time: "Ortalama 1 dk", description: "En hızlı destek sırasına girersin.", icon: "zap" },
];

function startConversation() {
  if (!support.subject.trim()) support.subject = "Canlı destek";
  if (!support.description.trim()) support.description = "Canlı destek üzerinden yardım istiyorum.";
  support.startConversation();
  scrollToLatestMessage();
}

function goToSubscription() {
  router.push("/subscription");
}

function sendMessage() {
  support.sendMessage();
  scrollToLatestMessage();
}

function attachImage() {
  support.attachImage();
  shell.showToast("Fotoğraf sohbete eklendi.");
  scrollToLatestMessage();
}

function closeConversation() {
  support.closeConversation();
  shell.showToast("Talep kapatıldı.");
}

function reopenConversation() {
  support.reopenConversation();
  shell.showToast("Talep yeniden açıldı.");
  scrollToLatestMessage();
}

function createTicket() {
  router.push("/support");
}

async function scrollToLatestMessage() {
  await nextTick();
  const list = messageListRef.value;
  if (!list) return;
  list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
}

watch(
  () => [support.status, support.messages.length, support.isTyping],
  () => {
    scrollToLatestMessage();
  },
);

onMounted(() => {
  if (route.query.liveSupportState === "active") {
    support.status = "active";
    support.isTyping = true;
  }
  if (route.query.liveSupportState === "resolved") {
    support.setResolvedDemo();
  }
  scrollToLatestMessage();
});
</script>

<template>
  <AppPage title="Canlı Destek" compact :class="['live-support-page', { 'is-chat': showChat }]" data-testid="live-support-page">
    <section v-if="support.isStart" class="live-support-start-card" data-testid="live-support-start-panel">
      <span class="live-support-start-card__icon" aria-hidden="true">
        <AppIcon name="headphones" :size="40" />
      </span>
      <div>
        <h2>Nasıl yardımcı olalım?</h2>
        <p class="live-support-response-time">
          <AppIcon name="clock" :size="16" />
          Ortalama yanıt süresi 2 dk
        </p>
      </div>
    </section>

    <section v-if="support.isStart" class="live-support-plan-service" data-testid="live-support-plan-service">
      <div class="live-support-plan-service__header">
        <span>
          <AppIcon name="shield" :size="18" />
          Abonelik durumuna göre hizmet süreleri
        </span>
        <strong>{{ currentPlan.title }}</strong>
      </div>
      <div class="live-support-service-levels" aria-label="Paket destek süreleri">
        <article
          v-for="row in supportLevelRows"
          :key="row.id"
          :class="['live-support-service-row', { 'is-current': currentPlanId === row.id }]"
        >
          <span class="live-support-service-row__icon" aria-hidden="true">
            <AppIcon :name="row.icon" :size="18" />
          </span>
          <div>
            <strong>{{ row.label }}</strong>
            <small>{{ row.description }}</small>
          </div>
          <b>{{ row.time }}</b>
        </article>
      </div>
      <div class="live-support-upgrade-card">
        <div>
          <strong>Daha hızlı destek al</strong>
          <p>Gold ve VIP paketlerde taleplerin daha öncelikli değerlendirilir.</p>
        </div>
        <button type="button" @click="goToSubscription">Paketi yükselt</button>
      </div>
      <button class="live-support-primary-action" type="button" data-testid="live-support-start" @click="startConversation">
        <AppIcon name="send" :size="18" />
        Müşteri Temsilcisine Bağlan
      </button>
    </section>

    <section v-if="support.isConnecting" class="live-support-connecting" data-testid="live-support-waiting">
      <span aria-hidden="true"><i></i><i></i><i></i></span>
      <div>
        <strong>Temsilciye bağlanıyorsun</strong>
        <p>Ayşe - Lipyum Destek konuşmayı hazırlıyor.</p>
      </div>
      <button type="button" data-testid="live-support-create-ticket" @click="createTicket">Talep oluştur</button>
    </section>

    <section
      v-if="showChat"
      ref="messageListRef"
      class="live-support-chat-area"
      data-testid="live-support-chat"
      data-live-support-messages
    >
      <article
        v-for="message in support.messages"
        :key="message.id"
        :class="['live-support-message-row', `is-${message.sender}`]"
      >
        <div
          v-if="message.sender === 'agent'"
          class="live-support-agent-avatar"
          :data-testid="message.id === firstAgentMessageId ? 'live-support-agent' : null"
        >
          LD
        </div>

        <div class="live-support-bubble">
          <strong v-if="message.sender === 'agent'" class="live-support-agent-name">
            {{ message.authorName }} - {{ message.authorTitle }}
          </strong>
          <p>{{ message.body }}</p>

          <div v-if="message.attachments?.length" class="live-support-attachment-preview">
            <AppIcon name="image" :size="28" />
            <div>
              <strong>{{ message.attachments[0].previewText }}</strong>
              <span>{{ message.attachments[0].name }}</span>
            </div>
          </div>

          <span class="live-support-message-meta">
            {{ message.createdAt }}
            <AppIcon v-if="message.sender === 'user'" name="check-double" :size="15" aria-label="Okundu" />
          </span>
        </div>
      </article>

      <div v-if="support.isTyping && !support.isResolved && !support.isClosed" class="live-support-typing" data-testid="live-support-typing">
        <span aria-hidden="true"><i></i><i></i><i></i></span>
        <b>Ayşe - Lipyum Destek</b> yazıyor...
      </div>

      <section v-if="support.isResolved" class="live-support-rating-card">
        <span class="live-support-rating-card__icon" aria-hidden="true">
          <AppIcon name="star" :size="30" />
        </span>
        <h2>Destek deneyiminizi değerlendirin</h2>
        <p>Geri bildiriminizle hizmetimizi geliştirmemize yardımcı olun.</p>
        <div class="live-support-stars" role="radiogroup" aria-label="Destek puanı">
          <button
            v-for="score in 5"
            :key="score"
            type="button"
            :class="{ 'is-selected': support.rating >= score }"
            :aria-checked="support.rating >= score ? 'true' : 'false'"
            role="radio"
            @click="support.rating = score"
          >
            <AppIcon name="star" :size="32" />
          </button>
        </div>
        <label class="live-support-rating-comment">
          <span class="sr-only">Kısa yorum</span>
          <textarea v-model="support.ratingComment" maxlength="250" placeholder="Kısa yorum ekleyin"></textarea>
          <small>{{ support.ratingComment.length }}/250</small>
        </label>
        <div class="live-support-rating-actions">
          <button type="button" class="live-support-primary-action" data-testid="live-support-end" @click="closeConversation">
            <AppIcon name="check" :size="18" />
            Talebi kapat
          </button>
          <button type="button" class="live-support-secondary-action" @click="reopenConversation">
            <AppIcon name="refresh" :size="18" />
            Yeniden aç
          </button>
        </div>
        <small>Aynı sorun devam ederse talebi yeniden açabilirsiniz.</small>
      </section>

      <section v-if="support.isClosed" class="live-support-ended-card" data-testid="live-support-ended">
        <span><AppIcon name="check" :size="24" /></span>
        <div>
          <strong>Talep kapatıldı</strong>
          <p>İhtiyaç olursa aynı konuşmayı yeniden açabilirsin.</p>
        </div>
        <button type="button" @click="reopenConversation">Yeniden aç</button>
      </section>
    </section>

    <footer class="live-support-composer" :class="{ 'is-disabled': support.isClosed }">
      <div class="live-support-composer-row">
        <button class="live-support-icon-button" type="button" aria-label="Dosya ekle" @click="attachImage">
          <AppIcon name="paperclip" :size="24" />
        </button>
        <label class="live-support-input-shell">
          <span class="sr-only">Mesaj</span>
          <input
            v-model="support.messageDraft"
            type="text"
            :disabled="support.isClosed"
            :placeholder="support.isStart ? 'Kısaca sorununuzu yazın...' : 'Mesajınızı yazın...'"
            data-testid="live-support-input"
            @keydown.enter.prevent="sendMessage"
          />
          <AppIcon name="mic" :size="22" />
        </label>
        <button class="live-support-send-button" type="button" :disabled="!canSend" aria-label="Mesaj gönder" data-testid="live-support-send" @click="sendMessage">
          <AppIcon name="send" :size="25" />
        </button>
      </div>
      <p v-if="support.lastError" class="live-support-error" role="alert">{{ support.lastError }}</p>
    </footer>
  </AppPage>
</template>
