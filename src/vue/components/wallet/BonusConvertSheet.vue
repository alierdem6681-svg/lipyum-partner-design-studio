<script setup>
import { computed, ref } from "vue";
import AppIcon from "../ui/AppIcon.vue";

const emit = defineEmits(["complete"]);

const selectedMode = ref("");
const bonusAmount = 240;
const cashAmount = 78;
const requiredTopUp = 7200;
const totalBalance = requiredTopUp + bonusAmount;

const formatter = new Intl.NumberFormat("tr-TR");

const summary = computed(() => {
  if (selectedMode.value === "topup") {
    return {
      label: "Cüzdana geçecek tutar",
      value: `${formatter.format(totalBalance)} TL`,
      note: `${formatter.format(requiredTopUp)} TL yükleme + ${formatter.format(bonusAmount)} TL bonus`,
    };
  }
  if (selectedMode.value === "cash") {
    return {
      label: "Cüzdana geçecek tutar",
      value: `${formatter.format(cashAmount)} TL`,
      note: `${formatter.format(bonusAmount)} bonus nakit bakiyeye çevrilir`,
    };
  }
  return {
    label: "Cüzdana geçecek tutar",
    value: "Seçim yap",
    note: "Bonusunu nasıl kullanmak istediğini seç.",
  };
});

const ctaCopy = computed(() => {
  if (selectedMode.value === "topup") {
    return {
      title: "Bonusu kullan",
      note: `${formatter.format(requiredTopUp)} TL bakiye yükleyerek tüm bonuslarımı kullan`,
    };
  }
  if (selectedMode.value === "cash") {
    return {
      title: "Nakit istiyorum",
      note: `${formatter.format(bonusAmount)} bonusu ${formatter.format(cashAmount)} TL bakiye olarak aktar`,
    };
  }
  return {
    title: "Seçenek belirle",
    note: "Devam etmek için bir kullanım yöntemi seç.",
  };
});

function complete() {
  if (!selectedMode.value) return;
  emit("complete", {
    mode: selectedMode.value,
    bonusAmount,
    cashAmount,
    requiredTopUp,
    totalBalance,
  });
}
</script>

<template>
  <div class="bonus-convert-flow" data-testid="bonus-convert-flow">
    <button
      type="button"
      :class="['bonus-choice-card', { 'is-selected': selectedMode === 'topup' }]"
      data-testid="bonus-convert-topup"
      :aria-pressed="selectedMode === 'topup'"
      @click="selectedMode = 'topup'"
    >
      <span class="bonus-choice-icon">
        <AppIcon name="wallet" :size="21" />
      </span>
      <span class="bonus-choice-copy">
        <strong>Tamamını bakiyeye ekle</strong>
        <small>Bonusun tamamını kullanmak için bakiye yükle.</small>
      </span>
    </button>

    <p v-if="selectedMode === 'topup'" class="bonus-choice-detail" data-testid="bonus-convert-topup-detail">
      240 TL bonusun tamamını kullanmak için hesabınıza 7200 TL bakiye yüklemeniz gerekiyor. Böylece 7.200 TL + 240 TL olacak şekilde hesabınıza 7440 TL geçecek ve bonus sıfırlanacaktır.
    </p>

    <button
      type="button"
      :class="['bonus-choice-card', { 'is-selected': selectedMode === 'cash' }]"
      data-testid="bonus-convert-cash"
      :aria-pressed="selectedMode === 'cash'"
      @click="selectedMode = 'cash'"
    >
      <span class="bonus-choice-icon">
        <AppIcon name="refresh" :size="21" />
      </span>
      <span class="bonus-choice-copy">
        <strong>Nakit istiyorum</strong>
        <small>Bonusunu performans oranına göre nakit bakiyeye aktar.</small>
      </span>
    </button>

    <p v-if="selectedMode === 'cash'" class="bonus-choice-detail" data-testid="bonus-convert-cash-detail">
      240 Bonus cüzdanına 78 TL bakiye olarak aktarılacaktır.
    </p>

    <section class="bonus-wallet-result" data-testid="bonus-convert-summary">
      <span>{{ summary.label }}</span>
      <strong>{{ summary.value }}</strong>
      <small>{{ summary.note }}</small>
    </section>

    <button class="bonus-convert-cta" type="button" :disabled="!selectedMode" data-testid="bonus-convert-cta" @click="complete">
      <span>{{ ctaCopy.title }}</span>
      <small>{{ ctaCopy.note }}</small>
    </button>
  </div>
</template>
