<script setup>
defineProps({
  showRestore: { type: Boolean, default: true },
});

const emit = defineEmits(["restore"]);
</script>

<template>
  <footer class="subscription-trust-footer" data-testid="subscription-trust-footer">
    <p>İstediğin zaman iptal et. Satın alma öncesi fiyat ve yenileme bilgisi açıkça gösterilir.</p>
    <div>
      <button v-if="showRestore" type="button" data-testid="subscription-restore" @click="emit('restore')">
        Satın alımları geri yükle
      </button>
      <button type="button">Koşullar</button>
      <button type="button">Gizlilik</button>
    </div>
  </footer>
</template>
