<script setup>
defineProps({
  store: { type: Object, required: true },
});
</script>

<template>
  <section class="subscription-reset-shell" data-testid="subscription-free-state">
    <div class="subscription-reset-shell__inner" data-testid="subscription-reset-shell">
      <h2>Abonelik ekranı temizlendi</h2>
      <p>Yeni mobil abonelik tasarımı temiz başlangıç üzerinden kurulacak.</p>
    </div>
  </section>
</template>
