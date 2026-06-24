import { BOTTOM_TABS, DRAWER_SECTIONS, PROFILE_MENU_ITEMS, ROUTE_TO_SCREEN } from "../utils/constants.js";

export const appRoutes = Object.keys(ROUTE_TO_SCREEN);
export const bottomTabs = BOTTOM_TABS;
export const drawerSections = DRAWER_SECTIONS;
export const profileMenuItems = PROFILE_MENU_ITEMS;

export const partnerProfile = {
  name: "Ahmet Kaya",
  tier: "Gold Partner",
  rating: "4.8",
  reviewCount: 126,
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=220&q=80",
  badges: [
    { label: "Güvenilir", icon: "shield" },
    { label: "Hızlı", icon: "zap" },
    { label: "Titiz", icon: "sparkles" },
    { label: "Çalışkan", icon: "briefcase" },
    { label: "Planlı", icon: "calendar" },
    { label: "Düzenli", icon: "check" },
    { label: "İlgili", icon: "message" },
    { label: "Samimi", icon: "star" },
    { label: "Enerjik", icon: "trend-up" },
  ],
};

export const profileStrength = {
  score: 82,
  title: "Profilini Güçlendir",
  subtitle: "Daha fazla iş almak için profilini tamamla.",
  tasks: [
    { label: "Tam boy fotoğraf ekle", done: true },
    { label: "Çalışma saatlerini güncelle", done: true },
    { label: "2 iş fotoğrafı daha ekle", done: false },
  ],
};

export const profileSettingsItems = [
  { label: "İletişim Bilgileri", icon: "phone", route: "/contact-settings", color: "#0e7490" },
  { label: "Hesap ve Güvenlik", icon: "shield", route: "/account-settings", color: "#175cd3" },
  { label: "Bildirim Ayarları", icon: "bell", route: "/notification-settings", color: "#16a34a" },
  { label: "Firma Bilgileri", icon: "briefcase", route: "/account-settings", color: "#667085" },
];

export const walletSummary = {
  credit: 675,
  bonus: 240,
  estimatedJobs: "2-3",
  lastTopUp: "12 Haz 2026",
  creditStatus: "Aktif",
};

export const notifications = [
  { id: "n1", title: "Yeni iş fırsatı hazır", description: "Karşıyaka’da klima arızası için müşteri hazır.", time: "2 dk önce", tone: "success", route: "/jobs", screen: "work", unread: true, actionLabel: "Gör" },
  { id: "n4", title: "Teklif bekleyen müşteri var", description: "15 kullanıcı fiyat teklifi bekliyor.", time: "6 dk önce", tone: "offer", route: "/jobs", screen: "work", unread: true, actionLabel: "Yanıtla" },
  { id: "n5", title: "Havuzda sana uygun işler var", description: "Bölgendeki 4 havuz işini incele.", time: "12 dk önce", tone: "info", route: "/jobs", screen: "work", unread: true, actionLabel: "İncele" },
  { id: "n2", title: "Bakiye düşük", description: "Yeni iş için kredi yüklemelisin.", time: "18 dk önce", tone: "warning", route: "/wallet", screen: "wallet", unread: true, actionLabel: "Bakiye Yükle" },
  { id: "n3", title: "Performans hedefin yakın", description: "85 puana ulaşmana çok az kaldı.", time: "31 dk önce", tone: "neutral", route: "/performance-score", screen: "performanceScore", unread: false, actionLabel: "Gör" },
  { id: "n6", title: "Destek kaydı güncellendi", description: "LP-28491 inceleme aşamasında.", time: "1 sa önce", tone: "neutral", route: "/support", screen: "support", unread: false, actionLabel: "İncele" },
  { id: "n7", title: "Yeni müşteri yorumu geldi", description: "Elif Y. servis deneyimini 5.0 puanladı.", time: "2 sa önce", tone: "success", route: "/reviews", screen: "reviews", unread: true, actionLabel: "Yanıtla" },
  { id: "n8", title: "Partner davetin ilerledi", description: "Bonus aşaması yaklaşıyor.", time: "3 sa önce", tone: "neutral", route: "/referral", screen: "referral", unread: false, actionLabel: "Gör" },
  { id: "n9", title: "Çalışma planı önerisi", description: "08:00-22:00 planını kontrol et.", time: "Bugün 09:20", tone: "neutral", route: "/working-hours", screen: "workPlan", unread: false, actionLabel: "Gör" },
  { id: "n10", title: "Bonus kullanım fırsatı", description: "Bonus kredi yüklerken kullanılır.", time: "Bugün 08:42", tone: "info", route: "/wallet", screen: "wallet", unread: false, actionLabel: "Gör" },
  { id: "n11", title: "Bölge hareketi arttı", description: "Yakındaki işler hareketlendi.", time: "Dün 18:15", tone: "neutral", route: "/home", screen: "home", unread: false, actionLabel: "İncele" },
  { id: "n12", title: "Liderlik sıralaması güncellendi", description: "Sektör ligindeki yerin değişti.", time: "Dün 15:10", tone: "neutral", route: "/leaderboard", screen: "levels", unread: false, actionLabel: "Gör" },
  { id: "n13", title: "Garanti formu hatırlatması", description: "Servis fişini oluşturabilirsin.", time: "Dün 11:06", tone: "neutral", route: "/my-jobs", screen: "jobs", unread: false, actionLabel: "Gör" },
  { id: "n14", title: "Fatura hareketi hazır", description: "Son işlem hesap hareketlerine eklendi.", time: "2 gün önce", tone: "neutral", route: "/wallet", screen: "wallet", unread: false, actionLabel: "İncele" },
  { id: "n15", title: "Profil görünürlüğü önerisi", description: "Profil kartını güçlendirecek önerileri incele.", time: "2 gün önce", tone: "neutral", route: "/profile", screen: "profile", unread: false, actionLabel: "Gör" },
  { id: "n16", title: "Yeni doğrudan iş geldi", description: "Serdivan’da çamaşır makinesi arızası bekliyor.", time: "2 gün önce", tone: "success", route: "/jobs", screen: "work", unread: false, actionLabel: "Gör" },
  { id: "n17", title: "Teklif süren dolmak üzere", description: "3 müşteri bugün fiyat teklifi bekliyor.", time: "2 gün önce", tone: "offer", route: "/jobs", screen: "work", unread: false, actionLabel: "Gör" },
  { id: "n18", title: "Yeni yorum yanıt bekliyor", description: "Murat K. yorumuna dönüş yapabilirsin.", time: "3 gün önce", tone: "success", route: "/reviews", screen: "reviews", unread: false, actionLabel: "Yanıtla" },
  { id: "n19", title: "Kredi yükleme tamamlandı", description: "250 kredi cüzdanına eklendi.", time: "3 gün önce", tone: "info", route: "/wallet", screen: "wallet", unread: false, actionLabel: "İncele" },
  { id: "n20", title: "Havuz işi kısa sürede alındı", description: "Bölgedeki hareketlilik artıyor.", time: "3 gün önce", tone: "info", route: "/jobs", screen: "work", unread: false, actionLabel: "Gör" },
  { id: "n21", title: "Partner daveti kayıt oldu", description: "Ahmet K. aynı numarayla kayıt oldu.", time: "4 gün önce", tone: "neutral", route: "/referral", screen: "referral", unread: false, actionLabel: "Gör" },
  { id: "n22", title: "Çalışma saati önerisi", description: "08:00-22:00 planı daha fazla iş getirebilir.", time: "4 gün önce", tone: "neutral", route: "/working-hours", screen: "workPlan", unread: false, actionLabel: "Gör" },
  { id: "n23", title: "Profil önerisi hazır", description: "Profilini güncel tutarak daha güvenilir görün.", time: "5 gün önce", tone: "neutral", route: "/profile", screen: "profile", unread: false, actionLabel: "Gör" },
  { id: "n24", title: "Destek mesajı geldi", description: "Danışman yanıtını mesaj kutusunda görebilirsin.", time: "5 gün önce", tone: "neutral", route: "/support", screen: "support", unread: false, actionLabel: "İncele" },
  { id: "n25", title: "Randevu linkin görüntülendi", description: "Bir müşteri QR bağlantını açtı.", time: "6 gün önce", tone: "neutral", route: "/appointment-link", screen: "appointmentLink", unread: false, actionLabel: "Gör" },
  { id: "n26", title: "Bölge istatistikleri yenilendi", description: "Bugünkü tamamlanan işler güncellendi.", time: "6 gün önce", tone: "neutral", route: "/home", screen: "home", unread: false, actionLabel: "İncele" },
  { id: "n27", title: "Profil gücü artabilir", description: "2 fotoğraf daha ekleyerek profili güçlendir.", time: "1 hafta önce", tone: "neutral", route: "/profile", screen: "profile", unread: false, actionLabel: "Gör" },
  { id: "n28", title: "Bonus kullanım hatırlatması", description: "Bonus kredi yüklerken kullanılabilir.", time: "1 hafta önce", tone: "info", route: "/wallet", screen: "wallet", unread: false, actionLabel: "Gör" },
  { id: "n29", title: "Servis fişi önerisi", description: "Tamamlanan iş için servis fişi oluştur.", time: "1 hafta önce", tone: "neutral", route: "/my-jobs", screen: "jobs", unread: false, actionLabel: "Gör" },
  { id: "n30", title: "Haftalık liderlik güncellendi", description: "Sıralamadaki konumun yenilendi.", time: "1 hafta önce", tone: "neutral", route: "/leaderboard", screen: "levels", unread: false, actionLabel: "Gör" },
];

export const supportQuickActions = [
  { title: "Talep Oluştur", description: "Konu seç, ekibimiz takip etsin", icon: "file-text", route: "/support/new", primary: true },
  { title: "Canlı Destek", description: "Temsilciyle hızlıca görüş", icon: "message", route: "/support/live", primary: true },
  { title: "İş İtirazı", description: "İşle ilgili bir sorun mu var?", icon: "file-text", topic: "İş İtirazı" },
  { title: "Ödeme Sorunu", description: "Ödemenizle ilgili yardım alın", icon: "credit-card", topic: "Ödeme Sorunu" },
  { title: "Bonus Sorunu", description: "Bonus ve kampanyalar", icon: "gift", topic: "Bonus Sorunu" },
  { title: "Müşteri Sorunu", description: "Müşteriyle ilgili bir problem mi var?", icon: "user", topic: "Müşteri Sorunu" },
  { title: "Teknik Sorun", description: "Uygulama veya teknik destek", icon: "settings", topic: "Teknik Sorun" },
];

export const supportInfoActions = [
  { title: "Sık Sorulan Sorular", description: "Merak ettiklerin için cevaplar burada", icon: "help-circle", label: "Sık Sorulan Sorular" },
  { title: "Açık Taleplerim", description: "Taleplerini takip et", icon: "clipboard", label: "Açık Taleplerim", badge: "3" },
];

export const referralPartners = [
  { id: "ahmet-kaya", name: "Ahmet Kaya", city: "İstanbul", status: "Kayıt olmalı", reward: "100 TL" },
  { id: "mehmet-yilmaz", name: "Mehmet Yılmaz", city: "Ankara", status: "Profili eksik", reward: "500 TL" },
  { id: "ayse-demir", name: "Ayşe Demir", city: "İzmir", status: "İş almalı", reward: "500 TL" },
  { id: "derya-aksoy", name: "Derya Aksoy", city: "Bursa", status: "Bakiye yüklet", reward: "%3" },
];

export const jobReferralProgram = {
  title: "İş Yönlendirme Programı",
  description: "Servis talebi gönder, iş gerçekleşirse kazanç elde et.",
  steps: [
    { title: "Müşteri bilgisini gir", description: "Talep sahibinin temel iletişim ve servis bilgisini ekle." },
    { title: "Lipyum işi doğrular", description: "Ekip talebi kontrol eder ve uygun hizmet akışına alır." },
    { title: "Uygun partner işi yapar", description: "Bölgede müsait partner işi üstlenir ve süreci tamamlar." },
    { title: "İş gerçekleşince kazan", description: "Tamamlanan işten bonus, nakit veya komisyon kazancı oluşur." },
  ],
  earnings: [
    { title: "Bonus", description: "Tamamlanan yönlendirmeler bonus kazandırabilir.", icon: "gift" },
    { title: "Nakit", description: "Uygun kampanyalarda nakit kazanç oluşabilir.", icon: "wallet" },
    { title: "Komisyon", description: "İş bedeline göre komisyon modeli uygulanabilir.", icon: "trend-up" },
  ],
};

export const walletTransactions = [
  { id: "w1", type: "credit-in", title: "Kredi yükleme", description: "Bakiye yükleme tamamlandı.", amount: "+250 kredi", date: "Bugün 11:20", tone: "success" },
  { id: "w2", type: "credit-out", title: "Yeni iş kullanımı", description: "Karşıyaka klima arızası için kredi kullanıldı.", amount: "-260 kredi", date: "Bugün 09:44", tone: "neutral" },
  { id: "w3", type: "bonus-convert", title: "Bonus krediye çevrildi", description: "Bonus bakiyeden krediye dönüşüm.", amount: "+120 kredi", date: "Dün 17:05", tone: "info" },
  { id: "w4", type: "refund", title: "İade hareketi", description: "Müşteri kaynaklı iptal iadesi.", amount: "+90 kredi", date: "Dün 14:30", tone: "success" },
  { id: "w5", type: "credit-out", title: "Teklif hakkı kullanıldı", description: "Ev temizliği teklifi için kullanım.", amount: "-40 kredi", date: "15 Haz 2026", tone: "neutral" },
  { id: "w6", type: "credit-in", title: "Manuel bakiye yükleme", description: "Kart ile kredi yüklendi.", amount: "+500 kredi", date: "14 Haz 2026", tone: "success" },
  { id: "w7", type: "bonus-in", title: "Partner bonusu", description: "Davet programından bonus kazancı.", amount: "+75 bonus", date: "13 Haz 2026", tone: "info" },
  { id: "w8", type: "credit-out", title: "Havuz işi alındı", description: "Uygun havuz işi için kredi kullanıldı.", amount: "-180 kredi", date: "12 Haz 2026", tone: "neutral" },
  { id: "w9", type: "bonus-in", title: "Yorum hedef bonusu", description: "5 yıldızlı yorum hedefi tamamlandı.", amount: "+30 bonus", date: "11 Haz 2026", tone: "info" },
];

export const walletActions = [
  { label: "Bakiye Yükle", icon: "plus", route: "/wallet", tone: "success" },
  { label: "Krediye Çevir", icon: "refresh", route: "/bonus", tone: "info" },
  { label: "Hesap Hareketleri", icon: "list", route: "/wallet", tone: "neutral" },
  { label: "Faturalarım", icon: "receipt", route: "/invoices", tone: "warning" },
];

export const reviews = [
  { id: "r1", name: "Elif Yılmaz", rating: 5, service: "Klima Tamiri", text: "Hızlı dönüş yaptı, servis süreci çok düzenliydi.", date: "Bugün", replied: false },
  { id: "r2", name: "Murat Kaya", rating: 4, service: "Kombi Bakımı", text: "Randevu saatine uydu ve işlemi temiz anlattı.", date: "Dün", replied: true, reply: "Geri bildiriminiz için teşekkür ederiz, yeniden yardımcı olmak isteriz." },
  { id: "r3", name: "Selin Aksoy", rating: 5, service: "Petek Temizliği", text: "Beklentimin üstünde bir hizmet aldım.", date: "2 gün önce", replied: true, reply: "Değerli yorumunuz için teşekkür ederiz." },
  { id: "r4", name: "Burak Turan", rating: 3, service: "Buzdolabı Tamiri", text: "İletişim iyiydi ama randevu biraz gecikti.", date: "3 gün önce", replied: false },
  { id: "r5", name: "Nermin Koç", rating: 5, service: "Çamaşır Makinesi", text: "Sorun hızlı çözüldü, servis personeli çok açıklayıcıydı.", date: "4 gün önce", replied: false },
  { id: "r6", name: "Ali Rıza", rating: 4, service: "Klima Bakımı", text: "Temiz çalışıldı ve ücret bilgisi net verildi.", date: "5 gün önce", replied: true, reply: "Memnun kalmanıza sevindik." },
  { id: "r7", name: "Ceren Mutlu", rating: 2, service: "Kombi Servisi", text: "Tekrar kontrol için dönüş bekliyorum.", date: "6 gün önce", replied: false },
  { id: "r8", name: "Hakan Şahin", rating: 5, service: "Fırın Tamiri", text: "Dakik ve güvenilir bir hizmet aldım.", date: "1 hafta önce", replied: true, reply: "Güzel yorumunuz için teşekkür ederiz." },
  { id: "r9", name: "Pelin Demir", rating: 5, service: "Klima Montajı", text: "Montaj süreci beklediğimden hızlı tamamlandı.", date: "1 hafta önce", replied: false },
];

export const reviewSummary = {
  average: 4.8,
  total: 126,
  newLast30Days: 18,
  satisfaction: 92,
};

export const leaderboard = {
  period: "1 - 7 Haziran 2026",
  sector: "Beyaz Eşya Tamiri",
  city: "Şehirler",
  myRank: 37,
  myScore: 845,
  myJobs: 18,
  targetRank: "İlk 20",
  targetProgress: 72,
  nearby: [
    { rank: 34, name: "Mehmet Y.", initials: "MY", score: 870 },
    { rank: 35, name: "Ali C.", initials: "AC", score: 860 },
    { rank: 36, name: "Ahmet K.", initials: "AK", score: 848 },
    { rank: 37, name: "Sen", initials: "S", score: 845, self: true },
    { rank: 38, name: "Hasan T.", initials: "HT", score: 835 },
    { rank: 39, name: "Zeynep E.", initials: "ZE", score: 828 },
    { rank: 40, name: "Murat A.", initials: "MA", score: 821 },
  ],
  topRankers: [
    { rank: 1, name: "Hüseyin A.", initials: "HA", score: 10846 },
    { rank: 2, name: "Emre D.", initials: "ED", score: 9650 },
    { rank: 3, name: "Yusuf K.", initials: "YK", score: 8930 },
  ],
  rewards: [
    { title: "1. Sıra", value: "3.000 Bonus", note: "+ Özel Rozet" },
    { title: "İlk 3", value: "1.000 Bonus", note: "+ Özel Rozet" },
    { title: "İlk 10", value: "500 Bonus", note: "+ Özel Rozet" },
  ],
};
