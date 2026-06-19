<script setup>
const strengths = [
  { label: "Profil skoru", value: "81" },
  { label: "Görünürlük", value: "Yüksek" },
  { label: "Yanıt hızı", value: "İyi" },
];
</script>

<template>
  <section class="v-profile-strength-card">
    <div>
      <h2>Profil gücü</h2>
      <p>Güven kartı, hizmet bilgisi ve hızlı dönüş sinyalleri iyi seviyede.</p>
    </div>
    <div class="v-profile-strength-card__grid">
      <span v-for="item in strengths" :key="item.label">
        <small>{{ item.label }}</small>
        <strong>{{ item.value }}</strong>
      </span>
    </div>
  </section>
</template>
