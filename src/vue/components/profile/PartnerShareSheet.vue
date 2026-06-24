<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import AppIcon from "../ui/AppIcon.vue";

const props = defineProps({
  partnerName: { type: String, default: "" },
  profileUrl: { type: String, default: "" },
  shareTitle: { type: String, default: "Lipyum profilime göz at" },
  shareText: {
    type: String,
    default: "Hizmetlerimi, rozetlerimi ve iletişim bilgilerimi Lipyum profilimde inceleyebilirsin.",
  },
});

const emit = defineEmits(["share", "error"]);

const copied = ref(false);
let copiedTimer = 0;

const resolvedProfileUrl = computed(() => {
  if (props.profileUrl) return props.profileUrl;
  if (typeof window === "undefined") return "https://lipyum.com/profil";
  return `${window.location.origin}${window.location.pathname}#/partner-card-preview`;
});

const shareMessage = computed(() => [props.shareText, resolvedProfileUrl.value].filter(Boolean).join("\n"));

const benefitCards = [
  {
    id: "free-contact",
    icon: "message",
    title: "Ücretsiz iletişim",
    description: "Sana ulaşan kişiler için ek ücret ödemezsin.",
  },
  {
    id: "visibility",
    icon: "bar-chart",
    title: "Daha fazla görünürlük",
    description: "Profilini daha çok yerde göster, güven veren bilgilerini öne çıkar.",
  },
];

const quickActions = [
  { id: "whatsapp", label: "WhatsApp", icon: "message" },
  { id: "copy", label: "Link Kopyala", icon: "clipboard" },
  { id: "social", label: "Sosyal Medya", icon: "share" },
];

function reportShare(channel, message) {
  emit("share", {
    channel,
    message,
    url: resolvedProfileUrl.value,
    partnerName: props.partnerName,
  });
}

function reportError(error) {
  emit("error", error);
}

async function copyLink() {
  try {
    if (!navigator?.clipboard) throw new Error("Clipboard API kullanılamıyor.");
    await navigator.clipboard.writeText(resolvedProfileUrl.value);
    copied.value = true;
    window.clearTimeout(copiedTimer);
    copiedTimer = window.setTimeout(() => {
      copied.value = false;
    }, 1800);
    reportShare("copy", "Profil linki kopyalandı.");
  } catch (error) {
    reportError(error);
  }
}

function shareOnWhatsApp() {
  try {
    const target = `https://wa.me/?text=${encodeURIComponent(shareMessage.value)}`;
    window.open(target, "_blank", "noopener,noreferrer");
    reportShare("whatsapp", "WhatsApp paylaşımı hazırlandı.");
  } catch (error) {
    reportError(error);
  }
}

async function shareNative() {
  try {
    if (navigator?.share) {
      await navigator.share({
        title: props.shareTitle,
        text: props.shareText,
        url: resolvedProfileUrl.value,
      });
      reportShare("native", "Sosyal medya paylaşımı hazırlandı.");
      return;
    }
    await copyLink();
    reportShare("native-fallback", "Sosyal medya için profil linki kopyalandı.");
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "AbortError")) reportError(error);
  }
}

function handleQuickAction(action) {
  if (action.id === "whatsapp") shareOnWhatsApp();
  else if (action.id === "copy") copyLink();
  else shareNative();
}

function openWebsiteEmbed() {
  reportShare("website-embed", "Web sitesinde gösterme akışı hazırlandı.");
}

function startFreeSharing() {
  reportShare("start-free-sharing", "Ücretsiz paylaşım başlatıldı.");
}

onBeforeUnmount(() => {
  window.clearTimeout(copiedTimer);
});
</script>

<template>
  <section class="v-share-options partner-share-sheet" data-testid="partner-share-options">
    <article class="partner-share-hero" data-testid="partner-share-hero">
      <div class="partner-share-hero__visual" aria-hidden="true">
        <span class="partner-share-hero__orb">
          <AppIcon name="shield" :size="46" :stroke-width="2.15" />
          <span class="partner-share-hero__check">
            <AppIcon name="check" :size="24" :stroke-width="3" />
          </span>
        </span>
      </div>
      <div class="partner-share-hero__copy">
        <h3>Profilinle güven ver, daha fazla iş al</h3>
        <p>Profilini sosyal medya ve diğer platformlarda paylaş, insanlar seninle iletişime geçebilsin.</p>
      </div>
    </article>

    <div class="partner-share-benefit-grid" aria-label="Profil paylaşım faydaları">
      <article
        v-for="benefit in benefitCards"
        :key="benefit.id"
        class="partner-share-benefit-card"
        :data-testid="`partner-share-benefit-${benefit.id}`"
      >
        <span class="partner-share-benefit-card__icon" aria-hidden="true">
          <AppIcon :name="benefit.icon" :size="23" />
        </span>
        <strong>{{ benefit.title }}</strong>
        <p>{{ benefit.description }}</p>
      </article>
    </div>

    <section class="partner-share-quick" aria-labelledby="partner-share-quick-title">
      <h3 id="partner-share-quick-title">Hızlı paylaş</h3>
      <div class="partner-share-primary-grid" aria-label="Hızlı paylaşım kanalları">
        <button
          v-for="action in quickActions"
          :key="action.id"
          class="partner-share-primary-action"
          type="button"
          :data-testid="`partner-share-option-${action.id}`"
          @click="handleQuickAction(action)"
        >
          <span class="partner-share-social-icon" :class="`is-${action.id}`" aria-hidden="true">
            <AppIcon :name="copied && action.id === 'copy' ? 'check' : action.icon" :size="25" />
          </span>
          <small>{{ copied && action.id === "copy" ? "Kopyalandı" : action.label }}</small>
        </button>
      </div>
    </section>

    <article class="partner-share-website-card" data-testid="partner-share-option-website">
      <span class="partner-share-website-card__preview" aria-hidden="true">
        <AppIcon name="user" :size="18" />
        <span></span>
      </span>
      <span class="partner-share-website-card__copy">
        <strong>Web sitende göster</strong>
        <small>Tek tıkla sana ulaşsın</small>
      </span>
      <button type="button" data-testid="partner-share-website-add" @click="openWebsiteEmbed">Ekle</button>
    </article>

    <button class="partner-share-start" type="button" data-testid="partner-share-start" @click="startFreeSharing">
      <span>
        <AppIcon name="sparkles" :size="20" />
        Ücretsiz Paylaşmaya Başla
      </span>
      <span class="partner-share-start__arrow" aria-hidden="true">
        <AppIcon name="chevron-right" :size="22" />
      </span>
    </button>
  </section>
</template>
