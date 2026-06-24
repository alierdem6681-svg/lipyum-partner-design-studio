<script setup>
import { computed, ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppFilterChips from "../components/ui/AppFilterChips.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import { useAppShellStore } from "../stores/appShellStore.js";

const shell = useAppShellStore();
const activeView = ref("invoices");
const invoiceType = ref("individual");
const saved = ref(false);

const viewTabs = [
  { label: "Faturalar", value: "invoices" },
  { label: "Fatura Bilgileri", value: "settings" },
];

const invoiceTypeTabs = [
  { label: "Bireysel", value: "individual" },
  { label: "Kurumsal", value: "corporate" },
];

const invoices = [
  { id: "LP-2026-006", title: "Haziran hizmet faturası", date: "22.06.2026", amount: "249 ₺", status: "Ödendi", balance: "1.426 ₺" },
  { id: "LP-2026-005", title: "Mayıs hizmet faturası", date: "22.05.2026", amount: "249 ₺", status: "Ödendi", balance: "1.177 ₺" },
  { id: "LP-2026-004", title: "Nisan hizmet faturası", date: "22.04.2026", amount: "199 ₺", status: "Ödendi", balance: "928 ₺" },
  { id: "LP-2026-003", title: "Mart hizmet faturası", date: "22.03.2026", amount: "199 ₺", status: "Ödendi", balance: "729 ₺" },
];

const invoiceInfo = ref({
  fullName: "Ahmet Kaya",
  identityNo: "12345678910",
  companyTitle: "Lipyum Servis Hizmetleri Ltd. Şti.",
  taxOffice: "Kayseri",
  taxNo: "1234567890",
  email: "ahmet@lipyum.com",
  address: "Kayseri, Melikgazi",
});

const visibleFields = computed(() => {
  if (invoiceType.value === "corporate") {
    return [
      { key: "companyTitle", label: "Şirket ünvanı" },
      { key: "taxNo", label: "Vergi no" },
      { key: "taxOffice", label: "Vergi dairesi" },
      { key: "email", label: "Fatura e-postası" },
      { key: "address", label: "Fatura adresi", multiline: true },
    ];
  }

  return [
    { key: "fullName", label: "Ad soyad" },
    { key: "identityNo", label: "T.C. kimlik no" },
    { key: "email", label: "Fatura e-postası" },
    { key: "address", label: "Fatura adresi", multiline: true },
  ];
});

function openInvoice(invoice, action) {
  shell.openSheet({
    title: action === "download" ? "Fatura indir" : "Fatura görüntüle",
    description: invoice.id,
    body: `${invoice.title} için ${action === "download" ? "PDF indirme" : "görüntüleme"} akışı hazırlandı.`,
  });
}

function saveInvoiceInfo() {
  saved.value = true;
  shell.showToast("Fatura bilgileri kaydedildi.");
}
</script>

<template>
  <AppPage title="Faturalarım" data-testid="invoices-page">
    <div class="invoice-page">
      <AppCard variant="hero" padding="lg" class="invoice-hero">
        <div class="invoice-hero__icon" aria-hidden="true">
          <AppIcon name="receipt" :size="24" />
        </div>
        <div class="invoice-hero__copy">
          <strong>Faturalarını ve bilgilerini yönet</strong>
          <span>Kesilen faturaları görüntüle, indir ve fatura bilgilerini güncelle.</span>
        </div>
      </AppCard>

      <AppFilterChips
        v-model="activeView"
        :items="viewTabs"
        aria-label="Fatura sekmeleri"
        data-testid="invoice-view-tabs"
      />

      <section v-if="activeView === 'invoices'" class="invoice-section" aria-label="Fatura listesi">
        <div class="invoice-summary">
          <AppCard padding="sm" class="invoice-summary__item">
            <span>Toplam</span>
            <strong>4</strong>
          </AppCard>
          <AppCard padding="sm" class="invoice-summary__item">
            <span>Son fatura</span>
            <strong>249 ₺</strong>
          </AppCard>
          <AppCard padding="sm" class="invoice-summary__item">
            <span>Durum</span>
            <strong>Güncel</strong>
          </AppCard>
        </div>

        <div class="invoice-list" role="list">
          <AppCard
            v-for="invoice in invoices"
            :key="invoice.id"
            padding="md"
            as="article"
            class="invoice-row"
            role="listitem"
            data-testid="invoice-row"
          >
            <div class="invoice-row__main">
              <span class="invoice-row__icon" aria-hidden="true">
                <AppIcon name="receipt" :size="19" />
              </span>
              <div class="invoice-row__copy">
                <strong>{{ invoice.title }}</strong>
                <small>{{ invoice.id }} · {{ invoice.date }}</small>
              </div>
            </div>
            <div class="invoice-row__amount">
              <strong>{{ invoice.amount }}</strong>
              <small>{{ invoice.status }}</small>
            </div>
            <div class="invoice-row__actions" aria-label="Fatura aksiyonları">
              <AppButton size="sm" variant="secondary" icon="eye" @click="openInvoice(invoice, 'view')">
                Görüntüle
              </AppButton>
              <AppButton size="sm" variant="ghost" icon="download" @click="openInvoice(invoice, 'download')">
                İndir
              </AppButton>
            </div>
          </AppCard>
        </div>
      </section>

      <section v-else class="invoice-section" aria-label="Fatura bilgileri" data-testid="invoice-settings">
        <AppCard padding="md" class="invoice-settings-card">
          <div class="invoice-section-head">
            <span class="invoice-section-head__icon" aria-hidden="true">
              <AppIcon name="edit" :size="19" />
            </span>
            <div>
              <strong>Fatura bilgileri</strong>
              <small>Bireysel veya kurumsal fatura bilgilerini buradan düzenle.</small>
            </div>
          </div>

          <AppFilterChips
            v-model="invoiceType"
            :items="invoiceTypeTabs"
            aria-label="Fatura türü"
            data-testid="invoice-type-tabs"
          />

          <form class="invoice-form" @submit.prevent="saveInvoiceInfo">
            <label v-for="field in visibleFields" :key="field.key" class="invoice-field">
              <span>{{ field.label }}</span>
              <textarea
                v-if="field.multiline"
                v-model="invoiceInfo[field.key]"
                rows="3"
              ></textarea>
              <input v-else v-model="invoiceInfo[field.key]" type="text" />
            </label>

            <p v-if="saved" class="invoice-save-note" data-testid="invoice-save-note">
              Fatura bilgileri kaydedildi. Yeni faturalar bu bilgilerle hazırlanır.
            </p>

            <AppButton type="submit" full-width icon="check" data-testid="invoice-save-button">
              Fatura Bilgilerini Kaydet
            </AppButton>
          </form>
        </AppCard>
      </section>
    </div>
  </AppPage>
</template>

<style scoped>
.invoice-page {
  display: grid;
  gap: 12px;
}

.invoice-hero {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.invoice-hero__icon,
.invoice-row__icon,
.invoice-section-head__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  background: var(--green-soft);
  color: var(--green-dark);
}

.invoice-hero__icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
}

.invoice-hero__copy,
.invoice-row__copy,
.invoice-section-head > div {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.invoice-hero__copy strong,
.invoice-section-head strong {
  color: var(--ink);
  font-size: 16px;
  line-height: 1.15;
}

.invoice-hero__copy span,
.invoice-section-head small,
.invoice-row__copy small,
.invoice-row__amount small {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.35;
}

.invoice-section {
  display: grid;
  gap: 10px;
}

.invoice-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.invoice-summary__item {
  display: grid;
  gap: 3px;
  text-align: center;
}

.invoice-summary__item span {
  color: var(--muted);
  font-size: 11px;
  font-weight: 800;
}

.invoice-summary__item strong {
  color: var(--ink);
  font-size: 15px;
}

.invoice-list {
  display: grid;
  gap: 10px;
}

.invoice-row {
  display: grid;
  gap: 11px;
}

.invoice-row__main {
  min-width: 0;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
}

.invoice-row__icon,
.invoice-section-head__icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
}

.invoice-row__copy strong {
  color: var(--ink);
  font-size: 14px;
  line-height: 1.2;
}

.invoice-row__amount {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--border);
  padding-top: 10px;
}

.invoice-row__amount strong {
  color: var(--ink);
  font-size: 18px;
}

.invoice-row__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.invoice-settings-card,
.invoice-form {
  display: grid;
  gap: 12px;
}

.invoice-section-head {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
}

.invoice-field {
  display: grid;
  gap: 6px;
}

.invoice-field span {
  color: var(--ink);
  font-size: 12px;
  font-weight: 900;
}

.invoice-field input,
.invoice-field textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--card);
  color: var(--ink);
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  padding: 12px;
  outline: none;
}

.invoice-field input:focus,
.invoice-field textarea:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 3px var(--green-soft);
}

.invoice-save-note {
  margin: 0;
  border: 1px solid var(--green);
  border-radius: 14px;
  background: var(--green-soft);
  color: var(--green-dark);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.35;
  padding: 10px 12px;
}

@media (min-width: 390px) {
  .invoice-row {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }

  .invoice-row__amount {
    display: grid;
    justify-items: end;
    border-top: 0;
    padding-top: 0;
  }

  .invoice-row__actions {
    grid-column: 1 / -1;
  }
}
</style>
