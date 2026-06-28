<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const PAGE_SIZE = 5;

const jobs = [
  {
    id: "482195",
    title: "Klima Servisi",
    location: "Yenişehir / Mersin",
    description: "Klima soğutmuyor, müşteri bugün içinde dönüş bekliyor.",
    ageLabel: "10 dk önce",
    statusLabel: "Müşteriyi Ara ve Randevu Ver",
    statusTone: "urgent",
    initials: "AK",
    customerName: "Ahmet Kaya",
    price: "₺800 - ₺1.200",
    timeWindow: "Bugün 15:00",
    primaryAction: "Ara",
    primaryIcon: "phone",
  },
  {
    id: "482218",
    title: "Bulaşık Makinesi Tamiri",
    location: "Mezitli / Mersin",
    description: "Makine su almıyor, program yarım kalıyor.",
    ageLabel: "25 dk önce",
    statusLabel: "Fiyat Teklifi Ver",
    statusTone: "offer",
    initials: "BD",
    customerName: "Buse Demir",
    price: "₺600 - ₺900",
    timeWindow: "Bugün 17:30",
    primaryAction: "Teklif Ver",
    primaryIcon: "file-text",
  },
  {
    id: "482229",
    title: "Kombi Bakımı",
    location: "Toroslar / Mersin",
    description: "Kombi yıllık bakım için uygun saat bekliyor.",
    ageLabel: "45 dk önce",
    statusLabel: "Havuzdaki İşi Ara",
    statusTone: "pool",
    initials: "YK",
    customerName: "Yasin Koç",
    price: "₺700 - ₺1.000",
    timeWindow: "Yarın 10:30",
    helperLabel: "Henüz usta bulunamadı",
    primaryAction: "Ara",
    primaryIcon: "phone",
  },
  {
    id: "482301",
    title: "Lavabo Sızıntısı",
    location: "Mezitli / Mersin",
    description: "Müşteri teklifinizi inceledi, net dönüş bekliyor.",
    ageLabel: "1 saat önce",
    statusLabel: "Yanıt Bekleniyor",
    statusTone: "offer",
    initials: "SY",
    customerName: "Selin Yılmaz",
    price: "₺600",
    timeWindow: "Bugün 18:00",
    primaryAction: "Mesaja Git",
    primaryIcon: "message",
  },
  {
    id: "482340",
    title: "Petek Temizliği",
    location: "Mezitli / Mersin",
    description: "Randevu planlandı, müşteri hazırlık mesajı bekliyor.",
    ageLabel: "2 saat önce",
    statusLabel: "Randevu Planlandı",
    statusTone: "scheduled",
    initials: "BT",
    customerName: "Buse Tekin",
    price: "₺750",
    timeWindow: "Yarın 10:30",
    primaryAction: "Detay",
    primaryIcon: "calendar",
  },
  {
    id: "482410",
    title: "Derin Dondurucu Tamiri",
    location: "Pozcu / Mersin",
    description: "Soğutma zayıf, hızlı servis talep ediliyor.",
    ageLabel: "3 saat önce",
    statusLabel: "Yeni Fırsat",
    statusTone: "pool",
    initials: "MA",
    customerName: "Murat Arslan",
    price: "₺900 - ₺1.350",
    timeWindow: "Bugün 20:00",
    primaryAction: "Ara",
    primaryIcon: "phone",
  },
  {
    id: "482418",
    title: "Elektrik Arıza",
    location: "Yenişehir / Mersin",
    description: "Prizlerde enerji yok, müşteri aynı gün çözüm istiyor.",
    ageLabel: "4 saat önce",
    statusLabel: "Teklif Hazırla",
    statusTone: "offer",
    initials: "EK",
    customerName: "Ece Karaca",
    price: "₺450 - ₺850",
    timeWindow: "Bugün 19:00",
    primaryAction: "Teklif Ver",
    primaryIcon: "file-text",
  },
  {
    id: "482427",
    title: "Klima Montajı",
    location: "Erdemli / Mersin",
    description: "Yeni klima montajı için müsait ekip aranıyor.",
    ageLabel: "5 saat önce",
    statusLabel: "Müşteriyi Ara",
    statusTone: "urgent",
    initials: "OA",
    customerName: "Onur Aksoy",
    price: "₺1.500 - ₺2.200",
    timeWindow: "Yarın 14:00",
    primaryAction: "Ara",
    primaryIcon: "phone",
  },
  {
    id: "482455",
    title: "Çamaşır Makinesi Tamiri",
    location: "Akdeniz / Mersin",
    description: "Makine sıkma yapmıyor, arıza tespiti isteniyor.",
    ageLabel: "6 saat önce",
    statusLabel: "Yeni Fırsat",
    statusTone: "pool",
    initials: "ND",
    customerName: "Nehir Duran",
    price: "₺650 - ₺950",
    timeWindow: "Yarın 09:30",
    primaryAction: "Ara",
    primaryIcon: "phone",
  },
  {
    id: "482472",
    title: "Su Kaçağı Tespiti",
    location: "Toroslar / Mersin",
    description: "Alt kata sızıntı var, öncelikli kontrol bekleniyor.",
    ageLabel: "Bugün",
    statusLabel: "Acil Kontrol",
    statusTone: "urgent",
    initials: "HA",
    customerName: "Hasan Aydın",
    price: "₺1.200 - ₺1.800",
    timeWindow: "Bugün 21:00",
    primaryAction: "Ara",
    primaryIcon: "phone",
  },
  {
    id: "482489",
    title: "Fırın Tamiri",
    location: "Mezitli / Mersin",
    description: "Rezistans ısınmıyor, parça durumu sorulacak.",
    ageLabel: "Bugün",
    statusLabel: "Teklif Bekliyor",
    statusTone: "offer",
    initials: "GA",
    customerName: "Gül Arı",
    price: "₺500 - ₺900",
    timeWindow: "Yarın 16:00",
    primaryAction: "Teklif Ver",
    primaryIcon: "file-text",
  },
  {
    id: "482501",
    title: "Kurutma Makinesi Bakımı",
    location: "Yenişehir / Mersin",
    description: "Filtre ve ısıtma kontrolü için randevu isteniyor.",
    ageLabel: "Bugün",
    statusLabel: "Randevu Planla",
    statusTone: "scheduled",
    initials: "PK",
    customerName: "Pelin Korkmaz",
    price: "₺650 - ₺1.050",
    timeWindow: "Cuma 11:00",
    primaryAction: "Detay",
    primaryIcon: "calendar",
  },
];

const visibleCount = ref(PAGE_SIZE);
const selectedJob = ref(null);
const loadTrigger = ref(null);
let observer;
let scrollRoot;

const visibleJobs = computed(() => jobs.slice(0, visibleCount.value));
const hasMoreJobs = computed(() => visibleCount.value < jobs.length);

function loadMoreJobs() {
  if (!hasMoreJobs.value) return;
  visibleCount.value = Math.min(visibleCount.value + PAGE_SIZE, jobs.length);
}

function handleScrollLoad() {
  const root = scrollRoot || window;
  const scrollTop = root === window ? window.scrollY : root.scrollTop;
  const viewportHeight = root === window ? window.innerHeight : root.clientHeight;
  const scrollHeight = root === window ? document.documentElement.scrollHeight : root.scrollHeight;
  const scrollBottom = scrollTop + viewportHeight;
  const loadAt = scrollHeight - 240;
  if (scrollBottom >= loadAt) loadMoreJobs();
}

function openDetail(job) {
  selectedJob.value = job;
}

function closeDetail() {
  selectedJob.value = null;
}

function handlePrimary(job) {
  shell.showToast(`${job.title} için ${job.primaryAction.toLocaleLowerCase("tr-TR")} adımı hazır.`);
}

onMounted(() => {
  scrollRoot = document.querySelector(".v-shell__content") || window;
  scrollRoot.addEventListener("scroll", handleScrollLoad, { passive: true });
  if (!("IntersectionObserver" in window) || !loadTrigger.value) return;
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadMoreJobs();
    },
    { root: scrollRoot === window ? null : scrollRoot, rootMargin: "220px 0px" },
  );
  observer.observe(loadTrigger.value);
  handleScrollLoad();
});

onBeforeUnmount(() => {
  if (scrollRoot) scrollRoot.removeEventListener("scroll", handleScrollLoad);
  if (observer) observer.disconnect();
});
</script>

<template>
  <AppPage title="İşler" class="my-jobs-page my-jobs-page--premium" data-testid="my-jobs-page">
    <section class="my-jobs-premium-list" aria-label="İşler listesi" data-testid="my-jobs-list">
      <article
        v-for="job in visibleJobs"
        :key="job.id"
        :class="['my-jobs-premium-card', `is-${job.statusTone}`]"
        :data-testid="`my-jobs-card-${job.id}`"
      >
        <header class="my-jobs-premium-card__top">
          <span class="my-jobs-premium-status">{{ job.statusLabel }}</span>
          <time>{{ job.ageLabel }}</time>
        </header>

        <div class="my-jobs-premium-card__main">
          <span class="my-jobs-premium-avatar" aria-hidden="true">{{ job.initials }}</span>
          <div class="my-jobs-premium-copy">
            <div class="my-jobs-premium-title-row">
              <div>
                <h2>{{ job.title }}</h2>
                <p><AppIcon name="map-pin" :size="13" /> {{ job.location }}</p>
              </div>
              <strong>{{ job.price }}</strong>
            </div>
            <p v-if="job.helperLabel" class="my-jobs-premium-helper">{{ job.helperLabel }}</p>
            <p class="my-jobs-premium-description">{{ job.description }}</p>
          </div>
        </div>

        <div class="my-jobs-premium-facts" aria-label="İş bilgileri">
          <span>
            <AppIcon name="clock" :size="15" />
            <small>Zaman</small>
            <b>{{ job.timeWindow }}</b>
          </span>
          <span>
            <AppIcon name="user" :size="15" />
            <small>Müşteri</small>
            <b>{{ job.customerName }}</b>
          </span>
          <span>
            <AppIcon name="shield" :size="15" />
            <small>Durum</small>
            <b>Uygun</b>
          </span>
        </div>

        <div class="my-jobs-premium-actions">
          <button type="button" class="my-jobs-premium-primary" @click="handlePrimary(job)">
            <AppIcon :name="job.primaryIcon" :size="16" />
            {{ job.primaryAction }}
          </button>
          <button type="button" class="my-jobs-premium-secondary" @click="openDetail(job)">
            Detay
            <AppIcon name="chevron-right" :size="16" />
          </button>
        </div>
      </article>

      <div ref="loadTrigger" class="my-jobs-load-trigger" data-testid="my-jobs-load-trigger" aria-hidden="true"></div>

      <button
        v-if="hasMoreJobs"
        type="button"
        class="my-jobs-load-more"
        data-testid="my-jobs-load-more"
        @click="loadMoreJobs"
      >
        Daha fazla iş yükle
      </button>
      <p v-else class="my-jobs-load-state" data-testid="my-jobs-load-complete">Tüm güncel işler yüklendi.</p>
    </section>

    <AppSheet v-if="selectedJob" :open="Boolean(selectedJob)" title="İş Detayı" :description="selectedJob.title" @close="closeDetail">
      <div class="my-jobs-detail-sheet" data-testid="my-jobs-detail-sheet">
        <section class="my-jobs-detail-head">
          <span class="my-jobs-premium-avatar" aria-hidden="true">{{ selectedJob.initials }}</span>
          <div>
            <strong>{{ selectedJob.customerName }}</strong>
            <p>İş ID: #{{ selectedJob.id }} · {{ selectedJob.location }}</p>
          </div>
        </section>

        <section class="my-jobs-detail-grid">
          <article>
            <AppIcon name="calendar" :size="18" />
            <span>Zaman</span>
            <strong>{{ selectedJob.timeWindow }}</strong>
          </article>
          <article>
            <AppIcon name="wallet" :size="18" />
            <span>Bütçe</span>
            <strong>{{ selectedJob.price }}</strong>
          </article>
        </section>

        <section class="my-jobs-detail-note">
          <strong>Talep özeti</strong>
          <p>{{ selectedJob.description }}</p>
        </section>

        <section class="my-jobs-timeline" aria-label="İş akışı">
          <span class="is-complete"><i></i>Talep alındı</span>
          <span class="is-current"><i></i>Partner aksiyonu bekliyor</span>
          <span><i></i>Randevu veya teklif tamamlanacak</span>
        </section>

        <div class="my-jobs-sheet-actions">
          <button type="button" class="my-jobs-premium-primary" @click="handlePrimary(selectedJob)">
            <AppIcon :name="selectedJob.primaryIcon" :size="16" />
            {{ selectedJob.primaryAction }}
          </button>
          <button type="button" class="my-jobs-premium-secondary" @click="closeDetail">
            Kapat
          </button>
        </div>
      </div>
    </AppSheet>
  </AppPage>
</template>
