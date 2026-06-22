<script setup>
import AppButton from "../ui/AppButton.vue";

defineProps({
  plan: { type: Object, required: true },
  statusLabel: { type: String, default: "Aktif" },
  renewalCopy: { type: String, default: "" },
  platform: { type: String, default: "App Store" },
  tone: { type: String, default: "success" },
});

const emit = defineEmits(["manage"]);
</script>

<template>
  <section :class="['subscription-current', `is-${tone}`]" data-testid="subscription-current-card">
    <span class="subscription-current__status">{{ statusLabel }}</span>
    <div class="subscription-current__headline">
      <strong>Lipyum {{ plan.title }}</strong>
      <span>{{ plan.monthlyPrice }} TL / ay</span>
    </div>
    <dl>
      <div>
        <dt>Durum</dt>
        <dd>{{ statusLabel }}</dd>
      </div>
      <div>
        <dt>Yenileme</dt>
        <dd>{{ renewalCopy }}</dd>
      </div>
      <div>
        <dt>Ödeme</dt>
        <dd>{{ platform }}</dd>
      </div>
    </dl>
    <AppButton variant="secondary" full-width data-testid="subscription-manage" @click="emit('manage')">
      ABONELİĞİ YÖNET
    </AppButton>
  </section>
</template>
