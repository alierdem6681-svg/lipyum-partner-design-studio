<script setup>
import { useRouter } from "vue-router";
import AppBadge from "../components/ui/AppBadge.vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();

const currentScore = 81;
const targetScore = 85;

const criteria = [
  {
    id: "profile",
    title: "Profil eksiksizliği",
    status: "Geliştirilebilir",
    tone: "warning",
    icon: "user",
    current: "Fotoğraf, hizmet kategorileri ve bölgeler aktif",
    target: "Açıklama ve saat bilgisi tamamen güncel",
    points: "12 / 15 puan",
    description: "Eksiksiz profil, müşterinin seni daha hızlı tanımasını ve güven duymasını destekler.",
    checklist: ["Profil fotoğrafı", "Hizmet kategorileri", "Çalışma bölgeleri", "Çalışma saatleri", "Firma/partner açıklaması"],
    action: { label: "Profili Tamamla", route: "/profile" },
  },
  {
    id: "reviews",
    title: "Müşteri yorumları",
    status: "Geliştirilebilir",
    tone: "warning",
    icon: "star",
    current: "126 yorum, ortalama 4.8 puan",
    target: "Son işlerden düzenli yorum alma",
    points: "11 / 15 puan",
    description: "Daha fazla olumlu yorum, müşterilerin sana güvenmesini ve sistemde daha güçlü görünmeni sağlar.",
    checklist: ["Yorum sayısı", "Ortalama puan", "Son işlerden yorum alma oranı"],
    action: { label: "Müşterilerden yorum iste", route: "/reviews" },
  },
  {
    id: "complaints",
    title: "Müşteri şikayetleri",
    status: "Tamamlandı",
    tone: "success",
    icon: "shield",
    current: "Açık şikayet yok, son 30 gün 0 kayıt",
    target: "Açık şikayet 0 ve yüksek çözüm oranı",
    points: "15 / 15 puan",
    description: "Şikayet yönetimi güçlü olduğunda sistem seni daha güvenilir partner olarak değerlendirir.",
    checklist: ["Açık şikayet sayısı", "Son 30 gün şikayet sayısı", "Çözülmüş şikayet oranı"],
  },
  {
    id: "response",
    title: "Müşteriye hızlı dönüş",
    status: "Geliştirilebilir",
    tone: "warning",
    icon: "clock",
    current: "Ortalama dönüş süren: 18 dakika",
    target: "5 dakika altı",
    points: "8 / 15 puan",
    description: "Hızlı dönüş yapan partnerler, müşteri kaybını azaltır ve daha güçlü performans gösterir.",
    checklist: ["Ortalama dönüş süresi", "Bildirimlerin açık olması", "Yeni taleplere hızlı cevap"],
    action: { label: "Bildirimleri Aç", route: "/notification-settings" },
  },
  {
    id: "cancel",
    title: "İptal oranı",
    status: "Geliştirilebilir",
    tone: "warning",
    icon: "target",
    current: "Son 30 gün iptal oranı: %12",
    target: "%10 altı",
    points: "10 / 15 puan",
    description: "Düşük iptal oranı, sistemin seni daha güvenilir partner olarak değerlendirmesine yardımcı olur.",
    checklist: ["Partner kaynaklı iptal: %7", "Müşteri kaynaklı iptal: %5", "Toplam iptal oranı"],
    action: { label: "Daha Hızlı Dönüş Yap", route: "/notifications" },
  },
  {
    id: "activity",
    title: "Uygulamayı aktif kullanım",
    status: "Tamamlandı",
    tone: "success",
    icon: "zap",
    current: "Son giriş bugün, son 7 günde 6 aktif gün",
    target: "Her gün fırsatları kontrol etmek",
    points: "9 / 10 puan",
    description: "Aktif partnerler, yeni iş fırsatlarını kaçırmadan değerlendirebilir.",
    checklist: ["Son giriş tarihi", "Son 7 gün aktif gün sayısı", "Gelen işleri/fırsatları görüntüleme"],
    action: { label: "Uygulamayı düzenli kontrol et", route: "/home" },
  },
  {
    id: "wallet",
    title: "Bakiye durumu",
    status: "Tamamlandı",
    tone: "success",
    icon: "wallet",
    current: "Mevcut bakiye: 675 kredi",
    target: "Önerilen minimum bakiye: 300 kredi",
    points: "10 / 10 puan",
    description: "Bakiyenin bitmesi, sana uygun işleri kaçırmana neden olabilir. İş fırsatlarında kesinti yaşamamak için bakiyeni bitmeden yenile.",
    checklist: ["Mevcut bakiye", "İş alabilecek minimum önerilen bakiye", "Kesintisiz iş fırsatı takibi"],
    action: { label: "Bakiye Yükle", route: "/wallet" },
  },
  {
    id: "subscription",
    title: "Abonelik durumu",
    status: "Geliştirilebilir",
    tone: "info",
    icon: "crown",
    current: "Gold Partner görünürlüğü aktif",
    target: "Ücretli abonelik seviye avantajlarını incele",
    points: "4 / 5 puan",
    description: "Ücretli abonelikler, daha fazla görünürlük ve ek avantajlarla performans skorunu destekler.",
    checklist: ["Ücretsiz kullanım: 0 puan", "1. seviye: +2 puan", "2. seviye: +3 puan", "3. seviye: +5 puan"],
    action: { label: "Aboneliği İncele", route: "/subscription" },
  },
];

const benefits = [
  "Sana uygun işlerde daha güçlü görünürsün.",
  "Aynı bölgede benzer partnerlere göre daha avantajlı değerlendirilirsin.",
  "Müşteri güvenini artıran rozetler kazanabilirsin.",
  "Kampanya ve fırsatlardan daha avantajlı yararlanabilirsin.",
  "Daha düzenli iş alma ihtimalin artar.",
];

function goTo(route) {
  router.push(route);
}
</script>

<template>
  <AppPage title="Performansımı Artır" class="performance-improve-page" data-testid="performance-improve-page">
    <div class="performance-improve-stack">
      <AppCard class="performance-improve-hero" variant="hero">
        <div class="performance-improve-hero__top">
          <span class="performance-score-ring performance-score-ring--large" aria-label="Mevcut skor 81">
            <span><strong>{{ currentScore }}</strong></span>
          </span>
          <span class="performance-improve-hero__copy">
            <AppBadge tone="success">İyi</AppBadge>
            <h2>{{ currentScore }} / 100</h2>
            <p>85 puana ulaştığında sana uygun işlerde daha güçlü görünürsün.</p>
          </span>
        </div>

        <div class="performance-improve-progress" aria-label="Performans skoru 81, hedef 85">
          <span class="performance-improve-progress__bar">
            <i aria-hidden="true"></i>
          </span>
          <span class="performance-improve-progress__labels">
            <small>Mevcut skor: {{ currentScore }}</small>
            <small>Hedef: {{ targetScore }}</small>
          </span>
        </div>

        <p class="performance-improve-note">
          Skorun; profil kaliten, müşteri deneyimi, aktiflik, bakiye ve abonelik durumuna göre hesaplanır.
        </p>
      </AppCard>

      <section class="performance-criteria-section" aria-label="Performans kriterleri">
        <div class="section-title compact">
          <h2>Performans kriterleri</h2>
          <span>100 puan</span>
        </div>

        <AppCard
          v-for="criterion in criteria"
          :key="criterion.id"
          as="article"
          class="performance-criterion-card"
          padding="md"
          :data-testid="`performance-criterion-${criterion.id}`"
        >
          <div class="performance-criterion-card__head">
            <span class="performance-criterion-icon">
              <AppIcon :name="criterion.icon" :size="19" />
            </span>
            <span class="performance-criterion-title">
              <strong>{{ criterion.title }}</strong>
              <small>Skora katkı: {{ criterion.points }}</small>
            </span>
            <AppBadge :tone="criterion.tone">{{ criterion.status }}</AppBadge>
          </div>

          <div class="performance-criterion-values">
            <span>
              <small>Mevcut</small>
              <strong>{{ criterion.current }}</strong>
            </span>
            <span>
              <small>Hedef</small>
              <strong>{{ criterion.target }}</strong>
            </span>
          </div>

          <p>{{ criterion.description }}</p>

          <div class="performance-criterion-checks" aria-label="Kriter detayları">
            <span v-for="item in criterion.checklist" :key="item">
              <AppIcon name="check" :size="13" />
              {{ item }}
            </span>
          </div>

          <AppButton
            v-if="criterion.action"
            size="sm"
            variant="secondary"
            icon="trend-up"
            :data-testid="`performance-action-${criterion.id}`"
            @click="goTo(criterion.action.route)"
          >
            {{ criterion.action.label }}
          </AppButton>
        </AppCard>
      </section>

      <AppCard class="performance-benefit-card" data-testid="performance-benefits">
        <div class="section-title compact">
          <h2>Yüksek skor sana ne kazandırır?</h2>
        </div>
        <ul>
          <li v-for="benefit in benefits" :key="benefit">
            <AppIcon name="check" :size="15" />
            <span>{{ benefit }}</span>
          </li>
        </ul>
        <p>
          Yüksek performans skoru, uygun işlerde öncelikli değerlendirilmeni destekler. İş sayısı bölge,
          sektör ve talebe göre değişebilir.
        </p>
      </AppCard>
    </div>
  </AppPage>
</template>
