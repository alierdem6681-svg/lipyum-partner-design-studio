const profileActions = [
  { label: "Paylaş", icon: "share", type: "sheet", title: "Profil paylaşımı", body: "Partner profil linki kopyalandı ve paylaşım seçenekleri hazırlandı." },
  { label: "Önizle", icon: "eye", type: "route", route: "/partner-card-preview" },
];

const profileBadges = [
  "Gold Partner",
  "Hızlı Yanıt",
  "4.8 Puan",
  "126 Değerlendirme",
  "VIP Bölge",
  "Rozetli Ekip",
];

const content = {
  "/profile": {
    group: "profile",
    title: "Profilim",
    lead: "Partner kartı, görünürlük ve güven sinyalleri tek yerden yönetilir.",
    metrics: [
      { label: "Profil skoru", value: "81", icon: "trend-up" },
      { label: "Rozet", value: "6", icon: "badge-check" },
      { label: "Görünürlük", value: "Yüksek", icon: "eye" },
    ],
    actions: profileActions,
    profileCard: true,
    badges: profileBadges,
    sections: [
      {
        title: "Profil menüsü",
        items: [
          { title: "Hakkımızda", body: "Kısa tanıtım, uzmanlık ve hizmet yaklaşımı.", icon: "user", route: "/about" },
          { title: "Fotoğraflarım", body: "İş öncesi ve sonrası görseller.", icon: "image", route: "/photo-gallery" },
          { title: "Hizmetlerim", body: "Aktif hizmet kategorileri.", icon: "briefcase", route: "/services" },
          { title: "Bölgelerim", body: "Çalışılan ilçe ve mahalleler.", icon: "map-pin", route: "/regions" },
          { title: "Saatlerim", body: "Uygun çalışma saatleri.", icon: "clock", route: "/working-hours" },
          { title: "Ekibim", body: "Saha ekibi ve görev dağılımı.", icon: "users", route: "/team" },
          { title: "Kapasitem", body: "Günlük iş alma kapasitesi.", icon: "bar-chart", route: "/capacity" },
          { title: "Stratejim", body: "Büyüme hedefleri ve öneriler.", icon: "target", route: "/strategy" },
        ],
      },
    ],
  },
  "/about": {
    group: "profile",
    title: "Hakkımızda",
    lead: "Müşteriye gösterilen kısa tanıtım ve uzmanlık alanları.",
    metrics: [
      { label: "Deneyim", value: "8 yıl", icon: "award" },
      { label: "Tamamlanan iş", value: "412", icon: "briefcase" },
    ],
    sections: [
      {
        title: "Tanıtım",
        items: [
          { title: "Ahmet Kaya", body: "Beyaz eşya, klima ve küçük ev aletleri servisinde uzman partner.", icon: "user" },
          { title: "Güven notu", body: "Zamanında varış, net fiyatlama ve iş sonrası kontrol odaklı çalışma.", icon: "shield" },
        ],
      },
    ],
  },
  "/photo-gallery": {
    group: "profile",
    title: "Fotoğraflarım",
    lead: "Referans görselleri ve saha kanıtları.",
    filters: ["Tümü", "Öncesi", "Sonrası", "Ekip"],
    sections: [
      {
        title: "Galeri",
        items: [
          { title: "Klima bakım öncesi", body: "Filtre ve iç ünite kontrolü.", icon: "image", action: "preview-photo" },
          { title: "Klima bakım sonrası", body: "Temiz hava çıkışı ve ölçüm sonucu.", icon: "image", action: "preview-photo" },
          { title: "Ekipman düzeni", body: "Saha çantası ve güvenlik ekipmanı.", icon: "image", action: "preview-photo" },
        ],
      },
    ],
  },
  "/services": {
    group: "profile",
    title: "Hizmetlerim",
    lead: "Aktif hizmet kategorileri ve görünürlük öncelikleri.",
    metrics: [
      { label: "Aktif hizmet", value: "12", icon: "briefcase" },
      { label: "Öne çıkan", value: "4", icon: "star" },
    ],
    sections: [
      {
        title: "Hizmet listesi",
        items: [
          { title: "Klima bakım", body: "Montaj, bakım ve arıza tespiti.", icon: "wind" },
          { title: "Buzdolabı tamiri", body: "Soğutma, termostat ve kart kontrolü.", icon: "snowflake" },
          { title: "Çamaşır makinesi", body: "Pompa, kazan ve elektrik arıza kontrolü.", icon: "settings" },
        ],
      },
    ],
  },
  "/regions": {
    group: "profile",
    title: "Bölgelerim",
    lead: "İş kabul edilen bölgeler ve öncelik sırası.",
    filters: ["Tümü", "Ana bölge", "Yakın ilçe"],
    sections: [
      {
        title: "Aktif bölgeler",
        items: [
          { title: "Ümraniye", body: "Ana bölge, hızlı ulaşım.", icon: "map-pin" },
          { title: "Ataşehir", body: "Yakın ilçe, öğleden sonra uygun.", icon: "map-pin" },
          { title: "Çekmeköy", body: "Planlı randevu ile kabul.", icon: "map-pin" },
        ],
      },
    ],
  },
  "/working-hours": {
    group: "profile",
    title: "Saatlerim",
    lead: "Randevu ve iş kabul saatleri.",
    sections: [
      {
        title: "Haftalık plan",
        items: [
          { title: "Hafta içi", body: "09:00 - 19:00", icon: "clock" },
          { title: "Cumartesi", body: "10:00 - 16:00", icon: "clock" },
          { title: "Acil işler", body: "Uygunluk durumuna göre kabul edilir.", icon: "zap" },
        ],
      },
    ],
  },
  "/team": {
    group: "profile",
    title: "Ekibim",
    lead: "Saha ekip üyeleri ve görev rolleri.",
    sections: [
      {
        title: "Ekip",
        items: [
          { title: "Ahmet Kaya", body: "Usta partner", icon: "user" },
          { title: "Mehmet A.", body: "Yardımcı teknisyen", icon: "user" },
          { title: "Planlama", body: "Randevu ve bölge koordinasyonu.", icon: "calendar" },
        ],
      },
    ],
  },
  "/capacity": {
    group: "profile",
    title: "Kapasitem",
    lead: "Günlük iş alma kapasitesi ve uygunluk.",
    metrics: [
      { label: "Bugün", value: "3 iş", icon: "briefcase" },
      { label: "Haftalık", value: "18 iş", icon: "calendar" },
    ],
    sections: [
      {
        title: "Kapasite notları",
        items: [
          { title: "Yoğun bölge", body: "Ümraniye ve Ataşehir öncelikli.", icon: "map-pin" },
          { title: "Yedek zaman", body: "Acil işler için günde 1 slot tutulur.", icon: "clock" },
        ],
      },
    ],
  },
  "/strategy": {
    group: "profile",
    title: "Stratejim",
    lead: "Skor ve iş alma performansını artıran öneriler.",
    sections: [
      {
        title: "Önerilen adımlar",
        items: [
          { title: "Fotoğraf ekle", body: "Son işlerden 3 yeni görsel yükle.", icon: "image" },
          { title: "Bölge netleştir", body: "En hızlı ulaşabildiğin 2 ilçeyi öne çıkar.", icon: "map-pin" },
          { title: "Yanıt süresi", body: "Tekliflere 10 dakika içinde dönüş hedefle.", icon: "timer" },
        ],
      },
    ],
  },
  "/account-settings": {
    group: "profile",
    title: "Hesap Ayarları",
    lead: "Hesap güvenliği ve temel ayarlar.",
    sections: [
      {
        title: "Ayarlar",
        items: [
          { title: "Giriş bilgileri", body: "E-posta ve telefon doğrulama durumu.", icon: "lock" },
          { title: "Dil ve görünüm", body: "Uygulama dili ve ekran tercihi.", icon: "settings" },
        ],
      },
    ],
  },
  "/notification-settings": {
    group: "profile",
    title: "Bildirim Ayarları",
    lead: "İş, teklif ve destek bildirimleri.",
    sections: [
      {
        title: "Bildirim tercihleri",
        items: [
          { title: "Yeni iş bildirimi", body: "Anlık bildirim açık.", icon: "bell" },
          { title: "Teklif sonucu", body: "E-posta ve uygulama içi bildirim açık.", icon: "mail" },
        ],
      },
    ],
  },
  "/contact-settings": {
    group: "profile",
    title: "İletişim Bilgileri",
    lead: "Müşteriye gösterilen iletişim bilgileri.",
    sections: [
      {
        title: "İletişim",
        items: [
          { title: "Telefon", body: "+90 555 000 00 00", icon: "phone" },
          { title: "E-posta", body: "partner@lipyum.com", icon: "mail" },
        ],
      },
    ],
  },
  "/partner-card-preview": {
    group: "profile",
    title: "Partner Kartı Önizleme",
    lead: "Müşterilerin göreceği güven kartı.",
    profileCard: true,
    badges: profileBadges,
    actions: [
      { label: "Embed kodunu kopyala", icon: "code", type: "sheet", title: "Embed kodu", body: "<iframe> kodu kopyalandı." },
      { label: "WhatsApp paylaş", icon: "message", type: "sheet", title: "WhatsApp paylaşımı", body: "Paylaşım bağlantısı hazırlandı." },
      { label: "QR mock", icon: "qr-code", type: "modal", title: "QR Önizleme", body: "QR mock akışı hazır." },
    ],
    sections: [
      {
        title: "Sosyal paylaşım",
        items: [
          { title: "Instagram", body: "Profil rozetini hikaye olarak paylaş.", icon: "share" },
          { title: "Facebook", body: "Partner kartı bağlantısını paylaş.", icon: "share" },
        ],
      },
    ],
  },
  "/notifications": {
    group: "support",
    title: "Bildirimler",
    lead: "İş, teklif ve destek gelişmeleri.",
    filters: ["Tümü", "Okunmamış", "İş", "Destek"],
    actions: [{ label: "Bildirim Ayarları", icon: "settings", type: "route", route: "/notification-settings" }],
    sections: [
      {
        title: "Son bildirimler",
        items: [
          { title: "Yeni teklif geldi", body: "Ümraniye klima bakım işi için teklif isteği.", icon: "bell" },
          { title: "Destek yanıtladı", body: "Açık talebine yeni mesaj geldi.", icon: "message" },
          { title: "Profil skoru arttı", body: "Yeni yorum skorunu yükseltti.", icon: "trend-up" },
        ],
      },
    ],
  },
  "/support": {
    group: "support",
    title: "Yardım ve Destek",
    lead: "Talep, canlı destek ve müşteri hizmetleri kanalları.",
    sections: [
      {
        title: "Destek kanalları",
        items: [
          { title: "Talep Oluştur", body: "Konu seçip yazılı talep bırak.", icon: "file-text", route: "/support/new" },
          { title: "Canlı Destek", body: "Müsait temsilciyle görüş.", icon: "message", route: "/support/live" },
          { title: "Müşteri Hizmetleri", body: "Telefon ve destek kanalları.", icon: "phone", route: "/support/customer-service" },
        ],
      },
    ],
  },
  "/support/new": {
    group: "support",
    title: "Talep Oluştur",
    lead: "",
    sections: [],
  },
  "/support/live": {
    group: "support",
    title: "Canlı Destek",
    lead: "",
    sections: [],
  },
  "/support/customer-service": {
    group: "support",
    title: "Müşteri Hizmetleri",
    lead: "",
    sections: [],
  },
  "/messages": {
    group: "support",
    title: "Mesaj Kutusu",
    lead: "Müşteri ve destek mesajları.",
    sections: [
      {
        title: "Konuşmalar",
        items: [
          { title: "Huzeyfe A.", body: "Bugünkü randevu için saat teyidi bekliyor.", icon: "message" },
          { title: "Lipyum Destek", body: "Talebin işleme alındı.", icon: "headphones" },
        ],
      },
    ],
  },
  "/satisfaction": {
    group: "support",
    title: "Memnuniyet",
    lead: "Müşteri memnuniyeti ve takip listesi.",
    metrics: [
      { label: "Ortalama", value: "4.8", icon: "star" },
      { label: "Yanıtlanan", value: "92%", icon: "check" },
    ],
    sections: [
      {
        title: "Takip",
        items: [
          { title: "Son iş araması", body: "İş sonrası memnuniyet kontrolü planlandı.", icon: "phone" },
          { title: "Yorum isteği", body: "Tamamlanan iş için yorum talebi gönder.", icon: "star" },
        ],
      },
    ],
  },
  "/reviews": {
    group: "growth",
    title: "Müşteri Yorumları",
    lead: "Yorumlar, puanlar ve görünürlük etkisi.",
    metrics: [
      { label: "Puan", value: "4.8", icon: "star" },
      { label: "Yorum", value: "126", icon: "message" },
    ],
    sections: [
      {
        title: "Öne çıkan yorumlar",
        items: [
          { title: "Çok hızlı destek", body: "Aynı gün gelip sorunu çözdü.", icon: "star" },
          { title: "Temiz işçilik", body: "İş sonrası alanı temiz bıraktı.", icon: "star" },
        ],
      },
    ],
  },
  "/leaderboard": {
    group: "growth",
    title: "Liderlik Tablosu",
    lead: "Bölgedeki performans sıralaması.",
    metrics: [
      { label: "Sıra", value: "#7", icon: "trophy" },
      { label: "Bölge", value: "Ümraniye", icon: "map-pin" },
    ],
    sections: [
      {
        title: "Sıralama",
        items: [
          { title: "Ahmet Kaya", body: "81 skor, Gold Partner.", icon: "trophy" },
          { title: "Mehmet U.", body: "78 skor, hızlı yanıt.", icon: "award" },
        ],
      },
    ],
  },
  "/referral": {
    group: "referral",
    title: "Partner Davet Programı",
    lead: "Davetlerinden bonus ve gelir fırsatı kazan.",
    actions: [{ label: "Davet Et", icon: "send", type: "sheet", title: "Davet bağlantısı", body: "Davet linki kopyalandı." }],
    sections: [
      {
        title: "Referral merkezi",
        items: [
          { title: "Görevler", body: "Davet görevlerini takip et.", icon: "check-square", route: "/referral/tasks" },
          { title: "Partner listesi", body: "Davet ettiğin partnerleri gör.", icon: "users", route: "/referral/partners" },
          { title: "Kazanç geçmişi", body: "Bonus ve gelir kayıtları.", icon: "wallet", route: "/referral-earnings" },
        ],
      },
    ],
  },
  "/partners": {
    group: "referral",
    title: "Davet Ettiğin Partnerler",
    lead: "Referral altındaki partner listesi.",
    filters: ["Tümü", "Aktif", "Beklemede"],
    sections: [
      {
        title: "Partnerler",
        items: [
          { title: "Hüseyfe A.", body: "Aktif partner, Ümraniye.", icon: "user", action: "partner-detail" },
          { title: "Murat K.", body: "Davet beklemede.", icon: "user", action: "partner-detail" },
        ],
      },
    ],
  },
  "/referral-earnings": {
    group: "referral",
    title: "Kazançlarım",
    lead: "Davet ve yönlendirme kazanç geçmişi.",
    metrics: [
      { label: "Toplam", value: "₺3.240", icon: "wallet" },
      { label: "Bu ay", value: "₺620", icon: "trend-up" },
    ],
    sections: [
      {
        title: "Geçmiş",
        items: [
          { title: "Hüseyfe A. bonusu", body: "₺240 referral bonusu.", icon: "gift" },
          { title: "İş yönlendirme", body: "₺180 yönlendirme kazancı.", icon: "briefcase" },
        ],
      },
    ],
  },
  "/job-referral": {
    group: "referral",
    title: "İş Yönlendirme Programı",
    lead: "Uygun işleri başka partnerlere yönlendir.",
    sections: [
      {
        title: "Yönlendirme akışı",
        items: [
          { title: "İş seç", body: "Uygun olmayan işi yönlendirme havuzuna taşı.", icon: "briefcase" },
          { title: "Partner eşleştir", body: "Bölge ve hizmete göre partner önerilir.", icon: "users" },
          { title: "Kazanç takip et", body: "Tamamlanan işten yönlendirme kazancı al.", icon: "wallet" },
        ],
      },
    ],
  },
  "/bonus": {
    group: "finance",
    title: "Bonus Cüzdanı",
    lead: "Kredi yüklerken kullanılabilen bonuslar.",
    metrics: [
      { label: "Bonus", value: "240", icon: "gift" },
      { label: "Kullanılabilir", value: "₺120", icon: "wallet" },
    ],
    sections: [
      {
        title: "Bonus hareketleri",
        items: [
          { title: "Referral bonusu", body: "120 bonus eklendi.", icon: "gift" },
          { title: "Yorum bonusu", body: "40 bonus eklendi.", icon: "star" },
        ],
      },
    ],
  },
  "/customers": {
    group: "finance",
    title: "Müşteri Defteri",
    lead: "Tekrar iş fırsatı olan müşteriler.",
    filters: ["Tümü", "Yeni", "Tekrar"],
    sections: [
      {
        title: "Müşteriler",
        items: [
          { title: "Huzeyfe A.", body: "Klima bakım müşterisi.", icon: "user" },
          { title: "Selin K.", body: "Buzdolabı tamiri sonrası takip.", icon: "user" },
        ],
      },
    ],
  },
  "/invoices": {
    group: "finance",
    title: "Faturalarım",
    lead: "",
    sections: [],
  },
  "/income-expense": {
    group: "finance",
    title: "Gelir Gider Takibi",
    lead: "Aylık gelir, gider ve net kazanç.",
    metrics: [
      { label: "Gelir", value: "₺18.400", icon: "trend-up" },
      { label: "Gider", value: "₺4.250", icon: "bar-chart" },
    ],
    sections: [
      {
        title: "Özet",
        items: [
          { title: "Net kazanç", body: "Bu ay ₺14.150.", icon: "wallet" },
          { title: "Yakıt gideri", body: "Aylık ₺1.240.", icon: "truck" },
        ],
      },
    ],
  },
  "/appointment-link": {
    group: "finance",
    title: "Randevu Linki",
    lead: "Müşterilerin randevu talebi gönderebildiği paylaşım linki.",
    actions: [{ label: "Linki Kopyala", icon: "copy", type: "sheet", title: "Randevu linki", body: "Randevu linki kopyalandı." }],
    sections: [
      {
        title: "Paylaşım",
        items: [
          { title: "WhatsApp", body: "Randevu linkini müşteriye gönder.", icon: "message" },
          { title: "Profil kartı", body: "Partner kartında link gösterilir.", icon: "user" },
        ],
      },
    ],
  },
};

content["/referral/tasks"] = {
  group: "referral",
  title: "Referral Görevleri",
  lead: "Davet performansını artıran görevler.",
  sections: [
    {
      title: "Görevler",
      items: [
        { title: "3 partner davet et", body: "Tamamlanınca 120 bonus.", icon: "users" },
        { title: "İlk işi tamamlat", body: "Ek yönlendirme kazancı.", icon: "check" },
      ],
    },
  ],
};

content["/referral/partners"] = content["/partners"];

export const activeRoutePaths = Object.keys(content);

export function getActiveRouteContent(route) {
  if (route?.startsWith("/referral/partner/")) {
    return {
      ...content["/partners"],
      title: "Partner Detayı",
      lead: "Davet edilen partnerin durum ve kazanç özeti.",
    };
  }
  return content[route] || null;
}
