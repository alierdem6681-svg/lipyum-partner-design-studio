import { BOTTOM_TABS, ROUTE_TITLES, ROUTE_TO_SCREEN } from "./constants.js";

const titleOverrides = {
  "/profile": {
    title: "Profilim",
    subtitle: "Profil ve hesap ayarların",
    trailingActions: ["profile-settings"],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/about": {
    title: "Hakkımızda",
    subtitle: "",
    trailingActions: ["about-edit"],
  },
  "/verifications": {
    title: "Doğrulamalar",
    subtitle: "Kimlik, iletişim ve hesap kontrollerin",
  },
  "/photo-gallery": {
    title: "Fotoğraflarım",
    subtitle: "Profil, iş yeri ve hizmet fotoğrafların",
  },
  "/verifications": {
    title: "Doğrulamalar",
    subtitle: "Kimlik ve iletişim bilgilerini doğrula",
  },
  "/services": {
    title: "Hizmetlerim",
    subtitle: "",
    trailingActions: ["services-edit"],
  },
  "/regions": {
    title: "Bölgelerim",
    subtitle: "İş almak istediğin bölgeleri yönet.",
    trailingActions: ["regions-settings"],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/working-hours": {
    title: "Çalışma Saatlerim",
    subtitle: "Müşterilerin sana ulaşabileceği saatleri belirle.",
    trailingActions: ["working-hours-settings"],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/team": {
    title: "Ekibim",
    subtitle: "Ekiplerini ve üyelerini tek yerden yönet.",
    trailingActions: ["team-add"],
  },
  "/capacity": {
    title: "Kapasitem",
    subtitle: "Günde kaç iş alabileceğini belirle.",
    trailingActions: ["capacity-settings"],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/strategy": {
    title: "Strateji",
    subtitle: "İş alma önceliğini ve maliyet dengesini seç.",
    trailingActions: ["strategy-settings"],
    showBottomBar: false,
    ctaVariant: "hidden",
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
    subtitle: "Hizmetlerini randevuya aç",
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
    title: "Destek Talebi",
    subtitle: "Konunu seç, doğru ekibe hızlıca iletelim.",
    trailingActions: ["support-headset"],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/support/new": {
    title: "Destek Talebi",
    subtitle: "Konunu seç, doğru ekibe hızlıca iletelim.",
    trailingActions: ["support-headset"],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/support/tickets": {
    title: "Destek Taleplerim",
    subtitle: "Açık ve geçmiş taleplerini takip et.",
    trailingActions: ["support-filter"],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/support/live": {
    title: "Canlı Destek",
    subtitle: "",
    trailingActions: [],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/support/customer-service": {
    title: "Müşteri Hizmetleri",
    subtitle: "Plus, Gold ve VIP üyelerine özel",
    trailingActions: ["customer-service-crown"],
    showBottomBar: false,
    ctaVariant: "hidden",
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
  "/management-panel": {
    title: "Yönetim Paneli",
    compactTitle: "Yönetim",
    subtitle: "Onay, fırsat, pilot ve sistem akışı",
    trailingActions: ["info"],
    infoSheet: {
      title: "Yönetim paneli",
      description: "Kritik iş akışlarını tek ekranda takip et.",
      body: "Bu ekran onay bekleyen aksiyonları, günlük görevleri, raporları ve sistem güvenlik durumunu mobil kullanım için sıkı ve okunabilir bir yapıda toplar.",
      scoreItems: [
        { label: "Onaylar", value: "Kontrol", description: "Canlıya alınacak adımlar önce burada görünür.", tone: "positive", icon: "check" },
        { label: "Fırsatlar", value: "Kâr", description: "Net kâr etkisi yüksek iş fırsatları öne çıkar.", tone: "positive", icon: "trend-up" },
        { label: "Güvenlik", value: "Kapı", description: "Riskli aksiyonlar otomatik uygulanmaz.", tone: "neutral", icon: "shield" },
      ],
    },
  },
  "/subscription": {
    title: "Abonelik",
    subtitle: "Daha güçlü görün, desteğe daha hızlı ulaş.",
    trailingActions: ["subscription-status"],
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
  "/invoices": {
    title: "Faturalarım",
    subtitle: "",
    trailingActions: [],
  },
  "/wallet": {
    title: "Cüzdan",
    compactTitle: "Cüzdan",
    subtitle: "Bakiyeni ve bonuslarını yönet.",
    trailingActions: ["notifications"],
  },
  "/wallet/top-up": {
    title: "Bakiye Yükle",
    compactTitle: "Bakiye Yükle",
    subtitle: "Tutarı seç, bonusunu kullan, özetini gör.",
    parentRoute: "/wallet",
    trailingActions: [],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/wallet/top-up/success": {
    title: "Bakiye Yüklendi",
    compactTitle: "Bakiye Yüklendi",
    subtitle: "İş bakiyen güncellendi.",
    parentRoute: "/wallet",
    trailingActions: [],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/wallet/history": {
    title: "Cüzdan Hareketleri",
    compactTitle: "Hareketler",
    subtitle: "Yükleme, iş alımı, bonus ve iadeler",
    parentRoute: "/wallet",
    trailingActions: [],
    activeBottomTab: "wallet",
  },
  "/wallet/settings": {
    title: "Cüzdan Ayarları",
    compactTitle: "Ayarlar",
    subtitle: "Uyarı, otomatik yükleme ve bonus kuralları",
    parentRoute: "/wallet",
    trailingActions: [],
    activeBottomTab: "wallet",
  },
  "/job-referral": {
    title: "İş Yönlendirme Programı",
    subtitle: "İş gönder, kazancı sen al",
    subtitleIcon: "wallet",
    infoSheet: {
      title: "İş Yönlendirme Programı",
      description: "İşi sen gönder, kazancı sen takip et.",
      body: "Elinde işi olan kişi veya firmalar müşteri talebini Lipyum'a gönderir. İş satışı tamamlandığında kazanç, kesinleşen kazanç ve çekilebilir bakiye olarak takip edilir.",
      scoreItems: [
        { label: "İşi gönder", value: "1 dk", description: "Müşteri, sektör ve şehir bilgisini adım adım gir.", tone: "positive", icon: "send" },
        { label: "Eşleşme başlar", value: "Hızlı", description: "Talep uygun hizmet ve bölgeye göre işleme alınır.", tone: "positive", icon: "briefcase" },
        { label: "Kazancını takip et", value: "TL", description: "Tamamlanan satıştan doğan kazanç bakiyene yansır.", tone: "positive", icon: "wallet" },
      ],
      note: "Site yöneticileri, pazarlamacılar, çağrı ekipleri, asist firmaları ve ek iş yapmak isteyenler için ek kazanç kanalıdır.",
    },
  },
  "/referral-earnings": {
    title: "Kazançlarım",
    subtitle: "Bonus kazanç geçmişi ve detayları",
  },
  "/performance-score": {
    title: "Performansımı Artır",
    subtitle: "Daha çok iş al, daha az öde!",
    subtitleIcon: "trophy",
    trailingActions: ["performance-rewards"],
    showBottomBar: false,
    ctaVariant: "hidden",
  },
  "/performance-improve": {
    title: "Performansımı Artır",
    subtitle: "Daha çok iş al, daha az öde!",
    subtitleIcon: "trophy",
    trailingActions: ["performance-rewards"],
    showBottomBar: false,
    ctaVariant: "hidden",
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
    title: "Profil Kartı",
    subtitle: "Bilgiler, rozetler ve daha fazlası",
    trailingActions: ["partner-share"],
    showBottomBar: false,
    ctaVariant: "hidden",
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
        subtitleIcon: override.subtitleIcon || "",
        headerVariant: isHome ? "home" : isBottomRoute ? "section" : "subpage",
        leadingAction: isHome || isBottomRoute ? "hamburger" : "back",
        trailingActions: override.trailingActions || (isHome || isBottomRoute ? ["notifications", "profile"] : ["info"]),
        infoSheet: override.infoSheet || null,
        showBottomBar: override.showBottomBar ?? true,
        activeBottomTab: override.activeBottomTab || bottomTabByRoute.get(route) || null,
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
  if (route.startsWith("/wallet/transaction/")) {
    return {
      ...routeMeta["/wallet/history"],
      route,
      title: "İşlem Detayı",
      compactTitle: "İşlem Detayı",
      subtitle: "Cüzdan hareketinin ayrıntısı",
      parentRoute: "/wallet/history",
    };
  }
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
  if (route.startsWith("/support/tickets/")) {
    return {
      ...routeMeta["/support/tickets"],
      route,
      title: "Talep Detayı",
      compactTitle: "Talep Detayı",
      subtitle: "Talep durumunu ve yanıtları takip et.",
      parentRoute: "/support/tickets",
      trailingActions: [],
      showBottomBar: false,
      ctaVariant: "hidden",
    };
  }
  if (route.startsWith("/support/success/")) {
    return {
      ...routeMeta["/support"],
      route,
      title: "Talep Oluşturuldu",
      compactTitle: "Talep Oluşturuldu",
      subtitle: "Destek ekibimiz konuyu incelemeye başladı.",
      parentRoute: "/support/tickets",
      trailingActions: ["support-headset"],
      showBottomBar: false,
      ctaVariant: "hidden",
    };
  }
  return routeMeta[route] || routeMeta["/home"];
}
