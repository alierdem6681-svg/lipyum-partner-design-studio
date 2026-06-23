<script setup>
defineProps({
  planTitle: { type: String, default: "Plus" },
  monthlyPrice: { type: Number, default: 499 },
});
</script>

<template>
  <section class="subscription-timeline-card" data-testid="subscription-trial-timeline">
    <h3>Ne zaman ödeme yaparsın?</h3>
    <ol class="subscription-timeline">
      <li>
        <span class="subscription-timeline__dot"></span>
        <strong>Bugün</strong>
        <p>{{ planTitle }} özellikleri hemen açılır.</p>
      </li>
      <li>
        <span class="subscription-timeline__dot"></span>
        <strong>28. gün</strong>
        <p>Denemen bitmeden hatırlatırız.</p>
      </li>
      <li>
        <span class="subscription-timeline__dot is-final"></span>
        <strong>30. gün</strong>
        <p>{{ monthlyPrice }} TL/ay olarak yenilenir.</p>
      </li>
    </ol>
  </section>
</template>
