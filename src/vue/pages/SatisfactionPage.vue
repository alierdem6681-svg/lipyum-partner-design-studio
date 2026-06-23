<script setup>
import { ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const rating = ref(0);
const storeReviewDone = ref(false);
const feedbackDone = ref(false);
const reason = ref("Destek süreci");
const comment = ref("");

function selectRating(value) {
  rating.value = value;
  storeReviewDone.value = false;
  feedbackDone.value = false;
}
</script>

<template>
  <AppPage title="Memnuniyet" class="satisfaction-page" data-testid="satisfaction-page">
    <div class="v-stack satisfaction-flow">
      <AppCard class="satisfaction-card" padding="lg">
        <div class="satisfaction-card__intro">
          <AppIcon name="star" :size="24" />
          <div>
            <h2>Deneyimini puanla</h2>
            <p>Geri bildirimin, destek ve hizmet kalitesini iyileştirmemize yardımcı olur.</p>
          </div>
        </div>

        <div class="satisfaction-stars" aria-label="Memnuniyet puanı">
          <button
            v-for="value in 5"
            :key="value"
            type="button"
            :class="['satisfaction-star', { 'is-active': rating >= value }]"
            :aria-label="`${value} yıldız`"
            :aria-pressed="rating === value"
            @click="selectRating(value)"
          >
            ★
          </button>
        </div>
      </AppCard>

      <AppCard v-if="rating === 5 && !storeReviewDone" class="satisfaction-result-card" padding="lg" data-testid="store-review-panel">
        <h2>Teşekkür ederiz</h2>
        <p>Yorum yalnızca sen onaylarsan mağazaya yönlendirilir. İstersen kısa bir değerlendirme bırakabilirsin.</p>
        <AppButton full-width data-testid="store-review-cta" @click="storeReviewDone = true">
          Mağaza yorumunu aç
        </AppButton>
      </AppCard>

      <AppCard v-if="storeReviewDone" class="satisfaction-result-card" padding="lg" data-testid="store-review-success">
        <h2>Yorum adımı hazır</h2>
        <p>Onayın olmadan hiçbir yorum paylaşılmaz.</p>
      </AppCard>

      <AppCard v-if="rating > 0 && rating < 5 && !feedbackDone" class="satisfaction-result-card" padding="lg" data-testid="satisfaction-improvement-form">
        <h2>Nasıl iyileştirelim?</h2>
        <label>
          <span>Konu</span>
          <select v-model="reason" data-testid="satisfaction-reason">
            <option>Destek süreci</option>
            <option>Uygulama kullanımı</option>
            <option>İş akışı</option>
          </select>
        </label>
        <label>
          <span>Kısa not</span>
          <textarea v-model="comment" data-testid="satisfaction-comment" rows="3" placeholder="Kısaca yaz" />
        </label>
        <AppButton full-width data-testid="satisfaction-submit" @click="feedbackDone = true">
          Gönder
        </AppButton>
      </AppCard>

      <AppCard v-if="feedbackDone" class="satisfaction-result-card" padding="lg" data-testid="satisfaction-success">
        <h2>Geri bildirimin alındı</h2>
        <p>Ekibimiz bu kaydı iyileştirme notu olarak değerlendirecek.</p>
      </AppCard>
    </div>
  </AppPage>
</template>
