<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import AppIcon from "../ui/AppIcon.vue";
import AppSheet from "../ui/AppSheet.vue";

const props = defineProps({
  open: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "complete"]);

const formatter = new Intl.NumberFormat("tr-TR");

const packages = [
  { id: "credit-1692", credit: 1692, price: 1692, bonus: 0 },
  { id: "credit-3383", credit: 3383, price: 3293, oldPrice: 3383, bonus: 90 },
  { id: "credit-5074", credit: 5074, price: 4984, oldPrice: 5074, bonus: 90, badge: "%50 daha fazla kredi", tone: "blue" },
  { id: "credit-6765", credit: 6765, price: 6675, oldPrice: 6765, bonus: 90, badge: "En Popüler", tone: "amber" },
  { id: "credit-8457", credit: 8457, price: 8367, oldPrice: 8457, bonus: 90, badge: "En Kazançlı", tone: "green" },
];

const step = ref("select");
const selectedPackageId = ref("credit-8457");
const cardNoteOpen = ref(false);
const secondsLeft = ref(5);
let successTimer = 0;

const selectedPackage = computed(() => packages.find((item) => item.id === selectedPackageId.value) || packages[0]);
const sheetTitle = computed(() => {
  if (step.value === "secure") return "3D Güvenli Doğrulama";
  if (step.value === "success") return "Ödeme Başarılı";
  return "Kredi Yükle";
});
const sheetDescription = computed(() => {
  if (step.value === "secure") return "Bankadan gelen doğrulamayı tamamla.";
  if (step.value === "success") return "Kredin hesabına eklendi.";
  return "En uygun paketi seç, ödemeyi hızlıca tamamla.";
});

function formatNumber(value) {
  return formatter.format(value);
}

function formatMoney(value) {
  return `₺${formatter.format(value)}`;
}

function resetFlow() {
  step.value = "select";
  selectedPackageId.value = "credit-8457";
  cardNoteOpen.value = false;
  secondsLeft.value = 5;
  clearInterval(successTimer);
}

function closeSheet() {
  clearInterval(successTimer);
  emit("close");
}

function startSecureStep() {
  cardNoteOpen.value = false;
  step.value = "secure";
}

function startSuccessTimer() {
  clearInterval(successTimer);
  secondsLeft.value = 5;
  successTimer = window.setInterval(() => {
    secondsLeft.value -= 1;
    if (secondsLeft.value <= 0) finishFlow();
  }, 1000);
}

function confirmSecureStep() {
  step.value = "success";
  startSuccessTimer();
}

function finishFlow() {
  clearInterval(successTimer);
  emit("complete", selectedPackage.value);
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
    <div class="quick-topup" data-testid="quick-topup-sheet">
      <template v-if="step === 'select'">
        <div class="quick-topup-alert">
          <AppIcon name="clock" :size="16" />
          <span>Bonus oranı sınırlı süre geçerlidir.</span>
        </div>

        <div class="quick-topup-options" role="radiogroup" aria-label="Kredi paketleri">
          <button
            v-for="item in packages"
            :key="item.id"
            :class="['quick-topup-option', { 'is-selected': selectedPackageId === item.id }, item.tone ? `is-${item.tone}` : '']"
            type="button"
            role="radio"
            :aria-checked="selectedPackageId === item.id ? 'true' : 'false'"
            data-testid="topup-package-option"
            @click="selectedPackageId = item.id"
          >
            <span v-if="item.badge" class="quick-topup-badge">
              <AppIcon :name="item.tone === 'amber' ? 'star' : 'sparkles'" :size="12" />
              {{ item.badge }}
            </span>
            <span class="quick-topup-radio" aria-hidden="true"></span>
            <span class="quick-topup-package-copy">
              <strong>{{ formatNumber(item.credit) }} Kredi</strong>
              <small v-if="item.bonus">{{ formatNumber(item.bonus) }} bonus kredi dahil</small>
            </span>
            <span class="quick-topup-price">
              <strong>{{ formatMoney(item.price) }}</strong>
              <s v-if="item.oldPrice">{{ formatMoney(item.oldPrice) }} yerine</s>
            </span>
          </button>
        </div>

        <section class="quick-topup-payment" aria-label="Ödeme yöntemi">
          <div class="quick-topup-section-title">Ödeme Yöntemi</div>
          <div class="quick-topup-card-row">
            <span class="quick-topup-card-icon"><AppIcon name="credit-card" :size="23" /></span>
            <span class="quick-topup-card-copy">
              <strong>Kredi Kartı</strong>
              <small>9792 0840 9092 ****</small>
            </span>
            <button class="quick-topup-change-card" type="button" @click="cardNoteOpen = !cardNoteOpen">Değiştir</button>
          </div>
          <p v-if="cardNoteOpen" class="quick-topup-card-note">
            Kart değişimi ödeme sağlayıcısında açılacak. Bu prototipte kayıtlı güvenli kart kullanılır.
          </p>
        </section>

        <section class="quick-topup-total" aria-label="Hesaba geçecek kredi">
          <span>Hesabına Geçecek Toplam Kredi</span>
          <strong data-testid="quick-topup-total-credit">
            <AppIcon name="wallet" :size="18" />
            {{ formatNumber(selectedPackage.credit) }}
          </strong>
        </section>

        <div class="quick-topup-sticky">
          <button class="quick-topup-primary" type="button" data-testid="quick-topup-submit" @click="startSecureStep">
            <span>
              <AppIcon name="shield" :size="15" />
              {{ formatNumber(selectedPackage.credit) }} Kredi Yükle
            </span>
            <strong>
              <small v-if="selectedPackage.oldPrice">{{ formatMoney(selectedPackage.oldPrice) }}</small>
              Sadece {{ formatMoney(selectedPackage.price) }}
            </strong>
          </button>
        </div>
      </template>

      <template v-else-if="step === 'secure'">
        <section class="quick-topup-secure" data-testid="quick-topup-3d">
          <span class="quick-topup-secure__icon"><AppIcon name="shield" :size="34" /></span>
          <h3>3D doğrulama gerekli</h3>
          <p>Bankandan gelen onayı tamamladığında kredi hemen hesabına geçer.</p>
          <div class="quick-topup-secure-summary">
            <span>
              <small>Paket</small>
              <strong>{{ formatNumber(selectedPackage.credit) }} Kredi</strong>
            </span>
            <span>
              <small>Bugün ödenecek</small>
              <strong>{{ formatMoney(selectedPackage.price) }}</strong>
            </span>
            <span>
              <small>Kart</small>
              <strong>**** 9092</strong>
            </span>
          </div>
          <button class="quick-topup-primary" type="button" data-testid="quick-topup-3d-confirm" @click="confirmSecureStep">
            <span><AppIcon name="check" :size="16" /> Doğrulamayı Tamamla</span>
            <strong>{{ formatMoney(selectedPackage.price) }}</strong>
          </button>
          <button class="quick-topup-secondary" type="button" @click="step = 'select'">Geri dön</button>
        </section>
      </template>

      <template v-else>
        <section class="quick-topup-success" data-testid="quick-topup-success">
          <span class="quick-topup-success__icon"><AppIcon name="check" :size="42" /></span>
          <h3>Bakiye yüklendi</h3>
          <p>{{ formatNumber(selectedPackage.credit) }} kredi hesabına eklendi. Yeni iş fırsatlarında kesinti yaşamadan devam edebilirsin.</p>
          <div class="quick-topup-success-summary">
            <span>Hesabına geçen kredi</span>
            <strong>{{ formatNumber(selectedPackage.credit) }}</strong>
          </div>
          <button class="quick-topup-primary" type="button" data-testid="quick-topup-home" @click="finishFlow">
            <span><AppIcon name="home" :size="16" /> Ana Sayfaya Dön</span>
            <strong>{{ secondsLeft }} sn</strong>
          </button>
        </section>
      </template>
    </div>
  </AppSheet>
</template>
