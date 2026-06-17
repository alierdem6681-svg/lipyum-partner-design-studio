import { mountAppShell } from "./components/AppShell.js";
import { createUiState, navigationStack } from "./state.js";
import { renderBottomBar } from "./components/BottomBar.js";
import { BOTTOM_TABS, DRAWER_SECTIONS } from "./utils/constants.js";
import { fitTextToContainer } from "./utils/dom.js";
import { createNavigationController } from "./utils/navigation.js";
import {
  pageRoutes,
  getRouteForScreen,
  getScreenForRoute,
  getCtaVariant,
} from "./router.js";

mountAppShell();

      const state = createUiState({
        platformInfoVisible: true,
        suggestionVisible: true,
        selectedReviewName: "Elif Y.",
        selectedReviewText: "Hızlı dönüş yaptı, servis süreci çok düzenliydi.",
        selectedReviewReply: "",
      });

      let regionActivityTimer = null;
      let taskRailAutoTimer = null;
      let smartStatusTimer = null;
      let reviewLoadTimer = null;
      let referralLoadTimer = null;
      let notificationLoadTimer = null;
      const bottomBadgeSnapshot = new Map();

      const rewardWheelEnabled = false;

      const screens = [
        { id: "home", label: "Ana Sayfa", short: "Durum", icon: "home", desc: "Bugünkü iş, hak ve fırsat özeti" },
        { id: "work", label: "İş Al", short: "Fırsat", icon: "briefcase", desc: "Havuz işleri ve teklif kayıtları" },
        { id: "jobs", label: "İşlerim", short: "Takip", icon: "clipboard", desc: "Gelen, aktif, teklif ve sorunlu işler" },
        { id: "calendar", label: "Takvim", short: "Randevu", icon: "calendar", desc: "Ücretsiz randevu ve çalışan planı" },
        { id: "wallet", label: "Cüzdan", short: "Paket", icon: "wallet", desc: "Haklar, kredi ve abonelik paketleri" },
        { id: "profile", label: "Profilini Güçlendir", short: "4/6", icon: "sparkles", desc: "Daha çok iş için net görevler" },
        { id: "services", label: "Hizmet Alanları", short: "Mod", icon: "list", desc: "Sektöre göre çalışma modeli" },
        { id: "regions", label: "Hizmet Bölgeleri", short: "Bölge", icon: "map-pin", desc: "İlçe bazlı iş alma ayarı" },
        { id: "workPlan", label: "Çalışma Planım", short: "08-22", icon: "clock", desc: "Gün ve saat bazlı müsaitlik" },
        { id: "capacity", label: "İş Alma Kapasitesi", short: "Kapasite", icon: "users", desc: "Günlük ve aynı anda iş limiti" },
        { id: "bonus", label: "Bonus Cüzdanı", short: "240", icon: "wallet", desc: "Bonus ve krediye çevirme" },
        { id: "support", label: "Sorun Takibi", short: "LP", icon: "headphones", desc: "Ticket ve destek konuları" },
        { id: "messages", label: "Destek / Mesaj Kutusu", short: "Mesaj", icon: "message", desc: "Danışman ve mesaj takibi" },
        { id: "referral", label: "Partner Davet Programı", short: "Davet", icon: "share", desc: "Partner davetleri ve ödüller" },
        { id: "levels", label: "Partner Seviyeleri", short: "Rozet", icon: "sparkles", desc: "Seviye ve profesyonel rozetler" },
        { id: "customers", label: "Müşteri Defteri", short: "CRM", icon: "users", desc: "Kendi müşterilerini takip et" },
        { id: "appointmentLink", label: "Randevu Linki / QR", short: "QR", icon: "qr", desc: "Kısa link ve QR paylaşımı" },
      ];

      const bottomItems = BOTTOM_TABS;

      const drawerSections = DRAWER_SECTIONS;

      const mainTitles = {
        home: ["Ana Sayfa", "Bugünkü iş durumun"],
        work: ["İş Al", "Havuz ve teklif fırsatları"],
        jobs: ["İşlerim", "İşlerini takip et"],
        calendar: ["Takvim", "Randevularını ve çalışan müsaitliğini yönet"],
        wallet: ["Cüzdan", "Paket hakları ve kredi bakiyen"],
        profile: ["Profilim", "Profil ve hesap ayarların"],
        about: ["Hakkımda", "Müşterilere görünen tanıtım bilgilerin"],
        photoGallery: ["Fotoğraflarım", "Profil fotoğrafları ve iş galerin"],
        services: ["Hizmet Alanları", "Hangi hizmette hangi mod açık"],
        regions: ["Hizmet Bölgeleri", "İlçe bazlı iş alma ayarların"],
        workPlan: ["Çalışma Planım", "Müsait olduğun gün ve saatleri yönet"],
        team: ["Ekibim", "Ekip ve çalışan bilgilerin"],
        capacity: ["İş Alma Kapasitesi", "Bugün kaç iş alabileceğini gir"],
        strategy: ["Stratejim", "Büyüme ve görünürlük hedeflerin"],
        accountSettings: ["Hesap Ayarları", "Güvenlik ve hesap durumunu yönet"],
        notificationSettings: ["Bildirim Ayarları", "Bildirim tercihlerini düzenle"],
        contactSettings: ["İletişim Bilgileri", "Telefon ve iletişim bilgilerini yönet"],
        invoices: ["Faturalarım", "Fatura ve ödeme belgelerin"],
        incomeExpense: ["Gelir Gider Takibi", "Gelir ve gider kayıtlarını takip et"],
        bonus: ["Bonus Cüzdanı", "Bonus bakiyeni ve krediye çevirme şartını takip et"],
        support: ["Yardım ve Destek", "Sorununu seç, hızlıca çözelim"],
        messages: ["Destek / Mesaj Kutusu", "Danışman mesajları ve ticket takibi"],
        referral: ["Partner Davet Programı", "Davet ettiğin partnerlerin yüklemelerinden %3 bonus kazan"],
        referralList: ["Davet Ettiğin Partnerler", "Partner davetlerini ve bonus aşamalarını takip et"],
        jobReferral: ["İş Yönlendirme Programı", "Servis talebi gönder, iş gerçekleşirse kazanç elde et"],
        referralEarnings: ["Kazançlarım", "Bonus kazanç geçmişi ve detayları"],
        growthPackages: ["Büyüme Paketleri", "Premium paketlerle daha fazla iş fırsatı"],
        growthPackageBuilder: ["Paket Seçimi", "Sektör, il ve ilçe seçimi"],
        growthPackageCheckout: ["Ödeme", "Paket özeti ve ödeme"],
        subscription: ["Aboneliğim", "Gold, Pro ve VIP avantajlarını yönet"],
        levels: ["Partner Seviyeleri", "Seviye ve rozet ilerlemeni gör"],
        reviews: ["Müşteri Yorumları", "Değerlendirme ve geri bildirimler"],
        customers: ["Müşteri Defteri", "Kendi müşterilerini düzenli takip et"],
        appointmentLink: ["Randevu Linki / QR", "Kısa link ve QR paylaşımı"],
        performanceScore: ["Performans Skoru", "İş görünürlüğünü etkileyen kalite özeti"],
      };

      const icon = (name) => `<svg class="icon"><use href="#i-${name}"></use></svg>`;
      const navigation = createNavigationController({ state, renderScreen, navigationStack });
      const {
        getCurrentRoute,
        goBack,
        initRouter,
        navigateTo,
        renderRoute,
        setActiveTab,
        updateDocumentTitle,
      } = navigation;

      window.navigateToPage = (route) => navigateTo(route);
      window.lipyumRouter = navigation;

      const escapeHtml = (value) => String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

      const weeklyRights = [
        { title: "Direkt İş Alma", desc: "Hazır müşteri kayıtları", iconName: "phone", color: "#067647", bg: "#ecfdf3" },
        { title: "Havuzdan İş Alma", desc: "Bekleyen uygun işler", iconName: "briefcase", color: "#175cd3", bg: "#eff4ff" },
        { title: "Teklif Verme", desc: "Teklif bekleyen kayıtlar", iconName: "edit", color: "#6941c6", bg: "#f4f3ff" },
      ];

      const packageTabs = {
        free: {
          label: "Ücretsiz Hesap",
          iconName: "package",
          color: "#067647",
          title: "Ücretli paketlerle büyü",
          desc: "Temel haklarla başlayabilir, hakların azaldığında paket veya krediyle devam edebilirsin.",
          price: "₺0",
          cycle: "",
          promise: "Başlamak için ideal; büyümek için Plus önerilir.",
          features: ["Temel erişim", "Standart görünürlük"],
          rights: [{ remaining: 3, total: 5 }, { remaining: 1, total: 5 }, { remaining: 4, total: 5 }],
        },
        plus: {
          label: "Plus",
          iconName: "plus",
          color: "#175cd3",
          title: "Plus ile daha fazla iş",
          desc: "Haftalık haklarını artır, havuz ve teklif fırsatlarını kaçırma.",
          price: "₺699",
          cycle: "/ay",
          promise: "Hakların bitmeden daha fazla işe dönüş yap.",
          features: ["Artan görünürlük", "Akıllı hak uyarısı", "Hızlı ödeme"],
          rights: [{ remaining: 9, total: 14 }, { remaining: 7, total: 14 }, { remaining: 11, total: 14 }],
        },
        pro: {
          label: "Pro",
          iconName: "sparkles",
          color: "#6941c6",
          title: "Pro iş akışı",
          desc: "Daha yüksek hak, daha fazla görünürlük ve düzenli iş akışı.",
          price: "₺1.490",
          cycle: "/ay",
          promise: "Bölge önceliğiyle daha düzenli iş akışı kur.",
          features: ["Bölge önceliği", "Gelişmiş rapor", "Öncelikli destek"],
          rights: [{ remaining: 18, total: 28 }, { remaining: 15, total: 28 }, { remaining: 22, total: 28 }],
        },
        vip: {
          label: "VIP",
          iconName: "crown",
          color: "#b54708",
          title: "VIP öncelik",
          desc: "En yüksek görünürlük ve premium partner desteğiyle büyü.",
          price: "₺3.900",
          cycle: "/ay",
          promise: "Premium görünürlük ve danışmanlıkla kapasiteni büyüt.",
          features: ["Özel danışman", "Öncelikli havuz", "VIP teklif akışı"],
          rights: [{ remaining: 34, total: 52 }, { remaining: 29, total: 52 }, { remaining: 41, total: 52 }],
        },
      };

      const navAlerts = [
        { iconName: "check", title: "Durum: Aktif", desc: "675 kredi ≈ 2-3 iş", color: "#067647", bg: "#ecfdf3", border: "#abefc6" },
        { iconName: "wallet", title: "Durum: Pasif", desc: "Bakiye yok", cta: "Yükle", open: "credit", color: "#92400e", bg: "#fffaeb", border: "#fedf89" },
        { iconName: "clock", title: "Durum: Pasif", desc: "Çalışma Saati Dışı", screen: "workPlan", color: "#175cd3", bg: "#eff4ff", border: "#b2ccff" },
        { iconName: "shield", title: "Durum: Pasif", desc: "Hesap askıda", cta: "Destek", screen: "support", color: "#b42318", bg: "#fef3f2", border: "#fecdca" },
        { iconName: "pause", title: "Durum: Pasif", desc: "Duraklatılmış", cta: "Aç", action: "activate-dispatch", color: "#475467", bg: "#f2f4f7", border: "#d0d5dd" },
      ];

      const performanceScore = {
        score: 81,
        level: "İyi",
        nextTarget: 85,
        nextTargetText: "85 puanda daha fazla doğrudan iş açılır",
        affectsVisibility: true,
        summary: {
          completedJobs: 34,
          customerRating: 4.8,
          responseRate: 92,
          onTimeRate: 96,
        },
        factors: [
          { key: "response_speed", title: "Yanıt Hızı", description: "İş taleplerine ortalama yanıt süren", score: 92, color: "green", iconName: "clock" },
          { key: "job_completion", title: "İş Tamamlama", description: "Zamanında ve eksiksiz tamamlanan işler", score: 88, color: "blue", iconName: "check" },
          { key: "customer_satisfaction", title: "Müşteri Memnuniyeti", description: "Müşteri değerlendirme ortalaman", score: 90, color: "purple", iconName: "star" },
          { key: "cancellation_problem_rate", title: "İptal / Sorun Oranı", description: "Partner kaynaklı iptal ve sorun oranı", score: 75, color: "orange", iconName: "alert" },
          { key: "profile_strength", title: "Profil Gücü", description: "Profil bilgilerin ve görsel kaliten", score: 80, color: "teal", iconName: "user" },
          { key: "rules_compliance", title: "Kurallara Uyum", description: "Platform kurallarına uyum durumun", score: 84, color: "blue", iconName: "shield" },
        ],
        actions: [
          { title: "Yeni gelen işleri 5 dk içinde ara", description: "Yanıt hızını artırarak skorunu yükselt", gain: 3, iconName: "phone", action: "performance-action" },
          { title: "Eksik profil bilgilerini tamamla", description: "Profil gücünü artır, daha fazla iş kazan", gain: 2, iconName: "clipboard", screen: "profile" },
          { title: "Son müşteriden değerlendirme al", description: "Memnuniyet skorun yükselsin", gain: 1, iconName: "star", action: "performance-action" },
        ],
        rewards: [
          { score: 85, title: "Ek doğrudan iş hakkı", iconName: "trend-up" },
          { score: 90, title: "Güvenilir Partner rozeti", iconName: "shield" },
          { score: 95, title: "Öncelikli fırsat erişimi", iconName: "crown" },
        ],
      };

      const taskCards = [
        {
          key: "ready",
          title: "Hazırsın",
          desc: "Yeni iş, teklif veya havuz fırsatı olduğunda WhatsApp'tan bildiririz.",
          action: "",
          iconName: "check",
          visualIcon: "sparkles",
          count: "",
          color: "#067647",
          bg: "#ecfdf3",
          className: "primary ready",
          meta: [],
        },
        {
          key: "assigned",
          title: "3 yeni iş geldi",
          desc: "Araman gereken 3 müşteri bulunmaktadır.",
          action: "Müşterileri Gör",
          iconName: "users",
          visualIcon: "phone",
          count: "3",
          color: "#067647",
          bg: "#ecfdf3",
          className: "assigned",
          meta: [],
        },
        {
          key: "offers",
          title: "15 kişi fiyat teklifi bekliyor",
          desc: "Teklif ver, işi kazanma şansını artır.",
          action: "Teklif Ver",
          iconName: "edit",
          visualIcon: "message",
          count: "15",
          color: "#6941c6",
          bg: "#f4f3ff",
          className: "offer",
          meta: [],
        },
        {
          key: "pool",
          title: "Havuzda 4 iş seni bekliyor",
          desc: "Havuzda bekleyen işleri inceleyerek hemen işe gidebilirsin.",
          action: "Havuzu Gör",
          iconName: "briefcase",
          visualIcon: "clipboard",
          count: "4",
          color: "#175cd3",
          bg: "#eff4ff",
          className: "pool",
          meta: [],
        },
        {
          key: "balance",
          title: "Bakiye yetersiz",
          desc: "Yeni iş alabilmek için kredi yüklemelisin.",
          action: "Bakiye Yükle",
          iconName: "alert",
          visualIcon: "wallet",
          count: "75",
          color: "#b7791f",
          bg: "#fffaeb",
          className: "warning",
          meta: ["Bakiye: 75 kredi"],
        },
        {
          key: "closed",
          title: "İş alımı kapalı",
          desc: "Yeni işler sana yönlendirilmez. Hazır olduğunda açabilirsin.",
          action: "İş Alımını Aç",
          iconName: "pause",
          visualIcon: "pause",
          count: "0",
          color: "#667085",
          bg: "#f2f4f7",
          className: "muted-state",
          meta: [],
        },
      ];

      const taskDetails = {
        ready: {
          title: "İş almaya hazırsın",
          desc: "Aktifsin. Yeni iş, teklif talebi veya havuz fırsatı olduğunda WhatsApp bildirimi alırsın.",
          actionLabel: "Tamam",
          actionType: "close-sheet",
          items: [
            ["Durum", "Aktif", "Yeni uygun iş geldiğinde bildirilecek."],
            ["Cüzdan", "675 kredi", "Yaklaşık 2-4 iş alabilecek bakiye."],
            ["Bildirim", "WhatsApp açık", "İş, teklif ve havuz fırsatlarında bilgilendirme yapılır."],
          ],
        },
        assigned: {
          title: "3 yeni iş geldi",
          desc: "Araman gereken 3 müşteri bulunmaktadır. Arama sistem hattı üzerinden yapılır.",
          actionLabel: "İlk müşteriyi ara",
          actionType: "call",
          items: [
            ["Ayşe Demir", "Klima arızası · Karasu", "Talep zamanı: 09:12 · Son teyit: 2 dk önce"],
            ["Mehmet Yılmaz", "Buzdolabı servis · Serdivan", "Talep zamanı: 09:18 · Hâlâ servis istiyor"],
            ["Elif Koç", "Çamaşır makinesi · Adapazarı", "Son teyit: 4 dk önce · Hâlâ servis istiyor"],
          ],
        },
        offers: {
          title: "15 kullanıcı fiyat teklifi bekliyor",
          desc: "Teklif toplama modelindeki kayıtlar. Uygun olanlara hızlı teklif verebilirsin.",
          actionLabel: "Teklif bekleyen işleri gör",
          actionType: "open-offers",
          items: [
            ["Kurumsal web sitesi", "Yazılım · 8 teklif bekliyor", "Bütçe aralığı: 18.000-32.000 TL"],
            ["Mobil uygulama bakımı", "Yazılım · 4 teklif bekliyor", "Teslim beklentisi: 7 gün"],
            ["E-ticaret entegrasyonu", "Yazılım · 3 teklif bekliyor", "Acil dönüş bekleniyor"],
          ],
        },
        pool: {
          title: "Havuzda 4 iş seni bekliyor",
          desc: "Havuzda bekleyen işleri inceleyerek hemen işe gidebilirsin.",
          actionLabel: "Havuzdaki işleri incele",
          actionType: "take-pool",
          items: [
            ["Klima bakım", "Karasu · 260 kredi", "Son teyit: 5 dk önce"],
            ["Kombi servis", "Erenler · 220 kredi", "Bugün uygun"],
            ["Buzdolabı arızası", "Serdivan · 310 kredi", "Müşteri müsait"],
            ["Çamaşır makinesi", "Adapazarı · 180 kredi", "Yakın bölge"],
          ],
        },
        balance: {
          title: "Bakiye yetersiz",
          desc: "Yeni iş alabilmek için kredi yüklemen gerekiyor.",
          actionLabel: "Bakiye Yükle",
          actionType: "buy-credit",
          items: [
            ["Mevcut bakiye", "75 kredi", "Bu iş türü için yetersiz."],
            ["Öneri", "+250 kredi yükle", "2-3 iş fırsatı için daha rahat alan açar."],
          ],
        },
        closed: {
          title: "İş alımı kapalı",
          desc: "Pasif olduğunda yeni doğrudan iş yönlendirilmez.",
          actionLabel: "İş Alımını Aç",
          actionType: "activate-dispatch",
          items: [
            ["Durum", "Pasif", "Yeni işler sana yönlendirilmez."],
            ["Kaçırılan fırsat", "0 aktif yönlendirme", "Aktif edince uygun işler görünür."],
            ["Öneri", "Hazır olduğunda aç", "İş alımını istediğin zaman kapatabilirsin."],
          ],
        },
      };

      const regionActivityMessages = [
        "Başka bir partner en son 2 dk önce iş yaptı.",
        "Bölgede az önce yeni bir teklif verildi.",
        "Son 10 dk içinde 3 partner iş fırsatı görüntüledi.",
        "Yakındaki bir havuz işi kısa süre önce alındı.",
      ];

      function navAlertTicker() {
        const itemAttrs = (alert) => {
          if (alert.open) return `data-open="${alert.open}"`;
          if (alert.screen) return `data-screen="${alert.screen}"`;
          if (alert.action) return `data-action="${alert.action}"`;
          return `data-open="status"`;
        };
        return `
          <div class="nav-alert-ticker nav-status-pill" role="status" aria-live="polite" aria-label="İş alımı durumları">
            <div class="nav-alert-track">
              ${navAlerts.map((alert) => `
                <div class="nav-alert-item ${alert.cta ? "has-action" : ""} ${alert.title.includes("Pasif") ? "is-inactive" : ""}" ${itemAttrs(alert)} style="--nav-alert-color:${alert.color};--nav-alert-bg:${alert.bg};--nav-alert-border:${alert.border || alert.color}">
                  <span class="nav-alert-mark">${icon(alert.iconName)}</span>
                  <span class="nav-alert-copy"><strong>${alert.title}</strong><small>${alert.desc}</small></span>
                  ${alert.cta ? `<span class="nav-alert-action" aria-hidden="true">${alert.cta}</span>` : ""}
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }

      function factorTone(color) {
        const tones = {
          green: ["#ecfdf3", "#067647"],
          blue: ["#eff4ff", "#175cd3"],
          purple: ["#f4f3ff", "#6941c6"],
          orange: ["#fffaeb", "#b54708"],
          teal: ["#f0fdfa", "#0f766e"],
        };
        const [bg, tone] = tones[color] || tones.green;
        return { bg, tone };
      }

      function formatRating(value) {
        return String(value).replace(".", ",");
      }

      function scoreProgressBar(score, target, label = true) {
        return `
          <div class="score-progress-wrap" style="--score-fill:${score}%;--score-target:${target}%">
            <div class="score-progress" aria-label="Performans skoru ${score}, hedef ${target}">
              <span></span>
              <i class="score-marker" aria-hidden="true"></i>
            </div>
            ${label ? `<span class="score-marker-label">${target}</span>` : ""}
            ${label ? `<span class="score-end-label">100</span>` : ""}
          </div>
        `;
      }

      function performanceSummaryGrid() {
        const summary = performanceScore.summary;
        const items = [
          ["check", "Tamamlanan İş", summary.completedJobs],
          ["star", "Müşteri Puanı", `${formatRating(summary.customerRating)} ★`],
          ["phone", "Yanıt Oranı", `%${summary.responseRate}`],
          ["clock", "Zamanında", `%${summary.onTimeRate}`],
        ];
        return `
          <div class="performance-summary-grid">
            ${items.map(([ico, label, value]) => `
              <div class="performance-summary-item"><span>${icon(ico)} ${label}</span><strong>${value}</strong></div>
            `).join("")}
          </div>
        `;
      }

      function performanceScoreCard() {
        const ringDegree = performanceScore.score * 3.6;
        return `
          <section class="card card-pad performance-home-card section" data-action="performance-detail" aria-label="Performans Skoru">
            <div class="performance-card-head">
              <span class="performance-title">Performans Skoru</span>
              <button class="performance-info-btn text" type="button" data-open="performance-info" aria-label="Performans skoru nedir?">Nedir?</button>
            </div>
            <div class="performance-home-layout">
              <span class="performance-score-ring" style="--score-ring:${ringDegree}deg">
                <span><strong>${performanceScore.score}</strong></span>
              </span>
              <span class="performance-home-copy">
                <span class="score-level">${icon("star")} ${performanceScore.level}</span>
              </span>
              <button class="performance-cta" type="button" data-screen="performanceScore">${icon("trend-up")} Skorumu Artır</button>
            </div>
            <span class="performance-helper">85 puana ulaşmana çok az kaldı.</span>
            ${scoreProgressBar(performanceScore.score, performanceScore.nextTarget)}
          </section>
        `;
      }

      function smartStatusActionLabel(task) {
        return task.action || "Hazır Kal";
      }

      function smartStatusPanel(task) {
        return `
          <span class="smart-status-icon" aria-hidden="true">${icon(task.iconName)}</span>
          <span class="smart-status-copy">
            <span class="smart-status-title"><strong>${task.title}</strong>${task.count ? `<span class="smart-status-count">${task.count}</span>` : ""}</span>
            <small>${task.desc}</small>
            <button class="smart-status-action" type="button" data-task-detail="${task.key}">${smartStatusActionLabel(task)} ${icon("chevron-right")}</button>
          </span>
          <span class="smart-status-visual" aria-hidden="true">${icon(task.visualIcon || task.iconName)}</span>
        `;
      }

      function smartStatusCard() {
        const task = taskCards[0];
        return `
          <section class="smart-status-card section" data-smart-status-card style="--smart-color:${task.color};--smart-bg:${task.bg}" aria-label="Akıllı Durum Kartı">
            <div class="smart-status-label">
              <span>${icon("sparkles")} Akıllı Durum Kartı</span>
              <span class="smart-status-dots" aria-hidden="true">
                ${taskCards.map((_, index) => `<span class="smart-status-dot ${index === 0 ? "active" : ""}" data-smart-status-dot="${index}"></span>`).join("")}
              </span>
            </div>
            <article class="smart-status-panel" data-smart-status-panel data-task-detail="${task.key}">
              ${smartStatusPanel(task)}
            </article>
          </section>
        `;
      }

      function taskCardMarkup(task, options = {}) {
        const cloneAttr = options.clone ? ' data-loop-clone="true" aria-hidden="true" inert tabindex="-1"' : "";
        return `
          <article class="task-card ${task.className || ""}" style="--task-bg:${task.bg};--task-color:${task.color}" data-task-detail="${task.key}"${cloneAttr}>
            <span class="task-copy">
              <span class="task-title-row"><strong>${task.title}</strong></span>
              <small>${task.desc}</small>
              ${(task.meta || []).length ? `<span class="task-meta">${task.meta.map((item) => `<span>${item}</span>`).join("")}</span>` : ""}
              ${task.action ? `<button class="task-action" type="button" data-task-detail="${task.key}">${task.action} ${icon("chevron-right")}</button>` : ""}
            </span>
            <span class="task-visual" aria-hidden="true">
              ${icon(task.visualIcon || task.iconName)}
            </span>
          </article>
        `;
      }

      function taskRail() {
        return `
          <section class="task-carousel section" aria-label="Görev ve fırsat kartları">
            <div class="task-rail" data-task-rail>
              ${taskCards.map((task) => taskCardMarkup(task)).join("")}
              ${taskCardMarkup(taskCards[0], { clone: true })}
            </div>
            <div class="task-dots" aria-hidden="true">
              ${taskCards.map((_, index) => `<span class="task-dot ${index === 0 ? "active" : ""}" data-task-dot="${index}"></span>`).join("")}
            </div>
          </section>
        `;
      }

      function compactPackageCard() {
        const selected = currentPackage();
        return `
          <button class="compact-package-card section" type="button" data-open="package" aria-label="Paket ve kalan haklar">
            <span class="compact-package-head">
              <span class="compact-package-title">${icon(selected.iconName)} ${selected.label}</span>
              <span class="compact-package-link">Paketleri Gör ${icon("chevron-right")}</span>
            </span>
            <span class="compact-package-note">
              <span>${icon("edit")} Her hafta 3 teklif hakkın var.</span>
              <span>${icon("plus")} Krediyle hazır iş satın alabilirsin.</span>
            </span>
          </button>
        `;
      }

      function performanceFactorRow(factor) {
        const tone = factorTone(factor.color);
        return `
          <button class="factor-row" type="button" data-action="performance-action" style="--factor-bg:${tone.bg};--factor-color:${tone.tone}">
            <span class="factor-icon">${icon(factor.iconName)}</span>
            <span class="factor-copy">
              <strong>${factor.title}</strong>
              <small>${factor.description}</small>
              <span class="factor-mini-track" style="--factor-fill:${factor.score}%"><span></span></span>
            </span>
            <span class="factor-score">${factor.score} / 100</span>
            ${icon("chevron-right")}
          </button>
        `;
      }

      function performanceActionRow(action) {
        const target = action.screen ? `data-screen="${action.screen}"` : `data-action="${action.action || "performance-action"}"`;
        return `
          <button class="performance-action-row" type="button" ${target}>
            <span class="factor-icon" style="--factor-bg:#ecfdf3;--factor-color:#067647">${icon(action.iconName)}</span>
            <span class="performance-action-copy"><strong>${action.title}</strong><small>${action.description}</small></span>
            <span class="gain-pill">+${action.gain} puan</span>
            ${icon("chevron-right")}
          </button>
        `;
      }

      function performanceRewardCard(reward) {
        const isNext = performanceScore.score < reward.score && reward.score === performanceScore.nextTarget;
        const isLocked = performanceScore.score < reward.score && !isNext;
        return `
          <div class="reward-card ${isNext ? "is-next" : ""} ${isLocked ? "is-locked" : ""}">
            <span class="reward-score">${reward.score}+ ${icon(reward.iconName)}</span>
            <small>${reward.title}</small>
          </div>
        `;
      }

      function currentPackage() {
        return packageTabs[state.packageTab] || packageTabs.free;
      }

      function checkoutPackage() {
        return state.packageTab === "free" ? packageTabs.plus : currentPackage();
      }

      function selectedRights() {
        const selected = currentPackage();
        return weeklyRights.map((right, index) => ({ ...right, ...selected.rights[index] }));
      }

      function rightsBar(right) {
        const fill = Math.max(6, Math.round((right.remaining / right.total) * 100));
        return `
          <div class="rights-bar" style="--rights-color:${right.color};--rights-bg:${right.bg};--rights-fill:${fill}%">
            <div class="rights-top">
              <span class="rights-icon">${icon(right.iconName)}</span>
              <span class="rights-copy"><strong>${right.title}</strong><small>${right.desc}</small></span>
              <span class="rights-count"><span>Kalan</span><span class="rights-count-value"><strong>${right.remaining}</strong><small>/ Hafta</small></span></span>
            </div>
            <div class="rights-track" aria-hidden="true"><span></span></div>
          </div>
        `;
      }

      function packageUpgradePanel() {
        const selected = currentPackage();
        const isFree = state.packageTab === "free";
        return `
          <div class="package-tabs" role="tablist" aria-label="Paket seçenekleri">
            ${Object.entries(packageTabs).map(([id, tab]) => `<button class="${state.packageTab === id ? "active" : ""}" type="button" data-package-tab="${id}" style="--tab-color:${tab.color}">${icon(tab.iconName)} ${tab.label}</button>`).join("")}
          </div>
        `;
      }

      function packagePitchPanel() {
        const selected = currentPackage();
        const isFree = state.packageTab === "free";
        if (isFree) return "";
        const checkoutPlan = selected;
        return `
          <div class="package-panel">
            <span class="plan-content">
              <span class="plan-headline">
                <strong>${selected.title}</strong>
                <span class="plan-price"><b>${checkoutPlan.price}</b><small>${checkoutPlan.cycle || "önerilen"}</small></span>
              </span>
              <span class="plan-promise">${selected.promise}</span>
              <small>${selected.desc}</small>
              <span class="feature-chips">${selected.features.map((feature) => `<span>${feature}</span>`).join("")}</span>
            </span>
            <button class="primary-btn" type="button" data-action="quick-checkout" style="min-height:44px;padding:0 12px">${icon("sparkles")} Pakete Geç</button>
          </div>
        `;
      }

      function walletSummary() {
        return `
          <section class="card wallet-summary-card section">
            <div class="wallet-summary">
              <div class="wallet-tile credit">
                <div class="wallet-tile-head">
                  <span>Cüzdan</span>
                </div>
                <button class="wallet-tile-icon" type="button" data-open="wallet-info" aria-label="Cüzdan bilgisi">${icon("help-circle")}</button>
                <span class="wallet-amount"><strong>675</strong><small>kredi</small></span>
                <span class="wallet-subline" style="--wallet-dot:#12b76a">≈ 2-3 iş alabilirsin</span>
                <div class="wallet-actions">
                  <button class="wallet-action-pill" type="button" data-open="credit">${icon("plus")} Bakiye Yükle</button>
                </div>
              </div>
              <div class="wallet-tile bonus">
                <div class="wallet-tile-head">
                  <span>Bonus</span>
                </div>
                <button class="wallet-tile-icon" type="button" data-open="bonus-info" aria-label="Bonus bilgisi">${icon("help-circle")}</button>
                <span class="wallet-amount"><strong>240</strong><small>bonus</small></span>
                <span class="wallet-subline" style="--wallet-dot:#175cd3">Kredi yüklerken kullanılır.</span>
                <div class="wallet-actions split">
                  <button class="wallet-action-pill convert" type="button" data-open="bonus-convert">${icon("refresh")} Krediye Çevir</button>
                </div>
              </div>
            </div>
          </section>
        `;
      }

      function growthPackageCatalog() {
        return {
          demand: {
            id: "demand",
            tab: "📦 Toplu Talep",
            iconName: "package",
            advantage: "Hacim Avantajı",
            title: "Toplu Talep Paketi",
            desc: "Kotanı belirle, düzenli işleri görüntüle.",
            selectedLabel: "500 İş ⭐",
            selectedPrice: "₺399.603",
            options: [
              { label: "100 İş", price: "1.090", prefix: "İş Başına" },
              { label: "250 İş", price: "945", prefix: "İş Başına" },
              { label: "500 İş ⭐", price: "799", prefix: "İş Başına", selected: true },
              { label: "750 İş", price: "654", prefix: "İş Başına" },
              { label: "1000 İş", price: "509", prefix: "İş Başına" },
            ],
          },
          fixed: {
            id: "fixed",
            tab: "💰 Sabit Fiyat",
            iconName: "zap",
            advantage: "Öngörülebilir Gelir",
            title: "Sabit Fiyat Paketi",
            desc: "Her iş aynı fiyat. Bütçeni kolayca planlayın.",
            selectedLabel: "90 Gün Sabit Fiyat ⭐",
            selectedPrice: "₺5.900",
            options: [
              { label: "30 Gün Sabit Fiyat", price: "2.900" },
              { label: "90 Gün Sabit Fiyat ⭐", price: "5.900", selected: true },
              { label: "Yıllık Sabit Fiyat", price: "15.900" },
            ],
          },
          region: {
            id: "region",
            tab: "🌎 Bölge Lisansı",
            iconName: "map-pin",
            advantage: "Bölgenizde Tek Siz Olacaksınız",
            title: "Bölge Lisansı",
            desc: "Seçtiğiniz bölgede işler yalnızca size yönlendirilir.",
            selectedLabel: "3 Aylık Lisans ⭐",
            selectedPrice: "₺10.200",
            options: [
              { label: "Aylık Lisans", note: "Her bir bölge fiyatı", price: "5.100" },
              { label: "3 Aylık Lisans ⭐", note: "Her bir bölge fiyatı", price: "10.200", selected: true },
              { label: "Yıllık Lisans", note: "Her bir bölge fiyatı", price: "30.600" },
            ],
          },
          pool: {
            id: "pool",
            tab: "☰ Havuz",
            iconName: "list",
            advantage: "Toplu İşleri Görüntüle",
            title: "Havuz Paketi",
            desc: "Havuzdaki işleri uygun fiyata toplayın.",
            selectedLabel: "50 İş ⭐",
            selectedPrice: "₺13.657",
            options: [
              { label: "10 İş", note: "Havuzdan ücretsiz görüntüle", price: "2.731" },
              { label: "25 İş", note: "Havuzdan ücretsiz görüntüle", price: "6.828" },
              { label: "50 İş ⭐", note: "Havuzdan ücretsiz görüntüle", price: "13.657", selected: true },
              { label: "100 İş", note: "Havuzdan ücretsiz görüntüle", price: "27.314" },
            ],
          },
          guarantee: {
            id: "guarantee",
            tab: "✅ Garanti",
            iconName: "shield",
            advantage: "İş Garantisi",
            title: "Garanti Paketi",
            desc: "İş sayısı garanti. Tutmazsa paket ücretsiz yenilenir.",
            selectedLabel: "50 İş Garantisi ⭐",
            selectedPrice: "₺4.900",
            options: [
              { label: "25 İş Garantisi", note: "30 gün içinde 25 iş garantisi", price: "3.900" },
              { label: "50 İş Garantisi ⭐", note: "60 gün içinde 50 iş garantisi", price: "4.900", selected: true },
              { label: "75 İş Garantisi", note: "90 gün içinde 75 iş garantisi", price: "8.900" },
            ],
          },
          bonusCredit: {
            id: "bonusCredit",
            tab: "🎁 Bonus Kredi",
            iconName: "gift",
            advantage: "Her İşte %50 Kredi Bonusu",
            title: "Bonus Kredi Toplama Paketi",
            desc: "Her bir iş bedelinin %50'si kadar bonus kredi kazanın.",
            selectedLabel: "3 Aylık",
            selectedPrice: "₺5.900",
            options: [
              { label: "3 Aylık", note: "En fazla 250.000 Bonus Kredi", price: "5.900", selected: true },
            ],
          },
        };
      }

      function growthPackageCard(pkg) {
        return `
          <section class="growth-package-card">
            <span class="growth-advantage">${pkg.advantage}</span>
            <div class="growth-package-top">
              <span class="growth-package-icon">${icon(pkg.iconName)}</span>
              <span class="growth-card-copy">
                <h3>${pkg.title}</h3>
                <p>${pkg.desc}</p>
              </span>
              <span class="growth-check">${icon("check")}</span>
            </div>
            <div class="growth-option-list">
              ${pkg.options.map((option) => `
                <div class="growth-option ${option.selected ? "is-selected" : ""}">
                  <span class="growth-radio">${icon("check")}</span>
                  <span>
                    <strong>${option.label}</strong>
                    ${option.note ? `<small>${option.note}</small>` : ""}
                  </span>
                  <span class="growth-price">
                    ${option.prefix ? `<small>${option.prefix}</small>` : ""}
                    <span>${icon("coin")} ${option.price}</span>
                  </span>
                </div>
              `).join("")}
            </div>
          </section>
        `;
      }

      function renderGrowthPackages() {
        const catalog = growthPackageCatalog();
        const active = catalog[state.growthPackageTab] || catalog.demand;
        return `
          ${header("growthPackages", true)}
          <div class="growth-page">
            <section class="growth-hero">
              <span class="growth-premium-pill">${icon("crown")} Premium Paketler</span>
              <h2>Hemen Kazanmaya Başlayın</h2>
              <p>🚀 İşlerinizi büyütecek avantajlar</p>
            </section>
            <div class="growth-tabs" role="tablist" aria-label="Büyüme paketi kategorileri">
              ${Object.values(catalog).map((pkg) => `
                <button class="${active.id === pkg.id ? "active" : ""}" type="button" data-growth-tab="${pkg.id}">${pkg.tab}</button>
              `).join("")}
            </div>
            ${growthPackageCard(active)}
            <div class="growth-foot-note">
              <button class="link-btn" type="button" data-action="current-plan">Mevcut Paketlerim</button>
              <span class="growth-trust-row">
                <span>✓ Gizli ücret yok</span>
                <span>✓ Anında aktif</span>
                <span>✓ Kontrol sende</span>
              </span>
              <button class="growth-primary-cta" type="button" data-growth-start="${active.id}">🚀 Hemen Kazanmaya Başla</button>
            </div>
          </div>
        `;
      }

      function subscriptionPlans() {
        return [
          {
            name: "Gold",
            badge: "Popüler",
            price: "₺699",
            cycle: "/ ay",
            iconName: "star",
            color: "#d99a0b",
            color2: "#f5b544",
            soft: "#fffaf0",
            border: "#fedf89",
            shadow: "rgba(217, 154, 11, .24)",
            promise: "Daha fazla görünürlük ve hızlı iş fırsatı isteyen ekipler için.",
            features: ["Haftalık haklarda artış", "Öne çıkan profil görünürlüğü", "Hızlı ödeme ve öncelikli destek", "Bonus kullanım avantajı"],
          },
          {
            name: "Pro",
            badge: "En dengeli",
            price: "₺1.490",
            cycle: "/ ay",
            iconName: "shield",
            color: "#067647",
            color2: "#12b76a",
            soft: "#ecfdf3",
            border: "#abefc6",
            shadow: "rgba(8, 116, 67, .24)",
            featured: true,
            promise: "Düzenli iş alan, rapor ve öncelik isteyen profesyonel partnerler için.",
            features: ["Daha yüksek haftalık haklar", "Bölgesel görünürlük güçlendirme", "Gelişmiş performans içgörüleri", "Öncelikli fırsat erişimi"],
          },
          {
            name: "VIP",
            badge: "En iyisi",
            price: "₺2.990",
            cycle: "/ ay",
            iconName: "crown",
            color: "#064e3b",
            color2: "#16a34a",
            soft: "#f0fdf4",
            border: "#86efac",
            shadow: "rgba(6, 78, 59, .26)",
            promise: "En yüksek öncelik, prestij ve dönüşüm odaklı büyüme isteyen ekipler için.",
            features: ["VIP görünürlük ve rozet vurgusu", "En yüksek iş alma önceliği", "Danışman destekli büyüme takibi", "Özel kampanya ve bonus fırsatları"],
          },
        ];
      }

      function subscriptionPlanCard(plan) {
        return `
          <article class="subscription-card ${plan.featured ? "featured" : ""}"
            style="--plan-color:${plan.color};--plan-color-2:${plan.color2};--plan-soft:${plan.soft};--plan-border:${plan.border};--plan-shadow:${plan.shadow};--plan-glow:${plan.shadow}">
            <div class="subscription-card-head">
              <span class="subscription-plan-icon">${icon(plan.iconName)}</span>
              <span class="subscription-title-block">
                <h3>${plan.name}</h3>
                <small>${plan.badge}</small>
              </span>
              <span class="subscription-price">
                <strong>${plan.price}</strong>
                <small>${plan.cycle}</small>
              </span>
            </div>
            <p class="subscription-promise">${plan.promise}</p>
            <div class="subscription-feature-list">
              ${plan.features.map((feature) => `<span>${icon("check")} ${feature}</span>`).join("")}
            </div>
            <div class="subscription-card-actions">
              <button class="subscription-plan-cta" type="button" data-action="subscribe-plan" data-plan="${plan.name}">
                ${icon("sparkles")} ${plan.name}'a Geç
              </button>
              <small>Anında aktifleşir · Kart bilgisi ödeme adımında alınır</small>
            </div>
          </article>
        `;
      }

      function renderSubscription() {
        const plans = subscriptionPlans();
        return `
          ${header("subscription", true)}
          <div class="subscription-page">
            <section class="subscription-hero">
              <div class="subscription-hero-top">
                <span class="subscription-plan-badge">${icon("crown")} Abonelik avantajları</span>
                <span class="subscription-status-pill">Ücretsiz hesap</span>
              </div>
              <h2>Bir üst pakete geç, daha fazla iş fırsatı yakala.</h2>
              <p>Gold, Pro ve VIP paketleri görünürlüğünü, haklarını ve müşteriye güven veren rozetlerini güçlendirir.</p>
              <div class="subscription-mini-benefits">
                <span>${icon("eye")} Daha fazla görünürlük</span>
                <span>${icon("trend-up")} Daha fazla iş şansı</span>
                <span>${icon("sparkles")} Prestijli rozetler</span>
              </div>
            </section>

            <section class="subscription-rail-wrap" aria-label="Abonelik paketleri">
              <div class="subscription-rail-hint">
                <strong>Paketini seç</strong>
                <span>Sola kaydır</span>
              </div>
              <div class="subscription-rail">
                ${plans.map((plan) => subscriptionPlanCard(plan)).join("")}
              </div>
              <div class="subscription-dots" aria-hidden="true"><span></span><span></span><span></span></div>
            </section>

            <section class="subscription-current-card">
              <div class="subscription-current-row">
                <span>
                  <strong>Mevcut aboneliğin</strong>
                  <small>Şu anda ücretsiz hesapla kullanıyorsun.</small>
                </span>
                <span class="subscription-status-pill">Ücretsiz</span>
              </div>
              <div class="subscription-cancel-box">
                <p>Ücretli aboneliğe geçtiğinde planını buradan takip edebilir, istediğin zaman iptal talebi oluşturabilirsin.</p>
                <button class="subscription-cancel-btn" type="button" data-action="cancel-subscription">Ücretli Aboneliği İptal Et</button>
              </div>
            </section>
          </div>
        `;
      }

      function growthBuilderSteps() {
        return [
          {
            title: "1/3 • Sektör seç",
            items: [
              "Kombi Tamiri", "Bulaşık Makinesi Tamiri", "Buzdolabı Tamiri", "Çamaşır Makinesi Tamiri", "Fırın Tamiri",
              "Kurutma Makinesi Tamiri", "Klima Tamiri", "Klima Montajı", "Televizyon Tamiri", "Derin Dondurucu Tamiri",
              "Klima Bakımı", "Meşrubat Dolabı Tamiri", "Sütlük Dolabı Tamiri", "Kasap Dolabı Tamiri", "Pasta Dolabı Tamiri",
              "Şarküteri Dolabı Tamiri", "Dondurma Dolabı Tamiri", "Kola Dolabı Tamiri",
            ],
            selected: new Set(["Kombi Tamiri", "Bulaşık Makinesi Tamiri", "Buzdolabı Tamiri", "Çamaşır Makinesi Tamiri", "Fırın Tamiri", "Kurutma Makinesi Tamiri", "Klima Tamiri", "Klima Montajı", "Televizyon Tamiri", "Derin Dondurucu Tamiri", "Klima Bakımı"]),
          },
          {
            title: "2/3 • İl seç",
            items: [
              "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin",
              "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
              "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan",
              "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "İstanbul",
            ],
            selected: new Set(["Bitlis", "Çanakkale", "İstanbul"]),
          },
          {
            title: "3/3 • İlçe seç",
            heading: "İstanbul",
            items: [
              "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir",
              "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy",
              "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane",
              "Kartal", "Küçükçekmece", "Maltepe",
            ],
            selected: new Set(["Esenyurt"]),
          },
        ];
      }

      function growthChoiceButton(label, selected) {
        return `<button class="growth-choice ${selected ? "is-selected" : ""}" type="button">${icon(selected ? "check" : "plus")} ${label}</button>`;
      }

      function renderGrowthPackageBuilder() {
        const stepIndex = Math.max(0, Math.min(2, (state.growthPackageStep || 1) - 1));
        const step = growthBuilderSteps()[stepIndex];
        const dots = [0, 1, 2].map((dot) => `<span class="${dot === stepIndex ? "active" : ""}"></span>`).join("");
        return `
          ${header("growthPackageBuilder", true)}
          <div class="growth-page">
            <section class="growth-builder-head">
              <span class="growth-builder-icon">${icon("package")}</span>
              <span class="growth-advantage">Hacim Avantajı</span>
              <h2>Toplu Talep Paketi</h2>
              <p>Kotanı belirle, düzenli işleri görüntüle.</p>
            </section>
            <div class="growth-step-row">
              <strong>${step.title}</strong>
              <span class="growth-dots" aria-hidden="true">${dots}</span>
            </div>
            <section class="growth-choice-panel">
              ${step.heading ? `<strong style="display:block;margin-bottom:10px;color:#101828;font-size:13px">${step.heading}</strong>` : ""}
              <div class="growth-choice-group">
                ${step.items.map((item) => growthChoiceButton(item, step.selected.has(item))).join("")}
              </div>
            </section>
            <div class="growth-builder-summary">
              <span>11 sektör → 3 il → 1 ilçe</span>
              <strong>₺399.603</strong>
            </div>
            <button class="growth-primary-cta" type="button" data-growth-next>${stepIndex < 2 ? "Devam Et" : "Ödeme Özetine Geç"}</button>
          </div>
        `;
      }

      function renderGrowthPackageCheckout() {
        const catalog = growthPackageCatalog();
        const active = catalog[state.growthPackageTab] || catalog.demand;
        const isDemand = active.id === "demand";
        const tags = isDemand
          ? ["İstanbul Esenyurt Kombi Tamiri", "İstanbul Esenyurt Bulaşık Makinesi Tamiri", "İstanbul Esenyurt Buzdolabı Tamiri", "İstanbul Esenyurt Çamaşır Makinesi Tamiri", "İstanbul Esenyurt Fırın Tamiri"]
          : [active.selectedLabel, active.title];
        const total = isDemand ? "₺399.602" : active.selectedPrice;
        return `
          ${header("growthPackageCheckout", true)}
          <div class="growth-page">
            <section class="growth-builder-head">
              <span class="growth-builder-icon">${icon(active.iconName)}</span>
              <span class="growth-advantage">${active.advantage}</span>
              <h2>${active.title}</h2>
              <p>${active.desc}</p>
            </section>
            <section class="growth-payment-card">
              <div class="growth-payment-row">
                <span>${icon("credit-card")} Kredi Kartı<br><small style="color:#98a2b3">Kart seçilmedi</small></span>
                <button class="secondary-btn" type="button" style="min-height:34px;padding:0 10px">Kart Ekle</button>
              </div>
              ${isDemand ? `<div class="growth-payment-row"><span>${icon("plus")} EFT ile ödemek istiyorum</span></div>` : ""}
              <div class="growth-payment-row">
                <strong>Seçiminiz</strong>
                <span style="color:#067647;font-size:11px;font-weight:900;text-transform:uppercase">${active.title}</span>
              </div>
              ${isDemand ? `
                <div class="growth-tag-list">
                  ${tags.map((tag) => `<span>${tag}</span>`).join("")}
                </div>
              ` : `
                <div class="growth-payment-row">
                  <span><strong>${active.selectedLabel}</strong><br><small style="color:#98a2b3">${active.options[0].note || "Seçili paket"}</small></span>
                  <span class="growth-price"><small>Tutar</small>${active.selectedPrice}</span>
                </div>
              `}
              <div style="border-radius:8px;background:#f9fafb;padding:12px;color:#344054;font-size:12px;line-height:1.4">
                Bu seçimle <strong>${active.title}</strong> paketinin <strong>${active.selectedLabel}</strong> seçeneğini satın alacaksınız.
              </div>
            </section>
            <button class="growth-primary-cta" type="button" data-growth-complete>
              <span style="float:left">Ödemeyi Tamamla</span>
              <span style="float:right">${total}</span>
            </button>
          </div>
        `;
      }

      function renderShell() {
        initRouter();
        renderRoute(getCurrentRoute(), { replace: true });
      }

      function renderSidePanel() {
        const list = document.getElementById("screenList");
        if (!list) return;
        list.innerHTML = screens
          .map((screen) => `
            <button class="screen-link ${state.screen === screen.id ? "active" : ""}" type="button" data-screen="${screen.id}" title="${screen.desc}">
              <span>${icon(screen.icon)}${screen.label}</span>
              <small>${screen.short}</small>
            </button>
          `)
          .join("");
      }

      function renderBottomNav() {
        const nav = document.getElementById("bottomNav");
        if (!nav) return;
        nav.innerHTML = renderBottomBar({
          items: bottomItems,
          activeScreen: state.screen,
          ctaVariant: getCtaVariant(getRouteForScreen(state.screen)),
          icon,
          badgeSnapshot: bottomBadgeSnapshot,
        });
      }

      function header(titleId, back = false) {
        const [title, subtitle] = mainTitles[titleId] || mainTitles.home;
        if (titleId === "home") {
          return `
            <header class="app-header home-header">
              <button class="icon-btn" type="button" data-open="menu" aria-label="Menü">${icon("menu")}</button>
              ${navAlertTicker()}
              <div class="header-actions">
                <button class="icon-btn notification-btn" type="button" data-screen="notifications" aria-label="Bildirimler">${icon("bell")}${notificationUnreadCount() ? '<span class="header-notify-dot"></span>' : ""}</button>
                <button class="icon-btn" type="button" data-screen="profile" aria-label="Profil">${icon("user")}</button>
              </div>
            </header>
          `;
        }
        if (back) {
          return `
            <div class="back-head">
              <button class="back-btn" type="button" data-screen="home" aria-label="Ana sayfaya dön">${icon("chevron-left")}</button>
              <div class="app-title">
                <h2>${title}</h2>
                <p>${subtitle}</p>
              </div>
            </div>
          `;
        }
        return `
          <header class="app-header">
            <div class="row" style="gap:8px;justify-content:flex-start;flex:1">
              <button class="icon-btn" type="button" data-open="menu" aria-label="Menü">${icon("menu")}</button>
              <div class="app-title">
                <h2>${title}</h2>
                <p>${subtitle}</p>
              </div>
            </div>
            <div class="header-actions">
              <button class="icon-btn notification-btn" type="button" data-screen="notifications" aria-label="Bildirimler">${icon("bell")}${notificationUnreadCount() ? '<span class="header-notify-dot"></span>' : ""}</button>
              <button class="icon-btn" type="button" data-screen="profile" aria-label="Profil">${icon("user")}</button>
            </div>
          </header>
        `;
      }

      function renderScreen(options = {}) {
        const root = document.getElementById("appRoot");
        const previousScrollTop = root.scrollTop;
        const screenMap = {
          home: renderHome,
          work: renderWork,
          jobs: renderJobs,
          calendar: renderCalendar,
          wallet: () => pageRoutes["/wallet"]({ state, icon }),
          profile: renderProfile,
          about: () => pageRoutes["/about"](),
          photoGallery: () => pageRoutes["/photo-gallery"](),
          services: renderServices,
          regions: renderRegions,
          workPlan: renderWorkPlan,
          team: () => pageRoutes["/team"](),
          capacity: renderCapacity,
          strategy: () => pageRoutes["/strategy"](),
          accountSettings: () => pageRoutes["/account-settings"](),
          notificationSettings: () => pageRoutes["/notification-settings"](),
          contactSettings: () => pageRoutes["/contact-settings"](),
          invoices: renderInvoices,
          incomeExpense: renderIncomeExpense,
          bonus: renderBonus,
          support: () => pageRoutes["/support"]({ state, icon }),
          messages: () => pageRoutes["/support"]({ state, icon }),
          referral: renderReferral,
          jobReferral: () => pageRoutes["/job-referral"]({ state, icon }),
          referralList: renderReferralList,
          referralEarnings: renderReferralEarnings,
          growthPackages: renderGrowthPackages,
          growthPackageBuilder: renderGrowthPackageBuilder,
          growthPackageCheckout: renderGrowthPackageCheckout,
          subscription: renderSubscription,
          levels: () => pageRoutes["/leaderboard"]({ state, icon }),
          reviews: () => pageRoutes["/reviews"]({ state, icon }),
          customers: renderCustomers,
          appointmentLink: renderAppointmentLink,
          performanceScore: renderPerformanceScore,
          notifications: () => pageRoutes["/notifications"]({ state, icon }),
        };
        root.innerHTML = (screenMap[state.screen] || renderHome)();
        root.scrollTop = options.preserveScroll ? previousScrollTop : 0;
        initTaskRail();
        initSmartStatusCard();
        initRegionActivityTicker();
        initReviewInfiniteScroll();
        initReferralInfiniteScroll();
        initNotificationInfiniteScroll();
        initReferralTaskCarousel();
        fitTextToContainer(root);
        renderSidePanel();
        renderBottomNav();
      }

      function applyReferralSearchFilter() {
        const search = (state.referralSearch || "").toLocaleLowerCase("tr-TR").trim();
        const rows = Array.from(document.querySelectorAll("[data-referral-list-row]"));
        const emptyNote = document.querySelector("[data-referral-search-empty]");
        const loadNote = document.querySelector("[data-referral-load-note]");
        let visibleCount = 0;

        rows.forEach((row) => {
          const haystack = (row.dataset.referralSearchText || row.textContent || "").toLocaleLowerCase("tr-TR");
          const index = parseInt(row.dataset.referralListIndex || "0", 10);
          const withinLoadedRange = index < state.referralVisibleCount;
          const matchesSearch = !search || haystack.indexOf(search) > -1;
          const isVisible = matchesSearch && (search || withinLoadedRange);
          row.hidden = !isVisible;
          if (isVisible) visibleCount += 1;
        });

        if (emptyNote) {
          emptyNote.hidden = visibleCount > 0;
        }

        if (loadNote) {
          loadNote.hidden = true;
        }
      }

      function initRegionActivityTicker() {
        if (regionActivityTimer) {
          clearInterval(regionActivityTimer);
          regionActivityTimer = null;
        }

        const activity = document.querySelector("[data-region-activity]");
        if (!activity) return;

        let index = 0;
        activity.textContent = regionActivityMessages[index];
        activity.classList.add("is-rolling");
        regionActivityTimer = setInterval(() => {
          index = (index + 1) % regionActivityMessages.length;
          activity.textContent = regionActivityMessages[index];
          activity.classList.remove("is-rolling");
          void activity.offsetWidth;
          activity.classList.add("is-rolling");
        }, 5200);
      }

      function initReviewInfiniteScroll() {
        const root = document.getElementById("appRoot");
        if (!root || root.dataset.reviewInfiniteBound === "true") return;
        root.dataset.reviewInfiniteBound = "true";
        root.addEventListener("scroll", () => {
          if (state.screen !== "reviews" || reviewLoadTimer) return;
          const note = root.querySelector("[data-review-load-note]");
          if (!note || note.textContent.includes("Tüm")) return;
          const remaining = root.scrollHeight - root.scrollTop - root.clientHeight;
          if (remaining > 90) return;
          reviewLoadTimer = window.setTimeout(() => {
            state.reviewVisibleCount += 2;
            reviewLoadTimer = null;
            renderScreen({ preserveScroll: true });
          }, 220);
        });
      }

      function initReferralInfiniteScroll() {
        const root = document.getElementById("appRoot");
        if (!root || root.dataset.referralInfiniteBound === "true") return;
        root.dataset.referralInfiniteBound = "true";
        root.addEventListener("scroll", () => {
          if (state.screen !== "referralList" || referralLoadTimer) return;
          const note = root.querySelector("[data-referral-load-note]");
          if (!note || note.dataset.complete === "true") return;
          const remaining = root.scrollHeight - root.scrollTop - root.clientHeight;
          if (remaining > 110) return;
          referralLoadTimer = window.setTimeout(() => {
            state.referralVisibleCount += 4;
            referralLoadTimer = null;
            renderScreen({ preserveScroll: true });
          }, 180);
        });
      }

      function initNotificationInfiniteScroll() {
        const root = document.getElementById("appRoot");
        if (!root || root.dataset.notificationInfiniteBound === "true") return;
        root.dataset.notificationInfiniteBound = "true";
        root.addEventListener("scroll", () => {
          if (state.screen !== "notifications" || notificationLoadTimer || state.notificationsCleared) return;
          const note = root.querySelector("[data-notification-load-note]");
          if (!note || note.dataset.complete === "true") return;
          const remaining = root.scrollHeight - root.scrollTop - root.clientHeight;
          if (remaining > 110) return;
          notificationLoadTimer = window.setTimeout(() => {
            state.notificationVisibleCount += 4;
            notificationLoadTimer = null;
            renderScreen({ preserveScroll: true });
          }, 180);
        });
      }

      function initReferralTaskCarousel() {
        const rail = document.querySelector("[data-referral-task-rail]");
        if (!rail) return;

        const cards = Array.from(rail.querySelectorAll(".referral-task-card"));
        const dots = Array.from(document.querySelectorAll("[data-referral-task-dots] span"));
        if (!cards.length || !dots.length) return;

        let snapTimer = null;
        let isDragging = false;
        let dragStarted = false;
        let startX = 0;
        let startScrollLeft = 0;
        let startIndex = 0;
        let lastDeltaX = 0;
        const dragSnapThreshold = 6;
        const closestIndex = () => {
          let index = 0;
          let closestDistance = Infinity;
          cards.forEach((card, cardIndex) => {
            const distance = Math.abs(card.offsetLeft - rail.scrollLeft);
            if (distance < closestDistance) {
              closestDistance = distance;
              index = cardIndex;
            }
          });
          return index;
        };
        const snapToIndex = (index) => {
          const nextIndex = Math.max(0, Math.min(cards.length - 1, index));
          rail.scrollTo({ left: cards[nextIndex].offsetLeft, behavior: "smooth" });
          dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === nextIndex));
        };
        const setActive = () => {
          const activeIndex = closestIndex();
          dots.forEach((dot, index) => dot.classList.toggle("active", index === activeIndex));
        };

        const snapToNearest = () => {
          snapToIndex(closestIndex());
        };

        const stopDrag = (event) => {
          if (!isDragging) return;
          isDragging = false;
          rail.classList.remove("is-dragging");
          if (event && rail.releasePointerCapture) {
            try { rail.releasePointerCapture(event.pointerId); } catch (error) {}
          }
          if (dragStarted) {
            rail.dataset.wasDragged = "true";
            window.setTimeout(() => {
              delete rail.dataset.wasDragged;
            }, 120);
          }
          if (Math.abs(lastDeltaX) >= dragSnapThreshold) {
            snapToIndex(startIndex + (lastDeltaX < 0 ? 1 : -1));
          } else {
            snapToNearest();
          }
        };

        rail.addEventListener("pointerdown", (event) => {
          if (event.pointerType && event.pointerType !== "mouse") return;
          if (event.button !== 0) return;
          isDragging = true;
          dragStarted = false;
          startX = event.clientX;
          startScrollLeft = rail.scrollLeft;
          startIndex = closestIndex();
          lastDeltaX = 0;
          rail.classList.add("is-dragging");
          if (rail.setPointerCapture) rail.setPointerCapture(event.pointerId);
        });

        rail.addEventListener("pointermove", (event) => {
          if (!isDragging) return;
          const deltaX = event.clientX - startX;
          lastDeltaX = deltaX;
          if (Math.abs(deltaX) > 1) dragStarted = true;
          rail.scrollLeft = startScrollLeft - deltaX;
          if (dragStarted) event.preventDefault();
        });

        rail.addEventListener("pointerup", stopDrag);
        rail.addEventListener("pointercancel", stopDrag);
        rail.addEventListener("mouseleave", stopDrag);
        rail.addEventListener("click", (event) => {
          if (rail.dataset.wasDragged === "true") {
            event.preventDefault();
            event.stopPropagation();
            delete rail.dataset.wasDragged;
          }
        }, true);

        rail.addEventListener("scroll", () => {
          setActive();
          if (isDragging) return;
          if (snapTimer) clearTimeout(snapTimer);
          snapTimer = window.setTimeout(snapToNearest, 120);
        }, { passive: true });
        setActive();
      }

      function initSmartStatusCard() {
        if (smartStatusTimer) {
          clearInterval(smartStatusTimer);
          smartStatusTimer = null;
        }

        const card = document.querySelector("[data-smart-status-card]");
        const panel = document.querySelector("[data-smart-status-panel]");
        const dots = Array.from(document.querySelectorAll("[data-smart-status-dot]"));
        if (!card || !panel || taskCards.length < 2) return;

        let index = 0;
        const renderStatus = (nextIndex) => {
          const task = taskCards[nextIndex];
          card.style.setProperty("--smart-color", task.color);
          card.style.setProperty("--smart-bg", task.bg);
          panel.dataset.taskDetail = task.key;
          panel.innerHTML = smartStatusPanel(task);
          panel.classList.remove("is-entering");
          void panel.offsetWidth;
          panel.classList.add("is-entering");
          dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === nextIndex));
        };

        const start = () => {
          if (smartStatusTimer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          smartStatusTimer = setInterval(() => {
            index = (index + 1) % taskCards.length;
            renderStatus(index);
          }, 6000);
        };

        const stop = () => {
          if (!smartStatusTimer) return;
          clearInterval(smartStatusTimer);
          smartStatusTimer = null;
        };

        card.addEventListener("mouseenter", stop);
        card.addEventListener("mouseleave", start);
        card.addEventListener("focusin", stop);
        card.addEventListener("focusout", start);
        start();
      }

      function initTaskRail() {
        if (taskRailAutoTimer) {
          clearInterval(taskRailAutoTimer);
          taskRailAutoTimer = null;
        }

        const rail = document.querySelector("[data-task-rail]");
        if (!rail) return;

        const cards = Array.from(rail.querySelectorAll(".task-card"));
        const realCards = cards.filter((card) => card.dataset.loopClone !== "true");
        const dots = Array.from(document.querySelectorAll("[data-task-dot]"));
        const realCount = realCards.length;
        let activeIndex = 0;
        let loopResetFrame = null;
        let loopResetTimer = null;

        const setActiveDot = (index) => {
          if (!dots.length) return;
          const dotIndex = realCount ? ((index % realCount) + realCount) % realCount : 0;
          dots.forEach((dot, currentIndex) => dot.classList.toggle("active", currentIndex === dotIndex));
        };

        const scrollToCard = (index, behavior = "smooth") => {
          if (!cards.length) return;
          const nextIndex = Math.max(0, Math.min(cards.length - 1, index));
          activeIndex = realCount ? nextIndex % realCount : nextIndex;
          rail.scrollTo({ left: cards[nextIndex].offsetLeft, behavior });
          setActiveDot(nextIndex);
        };

        const resetLoopStart = () => {
          if (!realCount) return;
          if (loopResetFrame) {
            cancelAnimationFrame(loopResetFrame);
            loopResetFrame = null;
          }
          if (loopResetTimer) {
            clearTimeout(loopResetTimer);
            loopResetTimer = null;
          }
          activeIndex = 0;
          rail.classList.add("is-loop-reset");
          rail.scrollLeft = realCards[0].offsetLeft;
          setActiveDot(0);
          requestAnimationFrame(() => {
            rail.classList.remove("is-loop-reset");
          });
        };

        const scheduleLoopReset = () => {
          if (!realCount || !cards[realCount]) return;
          if (loopResetFrame) cancelAnimationFrame(loopResetFrame);
          if (loopResetTimer) clearTimeout(loopResetTimer);

          const targetLeft = cards[realCount].offsetLeft;
          const startedAt = performance.now();
          const waitForClone = () => {
            const reachedClone = Math.abs(rail.scrollLeft - targetLeft) < 3;
            const timedOut = performance.now() - startedAt > 950;
            if (reachedClone || timedOut) {
              loopResetFrame = null;
              resetLoopStart();
              return;
            }
            loopResetFrame = requestAnimationFrame(waitForClone);
          };

          loopResetFrame = requestAnimationFrame(waitForClone);
          loopResetTimer = setTimeout(resetLoopStart, 1050);
        };

        const updateDots = () => {
          if (!cards.length || !dots.length || !realCount) return;
          const center = rail.scrollLeft + rail.clientWidth / 2;
          let nextActiveIndex = 0;
          let closestDistance = Infinity;
          cards.forEach((card, index) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(center - cardCenter);
            if (distance < closestDistance) {
              closestDistance = distance;
              nextActiveIndex = index;
            }
          });
          activeIndex = nextActiveIndex % realCount;
          setActiveDot(nextActiveIndex);
        };

        const startAutoSlide = () => {
          if (realCount < 2) return;
          taskRailAutoTimer = setInterval(() => {
            updateDots();
            if (activeIndex >= realCount - 1) {
              scrollToCard(realCount, "smooth");
              scheduleLoopReset();
              return;
            }
            scrollToCard(activeIndex + 1, "smooth");
          }, 5000);
        };

        let pointerDown = false;
        let startX = 0;
        let startScrollLeft = 0;
        let startIndex = 0;
        let moved = false;
        let suppressClick = false;
        let ticking = false;

        rail.addEventListener("scroll", () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            updateDots();
            ticking = false;
          });
        });

        rail.addEventListener("pointerdown", (event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          if (taskRailAutoTimer) {
            clearInterval(taskRailAutoTimer);
            taskRailAutoTimer = null;
          }
          updateDots();
          pointerDown = true;
          moved = false;
          startX = event.clientX;
          startScrollLeft = rail.scrollLeft;
          startIndex = activeIndex;
          rail.classList.add("is-dragging");
          if (rail.setPointerCapture) rail.setPointerCapture(event.pointerId);
        });

        rail.addEventListener("pointermove", (event) => {
          if (!pointerDown) return;
          const delta = event.clientX - startX;
          if (Math.abs(delta) > 4) moved = true;
          if (moved) {
            rail.scrollLeft = startScrollLeft - delta;
            event.preventDefault();
          }
        });

        const finishDrag = (event) => {
          if (!pointerDown) return;
          pointerDown = false;
          rail.classList.remove("is-dragging");
          if (rail.releasePointerCapture) rail.releasePointerCapture(event.pointerId);
          if (moved) {
            suppressClick = true;
            const delta = event.clientX - startX;
            const targetIndex = delta < 0 ? startIndex + 1 : startIndex - 1;
            if (targetIndex >= realCount) {
              scrollToCard(realCount);
              scheduleLoopReset();
            } else {
              scrollToCard(targetIndex);
            }
            setTimeout(() => {
              suppressClick = false;
            }, 220);
          } else {
            scrollToCard(activeIndex);
          }
          startAutoSlide();
        };

        rail.addEventListener("pointerup", finishDrag);
        rail.addEventListener("pointercancel", finishDrag);
        rail.addEventListener("click", (event) => {
          if (!suppressClick) return;
          event.preventDefault();
          event.stopPropagation();
        }, true);

        updateDots();
        scrollToCard(activeIndex, "auto");
        startAutoSlide();
      }

      function renderHome() {
        return `
          ${header("home")}
          ${performanceScoreCard()}
          ${walletSummary()}

          <section class="card card-pad section region-home-card">
            <div class="region-card-head">
              <h3>Bölgendeki İşler</h3>
              <div class="region-filter-row" aria-label="Bölge iş tarihi filtreleri">
                ${["Bugün", "Dün"].map((d) => `<button class="chip-btn ${state.regionFilter === d ? "active" : ""}" type="button" data-region-filter="${d}">${d}</button>`).join("")}
              </div>
            </div>
            <div class="kpi-row">
              <div class="kpi-tile"><span>Partnerler</span><strong>34</strong><em class="region-kpi-icon">${icon("users")}</em></div>
              <div class="kpi-tile"><span>Tamamlanan İş</span><strong>${regionJobCount()}</strong><em class="region-kpi-icon">${icon("briefcase")}</em></div>
              <div class="kpi-tile"><span>Teklifler</span><strong>128</strong><em class="region-kpi-icon">${icon("file-text")}</em></div>
            </div>
            <p class="region-activity" data-region-activity aria-live="polite">${regionActivityMessages[0]}</p>
          </section>

        `;
      }

      function renderPerformanceScore() {
        return `
          <header class="performance-appbar">
            <button class="back-btn" type="button" data-action="go-back" aria-label="Geri dön">${icon("chevron-left")}</button>
            <h2>Performans Skoru</h2>
            <button class="icon-btn" type="button" data-open="performance-info" aria-label="Performans skoru bilgisi">${icon("help-circle")}</button>
          </header>

          <section class="card card-pad performance-hero">
            <div class="performance-hero-main">
              <span class="performance-score-icon">${icon("trend-up")}</span>
              <span class="performance-hero-score">
                <strong>${performanceScore.score}</strong> <small>/ 100</small>
                <span class="score-level" style="margin-top:5px">${performanceScore.level}</span>
              </span>
              <span class="performance-visibility">${icon("trend-up")} Daha fazla iş almanı sağlar</span>
            </div>
            ${scoreProgressBar(performanceScore.score, performanceScore.nextTarget)}
            <div class="performance-motivation">${icon("trend-up")} ${performanceScore.nextTargetText}</div>
          </section>

          <div class="section-title"><h3>Skoru Etkileyen Alanlar</h3><button class="performance-info-btn" type="button" data-open="performance-info" aria-label="Skor hesabı">${icon("help-circle")}</button></div>
          <div class="factor-list">
            ${performanceScore.factors.map((factor) => performanceFactorRow(factor)).join("")}
          </div>

          <div class="section-title"><h3>Skorunu Artırmak İçin</h3><span>Hızlı aksiyonlar</span></div>
          <div class="performance-action-list">
            ${performanceScore.actions.map((action) => performanceActionRow(action)).join("")}
          </div>

          <div class="section-title"><h3>Skor Seviyeleri ve Kazanımlar</h3><span>Yakın hedef</span></div>
          <div class="reward-row">
            ${performanceScore.rewards.map((reward) => performanceRewardCard(reward)).join("")}
          </div>

          <section class="performance-safe-note section">
            ${icon("check")}
            <span>Müşteri kaynaklı iptal, müşterinin telefonu açmaması ve sistemsel hatalar skorunu düşürmez.</span>
          </section>
        `;
      }

      function regionJobCount() {
        return { "Bugün": "18 iş", "Dün": "22 iş", "Son 7 Gün": "146 iş", "Son 30 Gün": "612 iş" }[state.regionFilter] || "18 iş";
      }

      function jobCard(job) {
        return `
          <article class="card job-card ${job.className || ""} ${job.detail ? "clickable" : ""}" ${job.detail ? 'data-open="job-detail"' : ""}>
            <div class="job-top">
              <div class="job-title">
                <span class="tag ${job.tagClass || "gray"}">${job.type}</span>
                <h3>${job.title}</h3>
                <div class="meta-line">${icon("map-pin")} ${job.area}</div>
              </div>
              ${icon("chevron-right")}
            </div>
            <div class="stack" style="gap:5px">
              ${(job.notes || []).map((note) => `<div class="meta-line">${icon("check")} ${note}</div>`).join("")}
            </div>
            <div class="price-box">
              <div class="price-line"><span>Normal</span><strong>${job.normal}</strong></div>
              <div class="price-line"><span>Paket fiyatın</span><strong>${job.partner}</strong></div>
              <div class="price-line discount"><span>İndirim</span><strong>${job.discount || "%18"}</strong></div>
              <div class="price-line save"><span>Tasarruf</span><strong>${job.saving}</strong></div>
              ${job.used ? `<div class="price-line"><span>Kullanılan</span><strong>${job.used}</strong></div>` : ""}
            </div>
            <div class="action-row">
              <button class="primary-btn" type="button" data-action="${job.primaryAction || "call"}">${job.primaryIcon ? icon(job.primaryIcon) : icon("phone")} ${job.primary}</button>
              <button class="secondary-btn" type="button" data-action="${job.secondaryAction || "issue"}">${job.secondaryIcon ? icon(job.secondaryIcon) : icon("alert")} ${job.secondary}</button>
            </div>
          </article>
        `;
      }

      function renderWork() {
        const pool = state.workTab === "pool";
        return `
          ${header("work")}
          <div class="segmented">
            <button type="button" class="${pool ? "active" : ""}" data-set-work-tab="pool">Havuzdaki İşler</button>
            <button type="button" class="${!pool ? "active" : ""}" data-set-work-tab="offers">Teklif Verilecekler</button>
          </div>
          <section class="callout ${pool ? "soft" : ""}" style="margin-bottom:10px">
            <div class="row">
              <div>
                <h3>${pool ? "Havuzdaki İşler" : "Teklif Verilecekler"}</h3>
                <p>${pool ? "Kalan havuz haklarınla bekleyen işleri alabilirsin. Ücretli paketler daha fazla hak ve görünürlük sağlar." : "Kalan teklif haklarınla müşterilere dönüş yapabilirsin. Ücretli paketler daha fazla teklif fırsatı açar."}</p>
              </div>
              ${pool ? `<button class="secondary-btn" type="button" data-open="pool-info" style="min-height:44px;padding:0 12px">Havuz nedir?</button>` : ""}
            </div>
          </section>
          ${
            pool
              ? `
                ${jobCard({
                  type: "Havuz",
                  tagClass: "amber",
                  title: "Buzdolabı Tamiri",
                  area: "Bursa / Karacabey",
                  notes: ["Talep: Bugün 13:40", "Son teyit: 13:55", "Hâlâ servis istiyor: Evet", "Müşteri kaynaklı iptalde nakit iade"],
                  normal: "280 kredi",
                  partner: "230 kredi",
                  discount: "%18 indirim",
                  saving: "50 kredi",
                  primary: "Havuzdan Al",
                  primaryIcon: "briefcase",
                  primaryAction: "take-pool",
                  secondary: "Detay",
                  secondaryIcon: "search",
                  secondaryAction: "detail",
                  detail: true,
                })}
                ${jobCard({
                  type: "Havuz",
                  tagClass: "amber",
                  title: "Koltuk Yıkama",
                  area: "İzmir / Bornova",
                  notes: ["Talep: Bugün 12:25", "Son teyit: 12:48", "Hâlâ servis istiyor: Evet", "Nakit iade güvencesi"],
                  normal: "210 kredi",
                  partner: "175 kredi",
                  discount: "%17 indirim",
                  saving: "35 kredi",
                  primary: "Havuzdan Al",
                  primaryIcon: "briefcase",
                  primaryAction: "take-pool",
                  secondary: "Detay",
                  secondaryIcon: "search",
                  secondaryAction: "detail",
                })}
              `
              : `
                ${offerCard("Ev Temizliği", "Mersin / Yenişehir", "2 / 5", "120 kredi", "90 kredi", "30 kredi", "Bugün 11:20", "₺2.000-₺2.800")}
                ${offerCard("Ofis Fotoğraf Çekimi", "İstanbul / Kadıköy", "1 / 4", "160 kredi", "120 kredi", "40 kredi", "Dün 18:10", "₺5.000")}
                ${offerCard("Şehir İçi Nakliye", "Ankara / Çankaya", "3 / 6", "180 kredi", "140 kredi", "40 kredi", "Bugün 09:35", "Belirtilmedi")}
              `
          }
        `;
      }

      function offerCard(title, area, count, normal, partner, saving, time, budget) {
        return `
          <article class="card job-card">
            <div class="job-top">
              <div class="job-title">
                <span class="tag blue">Teklif</span>
                <h3>${title}</h3>
                <div class="meta-line">${icon("map-pin")} ${area}</div>
              </div>
              ${icon("edit")}
            </div>
            <div class="stack" style="gap:5px">
              <div class="meta-line">${icon("message")} Müşteri teklif toplamak istiyor</div>
              <div class="meta-line">${icon("clock")} Talep zamanı: ${time}</div>
              <div class="meta-line">${icon("users")} Teklif sayısı: ${count}</div>
              <div class="meta-line">${icon("check")} Telefon doğrulandı</div>
              <div class="meta-line">${icon("wallet")} Müşteri bütçesi: ${budget}</div>
            </div>
            <div class="price-box">
              <div class="price-line"><span>Normal</span><strong>${normal}</strong></div>
              <div class="price-line"><span>Paket fiyatın</span><strong>${partner}</strong></div>
              <div class="price-line save"><span>Tasarruf</span><strong>${saving}</strong></div>
              <div class="price-line discount"><span>Kullanım</span><strong>1 teklif hakkı</strong></div>
            </div>
            <div class="action-row">
              <button class="primary-btn" type="button" data-open="offer">${icon("edit")} Teklif Ver</button>
              <button class="secondary-btn" type="button" data-action="detail">${icon("search")} Detay</button>
            </div>
          </article>
        `;
      }

      function renderJobs() {
        const tabs = ["Yeni İşler", "Aktif", "Tekliflerim", "Tamamlanan", "Sorunlu"];
        const ids = ["incoming", "active", "offers", "done", "issues"];
        const tabButtons = tabs.map((tab, i) => `<button class="tab-pill ${state.jobsTab === ids[i] ? "active" : ""}" type="button" data-set-jobs-tab="${ids[i]}">${tab}</button>`).join("");
        const bodies = {
          incoming: `
            <article class="card job-card priority-card clickable" data-open="job-detail">
              <div class="job-top"><div class="job-title"><span class="tag green">Yeni İş</span><h3>Klima Montajı</h3><div class="meta-line">${icon("map-pin")} Sakarya / Karasu</div></div>${icon("chevron-right")}</div>
              <div class="kpi-row">
                <div class="kpi-tile"><span>Talep zamanı</span><strong>Bugün 15:12</strong></div>
                <div class="kpi-tile"><span>Son teyit</span><strong>15:18</strong></div>
                <div class="kpi-tile"><span>Servis istiyor</span><strong>Evet</strong></div>
              </div>
              <div class="meta-line" style="margin-top:9px">${icon("check")} Müşteri servis ücretini biliyor · 260 kredi kullanıldı</div>
              <div class="assurance-line" style="margin-top:7px">${icon("check")} Müşteri kaynaklı iptalde nakit iade güvencesi görünür.</div>
              <div class="action-row" style="margin-top:10px"><button class="primary-btn" type="button" data-action="call">${icon("phone")} Müşteriyi Ara</button><button class="secondary-btn" type="button" data-action="issue">${icon("alert")} Sorun Bildir</button></div>
            </article>
          `,
          active: `
            <article class="card job-card">
              <div class="job-top"><div class="job-title"><span class="tag blue">Aktif</span><h3>Çamaşır Makinesi Tamiri</h3><div class="meta-line">${icon("map-pin")} Kocaeli / İzmit</div></div></div>
              <div class="meta-line">${icon("message")} Durum: Müşteriyle görüşüldü</div>
              <div class="meta-line">${icon("clock")} Sonraki adım: Randevu saati gir</div>
              <div class="callout soft" style="margin-top:10px;padding:9px"><p>Sonucu bildir, profilin güçlensin. Sonuç bildiren partnerler daha düzenli iş alır.</p></div>
              <button class="primary-btn" type="button" data-open="status" style="width:100%;margin-top:10px">${icon("edit")} Durum Güncelle</button>
            </article>
          `,
          offers: `
            <article class="card job-card">
              <div class="job-top"><div class="job-title"><span class="tag blue">Teklifim</span><h3>Ev Temizliği</h3><div class="meta-line">${icon("credit-card")} Teklifin: ₺2.500</div></div></div>
              <div class="meta-line">${icon("clock")} Müşteri henüz karar vermedi</div>
              <div class="meta-line">${icon("check")} Durum: Görüntülendi</div>
              <button class="secondary-btn" type="button" data-action="detail" style="width:100%;margin-top:10px">${icon("search")} Detay</button>
            </article>
          `,
          done: `
            <article class="card job-card">
              <div class="job-top"><div class="job-title"><span class="tag green">Tamamlandı</span><h3>Petek Temizliği</h3><div class="meta-line">${icon("map-pin")} Eskişehir / Tepebaşı</div></div></div>
              <div class="meta-line">${icon("check")} Tebrikler, işi tamamladın</div>
              <div class="meta-line">${icon("sparkles")} Rozet kazandın: Sonuç Bildiren Partner</div>
              <div class="meta-line">${icon("credit-card")} Kullanılan: 190 kredi</div>
            </article>
          `,
          issues: `
            <article class="card job-card">
              <div class="job-top"><div class="job-title"><span class="tag red">Sorunlu</span><h3>Numara hatalı</h3><div class="meta-line">${icon("clock")} İncelemede · LP-28491</div></div></div>
              <button class="secondary-btn" type="button" data-screen="support" style="width:100%;margin-top:10px">${icon("headphones")} Durumu Takip Et</button>
            </article>
          `,
        };
        return `${header("jobs")}<div class="tab-scroll">${tabButtons}</div>${bodies[state.jobsTab] || bodies.incoming}`;
      }

      function renderCalendar() {
        return `
          ${header("calendar")}
          <div class="section-title"><h3>Bugünkü Randevular</h3><span>3 kayıt</span></div>
          <section class="card card-pad stack">
            ${appointment("10:00", "Ayşe Hanım", "Saç Boya", "Elif")}
            ${appointment("11:30", "Mehmet Bey", "Sakal Tıraşı", "Ali")}
            ${appointment("14:00", "Zeynep Hanım", "Fön", "Elif")}
          </section>
          <div class="section-title"><h3>Çalışanlar</h3><span>Müsaitlik</span></div>
          <section class="card card-pad stack">
            ${worker("Elif", "09:00-18:00", "3 randevu")}
            ${worker("Ali", "10:00-20:00", "2 randevu")}
          </section>
          <section class="card card-pad section">
            <div class="row"><h3 style="font-size:16px;margin:0">Hizmet Süreleri</h3><span class="tag purple">Kuaför</span></div>
            <div class="mini-table" style="margin-top:8px">
              <div class="mini-row"><span>Saç Boya</span><strong>90 dk</strong></div>
              <div class="mini-row"><span>Fön</span><strong>30 dk</strong></div>
              <div class="mini-row"><span>Sakal Tıraşı</span><strong>25 dk</strong></div>
            </div>
            <div class="chip-row" style="margin-top:10px">
              <span class="tag red">Elif 10:00 dolu</span>
              <span class="tag green">Elif 16:00 müsait</span>
              <span class="tag green">Ali 15:30 müsait</span>
            </div>
          </section>
          <section class="card card-pad section">
            <div class="row">
              <div>
                <span class="tag purple">${icon("qr")} Randevu Linki</span>
                <h3 style="font-size:16px;margin:8px 0 4px">Müşterilerin senden ücretsiz randevu alsın</h3>
                <p class="tiny muted" style="margin:0">Kendi linkinden gelen müşteriler senin müşterindir. Bu randevulardan komisyon alınmaz.</p>
              </div>
            </div>
            <div class="action-row" style="margin-top:12px">
              <button class="primary-btn" type="button" data-action="share">${icon("share")} Linki Paylaş</button>
              <button class="secondary-btn" type="button" data-open="qr">${icon("qr")} QR Göster</button>
            </div>
          </section>
        `;
      }

      function appointment(time, name, service, staff) {
        return `<div class="appointment"><div class="appointment-main"><strong>${time} ${name}</strong><small>${service} · ${staff}</small></div><span class="tag green">Onaylı</span></div>`;
      }

      function worker(name, hours, count) {
        return `<div class="worker-row"><div class="worker-main"><strong>${name}</strong><small>${hours}</small></div><span class="tag blue">${count}</span></div>`;
      }

      function renderWallet() {
        return `
          ${header("wallet")}
          <section class="card card-pad wallet-hero">
            <span class="tag" style="background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.25);color:#fff">Cüzdan</span>
            <h3 style="margin:8px 0 2px;font-size:18px">675 kredi</h3>
            <p class="tiny muted" style="margin:0">Ücretsiz hesap · Kalan haftalık hakların ve bakiyen.</p>
            <div class="wallet-grid">
              <div class="wallet-mini"><span>Direkt iş</span><strong>3 hak</strong></div>
              <div class="wallet-mini"><span>Havuz</span><strong>1 hak</strong></div>
              <div class="wallet-mini"><span>Teklif</span><strong>4 hak</strong></div>
            </div>
          </section>
          <section class="card card-pad section stack" style="gap:7px">
            <div class="assurance-line">${icon("check")} İş iptali ve nakit iade güvencesi aktif paketle açılır</div>
            <div class="assurance-line">${icon("check")} Hesap hareketlerini anlık takip edebilirsin</div>
            <div class="assurance-line">${icon("check")} Ödeme sonrası uygun işler uygulamada görünür ve sistem hattından aranır</div>
          </section>

          <div class="section-title"><h3>Paket ve Bakiye</h3><span>Ücretsiz</span></div>
          <section class="card card-pad">
            <div class="kpi-row">
              <div class="kpi-tile"><span>Direkt iş</span><strong>3 hak</strong></div>
              <div class="kpi-tile"><span>Havuz</span><strong>1 hak</strong></div>
              <div class="kpi-tile"><span>Teklif</span><strong>4 hak</strong></div>
              <div class="kpi-tile"><span>Kullanılabilir</span><strong>675 kredi</strong></div>
            </div>
            <p class="tiny muted" style="margin:9px 0 0">Plus, Pro ve VIP paketlerde hak adetleri pakete göre artar; güncel limitler paket detayında gösterilir.</p>
          </section>

          <section class="card card-pad section">
            <div class="row">
              <div>
                <span class="tag amber">${icon("wallet")} Bonus Cüzdanı</span>
                <h3 style="font-size:16px;margin:8px 0 2px">240 kredi bonus</h3>
                <p class="tiny muted" style="margin:0">Bonus ve nakit iade ayrı takip edilir.</p>
              </div>
            </div>
            <div class="action-row" style="margin-top:10px">
              <button class="primary-btn" type="button" data-open="bonus-convert">${icon("credit-card")} Bonusu Krediye Çevir</button>
              <button class="secondary-btn" type="button" data-screen="bonus">${icon("search")} Detay</button>
            </div>
          </section>

          <section class="card card-pad section">
            <div class="row">
              <div>
                <span class="tag green">${icon("check")} İade / Nakit İade</span>
                <h3 style="font-size:16px;margin:8px 0 2px">Bekleyen iade: 0 TL</h3>
                <p class="tiny muted" style="margin:0">Müşteri, sistem veya personel kaynaklı hatalarda nakit iade yapılır.</p>
              </div>
            </div>
            <button class="secondary-btn" type="button" data-action="ledger" style="width:100%;margin-top:10px">${icon("list")} İade Geçmişi</button>
          </section>

          <section class="card card-pad section">
            <div class="row">
              <h3 style="font-size:16px;margin:0">Kredi Yükle</h3>
              <span class="tag green">Hızlı bakiye</span>
            </div>
            <div class="action-row" style="margin-top:10px">
              <button class="primary-btn" type="button" data-open="credit">${icon("plus")} Bakiye Yükle</button>
              <button class="secondary-btn" type="button" data-action="ledger">${icon("list")} Kredi Hareketleri</button>
            </div>
          </section>

          <div class="section-title"><h3>Üyelik Paketleri</h3><span>Haftalık hak</span></div>
          ${packageCard("Ücretsiz Hesap", ["Temel haftalık haklar", "Kredi yükleyerek devam etme", "Randevu araçlarına erişim"], false)}
          ${packageCard("Plus", ["Daha fazla haftalık hak", "Havuz ve teklif fırsatlarında daha güçlü kullanım", "Düzenli iş alan ekipler için önerilir"], true)}
          ${packageCard("Pro / VIP", ["Daha yüksek görünürlük", "Genişletilmiş hak havuzu", "Öncelikli destek ve büyüme odağı"], false)}
        `;
      }

      function packageCard(name, features, featured) {
        const isFree = name === "Ücretsiz Hesap";
        return `
          <article class="card package-card ${featured ? "featured" : ""}">
            <div class="row">
              <h3>${name}</h3>
              ${isFree ? '<span class="tag gray">Mevcut</span>' : featured ? '<span class="tag green">Sana uygun</span>' : '<span class="tag gray">Yükselt</span>'}
            </div>
            <ul class="package-features">${features.map((f) => `<li>${icon("check")} ${f}</li>`).join("")}</ul>
            <button class="${featured ? "primary-btn" : "secondary-btn"}" type="button" ${isFree ? 'data-action="current-plan"' : 'data-open="package"'} style="width:100%">${isFree ? icon("check") + " Mevcut Hesap" : (featured ? icon("package") : icon("plus")) + " Paketi Yükselt"}</button>
          </article>
        `;
      }

      const profileMenuItems = [
        {
          label: "Hakkımda",
          route: "/about",
          screen: "about",
          icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
        },
        {
          label: "Fotoğraflarım",
          shortLabel: "Fotoğraf",
          route: "/photo-gallery",
          screen: "photoGallery",
          icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><circle cx="8" cy="9" r="1.5"></circle><path d="M21 15l-5-5L5 19"></path><path d="M14 14l-3-3-5 5"></path></svg>`,
        },
        {
          label: "Hizmetlerim",
          shortLabel: "Hizmet",
          route: "/services",
          screen: "services",
          icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"></path><rect x="3" y="6" width="18" height="14" rx="2"></rect><path d="M3 12h18"></path><rect x="10" y="11" width="4" height="4" rx="1"></rect></svg>`,
        },
        {
          label: "Bölgelerim",
          shortLabel: "Bölge",
          route: "/regions",
          screen: "regions",
          icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12z"></path><circle cx="12" cy="9" r="2.2"></circle></svg>`,
        },
        {
          label: "Saatlerim",
          shortLabel: "Saat",
          route: "/working-hours",
          screen: "workPlan",
          icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l4 2"></path></svg>`,
        },
        {
          label: "Ekibim",
          shortLabel: "Ekip",
          route: "/team",
          screen: "team",
          icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"></circle><path d="M5 20a7 7 0 0 1 14 0"></path><path d="M4.5 14.5a4.5 4.5 0 0 1 4-6.4"></path><path d="M19.5 14.5a4.5 4.5 0 0 0-4-6.4"></path></svg>`,
        },
        {
          label: "Kapasitem",
          shortLabel: "Kapasite",
          route: "/capacity",
          screen: "capacity",
          icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="12" width="3.5" height="7" rx="1"></rect><rect x="10.25" y="8" width="3.5" height="11" rx="1"></rect><rect x="16.5" y="4" width="3.5" height="15" rx="1"></rect></svg>`,
        },
        {
          label: "Stratejim",
          shortLabel: "Strateji",
          route: "/strategy",
          screen: "strategy",
          icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="4"></circle><circle cx="12" cy="12" r="1.2"></circle><path d="M16 8l3-3"></path><path d="M18 5h3v3"></path></svg>`,
        },
      ];

      function PartnerProfileCard() {
        const extraBadges = state.profileBadgesExpanded
          ? `
              <span class="partner-profile-chip-break" aria-hidden="true"></span>
              <span class="partner-profile-chip is-extra">${icon("check")} Sonuç Bildiren</span>
              <span class="partner-profile-chip is-extra">${icon("calendar")} Randevu Düzenli</span>
            `
          : "";

        return `
          <section class="partner-profile-card" aria-label="Partner profil kartı">
            <div class="partner-profile-main">
              <button class="partner-profile-avatar-btn" type="button" aria-label="Profil fotoğrafı ekle">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=220&q=80" alt="Ahmet Kaya profil fotoğrafı" />
                <span class="partner-profile-add" aria-hidden="true">${icon("plus")}</span>
              </button>
              <div class="partner-profile-copy">
                <h3 class="partner-profile-name">Ahmet Kaya</h3>
                <span class="partner-profile-tier">${icon("crown")} Gold Partner</span>
                <span class="partner-profile-rating">${icon("star")} 4.8 Puan <span aria-hidden="true">·</span> 126 Değerlendirme</span>
              </div>
            </div>
            <div class="partner-profile-chips ${state.profileBadgesExpanded ? "is-expanded" : ""}" aria-label="Profil rozetleri">
              <span class="partner-profile-chip">${icon("shield")} Güvenilir</span>
              <span class="partner-profile-chip">${icon("zap")} Hızlı</span>
              <span class="partner-profile-chip">${icon("map-pin")} Bölge Aktif</span>
              <button class="partner-profile-chip is-more" type="button" data-action="toggle-profile-badges" aria-expanded="${state.profileBadgesExpanded ? "true" : "false"}" aria-label="${state.profileBadgesExpanded ? "Ek rozetleri gizle" : "Ek rozetleri göster"}">${state.profileBadgesExpanded ? "−" : "+2"}</button>
              ${extraBadges}
            </div>
          </section>
        `;
      }

      function ProfileMenuGrid() {
        return `
          <section class="profile-menu-section" aria-label="Müşteriye görünen profil menüleri">
            <div class="profile-menu-grid" id="profileMenuGrid">
              ${profileMenuItems.map((item) => {
                const actionAttrs = item.screen
                  ? `data-screen="${item.screen}"`
                  : `data-action="profile-shortcut" data-label="${item.label}"`;
                return `
                  <button
                    type="button"
                    class="profile-menu-card"
                    ${actionAttrs}
                    data-route="${item.route}"
                    aria-label="${item.label}"
                  >
                    <span class="profile-menu-icon-wrap" aria-hidden="true">${item.icon}</span>
                    <span class="profile-menu-label">${item.shortLabel || item.label}</span>
                  </button>
                `;
              }).join("")}
            </div>
          </section>
        `;
      }

      function ProfileStrengthCard() {
        return `
          <section class="profile-strength-card" aria-label="Profilini güçlendir">
            <div class="card-header">
              <h2 class="card-title">Profilini Güçlendir</h2>
              <p class="card-subtitle">Daha fazla iş almak için profilini tamamla.</p>
              <svg class="top-illustration" viewBox="0 0 180 120" aria-hidden="true">
                <circle cx="126" cy="42" r="36" fill="#dff8ef"></circle>
                <path d="M36 88C72 76 106 58 150 14" fill="none" stroke="#49c889" stroke-width="7" stroke-linecap="round"></path>
                <path d="M142 12l17-4-4 17" fill="none" stroke="#49c889" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"></path>
                <rect x="92" y="76" width="20" height="32" rx="4" fill="#cff3e5"></rect>
                <rect x="120" y="62" width="20" height="46" rx="4" fill="#cff3e5"></rect>
                <rect x="148" y="38" width="20" height="70" rx="4" fill="#cff3e5"></rect>
                <path d="M72 108h96" stroke="#d8efe7" stroke-width="2" stroke-linecap="round"></path>
                <path d="M50 37l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#a7f3d0"></path>
                <path d="M20 56l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#a7f3d0"></path>
              </svg>
            </div>

            <div class="card-content">
              <div class="score-panel">
                <div class="score-ring" aria-label="Profil gücü yüzde 82">
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle class="score-track" cx="60" cy="60" r="48"></circle>
                    <circle class="score-progress" cx="60" cy="60" r="48"></circle>
                  </svg>
                  <div class="score-center">
                    <strong class="score-value">82</strong>
                  </div>
                </div>
              </div>
              <span class="divider" aria-hidden="true"></span>
              <div class="checklist-panel">
                <div class="checklist-item">
                  <span class="checklist-icon done" aria-hidden="true">${icon("check")}</span>
                  <span class="checklist-text">Tam boy fotoğraf ekle</span>
                </div>
                <div class="checklist-item">
                  <span class="checklist-icon done" aria-hidden="true">${icon("check")}</span>
                  <span class="checklist-text">Çalışma saatlerini güncelle</span>
                </div>
                <div class="checklist-item">
                  <span class="checklist-icon todo" aria-hidden="true">${icon("plus")}</span>
                  <span class="checklist-text">2 iş fotoğrafı daha ekle</span>
                </div>
              </div>
            </div>

            <button class="preview-button" type="button" data-action="profile-preview">
              ${icon("eye")} Müşteri Profilimi Önizle
            </button>
          </section>
        `;
      }

      function renderProfile() {
        return pageRoutes["/profile"]({ badgesExpanded: state.profileBadgesExpanded });
      }

      function renderProfileMenuPlaceholder(screenId, iconName, items) {
        const [title, subtitle] = mainTitles[screenId] || mainTitles.profile;
        return `
          ${header(screenId, true)}
          <section class="card card-pad section">
            <div class="row" style="justify-content:flex-start;gap:10px">
              <span class="profile-setting-icon" style="--profile-setting-bg:#ecfdf3;--profile-setting-color:#047857">${icon(iconName)}</span>
              <div>
                <h3 style="margin:0;color:#0f172a;font-size:17px;font-weight:900">${title}</h3>
                <p class="body muted" style="margin:4px 0 0">${subtitle}</p>
              </div>
            </div>
          </section>
          <section class="profile-settings-card section">
            ${items.map((item) => `
              <button class="profile-setting-row" type="button" data-action="profile-shortcut" data-label="${item}">
                <span class="profile-setting-icon">${icon("check")}</span>
                <strong>${item}</strong>
                ${icon("chevron-right")}
              </button>
            `).join("")}
          </section>
        `;
      }

      const renderAbout = () => renderProfileMenuPlaceholder("about", "user", ["Kısa tanıtım", "Uzmanlık açıklaması", "Müşteriye görünen not"]);
      const renderPhotoGallery = () => renderProfileMenuPlaceholder("photoGallery", "list", ["Profil fotoğrafı", "İş fotoğrafları", "Önce / sonra örnekleri"]);
      const renderTeam = () => renderProfileMenuPlaceholder("team", "users", ["Ekip üyeleri", "Yetki ve roller", "Çalışan müsaitliği"]);
      const renderStrategy = () => renderProfileMenuPlaceholder("strategy", "bar-chart", ["Görünürlük hedefi", "Hizmet odakları", "Büyüme önerileri"]);
      const renderAccountSettings = () => renderProfileMenuPlaceholder("accountSettings", "settings", ["Şifre ve güvenlik", "Hesap durumu", "Oturum tercihleri"]);
      const renderNotificationSettings = () => renderProfileMenuPlaceholder("notificationSettings", "bell", ["Yeni iş bildirimleri", "Cüzdan uyarıları", "Destek mesajları"]);
      const renderContactSettings = () => renderProfileMenuPlaceholder("contactSettings", "phone", ["Telefon numarası", "Sistem arama hattı", "Firma iletişim bilgisi"]);
      const renderInvoices = () => renderProfileMenuPlaceholder("invoices", "receipt", ["Son faturalar", "Ödeme belgeleri", "Fatura bilgileri"]);
      const renderIncomeExpense = () => renderProfileMenuPlaceholder("incomeExpense", "bar-chart", ["Gelir kayıtları", "Gider kayıtları", "Dönem özeti"]);

      function checkItem(text, done) {
        return `<div class="check-item"><span><b class="check-icon ${done ? "" : "todo"}">${icon(done ? "check" : "alert")}</b>${text}</span><span class="tag ${done ? "green" : "amber"}">${done ? "Tamam" : "Eksik"}</span></div>`;
      }

      function renderServices() {
        return `
          ${header("services", true)}
          <section class="card card-pad">
            <p class="body muted" style="margin:0">Bazı hizmetlerde işler teklif sistemiyle gelir. Her hizmet için açık modları buradan takip edebilirsin.</p>
          </section>
          <div class="stack section">
            ${service("Klima Servisi", ["Hazır İş", "Havuz"], [])}
            ${service("Ev Temizliği", ["Hazır İş", "Havuz", "Teklif", "Randevu"], [])}
            ${service("Kadın Kuaförü", ["Teklif", "Randevu"], ["Hazır İş", "Havuz"])}
            ${service("Nakliye", ["Havuz", "Teklif"], ["Hazır İş", "Randevu"])}
          </div>
        `;
      }

      function service(name, onModes, offModes) {
        const all = ["Hazır İş", "Havuz", "Teklif", "Randevu"];
        return `
          <div class="service-row">
            <div class="service-main"><strong>${name}</strong><small>${offModes.length ? "Bu hizmette bazı modlar kapalı" : "Tüm uygun modlar açık"}</small></div>
            <div class="mode-tags">
              ${all.map((m) => `<span class="mode ${onModes.includes(m) ? (m === "Teklif" ? "blue" : m === "Randevu" ? "purple" : "on") : ""}">${m}</span>`).join("")}
            </div>
          </div>
        `;
      }

      function renderRegions() {
        return `
          ${header("regions", true)}
          <section class="card card-pad">
            <h3 style="font-size:16px;margin:0 0 9px">Bölge İş İstatistikleri</h3>
            <div class="kpi-row">
              <div class="kpi-tile"><span>Partnerler</span><strong>34</strong></div>
              <div class="kpi-tile"><span>Bugün yapılan iş</span><strong>18 iş</strong></div>
              <div class="kpi-tile"><span>Dün yapılan iş</span><strong>22 iş</strong></div>
              <div class="kpi-tile"><span>Son 7 gün</span><strong>146 iş</strong></div>
              <div class="kpi-tile"><span>Son 30 gün</span><strong>612 iş</strong></div>
              <div class="kpi-tile"><span>Ortalama İş Fiyatı</span><strong>1.458 TL</strong></div>
            </div>
            <div class="meta-line" style="margin-top:9px">${icon("alert")} Uzak bölgelerde dönüş süresi uzayabilir. Kapasitenle birlikte değerlendir.</div>
          </section>
          <div class="stack section">
            ${region("Sakarya / Karasu", "İş gelsin", "1 ekip")}
            ${region("Sakarya / Kocaali", "Sadece havuz/teklif göster", "Uzak bölge")}
            ${region("Bursa / Karacabey", "İş gelsin", "2 ekip")}
            ${region("İstanbul / Adalar", "Kapalı", "Ulaşım zor")}
          </div>
        `;
      }

      function region(name, mode, note) {
        const tagClass = mode === "İş gelsin" ? "green" : mode === "Kapalı" ? "red" : "amber";
        return `<div class="region-row"><div class="region-main"><strong>${name}</strong><small>${note}</small></div><span class="tag ${tagClass}">${mode}</span></div>`;
      }

      function renderWorkPlan() {
        return `
          ${header("workPlan", true)}
          <section class="callout soft">
            <h3>Önerilen plan: Her gün 08:00 - 22:00</h3>
            <p>08:00 - 22:00 arası açık kalırsan %18 daha fazla iş alabilirsin.</p>
          </section>
          <section class="card card-pad section">
            <div class="section-title" style="margin-top:0"><h3>Gün seçimi</h3><span>Aktif</span></div>
            <div class="chip-row">
              ${["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d) => `<button class="chip-btn active" type="button">${d}</button>`).join("")}
            </div>
            <div class="kpi-row" style="margin-top:10px">
              <div class="kpi-tile"><span>Başlangıç</span><strong>08:00</strong></div>
              <div class="kpi-tile"><span>Bitiş</span><strong>22:00</strong></div>
              <div class="kpi-tile"><span>Mod</span><strong>İş gelsin</strong></div>
            </div>
          </section>
          <section class="card card-pad section stack">
            <h3 style="font-size:16px;margin:0">Bugünkü müsaitlik</h3>
            <button class="option-card active" type="button">Bugün iş almak istiyorum</button>
            <button class="option-card" type="button">Bugün iş almak istemiyorum</button>
            <button class="option-card" type="button">Sadece havuz ve teklif görmek istiyorum</button>
            <button class="primary-btn" type="button" data-action="save-work-plan">${icon("check")} Çalışma Planımı Kaydet</button>
          </section>
        `;
      }

      function renderBonus() {
        return `
          ${header("bonus", true)}
          <section class="card card-pad wallet-hero">
            <span class="tag" style="background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.25);color:#fff">Bonus Cüzdanı</span>
            <h3 style="margin:8px 0 2px;font-size:18px">240 kredi bonus</h3>
            <p class="tiny muted" style="margin:0">Bonus bakiye, nakit iade bakiyesinden ayrı takip edilir.</p>
          </section>
          <section class="card card-pad section">
            <div class="mini-table">
              <div class="mini-row"><span>Krediye çevrilecek örnek</span><strong>500 TL</strong></div>
              <div class="mini-row"><span>Gerekli ödeme/işlem şartı</span><strong>3 kat</strong></div>
              <div class="mini-row"><span>Gerekli tutar</span><strong>1.500 TL</strong></div>
            </div>
            <p class="tiny muted" style="margin:10px 0 0">Kurallar kampanya dönemine göre değişebilir. Bonus ve nakit iade kavramları ayrı tutulur.</p>
            <button class="primary-btn" type="button" data-open="bonus-convert" style="width:100%;margin-top:10px">${icon("credit-card")} Bonusu Krediye Çevir</button>
          </section>
          <section class="card card-pad section reward-wheel-note">
            <h3 style="font-size:15px;margin:0 0 6px">Ödül Merkezi değerlendirmesi</h3>
            <p class="tiny muted" style="margin:0">Ödül çarkı ana akışta kapalıdır. Şeffaf şart metni olmadan açılmaz.</p>
            <span class="tag gray" style="margin-top:9px">rewardWheelEnabled = ${rewardWheelEnabled}</span>
          </section>
        `;
      }

      function renderCapacity() {
        return `
          ${header("capacity", true)}
          <section class="card card-pad stack">
            <h3 style="font-size:16px;margin:0">Bugün kaç iş alabilirsin?</h3>
            <div class="option-grid">
              <button class="option-card" type="button">1 iş</button>
              <button class="option-card active" type="button">2 iş</button>
              <button class="option-card" type="button">3 iş</button>
              <button class="option-card" type="button">5+ iş</button>
            </div>
          </section>
          <section class="card card-pad stack section">
            <h3 style="font-size:16px;margin:0">Aynı anda kaç açık işin olabilir?</h3>
            <div class="option-grid">
              <button class="option-card" type="button">1</button>
              <button class="option-card active" type="button">2</button>
              <button class="option-card" type="button">3+</button>
              <button class="option-card" type="button">Sınırsız</button>
            </div>
            <p class="tiny muted" style="margin:0">Kapasiten dolunca sana yeni iş gönderimi durur. Havuzdan iş almaya ve teklif vermeye devam edebilirsin.</p>
          </section>
          <section class="card card-pad stack section">
            <h3 style="font-size:16px;margin:0">Çalışan / ekip bilgisi</h3>
            <div class="option-grid">
              <button class="option-card" type="button">Tek çalışıyorum</button>
              <button class="option-card active" type="button">2 ekip</button>
              <button class="option-card" type="button">3+ ekip</button>
              <button class="option-card" type="button">${icon("plus")} Ekle</button>
            </div>
            <button class="primary-btn" type="button" data-action="save-capacity">${icon("check")} Kapasiteyi Kaydet</button>
          </section>
        `;
      }

      function renderSupport() {
        const quickActions = [
          { title: "İş İtirazı", desc: "İşle ilgili bir sorun mu var?", iconName: "file-text", topic: "İş İtirazı" },
          { title: "Ödeme Sorunu", desc: "Ödemenizle ilgili yardım alın", iconName: "credit-card", topic: "Ödeme Sorunu" },
          { title: "Bonus Sorunu", desc: "Bonus ve kampanyalar", iconName: "gift", topic: "Bonus Sorunu" },
          { title: "Müşteri Sorunu", desc: "Müşteriyle ilgili bir problem mi var?", iconName: "user", topic: "Müşteri Sorunu" },
          { title: "Teknik Sorun", desc: "Uygulama veya teknik destek", iconName: "settings", topic: "Teknik Sorun" },
        ];
        const infoActions = [
          { title: "Sık Sorulan Sorular", desc: "Merak ettiklerin için cevaplar burada", iconName: "help-circle", label: "Sık Sorulan Sorular" },
          { title: "Açık Taleplerim", desc: "Taleplerini takip et", iconName: "clipboard", label: "Açık Taleplerim", badge: "3", soft: true },
        ];
        const supportAction = (item, extraClass) => {
          const target = item.topic
            ? `data-action="ticket-topic" data-topic="${escapeHtml(item.topic)}"`
            : `data-action="menu-placeholder" data-label="${escapeHtml(item.label || item.title)}"`;
          return `
            <button class="support-action-card ${extraClass || ""} ${item.soft ? "is-soft" : ""}" type="button" ${target} aria-label="${escapeHtml(item.title)}">
              <span class="support-action-icon">${icon(item.iconName)}</span>
              <span class="support-action-copy">
                <strong>${item.title}</strong>
                <small>${item.desc}</small>
              </span>
              <span class="support-row-tail">
                ${item.badge ? `<span class="support-action-meta">${item.badge}</span>` : ""}
                ${icon("chevron-right")}
              </span>
            </button>
          `;
        };
        return `
          ${header(state.screen === "messages" ? "messages" : "support", true)}
          <div class="support-help-screen">
            <section class="support-hero-card" aria-label="Yardım ve destek">
              <span class="support-hero-copy">
                <strong>Sorununu seç,<br>hızlıca çözelim.</strong>
                <small>Size nasıl yardımcı olabiliriz?</small>
              </span>
              <span class="support-hero-art" aria-hidden="true">
                <span class="support-bubble question">?</span>
                <span class="support-bubble main">${icon("message")}</span>
                <span class="support-bubble spark">${icon("sparkles")}</span>
              </span>
            </section>

            <label class="support-search">
              ${icon("search")}
              <input type="search" placeholder="Sorununu yaz..." aria-label="Sorununu yaz">
            </label>

            <strong class="support-section-label">Hızlı İşlemler</strong>
            <div class="support-action-list">
              ${quickActions.map((item) => supportAction(item)).join("")}
            </div>

            <strong class="support-section-label">Bilgi Merkezi</strong>
            <div class="support-action-list">
              ${infoActions.map((item) => supportAction(item)).join("")}
              ${supportAction({ title: "Talep Oluştur", desc: "Konu seç, ekibimiz takip etsin", iconName: "file-text", topic: "Talep Oluştur" }, "is-dark")}
              ${supportAction({ title: "Temsilciye Yaz", desc: "Canlı destek ekibimizle görüş", iconName: "message", topic: "Temsilciye Yaz", soft: true })}
            </div>
          </div>
        `;
      }

      function referralPartners() {
        return [
          { id: "ahmet-kaya", name: "Ahmet Kaya", initials: "A", city: "İstanbul", earnedTotal: "15.876 TL Bonus", phoneFull: "+90 532 224 18 74", stage: "Davet gönderildi", status: "Kayıt olmalı", filter: "invited", bonus: "100 TL", avatarBg: "#fb923c", active: false, inviteDate: "Bugün 11:20", lastActivity: "WhatsApp daveti gönderildi", nextStep: "Aynı telefon numarasıyla kayıt olmalı", rewardRule: "Kayıt ve profilini tamamladığında 100 TL bonus açılır.", note: "Kısa bir arama ile daveti gördüğünden emin olabilirsin." },
          { id: "mehmet-yilmaz", name: "Mehmet Yılmaz", initials: "M", city: "Ankara", earnedTotal: "8.420 TL Bonus", phoneFull: "+90 535 118 32 90", stage: "Profil eksik", status: "Profilini tamamlamalı", filter: "needProfile", bonus: "500 TL", avatarBg: "#3b82f6", active: false, inviteDate: "Dün 16:45", lastActivity: "Kayıt oldu, profil %60 tamamlandı", nextStep: "Profil bilgilerini ve belgelerini tamamlamalı", rewardRule: "Profil tamamlandığında ilk iş bonus süreci açılır.", note: "Profilini tamamlaması için nazikçe hatırlatma gönderebilirsin." },
          { id: "ayse-demir", name: "Ayşe Demir", initials: "A", city: "İzmir", earnedTotal: "6.950 TL Bonus", phoneFull: "+90 536 902 10 44", stage: "İlk iş bekleniyor", status: "İlk işini almalı", filter: "needJob", bonus: "500 TL", avatarBg: "#f59e0b", active: false, inviteDate: "10 Haz 2026", lastActivity: "Profil tamamlandı", nextStep: "İlk hazır işi veya havuz işini almalı", rewardRule: "İlk işini aldığında 500 TL bonus kazanırsın.", note: "İlk işini alması için bakiye ve bölge ayarlarını kontrol etmesini önerebilirsin." },
          { id: "derya-aksoy", name: "Derya Aksoy", initials: "D", city: "Bursa", earnedTotal: "12.240 TL Bonus", phoneFull: "+90 533 440 72 16", stage: "Bakiye yüklemeli", status: "Tekrar bakiye yüklemeli", filter: "needTopup", bonus: "%3", avatarBg: "#12b76a", active: true, inviteDate: "7 Haz 2026", lastActivity: "İlk iş aşaması tamamlandı", nextStep: "Tekrar bakiye yüklemeli", rewardRule: "Yüklediği tutarın %3'ü kadar bonus kazanırsın.", note: "Bakiye yüklediğinde hem o iş alabilir hem sen bonus kazanırsın." },
          { id: "serkan-ucar", name: "Serkan Uçar", initials: "S", city: "Kocaeli", earnedTotal: "21.300 TL Bonus", phoneFull: "+90 532 612 08 43", stage: "Aktif partner", status: "İş almaya başladı", filter: "active", bonus: "Kazanıldı", avatarBg: "#0ea5e9", active: true, inviteDate: "2 Haz 2026", lastActivity: "Bu hafta 2 iş aldı", nextStep: "Düzenli bakiye yükleyerek büyümeli", rewardRule: "Her bakiye yüklemesinde %3 bonus kazanırsın.", note: "Aktif partnerlerde yükleme takibi bonus fırsatı yaratır." },
          { id: "elif-arslan", name: "Elif Arslan", initials: "E", city: "Antalya", earnedTotal: "18.740 TL Bonus", phoneFull: "+90 539 719 38 61", stage: "Aktif partner", status: "Düzenli iş alıyor", filter: "active", bonus: "Kazanıldı", avatarBg: "#14b8a6", active: true, inviteDate: "29 May 2026", lastActivity: "Son 7 günde 4 iş aldı", nextStep: "Paket yükseltirse daha fazla iş alabilir", rewardRule: "Her bakiye yüklemesinde %3 bonus kazanırsın.", note: "Başarılı partnerleri paket yükseltmeye yönlendirmek iyi çalışır." },
          { id: "can-ozdemir", name: "Can Özdemir", initials: "C", city: "Eskişehir", earnedTotal: "5.500 TL Bonus", phoneFull: "+90 537 881 44 22", stage: "İlk iş bekleniyor", status: "İlk işini almalı", filter: "needJob", bonus: "500 TL", avatarBg: "#7c3aed", active: false, inviteDate: "5 Haz 2026", lastActivity: "Bölge ayarları tamamlandı", nextStep: "İlk teklifini veya hazır işini almalı", rewardRule: "İlk işini aldığında 500 TL bonus kazanırsın.", note: "İlk iş için kredi yükleme veya teklif verme adımını hatırlatabilirsin." },
          { id: "nur-aydin", name: "Nur Aydın", initials: "N", city: "Sakarya", earnedTotal: "3.900 TL Bonus", phoneFull: "+90 538 312 84 55", stage: "Profil eksik", status: "Belgelerini tamamlamalı", filter: "needProfile", bonus: "500 TL", avatarBg: "#ec4899", active: false, inviteDate: "4 Haz 2026", lastActivity: "Kimlik bilgisi eklendi", nextStep: "Eksik belge ve hizmet alanlarını tamamlamalı", rewardRule: "Profil tamamlanınca ilk iş aşamasına geçer.", note: "Eksik belgeyi tamamlaması süreci hızlandırır." },
          { id: "mert-yildiz", name: "Mert Yıldız", initials: "M", city: "Konya", earnedTotal: "1.250 TL Bonus", phoneFull: "+90 534 706 44 18", stage: "Davet gönderildi", status: "Kayıt olmalı", filter: "invited", bonus: "100 TL", avatarBg: "#fb923c", active: false, inviteDate: "Bugün 09:12", lastActivity: "WhatsApp daveti gönderildi", nextStep: "Aynı telefon numarasıyla kayıt olmalı", rewardRule: "Kayıt tamamlandığında 100 TL bonus açılır.", note: "Davet mesajını gördüğünü teyit etmek dönüşümü artırır." },
          { id: "selin-koc", name: "Selin Koç", initials: "S", city: "Adana", earnedTotal: "2.700 TL Bonus", phoneFull: "+90 531 284 70 19", stage: "Profil eksik", status: "Profilini tamamlamalı", filter: "needProfile", bonus: "500 TL", avatarBg: "#6366f1", active: false, inviteDate: "3 Haz 2026", lastActivity: "Hizmet alanı seçildi", nextStep: "Belge ve bölge bilgilerini tamamlamalı", rewardRule: "Profil tamamlandığında ilk iş aşaması başlar.", note: "Profil tamamlaması için kısa bir hatırlatma gönderebilirsin." },
          { id: "burak-tas", name: "Burak Taş", initials: "B", city: "Muğla", earnedTotal: "4.850 TL Bonus", phoneFull: "+90 532 804 91 27", stage: "İlk iş bekleniyor", status: "İlk işini almalı", filter: "needJob", bonus: "500 TL", avatarBg: "#f59e0b", active: false, inviteDate: "1 Haz 2026", lastActivity: "Profil onaylandı", nextStep: "İlk hazır işini almalı", rewardRule: "İlk işini aldığında 500 TL bonus kazanırsın.", note: "Bölgesindeki uygun işleri incelemesini önerebilirsin." },
          { id: "zeynep-er", name: "Zeynep Er", initials: "Z", city: "Bursa", earnedTotal: "9.320 TL Bonus", phoneFull: "+90 535 441 27 88", stage: "Bakiye yüklemeli", status: "Tekrar bakiye yüklemeli", filter: "needTopup", bonus: "%3", avatarBg: "#12b76a", active: true, inviteDate: "27 May 2026", lastActivity: "İlk işini tamamladı", nextStep: "Yeni iş alabilmek için bakiye yüklemeli", rewardRule: "Yüklediği tutarın %3'ü kadar bonus kazanırsın.", note: "Bakiye yüklediğinde yeni iş alımı hızlanır." },
          { id: "okan-kara", name: "Okan Kara", initials: "O", city: "Ankara", earnedTotal: "24.100 TL Bonus", phoneFull: "+90 536 510 24 67", stage: "Aktif partner", status: "İş almaya başladı", filter: "active", bonus: "Kazanıldı", avatarBg: "#0ea5e9", active: true, inviteDate: "25 May 2026", lastActivity: "Bu hafta 3 iş aldı", nextStep: "Düzenli bakiye yükleme alışkanlığı kazanmalı", rewardRule: "Her bakiye yüklemesinde %3 bonus kazanırsın.", note: "Aktif partnerleri başarılarını görerek motive edebilirsin." },
          { id: "deniz-arslan", name: "Deniz Arslan", initials: "D", city: "İstanbul", earnedTotal: "19.480 TL Bonus", phoneFull: "+90 539 118 90 63", stage: "Aktif partner", status: "Düzenli iş alıyor", filter: "active", bonus: "Kazanıldı", avatarBg: "#14b8a6", active: true, inviteDate: "22 May 2026", lastActivity: "Son 7 günde 5 iş aldı", nextStep: "Paket yükseltirse daha çok fırsat görür", rewardRule: "Her bakiye yüklemesinde %3 bonus kazanırsın.", note: "Büyümeye hazır partnerler ek bonus fırsatı yaratır." },
          { id: "leyla-gunes", name: "Leyla Güneş", initials: "L", city: "İzmir", earnedTotal: "7.640 TL Bonus", phoneFull: "+90 538 604 35 12", stage: "İlk iş bekleniyor", status: "İlk işini almalı", filter: "needJob", bonus: "500 TL", avatarBg: "#f97316", active: false, inviteDate: "20 May 2026", lastActivity: "Teklif alanı açıldı", nextStep: "İlk teklifini göndermeli", rewardRule: "İlk işini aldığında 500 TL bonus kazanırsın.", note: "Teklif bekleyen işlerden başlaması daha kolay olabilir." },
          { id: "emre-polat", name: "Emre Polat", initials: "E", city: "Balıkesir", earnedTotal: "11.900 TL Bonus", phoneFull: "+90 537 290 61 04", stage: "Bakiye yüklemeli", status: "Tekrar bakiye yüklemeli", filter: "needTopup", bonus: "%3", avatarBg: "#16a34a", active: true, inviteDate: "18 May 2026", lastActivity: "Bakiyesi azaldı", nextStep: "Hazır iş alabilmek için bakiye yüklemeli", rewardRule: "Yüklediği tutarın %3'ü kadar bonus kazanırsın.", note: "Kredi yüklendiğinde hem iş alır hem bonus kazandırır." },
          { id: "aylin-oz", name: "Aylin Öz", initials: "A", city: "Antalya", earnedTotal: "17.260 TL Bonus", phoneFull: "+90 530 772 14 95", stage: "Aktif partner", status: "Düzenli iş alıyor", filter: "active", bonus: "Kazanıldı", avatarBg: "#06b6d4", active: true, inviteDate: "16 May 2026", lastActivity: "Son 30 günde 11 iş aldı", nextStep: "Referanslarını artırabilir", rewardRule: "Her bakiye yüklemesinde %3 bonus kazanırsın.", note: "Başarılı partnerler diğer partnerler için iyi örnek olur." },
          { id: "tuna-baris", name: "Tuna Barış", initials: "T", city: "Kocaeli", earnedTotal: "13.450 TL Bonus", phoneFull: "+90 533 692 80 41", stage: "Aktif partner", status: "İş almaya başladı", filter: "active", bonus: "Kazanıldı", avatarBg: "#2563eb", active: true, inviteDate: "12 May 2026", lastActivity: "İlk paketini aldı", nextStep: "İş takibini düzenli yapmalı", rewardRule: "Her bakiye yüklemesinde %3 bonus kazanırsın.", note: "Paketli partnerlerin iş alma ritmini takip etmek faydalıdır." },
        ];
      }

      function referralEarnings() {
        return [
          { id: "earn-1", type: "Kayıt bonusu", partner: "Ahmet Kaya", amount: "100 TL Bonus", date: "Bugün 11:20", status: "Bekliyor", iconName: "users", color: "#b45309", bg: "#fff7ed", desc: "Ahmet Kaya aynı cep telefonu numarasıyla kayıt olduğunda bonus kazanacaksın.", detail: "Sistem davet gönderilen cep telefonu ile yeni kayıt yapılan numarayı eşleştirir. Kayıt tamamlandığında bonus bekleyen kazançlara eklenir." },
          { id: "earn-2", type: "Profil tamamlama", partner: "Mehmet Yılmaz", amount: "500 TL Bonus", date: "Dün 16:45", status: "Bekliyor", iconName: "sparkles", color: "#175cd3", bg: "#eff6ff", desc: "Profil bilgilerini tamamladığında ilk iş bonus süreci açılır.", detail: "Kimlik, belge, hizmet alanı ve bölge bilgileri tamamlandığında partner ilk iş aşamasına geçer. Bonus, şart tamamlandığında bekleyen kazançta görünür." },
          { id: "earn-3", type: "İlk iş alımı", partner: "Ayşe Demir", amount: "500 TL Bonus", date: "10 Haz 2026", status: "Bekliyor", iconName: "briefcase", color: "#067647", bg: "#ecfdf3", desc: "Ayşe Demir ilk işini aldığında bonus kazanacaksın.", detail: "Partner ilk hazır işini, havuz işini veya uygun teklif işini aldığında ilk iş bonusu hak edişe dönüşür." },
          { id: "earn-4", type: "Bakiye yükleme", partner: "Derya Aksoy", amount: "372 TL Bonus", date: "8 Haz 2026", status: "Kazanıldı", iconName: "wallet", color: "#067647", bg: "#ecfdf3", desc: "Derya Aksoy bakiye yüklediği için yükleme tutarının %3'ü kadar bonus kazandın.", detail: "Aktif partnerlerin sonraki bakiye yüklemelerinde %3 bonus hesaplanır ve kazanç geçmişine eklenir." },
          { id: "earn-5", type: "Bakiye yükleme", partner: "Serkan Uçar", amount: "640 TL Bonus", date: "6 Haz 2026", status: "Kazanıldı", iconName: "wallet", color: "#067647", bg: "#ecfdf3", desc: "Serkan Uçar düzenli bakiye yüklediği için bonus kazandırdı.", detail: "Düzenli bakiye yükleyen partnerler, davet eden kişinin tekrar eden bonus kazanmasına yardımcı olur." },
          { id: "earn-6", type: "İlk iş alımı", partner: "Can Özdemir", amount: "500 TL Bonus", date: "5 Haz 2026", status: "Bekliyor", iconName: "briefcase", color: "#b45309", bg: "#fff7ed", desc: "Can Özdemir ilk işini aldığında bonus kazanacaksın.", detail: "İlk iş tamamlandığında bonus tutarı bekleyen durumdan kazanıldı durumuna alınır." },
        ];
      }

      function referralTaskCards() {
        return [
          {
            type: "guide",
            name: "İlk partnerini kazan",
            stage: "Henüz davet edilen partner yoksa",
            className: "empty-guide",
            message: "Birini getir, önce 100 TL bonus, sonra 500 TL bonus ve sonra her bakiye yüklemesinden %3 bonus kazan.",
          },
          {
            id: "ahmet-kaya",
            name: "Ahmet Kaya",
            initials: "A",
            stage: "Davet gönderildi",
            bonus: "100",
            bonusUnit: "TL Bonus",
            avatarBg: "#fb923c",
            className: "invited",
            message: "Ahmet Kaya aynı cep telefonu numarasıyla kayıt olduğunda 100 TL bonus kazanacaksın.",
            steps: [
              { label: "Kayıt oldu", iconName: "check", current: true },
              { label: "İlk İşi Aldı", iconName: "briefcase" },
              { label: "Bakiye Yükledi", iconName: "wallet" },
            ],
          },
          {
            id: "mehmet-yilmaz",
            name: "Mehmet Yılmaz",
            initials: "M",
            stage: "Profil eksik",
            bonus: "500",
            bonusUnit: "TL Bonus",
            avatarBg: "#3b82f6",
            className: "profile",
            message: "<b>Mehmet Yılmaz</b> profil bilgilerini tamamladığında 500 TL Bonus kazanacaksın.",
            steps: [
              { label: "Kayıt oldu", iconName: "check", done: true },
              { label: "İlk İşi Aldı", iconName: "briefcase", current: true },
              { label: "Bakiye Yükledi", iconName: "wallet" },
            ],
          },
          {
            id: "ayse-demir",
            name: "Ayşe Demir",
            initials: "A",
            stage: "İlk iş bekleniyor",
            bonus: "500",
            bonusUnit: "TL Bonus",
            avatarBg: "#f59e0b",
            className: "need-job",
            message: "<b>Ayşe Demir</b> ilk işini aldığında 500 TL Bonus kazanacaksın.",
            steps: [
              { label: "Kayıt oldu", iconName: "check", done: true },
              { label: "İlk İşi Aldı", iconName: "briefcase", current: true },
              { label: "Bakiye Yükledi", iconName: "wallet" },
            ],
          },
          {
            id: "derya-aksoy",
            name: "Derya Aksoy",
            initials: "D",
            stage: "Bakiye yüklemeli",
            bonus: "%3",
            bonusUnit: "Bonus",
            avatarBg: "#12b76a",
            className: "topup",
            message: "<b>Derya Aksoy</b> tekrar bakiye yüklediğinde, yüklediği tutarın %3'ü kadar bonus kazanacaksın.",
            steps: [
              { label: "Kayıt oldu", iconName: "check", done: true },
              { label: "İlk İşi Aldı", iconName: "briefcase", done: true },
              { label: "Bakiye Yükledi", iconName: "wallet", current: true },
            ],
          },
        ];
      }

      function referralFilterOptions() {
        return [
          { key: "all", label: "Tümü" },
          { key: "active", label: "Aktif" },
          { key: "invited", label: "Kayıt Olmalı" },
          { key: "needProfile", label: "Profili Eksik" },
          { key: "needJob", label: "İş Almalı" },
          { key: "needTopup", label: "Bakiye Yüklet" },
        ];
      }

      function referralMatchesFilter(partner, filter) {
        if (filter === "all") return true;
        if (filter === "active") return partner.active;
        if (filter === "passive") return !partner.active;
        return partner.filter === filter;
      }

      function renderReferralProgress(steps) {
        return `
          <div class="referral-progress">
            ${steps.map((step) => `<span class="referral-step ${step.done ? "done" : ""} ${step.current ? "current" : ""}"><span class="referral-step-dot">${step.current ? `<em class="referral-waiting-badge">Bekleniyor</em>` : ""}${icon(step.iconName)}</span><small>${step.label}</small></span>`).join("")}
          </div>
        `;
      }

      function renderReferralTaskCard(task) {
        if (task.type === "guide") {
          return `
            <section class="card referral-task-card ${task.className}" aria-label="İlk partnerini kazan bilgilendirmesi">
              <div class="referral-candidate-main referral-guide-main">
                <span class="referral-guide-visual">${icon("users")}</span>
                <span class="referral-candidate-copy">
                  <strong>${task.name}</strong>
                  <small>${task.stage}</small>
                </span>
                ${icon("chevron-right")}
              </div>
              <div class="referral-guide-actions">
                <span class="referral-guide-step">${icon("phone")} 1. Telefon gir</span>
                <span class="referral-guide-step">${icon("message")} 2. Davet gönder</span>
                <span class="referral-guide-step">${icon("gift")} 3. Ödülleri kazan</span>
              </div>
              <div class="referral-task-message">${task.message}</div>
            </section>
          `;
        }
        return `
          <section class="card referral-task-card ${task.className}" data-action="view-referral-partner" data-referral-person="${task.id}">
            <div class="referral-candidate-main">
              <span class="referral-avatar" style="--avatar-bg:${task.avatarBg}">${task.initials}</span>
              <span class="referral-candidate-copy">
                <strong>${task.name}</strong>
                <small>${task.stage}</small>
              </span>
              <span class="referral-bonus"><strong>${task.bonus}</strong><span>${task.bonusUnit}</span></span>
              ${icon("chevron-right")}
            </div>
            ${renderReferralProgress(task.steps)}
            <div class="referral-task-message">${task.message}</div>
          </section>
        `;
      }

      function renderReferral() {
        const taskCards = referralTaskCards();
        const summaryItems = [
          { label: "Toplam", value: "18", iconName: "users", filter: "all", color: "#0ea5a3" },
          { label: "Aktif", value: "11", iconName: "check", filter: "active", color: "#12b76a" },
          { label: "Kayıt Olmalı", value: "2", iconName: "phone", filter: "invited", color: "#fb923c" },
          { label: "Profili Eksik", value: "3", iconName: "user", filter: "needProfile", color: "#3b82f6" },
          { label: "İş Almalı", value: "4", iconName: "briefcase", filter: "needJob", color: "#f59e0b" },
          { label: "Bakiye Yüklet", value: "3", iconName: "wallet", filter: "needTopup", color: "#175cd3" },
        ];
        return `
          <div class="partner-earn-head app-header">
            <button class="back-btn" type="button" data-screen="home" aria-label="Ana sayfaya dön">${icon("chevron-left")}</button>
            <h2>Partner Davet Programı</h2>
            <button class="icon-btn" type="button" data-action="referral-info" aria-label="Partner kazan bilgi">${icon("help-circle")}</button>
          </div>

          <section class="referral-hero">
            <div class="referral-hero-copy">
              <span class="referral-hero-label">Bu ay kazancın ${icon("help-circle")}</span>
              <strong class="referral-hero-amount">2.450</strong>
              <span class="referral-hero-bonus">Bonus</span>
              <button class="referral-hero-btn" type="button" data-action="view-referral-earnings">Kazançlarını Gör ${icon("chevron-right")}</button>
            </div>
            <div class="referral-wallet-art" aria-hidden="true">
              <span class="referral-wallet"></span>
              <span class="referral-coin one">B</span>
              <span class="referral-coin two">B</span>
              <span class="referral-coin three">B</span>
            </div>
          </section>

          <section class="card referral-phone-card section">
            <div class="referral-phone-head">
              <span class="referral-icon-soft">${icon("phone")}</span>
              <span>
                <strong>Yeni partner davet et</strong>
                <small>Cep telefonu numarasını gir. Sistem bu kişiye WhatsApp davet mesajı gönderir.</small>
              </span>
            </div>
            <div class="referral-phone-form">
              <input class="referral-phone-input" type="tel" inputmode="tel" placeholder="05xx xxx xx xx" aria-label="Davet edilecek cep telefonu" />
              <button class="primary-btn" type="button" data-action="send-partner-invite">Davet Gönder</button>
            </div>
            <span class="referral-phone-note">${icon("check")} Aynı cep numarasıyla kayıt olursa partner senin davetinle kazanılmış sayılır.</span>
          </section>

          <div class="referral-section-head">
            <h3>Görevlerin</h3>
            <button type="button" data-referral-filter="all">Tümünü gör ${icon("chevron-right")}</button>
          </div>
          <div class="referral-task-carousel" data-referral-task-rail>
            ${taskCards.map(renderReferralTaskCard).join("")}
          </div>
          <div class="referral-task-dots" data-referral-task-dots aria-hidden="true">
            ${taskCards.map((_, index) => `<span class="${index === 0 ? "active" : ""}"></span>`).join("")}
          </div>

          <div class="referral-section-head">
            <h3>Partner Özeti</h3>
          </div>
          <section class="referral-summary-strip" aria-label="Partner özeti">
            ${summaryItems.map((item) => `
              <button class="referral-summary-card" type="button" data-referral-filter="${item.filter}">
                <span class="referral-summary-icon" style="--summary-bg:${item.color}">${icon(item.iconName)}</span>
                <strong>${item.value}</strong>
                <small>${item.label}</small>
              </button>
            `).join("")}
          </section>

          <button class="referral-earn-showcase section" type="button" data-action="referral-info">
            <span class="earn-gift-badge">${icon("gift")}</span>
            <span>
              <h3>Ne kadar kazanırım?</h3>
              <span class="earn-rule-list">
                <span><i></i><b>Kayıt Olma:</b><em>100 TL Bonus</em></span>
                <span><i></i><b>İlk İş:</b><em>500 TL Bonus</em></span>
                <span><i></i><b>Bakiye Yükleme:</b><em>%3 Bonus</em></span>
              </span>
            </span>
            <span class="earn-coin one">B</span>
            <span class="earn-coin two">B</span>
          </button>
        `;
      }

      function renderReferralList() {
        const partners = referralPartners();
        const filterOptions = referralFilterOptions();
        const searchValue = (state.referralSearch || "").toLocaleLowerCase("tr-TR").trim();
        const visiblePartners = partners.filter((partner) => {
          const matchesFilter = referralMatchesFilter(partner, state.referralFilter);
          const haystack = `${partner.name} ${partner.city} ${partner.stage} ${partner.status}`.toLocaleLowerCase("tr-TR");
          const matchesSearch = !searchValue || haystack.indexOf(searchValue) > -1;
          return matchesFilter && matchesSearch;
        });
        const hasMorePartners = visiblePartners.length > state.referralVisibleCount;
        return `
          ${header("referralList", true)}
          <section class="card referral-list-tools">
            <label class="referral-search-box">
              ${icon("search")}
              <input type="search" value="${escapeHtml(state.referralSearch)}" placeholder="İsim veya görev ara" data-referral-search aria-label="Partner ara" />
            </label>
            <div class="referral-filter-row" aria-label="Partner filtreleri">
              ${filterOptions.map((filter) => `<button class="chip-btn ${state.referralFilter === filter.key ? "active" : ""}" type="button" data-referral-filter-chip="${filter.key}">${filter.label}</button>`).join("")}
            </div>
          </section>
          <section class="card referral-list-card section">
            ${visiblePartners.length ? visiblePartners.map((partner, index) => `
              <button class="referral-list-row" type="button" data-action="view-referral-partner" data-referral-person="${partner.id}" data-referral-list-row data-referral-list-index="${index}" data-referral-search-text="${escapeHtml(`${partner.name} ${partner.city} ${partner.stage} ${partner.status}`)}" ${index >= state.referralVisibleCount ? "hidden" : ""}>
                <span class="referral-avatar" style="--avatar-bg:${partner.avatarBg}">${partner.initials}</span>
                <span>
                  <strong>${partner.name}</strong>
                  <small>${partner.city}</small>
                </span>
                ${icon("chevron-right")}
              </button>
            `).join("") : `<div class="empty-note">Bu filtrede partner bulunamadı.</div>`}
            ${visiblePartners.length ? `<div class="empty-note" data-referral-search-empty hidden>Bu aramada partner bulunamadı.</div>` : ""}
            ${visiblePartners.length ? `<div data-referral-load-note data-complete="${hasMorePartners ? "false" : "true"}" hidden></div>` : ""}
          </section>
        `;
      }

      function renderReferralEarnings() {
        const earnings = referralEarnings();
        const earnedItems = earnings.filter((item) => item.status === "Kazanıldı");
        const pendingItems = earnings.filter((item) => item.status !== "Kazanıldı");
        const earningRow = (item) => `
          <button class="earning-row" type="button" data-action="view-referral-earning-detail" data-earning-id="${item.id}" style="--earning-color:${item.color};--earning-bg:${item.bg}" aria-label="${item.partner} kazanç detayını gör">
            <span class="earning-icon">${icon(item.iconName)}</span>
            <span class="earning-copy">
              <strong>${item.type} · ${item.partner}</strong>
              <small>${item.date} · ${item.desc}</small>
            </span>
            <span class="earning-amount">
              <strong>${item.amount}</strong>
              <span>${item.status}</span>
            </span>
            ${icon("chevron-right")}
          </button>
        `;
        return `
          <div class="back-head">
            <button class="back-btn" type="button" data-screen="referral" aria-label="Partner kazan ekranına dön">${icon("chevron-left")}</button>
            <div class="app-title">
              <h2>Kazançlarım</h2>
              <p>Bonus geçmişi ve bekleyen hak edişler</p>
            </div>
          </div>

          <section class="referral-earnings-hero section">
            <span class="referral-earnings-kicker">Bu ay toplam kazancın</span>
            <div class="referral-earnings-total"><strong>2.450</strong><span>Bonus</span></div>
            <p>Kazanılan ve bekleyen tüm partner bonuslarını buradan takip edebilir, her kalemin şartını detayda inceleyebilirsin.</p>
          </section>

          <section class="earnings-summary-grid section" aria-label="Kazanç özeti">
            <article class="earnings-summary-card" style="--earning-color:#067647"><small>Kazanıldı</small><strong>1.090 Bonus</strong></article>
            <article class="earnings-summary-card" style="--earning-color:#b45309"><small>Bekleyen</small><strong>1.360 Bonus</strong></article>
            <article class="earnings-summary-card" style="--earning-color:#175cd3"><small>Toplam kalem</small><strong>${earnings.length}</strong></article>
          </section>

          <section class="card card-pad section">
            <div class="row" style="margin-bottom:10px">
              <h3 style="margin:0;font-size:16px">Kazanç Kalemleri</h3>
              <span class="tag green">${earnedItems.length} kazanıldı · ${pendingItems.length} bekleyen</span>
            </div>
            <div class="earnings-list">
              ${earnings.map(earningRow).join("")}
            </div>
          </section>

          <section class="earning-detail-note section">
            <strong>Bilgilendirme</strong>
            <span>Bekleyen bonuslar ilgili şart tamamlandığında kazanıldı durumuna geçer. Tutarlar kampanya dönemine göre güncellenebilir.</span>
          </section>
        `;
      }

      function renderLevels() {
        const rivals = [
          { rank: 34, initials: "MY", name: "Mehmet Y.", points: "870 puan", current: false },
          { rank: 35, initials: "AC", name: "Ali C.", points: "860 puan", current: false },
          { rank: 36, initials: "AK", name: "Ahmet K.", points: "848 puan", current: false },
          { rank: 37, initials: "S", name: "Sen", points: "845 puan", current: true },
          { rank: 38, initials: "HT", name: "Hasan T.", points: "835 puan", current: false },
        ];
        const champions = [
          { rank: 2, initials: "ED", name: "Emre D.", points: "9.650 Puan", bg: "#eef4ff", medal: "#d1d5db", score: "#175cd3" },
          { rank: 1, initials: "HA", name: "Hüseyin A.", points: "10.846 Puan", bg: "#fffbeb", medal: "#facc15", score: "#b45309", first: true },
          { rank: 3, initials: "YK", name: "Yusuf K.", points: "8.930 Puan", bg: "#fff7ed", medal: "#d97706", score: "#c2410c" },
        ];
        const sectorOptions = [
          { value: "", label: "Sektörler" },
          { value: "Beyaz Eşya Tamiri", label: "Beyaz Eşya Tamiri" },
          { value: "Klima Tamiri", label: "Klima Tamiri" },
          { value: "Kombi Servisi", label: "Kombi Servisi" },
          { value: "Ev Temizliği", label: "Ev Temizliği" },
        ];
        const regionOptions = [
          { value: "", label: "Şehirler" },
          { value: "İstanbul", label: "İstanbul" },
          { value: "Ankara", label: "Ankara" },
          { value: "İzmir", label: "İzmir" },
          { value: "Bursa", label: "Bursa" },
          { value: "Kocaeli", label: "Kocaeli" },
          { value: "Kayseri", label: "Kayseri" },
          { value: "Antalya", label: "Antalya" },
        ];
        const optionHtml = (items, selected) => items.map((item) => `<option value="${item.value}" ${selected === item.value ? "selected" : ""}>${item.label}</option>`).join("");
        const activeLeagueLabel = state.leaderboardRegion ? `${state.leaderboardRegion} Ligi` : "Sektör Ligi";
        const rivalRow = (rival) => `
          <article class="rival-row ${rival.current ? "current" : ""}">
            <span class="rival-rank">#${rival.rank}</span>
            <span class="rival-avatar">${rival.initials}</span>
            <span class="rival-copy">
              <strong>${rival.name}</strong>
              ${rival.current ? `<span class="you-pill">SEN</span>` : ""}
            </span>
            <span class="rival-jobs">${rival.points}</span>
            ${icon("chevron-right")}
          </article>
        `;
        const championCard = (champion) => `
          <article class="champion-card ${champion.first ? "first" : ""}" style="--champion-bg:${champion.bg};--medal-bg:${champion.medal};--score-color:${champion.score}">
            <span class="champion-photo">
              ${champion.initials}
              <em class="champion-medal">${champion.rank}</em>
            </span>
            <strong>${champion.name}</strong>
            <b>${champion.points}</b>
          </article>
        `;
        return `
          <div class="leaderboard-head">
            <button class="back-btn" type="button" data-screen="home" aria-label="Ana sayfaya dön">${icon("chevron-left")}</button>
            <div class="leaderboard-title">
              <h2>Liderlik Tablosu</h2>
              <span class="rank-week-pill">${icon("calendar")} 1 - 7 Haziran 2026</span>
            </div>
            <button class="icon-btn" type="button" data-action="leaderboard-info" aria-label="Lider tablosu bilgisi">${icon("help-circle")}</button>
          </div>

          <section class="leaderboard-menu" aria-label="Liderlik filtreleri">
            <label class="leaderboard-select-wrap">
              <span class="leaderboard-select-title">${icon("trophy")} Sektör Ligi</span>
              <select data-leaderboard-sector aria-label="Sektör ligi seç">
                ${optionHtml(sectorOptions, state.leaderboardSector)}
              </select>
            </label>
            <label class="leaderboard-select-wrap">
              <span class="leaderboard-select-title">${icon("map-pin")} Şehir Ligi</span>
              <select data-leaderboard-region aria-label="Şehir ligi seç">
                ${optionHtml(regionOptions, state.leaderboardRegion)}
              </select>
            </label>
          </section>

          <section class="rank-hero" aria-label="Bu haftaki sıralaman">
            <div class="rank-hero-copy">
              <div>
                <span class="rank-hero-label">Bu haftaki sıralaman ${icon("help-circle")}</span>
                <strong class="rank-hero-number">#37</strong>
                <p>İlk 20'ye ulaşmak için performansını artırmaya devam et.</p>
              </div>
              <div class="rank-progress">
                <div class="rank-progress-meta">
                  <span>${icon("trophy")} İlk 20 hedefine yakınlık</span>
                  <span>%72</span>
                </div>
                <div class="rank-progress-bar"><span></span></div>
              </div>
            </div>
            <div class="rank-badge-stage">
              <span class="rank-league-badge">${icon("star")}</span>
              <span class="rank-league-ribbon">${activeLeagueLabel}</span>
            </div>
          </section>

          <section class="card rank-stat-grid section" aria-label="Liderlik metrikleri">
            <div class="rank-stat" style="--rank-color:#16a34a">${icon("bar-chart")}<strong>18</strong><small>Bu haftaki işlerim</small></div>
            <div class="rank-stat" style="--rank-color:#f59e0b">${icon("trophy")}<strong>845</strong><small>Lig puanım</small></div>
            <div class="rank-stat" style="--rank-color:#0ea5e9">${icon("trend-up")}<strong>İlk 20</strong><small>Hedefin</small></div>
          </section>

          <button class="rank-inline-cta section" type="button" data-screen="work" data-work-tab="pool" aria-label="İşlere git">
            <span class="rank-cta-art">${icon("zap")}</span>
            <span>
              <strong>Daha çok iş al, sıralamada yüksel!</strong>
              <small>Yeni iş fırsatlarını kaçırma.</small>
            </span>
          </button>

          <section class="card rank-section-card section" aria-label="Yakındaki rakiplerin">
            <div class="rank-section-head">
              <span class="rank-section-title">
                <strong>${icon("users")} Sıralamadaki Konumun</strong>
                <small>Sana en yakın partnerler</small>
              </span>
            </div>
            <div class="rival-list">
              ${rivals.map(rivalRow).join("")}
            </div>
          </section>

          <section class="card rank-section-card section" aria-label="Bu haftanın şampiyonları">
            <div class="rank-section-head">
              <span class="rank-section-title">
                <strong>${icon("crown")} Haftanın En İyileri</strong>
                <small>Bu hafta en güçlü performansı gösterenler</small>
              </span>
            </div>
            <div class="champion-strip">
              ${champions.map(championCard).join("")}
            </div>
          </section>

          <button class="rank-tip-card section" type="button" data-screen="work" data-work-tab="pool" aria-label="Puanını yükselt">
            <span class="rank-tip-icon">${icon("trend-up")}</span>
            <span>
              <strong>Düzenli iş al, müşteri yorumlarını artır.</strong>
              <small>Puanını yükselt; ligde daha görünür ol.</small>
            </span>
            ${icon("chevron-right")}
          </button>
        `;
      }

      function renderReviews() {
        const reviews = [
          { name: "Elif Y.", initial: "E", score: 5, rating: "5.0", text: "Hızlı dönüş yaptı, servis süreci çok düzenliydi.", date: "Bugün", service: "Klima Tamiri", reply: "", avatarBg: "#ecfdf3", avatarColor: "#067647" },
          { name: "Murat K.", initial: "M", score: 4, rating: "4.0", text: "Randevu saatine uydu ve işlemi temiz bir şekilde yaptı.", date: "Dün", service: "Kombi Bakımı", reply: "Değerli yorumunuz için teşekkür ederiz. Memnun kalmanıza sevindik.", avatarBg: "#fff7ed", avatarColor: "#b45309" },
          { name: "Selin A.", initial: "S", score: 5, rating: "5.0", text: "Beklentimin üstünde bir hizmet aldım. İşinin ehli, kesinlikle tavsiye ederim.", date: "2 gün önce", service: "Petek Temizliği", reply: "Güzel yorumunuz için teşekkür ederiz. Her zaman yardımcı olmaktan memnuniyet duyarız.", avatarBg: "#eef4ff", avatarColor: "#175cd3" },
          { name: "Aylin S.", initial: "A", score: 5, rating: "5.0", text: "Temiz çalışma ve sonuç bildirimi güven verdi.", date: "3 gün önce", service: "Beyaz Eşya", reply: "", avatarBg: "#f4f0ff", avatarColor: "#6d28d9" },
          { name: "Derya A.", initial: "D", score: 5, rating: "4.9", text: "Sorunu hızlı çözdü, fiyatı önceden net söyledi.", date: "4 gün önce", service: "Klima Tamiri", reply: "Geri bildiriminiz için teşekkür ederiz. Şeffaf fiyat ve hızlı servis bizim için önemli.", avatarBg: "#f0fdf4", avatarColor: "#15803d" },
          { name: "Kemal T.", initial: "K", score: 3, rating: "3.6", text: "Servis iyi ama geri dönüş biraz geç oldu.", date: "5 gün önce", service: "Buzdolabı Servisi", reply: "", avatarBg: "#fff7ed", avatarColor: "#c2410c" },
          { name: "Serkan B.", initial: "S", score: 5, rating: "4.8", text: "İletişimi netti, randevu saatine yakın geldi.", date: "6 gün önce", service: "Kombi Bakımı", reply: "", avatarBg: "#ecfeff", avatarColor: "#0e7490" },
          { name: "Nihan E.", initial: "N", score: 3, rating: "3.8", text: "İş tamamlandı ancak daha detaylı bilgilendirme beklerdim.", date: "1 hafta önce", service: "Klima Tamiri", reply: "", avatarBg: "#fef2f2", avatarColor: "#b42318" },
          { name: "Okan M.", initial: "O", score: 5, rating: "5.0", text: "Çok profesyonel ve temiz çalıştı.", date: "1 hafta önce", service: "Petek Temizliği", reply: "Nazik yorumunuz için teşekkür ederiz.", avatarBg: "#ecfdf3", avatarColor: "#067647" },
        ];
        const filterOptions = [
          { key: "all", label: "Tümü" },
          { key: "low", label: "Düşük puanlılar" },
          { key: "five", label: "5 puanlılar" },
          { key: "answered", label: "Yanıtlanmış olanlar" },
          { key: "unanswered", label: "Yanıtlanmamış olanlar" },
        ];
        const filteredReviews = reviews.filter((review) => {
          if (!state.reviewListMode) return true;
          if (state.reviewFilter === "low") return review.score < 4;
          if (state.reviewFilter === "five") return review.score === 5;
          if (state.reviewFilter === "answered") return !!review.reply;
          if (state.reviewFilter === "unanswered") return !review.reply;
          return true;
        });
        const visibleReviews = state.reviewListMode
          ? filteredReviews.slice(0, Math.min(state.reviewVisibleCount, filteredReviews.length))
          : reviews.slice(0, 3);
        const hasMoreReviews = state.reviewListMode && visibleReviews.length < filteredReviews.length;
        const reviewStars = (score) => [1, 2, 3, 4, 5].map((index) => `<span class="${index <= score ? "filled" : ""}">★</span>`).join("");
        const reviewCard = (review) => `
          <article class="review-modern-card">
            <div class="review-modern-top">
              <span class="review-avatar-modern" style="--review-avatar-bg:${review.avatarBg};--review-avatar-color:${review.avatarColor}">${review.initial}</span>
              <div class="review-person">
                <strong>${review.name}</strong>
                <span class="review-rating-line">
                  <span class="review-stars" aria-label="${review.rating} yıldız">${reviewStars(review.score)}</span>
                  <span class="review-rating-pill">${review.rating}</span>
                </span>
              </div>
              <span class="review-card-actions">
                <span>${review.date}</span>
                <button class="review-report-btn" type="button" data-action="report-review-comment">Bildir</button>
              </span>
            </div>
            <p class="review-text">${review.text}</p>
            <div class="review-card-bottom">
              <span class="review-service-tag">${icon("settings")} ${review.service}</span>
              ${review.reply
                ? ""
                : `<button class="review-reply-btn" type="button" data-action="reply-review" data-review-name="${escapeHtml(review.name)}" data-review-text="${escapeHtml(review.text)}">${icon("message")} Yanıtla</button>`}
            </div>
            ${review.reply ? `
              <div class="partner-reply-card">
                <div class="partner-reply-head">
                  <strong>${icon("message")} Senin yanıtın</strong>
                  <span class="partner-reply-actions">
                    <button class="review-reply-edit-btn" type="button" data-action="edit-review-reply" data-review-name="${escapeHtml(review.name)}" data-review-text="${escapeHtml(review.text)}" data-review-reply="${escapeHtml(review.reply)}" aria-label="Yanıtı düzenle">${icon("edit")}</button>
                  </span>
                </div>
                <p>${review.reply}</p>
              </div>
            ` : ""}
          </article>
        `;
        if (state.reviewListMode) {
          return `
            <div class="review-head">
              <button class="back-btn" type="button" data-action="reviews-overview" aria-label="Yorum özetine dön">${icon("chevron-left")}</button>
              <h2>Tüm Yorumlar</h2>
              <button class="icon-btn" type="button" data-action="review-info" aria-label="Yorumlar hakkında bilgi">${icon("help-circle")}</button>
            </div>
            <section class="review-list-hero">
              <span>
                <strong>Yorumlarını yönet</strong>
                <small>Filtre seç, yanıt bekleyen yorumlara hızlıca dönüş yap.</small>
              </span>
              <span>${reviews.filter((review) => !review.reply).length} yanıt bekliyor</span>
            </section>
            <section class="review-filter-row" aria-label="Yorum filtreleri">
              ${filterOptions.map((filter) => `<button class="chip-btn ${state.reviewFilter === filter.key ? "active" : ""}" type="button" data-review-filter="${filter.key}">${filter.label}</button>`).join("")}
            </section>
            <section class="review-modern-list">
              ${visibleReviews.map(reviewCard).join("")}
              <div class="review-load-note" data-review-load-note>${hasMoreReviews ? "Aşağı kaydırdıkça yeni yorumlar yüklenir." : "Tüm yorumlar gösterildi."}</div>
            </section>
          `;
        }
        return `
          <div class="review-head">
            <button class="back-btn" type="button" data-screen="home" aria-label="Ana sayfaya dön">${icon("chevron-left")}</button>
            <h2>Müşteri Yorumları</h2>
            <button class="icon-btn" type="button" data-action="review-info" aria-label="Yorumlar hakkında bilgi">${icon("help-circle")}</button>
          </div>
          <section class="review-score-card">
            <div class="review-score-main">
              <div>
                <div class="review-score-number"><span>4.8</span><span class="review-score-star">★</span></div>
                <p class="review-score-count">126 değerlendirme</p>
              </div>
              <span class="review-growth-pill">
                <strong>${icon("trend-up")} +18 yeni yorum</strong>
                <small>Son 30 günde</small>
              </span>
            </div>
            <div class="review-gauge" aria-label="Müşteri memnuniyeti yüzde 92">
              <span class="review-gauge-face">☺</span>
              <strong>%92</strong>
              <small>Müşteri memnuniyeti</small>
            </div>
          </section>
          <section class="review-share-card section">
            <span class="review-share-icon">${icon("share")}</span>
            <div class="review-share-copy">
              <strong>Yorum topla</strong>
              <small>Daha çok iş al.</small>
            </div>
            <button class="review-share-button" type="button" data-action="share-review-link">${icon("share")} Paylaş</button>
            <img class="review-inline-qr" src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&margin=0&data=https%3A%2F%2Flipyum.com%2Fyorum%2Fahmet-kaya" alt="Yorum linki QR kodu" loading="lazy" referrerpolicy="no-referrer" />
          </section>
          <div class="review-section-head">
            <h3>Son Yorumlar</h3>
            <button class="review-see-all" type="button" data-action="show-all-reviews">Tümünü Gör ${icon("chevron-right")}</button>
          </div>
          <section class="review-modern-list">
            ${visibleReviews.map(reviewCard).join("")}
            <button class="review-boost-card" type="button" data-action="review-boost">
              <span class="review-boost-icon">${icon("star")}</span>
              <span class="review-boost-copy">
                <strong>Yorumların gücünü artır!</strong>
                <small>Daha fazla 5 yıldızlı yorum alarak sıralamanı yükseltebilirsin.</small>
              </span>
              ${icon("chevron-right")}
            </button>
          </section>
        `;
      }

      function renderCustomers() {
        return `
          ${header("customers", true)}
          <section class="callout soft">
            <h3>Kendi müşterilerini düzenli takip et</h3>
            <p>Randevu linkinden gelen müşteriler senin müşterindir. Kendi müşterilerinden komisyon alınmaz.</p>
          </section>
          <div class="stack section">
            ${customer("Ayşe Hanım", "Saç Boya · Son randevu bugün 10:00", "Randevulu")}
            ${customer("Mehmet Bey", "Sakal Tıraşı · 11:30", "Bugün")}
            ${customer("Zeynep Hanım", "Fön · Elif", "Takip")}
          </div>
        `;
      }

      function renderAppointmentLink() {
        return `
          ${header("appointmentLink", true)}
          <section class="card card-pad">
            <div class="qr-box" aria-label="Randevu QR"></div>
            <p class="body strong" style="text-align:center;margin:0 0 10px">lipyum.com/r/kuafor-adi</p>
            <p class="tiny muted" style="text-align:center;margin:0 0 10px">Müşterilerin linkten ücretsiz randevu alır. Kendi müşterilerinden komisyon alınmaz.</p>
            <div class="action-row">
              <button class="primary-btn" type="button" data-action="share-link">${icon("share")} Linki Paylaş</button>
              <button class="secondary-btn" type="button" data-open="qr">${icon("qr")} QR Göster</button>
            </div>
          </section>
        `;
      }

      function supportItem(id, title, status, color, eta, credit) {
        return `<div class="support-item"><span><b class="step-number">${id.slice(-2)}</b><span><strong style="display:block;font-size:12px">${id} · ${title}</strong><small class="muted">Tahmini dönüş: ${eta} · Kullanılan kredi: ${credit}</small></span></span><span class="tag ${color}">${status}</span></div>`;
      }

      function supportLink(title, ico) {
        return `<button class="link-card" type="button" data-action="ticket-topic" data-topic="${title}">${icon(ico)}<span><strong>${title}</strong><small>Konu seç, ticket oluştur</small></span>${icon("chevron-right")}</button>`;
      }

      function timeline(title, desc, done) {
        return `<div class="timeline-item"><span class="timeline-dot">${icon(done ? "check" : "clock")}</span><span><strong>${title}</strong><small>${desc}</small></span></div>`;
      }

      function levelCard(title, desc, active) {
        return `<article class="card card-pad"><div class="row"><div><h3 style="font-size:15px;margin:0">${title}</h3><p class="tiny muted" style="margin:4px 0 0">${desc}</p></div><span class="tag ${active ? "green" : "gray"}">${active ? "Açık" : "Sırada"}</span></div></article>`;
      }

      function customer(name, detail, status) {
        return `<article class="card card-pad"><div class="row"><div><h3 style="font-size:15px;margin:0">${name}</h3><p class="tiny muted" style="margin:4px 0 0">${detail}</p></div><span class="tag purple">${status}</span></div></article>`;
      }

      function selectedReferralPartner() {
        const partners = referralPartners();
        return partners.find((partner) => partner.id === state.selectedReferralId) || partners[0];
      }

      function referralPartnerSheet() {
        const partner = selectedReferralPartner();
        const canEarn = partner.bonus !== "Kazanıldı";
        return `
          <section class="sheet" role="dialog" aria-label="${partner.name} partner detayı">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Partner Detayı</h3><p>Davet, iletişim ve bonus takibi.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="modal-grid">
              <section class="referral-person-head">
                <span class="referral-avatar" style="--avatar-bg:${partner.avatarBg}">${partner.initials}</span>
                <span class="referral-person-title">
                  <strong>${partner.name}</strong>
                  <small>${partner.status}</small>
                </span>
                <span class="tag ${partner.active ? "green" : "amber"}">${partner.active ? "Aktif" : "Takip"}</span>
              </section>

              <div class="referral-person-phone">${icon("phone")} ${partner.phoneFull}</div>

              <div class="referral-person-actions">
                <button class="primary-btn" type="button" data-action="call-referral-friend">${icon("phone")} Ara</button>
                <button class="secondary-btn" type="button" data-action="whatsapp-referral-friend">${icon("message")} WhatsApp</button>
              </div>

              <section class="referral-earned-card">
                <span>Bugüne kadar kazandırdı</span>
                <strong>${partner.earnedTotal}</strong>
                <small>${partner.name} isimli partner bugüne kadar size ${partner.earnedTotal} kazandırdı.</small>
              </section>

              <section class="card card-pad">
                <div class="detail-list">
                  <div class="detail-row"><span>Davet tarihi</span><div>${partner.inviteDate}</div></div>
                  <div class="detail-row"><span>Son durum</span><div>${partner.lastActivity}</div></div>
                  <div class="detail-row"><span>Sonraki adım</span><div>${partner.nextStep}</div></div>
                  <div class="detail-row"><span>Beklenen bonus</span><div>${canEarn ? partner.bonus : "Kazanıldı"}</div></div>
                </div>
              </section>

              <section class="referral-person-note">
                <strong>${canEarn ? "Bonus şartı" : "Bonus durumu"}</strong>
                <span>${partner.rewardRule}</span>
              </section>

              <section class="callout soft" style="padding:10px">
                <h3 style="font-size:14px">Öneri</h3>
                <p>${partner.note}</p>
              </section>
            </div>
          </section>
        `;
      }

      function selectedReferralEarning() {
        const earnings = referralEarnings();
        return earnings.find((earning) => earning.id === state.selectedEarningId) || earnings[0];
      }

      function referralEarningDetailSheet() {
        const earning = selectedReferralEarning();
        return `
          <section class="sheet" role="dialog" aria-label="${earning.partner} kazanç detayı">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Kazanç Detayı</h3><p>${earning.partner} kaynaklı bonus hareketi.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="modal-grid">
              <section class="referral-earned-card">
                <span>${earning.type}</span>
                <strong>${earning.amount}</strong>
                <small>${earning.desc}</small>
              </section>
              <section class="card card-pad">
                <div class="detail-list">
                  <div class="detail-row"><span>Partner</span><div>${earning.partner}</div></div>
                  <div class="detail-row"><span>Tarih</span><div>${earning.date}</div></div>
                  <div class="detail-row"><span>Durum</span><div>${earning.status}</div></div>
                  <div class="detail-row"><span>Kaynak</span><div>${earning.type}</div></div>
                </div>
              </section>
              <section class="earning-detail-note">
                <strong>Detay</strong>
                <span>${earning.detail}</span>
              </section>
            </div>
          </section>
        `;
      }

      function notificationMenuSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Bildirim seçenekleri">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Bildirim Seçenekleri</h3><p>Liste işlemlerini buradan yönet.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="stack">
              <button class="link-card" type="button" data-action="mark-notifications-read">
                ${icon("check")}
                <span><strong>Tümü Okundu İşaretle</strong><small>Okunmamış bildirimleri temizle.</small></span>
                ${icon("chevron-right")}
              </button>
              <button class="link-card" type="button" data-action="clear-notifications-request">
                ${icon("x")}
                <span><strong>Tümünü sil</strong><small>Silmeden önce onay isteyeceğiz.</small></span>
                ${icon("chevron-right")}
              </button>
              <button class="link-card" type="button" data-action="notification-settings">
                ${icon("settings")}
                <span><strong>Bildirim Ayarları</strong><small>Profil ayarlarından tercihlerini düzenle.</small></span>
                ${icon("chevron-right")}
              </button>
            </div>
          </section>
        `;
      }

      function notificationClearConfirmSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Bildirimleri silme onayı">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Tüm bildirimleri silmek istiyor musun?</h3><p>Bu işlem bildirim listesini temizler.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="İptal">${icon("x")}</button>
            </div>
            <div class="action-row">
              <button class="secondary-btn" type="button" data-close>İptal</button>
              <button class="primary-btn" type="button" data-action="clear-notifications-confirm" style="background:#b42318">${icon("x")} Sil</button>
            </div>
          </section>
        `;
      }

      function notificationReadConfirmSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Bildirimleri okundu yapma onayı">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Tüm bildirimler okundu yapılacaktır</h3><p>Bu işlemi onaylıyor musun?</p></div>
              <button class="icon-btn" type="button" data-close aria-label="İptal">${icon("x")}</button>
            </div>
            <div class="action-row">
              <button class="secondary-btn" type="button" data-close>İptal</button>
              <button class="primary-btn" type="button" data-action="mark-notifications-read-confirm">${icon("check")} Onayla</button>
            </div>
          </section>
        `;
      }

      function showSheet(kind) {
        const layer = document.getElementById("sheetLayer");
        const templates = {
          menu: menuSheet,
          notifications: notificationsSheet,
          "how-it-works": howItWorksSheet,
          assurance: assuranceSheet,
          "pool-info": poolInfoSheet,
          "job-detail": jobDetailSheet,
          issue: issueSheet,
          offer: offerSheet,
          qr: qrSheet,
          "review-qr": reviewQrSheet,
          "review-reply": reviewReplySheet,
          credit: creditSheet,
          package: packageSheet,
          checkout: quickCheckoutSheet,
          "wallet-info": walletInfoSheet,
          "bonus-info": bonusInfoSheet,
          "bonus-convert": bonusConvertSheet,
          "performance-info": performanceInfoSheet,
          "task-detail": taskDetailSheet,
          "referral-partner": referralPartnerSheet,
          "referral-earning-detail": referralEarningDetailSheet,
          "notification-menu": notificationMenuSheet,
          "notification-clear-confirm": notificationClearConfirmSheet,
          "notification-read-confirm": notificationReadConfirmSheet,
          status: statusSheet,
          ticket: ticketSheet,
        };
        layer.innerHTML = templates[kind] ? templates[kind]() : "";
        layer.dataset.sheet = kind;
        layer.classList.add("show");
      }

      function closeSheet() {
        const layer = document.getElementById("sheetLayer");
        layer.classList.remove("show");
        delete layer.dataset.sheet;
        layer.innerHTML = "";
      }

      function drawerNameSize(name) {
        const overflowChars = Math.max(0, name.length - 14);
        return Math.max(14, 19.5 - overflowChars * 0.38).toFixed(1);
      }

      function drawerBadgesMarkup() {
        const extraBadges = state.drawerBadgesExpanded
          ? `
              <span class="drawer-mini-badge is-extra">${icon("clipboard")} Sonuç Bildiren</span>
              <span class="drawer-mini-badge is-extra">${icon("calendar")} Randevu Düzenli</span>
            `
          : "";
        return `
          <span class="drawer-mini-badge badge-span-2">${icon("check")} Güvenilir</span>
          <span class="drawer-mini-badge badge-span-2">${icon("sparkles")} Hızlı</span>
          <span class="drawer-mini-badge badge-span-2">${icon("map-pin")} Bölge Aktifi</span>
          <button class="drawer-mini-badge is-more" type="button" data-action="toggle-drawer-badges" aria-expanded="${state.drawerBadgesExpanded ? "true" : "false"}">${state.drawerBadgesExpanded ? "−" : "+2"}</button>
          ${extraBadges}
        `;
      }

      function drawerProfileCard() {
        const partnerName = "Ahmet Kaya";
        return `
          <section class="drawer-profile-card" aria-label="Partner profili">
            <div class="drawer-avatar" aria-hidden="true">AK</div>
            <div class="drawer-profile-copy">
              <div class="drawer-name-row">
                <h3 style="--drawer-name-size:${drawerNameSize(partnerName)}px">${partnerName}</h3>
                <span class="drawer-badge">${icon("crown")} Gold Partner</span>
              </div>
              <span class="drawer-rating">${icon("star")} 4.8 Puan · 126 Değerlendirme</span>
            </div>
            <span class="drawer-badges">
              ${drawerBadgesMarkup()}
            </span>
          </section>
          <section class="drawer-work-status-card ${state.dispatchOn ? "is-working" : "is-resting"}" aria-label="Çalışma durumu">
            <div class="row">
              <span class="drawer-status-copy">
                <strong>Çalışma Durumu</strong>
                <small>${state.dispatchOn ? "Aktif" : "Pasif"}</small>
              </span>
              <button class="toggle ${state.dispatchOn ? "is-on" : ""}" type="button" id="dispatchToggle" aria-label="Çalışma durumu" aria-pressed="${state.dispatchOn ? "true" : "false"}"><span></span></button>
            </div>
          </section>
        `;
      }

      function syncDispatchToggleUi(root = document) {
        const isWorking = state.dispatchOn;
        const statusCard = root.querySelector(".drawer-work-status-card");
        const statusText = root.querySelector(".drawer-work-status-card .drawer-status-copy small");
        const toggle = root.querySelector("#dispatchToggle");
        if (!statusCard || !statusText || !toggle) return;

        statusCard.classList.toggle("is-working", isWorking);
        statusCard.classList.toggle("is-resting", !isWorking);
        statusText.textContent = isWorking ? "Aktif" : "Pasif";
        toggle.classList.toggle("is-on", isWorking);
        toggle.setAttribute("aria-pressed", isWorking ? "true" : "false");
      }

      function drawerWalletCard() {
        return `
          <section class="drawer-wallet-card" aria-label="Kredi ve bonus özeti">
            <div class="drawer-wallet-stats">
              <div class="drawer-wallet-stat">
                <span class="drawer-wallet-icon" style="--wallet-bg:#fff7e6;--wallet-color:#d99a0b">${icon("coin")}</span>
                <span class="drawer-wallet-copy"><strong>137</strong><small>Kredi</small></span>
              </div>
              <span class="drawer-wallet-divider" aria-hidden="true"></span>
              <div class="drawer-wallet-stat">
                <span class="drawer-wallet-icon" style="--wallet-bg:#eef4ff;--wallet-color:#2556c7">${icon("gift")}</span>
                <span class="drawer-wallet-copy"><strong>42</strong><small>Bonus</small></span>
              </div>
            </div>
            <button class="drawer-credit-cta" type="button" data-action="buy-credit" aria-label="Kredi yükle">${icon("plus")} Kredi Yükle</button>
          </section>
        `;
      }

      function drawerMenuItem(item) {
        const target = item.route
          ? `data-route="${item.route}"`
          : item.screen
            ? `data-screen="${item.screen}"`
            : `data-action="${item.action || "menu-placeholder"}" data-label="${item.label}"`;
        const activeRoute = item.route && getCurrentRoute() === item.route;
        return `
          <button class="drawer-menu-item ${activeRoute ? "is-active" : ""}" type="button" ${target} style="--drawer-item-color:${item.color}" aria-label="${item.label}" ${activeRoute ? 'aria-current="page"' : ""}>
            <span class="drawer-menu-icon">${icon(item.icon)}</span>
            <span class="drawer-menu-copy">
              <strong data-fit-text data-fit-min="11" data-fit-max="14">${item.label}</strong>
              ${item.description ? `<small>${item.description}</small>` : ""}
            </span>
            ${icon("chevron-right")}
          </button>
        `;
      }

      function drawerMenuSection(section) {
        return `
          <div>
            <div class="drawer-section-title">${section.title}</div>
            <section class="drawer-menu-card" aria-label="${section.title}">
              ${section.items.map((item) => drawerMenuItem(item)).join("")}
            </section>
          </div>
        `;
      }

      function drawerPromoCard() {
        return `
          <section class="drawer-promo-card" aria-label="Paket seçenekleri">
            <span class="drawer-promo-sparkles" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <strong class="drawer-promo-title">Daha fazla iş fırsatı yakala</strong>
            <span class="drawer-package-pins">
              <button class="drawer-package-pin" type="button" data-route="/packages" style="--pin-color:#667085" aria-label="Ücretsiz paket">
                ${icon("navigation")}
                <strong>Ücretsiz</strong>
                <small>Başla</small>
              </button>
              <button class="drawer-package-pin is-gold" type="button" data-route="/packages" style="--pin-color:#d99a0b" aria-label="Gold paket">
                ${icon("star")}
                <strong>Gold</strong>
                <small>Popüler</small>
              </button>
              <button class="drawer-package-pin is-pro" type="button" data-route="/packages" style="--pin-color:#12b76a" aria-label="Pro paket">
                ${icon("shield")}
                <strong>Pro</strong>
                <small>Profesyonel</small>
              </button>
              <button class="drawer-package-pin is-vip" type="button" data-route="/packages" style="--pin-color:#f59e0b" aria-label="VIP paket">
                ${icon("crown")}
                <strong>VIP</strong>
                <small>En iyisi</small>
              </button>
            </span>
          </section>
        `;
      }

      function drawerUpgradeBanner() {
        return `
          <button class="drawer-upgrade-banner" type="button" data-route="/subscription" aria-label="Plus avantajlarını keşfet">
            <span class="drawer-upgrade-copy">
              <strong>Müşterilere Plus olarak görün</strong>
              <small>Plus ile %18 daha fazla iş al</small>
            </span>
            <span class="drawer-upgrade-cta">Yükselt</span>
          </button>
        `;
      }

      function drawerSupportCard() {
        return `
          <button class="drawer-support-card" type="button" data-route="/support" aria-label="Yardım ve Destek">
            <span class="drawer-support-icon">${icon("headphones")}</span>
            <span>
              <strong>Yardım ve Destek</strong>
              <small>Ticket, danışman ve mesaj takibi</small>
            </span>
            <span class="drawer-support-arrow">${icon("chevron-right")}</span>
          </button>
        `;
      }

      function menuSheet() {
        return `
          <section class="sheet partner-menu" role="dialog" aria-label="Partner menüsü">
            <div class="drawer-menu-head">
              ${drawerUpgradeBanner()}
              <button class="drawer-close-btn" type="button" data-close aria-label="Menüyü kapat">${icon("x")}</button>
            </div>
            <div class="drawer-scroll">
              ${drawerProfileCard()}
              ${drawerSections.map((section) => drawerMenuSection(section)).join("")}
            </div>
          </section>
          ${drawerSupportCard()}
        `;
      }

      function notificationsSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Bildirimler">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Bildirimler</h3><p>İş, cüzdan ve performans uyarıların.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="stack">
              <button class="link-card" type="button" data-screen="work">
                ${icon("phone")}
                <span><strong>Yeni iş fırsatı hazır</strong><small>Müşteriyi sistem hattı üzerinden ara.</small></span>
                ${icon("chevron-right")}
              </button>
              <button class="link-card" type="button" data-screen="wallet">
                ${icon("wallet")}
                <span><strong>Kredi bakiyen azalıyor</strong><small>675 kredi yaklaşık 2-3 iş için yeterli.</small></span>
                ${icon("chevron-right")}
              </button>
              <button class="link-card" type="button" data-screen="performanceScore">
                ${icon("trend-up")}
                <span><strong>Performans hedefin yakın</strong><small>85 hedefi için 4 puan kaldı.</small></span>
                ${icon("chevron-right")}
              </button>
              <button class="link-card" type="button" data-screen="support">
                ${icon("headphones")}
                <span><strong>Destek kaydı güncellendi</strong><small>LP-28491 inceleme aşamasında.</small></span>
                ${icon("chevron-right")}
              </button>
            </div>
          </section>
        `;
      }

      function notificationItems() {
        return [
          { id: "n1", title: "Yeni iş fırsatı hazır", desc: "Karşıyaka’da klima arızası için müşteri hazır.", time: "2 dk önce", icon: "phone", screen: "work", unread: true, actionLabel: "Gör" },
          { id: "n4", title: "Teklif bekleyen müşteri var", desc: "15 kullanıcı fiyat teklifi bekliyor.", time: "6 dk önce", icon: "edit", screen: "work", unread: true, actionLabel: "Yanıtla" },
          { id: "n5", title: "Havuzda sana uygun işler var", desc: "Bölgendeki 4 havuz işini incele.", time: "12 dk önce", icon: "briefcase", screen: "work", unread: true, actionLabel: "İncele" },
          { id: "n2", title: "Bakiye düşük", desc: "Yeni iş için kredi yüklemelisin.", time: "18 dk önce", icon: "wallet", screen: "wallet", unread: true, actionLabel: "Bakiye Yükle", tone: "warning" },
          { id: "n3", title: "Performans hedefin yakın", desc: "85 puana ulaşmana çok az kaldı.", time: "31 dk önce", icon: "trend-up", screen: "performanceScore", unread: false, actionLabel: "Gör" },
          { id: "n6", title: "Destek kaydı güncellendi", desc: "LP-28491 inceleme aşamasında.", time: "1 sa önce", icon: "headphones", screen: "support", unread: false, actionLabel: "İncele" },
          { id: "n7", title: "Yeni müşteri yorumu geldi", desc: "Elif Y. servis deneyimini 5.0 puanladı.", time: "2 sa önce", icon: "star", screen: "reviews", unread: true, actionLabel: "Yanıtla" },
          { id: "n8", title: "Partner davetin ilerledi", desc: "Bonus aşaması yaklaşıyor.", time: "3 sa önce", icon: "users", screen: "referral", unread: false, actionLabel: "Gör" },
          { id: "n9", title: "Çalışma planı önerisi", desc: "08:00-22:00 planını kontrol et.", time: "Bugün 09:20", icon: "calendar", screen: "workPlan", unread: false, actionLabel: "Gör" },
          { id: "n10", title: "Bonus kullanım fırsatı", desc: "Bonus kredi yüklerken kullanılır.", time: "Bugün 08:42", icon: "gift", screen: "wallet", unread: false, actionLabel: "Gör" },
          { id: "n11", title: "Bölge hareketi arttı", desc: "Yakındaki işler hareketlendi.", time: "Dün 18:15", icon: "bar-chart", screen: "home", unread: false, actionLabel: "İncele" },
          { id: "n12", title: "Liderlik sıralaması güncellendi", desc: "Sektör ligindeki yerin değişti.", time: "Dün 15:10", icon: "trophy", screen: "levels", unread: false, actionLabel: "Gör" },
          { id: "n13", title: "Garanti formu hatırlatması", desc: "Servis fişini oluşturabilirsin.", time: "Dün 11:06", icon: "file-text", screen: "jobs", unread: false, actionLabel: "Gör" },
          { id: "n14", title: "Fatura hareketi hazır", desc: "Son işlem hesap hareketlerine eklendi.", time: "2 gün önce", icon: "receipt", screen: "wallet", unread: false, actionLabel: "İncele" },
          { id: "n15", title: "VIP görünürlük avantajı", desc: "Üst paketlerle öncelik kazan.", time: "2 gün önce", icon: "crown", screen: "subscription", unread: false, actionLabel: "Gör" },
          { id: "n16", title: "Yeni doğrudan iş geldi", desc: "Serdivan’da çamaşır makinesi arızası bekliyor.", time: "2 gün önce", icon: "phone", screen: "work", unread: false, actionLabel: "Gör" },
          { id: "n17", title: "Teklif süren dolmak üzere", desc: "3 müşteri bugün fiyat teklifi bekliyor.", time: "2 gün önce", icon: "edit", screen: "work", unread: false, actionLabel: "Gör" },
          { id: "n18", title: "Yeni yorum yanıt bekliyor", desc: "Murat K. yorumuna dönüş yapabilirsin.", time: "3 gün önce", icon: "message", screen: "reviews", unread: false, actionLabel: "Yanıtla" },
          { id: "n19", title: "Kredi yükleme tamamlandı", desc: "250 kredi cüzdanına eklendi.", time: "3 gün önce", icon: "wallet", screen: "wallet", unread: false, actionLabel: "İncele" },
          { id: "n20", title: "Havuz işi kısa sürede alındı", desc: "Bölgedeki hareketlilik artıyor.", time: "3 gün önce", icon: "briefcase", screen: "work", unread: false, actionLabel: "Gör" },
          { id: "n21", title: "Partner daveti kayıt oldu", desc: "Ahmet K. aynı numarayla kayıt oldu.", time: "4 gün önce", icon: "users", screen: "referral", unread: false, actionLabel: "Gör" },
          { id: "n22", title: "Çalışma saati önerisi", desc: "08:00-22:00 planı daha fazla iş getirebilir.", time: "4 gün önce", icon: "clock", screen: "workPlan", unread: false, actionLabel: "Gör" },
          { id: "n23", title: "Paket avantajı hazır", desc: "Plus ile daha fazla görünürlük alabilirsin.", time: "5 gün önce", icon: "crown", screen: "subscription", unread: false, actionLabel: "Gör" },
          { id: "n24", title: "Destek mesajı geldi", desc: "Danışman yanıtını mesaj kutusunda görebilirsin.", time: "5 gün önce", icon: "headphones", screen: "support", unread: false, actionLabel: "İncele" },
          { id: "n25", title: "Randevu linkin görüntülendi", desc: "Bir müşteri QR bağlantını açtı.", time: "6 gün önce", icon: "qr", screen: "appointmentLink", unread: false, actionLabel: "Gör" },
          { id: "n26", title: "Bölge istatistikleri yenilendi", desc: "Bugünkü tamamlanan işler güncellendi.", time: "6 gün önce", icon: "bar-chart", screen: "home", unread: false, actionLabel: "İncele" },
          { id: "n27", title: "Profil gücü artabilir", desc: "2 fotoğraf daha ekleyerek profili güçlendir.", time: "1 hafta önce", icon: "user", screen: "profile", unread: false, actionLabel: "Gör" },
          { id: "n28", title: "Bonus kullanım hatırlatması", desc: "Bonus kredi yüklerken kullanılabilir.", time: "1 hafta önce", icon: "gift", screen: "wallet", unread: false, actionLabel: "Gör" },
          { id: "n29", title: "Servis fişi önerisi", desc: "Tamamlanan iş için servis fişi oluştur.", time: "1 hafta önce", icon: "file-text", screen: "jobs", unread: false, actionLabel: "Gör" },
          { id: "n30", title: "Haftalık liderlik güncellendi", desc: "Sıralamadaki konumun yenilendi.", time: "1 hafta önce", icon: "trophy", screen: "levels", unread: false, actionLabel: "Gör" },
        ];
      }

      function notificationUnreadCount() {
        if (state.notificationsCleared) return 0;
        const readIds = new Set(state.notificationReadIds || []);
        return notificationItems().filter((item) => item.unread && !readIds.has(item.id)).length;
      }

      function renderNotifications() {
        const allItems = notificationItems();
        const readIds = new Set(state.notificationReadIds || []);
        const items = state.notificationsCleared ? [] : allItems;
        const decoratedItems = items.map((item) => ({ ...item, isRead: !item.unread || readIds.has(item.id) }));
        const hasHiddenReadItems = decoratedItems.some((item) => item.isRead);
        const displayedItems = state.showReadNotifications ? decoratedItems : decoratedItems.filter((item) => !item.isRead);
        const visibleItems = displayedItems.slice(0, Math.min(state.notificationVisibleCount, displayedItems.length));
        const unreadCount = decoratedItems.filter((item) => !item.isRead).length;
        const hasMore = visibleItems.length < displayedItems.length;
        const shouldShowMoreIndicator = hasMore || (!state.showReadNotifications && hasHiddenReadItems);
        const row = (item) => `
          <button class="notification-row ${item.isRead ? "is-read" : "is-unread"} ${item.tone === "warning" ? "is-warning" : ""}" type="button" data-action="open-notification" data-notification-id="${item.id}" data-notification-screen="${item.screen}" aria-label="${escapeHtml(item.title)}">
            <span class="notification-copy">
              <strong>${item.title}</strong>
              <small>${item.desc}</small>
            </span>
            ${item.tone === "warning" ? `<span class="notification-warning-cta">Bakiye Yükle</span>` : ""}
          </button>
        `;

        return `
          <div class="notifications-screen">
            <header class="notifications-head">
              <button class="back-btn" type="button" data-action="go-back" aria-label="Geri dön">${icon("chevron-left")}</button>
              <div>
                <h2>Bildirimler</h2>
                <p>Önemli gelişmeler için bildirimleri takip et</p>
              </div>
              <button class="notification-more-btn" type="button" data-open="notification-menu" aria-label="Bildirim seçenekleri"></button>
            </header>
            <section class="notification-summary-card" aria-label="Bildirim aksiyonları">
              <div class="notification-summary-row">
                <button class="notification-action-btn is-muted" type="button" data-action="show-read-notifications">${state.showReadNotifications ? "Okunanları Gizle" : "Okunanları Göster"}</button>
                <button class="notification-action-btn" type="button" data-action="mark-notifications-read">${icon("check")} Okundu Yap</button>
              </div>
            </section>
            ${displayedItems.length ? `
              <section class="notification-list" aria-label="Bildirim listesi">
                ${visibleItems.map(row).join("")}
                <div class="notification-load-note" data-notification-load-note data-complete="${hasMore ? "false" : "true"}" aria-hidden="true"></div>
                ${shouldShowMoreIndicator ? `<div class="notification-more-indicator" aria-hidden="true">${icon("chevron-down")}</div>` : ""}
              </section>
            ` : `
              <section class="notification-empty">
                <span>
                  <strong>Bildirim kutun temiz</strong><br />
                  <small>Yeni iş, cüzdan ve destek bildirimleri burada görünür.</small>
                </span>
              </section>
            `}
          </div>
        `;
      }

      function howItWorksSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Lipyum nasıl çalışır">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Lipyum nasıl çalışır?</h3><p>İş modeli sade ve şeffaftır.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="timeline">
              ${timeline("Müşteri Lipyum’u arar", "Temsilci servis kaydını oluşturur.", true)}
              ${timeline("Bilgiler netleşir", "Servis ücreti ve süreç bilgisi müşteriye verilir.", true)}
              ${timeline("İş partnere gider", "Uygun iş uygulama üzerinden görünür; müşteri sistem hattından aranır.", true)}
              ${timeline("Kredi / hak kullanılır", "İş gönderildiyse haftalık hak veya kredi düşmüş olur.", true)}
            </div>
            <section class="callout soft section">
              <p>İş kalitesi Lipyum çağrı merkezi standardı ile sabittir. Daha yüksek iş alma ücreti, uygun işlerde daha fazla öncelik anlamına gelir.</p>
            </section>
          </section>
        `;
      }

      function assuranceSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="İptal güvencesi">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>İptal Güvencesi</h3><p>Müşteri, sistem veya personel kaynaklı hatalarda bonus değil nakit iade yapılır.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="stack">
              <div class="assurance-line">${icon("check")} Yanlış numara, müşteri iptali veya ulaşılamama durumunda hızlı itiraz açabilirsin.</div>
              <div class="assurance-line">${icon("check")} Üst üste 3. iş iptal edilemez; sistem adil kullanım için kontrol yapar.</div>
              <div class="assurance-line">${icon("check")} 10 işten sonra iptal oranı üst sınırı %35 olarak uygulanır.</div>
            </div>
            <button class="primary-btn" type="button" data-action="issue" style="width:100%;margin-top:12px">${icon("alert")} Hızlı İtiraz Aç</button>
          </section>
        `;
      }

      function poolInfoSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Havuz nedir">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Havuz nedir?</h3><p>O anda uygun partner bulunamadığı için bekleyen işlerdir.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <p class="body muted" style="margin:0">Bu işler Lipyum’da kayıt oluşturulan, servis ücreti bilgisi verilmiş müşteri kayıtlarıdır. Uygun görürsen havuzdan işi alabilirsin.</p>
          </section>
        `;
      }

      function jobDetailSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="İş detayı">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Klima Montajı</h3><p>Sakarya / Karasu · Talep: Bugün 15:12 · Son teyit: 15:18</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="card card-pad">
              <div class="detail-list">
                <div class="detail-row"><span>Müşteri</span><strong>Turgut Yabancıoğlu</strong></div>
                <div class="detail-row"><span>Servis istiyor</span><strong>Evet</strong></div>
                <div class="detail-row"><span>Bilgi</span><div>Servis ücreti söylendi. Ek işlem bedeli yerinde netleşir. Müşteri partner bekliyor.</div></div>
                <div class="detail-row"><span>Temsilci notu</span><div>Yeni klima montajı istiyor. Bugün uygunsa görüşmek istiyor.</div></div>
              </div>
              <div class="price-box">
                <div class="price-line"><span>Normal iş bedeli</span><strong>320 kredi</strong></div>
                <div class="price-line"><span>Paket fiyatın</span><strong>260 kredi</strong></div>
                <div class="price-line save"><span>Tasarruf</span><strong>60 kredi</strong></div>
                <div class="price-line"><span>Kullanılan</span><strong>260 kredi</strong></div>
                <div class="price-line discount"><span>İndirim</span><strong>%19</strong></div>
              </div>
              <div class="assurance-line">${icon("check")} Müşteri kaynaklı iptalde nakit iade güvencesi vardır.</div>
              <div class="action-row" style="margin-top:10px">
                <button class="primary-btn" type="button" data-action="call">${icon("phone")} Müşteriyi Ara</button>
                <button class="secondary-btn" type="button" data-action="route">${icon("navigation")} Yol Tarifi</button>
              </div>
              <div class="action-row" style="margin-top:8px">
                <button class="secondary-btn" type="button" data-open="assurance">${icon("check")} İptal Güvencesi</button>
                <button class="danger-btn" type="button" data-action="issue">${icon("alert")} Sorun Bildir</button>
              </div>
            </div>
          </section>
        `;
      }

      function issueSheet() {
        const groups = [
          ["Müşteri kaynaklı", ["Müşteriye ulaşamadım", "Numara hatalı", "Müşteri vazgeçmiş", "Müşteri başka yerle anlaşmış", "Müşteri servis ücretini kabul etmiyor"]],
          ["Kayıt/sistem kaynaklı", ["Hizmet alanı yanlış", "Bölge/adres yanlış", "Müşteri bilgisi eksik", "Aynı kayıt tekrar geldi", "Personel notu hatalı"]],
          ["Partner kaynaklı", ["Bu işi yapamıyorum", "Yanlış hizmet seçmişim", "Bugün müsait değilim"]],
        ];
        return `
          <section class="sheet" role="dialog" aria-label="Sorun bildir">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Bu işte ne sorun yaşadın?</h3><p>Kategori seç, çağrı merkezi kaydı kontrol etsin.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="chip-row" style="margin-bottom:10px">
              ${["Yanlış numara", "Müşteri iptal", "Ulaşılamıyor", "Servis ücreti kabul etmiyor", "Kayıt hatalı"].map((item) => `<button class="chip-btn" type="button" data-issue="${item}">${item}</button>`).join("")}
            </div>
            <div class="issue-groups">
              ${groups
                .map(([title, items]) => `
                  <div class="issue-group">
                    <h4>${title}</h4>
                    ${items.map((item) => `<button class="issue-option ${state.selectedIssue === item ? "active" : ""}" type="button" data-issue="${item}">${item}${state.selectedIssue === item ? icon("check") : ""}</button>`).join("")}
                  </div>
                `)
                .join("")}
            </div>
            <section class="callout soft" style="margin-top:10px">
              <p>Müşteri, sistem veya personel kaynaklı hatalarda bonus değil nakit iade yapılır. Çağrı merkezi kaydı kontrol edilecek.</p>
            </section>
            <button class="primary-btn" type="button" data-action="submit-issue" style="width:100%;margin-top:12px">${icon("alert")} Sorun Bildirimi Oluştur</button>
          </section>
        `;
      }

      function offerSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Teklif ver">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Ev Temizliği teklifi</h3><p>Bu kayıt için 1 teklif hakkı kullanılır.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="modal-grid">
              <section class="callout soft" style="padding:9px">
                <p>Bu teklif için 1 teklif hakkı kullanılacak. Hak yoksa paket fiyatın olan 90 kredi kullanılır.</p>
              </section>
              <div class="form-field">
                <label>Fiyat</label>
                <div class="input-wrap"><strong>₺</strong><input type="number" value="2500" aria-label="Teklif fiyatı" /></div>
              </div>
              <div class="form-field">
                <label>Açıklama</label>
                <textarea id="offerText" placeholder="Müşteriye kısa mesaj yaz">Merhaba, ev temizliği için bugün ekibim uygun. Detayları konuşup net saat paylaşabilirim.</textarea>
              </div>
              <div class="chip-row">
                <button class="chip-btn" type="button" data-preset="Bugün uygunum">Bugün uygunum</button>
                <button class="chip-btn" type="button" data-preset="Yarın gelebilirim">Yarın gelebilirim</button>
                <button class="chip-btn" type="button" data-preset="Yerinde net fiyat verebilirim">Yerinde net fiyat verebilirim</button>
              </div>
              <div class="chip-row">
                ${["Bugün", "Yarın", "Hafta sonu"].map((d) => `<button class="chip-btn ${state.selectedDate === d ? "active" : ""}" type="button" data-date="${d}">${d}</button>`).join("")}
              </div>
              <button class="primary-btn" type="button" data-action="submit-offer">${icon("edit")} Teklifi Gönder</button>
            </div>
          </section>
        `;
      }

      function qrSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Randevu QR">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Randevu QR</h3><p>Bu linkten gelen müşterilerden komisyon alınmaz.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="qr-box" aria-label="QR kod görseli"></div>
            <p class="body strong" style="text-align:center;margin:0 0 12px">lipyum.com/r/kuafor-adi</p>
            <div class="action-row three">
              <button class="secondary-btn" type="button" data-action="share-link">${icon("share")} Linki Paylaş</button>
              <button class="secondary-btn" type="button" data-action="instagram">${icon("share")} Instagram</button>
              <button class="secondary-btn" type="button" data-action="print">${icon("qr")} Yazdır</button>
            </div>
          </section>
        `;
      }

      function reviewQrSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Yorum QR kodu">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Yorum QR</h3><p>Müşterin QR'ı okutarak yorum linkine gider.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="review-qr-panel">
              <div class="review-qr-large" aria-label="lipyum.com/yorum/ahmet-kaya QR kodu"></div>
              <p class="body strong" style="text-align:center;margin:0">lipyum.com/yorum/ahmet-kaya</p>
              <p class="tiny muted" style="text-align:center;margin:0">QR çıktısı veya ekran görüntüsüyle yorum toplama linkini hızlıca paylaşabilirsin.</p>
            </div>
            <div class="action-row" style="margin-top:10px">
              <button class="primary-btn" type="button" data-action="share-review-link">${icon("share")} Paylaş</button>
              <button class="secondary-btn" type="button" data-action="copy-review-link">${icon("copy")} Linki Kopyala</button>
            </div>
          </section>
        `;
      }

      function reviewReplySheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Yoruma yanıt ver">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>${state.selectedReviewName} yorumuna yanıt</h3><p>Kısa, nazik ve çözüm odaklı yanıtlar güveni artırır.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="review-reply-sheet">
              <div class="review-reply-preview">${state.selectedReviewText}</div>
              <textarea class="review-reply-input" data-review-reply-input placeholder="Nazik yanıtını yaz. Örn: Değerli yorumunuz için teşekkür ederiz, memnun kalmanıza sevindik.">${escapeHtml(state.selectedReviewReply || "")}</textarea>
              <div class="review-reply-suggestions" aria-label="Hazır yanıt önerileri">
                <button class="secondary-btn" type="button" data-action="use-review-reply-template" data-template="Değerli yorumunuz için teşekkür ederiz, memnun kalmanıza sevindik.">Teşekkür yanıtı kullan</button>
                <button class="secondary-btn" type="button" data-action="use-review-reply-template" data-template="Geri bildiriminiz için teşekkür ederiz. Bir sonraki hizmette daha iyi bir deneyim sunmak isteriz.">Gelişim yanıtı kullan</button>
              </div>
              <button class="primary-btn" type="button" data-action="send-review-reply" style="width:100%;min-height:48px">${icon("message")} Yanıtı Gönder</button>
            </div>
          </section>
        `;
      }

      function creditSheet() {
        const packs = [
          ["475 kredi", "₺475", "Yaklaşık 1-2 iş veya 5 teklif", "Bonus yok"],
          ["950 kredi", "₺950", "Yaklaşık 3-4 iş veya 10 teklif", "+75 bonus"],
          ["1.425 kredi", "₺1.425", "Yaklaşık 5-6 iş veya 16 teklif", "+150 bonus"],
        ];
        return `
          <section class="sheet" role="dialog" aria-label="Bakiye yükle">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Bakiye Yükle</h3><p>Paket hakkın bitse de iş almaya ve teklif vermeye devam et.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="stack">
              ${packs.map(([credit, price, approx, bonus]) => `
                <button class="link-card" type="button" data-action="buy-credit">
                  <span><strong>${credit} · ${price}</strong><small>${approx} · ${bonus}</small></span>${icon("chevron-right")}
                </button>`).join("")}
            </div>
            <section class="callout soft" style="margin-top:10px"><p>Ödeme sonrası bakiye hemen hesabına geçer. Uygun işler uygulamada görünür ve müşteri sistem hattından aranır.</p></section>
          </section>
        `;
      }

      function packageSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Paket yükselt">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Paket Yükselt</h3><p>Haftalık direkt iş, havuz ve teklif haklarını artır.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <section class="card card-pad">
              <span class="tag green">Önerilen</span>
              <h3 style="margin:8px 0 4px;font-size:17px">Plus Üyelik</h3>
              <p class="tiny muted" style="margin:0 0 10px">Direkt iş, havuz ve teklif haklarını artırarak daha fazla fırsata eriş.</p>
              <button class="primary-btn" type="button" data-action="upgrade-package" style="width:100%">${icon("package")} Yükseltmeyi Başlat</button>
            </section>
            <section class="card card-pad section">
              <span class="tag purple">Premium seçenek</span>
              <h3 style="margin:8px 0 4px;font-size:17px">Pro / VIP</h3>
              <p class="tiny muted" style="margin:0 0 10px">Daha yüksek görünürlük, daha geniş hak havuzu ve öncelikli destek sağlar.</p>
              <button class="secondary-btn" type="button" data-action="upgrade-package" style="width:100%">${icon("sparkles")} Paketleri İncele</button>
            </section>
          </section>
        `;
      }

      function quickCheckoutSheet() {
        const plan = checkoutPackage();
        return `
          <section class="sheet" role="dialog" aria-label="Hızlı ödeme">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>${plan.label} paketine geç</h3><p>Ödeme adımı kısa tutuldu; paket hemen aktifleşir.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <section class="card card-pad">
              <div class="row">
                <div>
                  <span class="tag green">${icon(plan.iconName)} Seçili paket</span>
                  <h3 style="margin:8px 0 2px;font-size:18px">${plan.price}<span style="font-size:11px;color:#667085"> ${plan.cycle}</span></h3>
                  <p class="tiny muted" style="margin:0">${plan.promise}</p>
                </div>
              </div>
              <div class="mini-table" style="margin-top:10px">
                <div class="mini-row"><span>Ödeme yöntemi</span><strong>Kayıtlı kart</strong></div>
                <div class="mini-row"><span>Aktivasyon</span><strong>Anında</strong></div>
                <div class="mini-row"><span>İptal</span><strong>Hesaptan yönetilir</strong></div>
              </div>
              <button class="primary-btn" type="button" data-action="pay-package" style="width:100%;margin-top:10px">${icon("credit-card")} Hızlı Ödemeye Geç</button>
            </section>
          </section>
        `;
      }

      function walletInfoSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Cüzdan nedir">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Cüzdan</h3><p>Kredi bakiyen hakların azaldığında iş alma ve teklif akışında esneklik sağlar.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <section class="card card-pad">
              <div class="detail-list">
                <div class="detail-row"><span>Bakiye</span><div>Kredi yükleyerek uygun işlerde veya teklif adımlarında kullanabilirsin.</div></div>
                <div class="detail-row"><span>Kontrol</span><div>Kullanım hareketlerini cüzdan ekranından takip edebilirsin.</div></div>
              </div>
              <button class="primary-btn" type="button" data-open="credit" style="width:100%;margin-top:10px">${icon("plus")} Bakiye Yükle</button>
            </section>
          </section>
        `;
      }

      function bonusInfoSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Bonus cüzdanı nedir">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Bonus</h3><p>Kampanya, iade veya performans kaynaklı bonusların burada birikir.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <section class="card card-pad">
              <div class="detail-list">
                <div class="detail-row"><span>Kullanım</span><div>Uygun kampanyalarda kredi avantajı veya krediye çevirme başvurusu için değerlendirilir.</div></div>
                <div class="detail-row"><span>Krediye çevir</span><div>Koşullar sağlandığında bonus bakiyeni krediye çevirmek için başvuru oluşturabilirsin.</div></div>
              </div>
              <button class="primary-btn" type="button" data-open="bonus-convert" style="width:100%;margin-top:10px">${icon("credit-card")} Krediye Çevir</button>
            </section>
          </section>
        `;
      }

      function performanceInfoSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Performans skoru nedir">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Performans Skoru</h3><p>İş görünürlüğünü ve doğrudan iş alma fırsatlarını anlaman için tasarlanır.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <section class="card card-pad">
              <p class="body" style="margin:0">Performans Skoru; yanıt hızı, iş tamamlama, müşteri memnuniyeti, profil gücü ve platform kurallarına uyuma göre hesaplanır.</p>
            </section>
          </section>
        `;
      }

      function bonusConvertSheet() {
        const multiplier = 3;
        const bonusAmount = 500;
        const requiredAmount = bonusAmount * multiplier;
        return `
          <section class="sheet" role="dialog" aria-label="Bonusu krediye çevir">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Bonusu Krediye Çevir</h3><p>Krediye çevirmek istediğin bonus tutarının belirlenen katı kadar ödeme yaptığında bonusunu krediye çevirebilirsin.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="card card-pad">
              <div class="mini-table">
                <div class="mini-row"><span>Krediye çevrilecek bonus</span><strong>${bonusAmount} TL</strong></div>
                <div class="mini-row"><span>Gerekli ödeme/işlem şartı</span><strong>${multiplier} kat</strong></div>
                <div class="mini-row"><span>Gerekli tutar</span><strong>${requiredAmount.toLocaleString("tr-TR")} TL</strong></div>
              </div>
              <p class="tiny muted" style="margin:10px 0 0">Kurallar kampanya dönemine göre değişebilir.</p>
            </div>
            <button class="primary-btn" type="button" data-action="bonus-convert" style="width:100%;margin-top:10px">${icon("credit-card")} Başvuruyu Oluştur</button>
          </section>
        `;
      }

      function taskDetailSheet() {
        const detail = taskDetails[state.selectedTaskKey] || taskDetails.ready;
        const card = taskCards.find((item) => item.key === state.selectedTaskKey) || taskCards[0];
        const actionAttrs = detail.actionType === "close-sheet" ? "data-close" : `data-action="${detail.actionType}"`;
        return `
          <section class="sheet" role="dialog" aria-label="${detail.title}">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>${detail.title}</h3><p>${detail.desc}</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="task-detail-list">
              ${detail.items.map((item) => `
                <article class="task-detail-item">
                  <span>${icon(card.iconName)}</span>
                  <span>
                    <strong>${item[0]}</strong>
                    <small>${item[1]}</small>
                    <em>${item[2]}</em>
                  </span>
                </article>
              `).join("")}
            </div>
            <button class="primary-btn" type="button" ${actionAttrs} style="width:100%;margin-top:10px">${icon(card.iconName)} ${detail.actionLabel}</button>
          </section>
        `;
      }

      function statusSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Durum güncelle">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>Durum Güncelle</h3><p>Sonucu bildir, iş takibin düzenli kalsın.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <div class="stack">
              ${["Müşteriyle görüştüm", "Randevu aldım", "Hizmete gidiyorum", "İş tamamlandı"].map((item) => `<button class="link-card" type="button" data-action="status-update">${icon("check")}<span><strong>${item}</strong><small>İşlerim ekranında takip edilir</small></span>${icon("chevron-right")}</button>`).join("")}
              <button class="link-card" type="button" data-action="issue">${icon("alert")}<span><strong>Sorun Bildir</strong><small>Ticket aç ve takip et</small></span>${icon("chevron-right")}</button>
            </div>
          </section>
        `;
      }

      function ticketSheet() {
        return `
          <section class="sheet" role="dialog" aria-label="Ticket oluştur">
            <div class="sheet-handle"></div>
            <div class="sheet-head">
              <div><h3>${state.ticketTopic} ticketı oluştur</h3><p>Konu seçildi. Çağrı merkezi ekibi kaydı ve ilgili işi kontrol eder.</p></div>
              <button class="icon-btn" type="button" data-close aria-label="Kapat">${icon("x")}</button>
            </div>
            <section class="card card-pad">
              <div class="mini-table">
                <div class="mini-row"><span>Konu</span><strong>${state.ticketTopic}</strong></div>
                <div class="mini-row"><span>İlgili iş</span><strong>Klima Montajı / Karasu</strong></div>
                <div class="mini-row"><span>Kullanılan kredi</span><strong>260 kredi</strong></div>
                <div class="mini-row"><span>Tahmini dönüş</span><strong>2 saat</strong></div>
              </div>
            </section>
            <button class="primary-btn" type="button" data-action="submit-ticket" style="width:100%;margin-top:10px">${icon("headphones")} Ticket Oluştur</button>
          </section>
        `;
      }

      function initPullToRefresh() {
        const root = document.getElementById("appRoot");
        const indicator = document.getElementById("pullRefresh");
        if (!root || !indicator || root.dataset.pullRefreshBound === "true") return;

        root.dataset.pullRefreshBound = "true";
        const label = indicator.querySelector("strong");
        const spinnerIcon = indicator.querySelector(".pull-spinner .icon");
        const threshold = 78;
        const maxPull = 116;
        let startY = 0;
        let pullDistance = 0;
        let isPulling = false;
        let isRefreshing = false;

        const setIndicator = (distance) => {
          const clamped = Math.min(maxPull, Math.max(0, distance));
          const y = Math.min(34, 7 + clamped * 0.24);
          const scale = 0.96 + Math.min(0.06, clamped / 1300);
          indicator.classList.add("visible");
          indicator.style.transform = `translate(-50%, ${y}px) scale(${scale})`;
          if (spinnerIcon) spinnerIcon.style.transform = `rotate(${clamped * 2.6}deg)`;
          if (label) label.textContent = clamped >= threshold ? "Bırakınca yenile" : "Yenilemek için çek";
        };

        const resetIndicator = () => {
          pullDistance = 0;
          isPulling = false;
          indicator.classList.remove("visible", "refreshing");
          indicator.style.transform = "";
          if (spinnerIcon) spinnerIcon.style.transform = "";
          if (label) label.textContent = "Yenilemek için çek";
        };

        const triggerRefresh = () => {
          isRefreshing = true;
          indicator.classList.add("visible", "refreshing");
          indicator.style.transform = "translate(-50%, 12px) scale(1)";
          if (label) label.textContent = "Yenileniyor";

          window.setTimeout(() => {
            renderScreen();
            showToast("Ekran yenilendi");
            window.setTimeout(() => {
              isRefreshing = false;
              resetIndicator();
            }, 240);
          }, 620);
        };

        root.addEventListener("touchstart", (event) => {
          if (isRefreshing || root.scrollTop > 0 || event.touches.length !== 1) return;
          startY = event.touches[0].clientY;
          pullDistance = 0;
          isPulling = true;
        }, { passive: true });

        root.addEventListener("touchmove", (event) => {
          if (!isPulling || isRefreshing || event.touches.length !== 1) return;
          const deltaY = event.touches[0].clientY - startY;
          if (deltaY <= 0) return;
          if (root.scrollTop > 0) {
            resetIndicator();
            return;
          }

          pullDistance = Math.min(maxPull, deltaY * 0.58);
          if (pullDistance > 7) {
            event.preventDefault();
            setIndicator(pullDistance);
          }
        }, { passive: false });

        root.addEventListener("touchend", () => {
          if (!isPulling || isRefreshing) return;
          if (pullDistance >= threshold) {
            triggerRefresh();
          } else {
            resetIndicator();
          }
        }, { passive: true });

        root.addEventListener("touchcancel", resetIndicator, { passive: true });
      }

      function lockBottomNavRubberBand() {
        const bottomNav = document.getElementById("bottomNav");
        if (!bottomNav || bottomNav.dataset.rubberBandLocked === "true") return;

        bottomNav.dataset.rubberBandLocked = "true";
        let startX = 0;
        let startY = 0;

        bottomNav.addEventListener("touchstart", (event) => {
          if (!event.touches.length) return;
          startX = event.touches[0].clientX;
          startY = event.touches[0].clientY;
        }, { passive: true });

        bottomNav.addEventListener("touchmove", (event) => {
          if (!event.touches.length) return;
          const deltaX = Math.abs(event.touches[0].clientX - startX);
          const deltaY = Math.abs(event.touches[0].clientY - startY);
          if (deltaY >= deltaX) {
            event.preventDefault();
          }
        }, { passive: false });
      }

      function showToast(message) {
        const toast = document.getElementById("toast");
        toast.querySelector("span").textContent = message;
        toast.classList.add("show");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
      }

      document.addEventListener("click", (event) => {
        const screenButton = event.target.closest("[data-screen]");
        if (screenButton) {
          if (screenButton.classList.contains("back-btn")) {
            event.preventDefault();
            goBack();
            return;
          }
          if (screenButton.classList.contains("featured") && "vibrate" in navigator) {
            navigator.vibrate(8);
          }
          const nextScreen = screenButton.dataset.screen;
          if (screenButton.dataset.packageTab) state.packageTab = screenButton.dataset.packageTab;
          if (nextScreen === "reviews") {
            state.reviewListMode = false;
            state.reviewVisibleCount = 3;
            state.reviewFilter = "all";
          }
          if (nextScreen === "notifications") {
            state.showReadNotifications = false;
            state.notificationVisibleCount = 7;
          }
          if (screenButton.dataset.workTab) state.workTab = screenButton.dataset.workTab;
          closeSheet();
          navigateTo(getRouteForScreen(nextScreen));
          return;
        }

        const toggle = event.target.closest("#dispatchToggle");
        if (toggle) {
          state.dispatchOn = !state.dispatchOn;
          const layer = document.getElementById("sheetLayer");
          if (layer.dataset.sheet === "menu") {
            syncDispatchToggleUi(layer);
          } else {
            renderScreen({ preserveScroll: true });
          }
          showToast(state.dispatchOn ? "Şu an çalışıyorum modu açıldı" : "Şu an çalışmıyorum modu açıldı");
          return;
        }

        const workTab = event.target.closest("[data-set-work-tab]");
        if (workTab) {
          state.workTab = workTab.dataset.setWorkTab;
          renderScreen();
          return;
        }

        const jobsTab = event.target.closest("[data-set-jobs-tab]");
        if (jobsTab) {
          state.jobsTab = jobsTab.dataset.setJobsTab;
          renderScreen();
          return;
        }

        const regionFilter = event.target.closest("[data-region-filter]");
        if (regionFilter) {
          state.regionFilter = regionFilter.dataset.regionFilter;
          renderScreen({ preserveScroll: true });
          return;
        }

        const reviewFilter = event.target.closest("[data-review-filter]");
        if (reviewFilter) {
          state.reviewFilter = reviewFilter.dataset.reviewFilter;
          state.reviewListMode = true;
          state.reviewVisibleCount = 5;
          state.lazyListCounts = { ...(state.lazyListCounts || {}), reviews: 4 };
          renderScreen({ preserveScroll: true });
          return;
        }

        const referralFilter = event.target.closest("[data-referral-filter]");
        if (referralFilter) {
          state.referralFilter = referralFilter.dataset.referralFilter || "all";
          state.referralSearch = "";
          state.referralVisibleCount = 6;
          state.previousScreen = state.screen;
          state.screen = "referralList";
          renderScreen();
          return;
        }

        const referralFilterChip = event.target.closest("[data-referral-filter-chip]");
        if (referralFilterChip) {
          state.referralFilter = referralFilterChip.dataset.referralFilterChip || "all";
          state.referralVisibleCount = 6;
          renderScreen({ preserveScroll: true });
          return;
        }

        const packageTab = event.target.closest("[data-package-tab]");
        if (packageTab) {
          state.packageTab = packageTab.dataset.packageTab;
          renderScreen();
          return;
        }

        const growthTab = event.target.closest("[data-growth-tab]");
        if (growthTab) {
          state.growthPackageTab = growthTab.dataset.growthTab || "demand";
          renderScreen({ preserveScroll: true });
          return;
        }

        const growthStart = event.target.closest("[data-growth-start]");
        if (growthStart) {
          state.growthPackageTab = growthStart.dataset.growthStart || state.growthPackageTab || "demand";
          state.growthPackageStep = 1;
          state.previousScreen = state.screen;
          state.screen = state.growthPackageTab === "demand" ? "growthPackageBuilder" : "growthPackageCheckout";
          renderScreen();
          return;
        }

        const growthNext = event.target.closest("[data-growth-next]");
        if (growthNext) {
          if ((state.growthPackageStep || 1) < 3) {
            state.growthPackageStep += 1;
            renderScreen();
          } else {
            state.screen = "growthPackageCheckout";
            renderScreen();
          }
          return;
        }

        const growthComplete = event.target.closest("[data-growth-complete]");
        if (growthComplete) {
          showToast("Paket ödeme adımı hazırlandı");
          return;
        }

        const taskDetail = event.target.closest("[data-task-detail]");
        if (taskDetail) {
          state.selectedTaskKey = taskDetail.dataset.taskDetail || "ready";
          showSheet("task-detail");
          return;
        }

        const open = event.target.closest("[data-open]");
        if (open) {
          showSheet(open.dataset.open);
          return;
        }

        const routeLink = event.target.closest("[data-route]");
        if (routeLink && !routeLink.matches("[data-screen]")) {
          event.preventDefault();
          const route = routeLink.dataset.route;
          const nextScreen = getScreenForRoute(route);
          if (nextScreen === "reviews") {
            state.reviewListMode = false;
            state.reviewVisibleCount = 3;
            state.reviewFilter = "all";
          }
          if (nextScreen === "notifications") {
            state.showReadNotifications = false;
            state.notificationVisibleCount = 7;
          }
          closeSheet();
          navigateTo(route);
          return;
        }

        if (event.target.closest("[data-close]")) {
          closeSheet();
          return;
        }

        const issue = event.target.closest("[data-issue]");
        if (issue) {
          state.selectedIssue = issue.dataset.issue;
          showSheet("issue");
          return;
        }

        const preset = event.target.closest("[data-preset]");
        if (preset) {
          const textarea = document.getElementById("offerText");
          textarea.value = `${textarea.value.trim()} ${preset.dataset.preset}.`.trim();
          showToast("Hazır mesaj eklendi");
          return;
        }

        const date = event.target.closest("[data-date]");
        if (date) {
          state.selectedDate = date.dataset.date;
          showSheet("offer");
          return;
        }

        const action = event.target.closest("[data-action]");
        if (action) {
          const type = action.dataset.action;
          if (type === "toggle-drawer-badges") {
            event.preventDefault();
            state.drawerBadgesExpanded = !state.drawerBadgesExpanded;
            const layer = document.getElementById("sheetLayer");
            const scroll = layer.querySelector(".drawer-scroll");
            const currentScrollTop = scroll ? scroll.scrollTop : 0;
            const badges = layer.querySelector(".drawer-badges");
            if (badges) {
              badges.innerHTML = drawerBadgesMarkup();
              if (scroll) requestAnimationFrame(() => { scroll.scrollTop = currentScrollTop; });
            }
          } else if (type === "toggle-profile-badges") {
            event.preventDefault();
            state.profileBadgesExpanded = !state.profileBadgesExpanded;
            renderScreen({ preserveScroll: true });
          } else if (type === "show-read-notifications") {
            state.showReadNotifications = !state.showReadNotifications;
            state.notificationVisibleCount = 7;
            renderScreen({ preserveScroll: true });
          } else if (type === "issue") {
            showSheet("issue");
          } else if (type === "go-back") {
            goBack();
          } else if (type === "mark-notifications-read") {
            showSheet("notification-read-confirm");
          } else if (type === "mark-notifications-read-confirm") {
            closeSheet();
            state.notificationReadIds = notificationItems().map((item) => item.id);
            state.showReadNotifications = false;
            state.notificationVisibleCount = 7;
            renderScreen({ preserveScroll: true });
            showToast("Tüm bildirimler okundu");
          } else if (type === "notification-settings") {
            closeSheet();
            navigateTo("/notification-settings");
            showToast("Bildirim ayarları açıldı");
          } else if (type === "clear-notifications-request") {
            showSheet("notification-clear-confirm");
          } else if (type === "clear-notifications-confirm") {
            closeSheet();
            state.notificationsCleared = true;
            state.notificationVisibleCount = 0;
            renderScreen();
            showToast("Bildirimler temizlendi");
          } else if (type === "open-notification") {
            const notificationId = action.dataset.notificationId;
            if (notificationId && !state.notificationReadIds.includes(notificationId)) {
              state.notificationReadIds = [...state.notificationReadIds, notificationId];
            }
            navigateTo(getRouteForScreen(action.dataset.notificationScreen || "home"));
          } else if (type === "load-more-list") {
            const listKey = action.dataset.listKey || "default";
            const increments = {
              reviews: 3,
              wallet: 4,
              leaderboard: 3,
            };
            const defaults = {
              reviews: 4,
              wallet: 5,
              leaderboard: 5,
            };
            const current = state.lazyListCounts?.[listKey] || defaults[listKey] || 6;
            state.lazyListCounts = {
              ...(state.lazyListCounts || {}),
              [listKey]: current + (increments[listKey] || 4),
            };
            renderScreen({ preserveScroll: true });
          } else if (type === "performance-detail") {
            state.previousScreen = state.screen;
            state.screen = "performanceScore";
            renderScreen();
          } else if (type === "performance-action") {
            showToast("Aksiyon önerisi kaydedildi. Uygun ekrana bağlanmaya hazır.");
          } else if (type === "submit-issue") {
            closeSheet();
            state.screen = "support";
            renderScreen();
            showToast("Bildirimin alındı · LP-28491");
          } else if (type === "submit-offer") {
            closeSheet();
            state.screen = "jobs";
            state.jobsTab = "offers";
            renderScreen();
            showToast("Teklif gönderildi. Müşteri gördüğünde burada takip edebilirsin.");
          } else if (type === "detail") {
            showSheet("job-detail");
          } else if (type === "call") {
            showToast("Müşteri sistem hattı üzerinden aranıyor");
          } else if (type === "take-pool") {
            closeSheet();
            state.screen = "jobs";
            state.jobsTab = "active";
            renderScreen();
            showToast("Havuz işi alındı. Haftalık hakkından 1 kullanım düşüldü.");
          } else if (type === "share-link") {
            showToast("Paylaşım bağlantısı hazırlandı");
          } else if (type === "route") {
            showToast("Yol tarifi açılıyor");
          } else if (type === "share") {
            showToast("Randevu linki paylaşım için hazır");
          } else if (type === "ledger") {
            showToast("Kredi hareketleri açıldı");
          } else if (type === "menu-placeholder") {
            closeSheet();
            showToast(`${action.dataset.label || "Bu alan"} yakında aktif olacak`);
          } else if (type === "subscribe-plan") {
            const planName = action.dataset.plan || "Seçili paket";
            showToast(`${planName} abonelik ödeme adımı açılıyor`);
          } else if (type === "cancel-subscription") {
            showToast("Abonelik iptal talebi ekranı hazırlandı");
          } else if (type === "dismiss-platform") {
            state.platformInfoVisible = false;
            renderScreen();
          } else if (type === "dismiss-suggestion") {
            state.suggestionVisible = false;
            renderScreen();
          } else if (type === "bonus-convert") {
            closeSheet();
            showToast("Bonus krediye çevirme başvurusu oluşturuldu");
          } else if (type === "use-bonus") {
            showToast("Bonus kullanım seçenekleri açılmaya hazır");
          } else if (type === "copy-link") {
            showToast("Referans linki kopyalandı");
          } else if (type === "copy-referral-code") {
            const referralCode = "DENIZKAN34";
            if (navigator.clipboard) navigator.clipboard.writeText(referralCode).catch(() => {});
            showToast("Davet kodu kopyalandı");
          } else if (type === "send-partner-invite") {
            const phoneForm = action.closest(".referral-phone-form");
            const phoneInput = phoneForm ? phoneForm.querySelector(".referral-phone-input") : null;
            const phoneValue = phoneInput && phoneInput.value ? phoneInput.value : "Girilen numaraya";
            showToast(`${phoneValue} sistem WhatsApp davet mesajı gönderecek`);
          } else if (type === "invite-partner-whatsapp") {
            showToast("Partner davet mesajı WhatsApp paylaşımına hazırlandı");
          } else if (type === "view-referral-earnings") {
            navigateTo("/referral-earnings");
          } else if (type === "view-referral-earning-detail") {
            state.selectedEarningId = action.dataset.earningId || "earn-1";
            showSheet("referral-earning-detail");
          } else if (type === "view-all-referrals") {
            state.referralFilter = "all";
            state.referralSearch = "";
            state.referralVisibleCount = 6;
            navigateTo("/partners");
          } else if (type === "view-referral-partner") {
            state.selectedReferralId = action.dataset.referralPerson || "ahmet-kaya";
            showSheet("referral-partner");
          } else if (type === "referral-info") {
            showToast("Kayıt 100 bonus, ilk iş 500 bonus, yüklemeden %3 bonus.");
          } else if (type === "leaderboard-info") {
            showToast("Sıralama haftalık tamamlanan iş sayısına göre hesaplanır.");
          } else if (type === "leaderboard-filter") {
            showToast("Lider tablosu filtresi seçildi");
          } else if (type === "copy-review-link") {
            const reviewLink = "https://lipyum.com/yorum/ahmet-kaya";
            if (navigator.clipboard) navigator.clipboard.writeText(reviewLink).catch(() => {});
            showToast("Yorum linki kopyalandı");
          } else if (type === "share-review-link") {
            showToast("Yorum linki paylaşım için hazırlandı");
          } else if (type === "show-all-reviews") {
            state.reviewListMode = true;
            state.reviewVisibleCount = 5;
            state.reviewFilter = "all";
            renderScreen();
          } else if (type === "reviews-overview") {
            state.reviewListMode = false;
            state.reviewVisibleCount = 3;
            state.reviewFilter = "all";
            renderScreen();
          } else if (type === "review-info") {
            showToast("Yorumlar profil güvenini, sıralamanı ve müşteri dönüşünü güçlendirir.");
          } else if (type === "review-boost") {
            showToast("Daha fazla 5 yıldızlı yorum için paylaşım linkini müşterilerine gönder.");
          } else if (type === "reply-review") {
            state.selectedReviewName = action.dataset.reviewName || "Müşteri";
            state.selectedReviewText = action.dataset.reviewText || "Müşteri yorumu";
            state.selectedReviewReply = "";
            showSheet("review-reply");
          } else if (type === "edit-review-reply") {
            state.selectedReviewName = action.dataset.reviewName || "Müşteri";
            state.selectedReviewText = action.dataset.reviewText || "Müşteri yorumu";
            state.selectedReviewReply = action.dataset.reviewReply || "";
            showSheet("review-reply");
          } else if (type === "report-review-comment") {
            state.selectedIssue = "Yorum bildirimi";
            showSheet("issue");
          } else if (type === "use-review-reply-template") {
            const replyInput = document.querySelector("[data-review-reply-input]");
            if (replyInput) {
              replyInput.value = action.dataset.template || "";
              replyInput.focus();
            }
          } else if (type === "send-review-reply") {
            closeSheet();
            showToast("Yanıt gönderildi. Aktif yanıtlar profil güvenini artırır.");
          } else if (type === "call-referral-friend") {
            const partner = selectedReferralPartner();
            showToast(`${partner.name} aranıyor · ${partner.phoneFull}`);
          } else if (type === "whatsapp-referral-friend") {
            const partner = selectedReferralPartner();
            showToast(`${partner.name} için WhatsApp mesajı hazırlanıyor`);
          } else if (type === "package-required") {
            showSheet("package");
          } else if (type === "quick-checkout") {
            showSheet("checkout");
          } else if (type === "current-plan") {
            showToast("Ücretsiz hesap aktif. Kalan haklarını ana ekranda takip edebilirsin.");
          } else if (type === "profile-settings") {
            showToast("Profil ayarları hazır");
          } else if (type === "profile-preview") {
            showToast("Müşteri profilini önizleme ekranı hazır");
          } else if (type === "profile-shortcut") {
            if (action.dataset.route) {
              navigateTo(action.dataset.route);
            } else {
              showToast(`${action.dataset.label || "Profil alanı"} açılmaya hazır`);
            }
          } else if (type === "profile-freeze") {
            showToast("Profil dondurma seçeneği güvenli onay adımına bağlanacak");
          } else if (type === "profile-delete") {
            showToast("Profil silme için onay akışı gerekir");
          } else if (type === "change-cover") {
            showToast("Kapak görseli değiştirme alanı hazır");
          } else if (type === "save-work-plan") {
            state.screen = "profile";
            renderScreen();
            showToast("Çalışma Planım kaydedildi");
          } else if (type === "status-update") {
            closeSheet();
            showToast("Durum güncellendi");
          } else if (type === "save-capacity") {
            state.screen = "profile";
            renderScreen();
            showToast("Kapasiten kaydedildi");
          } else if (type === "buy-credit") {
            closeSheet();
            showToast("Kredi yükleme adımı hazır");
          } else if (type === "activate-dispatch") {
            state.dispatchOn = true;
            renderScreen();
            showToast("İş alımı açıldı. Yeni işler bu alanda görünecek.");
          } else if (type === "open-offers") {
            closeSheet();
            state.screen = "work";
            state.workTab = "offers";
            renderScreen();
            showToast("Teklif bekleyen kayıtlar açıldı");
          } else if (type === "close-sheet") {
            closeSheet();
          } else if (type === "upgrade-package") {
            closeSheet();
            showToast("Paket yükseltme başlatıldı");
          } else if (type === "pay-package") {
            closeSheet();
            showToast(`${checkoutPackage().label} ödeme adımına yönlendiriliyorsun`);
          } else if (type === "ticket-topic") {
            state.ticketTopic = action.dataset.topic || "Destek";
            showSheet("ticket");
          } else if (type === "submit-ticket") {
            closeSheet();
            showToast(`${state.ticketTopic} ticketı oluşturuldu`);
          } else if (type === "status") {
            showToast("Yeni görev geldiğinde bu alanda aksiyon kartı olarak görünecek");
          } else {
            showToast("İşlem hazır");
          }
        }
      });

      document.addEventListener("input", (event) => {
        const referralSearch = event.target.closest("[data-referral-search]");
        if (referralSearch) {
          state.referralSearch = referralSearch.value || "";
          applyReferralSearchFilter();
        }
      });

      document.addEventListener("change", (event) => {
        const leaderboardSector = event.target.closest("[data-leaderboard-sector]");
        if (leaderboardSector) {
          state.leaderboardSector = leaderboardSector.value || "";
          state.leaderboardRegion = "";
          renderScreen({ preserveScroll: true });
          return;
        }

        const leaderboardRegion = event.target.closest("[data-leaderboard-region]");
        if (leaderboardRegion) {
          state.leaderboardRegion = leaderboardRegion.value || "";
          state.leaderboardSector = "";
          renderScreen({ preserveScroll: true });
        }
      });

      document.getElementById("sheetLayer").addEventListener("click", (event) => {
        if (event.target.id === "sheetLayer" && event.currentTarget.dataset.sheet !== "menu") closeSheet();
      });

      function disablePageZoom() {
        let lastTouchEnd = 0;

        document.addEventListener("gesturestart", (event) => {
          event.preventDefault();
        }, { passive: false });

        document.addEventListener("gesturechange", (event) => {
          event.preventDefault();
        }, { passive: false });

        document.addEventListener("gestureend", (event) => {
          event.preventDefault();
        }, { passive: false });

        document.addEventListener("touchmove", (event) => {
          if (event.touches && event.touches.length > 1) {
            event.preventDefault();
          }
        }, { passive: false });

        document.addEventListener("touchend", (event) => {
          const now = Date.now();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        }, { passive: false });

        document.addEventListener("wheel", (event) => {
          if (event.ctrlKey) {
            event.preventDefault();
          }
        }, { passive: false });
      }

      disablePageZoom();
      renderShell();
      initPullToRefresh();
      lockBottomNavRubberBand();
