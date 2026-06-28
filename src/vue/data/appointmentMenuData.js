export const appointmentSummary = {
  isOpen: true,
  freeHoursToday: 6,
  pendingApprovals: 3,
  weeklyRevenue: "₺18.500",
  activeSlots: 12,
  insight: {
    title: "14:00-17:00 arası boşluk var",
    description: "Bu saatleri indirime açarsan randevu doluluk oranını artırabilirsin.",
    actionLabel: "İndirime aç",
  },
};

export const appointmentServiceTemplates = [
  { id: "beauty", label: "Güzellik", icon: "sparkles" },
  { id: "cleaning", label: "Temizlik", icon: "home" },
  { id: "consulting", label: "Danışmanlık", icon: "message" },
  { id: "technical", label: "Teknik Servis", icon: "wrench" },
];

export const appointmentServices = [
  {
    id: "nail",
    name: "Tırnak yapımı",
    detail: "90 dk • ₺500",
    team: "Ayşe müsait",
    slots: 8,
    category: "beauty",
    icon: "sparkles",
    active: true,
  },
  {
    id: "manicure",
    name: "Manikür",
    detail: "60 dk • ₺700",
    team: "Ekip seçilebilir",
    slots: 5,
    category: "beauty",
    icon: "hand",
    active: true,
  },
  {
    id: "cleaning-5h",
    name: "5 saat temizlik",
    detail: "5 saat • ₺2.000",
    team: "Ekip 1, Ekip 2",
    slots: 3,
    category: "cleaning",
    icon: "home",
    active: true,
  },
];

export const weeklyAvailability = [
  { day: "Pazartesi", hours: "09:00 - 18:00", status: "Açık" },
  { day: "Salı", hours: "09:00 - 18:00", status: "Açık" },
  { day: "Çarşamba", hours: "10:00 - 17:00", status: "Açık" },
  { day: "Perşembe", hours: "Kapalı", status: "Kapalı" },
];

export const slotRules = [
  { label: "Randevu aralığı", value: "30 dk", icon: "timer" },
  { label: "En erken randevu", value: "2 saat sonra", icon: "clock" },
  { label: "Randevular arası boşluk", value: "15 dk", icon: "pause" },
  { label: "Günlük sınır", value: "12 slot", icon: "calendar" },
];

export const appointmentTeams = [
  {
    id: "ayse",
    name: "Ayşe Durmaz",
    services: "Tırnak, Manikür",
    appointments: "3 randevu",
    availability: "14:00 sonrası müsait",
    slots: 4,
  },
  {
    id: "team-1",
    name: "Ekip 1",
    services: "Temizlik",
    appointments: "2 randevu",
    availability: "16:00 sonrası müsait",
    slots: 2,
  },
  {
    id: "team-2",
    name: "Ekip 2",
    services: "Temizlik",
    appointments: "Bugün boş",
    availability: "Müsait",
    slots: 6,
  },
];

export const assignmentModes = [
  {
    id: "customer_selects",
    label: "Müşteri ekip seçsin",
    description: "Müşteri randevu alırken uygun ekibi kendisi seçer.",
  },
  {
    id: "auto_assign",
    label: "Herhangi uygun ekip ata",
    description: "Sistem uygun ekiplerden birini otomatik önerir.",
  },
  {
    id: "partner_assigns",
    label: "Ben sonra atayayım",
    description: "Randevu geldikten sonra ekibi sen belirlersin.",
  },
];
