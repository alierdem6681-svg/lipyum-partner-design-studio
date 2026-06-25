export const performanceTargets = [
  {
    score: 85,
    title: "85+",
    label: "Daha güçlü görünüm",
    description: "Eksik adımları kapatınca uygun işlerde daha iyi değerlendirilirsin.",
  },
  {
    score: 90,
    title: "90+",
    label: "Güven seviyesi",
    description: "Yorum, hız ve iptal dengen müşteriye daha net güven verir.",
  },
  {
    score: 95,
    title: "95+",
    label: "Üst seviye düzen",
    description: "Profil, aktiflik ve müşteri deneyimi birlikte güçlü kalır.",
  },
];

export const performanceCriteria = [
  {
    id: "profile_completion",
    title: "Profil eksiksizliği",
    icon: "shield",
    maxPoints: 15,
    currentPoints: 14,
    status: "İyi",
    currentValue: "Fotoğraf, hizmet ve bölgeler güncel",
    targetValue: "Açıklama ve çalışma saatlerini tamamen güncel tut",
    description: "Eksiksiz profil, müşterinin seni daha hızlı tanımasını destekler.",
    actionLabel: "Profili Tamamla",
    actionRoute: "/profile",
    checks: ["Profil fotoğrafı", "Hizmet kategorileri", "Bölgeler", "Çalışma saatleri", "Açıklama"],
  },
  {
    id: "reviews",
    title: "Müşteri yorumları",
    icon: "star",
    maxPoints: 15,
    currentPoints: 12,
    status: "Geliştirilebilir",
    currentValue: "126 yorum · 4.8 puan",
    targetValue: "Son işlerden daha düzenli yorum al",
    description: "Olumlu yorumlar müşterinin karar verirken sana güvenmesini kolaylaştırır.",
    actionLabel: "Yorum İste",
    actionRoute: "/reviews",
    checks: ["Yorum sayısı", "Ortalama puan", "Yorum alma oranı", "Yüksek puan kalitesi"],
  },
  {
    id: "complaints",
    title: "Müşteri şikayetleri",
    icon: "message",
    maxPoints: 15,
    currentPoints: 13,
    status: "Güçlü",
    currentValue: "Açık şikayet yok",
    targetValue: "Tekrar eden konuları oluşmadan kapat",
    description: "Sorunları hızlı çözmek müşteri deneyimini düzenli tutar.",
    actionLabel: "Destek Kaydı Aç",
    actionRoute: "/support/new",
    checks: ["Açık şikayet", "Son 30 gün", "Çözüm oranı", "Tekrar eden konu"],
  },
  {
    id: "response_speed",
    title: "Müşteriye hızlı dönüş",
    icon: "clock",
    maxPoints: 15,
    currentPoints: 8,
    status: "Geliştirilebilir",
    currentValue: "Ortalama 18 dakika",
    targetValue: "5 dakika altı",
    description: "Hızlı dönüş yapan partnerler müşteri kaybı riskini azaltır.",
    actionLabel: "Bildirimleri Aç",
    actionRoute: "/notification-settings",
    checks: ["İlk yanıt", "Fırsat bildirimi", "Mesaj takibi", "5 dakika hedefi"],
  },
  {
    id: "cancellation_rate",
    title: "İptal oranı",
    icon: "check",
    maxPoints: 15,
    currentPoints: 12,
    status: "İyi",
    currentValue: "Son 30 gün %9",
    targetValue: "%10 altında kal",
    description: "Düşük iptal oranı güvenilir çalışma düzenini destekler.",
    actionLabel: "İşleri Kontrol Et",
    actionRoute: "/my-jobs",
    checks: ["Son 30 gün", "Partner kaynaklı", "Müşteri kaynaklı", "Tamamlama oranı"],
  },
  {
    id: "active_usage",
    title: "Aktif kullanım",
    icon: "bell",
    maxPoints: 10,
    currentPoints: 9,
    status: "Güçlü",
    currentValue: "Son 7 günde 6 aktif gün",
    targetValue: "Her gün fırsatları kontrol et",
    description: "Aktif partnerler yeni iş fırsatlarını daha hızlı değerlendirebilir.",
    actionLabel: "Bildirimlere Bak",
    actionRoute: "/notifications",
    checks: ["Son giriş", "7 gün aktiflik", "Fırsat görüntüleme"],
  },
  {
    id: "balance",
    title: "Bakiye durumu",
    icon: "wallet",
    maxPoints: 10,
    currentPoints: 8,
    status: "İyi",
    currentValue: "675 kredi · 2-3 iş",
    targetValue: "Bakiye bitmeden yenile",
    description: "Bakiyenin bitmesi uygun işleri kaçırmana neden olabilir.",
    actionLabel: "Bakiye Yükle",
    actionRoute: "/wallet",
    checks: ["Mevcut bakiye", "Minimum öneri", "Bitmeden yenileme", "Fırsat riski"],
  },
  {
    id: "subscription",
    title: "Abonelik durumu",
    icon: "star",
    maxPoints: 5,
    currentPoints: 5,
    status: "Güçlü",
    currentValue: "Ücretli abonelik 3. seviye",
    targetValue: "Abonelik avantajlarını aktif kullan",
    description: "Abonelik skoru destekler; ana ağırlık kalite ve çalışma davranışındadır.",
    actionLabel: "Aboneliği İncele",
    actionRoute: "/subscription",
    checks: ["Seviye 1: +2", "Seviye 2: +3", "Seviye 3: +5"],
  },
];

export const priorityPerformanceActions = [
  {
    id: "more_reviews",
    title: "Yorum akışını güçlendir",
    description: "Tamamlanan işlerden düzenli yorum iste.",
    impact: 3,
    route: "/reviews",
    actionLabel: "Yorum İste",
    icon: "star",
  },
  {
    id: "faster_response",
    title: "İlk dönüşü hızlandır",
    description: "Yeni iş ve mesaj bildirimlerini açık tut.",
    impact: 2,
    route: "/notification-settings",
    actionLabel: "Bildirimleri Aç",
    icon: "clock",
  },
  {
    id: "ready_balance",
    title: "Bakiyeyi kesintisiz tut",
    description: "İş fırsatı kaçırmamak için bakiye eşiğini koru.",
    impact: 1,
    route: "/wallet",
    actionLabel: "Bakiye Yükle",
    icon: "wallet",
  },
];

export const highScoreBenefits = [
  "Uygun işlerde daha güçlü değerlendirilmeni destekler.",
  "Müşteride daha fazla güven oluşturan bilgileri öne çıkarır.",
  "İş fırsatlarını kaçırma riskini azaltmana yardımcı olur.",
  "Profilinin benzer partnerlere göre daha düzenli görünmesini sağlar.",
  "Kampanya ve fırsatlardan daha avantajlı yararlanmanı destekler.",
];

export function calculateCriteriaTotal(criteria = performanceCriteria) {
  return criteria.reduce((total, criterion) => total + Number(criterion.currentPoints || 0), 0);
}

export function calculateCriteriaMax(criteria = performanceCriteria) {
  return criteria.reduce((total, criterion) => total + Number(criterion.maxPoints || 0), 0);
}

export function calculateRemainingToTarget(score, target) {
  return Math.max(0, Number(target || 0) - Number(score || 0));
}

export function getNextTarget(score, targets = performanceTargets) {
  return targets.find((target) => Number(score || 0) < target.score) || targets[targets.length - 1];
}

export function getStatusTone(status) {
  const toneMap = {
    Güçlü: "success",
    İyi: "info",
    Geliştirilebilir: "warning",
    Eksik: "danger",
  };
  return toneMap[status] || "neutral";
}
