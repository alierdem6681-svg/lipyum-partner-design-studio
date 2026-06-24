<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();
const state = ref("idle");
const title = ref("");
const description = ref("");
const draft = ref("");
const typing = ref(false);
const messages = ref([]);
const threadRef = ref(null);
let connectTimer = 0;
let typingTimer = 0;

const defaultTitle = "İş sayıları hakkında destek";
const defaultDescription = "Daha fazla iş alabilmek için ne yapmalıyım?";

const hasDraft = computed(() => draft.value.trim().length > 0);
const chatTitle = computed(() => title.value.trim() || defaultTitle);
const chatDescription = computed(() => description.value.trim() || defaultDescription);

onBeforeUnmount(clearTimers);

watch(
  messages,
  () => {
    scrollToBottom(true);
  },
  { deep: true },
);

watch(state, () => {
  scrollToBottom(false);
});

function clearTimers() {
  window.clearTimeout(connectTimer);
  window.clearTimeout(typingTimer);
}

function scrollToBottom(smooth = false) {
  nextTick(() => {
    const thread = threadRef.value;
    if (!thread) return;
    thread.scrollTo({
      top: thread.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  });
}

function startChat() {
  clearTimers();
  state.value = "waiting";
  messages.value = [
    {
      from: "user",
      text: `${chatTitle.value}\n${chatDescription.value}`,
      time: "09:41",
      status: "read",
    },
    { from: "system", text: "Müşteri temsilcisine bağlanıyorsun.", time: "09:41" },
  ];
  connectTimer = window.setTimeout(() => {
    state.value = "connected";
    messages.value.push({
      from: "agent",
      text: "Merhaba, ben Elif Yılmaz. Size nasıl yardımcı olabilirim?",
      time: "09:42",
    });
  }, 5000);
}

function sendMessage() {
  const text = draft.value.trim();
  if (!text || state.value !== "connected") return;
  messages.value.push({ from: "user", text, time: "09:43", status: "read" });
  draft.value = "";
  typing.value = true;
  window.clearTimeout(typingTimer);
  typingTimer = window.setTimeout(() => {
    typing.value = false;
    messages.value.push({
      from: "agent",
      text: "Mesajınızı aldım, ilgili kaydı kontrol ediyorum.",
      time: "09:44",
    });
  }, 1200);
}

function endChat() {
  clearTimers();
  state.value = "ended";
  typing.value = false;
  messages.value.push({ from: "system", text: "Konuşma bitirildi.", time: "09:45" });
}
</script>

<template>
  <AppPage title="Canlı Destek" class="v-live-support-page" data-testid="live-support-page">
    <AppCard v-if="state === 'idle'" padding="lg" class="v-live-start-card">
      <div class="v-stack v-live-support">
        <h3>Canlı destek talebi</h3>
        <p>Konunu yaz, temsilci bağlanınca ilk mesaj olarak gönderelim.</p>
        <label>
          <span>Konu</span>
          <input
            v-model="title"
            data-testid="live-support-title"
            type="text"
            :placeholder="defaultTitle"
          />
        </label>
        <label>
          <span>Kısa açıklama</span>
          <textarea
            v-model="description"
            data-testid="live-support-description"
            rows="3"
            :placeholder="defaultDescription"
          />
        </label>
        <AppButton icon="headphones" data-testid="live-support-start" @click="startChat">
          Müşteri Temsilcisine Bağlan
        </AppButton>
      </div>
    </AppCard>

    <section v-else class="v-live-chat-shell" aria-label="Canlı destek konuşması">
      <div
        class="v-live-chat-status"
        :data-testid="state === 'waiting' ? 'live-support-waiting' : state === 'ended' ? 'live-support-ended' : undefined"
      >
        <div>
          <strong>{{ state === "waiting" ? "Bağlanıyor" : state === "connected" ? "Görüşme açık" : "Görüşme tamamlandı" }}</strong>
          <span>{{ state === "waiting" ? "Temsilci birkaç saniye içinde sohbete katılacak." : "Mesajların güvenli şekilde kaydedildi." }}</span>
        </div>
        <AppChip v-if="state === 'waiting'" tone="warning">Kısa süre</AppChip>
        <AppButton
          v-if="state === 'waiting'"
          size="sm"
          variant="secondary"
          icon="file-text"
          data-testid="live-support-create-ticket"
          @click="router.push('/support/new')"
        >
          Talep Oluştur
        </AppButton>
        <button v-if="state === 'connected'" class="v-live-end-action" type="button" data-testid="live-support-end" @click="endChat">
          Konuşmayı bitir
        </button>
      </div>

      <div ref="threadRef" class="v-chat-thread" :data-testid="state === 'connected' ? 'live-support-chat' : 'live-support-thread'">
        <div
          v-for="(message, index) in messages"
          :key="`${message.from}-${index}`"
          :class="['v-chat-bubble', `is-${message.from}`]"
        >
          <span class="v-chat-bubble__text">{{ message.text }}</span>
          <span v-if="message.from !== 'system'" class="v-chat-bubble__meta">
            {{ message.time }}
            <span v-if="message.from === 'user'" class="v-chat-checks" aria-label="Okundu">✓✓</span>
          </span>
        </div>
        <div v-if="typing" class="v-chat-bubble is-agent is-typing" data-testid="live-support-typing">
          <span aria-label="Yazıyor">•••</span>
        </div>
      </div>

      <form v-if="state === 'connected'" class="v-chat-input" @submit.prevent="sendMessage">
        <input
          v-model="draft"
          data-testid="live-support-input"
          type="text"
          placeholder="Mesaj yaz"
          autocomplete="off"
        />
        <button
          v-if="hasDraft"
          class="v-chat-send"
          type="submit"
          data-testid="live-support-send"
          aria-label="Mesaj gönder"
        >
          <AppIcon name="send" :size="20" class-name="icon" />
        </button>
      </form>
    </section>
  </AppPage>
</template>
