<script setup>
import AppIcon from "../ui/AppIcon.vue";

defineProps({
  showRestore: { type: Boolean, default: true },
});

const emit = defineEmits(["restore"]);
</script>

<template>
  <footer class="subscription-trust-footer" data-testid="subscription-trust-footer">
    <h3>Güvenli ve şeffaf</h3>
    <div class="subscription-trust-footer__items">
      <span><AppIcon name="check" :size="18" /> Gizli ücret yok</span>
      <button v-if="showRestore" type="button" data-testid="subscription-restore" @click="emit('restore')">
        <AppIcon name="refresh" :size="18" /> Satın alımları geri yükle
      </button>
      <span><AppIcon name="lock" :size="18" /> Koşullar ve Gizlilik</span>
    </div>
    <p>Satın alma öncesi fiyat, deneme süresi ve yenileme bilgisi açıkça gösterilir.</p>
  </footer>
</template>
