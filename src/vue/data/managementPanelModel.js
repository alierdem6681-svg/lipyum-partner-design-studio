export const managementSummary = {
  title: "Bugünkü Kontrol",
  status: "İyi",
  netProfit: "₺128.540",
  delta: "+ %18,7",
  deltaLabel: "düne göre",
  approvals: 12,
  pilots: 5,
  lastUpdate: "09:25 · Bugün",
};

export const managementQuickActions = [
  { id: "approvals", label: "Onay", icon: "check", target: "approvals" },
  { id: "opportunities", label: "Fırsat", icon: "trend-up", target: "actions" },
  { id: "pilots", label: "Pilot", icon: "sparkles", target: "tasks" },
  { id: "system", label: "Sistem", icon: "settings", target: "system" },
  { id: "reports", label: "Rapor", icon: "file-text", target: "reports" },
];

export const managementActionCenter = [
  {
    id: "budget-test",
    account: "Lipyum TR",
    campaign: "İstanbul Beyaz Eşya",
    region: "İstanbul / Beyaz Eşya",
    profit: "₺24.350",
    probability: 82,
    risk: "Düşük",
    tone: "green",
    nextStep: "Bütçe Artırımı Testi",
  },
  {
    id: "capacity-match",
    account: "Partner Ağı",
    campaign: "Ankara Kombi",
    region: "Ankara / Kombi",
    profit: "₺18.760",
    probability: 64,
    risk: "Orta",
    tone: "amber",
    nextStep: "Kapasite Eşleşme Pilotu",
  },
  {
    id: "keyword-clean",
    account: "Servis Kalitesi",
    campaign: "İzmir Klima",
    region: "İzmir / Klima",
    profit: "₺12.430",
    probability: 38,
    risk: "Yüksek",
    tone: "red",
    nextStep: "Düşük Niyet Temizliği",
  },
];

export const managementApprovals = [
  {
    id: "approval-budget",
    title: "Bütçe Artırımı Testi",
    context: "İstanbul Beyaz Eşya · Günlük kontrollü artış",
    profit: "₺6.820",
    probability: 76,
    icon: "bar-chart",
  },
  {
    id: "approval-profile",
    title: "Profil Güçlendirme",
    context: "Fotoğraf ve bölge görünürlüğü",
    profit: "₺3.460",
    probability: 68,
    icon: "shield",
  },
];

export const managementDailyTasks = [
  { step: 1, title: "Veri Kontrolü", status: "Senkron tamam", icon: "wallet" },
  { step: 2, title: "Fırsat İncele", status: "8 yeni fırsat", icon: "search" },
  { step: 3, title: "Pilot Takibi", status: "3 aktif pilot", icon: "sparkles" },
  { step: 4, title: "Güvenlik Kontrolü", status: "Tümü geçti", icon: "shield" },
  { step: 5, title: "Rapor Hazırla", status: "Gün sonu", icon: "file-text" },
];

export const managementReports = [
  { id: "profit", title: "Net Kâr Trendi", subtitle: "7 gün", value: "₺128.540", label: "+ %18,7", tone: "blue", spark: [18, 22, 25, 31, 27, 36, 42] },
  { id: "capacity", title: "Kapasite Kullanımı", subtitle: "Bugün", value: "%72", label: "Orta", tone: "amber", ring: 72 },
  { id: "risk", title: "Risk Dağılımı", subtitle: "Fırsat", value: "Düşük %52", label: "Orta %32", tone: "green", ring: 52 },
  { id: "health", title: "Sistem Sağlığı", subtitle: "Canlı", value: "%98", label: "Mükemmel", tone: "green", spark: [41, 47, 53, 44, 51, 49, 58] },
];

export const managementSystemStatus = [
  { title: "ML Durumu", value: "Sağlıklı", icon: "sparkles", tone: "green" },
  { title: "Otomasyon", value: "Çalışıyor", icon: "settings", tone: "green" },
  { title: "AI Köprüsü", value: "Bağlı", icon: "zap", tone: "green" },
  { title: "İş Kuyruğu", value: "Normal", icon: "list", tone: "blue" },
  { title: "Snapshot", value: "Güncel", icon: "wallet", tone: "blue" },
  { title: "Tünel", value: "Aktif", icon: "globe", tone: "green" },
  { title: "Panel Auth", value: "Güvenli", icon: "lock", tone: "green" },
  { title: "Veri Kalitesi", value: "Yüksek", icon: "bar-chart", tone: "green" },
];

export const managementSecurityGates = [
  { title: "Dry-Run", value: "Hazır", icon: "shield", tone: "green" },
  { title: "Validate", value: "Hazır", icon: "check-square", tone: "green" },
  { title: "Read-Back", value: "Hazır", icon: "eye", tone: "green" },
  { title: "Rollback", value: "Hazır", icon: "refresh", tone: "blue" },
  { title: "Onay", value: "Gerekli", icon: "lock", tone: "amber" },
  { title: "Keyword Pause", value: "Kapalı", icon: "alert", tone: "red" },
];
