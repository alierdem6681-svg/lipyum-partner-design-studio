<script setup>
import { ref } from "vue";
import AppButton from "../components/ui/AppButton.vue";
import AppCard from "../components/ui/AppCard.vue";
import AppChip from "../components/ui/AppChip.vue";
import AppIcon from "../components/ui/AppIcon.vue";
import AppPage from "../components/ui/AppPage.vue";
import AppSheet from "../components/ui/AppSheet.vue";

const activeTab = ref("pool");
const activeSheet = ref(null);

const poolJobs = [
  {
    type: "Havuz",
    title: "Buzdolabı Tamiri",
    area: "Bursa / Karacabey",
    notes: ["Talep: Bugün 13:40", "Son teyit: 13:55", "Hâlâ servis istiyor: Evet", "Müşteri kaynaklı iptalde nakit iade"],
    normal: "280 kredi",
    partner: "230 kredi",
    discount: "%18 indirim",
    saving: "50 kredi",
  },
  {
    type: "Havuz",
    title: "Koltuk Yıkama",
    area: "İzmir / Bornova",
    notes: ["Talep: Bugün 12:25", "Son teyit: 12:48", "Hâlâ servis istiyor: Evet", "Nakit iade güvencesi"],
    normal: "210 kredi",
    partner: "175 kredi",
    discount: "%17 indirim",
    saving: "35 kredi",
  },
];

const offerJobs = [
  { title: "Ev Temizliği", area: "Mersin / Yenişehir", count: "2 / 5", normal: "120 kredi", partner: "90 kredi", saving: "30 kredi", time: "Bugün 11:20", budget: "₺2.000-₺2.800" },
  { title: "Ofis Fotoğraf Çekimi", area: "İstanbul / Kadıköy", count: "1 / 4", normal: "160 kredi", partner: "120 kredi", saving: "40 kredi", time: "Dün 18:10", budget: "₺5.000" },
  { title: "Şehir İçi Nakliye", area: "Ankara / Çankaya", count: "3 / 6", normal: "180 kredi", partner: "140 kredi", saving: "40 kredi", time: "Bugün 09:35", budget: "Belirtilmedi" },
];

function openSheet(title, description) {
  activeSheet.value = { title, description };
}
</script>

<template>
  <AppPage title="İş Al" class="v-jobs-page">
    <div class="v-stack">
      <div class="v-segment v-jobs-segment" role="tablist" aria-label="İş türü">
        <button type="button" class="tab-pill" :class="activeTab === 'pool' ? 'is-active' : ''" @click="activeTab = 'pool'">Havuzdaki İşler</button>
        <button type="button" class="tab-pill" :class="activeTab === 'offers' ? 'is-active' : ''" @click="activeTab = 'offers'">Teklif Verilecekler</button>
      </div>

      <section class="v-callout" :class="activeTab === 'pool' ? 'is-soft' : ''">
        <div>
          <h2>{{ activeTab === 'pool' ? 'Havuzdaki İşler' : 'Teklif Verilecekler' }}</h2>
          <p>
            {{ activeTab === 'pool'
              ? 'Kalan havuz haklarınla bekleyen işleri alabilirsin. Ücretli paketler daha fazla hak ve görünürlük sağlar.'
              : 'Kalan teklif haklarınla müşterilere dönüş yapabilirsin. Ücretli paketler daha fazla teklif fırsatı açar.' }}
          </p>
        </div>
        <AppButton v-if="activeTab === 'pool'" variant="secondary" size="sm" data-open="pool-info" @click="openSheet('Havuz nedir?', 'Havuzdaki işler, uygun partnerlerin hızlıca alabileceği hazır servis talepleridir.')">
          Havuz nedir?
        </AppButton>
      </section>

      <template v-if="activeTab === 'pool'">
        <AppCard v-for="job in poolJobs" :key="job.title" padding="md" class="v-golden-job-card" data-testid="job-card">
          <div class="v-golden-job-top">
            <div class="v-golden-job-title">
              <AppChip tone="warning">{{ job.type }}</AppChip>
              <h3>{{ job.title }}</h3>
              <p><AppIcon name="map-pin" :size="14" /> {{ job.area }}</p>
            </div>
            <AppIcon name="chevron-right" :size="18" />
          </div>
          <div class="v-golden-note-list">
            <p v-for="note in job.notes" :key="note"><AppIcon name="check" :size="14" /> {{ note }}</p>
          </div>
          <div class="v-price-box">
            <div><span>Normal</span><strong>{{ job.normal }}</strong></div>
            <div><span>Paket fiyatın</span><strong>{{ job.partner }}</strong></div>
            <div class="discount"><span>İndirim</span><strong>{{ job.discount }}</strong></div>
            <div class="save"><span>Tasarruf</span><strong>{{ job.saving }}</strong></div>
          </div>
          <div class="v-action-row">
            <AppButton full-width data-action="take-pool" @click="openSheet(job.title, 'Havuzdan alma onayı mock akışı.')">
              <AppIcon name="briefcase" :size="17" /> Havuzdan Al
            </AppButton>
            <AppButton full-width variant="secondary" data-action="detail" @click="openSheet(job.title, job.area)">
              <AppIcon name="search" :size="17" /> Detay
            </AppButton>
          </div>
        </AppCard>
      </template>

      <template v-else>
        <AppCard v-for="job in offerJobs" :key="job.title" padding="md" class="v-golden-job-card">
          <div class="v-golden-job-top">
            <div class="v-golden-job-title">
              <AppChip tone="info">Teklif</AppChip>
              <h3>{{ job.title }}</h3>
              <p><AppIcon name="map-pin" :size="14" /> {{ job.area }}</p>
            </div>
            <AppIcon name="edit" :size="18" />
          </div>
          <div class="v-golden-note-list">
            <p><AppIcon name="message" :size="14" /> Müşteri teklif toplamak istiyor</p>
            <p><AppIcon name="clock" :size="14" /> Talep zamanı: {{ job.time }}</p>
            <p><AppIcon name="users" :size="14" /> Teklif sayısı: {{ job.count }}</p>
            <p><AppIcon name="check" :size="14" /> Telefon doğrulandı</p>
            <p><AppIcon name="wallet" :size="14" /> Müşteri bütçesi: {{ job.budget }}</p>
          </div>
          <div class="v-price-box">
            <div><span>Normal</span><strong>{{ job.normal }}</strong></div>
            <div><span>Paket fiyatın</span><strong>{{ job.partner }}</strong></div>
            <div class="save"><span>Tasarruf</span><strong>{{ job.saving }}</strong></div>
            <div class="discount"><span>Kullanım</span><strong>1 teklif hakkı</strong></div>
          </div>
          <div class="v-action-row">
            <AppButton full-width data-open="offer" @click="openSheet(job.title, 'Teklif verme mock akışı.')">
              <AppIcon name="edit" :size="17" /> Teklif Ver
            </AppButton>
            <AppButton full-width variant="secondary" data-action="detail" @click="openSheet(job.title, job.area)">
              <AppIcon name="search" :size="17" /> Detay
            </AppButton>
          </div>
        </AppCard>
      </template>
    </div>

    <AppSheet v-if="activeSheet" :open="!!activeSheet" :title="activeSheet.title" :description="activeSheet.description" @close="activeSheet = null">
      <p class="v-sheet-copy">Bu V12-C mock akışında sonuç sheet içinde doğrulanır.</p>
    </AppSheet>
  </AppPage>
</template>
