<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import AppIcon from "../ui/AppIcon.vue";
import AppSheet from "../ui/AppSheet.vue";

const props = defineProps({
  open: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "complete"]);

const numberFormatter = new Intl.NumberFormat("tr-TR");
const moneyFormatter = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const bonusAmount = 240;
const performanceScore = 81;
const cashConversionRate = 32;
const packages = [
  { id: "bonus-topup-3383", credit: 3383, price: 3293 },
  { id: "bonus-topup-5074", credit: 5074, price: 4984, badge: "Daha güçlü" },
  { id: "bonus-topup-8457", credit: 8457, price: 8367, badge: "En kazançlı" },
];

const mode = ref("topup");
const step = ref("select");
const selectedPackageId = ref("bonus-topup-8457");
const secondsLeft = ref(5);
let successTimer = 0;

const selectedPackage = computed(() => packages.find((item) => item.id === selectedPackageId.value) || packages[0]);
const cashAmount = computed(() => (bonusAmount * cashConversionRate) / 100);
const totalTopUpCredit = computed(() => selectedPackage.value.credit + bonusAmount);
const sheetTitle = computed(() => {
  if (step.value === "secure") return "3D Güvenli Doğrulama";
  if (step.value === "success") return mode.value === "topup" ? "Bonusun Tam Değerlendi" : "Nakit Cüzdana Aktarıldı";
  return "Krediye Çevir";
});
const sheetDescription = computed(() => {
  if (step.value === "secure") return "Ödeme onaylanınca bonusun tamamı bakiyene eklenir.";
  if (step.value === "success") return "İşlem başarıyla tamamlandı.";
  return "Bonusunu en avantajlı şekilde kullan.";
});

function formatNumber(value) {
  return numberFormatter.format(value);
}

function formatMoney(value) {
  return `₺${moneyFormatter.format(value)}`;
}

function resetFlow() {
  mode.value = "topup";
  step.value = "select";
  selectedPackageId.value = "bonus-topup-8457";
  secondsLeft.value = 5;
  clearInterval(successTimer);
}

function closeSheet() {
  clearInterval(successTimer);
  emit("close");
}

function startFlow() {
  if (mode.value === "topup") {
    step.value = "secure";
    return;
  }
  step.value = "cash-confirm";
}

function startSuccessTimer() {
  clearInterval(successTimer);
  secondsLeft.value = 5;
  successTimer = window.setInterval(() => {
    secondsLeft.value -= 1;
    if (secondsLeft.value <= 0) finishFlow();
  }, 1000);
}

function finishPayment() {
  step.value = "success";
  startSuccessTimer();
}

function finishFlow() {
  clearInterval(successTimer);
  emit("complete", {
    mode: mode.value,
    bonusAmount,
    cashAmount: cashAmount.value,
    totalCredit: totalTopUpCredit.value,
  });
  emit("close");
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) resetFlow();
    else clearInterval(successTimer);
  },
);

onBeforeUnmount(() => {
  clearInterval(successTimer);
});
</script>

<template>
  <AppSheet :open="open" :title="sheetTitle" :description="sheetDescription" @close="closeSheet">
    <div class="quick-bonus" data-testid="quick-bonus-sheet">
      <template v-if="step === 'select'">
        <section class="quick-bonus-hero">
          <span class="quick-bonus-hero__icon"><AppIcon name="gift" :size="24" /></span>
          <span>
            <small>Bonus cüzdanın</small>
            <strong>{{ formatNumber(bonusAmount) }} bonus</strong>
          </span>
          <em>En yüksek değer için bakiye yükle.</em>
        </section>

        <div class="quick-bonus-options" role="radiogroup" aria-label="Bonus dönüştürme seçenekleri">
          <button
            :class="['quick-bonus-option', 'is-recommended', { 'is-selected': mode === 'topup' }]"
            type="button"
            role="radio"
            :aria-checked="mode === 'topup' ? 'true' : 'false'"
            data-testid="bonus-mode-topup"
            @click="mode = 'topup'"
          >
            <span class="quick-bonus-option__badge">Önerilen</span>
            <span class="quick-bonus-option__icon"><AppIcon name="wallet" :size="21" /></span>
            <span class="quick-bonus-option__copy">
              <strong>Tamamını bakiyeye ekle</strong>
              <small>Bakiye yükle, bonusun tamamı eklensin.</small>
            </span>
            <span class="quick-bonus-option__value">{{ formatNumber(bonusAmount) }} bonus = {{ formatNumber(bonusAmount) }} kredi</span>
          </button>

          <button
            :class="['quick-bonus-option', { 'is-selected': mode === 'cash' }]"
            type="button"
            role="radio"
            :aria-checked="mode === 'cash' ? 'true' : 'false'"
            data-testid="bonus-mode-cash"
            @click="mode = 'cash'"
          >
            <span class="quick-bonus-option__icon"><AppIcon name="refresh" :size="21" /></span>
            <span class="quick-bonus-option__copy">
              <strong>Nakit cüzdana aktar</strong>
              <small>%{{ cashConversionRate }} oranla nakit cüzdana geçer.</small>
            </span>
            <span class="quick-bonus-option__value">{{ formatNumber(bonusAmount) }} bonus = {{ formatMoney(cashAmount) }}</span>
          </button>
        </div>

        <section v-if="mode === 'topup'" class="quick-bonus-topup" data-testid="bonus-topup-panel">
          <div class="quick-bonus-section-title">
            <span>Bakiye paketini seç</span>
            <small>Bonusun tamamı seçtiğin pakete eklenir.</small>
          </div>
          <div class="quick-bonus-package-grid" role="radiogroup" aria-label="Bakiye paketleri">
            <button
              v-for="item in packages"
              :key="item.id"
              :class="['quick-bonus-package', { 'is-selected': selectedPackageId === item.id }]"
              type="button"
              role="radio"
              :aria-checked="selectedPackageId === item.id ? 'true' : 'false'"
              data-testid="bonus-package-option"
              @click="selectedPackageId = item.id"
            >
              <span v-if="item.badge">{{ item.badge }}</span>
              <strong>{{ formatNumber(item.credit) }}</strong>
              <small>{{ formatMoney(item.price) }}</small>
            </button>
          </div>
          <div class="quick-bonus-total">
            <span>Hesaba geçecek toplam bakiye</span>
            <strong data-testid="bonus-total-credit">{{ formatNumber(totalTopUpCredit) }} kredi</strong>
            <small>{{ formatNumber(selectedPackage.credit) }} yükleme + {{ formatNumber(bonusAmount) }} bonus</small>
          </div>
        </section>

        <section v-else class="quick-bonus-cash" data-testid="bonus-cash-panel">
          <div>
            <span>Performans skorun</span>
            <strong>{{ performanceScore }}</strong>
          </div>
          <div>
            <span>Dönüşüm oranı</span>
            <strong>%{{ cashConversionRate }}</strong>
          </div>
          <div>
            <span>Nakit cüzdana geçecek</span>
            <strong>{{ formatMoney(cashAmount) }}</strong>
          </div>
          <p>Bu seçenekte bonus cüzdanın sıfırlanır. Bakiye yüklemede ise bonusun tamamını kullanırsın.</p>
        </section>

        <div class="quick-bonus-sticky">
          <button class="quick-bonus-primary" type="button" data-testid="bonus-convert-submit" @click="startFlow">
            <span>
              <AppIcon :name="mode === 'topup' ? 'shield' : 'refresh'" :size="16" />
              {{ mode === "topup" ? "Bakiye Yükle + Bonusu Kullan" : "Nakit Cüzdana Aktar" }}
            </span>
            <strong>{{ mode === "topup" ? formatNumber(totalTopUpCredit) + " kredi" : formatMoney(cashAmount) }}</strong>
          </button>
        </div>
      </template>

      <template v-else-if="step === 'secure'">
        <section class="quick-bonus-confirm" data-testid="bonus-3d-step">
          <span class="quick-bonus-confirm__icon"><AppIcon name="shield" :size="34" /></span>
          <h3>Bonusun tamamı korunuyor</h3>
          <p>Ödeme onaylanınca {{ formatNumber(selectedPackage.credit) }} kredi yüklenir ve {{ formatNumber(bonusAmount) }} bonusun tamamı bakiyene eklenir.</p>
          <div class="quick-bonus-confirm-card">
            <span>
              <small>Bugün ödenecek</small>
              <strong>{{ formatMoney(selectedPackage.price) }}</strong>
            </span>
            <span>
              <small>Hesaba geçecek</small>
              <strong>{{ formatNumber(totalTopUpCredit) }} kredi</strong>
            </span>
          </div>
          <button class="quick-bonus-primary" type="button" data-testid="bonus-3d-confirm" @click="finishPayment">
            <span><AppIcon name="check" :size="16" /> 3D Doğrulamayı Tamamla</span>
            <strong>{{ formatMoney(selectedPackage.price) }}</strong>
          </button>
          <button class="quick-bonus-secondary" type="button" @click="step = 'select'">Geri dön</button>
        </section>
      </template>

      <template v-else-if="step === 'cash-confirm'">
        <section class="quick-bonus-confirm" data-testid="bonus-cash-confirm">
          <span class="quick-bonus-confirm__icon is-amber"><AppIcon name="refresh" :size="34" /></span>
          <h3>Nakit aktarımı onayla</h3>
          <p>{{ formatNumber(bonusAmount) }} bonusun %{{ cashConversionRate }} oranla {{ formatMoney(cashAmount) }} olarak nakit cüzdana geçer. Bonus cüzdanın sıfırlanır.</p>
          <button class="quick-bonus-primary" type="button" data-testid="bonus-cash-confirm-button" @click="finishPayment">
            <span><AppIcon name="check" :size="16" /> Nakit Cüzdana Aktar</span>
            <strong>{{ formatMoney(cashAmount) }}</strong>
          </button>
          <button class="quick-bonus-secondary" type="button" @click="step = 'select'">Bakiye yüklemeyi seç</button>
        </section>
      </template>

      <template v-else>
        <section class="quick-bonus-success" data-testid="bonus-convert-success">
          <span class="quick-bonus-success__icon"><AppIcon name="check" :size="42" /></span>
          <h3>{{ mode === "topup" ? "Bonusun tam değerle kullanıldı" : "Nakit cüzdana aktarıldı" }}</h3>
          <p v-if="mode === 'topup'">
            {{ formatNumber(selectedPackage.credit) }} kredi yükledin. {{ formatNumber(bonusAmount) }} bonusun da eklendi ve toplam {{ formatNumber(totalTopUpCredit) }} kredi hesabına geçti.
          </p>
          <p v-else>
            {{ formatMoney(cashAmount) }} nakit cüzdanına geçti. Bonus cüzdanı bu işlemle sıfırlandı.
          </p>
          <button class="quick-bonus-primary" type="button" data-testid="bonus-convert-home" @click="finishFlow">
            <span><AppIcon name="home" :size="16" /> Ana Sayfaya Dön</span>
            <strong>{{ secondsLeft }} sn</strong>
          </button>
        </section>
      </template>
    </div>
  </AppSheet>
</template>
