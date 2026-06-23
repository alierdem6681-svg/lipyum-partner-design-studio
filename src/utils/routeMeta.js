import { BOTTOM_TABS, ROUTE_TITLES, ROUTE_TO_SCREEN } from "./constants.js";

const titleOverrides = {
  "/profile": {
    title: "Profilim",
    subtitle: "Profil ve hesap ayarların",
    trailingActions: ["profile-preview"],
  },
  "/about": {
    title: "Hakkımda",
    subtitle: "Müşterilere görünen tanıtım bilgilerin",
  },
  "/photo-gallery": {
    title: "Fotoğraflarım",
    subtitle: "Profil fotoğrafları ve iş galerin",
  },
  "/services": {
    title: "Hizmet Alanları",
    subtitle: "Hangi hizmette hangi mod açık",
  },
  "/regions": {
    title: "Hizmet Bölgeleri",
    subtitle: "İlçe bazlı iş alma ayarların",
  },
  "/working-hours": {
    title: "Çalışma Planım",
    subtitle: "Müsait olduğun gün ve saatleri yönet",
  },
  "/team": {
    title: "Ekibim",
    subtitle: "Ekip ve çalışan bilgilerin",
  },
  "/capacity": {
    title: "İş Alma Kapasitesi",
    subtitle: "Bugün kaç iş alabileceğini gir",
  },
  "/strategy": {
    title: "Stratejim",
    subtitle: "Büyüme ve görünürlük hedeflerin",
  },
  "/jobs": {
    title: "İş Al",
    compactTitle: "İş Al",
    subtitle: "",
  },
  "/my-jobs": {
    title: "İşler",
    compactTitle: "İşler",
    subtitle: "",
  },
  "/calendar": {
    title: "Randevu",
    compactTitle: "Randevu",
    subtitle: "",
  },
  "/referral": {
    title: "Partner Davet Programı",
    compactTitle: "Partner Davet",
    subtitle: "Davet ettiğin partnerlerin yüklemelerinden %3 bonus kazan",
    infoSheet: {
      title: "Partner Davet Programı",
      description: "Davet et, iş aldır, pasif bonus kazan.",
      body: "Davet ettiğin partner aynı cep numarasıyla kayıt olur. İlk işini aldığında bonus açılır. Aktif kaldıkça bakiye yüklemelerinden pasif bonus kazanırsın.",
      scoreItems: [
        { label: "Kayıt et", value: "100 TL", description: "Partner aynı cep numarasıyla kayıt olduğunda ilk bonus takip edilir.", tone: "positive", icon: "users" },
        { label: "İş aldır", value: "500 TL", description: "Partner ilk işini alınca ikinci ödül açılır.", tone: "positive", icon: "briefcase" },
        { label: "Bakiye yüklet", value: "%3", description: "Her bakiye yüklemesinden pasif bonus kazanırsın.", tone: "positive", icon: "wallet" },
      ],
      note: "Bu program aktif partner ağı kurman için tasarlandı. Partner çalıştıkça kazanç fırsatın devam eder.",
    },
  },
  "/referral/tasks": {
    title: "Referral Görevleri",
    compactTitle: "Görevler",
    subtitle: "Davet görevlerini takip et",
    parentRoute: "/referral",
  },
  "/referral/partners": {
    title: "Davet Ettiğin Partnerler",
    compactTitle: "Partnerler",
    subtitle: "Referral altındaki partner listesi",
    parentRoute: "/referral",
  },
  "/notifications": {
    title: "Bildirimler",
    subtitle: "Önemli gelişmeler için bildirimleri takip et",
    trailingActions: ["notification-settings"],
  },
  "/support": {
    title: "Yardım ve Destek",
    subtitle: "Sorununu seç, hızlıca çözelim",
  },
  "/support/new": {
    title: "Talep Oluştur",
    subtitle: "Sorununu seç, hızlıca takip edelim",
  },
  "/support/live": {
    title: "Canlı Destek",
    subtitle: "Temsilciyle hızlıca görüş",
  },
  "/support/customer-service": {
    title: "Müşteri Hizmetleri",
    subtitle: "Telefon ve destek kanalları",
  },
  "/reviews": {
    title: "Müşteri Yorumları",
    subtitle: "Değerlendirme ve geri bildirimler",
    infoSheet: {
      title: "Müşteri yorumları",
      description: "Hızlı yanıt, daha güçlü güven.",
      body: "",
      scoreItems: [
        { label: "Kısa yaz", value: "1-2 cümle", description: "Müşterinin konusuna net cevap ver.", tone: "positive", icon: "message" },
        { label: "Nazik kal", value: "Güven", description: "Savunma yapma; çözüm dilini koru.", tone: "positive", icon: "shield" },
        { label: "İyi yorumu büyüt", value: "5★", description: "Olumlu yorum profil güvenini artırır.", tone: "positive", icon: "star" },
        { label: "Düzenli yanıtla", value: "Takip", description: "Yanıtlanan yorumlar karar vermeyi kolaylaştırır.", tone: "positive", icon: "trend-up" },
      ],
      note: "Amaç müşteriye hızlıca güven vermek. Uzun açıklama yerine net ve sakin yanıt kullan.",
    },
  },
  "/leaderboard": {
    title: "Liderlik Tablosu",
    subtitle: "8-14 Haziran 2026 haftası",
    infoSheet: {
      title: "Liderlik tablosu",
      description: "Haftanın Liderleri Nasıl Belirlenir?",
      body: "Puanlama sistemi kapanmış haftanın performansına göre hesaplanır. İş alma, teklif verme, müşteri deneyimi ve bakiye sürekliliği birlikte değerlendirilir.",
      scoreItems: [
        { label: "Tamamlanan iş", value: "+10 puan", description: "Müşteriyle tamamlanan her iş sıralamana katkı sağlar.", tone: "positive" },
        { label: "Teklif verme", value: "+10 puan", description: "Aktif tekliflerin haftalık hareketliliğini güçlendirir.", tone: "positive" },
        { label: "Havuzdan iş alma", value: "+10 puan", description: "Havuzdaki fırsatları değerlendirmen puanını artırır.", tone: "positive" },
        { label: "İptal iş", value: "-3 puan", description: "İptaller net haftalık puana düşük oranda yansır.", tone: "negative" },
        { label: "Müşteri şikayeti", value: "-5 puan", description: "Şikayet kayıtları müşteri deneyimi skorunu etkiler.", tone: "negative" },
        { label: "Bakiye durumu", value: "-10 puan", description: "Bakiye bitmesine rağmen 24 saatten uzun süre yüklenmediğinde puanın etkilenir.", tone: "negative" },
      ],
      note: "Puanlar haftalık güncellenir; amaç aktif, güvenilir ve düzenli hizmet veren partnerleri öne çıkarmaktır.",
    },
  },
  "/subscription": {
    title: "Abonelik",
    subtitle: "Daha güçlü görün, desteğe daha hızlı ulaş.",
    trailingActions: [],
    ctaVariant: "hidden",
    showBottomBar: false,
  },
  "/subscription/compare": {
    title: "Planları Karşılaştır",
    subtitle: "Plus, Gold veya VIP'i doğrudan seç.",
    parentRoute: "/subscription",
    trailingActions: [],
    ctaVariant: "hidden",
    showBottomBar: false,
  },
  "/subscription/checkout": {
    title: "Satın Almayı Onayla",
    subtitle: "Plan ve ödeme bilgilerini kontrol et.",
    parentRoute: "/subscription",
    trailingActions: [],
    ctaVariant: "hidden",
    showBottomBar: false,
  },
  "/wallet": {
    title: "Cüzdan",
    compactTitle: "Cüzdan",
    subtitle: "",
    trailingActions: ["account-transactions"],
  },
  "/job-referral": {
    title: "İş Yönlendirme Programı",
    subtitle: "Servis talebi gönder, iş gerçekleşirse kazanç elde et",
  },
  "/referral-earnings": {
    title: "Kazançlarım",
    subtitle: "Bonus kazanç geçmişi ve detayları",
  },
  "/performance-score": {
    title: "Daha Fazla İş Al",
    subtitle: "Puanını yükselt, daha fazla iş fırsatı gör.",
    trailingActions: [],
  },
  "/performance-score/task/job-result": {
    title: "İş Bilgilerini Gir",
    subtitle: "Tamamlayınca puanın hemen güncellenir.",
    parentRoute: "/performance-score",
    trailingActions: [],
  },
  "/performance-score/tasks": {
    title: "Tüm Görevler",
    subtitle: "En kolay ve yüksek puanlı işler üstte.",
    parentRoute: "/performance-score",
    trailingActions: [],
  },
  "/performance-score/details": {
    title: "Puanın Nasıl Hesaplanır?",
    subtitle: "Toplam 100 puan üzerinden hesaplanır.",
    parentRoute: "/performance-score",
    trailingActions: [],
  },
  "/performance-score/success": {
    title: "Görev Tamamlandı",
    subtitle: "Yaptığın işlem puanına eklendi.",
    parentRoute: "/performance-score",
    trailingActions: [],
  },
  "/performance-improve": {
    title: "Daha Fazla İş Al",
    subtitle: "Puanını yükselt, daha fazla iş fırsatı gör.",
    trailingActions: [],
  },
  "/customer-management": {
    title: "Müşteri Yönetimi",
    subtitle: "",
    trailingActions: [],
  },
  "/account-transactions": {
    title: "Hesap Hareketleri",
    subtitle: "",
    trailingActions: [],
  },
  "/digital-service-form": {
    title: "Dijital Servis Formu",
    subtitle: "",
    trailingActions: [],
  },
  "/create-offer": {
    title: "Teklif Oluştur",
    subtitle: "",
    trailingActions: [],
  },
  "/partner-card-preview": {
    title: "Partner Kartı",
    subtitle: "Public rozet ve paylaşım önizlemesi",
    trailingActions: ["partner-share"],
  },
};

const bottomTabByRoute = new Map(BOTTOM_TABS.map((item) => [item.route, item.id]));

export const routeMeta = Object.fromEntries(
  Object.keys(ROUTE_TO_SCREEN).map((route) => {
    const isHome = route === "/home";
    const isBottomRoute = bottomTabByRoute.has(route);
    const defaultTitle = ROUTE_TITLES[route] || "Lipyum Partner";
    const override = titleOverrides[route] || {};

    return [
      route,
      {
        route,
        screen: ROUTE_TO_SCREEN[route],
        title: override.title || defaultTitle,
        compactTitle: override.compactTitle || defaultTitle,
        subtitle: override.subtitle || "",
        headerVariant: isHome ? "home" : isBottomRoute ? "section" : "subpage",
        leadingAction: isHome || isBottomRoute ? "hamburger" : "back",
        trailingActions: override.trailingActions || (isHome || isBottomRoute ? ["notifications", "profile"] : ["info"]),
        infoSheet: override.infoSheet || null,
        showBottomBar: override.showBottomBar ?? true,
        activeBottomTab: bottomTabByRoute.get(route) || null,
        ctaVariant: override.ctaVariant || (isHome ? "home" : "subpage"),
        parentRoute: override.parentRoute || (route === "/home" ? null : "/home"),
        showProfile: isHome || isBottomRoute,
        showNotification: isHome || isBottomRoute,
        showInfo: !(isHome || isBottomRoute),
      },
    ];
  }),
);

export function getRouteMeta(route = "/home") {
  if (route.startsWith("/referral/partner/")) {
    return {
      ...routeMeta["/referral/partners"],
      route,
      title: "Partner Detayı",
      compactTitle: "Partner Detayı",
      subtitle: "Davet edilen partner özeti",
      parentRoute: "/referral/partners",
    };
  }
  return routeMeta[route] || routeMeta["/home"];
}
