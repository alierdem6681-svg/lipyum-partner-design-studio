<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const state = ref("idle");
const subject = ref("");
const description = ref("");
const subjectFocused = ref(false);
const descriptionFocused = ref(false);
const draft = ref("");
const typing = ref(false);
const messages = ref([]);
const agentOnline = ref(false);
let connectTimer = 0;
let typingTimer = 0;

const defaultSubject = "İş sayıları hakkında destek";
const defaultDescription = "Daha fazla iş alabilmek için ne yapmalıyım?";
const subjectPlaceholder = computed(() => (subjectFocused.value ? "" : defaultSubject));
const descriptionPlaceholder = computed(() => (descriptionFocused.value ? "" : defaultDescription));

onMounted(() => {
  window.addEventListener("lipyum:live-support-end", endChatFromHeader);
  syncHeaderAction();
});

onBeforeUnmount(() => {
  clearTimers();
  window.removeEventListener("lipyum:live-support-end", endChatFromHeader);
  window.dispatchEvent(new CustomEvent("lipyum:header-actions", { detail: { route: "/support/live", actions: [] } }));
});

watch(state, syncHeaderAction);

function clearTimers() {
  window.clearTimeout(connectTimer);
  window.clearTimeout(typingTimer);
}

function syncHeaderAction() {
  const actions = state.value === "idle" ? [] : ["end-live-chat"];
  window.dispatchEvent(new CustomEvent("lipyum:header-actions", { detail: { route: "/support/live", actions } }));
}

function getConnectionDelay() {
  if (Number.isFinite(window.__LIPYUM_SUPPORT_DELAY__)) return window.__LIPYUM_SUPPORT_DELAY__;
  return Math.floor(5000 + Math.random() * 10000);
}

function getRequestText() {
  const cleanSubject = subject.value.trim() || defaultSubject;
  const cleanDescription = description.value.trim() || defaultDescription;
  return { cleanSubject, cleanDescription };
}

function startChat() {
  clearTimers();
  const { cleanSubject, cleanDescription } = getRequestText();
  state.value = "waiting";
  agentOnline.value = false;
  typing.value = false;
  messages.value = [
    {
      from: "user",
      text: `Konu: ${cleanSubject}`,
      time: "09:41",
      status: "read",
    },
    {
      from: "user",
      text: cleanDescription,
      time: "09:41",
      status: "read",
    },
  ];
  connectTimer = window.setTimeout(() => {
    state.value = "connected";
    agentOnline.value = true;
    messages.value.push({
      from: "agent",
      text: "Merhaba, ben Elif. İş sayını artırmak için profil, bölge ve bakiye durumunu birlikte kontrol edebiliriz. 🙂",
      time: "09:41",
    });
  }, getConnectionDelay());
}

function sendMessage() {
  const text = draft.value.trim();
  if (!text || state.value !== "connected") return;
  messages.value.push({ from: "user", text, time: "09:42", status: "read" });
  draft.value = "";
  typing.value = true;
  window.clearTimeout(typingTimer);
  typingTimer = window.setTimeout(() => {
    typing.value = false;
    messages.value.push({
      from: "agent",
      text: "Mesajınızı aldım. Size en hızlı yol haritasını çıkarmak için ekranınızı kontrol ediyorum.",
      time: "09:42",
    });
  }, 1200);
}

function endChatFromHeader() {
  if (state.value === "idle") return;
  endChat();
}

function endChat() {
  clearTimers();
  typing.value = false;
  agentOnline.value = false;
  if (state.value !== "ended") {
    messages.value.push({ from: "system", text: "Konuşma bitirildi." });
  }
  state.value = "ended";
}
</script>

<template>
  <AppPage title="Canlı Destek" class="support-live-page support-live-page--whatsapp" data-testid="live-support-page">
    <section class="live-whatsapp-shell" :class="`is-${state}`">
      <div class="live-whatsapp-contact">
        <span class="live-whatsapp-avatar" aria-hidden="true">
          <AppIcon name="headphones" :size="22" />
        </span>
        <span class="live-whatsapp-contact__copy">
          <strong>Lipyum Müşteri Temsilcisi</strong>
          <small>{{ agentOnline ? "çevrimiçi" : state === "waiting" ? "bağlanıyor..." : "genelde birkaç saniyede yanıt verir" }}</small>
        </span>
        <span class="live-whatsapp-lock"><AppIcon name="shield" :size="15" /> Güvenli</span>
      </div>

      <template v-if="state === 'idle'">
        <div class="live-whatsapp-start" data-testid="live-support-start-form">
          <span class="live-whatsapp-start__icon"><AppIcon name="message" :size="24" /></span>
          <h2>Canlı desteğe bağlan</h2>
          <p>Konu ve kısa açıklaman sohbet açılınca ilk mesaj olarak temsilciye gönderilir.</p>

          <label>
            <span>Konu</span>
            <input
              v-model="subject"
              data-testid="live-support-title"
              type="text"
              :placeholder="subjectPlaceholder"
              @focus="subjectFocused = true"
              @blur="subjectFocused = false"
            />
          </label>
          <label>
            <span>Kısa açıklama</span>
            <textarea
              v-model="description"
              data-testid="live-support-description"
              rows="3"
              :placeholder="descriptionPlaceholder"
              @focus="descriptionFocused = true"
              @blur="descriptionFocused = false"
            ></textarea>
          </label>
          <AppButton class="primary-btn" icon="message" data-testid="live-support-start" @click="startChat">
            Müşteri Temsilcisine Bağlan
          </AppButton>
        </div>
      </template>

      <template v-else>
        <div class="live-whatsapp-thread" :data-testid="state === 'connected' ? 'live-support-chat' : 'live-support-thread'">
          <div v-if="state === 'waiting'" class="live-whatsapp-connecting" data-testid="live-support-waiting">
            <span class="live-whatsapp-spinner" aria-hidden="true"></span>
            <strong>Temsilci bağlanıyor</strong>
            <small>Talebin iletildi. Uygun temsilci birkaç saniye içinde sohbete katılacak.</small>
            <span class="live-whatsapp-typing-dots"><i></i><i></i><i></i></span>
          </div>

          <span v-if="state === 'connected'" class="v-agent-chip" data-testid="live-support-agent">Elif · Lipyum Destek</span>
          <div v-for="(message, index) in messages" :key="`${message.from}-${index}`" :class="['live-whatsapp-bubble', `is-${message.from}`]">
            <span>{{ message.text }}</span>
            <small v-if="message.from !== 'system'">
              {{ message.time }}
              <em v-if="message.from === 'user'" aria-label="okundu">✓✓</em>
            </small>
          </div>
          <div v-if="typing" class="live-whatsapp-bubble is-agent is-typing" data-testid="live-support-typing">
            <span class="live-whatsapp-typing-dots"><i></i><i></i><i></i></span>
          </div>
          <div v-if="state === 'ended'" class="live-whatsapp-ended" data-testid="live-support-ended">
            <AppIcon name="check" :size="18" />
            Konuşma tamamlandı
          </div>
        </div>

        <div v-if="state === 'connected'" class="live-whatsapp-input">
          <button type="button" aria-label="Emoji seç">😊</button>
          <input v-model="draft" data-testid="live-support-input" type="text" placeholder="Mesaj yaz" @keyup.enter="sendMessage" />
          <button type="button" aria-label="Dosya ekle"><AppIcon name="plus" :size="18" /></button>
          <button type="button" class="is-send" data-testid="live-support-send" aria-label="Gönder" @click="sendMessage">
            <AppIcon name="message" :size="18" />
          </button>
        </div>
      </template>
    </section>
  </AppPage>
</template>
