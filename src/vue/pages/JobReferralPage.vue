<script setup>
import { computed, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();

const mode = ref("dashboard");
const flowStep = ref("intro");
const activeMetric = ref("sales");
const activePeriod = ref("yesterday");
const customerFirstName = ref("");
const customerLastName = ref("");
const sectorSearch = ref("");
const citySearch = ref("");
const selectedSector = ref("");
const selectedCity = ref("");

const metricTabs = [
  { value: "sales", label: "İş Satışları", icon: "bar-chart", dot: false },
  { value: "calls", label: "Çağrılar", icon: "phone", dot: false },
];

const periods = [
  { value: "today", label: "Bugün", dot: false },
  { value: "yesterday", label: "Dün", dot: false },
  { value: "last7", label: "Son 7", dot: false },
  { value: "last30", label: "Son 30", dot: false },
  { value: "last90", label: "Son 90", dot: false },
];

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
  "Bursa",
  "İstanbul",
  "İzmir",
  "Kayseri",
  "Konya",
];

const filteredSectors = computed(() =>
  sectors.filter((item) => item.toLocaleLowerCase("tr-TR").includes(sectorSearch.value.toLocaleLowerCase("tr-TR"))),
);

const filteredCities = computed(() =>
  cities.filter((item) => item.toLocaleLowerCase("tr-TR").includes(citySearch.value.toLocaleLowerCase("tr-TR"))),
);

const canContinueCustomer = computed(() => customerFirstName.value.trim() && customerLastName.value.trim());
const progressClass = computed(() => {
  const index = ["customer", "sector", "city", "summary"].indexOf(flowStep.value);
  return index < 0 ? "is-progress-1" : `is-progress-${index + 1}`;
});

const stats = [
  { label: "Gönderilen İş", value: "0", tone: "blue", icon: "briefcase" },
  { label: "Başarılı İş", value: "0", tone: "green", icon: "check" },
  { label: "İptal Edilen İş", value: "0", tone: "red", icon: "x" },
  { label: "Net Kazanç", value: "0 ₺", tone: "gold", icon: "wallet" },
];

function openIntro() {
  mode.value = "flow";
  flowStep.value = "intro";
}

function startFlow() {
  flowStep.value = "customer";
}

function closeFlow() {
  mode.value = "dashboard";
  flowStep.value = "intro";
}

function goBack() {
  const steps = ["intro", "customer", "sector", "city", "summary"];
  const currentIndex = steps.indexOf(flowStep.value);
  if (currentIndex <= 0) {
    closeFlow();
    return;
  }
  flowStep.value = steps[currentIndex - 1];
}

function chooseSector(sector) {
  selectedSector.value = sector;
  flowStep.value = "city";
}

function chooseCity(city) {
  selectedCity.value = city;
  flowStep.value = "summary";
}

function submitReferral() {
  shell.showToast("İş yönlendirme taslağı hazırlandı.");
  closeFlow();
}
</script>

<template>
  <AppPage title="İş Yönlendirme Programı" data-testid="job-referral-page">
    <section v-if="mode === 'dashboard'" class="job-referral-dashboard">
      <div class="job-referral-role-switch" aria-label="Çalışma modu">
        <button type="button" class="role-tab">
          <AppIcon name="settings" :size="15" />
          Uzman
        </button>
        <button type="button" class="role-tab is-active">
          <AppIcon name="shield" :size="15" />
          İş Ortağı
        </button>
      </div>

      <section class="job-referral-wallet-card">
        <span class="wallet-info"><AppIcon name="help-circle" :size="18" /></span>
        <div class="wallet-title">
          <AppIcon name="wallet" :size="22" />
          <strong>Cüzdan</strong>
        </div>
        <div class="wallet-values">
          <span>
            <small>Bakiye</small>
            <strong>0 ₺</strong>
          </span>
          <span>
            <small><i></i>Kesinleşen Kazanç</small>
            <strong>0 ₺</strong>
          </span>
        </div>
        <button class="wallet-withdraw" type="button">
          <AppIcon name="send" :size="17" />
          Para Çek
        </button>
      </section>

      <AppCard padding="md" class="job-referral-onboarding-card">
        <span class="onboarding-icon"><AppIcon name="trend-up" :size="22" /></span>
        <span>
          <strong>İş Sat, Para Kazan!</strong>
          <small>Hizmet veremediğin işleri uygun partnerlere aktar, tamamlandığında ek gelir elde et.</small>
        </span>
        <AppButton icon-right="chevron-right" data-testid="job-referral-open-flow" @click="openIntro">İş Sat</AppButton>
      </AppCard>

      <div class="job-referral-tab-panel">
        <AppFilterChips v-model="activeMetric" :items="metricTabs" aria-label="İş yönlendirme türü" />
        <AppFilterChips v-model="activePeriod" :items="periods" aria-label="İş yönlendirme dönemi" />
        <p class="job-referral-period-note">Dün için iş satış istatistikleri</p>
      </div>

      <section class="job-referral-stat-grid" aria-label="İş satış istatistikleri">
        <article v-for="item in stats" :key="item.label" :class="['job-referral-stat-card', `is-${item.tone}`]">
          <span><AppIcon :name="item.icon" :size="18" /></span>
          <small>{{ item.label }}</small>
          <strong>{{ item.value }}</strong>
        </article>
      </section>
    </section>

    <section v-else class="job-referral-flow" data-testid="job-referral-flow">
      <div class="job-referral-flow-top">
        <button type="button" class="flow-back" @click="goBack">
          <AppIcon name="chevron-left" :size="17" />
          Geri
        </button>
        <button type="button" class="flow-close" aria-label="Kapat" @click="closeFlow">
          <AppIcon name="x" :size="24" />
        </button>
      </div>

      <div v-if="flowStep !== 'intro'" :class="['job-referral-progress', progressClass]" aria-hidden="true">
        <span></span>
      </div>

      <div v-if="flowStep === 'intro'" class="job-referral-intro">
        <span class="intro-logo"><AppIcon name="share" :size="34" /></span>
        <h2>İş Sat, Para Kazan!</h2>
        <p>Hizmet veremediğin işleri satarak ek gelir elde edin.</p>

        <article class="intro-benefit">
          <span><AppIcon name="trend-up" :size="21" /></span>
          <div>
            <strong>Her işte Kazanç</strong>
            <small>Her bir işte 500 - 1.250 kazanabilirsiniz.</small>
          </div>
        </article>
        <article class="intro-benefit">
          <span><AppIcon name="check" :size="21" /></span>
          <div>
            <strong>Kolay ve Hızlı</strong>
            <small>Birkaç adımda işinizi satabilir, satış tamamlandığında ödemenizi alabilirsiniz.</small>
          </div>
        </article>

        <AppButton full-width icon-right="chevron-right" data-testid="job-referral-start" @click="startFlow">Hadi Başlayalım</AppButton>
      </div>

      <div v-else-if="flowStep === 'customer'" class="job-referral-form-step is-lower">
        <input v-model="customerFirstName" class="job-referral-input" type="text" placeholder="Müşteri Adı" data-testid="job-referral-first-name" />
        <input v-model="customerLastName" class="job-referral-input" type="text" placeholder="Müşteri Soyadı" data-testid="job-referral-last-name" />
        <AppButton full-width :disabled="!canContinueCustomer" data-testid="job-referral-customer-next" @click="flowStep = 'sector'">Devam Et</AppButton>
      </div>

      <div v-else-if="flowStep === 'sector'" class="job-referral-list-step">
        <label>Sektör Seçin:</label>
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

      <div v-else-if="flowStep === 'city'" class="job-referral-list-step">
        <div class="job-referral-search">
          <input v-model="citySearch" type="search" placeholder="İl ara..." data-testid="job-referral-city-search" />
          <AppIcon name="search" :size="19" />
        </div>
        <div class="job-referral-choice-list">
          <button v-for="city in filteredCities" :key="city" type="button" data-testid="job-referral-city-option" @click="chooseCity(city)">
            <span><AppIcon name="plus" :size="16" /></span>
            {{ city }}
          </button>
        </div>
      </div>

      <div v-else class="job-referral-summary-step">
        <span class="intro-logo"><AppIcon name="check" :size="34" /></span>
        <h2>İş taslağı hazır</h2>
        <p>Bilgileri kontrol edip iş yönlendirme kaydını oluşturabilirsin.</p>
        <AppCard padding="md" class="job-referral-summary-card">
          <span><strong>Müşteri</strong><em>{{ customerFirstName }} {{ customerLastName }}</em></span>
          <span><strong>Sektör</strong><em>{{ selectedSector }}</em></span>
          <span><strong>İl</strong><em>{{ selectedCity }}</em></span>
        </AppCard>
        <AppButton full-width icon="send" data-testid="job-referral-submit" @click="submitReferral">İşi Gönder</AppButton>
      </div>
    </section>
  </AppPage>
</template>
