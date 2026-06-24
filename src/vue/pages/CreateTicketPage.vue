<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";

const router = useRouter();
const submitted = ref(false);
const uploadTouched = ref(false);
const category = ref("İş İtirazı");
const priority = ref("Normal");
const ticketCategories = ["İş İtirazı", "Ödeme Sorunu", "Bonus Sorunu", "Müşteri Sorunu", "Teknik Sorun"];
const priorityOptions = [
  { label: "Normal", value: "Normal" },
  { label: "Öncelikli", value: "Oncelikli" },
  { label: "Öncelikli", value: "Öncelikli" },
  { label: "Acil", value: "Acil" },
];

function submitTicket() {
  submitted.value = true;
}

function resetTicket() {
  submitted.value = false;
  uploadTouched.value = false;
}
</script>

<template>
  <AppPage title="Talep Oluştur" class="support-new-page" data-testid="support-ticket-page">
    <AppCard class="ticket-hero-card">
      <span class="ticket-hero-icon" aria-hidden="true">
        <AppIcon :name="submitted ? 'check' : 'file-text'" :size="22" />
      </span>
      <span>
        <strong>{{ submitted ? "Talep takipte" : "Hızlı destek talebi" }}</strong>
        <small>
          {{ submitted ? "Talebin oluşturuldu; ekibimiz konuya dönecek." : "Kategori, kısa konu ve öncelik seçerek destek kaydı aç." }}
        </small>
      </span>
    </AppCard>

    <AppCard v-if="submitted" class="ticket-success-card" data-testid="support-ticket-success">
      <span class="ticket-success-icon"><AppIcon name="check" :size="22" /></span>
      <h2>Talebin oluşturuldu</h2>
      <p>Ekibimiz konuyu takip edecek. Talep numaran:</p>
      <strong>LP-000123</strong>
      <AppButton class="primary-btn" icon="plus" data-testid="support-ticket-new" @click="resetTicket">
        Yeni Talep Oluştur
      </AppButton>
      <AppButton class="secondary-btn" variant="secondary" icon="message" @click="router.push('/support/live')">
        Canlı desteğe geç
      </AppButton>
    </AppCard>

    <AppCard v-else as="form" class="ticket-form-card" data-testid="support-ticket-form" @submit.prevent="submitTicket">
      <label>
        <span>Kategori</span>
        <select v-model="category" data-testid="support-ticket-category" name="category">
          <option v-for="item in ticketCategories" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <label>
        <span>Konu</span>
        <input data-testid="support-ticket-subject" name="subject" type="text" value="Bakiye kullanım kontrolü" placeholder="Kısaca konuyu yaz" />
      </label>
      <label>
        <span>Açıklama</span>
        <textarea data-testid="support-ticket-description" name="description" rows="4" placeholder="Detayı yaz">Kredi kullanım hareketimde kontrol edilmesi gereken bir konu var.</textarea>
      </label>
      <label>
        <span>Öncelik</span>
        <select v-model="priority" data-testid="support-ticket-priority" name="priority">
          <option v-for="item in priorityOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </label>
      <button class="ticket-upload-placeholder" type="button" data-action="mock-upload" data-testid="support-ticket-upload" @click="uploadTouched = true">
        <AppIcon name="plus" :size="18" />
        <span>{{ uploadTouched ? "Dosya placeholder eklendi" : "Dosya veya ekran görüntüsü ekle" }}</span>
      </button>
      <AppButton class="primary-btn" type="submit" data-testid="support-ticket-submit">Talep Oluştur</AppButton>
    </AppCard>
  </AppPage>
</template>
