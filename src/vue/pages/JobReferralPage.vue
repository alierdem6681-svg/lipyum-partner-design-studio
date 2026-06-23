<script setup>
import { computed, ref, watch } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const activePeriod = ref("last30");
const withdrawOpen = ref(false);
const withdrawAmount = ref("");
const jobSheetOpen = ref(false);
const flowStep = ref("customer");
const customerFirstName = ref("");
const customerLastName = ref("");
const customerPhone = ref("");
const sectorSearch = ref("");
const citySearch = ref("");
const selectedSector = ref("");
const selectedCity = ref("");
const selectedDistrict = ref("");
const jobNote = ref("");

const moneyFormat = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });

const periods = [
  { value: "today", label: "Bugün", dot: false },
  { value: "last7", label: "Son 7", dot: false },
  { value: "last30", label: "Son 30", dot: false },
  { value: "last90", label: "Son 90", dot: false },
];

const audienceItems = [
  { title: "Elinde işi olanlar", body: "Kendi ekibi yetişemeyen işler için ek kazanç kapısı.", icon: "briefcase" },
  { title: "Site yöneticileri", body: "Apartman ve site taleplerini hızlıca kazanca çevirir.", icon: "home" },
  { title: "Dijital pazarlamacılar", body: "Topladığı servis taleplerinden nakit gelir üretir.", icon: "trend-up" },
  { title: "Ek iş yapmak isteyenler", body: "Sahaya çıkmadan iş gönderip kazanç takip eder.", icon: "wallet" },
  { title: "Asist firmaları", body: "Çağrı ve talep havuzunu düzenli gelir kanalına taşır.", icon: "headphones" },
];

const stats = [
  { label: "Satılan iş", value: "34", tone: "green", icon: "briefcase" },
  { label: "Tamamlanan", value: "21", tone: "blue", icon: "check" },
  { label: "Bekleyen", value: "6", tone: "gold", icon: "clock" },
  { label: "Çekilen", value: "₺7.400", tone: "gray", icon: "wallet" },
];

const earningRows = [
  { label: "Kombi bakım talebi", date: "Bugün 14:20", amount: "₺850", status: "Kesinleşti" },
  { label: "Klima montaj talebi", date: "Dün 18:05", amount: "₺1.250", status: "Beklemede" },
  { label: "Buzdolabı arıza talebi", date: "21 Haziran 11:30", amount: "₺620", status: "Ödendi" },
];

const potentialCards = [
  { label: "5 iş satışı", value: "₺3.500", body: "Ayda küçük ama düzenli ek gelir." },
  { label: "15 iş satışı", value: "₺11.200", body: "Talep akışı olan ekipler için güçlü seviye." },
  { label: "30+ iş satışı", value: "₺28.450", body: "Çağrı ve pazarlama ekipleri için yüksek potansiyel." },
];

const quickWithdrawAmounts = [2500, 5000, 9650];

const sectors = [
  "Kombi Tamiri",
  "Bulaşık Makinesi Tamiri",
  "Buzdolabı Tamiri",
  "Çamaşır Makinesi Tamiri",
  "Fırın Tamiri",
  "Kurutma Makinesi Tamiri",
  "Klima Tamiri",
  "Klima Montajı",
  "Petek Temizleme",
  "Televizyon Tamiri",
  "Derin Dondurucu Tamiri",
  "Klima Bakımı",
  "Çilingir",
  "Su Tesisatçısı",
  "Elektrikçi",
  "İlaçlama",
  "Oto Elektrikçi",
];

const cities = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Iğdır",
  "Isparta",
  "İstanbul",
  "İzmir",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kilis",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Şanlıurfa",
  "Şırnak",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak",
];

const filteredSectors = computed(() =>
  sectors.filter((item) => item.toLocaleLowerCase("tr-TR").includes(sectorSearch.value.toLocaleLowerCase("tr-TR"))),
);

const filteredCities = computed(() =>
  cities.filter((item) => item.toLocaleLowerCase("tr-TR").includes(citySearch.value.toLocaleLowerCase("tr-TR"))),
);

const canContinueCustomer = computed(() => customerFirstName.value.trim() && customerLastName.value.trim() && customerPhone.value.trim());
const canContinueLocation = computed(() => selectedCity.value && selectedDistrict.value.trim());
const canWithdraw = computed(() => {
  const amount = Number(withdrawAmount.value);
  return Number.isFinite(amount) && Number.isInteger(amount) && amount >= 1 && amount <= 9650;
});

watch(citySearch, (value) => {
  if (selectedCity.value && value !== selectedCity.value) {
    selectedCity.value = "";
  }
});

const flowTitle = computed(() => {
  if (flowStep.value === "customer") return "Müşteri bilgileri";
  if (flowStep.value === "sector") return "Sektör seç";
  if (flowStep.value === "location") return "Bölge bilgisi";
  return "Kontrol et ve gönder";
});

const flowDescription = computed(() => {
  if (flowStep.value === "customer") return "İş talebini kime ait olduğunu gir.";
  if (flowStep.value === "sector") return "Hangi hizmet için talep geldi?";
  if (flowStep.value === "location") return "Şehir ve ilçe bilgisi yeterli.";
  return "Bilgiler doğruysa iş satışını oluştur.";
});

const progressClass = computed(() => `is-progress-${["customer", "sector", "location", "summary"].indexOf(flowStep.value) + 1}`);

function resetFlow() {
  flowStep.value = "customer";
  customerFirstName.value = "";
  customerLastName.value = "";
  customerPhone.value = "";
  sectorSearch.value = "";
  citySearch.value = "";
  selectedSector.value = "";
  selectedCity.value = "";
  selectedDistrict.value = "";
  jobNote.value = "";
}

function openJobSheet() {
  resetFlow();
  jobSheetOpen.value = true;
}

function closeJobSheet() {
  jobSheetOpen.value = false;
  resetFlow();
}

function goBack() {
  const steps = ["customer", "sector", "location", "summary"];
  const currentIndex = steps.indexOf(flowStep.value);
  if (currentIndex <= 0) {
    closeJobSheet();
    return;
  }
  flowStep.value = steps[currentIndex - 1];
}

function chooseSector(sector) {
  selectedSector.value = sector;
  flowStep.value = "location";
}

function chooseCity(city) {
  selectedCity.value = city;
  citySearch.value = city;
}

function submitReferral() {
  shell.showToast("İş satışı kaydı hazırlandı.");
  closeJobSheet();
}

function openWithdrawSheet() {
  withdrawAmount.value = "9650";
  withdrawOpen.value = true;
}

function closeWithdrawSheet() {
  withdrawOpen.value = false;
  withdrawAmount.value = "";
}

function submitWithdraw() {
  if (!canWithdraw.value) return;
  shell.showToast(`₺${moneyFormat.format(Number(withdrawAmount.value))} çekim talebi alındı.`);
  closeWithdrawSheet();
}
</script>

<template>
  <AppPage title="İş Yönlendirme Programı" data-testid="job-referral-page">
    <section class="job-referral-dashboard">
      <AppCard padding="none" class="job-referral-earnings-card" data-testid="job-referral-earnings-card">
        <div class="job-referral-earnings-card__head">
          <span>
            <small>Kazanç Özeti</small>
            <strong>İş gönder, kazancı sen al</strong>
          </span>
          <span class="job-referral-earnings-card__icon" aria-hidden="true">
            <AppIcon name="wallet" :size="24" />
          </span>
        </div>

        <div class="job-referral-earnings-main">
          <small>Bu ay toplam kazanç</small>
          <strong>₺28.450</strong>
          <span>34 iş satışından oluşan kazanç potansiyeli</span>
        </div>

        <div class="job-referral-money-grid" aria-label="Kazanç özeti">
          <span>
            <small>Kazanç</small>
            <strong>₺28.450</strong>
          </span>
          <span>
            <small>Kesinleşen Kazanç</small>
            <strong>₺17.200</strong>
          </span>
          <span>
            <small>Çekilebilir Bakiye</small>
            <strong>₺9.650</strong>
          </span>
        </div>

        <button class="job-referral-withdraw-button" type="button" data-testid="job-referral-withdraw-button" @click="openWithdrawSheet">
          <AppIcon name="send" :size="17" />
          Para Çek
        </button>
      </AppCard>

      <AppCard padding="md" class="job-referral-audience-card" data-testid="job-referral-audience-card">
        <div class="job-referral-section-head">
          <span>
            <small>Kimler kazanabilir?</small>
            <strong>Elinde işi olan herkes için kazanç kanalı</strong>
          </span>
          <AppButton icon="plus" data-testid="job-referral-open-flow" @click="openJobSheet">İş Satışı Yap</AppButton>
        </div>
        <div class="job-referral-audience-list">
          <article v-for="item in audienceItems" :key="item.title">
            <span><AppIcon :name="item.icon" :size="18" /></span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.body }}</small>
          </article>
        </div>
        <p>
          Site yöneticileri, dijital pazarlamacılar, asist firmaları ve ek iş yapmak isteyenler bu ekrandan iş gönderdiğinde
          kazancın büyük bölümünü TL olarak takip eder.
        </p>
      </AppCard>

      <AppCard padding="md" class="job-referral-potential-card" data-testid="job-referral-potential-card">
        <div class="job-referral-section-head is-plain">
          <span>
            <small>Ne kadar kazanırım?</small>
            <strong>Talep akışın büyüdükçe kazanç potansiyelin artar</strong>
          </span>
        </div>
        <div class="job-referral-potential-grid">
          <article v-for="item in potentialCards" :key="item.label">
            <small>{{ item.label }}</small>
            <strong>{{ item.value }}</strong>
            <span>{{ item.body }}</span>
          </article>
        </div>
      </AppCard>

      <AppCard padding="md" class="job-referral-stats-panel" data-testid="job-referral-stats-panel">
        <div class="job-referral-section-head is-plain">
          <span>
            <small>İstatistikler</small>
            <strong>Satış, kazanç ve çekim bilgilerin</strong>
          </span>
        </div>
        <AppFilterChips v-model="activePeriod" :items="periods" aria-label="İş yönlendirme dönemi" />
        <section class="job-referral-stat-grid" aria-label="İş satış istatistikleri">
          <article v-for="item in stats" :key="item.label" :class="['job-referral-stat-card', `is-${item.tone}`]">
            <span><AppIcon :name="item.icon" :size="17" /></span>
            <small>{{ item.label }}</small>
            <strong>{{ item.value }}</strong>
          </article>
        </section>
      </AppCard>

      <AppCard padding="md" class="job-referral-ledger-card" data-testid="job-referral-ledger-card">
        <div class="job-referral-section-head is-plain">
          <span>
            <small>Son hareketler</small>
            <strong>Kazancını ve çekimlerini takip et</strong>
          </span>
        </div>
        <div class="job-referral-ledger-list">
          <article v-for="row in earningRows" :key="row.label">
            <span>
              <strong>{{ row.label }}</strong>
              <small>{{ row.date }}</small>
            </span>
            <span>
              <strong>{{ row.amount }}</strong>
              <small>{{ row.status }}</small>
            </span>
          </article>
        </div>
      </AppCard>
    </section>

    <AppSheet
      :open="withdrawOpen"
      title="Para Çek"
      description="Çekilebilir bakiyeni banka hesabına aktar."
      @close="closeWithdrawSheet"
    >
      <div class="job-referral-withdraw-sheet" data-testid="job-referral-withdraw-sheet">
        <label>
          Çekmek istediğin tutar
          <span>
            <input v-model="withdrawAmount" inputmode="numeric" type="number" min="1" max="9650" data-testid="job-referral-withdraw-amount" />
            <em>₺</em>
          </span>
        </label>
        <div class="job-referral-quick-amounts">
          <button v-for="amount in quickWithdrawAmounts" :key="amount" type="button" @click="withdrawAmount = String(amount)">
            ₺{{ moneyFormat.format(amount) }}
          </button>
        </div>
        <p>Çekilebilir bakiye: <strong>₺9.650</strong>. Talep onaylandığında kayıtlı banka hesabına aktarılır.</p>
        <AppButton full-width :disabled="!canWithdraw" data-testid="job-referral-withdraw-submit" @click="submitWithdraw">
          Para Çek
        </AppButton>
      </div>
    </AppSheet>

    <AppSheet
      :open="jobSheetOpen"
      :title="flowTitle"
      :description="flowDescription"
      @close="closeJobSheet"
    >
      <section class="job-referral-sheet-flow" data-testid="job-referral-flow">
        <div :class="['job-referral-progress', progressClass]" aria-hidden="true">
          <span></span>
        </div>

        <div v-if="flowStep === 'customer'" class="job-referral-form-step">
          <input v-model="customerFirstName" class="job-referral-input" type="text" placeholder="Müşteri adı" data-testid="job-referral-first-name" />
          <input v-model="customerLastName" class="job-referral-input" type="text" placeholder="Müşteri soyadı" data-testid="job-referral-last-name" />
          <input v-model="customerPhone" class="job-referral-input" type="tel" placeholder="Telefon numarası" data-testid="job-referral-phone" />
          <AppButton full-width :disabled="!canContinueCustomer" data-testid="job-referral-customer-next" @click="flowStep = 'sector'">Devam Et</AppButton>
        </div>

        <div v-else-if="flowStep === 'sector'" class="job-referral-list-step">
          <div class="job-referral-flow-nav">
            <button type="button" @click="goBack"><AppIcon name="chevron-left" :size="17" /> Geri</button>
          </div>
          <div class="job-referral-search">
            <input v-model="sectorSearch" type="search" placeholder="Sektör ara..." data-testid="job-referral-sector-search" />
            <AppIcon name="search" :size="19" />
          </div>
          <div class="job-referral-choice-list">
            <button v-for="sector in filteredSectors" :key="sector" type="button" data-testid="job-referral-sector-option" @click="chooseSector(sector)">
              <span><AppIcon name="plus" :size="16" /></span>
              {{ sector }}
            </button>
          </div>
        </div>

        <div v-else-if="flowStep === 'location'" class="job-referral-list-step">
          <div class="job-referral-flow-nav">
            <button type="button" @click="goBack"><AppIcon name="chevron-left" :size="17" /> Geri</button>
          </div>
          <div class="job-referral-search">
            <input v-model="citySearch" type="search" placeholder="Şehir ara..." data-testid="job-referral-city-search" />
            <AppIcon name="search" :size="19" />
          </div>
          <div class="job-referral-choice-list is-compact">
            <button v-for="city in filteredCities" :key="city" type="button" data-testid="job-referral-city-option" @click="chooseCity(city)">
              <span><AppIcon name="map-pin" :size="16" /></span>
              {{ city }}
            </button>
          </div>
          <input v-model="selectedDistrict" class="job-referral-input" type="text" placeholder="İlçe" data-testid="job-referral-district" />
          <textarea v-model="jobNote" class="job-referral-input job-referral-note-input" placeholder="Kısa iş notu (opsiyonel)" data-testid="job-referral-note"></textarea>
          <AppButton full-width :disabled="!canContinueLocation" data-testid="job-referral-location-next" @click="flowStep = 'summary'">Devam Et</AppButton>
        </div>

        <div v-else class="job-referral-summary-step">
          <div class="job-referral-flow-nav">
            <button type="button" @click="goBack"><AppIcon name="chevron-left" :size="17" /> Geri</button>
          </div>
          <span class="intro-logo"><AppIcon name="check" :size="32" /></span>
          <h2>İş satışı hazır</h2>
          <p>Bilgileri kontrol et, talebi gönder.</p>
          <AppCard padding="md" class="job-referral-summary-card">
            <span><strong>Müşteri</strong><em>{{ customerFirstName }} {{ customerLastName }}</em></span>
            <span><strong>Telefon</strong><em>{{ customerPhone }}</em></span>
            <span><strong>Sektör</strong><em>{{ selectedSector }}</em></span>
            <span><strong>Bölge</strong><em>{{ selectedCity }} / {{ selectedDistrict }}</em></span>
          </AppCard>
          <AppButton full-width icon="send" data-testid="job-referral-submit" @click="submitReferral">İşi Gönder</AppButton>
        </div>
      </section>
    </AppSheet>
  </AppPage>
</template>
