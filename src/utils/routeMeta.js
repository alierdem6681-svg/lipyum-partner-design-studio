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
    subtitle: "Telefonla öncelikli destek",
  },
  "/reviews": {
    title: "Müşteri Yorumları",
    subtitle: "Değerlendirme ve geri bildirimler",
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
    title: "Aboneliğim",
    subtitle: "Gold, Pro ve VIP avantajlarını yönet",
  },
  "/wallet": {
    title: "Cüzdan",
    compactTitle: "Cüzdan",
    subtitle: "",
    trailingActions: ["wallet-info"],
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
    title: "Performans Skoru",
    subtitle: "İş görünürlüğünü etkileyen kalite özeti",
  },
  "/performance-improve": {
    title: "Performansımı Artır",
    subtitle: "Skorunu yükselten kriterleri takip et",
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
        showBottomBar: true,
        activeBottomTab: bottomTabByRoute.get(route) || null,
        ctaVariant: "subpage",
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
