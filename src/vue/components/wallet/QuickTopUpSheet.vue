<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import {
  DEFAULT_QUICK_TOPUP_OFFER_ID,
  buildQuickTopUpSummary,
  formatQuickTopUpBonus,
  formatQuickTopUpMoney,
  formatQuickTopUpTl,
  getQuickTopUpOfferById,
  quickTopUpAdditionalOffers,
  quickTopUpPaymentMethods,
  quickTopUpVisibleOffers,
} from "../../data/quickTopUpOffers.js";
import AppIcon from "../ui/AppIcon.vue";
import AppSheet from "../ui/AppSheet.vue";

const props = defineProps({
  open: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "complete"]);

const selectedOfferId = ref(DEFAULT_QUICK_TOPUP_OFFER_ID);
const selectedPaymentMethodId = ref(quickTopUpPaymentMethods[0].id);
const moreOffersOpen = ref(false);
const paymentSheetOpen = ref(false);
const step = ref("select");
const isSubmitting = ref(false);
const secondsLeft = ref(5);
let submitTimer = 0;
let successTimer = 0;

const selectedOffer = computed(() => getQuickTopUpOfferById(selectedOfferId.value));
const selectedPaymentMethod = computed(
  () => quickTopUpPaymentMethods.find((method) => method.id === selectedPaymentMethodId.value) || quickTopUpPaymentMethods[0],
);
const summary = computed(() => buildQuickTopUpSummary(selectedOffer.value));
const allVisibleOffers = computed(() => (moreOffersOpen.value
  ? [...quickTopUpVisibleOffers, ...quickTopUpAdditionalOffers]
  : quickTopUpVisibleOffers));

const primaryCtaLabel = computed(() => {
  if (isSubmitting.value) return "Ödeme hazırlanıyor...";
  return `${formatQuickTopUpTl(summary.value.payableAmount)} Öde`;
});

const sheetTitle = computed(() => (step.value === "success" ? "Bakiye Yüklendi" : "Bakiye Yükle"));
const sheetDescription = computed(() => (
  step.value === "success"
    ? "Bakiye ödeme sonrası hesabına geçti."
    : "İş alabilmek için hesabına bakiye ekle."
));

function resetFlow() {
  selectedOfferId.value = DEFAULT_QUICK_TOPUP_OFFER_ID;
  selectedPaymentMethodId.value = quickTopUpPaymentMethods[0].id;
  moreOffersOpen.value = false;
  paymentSheetOpen.value = false;
  step.value = "select";
  isSubmitting.value = false;
  secondsLeft.value = 5;
  clearTimeout(submitTimer);
  clearInterval(successTimer);
}

function closeSheet() {
  clearTimeout(submitTimer);
  clearInterval(successTimer);
  paymentSheetOpen.value = false;
  emit("close");
}

function selectOffer(id) {
  selectedOfferId.value = id;
}

function selectPaymentMethod(id) {
  selectedPaymentMethodId.value = id;
  paymentSheetOpen.value = false;
}

function startSuccessTimer() {
  clearInterval(successTimer);
  secondsLeft.value = 5;
  successTimer = window.setInterval(() => {
    secondsLeft.value -= 1;
    if (secondsLeft.value <= 0) finishFlow();
  }, 1000);
}

function submitTopUp() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  clearTimeout(submitTimer);
  submitTimer = window.setTimeout(() => {
    isSubmitting.value = false;
    step.value = "success";
    startSuccessTimer();
  }, 650);
}

function finishFlow() {
  clearTimeout(submitTimer);
  clearInterval(successTimer);
  emit("complete", summary.value);
  emit("close");
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) resetFlow();
    else {
      clearTimeout(submitTimer);
      clearInterval(successTimer);
      paymentSheetOpen.value = false;
    }
  },
);

onBeforeUnmount(() => {
  clearTimeout(submitTimer);
  clearInterval(successTimer);
});
</script>

<template>
  <AppSheet :open="open" :title="sheetTitle" :description="sheetDescription" @close="closeSheet">
    <div class="quick-topup" data-testid="quick-topup-sheet">
      <template v-if="step === 'select'">
        <section class="quick-topup-hero" aria-live="polite">
          <span class="quick-topup-hero__eyebrow">Hesabına geçecek olan bakiye</span>
          <strong class="quick-topup-hero__amount" data-testid="quick-topup-total-balance">
            {{ formatQuickTopUpMoney(summary.balanceAmount) }}
          </strong>
          <div class="quick-topup-hero__metrics">
            <span>
              <AppIcon name="credit-card" :size="19" />
              <small>Ödenecek</small>
              <strong data-testid="quick-topup-payable">{{ formatQuickTopUpMoney(summary.payableAmount) }}</strong>
            </span>
            <span>
              <AppIcon name="gift" :size="19" />
              <small>Kullanılan bonus</small>
              <strong>{{ formatQuickTopUpMoney(summary.appliedBonus) }}</strong>
            </span>
            <span>
              <AppIcon name="briefcase" :size="19" />
              <small>Yaklaşık</small>
              <strong>{{ summary.estimatedJobs }}</strong>
            </span>
          </div>
        </section>

        <div class="quick-topup-options" role="radiogroup" aria-label="Bakiye yükleme tutarları">
          <button
            v-for="offer in allVisibleOffers"
            :key="offer.id"
            :class="['quick-topup-option', { 'is-selected': selectedOfferId === offer.id }]"
            type="button"
            role="radio"
            :aria-checked="selectedOfferId === offer.id ? 'true' : 'false'"
            :data-testid="`topup-offer-${offer.id}`"
            @click="selectOffer(offer.id)"
          >
            <span class="quick-topup-radio" aria-hidden="true"></span>
            <span class="quick-topup-package-copy">
              <strong>{{ formatQuickTopUpTl(buildQuickTopUpSummary(offer).payableAmount) }} öde</strong>
              <small v-if="offer.badge">{{ offer.badge }}</small>
            </span>
            <span class="quick-topup-price">
              <template v-if="buildQuickTopUpSummary(offer).appliedBonus > 0">
                <strong>+{{ formatQuickTopUpBonus(buildQuickTopUpSummary(offer).appliedBonus) }}</strong>
                <small>Bakiyeye dönüşecek</small>
              </template>
            </span>
          </button>
        </div>

        <button
          class="quick-topup-more"
          type="button"
          data-testid="topup-more-toggle"
          :aria-expanded="moreOffersOpen ? 'true' : 'false'"
          @click="moreOffersOpen = !moreOffersOpen"
        >
          {{ moreOffersOpen ? "Diğer tutarları gizle" : "Diğer tutarları göster" }}
          <AppIcon name="chevron-right" :size="17" />
        </button>

        <section class="quick-topup-payment" aria-label="Ödeme yöntemi">
          <div class="quick-topup-section-title">Ödeme yöntemi</div>
          <div class="quick-topup-card-row">
            <span class="quick-topup-card-icon"><AppIcon name="credit-card" :size="22" /></span>
            <span class="quick-topup-card-copy">
              <strong>{{ selectedPaymentMethod.label }}</strong>
              <small>{{ selectedPaymentMethod.maskedNumber }}</small>
            </span>
            <button
              class="quick-topup-change-card"
              type="button"
              data-testid="topup-payment-change"
              @click="paymentSheetOpen = true"
            >
              Değiştir
            </button>
          </div>
        </section>

        <div class="quick-topup-sticky">
          <button
            class="quick-topup-primary"
            type="button"
            data-testid="quick-topup-submit"
            :disabled="isSubmitting"
            @click="submitTopUp"
          >
            <span>{{ primaryCtaLabel }}</span>
          </button>
          <span class="quick-topup-trust">
            <AppIcon name="lock" :size="15" />
            Güvenli ödeme · SSL korumalı
          </span>
        </div>
      </template>

      <template v-else>
        <section class="quick-topup-success" data-testid="quick-topup-success">
          <span class="quick-topup-success__icon"><AppIcon name="check" :size="42" /></span>
          <h3>Bakiye yüklendi</h3>
          <p>{{ formatQuickTopUpMoney(summary.balanceAmount) }} bakiye hesabına geçti. Yeni iş fırsatlarına kesintisiz devam edebilirsin.</p>
          <div class="quick-topup-success-summary">
            <span>Cüzdanına eklenen</span>
            <strong>{{ formatQuickTopUpMoney(summary.balanceAmount) }}</strong>
            <span>Kartından çekilen</span>
            <strong>{{ formatQuickTopUpMoney(summary.payableAmount) }}</strong>
            <span>Kullanılan bonus</span>
            <strong>{{ formatQuickTopUpMoney(summary.appliedBonus) }}</strong>
          </div>
          <button class="quick-topup-primary" type="button" data-testid="quick-topup-home" @click="finishFlow">
            <span><AppIcon name="home" :size="16" /> Ana Sayfaya Dön</span>
            <strong>{{ secondsLeft }} sn</strong>
          </button>
        </section>
      </template>
    </div>
  </AppSheet>

  <AppSheet
    :open="paymentSheetOpen"
    title="Ödeme yöntemi"
    description="Kayıtlı kartını seç."
    @close="paymentSheetOpen = false"
  >
    <div class="quick-topup-payment-sheet" data-testid="quick-topup-payment-sheet">
      <button
        v-for="method in quickTopUpPaymentMethods"
        :key="method.id"
        :class="['quick-topup-payment-option', { 'is-selected': selectedPaymentMethodId === method.id }]"
        type="button"
        :aria-pressed="selectedPaymentMethodId === method.id ? 'true' : 'false'"
        @click="selectPaymentMethod(method.id)"
      >
        <span class="quick-topup-card-icon"><AppIcon name="credit-card" :size="22" /></span>
        <span>
          <strong>{{ method.label }} {{ method.maskedNumber }}</strong>
          <small>{{ method.description }}</small>
        </span>
        <AppIcon v-if="selectedPaymentMethodId === method.id" name="check" :size="18" />
      </button>
    </div>
  </AppSheet>
</template>
