<script setup>
import { ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppPage from "../components/ui/AppPage.vue";

const submitted = ref(false);
const uploadTouched = ref(false);

function submitTicket() {
  submitted.value = true;
}

function resetTicket() {
  submitted.value = false;
  uploadTouched.value = false;
}
</script>

<template>
  <AppPage title="Talep Oluştur" data-testid="support-ticket-page">
    <div class="v-stack">
      <AppCard v-if="submitted" padding="lg" data-testid="support-ticket-success">
        <div class="v-stack">
          <h2>Talep alındı</h2>
          <p>LP-000123 numaralı talebin destek ekibine iletildi.</p>
          <AppButton icon="plus" data-testid="support-ticket-new" @click="resetTicket">Yeni Talep Oluştur</AppButton>
        </div>
      </AppCard>

      <AppCard v-else padding="lg">
        <form class="v-form-grid" data-testid="support-ticket-form" @submit.prevent="submitTicket">
          <label>
            <span>Kategori</span>
            <select data-testid="support-ticket-category">
              <option>Ödeme ve abonelik</option>
              <option>Teknik Sorun</option>
              <option>İş akışı</option>
            </select>
          </label>
          <label>
            <span>Konu</span>
            <input data-testid="support-ticket-subject" type="text" value="Bakiye kullanım kontrolü" />
          </label>
          <label>
            <span>Kısa açıklama</span>
            <textarea data-testid="support-ticket-description" rows="4">Kredi kullanım hareketimde kontrol edilmesi gereken bir konu var.</textarea>
          </label>
          <label>
            <span>Öncelik</span>
            <select data-testid="support-ticket-priority">
              <option>Normal</option>
              <option value="Oncelikli">Öncelikli</option>
              <option>Öncelikli</option>
              <option>Acil</option>
            </select>
          </label>
          <button class="v-upload-placeholder" type="button" data-testid="support-ticket-upload" @click="uploadTouched = true">
            {{ uploadTouched ? "Dosya placeholder eklendi" : "Dosya placeholder" }}
          </button>
          <AppButton type="submit" icon="send" data-testid="support-ticket-submit">Yeni Talep Oluştur</AppButton>
        </form>
      </AppCard>
    </div>
  </AppPage>
</template>
