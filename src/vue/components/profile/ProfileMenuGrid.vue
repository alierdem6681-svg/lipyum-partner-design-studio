<script setup>
import { useRouter } from "vue-router";
import AppIcon from "../ui/AppIcon.vue";

const router = useRouter();

const items = [
  { title: "Hakkımda", body: "Uzmanlık ve çalışma yaklaşımı.", icon: "user", route: "/about" },
  { title: "Fotoğraflarım", body: "Öncesi, sonrası ve ekip görselleri.", icon: "image", route: "/photo-gallery" },
  { title: "Hizmetlerim", body: "Aktif hizmet kategorileri.", icon: "briefcase", route: "/services" },
  { title: "Bölgelerim", body: "İlçe ve mahalle kapsaması.", icon: "map-pin", route: "/regions" },
  { title: "Saatlerim", body: "İş kabul saatleri.", icon: "clock", route: "/working-hours" },
  { title: "Ekibim", body: "Saha ekibi ve roller.", icon: "users", route: "/team" },
  { title: "Kapasitem", body: "Günlük iş alma sınırı.", icon: "bar-chart", route: "/capacity" },
  { title: "Stratejim", body: "Büyüme önerileri.", icon: "target", route: "/strategy" },
];
</script>

<template>
  <section class="v-profile-menu" data-testid="profile-menu-section">
    <button
      v-for="item in items"
      :key="item.route"
      class="v-profile-menu__item"
      type="button"
      data-testid="profile-menu-card"
      @click="router.push(item.route)"
    >
      <span><AppIcon :name="item.icon" :size="20" /></span>
      <strong>{{ item.title }}</strong>
      <small>{{ item.body }}</small>
    </button>
  </section>
</template>
