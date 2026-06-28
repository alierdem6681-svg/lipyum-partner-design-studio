import { defineStore } from "pinia";

const now = new Date("2026-06-28T09:41:00+03:00");

function minutesAgo(minutes) {
  return new Date(now.getTime() - minutes * 60 * 1000).toISOString();
}

function createTicketNumber(seed) {
  return `LP-${seed}`;
}

export const supportCategories = [
  {
    id: "job_customer",
    title: "İş / müşteri",
    description: "İş, müşteri veya randevu konusu",
    icon: "briefcase",
    fieldLabel: "İlgili iş",
    options: ["#2481 · Klima servisi", "#2478 · Kombi bakımı", "#2472 · Buzdolabı tamiri"],
  },
  {
    id: "payment_wallet",
    title: "Ödeme / bakiye",
    description: "Bakiye, ödeme veya hareket kontrolü",
    icon: "wallet",
    fieldLabel: "İlgili işlem",
    options: ["Bakiye yükleme · ₺500", "Bonus kullanımı · ₺120", "İş alımı · #45297"],
  },
  {
    id: "cancel_refund",
    title: "İptal / iade",
    description: "İş iptali veya bonus iadesi",
    icon: "refresh",
    fieldLabel: "İptal nedeni",
    options: ["Müşteriye ulaşılamadı", "Müşteri tarihi değiştirdi", "Yanlış kategori"],
  },
  {
    id: "technical",
    title: "Teknik sorun",
    description: "Ekran, giriş veya uygulama hatası",
    icon: "alert",
    fieldLabel: "Sorun alanı",
    options: ["Ana sayfa", "Profil", "Cüzdan", "Bildirimler"],
  },
  {
    id: "profile_document",
    title: "Profil / belge",
    description: "Profil, hizmet veya belge güncellemesi",
    icon: "shield",
    fieldLabel: "Belge tipi",
    options: ["Vergi levhası", "Ustalık belgesi", "Kimlik doğrulama", "Profil bilgisi"],
  },
  {
    id: "subscription",
    title: "Abonelik",
    description: "Paket, yenileme veya ödeme",
    icon: "crown",
    fieldLabel: "Abonelik konusu",
    options: ["Gold Plan", "Plus Plan", "VIP Plan", "Yenileme bilgisi"],
  },
];

export const supportPriorityOptions = [
  { id: "normal", label: "Normal", tone: "success" },
  { id: "urgent", label: "Acil", tone: "warning" },
  { id: "blocked", label: "İşim etkileniyor", tone: "danger" },
];

export const supportStatuses = {
  new: { label: "Yeni", tone: "info", icon: "file-text" },
  reviewing: { label: "İnceleniyor", tone: "warning", icon: "clock" },
  waiting_user: { label: "Yanıt bekliyor", tone: "info", icon: "message" },
  answered: { label: "Yanıtlandı", tone: "success", icon: "check" },
  resolved: { label: "Çözüldü", tone: "neutral", icon: "check" },
  closed: { label: "Kapandı", tone: "neutral", icon: "lock" },
};

const initialTickets = [
  {
    id: "lp-2481",
    ticketNo: createTicketNumber(2481),
    subject: "Müşteri ulaşılamıyor",
    categoryId: "job_customer",
    status: "reviewing",
    priority: "normal",
    relatedValue: "#2481 · Klima servisi",
    description: "Müşteriyi 3 kez aradım ancak ulaşamadım. İşin iptal olup olmadığını kontrol eder misiniz?",
    createdAt: minutesAgo(12),
    updatedAt: minutesAgo(12),
    unread: false,
    attachments: [{ name: "ekran-goruntusu.png", size: "212 KB" }],
    messages: [
      { id: "m1", author: "partner", text: "Müşteriyi 3 kez aradım ancak ulaşamadım. İşin iptal olup olmadığını kontrol eder misiniz?", createdAt: "09:24" },
      { id: "m2", author: "support", text: "Talebiniz inceleniyor. Müşteri teyidi için kontrol başlatıldı.", createdAt: "09:31" },
      { id: "m3", author: "system", text: "Operasyon ekibi müşteriye SMS gönderdi.", createdAt: "09:36" },
    ],
  },
  {
    id: "lp-2476",
    ticketNo: createTicketNumber(2476),
    subject: "Bakiye hareketi sorusu",
    categoryId: "payment_wallet",
    status: "answered",
    priority: "normal",
    relatedValue: "Bakiye yükleme · ₺500",
    description: "Son bakiye hareketimde kontrol edilmesi gereken bir konu var.",
    createdAt: minutesAgo(60),
    updatedAt: minutesAgo(60),
    unread: true,
    attachments: [],
    messages: [
      { id: "m4", author: "partner", text: "Son bakiye hareketimde kontrol edilmesi gereken bir konu var.", createdAt: "08:41" },
      { id: "m5", author: "support", text: "Bakiye hareketiniz incelendi. Ödeme kaydı doğru görünüyor.", createdAt: "09:05" },
    ],
  },
  {
    id: "lp-2469",
    ticketNo: createTicketNumber(2469),
    subject: "Profil belge güncelleme",
    categoryId: "profile_document",
    status: "resolved",
    priority: "normal",
    relatedValue: "Vergi levhası",
    description: "Vergi levhası kontrolünü tekrar açabilir misiniz?",
    createdAt: minutesAgo(1440),
    updatedAt: minutesAgo(1440),
    unread: false,
    attachments: [],
    messages: [{ id: "m6", author: "support", text: "Belge kontrolünüz tamamlandı.", createdAt: "Dün" }],
  },
  {
    id: "lp-2462",
    ticketNo: createTicketNumber(2462),
    subject: "Teknik entegrasyon hatası",
    categoryId: "technical",
    status: "reviewing",
    priority: "urgent",
    relatedValue: "Bildirimler",
    description: "Bildirim ekranı açılırken hata alıyorum.",
    createdAt: minutesAgo(2880),
    updatedAt: minutesAgo(2880),
    unread: false,
    attachments: [],
    messages: [{ id: "m7", author: "partner", text: "Bildirim ekranı açılırken hata alıyorum.", createdAt: "2 gün önce" }],
  },
];

function createEmptyDraft() {
  return {
    categoryId: "job_customer",
    priority: "normal",
    relatedValue: supportCategories[0].options[0],
    description: "",
  };
}

export const useSupportTicketStore = defineStore("supportTicket", {
  state: () => ({
    categories: supportCategories,
    priorityOptions: supportPriorityOptions,
    statuses: supportStatuses,
    ticketDraft: createEmptyDraft(),
    attachments: [],
    tickets: initialTickets,
    filter: "all",
    search: "",
    lastCreatedTicketId: "",
  }),
  getters: {
    selectedCategory(state) {
      return state.categories.find((category) => category.id === state.ticketDraft.categoryId) || state.categories[0];
    },
    selectedPriority(state) {
      return state.priorityOptions.find((priority) => priority.id === state.ticketDraft.priority) || state.priorityOptions[0];
    },
    openCount(state) {
      return state.tickets.filter((ticket) => ["new", "reviewing", "waiting_user"].includes(ticket.status)).length;
    },
    answeredCount(state) {
      return state.tickets.filter((ticket) => ticket.status === "answered").length;
    },
    resolvedCount(state) {
      return state.tickets.filter((ticket) => ticket.status === "resolved").length;
    },
    filteredTickets(state) {
      const query = state.search.trim().toLocaleLowerCase("tr-TR");
      return state.tickets.filter((ticket) => {
        const statusMatch =
          state.filter === "all" ||
          (state.filter === "open" && ["new", "reviewing", "waiting_user"].includes(ticket.status)) ||
          (state.filter === "answered" && ticket.status === "answered") ||
          (state.filter === "resolved" && ticket.status === "resolved") ||
          (state.filter === "urgent" && ticket.priority !== "normal");

        const searchMatch =
          !query ||
          ticket.ticketNo.toLocaleLowerCase("tr-TR").includes(query) ||
          ticket.subject.toLocaleLowerCase("tr-TR").includes(query);

        return statusMatch && searchMatch;
      });
    },
  },
  actions: {
    selectCategory(categoryId) {
      const category = this.categories.find((item) => item.id === categoryId);
      if (!category) return;
      this.ticketDraft.categoryId = categoryId;
      this.ticketDraft.relatedValue = category.options[0];
    },
    selectPriority(priority) {
      this.ticketDraft.priority = priority;
    },
    setRelatedValue(value) {
      this.ticketDraft.relatedValue = value;
    },
    setDescription(value) {
      this.ticketDraft.description = value.slice(0, 500);
    },
    addAttachmentMock() {
      if (this.attachments.length >= 3) return;
      this.attachments.push({
        name: this.attachments.length ? `ek-${this.attachments.length + 1}.png` : "ekran-goruntusu.png",
        size: "212 KB",
      });
    },
    submitTicket() {
      const nextNo = 2482 + this.tickets.filter((ticket) => ticket.id.startsWith("lp-new")).length;
      const category = this.categories.find((item) => item.id === this.ticketDraft.categoryId) || this.categories[0];
      const ticket = {
        id: `lp-new-${nextNo}`,
        ticketNo: createTicketNumber(nextNo),
        subject: this.ticketDraft.description.trim().split(".")[0].slice(0, 42) || `${category.title} desteği`,
        categoryId: category.id,
        status: "reviewing",
        priority: this.ticketDraft.priority,
        relatedValue: this.ticketDraft.relatedValue,
        description: this.ticketDraft.description.trim() || "Profilime daha fazla bölge eklemek için yardım istiyorum.",
        createdAt: minutesAgo(0),
        updatedAt: minutesAgo(0),
        unread: false,
        attachments: [...this.attachments],
        messages: [
          {
            id: `m-${nextNo}-1`,
            author: "partner",
            text: this.ticketDraft.description.trim() || "Profilime daha fazla bölge eklemek için yardım istiyorum.",
            createdAt: "Şimdi",
          },
          {
            id: `m-${nextNo}-2`,
            author: "system",
            text: "Talebin operasyon ekibine iletildi.",
            createdAt: "Şimdi",
          },
        ],
      };
      this.tickets.unshift(ticket);
      this.lastCreatedTicketId = ticket.id;
      this.ticketDraft = createEmptyDraft();
      this.attachments = [];
      return ticket;
    },
    getTicket(ticketId) {
      return this.tickets.find((ticket) => ticket.id === ticketId || ticket.ticketNo.toLowerCase() === ticketId.toLowerCase());
    },
    addReply(ticketId, text) {
      const ticket = this.getTicket(ticketId);
      if (!ticket || !text.trim()) return;
      ticket.messages.push({
        id: `m-${ticket.messages.length + 1}-${Date.now()}`,
        author: "partner",
        text: text.trim().slice(0, 500),
        createdAt: "Şimdi",
      });
      ticket.status = "reviewing";
      ticket.updatedAt = minutesAgo(0);
    },
    markResolved(ticketId) {
      const ticket = this.getTicket(ticketId);
      if (!ticket) return;
      ticket.status = "resolved";
      ticket.unread = false;
      ticket.updatedAt = minutesAgo(0);
    },
    setFilter(filter) {
      this.filter = filter;
    },
    setSearch(search) {
      this.search = search;
    },
    resetDraft() {
      this.ticketDraft = createEmptyDraft();
      this.attachments = [];
    },
  },
});
