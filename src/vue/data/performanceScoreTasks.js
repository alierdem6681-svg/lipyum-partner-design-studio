export const PERFORMANCE_STORAGE_KEY = "lipyum.performanceScore.tasks.v1";

export const performanceScoreConfig = {
  baseScore: 81,
  targetScore: 85,
  maxScore: 100,
  level: "İyi",
};

export const performanceTasks = [
  {
    id: "job-result",
    title: "Son işin bilgilerini gir",
    shortText: "Ücret, gider ve iş sonucunu tamamla.",
    icon: "receipt",
    points: 1.2,
    minutes: 3,
    priority: "Şimdi yap",
    how: "Son tamamlanan işin ücretini, giderini ve kısa sonucunu ekle.",
    outcome: "Sistem iş sonucunu net gördüğü için skorun hızlı yükselir.",
    actionLabel: "Görevi Tamamla",
  },
  {
    id: "review-reply",
    title: "Yoruma cevap ver",
    shortText: "Son müşteri yorumuna kısa ve nazik yanıt yaz.",
    icon: "message",
    points: 0.8,
    minutes: 2,
    priority: "Kolay puan",
    how: "Müşteriye teşekkür eden kısa bir cevap yaz. Uzun metin gerekmez.",
    outcome: "Cevaplanan yorumlar müşteriye güven verir ve profilini güçlendirir.",
    actionLabel: "Cevapladım",
  },
  {
    id: "work-hours",
    title: "Çalışma saatlerini güncelle",
    shortText: "Bugün hangi saatlerde iş alacağını netleştir.",
    icon: "clock",
    points: 0.7,
    minutes: 2,
    priority: "Hızlı görev",
    how: "Uygun olduğun saatleri kontrol et ve güncel değilse düzelt.",
    outcome: "Uygun işlerle daha doğru eşleşirsin.",
    actionLabel: "Güncelledim",
  },
  {
    id: "profile-photo",
    title: "İş fotoğrafı ekle",
    shortText: "Tamamlanan bir işten net bir fotoğraf ekle.",
    icon: "image",
    points: 0.6,
    minutes: 4,
    priority: "Profil gücü",
    how: "İş öncesi veya sonrası net bir görsel seç. Bulanık fotoğraf ekleme.",
    outcome: "Görseli güçlü profiller müşteride daha hızlı güven oluşturur.",
    actionLabel: "Fotoğraf Ekledim",
  },
  {
    id: "balance-ready",
    title: "Bakiye hazır olsun",
    shortText: "İş kaçırmamak için bakiyeni güvenli seviyede tut.",
    icon: "wallet",
    points: 0.5,
    minutes: 1,
    priority: "Kesinti önle",
    how: "Bakiyen düşükse yükleme yap veya düşük bakiye uyarısını aç.",
    outcome: "Bakiye bitince uygun işleri kaçırma riskin azalır.",
    actionLabel: "Kontrol Ettim",
  },
];

export const performanceBenefits = [
  { icon: "eye", title: "Daha güçlü görünüm", text: "Profilin uygun işlerde daha güven veren sinyaller taşır." },
  { icon: "badge-check", title: "Güven etkisi", text: "Yorum, hız ve düzenli kullanım müşterinin kararını kolaylaştırır." },
  { icon: "target", title: "Net yol haritası", text: "Hangi görevin ne kazandırdığını açıkça görürsün." },
];

export function formatPerformanceScore(value) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function calculatePerformanceScore(completedTaskIds = []) {
  const completed = new Set(completedTaskIds);
  const earned = performanceTasks.reduce((total, task) => total + (completed.has(task.id) ? task.points : 0), 0);
  return Math.min(performanceScoreConfig.maxScore, performanceScoreConfig.baseScore + earned);
}

export function nextPerformanceTask(completedTaskIds = []) {
  const completed = new Set(completedTaskIds);
  return performanceTasks.find((task) => !completed.has(task.id)) || null;
}
