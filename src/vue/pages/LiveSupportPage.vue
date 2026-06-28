<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";
import { useLiveSupportStore } from "../stores/liveSupportStore.js";

const route = useRoute();
const router = useRouter();
const shell = useAppShellStore();
const support = useLiveSupportStore();
const messageListRef = ref(null);

const canStart = computed(() => support.subject.trim().length > 2 && support.description.trim().length > 4);
const canSend = computed(() => support.messageDraft.trim().length > 0 && !support.isSending && !support.isClosed);
const showChat = computed(() => support.isActive || support.isResolved || support.isClosed);
const statusIcon = computed(() => (support.isResolved || support.isClosed ? "check" : support.isConnecting ? "timer" : "clock"));
const contextIcon = computed(() => (support.isResolved || support.isClosed ? "clock" : "crown"));
const firstAgentMessageId = computed(() => support.messages.find((message) => message.sender === "agent")?.id || "");

function startConversation() {
  if (!canStart.value) {
    shell.showToast("Konu ve kısa açıklama yazmalısın.");
    return;
  }
  support.startConversation();
  scrollToLatestMessage();
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
  <AppPage title="Canlı Destek" compact class="live-support-page" data-testid="live-support-page">
    <section class="live-support-status-strip" aria-label="Canlı destek durumu">
      <span class="live-support-status-chip" :class="{ 'is-resolved': support.isResolved || support.isClosed }">
        <AppIcon :name="statusIcon" :size="16" />
        {{ support.topStatusLabel }}
      </span>
      <span class="live-support-priority" aria-label="Gold öncelikli">
        <AppIcon name="star" :size="18" />
        <b>Gold</b>
        <small>Öncelikli</small>
      </span>
    </section>

    <section v-if="support.isStart" class="live-support-start-card" data-testid="live-support-start-panel">
      <span class="live-support-start-card__icon" aria-hidden="true">
        <AppIcon name="headphones" :size="40" />
      </span>
      <div>
        <h2>Nasıl yardımcı olalım?</h2>
        <p>Sorununuzu seçin, destek ekibi gerekli bilgileri otomatik görsün.</p>
      </div>
    </section>

    <section v-if="support.isStart" class="live-support-start-grid" aria-label="Destek konu seçenekleri">
      <button
        v-for="card in support.startCards"
        :key="card.id"
        type="button"
        :class="['live-support-start-option', { 'is-selected': support.selectedStartCardId === card.id }]"
        :aria-pressed="support.selectedStartCardId === card.id ? 'true' : 'false'"
        @click="support.selectStartCard(card.id)"
      >
        <span class="live-support-option-icon" aria-hidden="true">
          <AppIcon :name="card.icon" :size="24" />
        </span>
        <strong>{{ card.label }}</strong>
        <AppIcon name="chevron-right" :size="18" />
      </button>
    </section>

    <section v-if="support.isStart" class="live-support-start-form" aria-label="Canlı destek başlangıç bilgileri">
      <label>
        <span>Konu</span>
        <input v-model="support.subject" type="text" maxlength="80" data-testid="live-support-title" />
      </label>
      <label>
        <span>Kısa açıklama</span>
        <textarea v-model="support.description" maxlength="240" rows="3" data-testid="live-support-description"></textarea>
      </label>
      <button
        class="live-support-primary-action"
        type="button"
        :disabled="!canStart"
        data-testid="live-support-start"
        @click="startConversation"
      >
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

    <section class="live-support-context-card" aria-label="Destek bağlamı">
      <div class="live-support-context-row">
        <AppIcon name="briefcase" :size="22" />
        <span>{{ support.isStart ? "İlgili iş" : "İş seçildi:" }}</span>
        <strong>{{ support.relatedJob.title }}<template v-if="support.isStart"> #{{ support.relatedJob.id }}</template></strong>
      </div>
      <div class="live-support-context-row">
        <AppIcon name="clipboard" :size="22" />
        <span>Talep durumu:</span>
        <strong class="is-green">{{ support.statusLabel }}</strong>
      </div>
      <div class="live-support-context-row">
        <AppIcon :name="contextIcon" :size="22" />
        <span>{{ support.isResolved || support.isClosed ? "Çözüm süresi:" : "Öncelik:" }}</span>
        <strong :class="support.isResolved || support.isClosed ? 'is-green' : 'is-gold'">
          {{ support.resolutionTimeLabel }}
        </strong>
      </div>
    </section>

    <nav v-if="!support.isStart" class="live-support-topic-strip" aria-label="Destek konuları">
      <button
        v-for="topic in support.topics"
        :key="topic.id"
        type="button"
        :class="['live-support-topic-chip', { 'is-active': support.selectedTopicId === topic.id }]"
        :aria-pressed="support.selectedTopicId === topic.id ? 'true' : 'false'"
        @click="support.selectTopic(topic.id)"
      >
        <AppIcon :name="topic.icon" :size="18" />
        {{ topic.label }}
      </button>
    </nav>

    <section v-if="support.isStart" class="live-support-open-ticket">
      <AppIcon name="clock" :size="22" />
      <span>Açık talep: Müşteriye ulaşılamıyor</span>
      <strong>İşlemde</strong>
      <AppIcon name="chevron-right" :size="18" />
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
      <button type="button" class="live-support-shortcut" @click="attachImage">
        <AppIcon name="image" :size="19" />
        Fotoğraf ekle
      </button>
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
      <button v-if="support.isActive" type="button" class="live-support-resolve-link" data-testid="live-support-end" @click="closeConversation">
        Konuşmayı kapat
      </button>
    </footer>
  </AppPage>
</template>
