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
const integerMoneyFormatter = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 0,
});

const bonusAmount = 1375;
const performanceScore = 81;
const scoreConversionRate = 32;
const fullBonusPaymentMultiplier = 4.7;

const mode = ref("full");
const step = ref("select");
const secondsLeft = ref(5);
let successTimer = 0;

const requiredPayment = computed(() => Math.round(bonusAmount * fullBonusPaymentMultiplier));
const fullCreditAmount = computed(() => requiredPayment.value + bonusAmount);
const scoreCreditAmount = computed(() => (bonusAmount * scoreConversionRate) / 100);

const sheetTitle = computed(() => {
  if (step.value === "secure") return "Güvenli Ödeme";
  if (step.value === "score-confirm") return "Bakiyeye Ekle";
  if (step.value === "success") return mode.value === "full" ? "Bonusun Tamamı Kullanıldı" : "Bakiye Eklendi";
  return "Bonusu Kullan";
});

const sheetDescription = computed(() => {
  if (step.value === "secure") return "Ödeme sayfasında kart doğrulaması tamamlanır.";
  if (step.value === "score-confirm") return "Performans skoruna göre bakiyeye eklenecek tutarı onayla.";
  if (step.value === "success") return "İşlem başarıyla tamamlandı.";
  return "Bonusunu nasıl kullanmak istediğini seç.";
});

function formatNumber(value) {
  return numberFormatter.format(value);
}

function formatMoney(value) {
  return `₺${moneyFormatter.format(value)}`;
}

function formatIntegerMoney(value) {
  return `₺${integerMoneyFormatter.format(value)}`;
}

function resetFlow() {
  mode.value = "full";
  step.value = "select";
  secondsLeft.value = 5;
  clearInterval(successTimer);
}

function closeSheet() {
  clearInterval(successTimer);
  emit("close");
}

function startFlow() {
  step.value = mode.value === "full" ? "secure" : "score-confirm";
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
    requiredPayment: requiredPayment.value,
    fullCreditAmount: fullCreditAmount.value,
    scoreCreditAmount: scoreCreditAmount.value,
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
        <div class="quick-bonus-options" role="radiogroup" aria-label="Bonus dönüştürme seçenekleri">
          <button
            :class="['quick-bonus-option', 'is-recommended', { 'is-selected': mode === 'full' }]"
            type="button"
            role="radio"
            :aria-checked="mode === 'full' ? 'true' : 'false'"
            data-testid="bonus-mode-topup"
            @click="mode = 'full'"
          >
            <span class="quick-bonus-option__badge">Önerilen</span>
            <span class="quick-bonus-option__selector" aria-hidden="true">
              <span class="quick-bonus-radio" data-testid="bonus-radio-full"></span>
              <span class="quick-bonus-option__icon"><AppIcon name="wallet" :size="21" /></span>
            </span>
            <span class="quick-bonus-option__copy">
              <strong>Bakiye yükleyerek sıfırla</strong>
              <small>Bonusun tamamını bakiyene eklemek için bakiye yükle.</small>
            </span>
            <span class="quick-bonus-option__value">
              Bonus sıfırlanır, bakiyen artar.
            </span>
          </button>

          <button
            :class="['quick-bonus-option', { 'is-selected': mode === 'score' }]"
            type="button"
            role="radio"
            :aria-checked="mode === 'score' ? 'true' : 'false'"
            data-testid="bonus-mode-cash"
            @click="mode = 'score'"
          >
            <span class="quick-bonus-option__selector" aria-hidden="true">
              <span class="quick-bonus-radio" data-testid="bonus-radio-score"></span>
              <span class="quick-bonus-option__icon"><AppIcon name="refresh" :size="21" /></span>
            </span>
            <span class="quick-bonus-option__copy">
              <strong>Bakiye yüklemeden sıfırla</strong>
              <small>Performans skorun {{ performanceScore }} olduğu için %{{ scoreConversionRate }} oran uygulanır.</small>
            </span>
            <span class="quick-bonus-option__value">
              {{ formatIntegerMoney(bonusAmount) }} bonus = {{ formatMoney(scoreCreditAmount) }} bakiye
            </span>
          </button>
        </div>

        <section v-if="mode === 'full'" class="quick-bonus-total" data-testid="bonus-topup-panel">
          <span>Önerilen yöntem</span>
          <div class="quick-bonus-formula" data-testid="bonus-total-credit" aria-label="Bonus bakiye özeti">
            <strong>
              <small>Bonus</small>
              {{ formatNumber(bonusAmount) }} TL
            </strong>
            <strong>
              <small>Yükleme</small>
              {{ formatNumber(requiredPayment) }} TL
            </strong>
            <strong>
              <small>Hesabına</small>
              {{ formatNumber(fullCreditAmount) }} TL
            </strong>
          </div>
          <p class="quick-bonus-total__copy">
            {{ formatNumber(bonusAmount) }} TL bonusun tamamı bakiyene eklenir.
          </p>
        </section>

        <section v-else class="quick-bonus-score" data-testid="bonus-cash-panel">
          <span class="quick-bonus-score__label">Bakiye yüklemeden kullan</span>
          <div class="quick-bonus-score__flow" aria-label="Bonusun bakiyeye eklenme özeti">
            <strong>
              <small>Bonus</small>
              {{ formatIntegerMoney(bonusAmount) }}
            </strong>
            <span class="quick-bonus-score__rate">%{{ scoreConversionRate }}</span>
            <strong>
              <small>Hesabına</small>
              {{ formatMoney(scoreCreditAmount) }}
            </strong>
          </div>
          <p>{{ formatIntegerMoney(bonusAmount) }} bonus sıfırlanır, hesabına {{ formatMoney(scoreCreditAmount) }} bakiye eklenir.</p>
        </section>

        <div class="quick-bonus-sticky">
          <button class="quick-bonus-primary" type="button" data-testid="bonus-convert-submit" @click="startFlow">
            <span>
              <AppIcon :name="mode === 'full' ? 'lock' : 'refresh'" :size="16" />
              {{ mode === "full" ? "Bonusu Nakde Çevir" : "Bakiyeye Ekle" }}
            </span>
            <strong>{{ mode === "full" ? formatIntegerMoney(requiredPayment) : formatMoney(scoreCreditAmount) }}</strong>
          </button>
        </div>
      </template>

      <template v-else-if="step === 'secure'">
        <section class="quick-bonus-confirm" data-testid="bonus-3d-step">
          <span class="quick-bonus-confirm__icon"><AppIcon name="shield" :size="34" /></span>
          <h3>Ödeme doğrulaması</h3>
          <p>Kartından {{ formatIntegerMoney(requiredPayment) }} ödeme alınır. {{ formatIntegerMoney(bonusAmount) }} bonusun tamamı eklenir ve hesabına toplam {{ formatIntegerMoney(fullCreditAmount) }} bakiye geçer.</p>
          <div class="quick-bonus-confirm-card">
            <span>
              <small>Bugün ödenecek</small>
              <strong>{{ formatIntegerMoney(requiredPayment) }}</strong>
            </span>
            <span>
              <small>Hesaba geçecek</small>
              <strong>{{ formatIntegerMoney(fullCreditAmount) }} bakiye</strong>
            </span>
          </div>
          <button class="quick-bonus-primary" type="button" data-testid="bonus-3d-confirm" @click="finishPayment">
            <span><AppIcon name="check" :size="16" /> 3D Doğrulamayı Tamamla</span>
            <strong>{{ formatIntegerMoney(requiredPayment) }}</strong>
          </button>
        </section>
      </template>

      <template v-else-if="step === 'score-confirm'">
        <section class="quick-bonus-confirm" data-testid="bonus-cash-confirm">
          <span class="quick-bonus-confirm__icon is-amber"><AppIcon name="refresh" :size="34" /></span>
          <h3>Bakiyeye ekle</h3>
          <p>{{ formatIntegerMoney(bonusAmount) }} bonusun %{{ scoreConversionRate }} oranla {{ formatMoney(scoreCreditAmount) }} bakiye olarak eklenir. Bonus cüzdanın bu işlemle sıfırlanır.</p>
          <button class="quick-bonus-primary" type="button" data-testid="bonus-cash-confirm-button" @click="finishPayment">
            <span><AppIcon name="check" :size="16" /> Bakiyeye Ekle</span>
            <strong>{{ formatMoney(scoreCreditAmount) }}</strong>
          </button>
          <button class="quick-bonus-secondary" type="button" @click="step = 'select'">Önerilen yönteme dön</button>
        </section>
      </template>

      <template v-else>
        <section class="quick-bonus-success" data-testid="bonus-convert-success">
          <span class="quick-bonus-success__icon"><AppIcon name="check" :size="42" /></span>
          <h3>{{ mode === "full" ? "Bonusun tamamı kullanıldı" : "Bakiye eklendi" }}</h3>
          <p v-if="mode === 'full'">
            {{ formatIntegerMoney(requiredPayment) }} ödeme yaptın. {{ formatIntegerMoney(bonusAmount) }} bonusun da eklendi ve toplam {{ formatIntegerMoney(fullCreditAmount) }} bakiye hesabına geçti.
          </p>
          <p v-else>
            {{ formatMoney(scoreCreditAmount) }} bakiye hesabına geçti. Bonus cüzdanın bu işlemle sıfırlandı.
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
