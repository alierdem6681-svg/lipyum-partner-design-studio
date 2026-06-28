<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const route = useRoute();
const router = useRouter();
const shell = useAppShellStore();

const tabs = [
  { id: "actions", label: "Aksiyonlar", count: 4 },
  { id: "opportunities", label: "Fırsatlar", count: 8 },
  { id: "offers", label: "Tekliflerim", count: 3 },
  { id: "active", label: "Aktif", count: 2 },
  { id: "history", label: "Geçmiş" },
];

const summaryMetrics = [
  { label: "Aksiyon", value: "4", tone: "primary" },
  { label: "Bugün", value: "2 Randevu", tone: "neutral" },
  { label: "Teklif Bekliyor", value: "3", tone: "neutral" },
];

const actionJobs = [
  {
    id: "482195",
    title: "Klima Servisi",
    category: "Klima Servisi",
    location: "Yenişehir / Mersin",
    description: "Klima soğutmuyor, bugün içinde bakılmasını rica ediyor.",
    ageLabel: "10 dk önce",
    statusLabel: "Müşteriyi Ara ve Randevu Ver",
    statusTone: "danger",
    initials: "AK",
    customerName: "Ahmet Kaya",
    price: "₺800 - ₺1.200",
    primaryAction: "Ara",
    secondaryAction: "Detay",
    primaryIcon: "phone",
  },
  {
    id: "482218",
    title: "Bulaşık Makinesi Tamiri",
    category: "Beyaz Eşya",
    location: "Mezitli / Mersin",
    description: "Makine su almıyor, program yarım kaldı.",
    ageLabel: "25 dk önce",
    statusLabel: "Fiyat Teklifi Ver",
    statusTone: "warning",
    initials: "BD",
    customerName: "Buse Demir",
    price: "₺600 - ₺900",
    primaryAction: "Teklif Ver",
    secondaryAction: "Detay",
    primaryIcon: "phone",
  },
  {
    id: "482229",
    title: "Kombi Bakımı",
    category: "Kombi",
    location: "Toroslar / Mersin",
    description: "Kombi yıllık bakım ihtiyacı var.",
    ageLabel: "45 dk önce",
    statusLabel: "Havuzdaki İşi Ara",
    statusTone: "info",
    initials: "YK",
    customerName: "Yasin Koç",
    price: "₺700 - ₺1.000",
    helperLabel: "Henüz usta bulunamadı",
    primaryAction: "Ara",
    secondaryAction: "Detay",
    primaryIcon: "phone",
  },
];

const opportunities = [
  {
    id: "482331",
    title: "Klima Servisi",
    category: "Klima",
    icon: "snowflake",
    iconTone: "blue",
    location: "Yenişehir / Mersin",
    distance: "2.1 km",
    price: "₺800 - ₺1.200",
    responseTime: "60 dk",
    matchScore: 92,
  },
  {
    id: "482337",
    title: "Bulaşık Makinesi Tamiri",
    category: "Beyaz Eşya",
    icon: "washing-machine",
    iconTone: "blue",
    location: "Mezitli / Mersin",
    distance: "3.4 km",
    price: "₺600 - ₺900",
    responseTime: "90 dk",
    matchScore: 88,
  },
  {
    id: "482344",
    title: "Kombi Bakımı",
    category: "Kombi",
    icon: "zap",
    iconTone: "orange",
    location: "Toroslar / Mersin",
    distance: "4.8 km",
    price: "₺700 - ₺1.000",
    responseTime: "120 dk",
    matchScore: 85,
  },
];

const offers = [
  {
    id: "482301",
    title: "Lavabo Sızıntısı",
    category: "Tesisat",
    location: "Mezitli / Mersin",
    description: "Müşteri teklifinizi inceledi. Yanıt bekleniyor.",
    ageLabel: "1 gün önce",
    statusLabel: "Yanıt Bekleniyor",
    statusTone: "warning",
    initials: "SY",
    customerName: "Selin Yılmaz",
    price: "₺600",
    primaryAction: "Mesaja Git",
    secondaryAction: "Teklifi Güncelle",
    primaryIcon: "message",
  },
  {
    id: "482302",
    title: "Priz Montajı",
    category: "Elektrik",
    location: "Yenişehir / Mersin",
    description: "Müşteri malzeme dahil olup olmadığını sordu.",
    ageLabel: "2 gün önce",
    statusLabel: "Müşteri Soru Sordu",
    statusTone: "info",
    initials: "MK",
    customerName: "Mert Kaan",
    price: "₺450",
    primaryAction: "Mesaja Git",
    secondaryAction: "Detay",
    primaryIcon: "message",
  },
];

const activeJobs = [
  {
    id: "482195",
    title: "Klima Servisi",
    customerName: "Ahmet Kaya",
    initials: "AK",
    rating: "4.9",
    location: "Yenişehir Mah. 33124 Sk. No:15 / Mersin",
    appointmentLabel: "Bugün 15:00",
    statusLabel: "Devam Ediyor",
    statusTone: "success",
    earningsEstimate: "₺900",
    creditReward: "+45",
    nextAction: "Randevu saatinde müşteriye ulaşın ve işe başlayın.",
  },
  {
    id: "482340",
    title: "Petek Temizliği",
    customerName: "Buse Tekin",
    initials: "BT",
    rating: "4.7",
    location: "Mezitli / Mersin",
    appointmentLabel: "Yarın 10:30",
    statusLabel: "Randevu Planlandı",
    statusTone: "info",
    earningsEstimate: "₺750",
    creditReward: "+35",
    nextAction: "Randevu öncesi müşteriye hazırlık mesajı gönderin.",
  },
];

const historyJobs = [
  {
    id: "481902",
    title: "Kombi Bakımı",
    category: "Kombi",
    location: "Toroslar / Mersin",
    description: "İş başarıyla tamamlandı. Müşteri değerlendirmesi bekleniyor.",
    ageLabel: "Dün",
    statusLabel: "Tamamlandı",
    statusTone: "success",
    initials: "EA",
    customerName: "Emre Arslan",
    price: "₺850",
    primaryAction: "Detay",
    secondaryAction: "Benzer İş Bul",
    primaryIcon: "check",
  },
];

const filters = [
  { id: "near", label: "Yakın", icon: "map-pin" },
  { id: "urgent", label: "Acil", icon: "alert" },
  { id: "match", label: "Yüksek Uyum", icon: "sparkles" },
  { id: "today", label: "Bugün", icon: "calendar" },
];

const validTabs = new Set(tabs.map((tab) => tab.id));
const activeTab = ref(validTabs.has(route.query.tab) ? route.query.tab : "actions");
const activeOpportunityFilter = ref("match");
const searchQuery = ref("");
const selectedJob = ref(null);
const detailMode = ref("job");

const filteredActionJobs = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase("tr-TR");
  if (!query) return actionJobs;
  return actionJobs.filter((job) => [job.title, job.category, job.location, job.customerName].join(" ").toLocaleLowerCase("tr-TR").includes(query));
});

const activeSheetTitle = computed(() => {
  if (!selectedJob.value) return "";
  if (detailMode.value === "active") return "Aktif İş Detayı";
  if (detailMode.value === "opportunity") return "Fırsat Detayı";
  return "İş Detayı";
});

watch(
  () => route.query.tab,
  (tab) => {
    if (validTabs.has(tab) && tab !== activeTab.value) activeTab.value = tab;
  },
);

watch(activeTab, (tab) => {
  const nextQuery = { ...route.query, tab };
  if (route.query.tab !== tab) router.replace({ query: nextQuery });
});

function setTab(tabId) {
  activeTab.value = tabId;
}

function openDetail(job, mode = "job") {
  selectedJob.value = job;
  detailMode.value = mode;
}

function closeDetail() {
  selectedJob.value = null;
}

function handlePrimary(job) {
  const messageMap = {
    Ara: `${job.title} müşterisi için arama hazırlandı.`,
    "Teklif Ver": `${job.title} için teklif akışı açıldı.`,
    "Mesaja Git": `${job.title} mesajları açıldı.`,
    Detay: `${job.title} detayı açıldı.`,
  };
  shell.showToast(messageMap[job.primaryAction] || `${job.title} işlemi hazır.`);
}

function handleActiveAction(label) {
  shell.showToast(`${label} adımı kaydedildi.`);
}
</script>

<template>
  <AppPage title="İşler" class="my-jobs-page" data-testid="my-jobs-page">
    <nav class="my-jobs-tabs" role="tablist" aria-label="İşler sekmeleri">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="['my-jobs-tab', { 'is-active': activeTab === tab.id }]"
        :aria-selected="activeTab === tab.id"
        role="tab"
        :data-testid="`my-jobs-tab-${tab.id}`"
        @click="setTab(tab.id)"
      >
        <span>{{ tab.label }}</span>
        <b v-if="tab.count" aria-hidden="true">{{ tab.count }}</b>
      </button>
    </nav>

    <section v-if="activeTab === 'actions'" class="my-jobs-stack" data-testid="my-jobs-actions">
      <div class="my-jobs-metrics" aria-label="İş özeti">
        <article v-for="metric in summaryMetrics" :key="metric.label" :class="['my-jobs-metric', `is-${metric.tone}`]">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </article>
      </div>

      <div class="my-jobs-search-row">
        <label class="my-jobs-search" data-testid="my-jobs-search">
          <AppIcon name="search" :size="18" />
          <input v-model="searchQuery" type="search" placeholder="Ara, müşteri veya hizmet..." aria-label="İşlerde ara" />
        </label>
        <button type="button" class="my-jobs-icon-btn" aria-label="Filtreleri aç" @click="shell.showToast('Filtreler hazır.')">
          <AppIcon name="sliders" :size="19" />
        </button>
      </div>

      <article v-for="job in filteredActionJobs" :key="job.id" :class="['my-jobs-card', `is-${job.statusTone}`]" :data-testid="`my-jobs-card-${job.id}`">
        <header class="my-jobs-card__status">
          <strong>{{ job.statusLabel }}</strong>
          <span>{{ job.ageLabel }}</span>
        </header>
        <div class="my-jobs-card__body">
          <span class="my-jobs-avatar" aria-hidden="true">{{ job.initials }}</span>
          <div class="my-jobs-card__content">
            <h2>{{ job.title }}</h2>
            <p class="my-jobs-meta"><AppIcon name="map-pin" :size="13" /> {{ job.location }}</p>
            <p v-if="job.helperLabel" class="my-jobs-helper">{{ job.helperLabel }}</p>
            <p>{{ job.description }}</p>
          </div>
          <strong class="my-jobs-price">{{ job.price }}</strong>
        </div>
        <div class="my-jobs-actions">
          <button type="button" class="my-jobs-primary" @click="handlePrimary(job)">
            <AppIcon :name="job.primaryIcon" :size="16" />
            {{ job.primaryAction }}
          </button>
          <button type="button" class="my-jobs-secondary" @click="openDetail(job)">
            Detay
            <AppIcon name="chevron-right" :size="16" />
          </button>
        </div>
      </article>
    </section>

    <section v-else-if="activeTab === 'opportunities'" class="my-jobs-stack" data-testid="my-jobs-opportunities">
      <div class="my-jobs-smart-banner">
        <span><AppIcon name="sparkles" :size="24" /></span>
        <div>
          <strong>Size en uygun 8 iş bulundu</strong>
          <p>Konumunuz ve uzmanlık alanınıza göre eşleştirildi.</p>
        </div>
        <button type="button" aria-label="Eşleşme bilgisini kapat" @click="shell.showToast('Eşleşme bilgisi kapatıldı.')">
          <AppIcon name="x" :size="17" />
        </button>
      </div>

      <div class="my-jobs-chip-row" aria-label="Fırsat filtreleri">
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          :class="['my-jobs-chip', { 'is-active': activeOpportunityFilter === filter.id }]"
          :aria-pressed="activeOpportunityFilter === filter.id"
          @click="activeOpportunityFilter = filter.id"
        >
          <AppIcon :name="filter.icon" :size="15" />
          {{ filter.label }}
        </button>
      </div>

      <article v-for="job in opportunities" :key="job.id" class="my-jobs-opportunity-card" :data-testid="`opportunity-card-${job.id}`">
        <span :class="['my-jobs-category-icon', `is-${job.iconTone}`]" aria-hidden="true">
          <AppIcon :name="job.icon" :size="25" />
        </span>
        <div class="my-jobs-opportunity-card__content">
          <header>
            <h2>{{ job.title }}</h2>
            <button type="button" aria-label="Fırsatı kaydet" @click="shell.showToast('Fırsat kaydedildi.')">
              <AppIcon name="star" :size="20" />
            </button>
          </header>
          <p class="my-jobs-meta"><AppIcon name="map-pin" :size="13" /> {{ job.location }} <span>~ {{ job.distance }}</span></p>
          <strong>{{ job.price }}</strong>
          <footer>
            <span>Yanıt süresi: {{ job.responseTime }}</span>
            <span>Yüksek Uyum %{{ job.matchScore }}</span>
            <button type="button" @click="openDetail(job, 'opportunity')">İncele</button>
          </footer>
        </div>
      </article>
    </section>

    <section v-else-if="activeTab === 'offers'" class="my-jobs-stack" data-testid="my-jobs-offers">
      <article v-for="job in offers" :key="job.id" :class="['my-jobs-card', `is-${job.statusTone}`]">
        <header class="my-jobs-card__status">
          <strong>{{ job.statusLabel }}</strong>
          <span>{{ job.ageLabel }}</span>
        </header>
        <div class="my-jobs-card__body">
          <span class="my-jobs-avatar" aria-hidden="true">{{ job.initials }}</span>
          <div class="my-jobs-card__content">
            <h2>{{ job.title }}</h2>
            <p class="my-jobs-meta"><AppIcon name="map-pin" :size="13" /> {{ job.location }}</p>
            <p>{{ job.description }}</p>
          </div>
          <strong class="my-jobs-price">{{ job.price }}</strong>
        </div>
        <div class="my-jobs-actions">
          <button type="button" class="my-jobs-primary" @click="handlePrimary(job)">
            <AppIcon :name="job.primaryIcon" :size="16" />
            {{ job.primaryAction }}
          </button>
          <button type="button" class="my-jobs-secondary" @click="openDetail(job)">
            {{ job.secondaryAction }}
            <AppIcon name="chevron-right" :size="16" />
          </button>
        </div>
      </article>
    </section>

    <section v-else-if="activeTab === 'active'" class="my-jobs-stack" data-testid="my-jobs-active">
      <article v-for="job in activeJobs" :key="job.id" class="my-jobs-active-card">
        <header>
          <span class="my-jobs-badge is-success">{{ job.statusLabel }}</span>
          <small>İş ID: #{{ job.id }}</small>
        </header>
        <div class="my-jobs-active-card__title">
          <div>
            <h2>{{ job.title }}</h2>
            <p>{{ job.customerName }} · ★ {{ job.rating }}</p>
          </div>
          <span class="my-jobs-avatar" aria-hidden="true">{{ job.initials }}</span>
        </div>
        <div class="my-jobs-active-info">
          <span><AppIcon name="calendar" :size="18" /> {{ job.appointmentLabel }}</span>
          <span><AppIcon name="map-pin" :size="18" /> {{ job.location }}</span>
        </div>
        <div class="my-jobs-active-summary">
          <span><small>Kazancın</small><strong>{{ job.earningsEstimate }}</strong></span>
          <span><small>Lipyum Kredin</small><strong>{{ job.creditReward }}</strong></span>
        </div>
        <button type="button" class="my-jobs-secondary is-full" @click="openDetail(job, 'active')">
          Aktif işi aç
          <AppIcon name="chevron-right" :size="16" />
        </button>
      </article>
    </section>

    <section v-else class="my-jobs-stack" data-testid="my-jobs-history">
      <article v-for="job in historyJobs" :key="job.id" :class="['my-jobs-card', `is-${job.statusTone}`]">
        <header class="my-jobs-card__status">
          <strong>{{ job.statusLabel }}</strong>
          <span>{{ job.ageLabel }}</span>
        </header>
        <div class="my-jobs-card__body">
          <span class="my-jobs-avatar" aria-hidden="true">{{ job.initials }}</span>
          <div class="my-jobs-card__content">
            <h2>{{ job.title }}</h2>
            <p class="my-jobs-meta"><AppIcon name="map-pin" :size="13" /> {{ job.location }}</p>
            <p>{{ job.description }}</p>
          </div>
          <strong class="my-jobs-price">{{ job.price }}</strong>
        </div>
        <div class="my-jobs-actions">
          <button type="button" class="my-jobs-primary" @click="openDetail(job)">
            <AppIcon name="check" :size="16" />
            Detay
          </button>
          <button type="button" class="my-jobs-secondary" @click="setTab('opportunities')">
            Benzer İş Bul
            <AppIcon name="chevron-right" :size="16" />
          </button>
        </div>
      </article>
    </section>

    <AppSheet v-if="selectedJob" :open="Boolean(selectedJob)" :title="activeSheetTitle" :description="selectedJob.title" @close="closeDetail">
      <div class="my-jobs-detail-sheet" data-testid="my-jobs-detail-sheet">
        <section class="my-jobs-detail-head">
          <span class="my-jobs-avatar" aria-hidden="true">{{ selectedJob.initials || 'AK' }}</span>
          <div>
            <strong>{{ selectedJob.customerName || 'Ahmet Kaya' }}</strong>
            <p>İş ID: #{{ selectedJob.id }} · {{ selectedJob.location }}</p>
          </div>
          <span v-if="selectedJob.rating" class="my-jobs-rating">★ {{ selectedJob.rating }}</span>
        </section>

        <section class="my-jobs-detail-grid">
          <article>
            <AppIcon name="calendar" :size="18" />
            <span>Zaman</span>
            <strong>{{ selectedJob.appointmentLabel || 'Bugün 14:00 - 18:00' }}</strong>
          </article>
          <article>
            <AppIcon name="wallet" :size="18" />
            <span>Bütçe</span>
            <strong>{{ selectedJob.price || selectedJob.earningsEstimate || '₺800 - ₺1.200' }}</strong>
          </article>
        </section>

        <section class="my-jobs-detail-note">
          <strong>Talep özeti</strong>
          <p>{{ selectedJob.description || selectedJob.nextAction || 'Müşteri iş için uygun randevu ve hızlı dönüş bekliyor.' }}</p>
        </section>

        <section class="my-jobs-timeline" aria-label="İş akışı">
          <span class="is-complete"><i></i>Talep alındı</span>
          <span class="is-complete"><i></i>İletişim kuruldu</span>
          <span class="is-current"><i></i>Randevu bekliyor</span>
        </section>

        <div class="my-jobs-sheet-actions">
          <button type="button" class="my-jobs-primary" @click="handleActiveAction('Ara')">
            <AppIcon name="phone" :size="16" />
            Ara
          </button>
          <button type="button" class="my-jobs-secondary" @click="handleActiveAction('Mesaj Yaz')">
            <AppIcon name="message" :size="16" />
            Mesaj Yaz
          </button>
        </div>
      </div>
    </AppSheet>
  </AppPage>
</template>
