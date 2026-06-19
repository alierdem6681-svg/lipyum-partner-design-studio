<script setup>
import PartnerProfileCard from "../profile/PartnerProfileCard.vue";
</script>

<template>
  <PartnerProfileCard variant="drawer" />

  <section class="drawer-work-status-card is-working" aria-label="Çalışma durumu">
    <div class="row">
      <span class="drawer-status-copy">
        <strong>Çalışma Durumu</strong>
        <small>Aktif</small>
      </span>
      <button class="toggle is-on" type="button" id="dispatchToggle" aria-label="Çalışma durumu" aria-pressed="true">
        <span></span>
      </button>
    </div>
  </section>
</template>
