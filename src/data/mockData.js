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
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=220&q=80",
  badges: [
    { label: "Güvenilir", icon: "shield" },
    { label: "Hızlı", icon: "zap" },
    { label: "Bölge Aktif", icon: "map-pin" },
    { label: "Sonuç Bildiren", icon: "check" },
    { label: "Randevu Düzenli", icon: "calendar" },
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
};

export const notifications = [
  { id: "n1", title: "Yeni iş fırsatı hazır", description: "Karşıyaka’da klima arızası için müşteri hazır.", priority: "high", unread: true },
  { id: "n2", title: "Teklif bekleyen müşteri var", description: "15 kullanıcı fiyat teklifi bekliyor.", priority: "high", unread: true },
  { id: "n3", title: "Bakiye düşük", description: "Yeni iş için kredi yüklemelisin.", priority: "warning", unread: false },
  { id: "n4", title: "Yeni müşteri yorumu geldi", description: "Elif Y. servis deneyimini 5.0 puanladı.", priority: "info", unread: true },
];

export const referralPartners = [
  { id: "ahmet-kaya", name: "Ahmet Kaya", city: "İstanbul", status: "Kayıt olmalı", reward: "100 TL" },
  { id: "mehmet-yilmaz", name: "Mehmet Yılmaz", city: "Ankara", status: "Profili eksik", reward: "500 TL" },
  { id: "ayse-demir", name: "Ayşe Demir", city: "İzmir", status: "İş almalı", reward: "500 TL" },
  { id: "derya-aksoy", name: "Derya Aksoy", city: "Bursa", status: "Bakiye yüklet", reward: "%3" },
];

export const reviews = [
  { id: "r1", name: "Elif Y.", rating: 5, service: "Klima Tamiri", text: "Hızlı dönüş yaptı, servis süreci çok düzenliydi.", replied: false },
  { id: "r2", name: "Murat K.", rating: 4, service: "Kombi Bakımı", text: "Randevu saatine uydu ve işlemi temiz anlattı.", replied: true },
  { id: "r3", name: "Selin A.", rating: 5, service: "Petek Temizliği", text: "Beklentimin üstünde bir hizmet aldım.", replied: true },
];

export const leaderboard = [
  { rank: 34, name: "Mehmet Y.", score: 870 },
  { rank: 35, name: "Ali C.", score: 860 },
  { rank: 36, name: "Ahmet K.", score: 848 },
  { rank: 37, name: "Sen", score: 845, self: true },
  { rank: 38, name: "Hasan T.", score: 835 },
];
