export const performanceScoreConfig = {
  targetScore: 85,
  maxScore: 100,
  level: "İyi",
};

export const performanceCriteria = [
  {
    id: "profile_completion",
    title: "Profil eksiksizliği",
    icon: "user",
    maxPoints: 15,
    currentPoints: 13,
    status: "İyi",
    currentValue: "Fotoğraf, hizmet ve bölgeler aktif",
    targetValue: "Açıklama ve saat bilgisi tamamen güncel",
    description: "Eksiksiz profil, müşterinin seni daha hızlı tanımasını destekler.",
    actionLabel: "Profili Tamamla",
    actionRoute: "/profile",
    measures: ["Profil fotoğrafı", "Hizmet kategorileri", "Çalışma bölgeleri", "Çalışma saatleri", "Partner açıklaması"],
  },
  {
    id: "reviews",
    title: "Müşteri yorumları",
    icon: "message",
    maxPoints: 15,
    currentPoints: 12,
    status: "İyi",
    currentValue: "Son 10 işte 2 yorum",
    targetValue: "En az 5 yorum",
    description: "Daha fazla olumlu yorum, müşterilerin sana güvenmesini kolaylaştırır.",
    actionLabel: "Yorum İste",
    actionRoute: "/reviews",
    measures: ["Yorum sayısı", "Ortalama puan", "Son işlerden yorum alma oranı"],
  },
  {
    id: "complaints",
    title: "Müşteri şikayetleri",
    icon: "shield",
    maxPoints: 15,
    currentPoints: 14,
    status: "Güçlü",
    currentValue: "Açık şikayet yok",
    targetValue: "Çözüm oranını koru",
    description: "Çözülmüş kayıtlar ve düşük şikayet sayısı güven sinyalini güçlendirir.",
    actionLabel: "",
    actionRoute: "",
    measures: ["Açık şikayet sayısı", "Son 30 gün şikayet sayısı", "Çözülmüş şikayet oranı"],
  },
  {
    id: "response_speed",
    title: "Müşteriye hızlı dönüş",
    icon: "zap",
    maxPoints: 15,
    currentPoints: 10,
    status: "Geliştirilebilir",
    currentValue: "Ortalama 18 dakika",
    targetValue: "5 dakika altı",
    description: "Hızlı dönüş yapan partnerler müşteri kaybını azaltır.",
    actionLabel: "Bildirimleri Aç",
    actionRoute: "/notification-settings",
    measures: ["Ortalama dönüş süresi", "Hedef: 5 dakika altı"],
  },
  {
    id: "cancellation_rate",
    title: "İptal oranı",
    icon: "calendar-check",
    maxPoints: 15,
    currentPoints: 11,
    status: "İyi",
    currentValue: "Son 30 gün iptal oranı %12",
    targetValue: "%10 altı",
    description: "Düşük iptal oranı, sistemin seni daha güvenilir partner olarak değerlendirmesine yardımcı olur.",
    actionLabel: "İşleri İncele",
    actionRoute: "/my-jobs",
    measures: ["Son 30 gün iptal oranı", "Müşteri kaynaklı iptal", "Partner kaynaklı iptal"],
  },
  {
    id: "active_usage",
    title: "Uygulamayı aktif kullanım",
    icon: "clock",
    maxPoints: 10,
    currentPoints: 9,
    status: "Güçlü",
    currentValue: "Son 7 günde 6 aktif gün",
    targetValue: "Her gün fırsatları kontrol et",
    description: "Aktif partnerler, yeni iş fırsatlarını kaçırmadan değerlendirebilir.",
    actionLabel: "Bildirimlere Bak",
    actionRoute: "/notifications",
    measures: ["Son giriş tarihi", "Son 7 gün aktif gün sayısı", "Gelen işleri görüntüleme"],
  },
  {
    id: "balance",
    title: "Bakiye durumu",
    icon: "wallet",
    maxPoints: 10,
    currentPoints: 7,
    status: "Geliştirilebilir",
    currentValue: "Bakiye düşük",
    targetValue: "İş alabilecek seviyede bakiye",
    description: "Bakiyenin bitmesi, sana uygun işleri kaçırmana neden olabilir. İş fırsatlarında kesinti yaşamamak için bakiyeni bitmeden yenile.",
    actionLabel: "Bakiye Yükle",
    actionRoute: "/wallet",
    measures: ["Mevcut bakiye", "Önerilen minimum bakiye", "Bakiye bitmeden yükleme davranışı"],
  },
  {
    id: "subscription",
    title: "Abonelik durumu",
    icon: "crown",
    maxPoints: 5,
    currentPoints: 5,
    status: "Güçlü",
    currentValue: "Ücretli abonelik 3. seviye",
    targetValue: "En fazla 5 puan",
    description: "Ücretli abonelikler ek avantaj sağlar; performans skorunun yalnız küçük bir bölümünü etkiler.",
    actionLabel: "Aboneliği İncele",
    actionRoute: "/subscription",
    measures: ["Ücretsiz: 0 puan", "1. seviye: +2 puan", "2. seviye: +3 puan", "3. seviye: +5 puan"],
  },
];

export const priorityPerformanceActions = [
  {
    id: "more_reviews",
    title: "Müşteri yorumlarını artır",
    icon: "star",
    currentValue: "Son 10 işte 2 yorum",
    targetValue: "En az 5 yorum",
    impact: 3,
    actionLabel: "Yorum İste",
    actionRoute: "/reviews",
  },
  {
    id: "faster_response",
    title: "Daha hızlı dönüş yap",
    icon: "zap",
    currentValue: "Ortalama 18 dakika",
    targetValue: "5 dakika altı",
    impact: 2,
    actionLabel: "Bildirimleri Aç",
    actionRoute: "/notification-settings",
  },
  {
    id: "ready_balance",
    title: "Bakiyeni kesintisiz tut",
    icon: "wallet",
    currentValue: "Bakiye düşük",
    targetValue: "İş alabilecek seviyede bakiye",
    impact: 1,
    actionLabel: "Bakiye Yükle",
    actionRoute: "/wallet",
  },
];

export const performanceBenefits = [
  "Sana uygun işlerde daha güçlü görünürsün.",
  "Müşteri güvenini artıran bilgiler öne çıkar.",
  "İş fırsatlarını kaçırma ihtimalin azalır.",
  "Profilin benzer partnerlere göre daha iyi değerlendirilir.",
  "Kampanya ve fırsatlardan daha avantajlı yararlanabilirsin.",
];

export function clampScore(value, max = performanceScoreConfig.maxScore) {
  return Math.max(0, Math.min(max, Number(value) || 0));
}

export function calculateCriteriaTotal(criteria = performanceCriteria) {
  return criteria.reduce((total, item) => total + clampScore(item.currentPoints, item.maxPoints), 0);
}

export function calculateCriteriaMax(criteria = performanceCriteria) {
  return criteria.reduce((total, item) => total + item.maxPoints, 0);
}

export function calculateRemainingToTarget(score, target = performanceScoreConfig.targetScore) {
  return Math.max(0, target - clampScore(score));
}

export function calculateProgressPercent(score, max = performanceScoreConfig.maxScore) {
  return Math.round((clampScore(score, max) / max) * 100);
}

export function getCriterionStatus(currentPoints, maxPoints) {
  const ratio = maxPoints > 0 ? currentPoints / maxPoints : 0;
  if (ratio >= 0.85) return "Güçlü";
  if (ratio >= 0.7) return "İyi";
  if (ratio >= 0.45) return "Geliştirilebilir";
  return "Eksik";
}
