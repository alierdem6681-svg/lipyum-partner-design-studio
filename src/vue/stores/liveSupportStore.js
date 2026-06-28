import { defineStore } from "pinia";

export const liveSupportTopics = [
  { id: "payment", label: "Ödeme", icon: "credit-card" },
  { id: "job_dispute", label: "İş itirazı", icon: "scale" },
  { id: "technical", label: "Teknik sorun", icon: "wrench" },
  { id: "package", label: "Paket", icon: "package" },
];

export const liveSupportStartCards = [
  { id: "active_job", label: "Aktif iş sorunu", icon: "clipboard", topicId: "job_dispute" },
  { id: "payment", label: "Ödeme / bakiye", icon: "credit-card", topicId: "payment" },
  { id: "subscription", label: "Paket / abonelik", icon: "package", topicId: "package" },
  { id: "technical", label: "Teknik sorun", icon: "wrench", topicId: "technical" },
];

const baseMessages = [
  {
    id: "m1",
    sender: "agent",
    authorName: "Ayşe",
    authorTitle: "Lipyum Destek",
    body: "Merhaba, size hızlıca yardımcı olalım.",
    createdAt: "09:41",
    status: "read",
  },
  {
    id: "m2",
    sender: "user",
    body: "Bu işte müşteriye ulaşamıyorum.",
    createdAt: "09:42",
    status: "read",
  },
  {
    id: "m3",
    sender: "agent",
    authorName: "Ayşe",
    authorTitle: "Lipyum Destek",
    body: "Ekran görüntüsü ekleyebilir misiniz?",
    createdAt: "09:42",
    status: "read",
  },
  {
    id: "m4",
    sender: "user",
    body: "Fotoğraf eklendi",
    createdAt: "09:44",
    status: "read",
    attachments: [
      {
        id: "att-1",
        type: "image",
        name: "is-detayi.png",
        previewText: "İş Detayı",
        uploadStatus: "uploaded",
      },
    ],
  },
  {
    id: "m5",
    sender: "agent",
    authorName: "Ayşe",
    authorTitle: "Lipyum Destek",
    body: "Kontrol ediyorum, gerekirse talebi yeniden yönlendireceğiz.",
    createdAt: "09:45",
    status: "read",
  },
];

const resolvedMessages = [
  {
    id: "r1",
    sender: "agent",
    authorName: "Ayşe",
    authorTitle: "Lipyum Destek",
    body: "Talebinizi yeniden yönlendirdik. Yeni bilgi geldikçe buradan yazacağız.",
    createdAt: "09:45",
    status: "read",
  },
  {
    id: "r2",
    sender: "user",
    body: "Teşekkürler, sorun çözüldü.",
    createdAt: "09:46",
    status: "read",
  },
  {
    id: "r3",
    sender: "agent",
    authorName: "Ayşe",
    authorTitle: "Lipyum Destek",
    body: "Rica ederim, her zaman buradayız.",
    createdAt: "09:46",
    status: "read",
  },
];

function currentTime() {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function cloneMessages(messages) {
  return messages.map((message) => ({
    ...message,
    attachments: message.attachments ? message.attachments.map((attachment) => ({ ...attachment })) : undefined,
  }));
}

export const useLiveSupportStore = defineStore("liveSupport", {
  state: () => ({
    status: "start",
    selectedStartCardId: "active_job",
    selectedTopicId: "job_dispute",
    subject: "İş sayıları hakkında destek",
    description: "Daha fazla iş alabilmek için ne yapmalıyım?",
    messageDraft: "",
    rating: 0,
    ratingComment: "",
    isTyping: false,
    isSending: false,
    lastError: "",
    connectTimer: null,
    typingTimer: null,
    relatedJob: {
      id: "123456",
      title: "Klima arıza talebi",
      customerName: "Ahmet Yılmaz",
      address: "Bahçelievler Mah. 123. Sk.",
    },
    assignedAgent: {
      id: "agent-ayse",
      name: "Ayşe",
      title: "Lipyum Destek",
      avatarInitials: "LD",
    },
    messages: cloneMessages(baseMessages),
  }),
  getters: {
    topics: () => liveSupportTopics,
    startCards: () => liveSupportStartCards,
    selectedStartCard(state) {
      return liveSupportStartCards.find((item) => item.id === state.selectedStartCardId) || liveSupportStartCards[0];
    },
    selectedTopic(state) {
      return liveSupportTopics.find((topic) => topic.id === state.selectedTopicId) || liveSupportTopics[0];
    },
    isStart(state) {
      return state.status === "start";
    },
    isConnecting(state) {
      return state.status === "loading";
    },
    isActive(state) {
      return ["active", "waiting_customer", "offline_hours"].includes(state.status);
    },
    isResolved(state) {
      return state.status === "resolved";
    },
    isClosed(state) {
      return state.status === "closed";
    },
    statusLabel(state) {
      const labels = {
        start: "Yeni talep",
        loading: "Bağlanıyor",
        active: "İşlemde",
        waiting_customer: "Sizden bilgi bekleniyor",
        offline_hours: "Mesai dışı",
        resolved: "Çözüldü",
        closed: "Kapandı",
      };
      return labels[state.status] || "İşlemde";
    },
    topStatusLabel(state) {
      if (state.status === "resolved" || state.status === "closed") return "Talep çözüldü";
      if (state.status === "loading") return "Temsilciye bağlanıyor";
      return "Ortalama yanıt 2 dk";
    },
    resolutionTimeLabel(state) {
      return state.status === "resolved" || state.status === "closed" ? "8 dk" : "Gold";
    },
  },
  actions: {
    selectStartCard(cardId) {
      const card = liveSupportStartCards.find((item) => item.id === cardId);
      if (!card) return;
      this.selectedStartCardId = cardId;
      this.selectedTopicId = card.topicId;
    },
    selectTopic(topicId) {
      if (!liveSupportTopics.some((topic) => topic.id === topicId)) return;
      this.selectedTopicId = topicId;
    },
    startConversation() {
      this.lastError = "";
      this.status = "loading";
      window.clearTimeout(this.connectTimer);
      this.connectTimer = window.setTimeout(() => {
        this.status = "active";
        this.isTyping = true;
        window.clearTimeout(this.typingTimer);
        this.typingTimer = window.setTimeout(() => {
          this.isTyping = false;
        }, 1400);
      }, 650);
    },
    sendMessage() {
      const body = this.messageDraft.trim();
      if (!body || this.isSending || this.status === "closed") return;
      if (this.status === "start") {
        this.startConversation();
      }
      this.isSending = true;
      this.lastError = "";
      this.messages.push({
        id: `user-${Date.now()}`,
        sender: "user",
        body,
        createdAt: currentTime(),
        status: "read",
      });
      this.messageDraft = "";
      window.setTimeout(() => {
        this.isSending = false;
        if (this.status === "active") {
          this.isTyping = true;
          window.clearTimeout(this.typingTimer);
          this.typingTimer = window.setTimeout(() => {
            this.isTyping = false;
          }, 1200);
        }
      }, 300);
    },
    attachImage() {
      if (this.status === "start") this.startConversation();
      this.messages.push({
        id: `attachment-${Date.now()}`,
        sender: "user",
        body: "Fotoğraf eklendi",
        createdAt: currentTime(),
        status: "read",
        attachments: [
          {
            id: `file-${Date.now()}`,
            type: "image",
            name: "ekran-goruntusu.png",
            previewText: "İş Detayı",
            uploadStatus: "uploaded",
          },
        ],
      });
    },
    resolveConversation() {
      this.status = "resolved";
      this.isTyping = false;
      this.messages = cloneMessages(resolvedMessages);
    },
    closeConversation() {
      this.status = "closed";
      this.isTyping = false;
    },
    reopenConversation() {
      this.status = "active";
      this.messages.push({
        id: `reopen-${Date.now()}`,
        sender: "system",
        body: "Talep yeniden açıldı.",
        createdAt: currentTime(),
        status: "read",
      });
    },
    setResolvedDemo() {
      this.status = "resolved";
      this.messages = cloneMessages(resolvedMessages);
      this.isTyping = false;
    },
    resetLiveSupportDemo() {
      this.status = "start";
      this.selectedStartCardId = "active_job";
      this.selectedTopicId = "job_dispute";
      this.subject = "İş sayıları hakkında destek";
      this.description = "Daha fazla iş alabilmek için ne yapmalıyım?";
      this.messageDraft = "";
      this.rating = 0;
      this.ratingComment = "";
      this.isTyping = false;
      this.isSending = false;
      this.lastError = "";
      this.messages = cloneMessages(baseMessages);
    },
  },
});
