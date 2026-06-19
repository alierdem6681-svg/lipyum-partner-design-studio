<script setup>
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();
const state = ref("idle");
const title = ref("Kredi kullanımı hakkında destek");
const description = ref("Kredi ve bonus kullanımıyla ilgili canlı destek almak istiyorum.");
const draft = ref("");
const typing = ref(false);
const messages = ref([]);
let connectTimer = 0;
let typingTimer = 0;

onBeforeUnmount(clearTimers);

function clearTimers() {
  window.clearTimeout(connectTimer);
  window.clearTimeout(typingTimer);
}

function startChat() {
  clearTimers();
  state.value = "waiting";
  messages.value = [{ from: "system", text: "Talep başlığı alındı. Tahmini süre 2 dakika." }];
  connectTimer = window.setTimeout(() => {
    state.value = "connected";
    messages.value.push({ from: "agent", text: "Lipyum destekten Elif bağlandı. Size nasıl yardımcı olabiliriz?" });
  }, 5000);
}

function sendMessage() {
  const text = draft.value.trim();
  if (!text) return;
  messages.value.push({ from: "user", text });
  draft.value = "";
  typing.value = true;
  window.clearTimeout(typingTimer);
  typingTimer = window.setTimeout(() => {
    typing.value = false;
    messages.value.push({ from: "agent", text: "Mesajınızı aldım, ilgili kaydı kontrol ediyorum." });
  }, 1200);
}

function endChat() {
  clearTimers();
  state.value = "ended";
  typing.value = false;
  messages.value.push({ from: "system", text: "Konuşma bitirildi." });
}
</script>

<template>
  <AppPage title="Canlı Destek" data-testid="live-support-page">
    <AppCard padding="lg">
      <div class="v-stack v-live-support">
        <template v-if="state === 'idle'">
          <h3>Canlı destek talebi</h3>
          <label>
            <span>Talep başlığı</span>
            <input v-model="title" data-testid="live-support-title" type="text" />
          </label>
          <label>
            <span>Kısa açıklama</span>
            <textarea v-model="description" data-testid="live-support-description" rows="3" />
          </label>
          <AppButton icon="message" data-testid="live-support-start" @click="startChat">Canlı sohbete başla</AppButton>
        </template>

        <template v-else>
          <div class="v-live-waiting" :data-testid="state === 'waiting' ? 'live-support-waiting' : state === 'ended' ? 'live-support-ended' : undefined">
            <h3>{{ state === "waiting" ? "Temsilci bağlanıyor" : state === "connected" ? "Lipyum canlı destek" : "Konuşma tamamlandı" }}</h3>
            <AppChip tone="warning">Tahmini süre 2 dakika</AppChip>
            <AppButton
              v-if="state === 'waiting'"
              variant="secondary"
              icon="file-text"
              data-testid="live-support-create-ticket"
              @click="router.push('/support/new')"
            >
              Beklerken Talep Oluştur
            </AppButton>
          </div>

          <div class="v-chat-thread" :data-testid="state === 'connected' ? 'live-support-chat' : 'live-support-thread'">
            <span v-if="state === 'connected'" class="v-agent-chip" data-testid="live-support-agent">Elif · Lipyum Destek</span>
            <div
              v-for="(message, index) in messages"
              :key="`${message.from}-${index}`"
              :class="['v-chat-bubble', `is-${message.from}`]"
            >
              {{ message.text }}
            </div>
            <div v-if="typing" class="v-chat-bubble is-agent" data-testid="live-support-typing">Yazıyor...</div>
          </div>

          <div v-if="state === 'connected'" class="v-chat-input">
            <input v-model="draft" data-testid="live-support-input" type="text" placeholder="Mesaj yaz" @keyup.enter="sendMessage" />
            <AppButton size="sm" icon="send" data-testid="live-support-send" @click="sendMessage">Gönder</AppButton>
            <AppButton size="sm" variant="ghost" data-testid="live-support-end" @click="endChat">Konuşmayı bitir</AppButton>
          </div>
        </template>
      </div>
    </AppCard>
  </AppPage>
</template>
