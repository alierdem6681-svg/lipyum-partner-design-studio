<script setup>
import { computed } from "vue";
import AppIcon from "../ui/AppIcon.vue";

const props = defineProps({
  status: { type: String, default: "normal" },
  jobLabel: { type: String, default: "" },
});

const copy = computed(() => {
  if (props.status === "zero") {
    return {
      icon: "alert",
      title: "İş alabilmek için bakiye yükle.",
      body: "Bakiyen sıfır olduğu için yeni iş fırsatlarını satın alamazsın.",
      tone: "danger",
    };
  }
  if (props.status === "low") {
    return {
      icon: "alert",
      title: "Bakiyen azalıyor",
      body: "Yaklaşık 1 iş daha alabilirsin.",
      tone: "warning",
    };
  }
  return {
    icon: "check",
    title: "İş alabilirsin",
    body: `Bakiyen ${props.jobLabel} için yeterli.`,
    tone: "success",
  };
});
</script>

<template>
  <section :class="['wallet-status-banner', `is-${copy.tone}`]" data-testid="wallet-status-banner">
    <span class="wallet-status-banner__icon" aria-hidden="true">
      <AppIcon :name="copy.icon" :size="18" />
    </span>
    <span>
      <strong>{{ copy.title }}</strong>
      <small>{{ copy.body }}</small>
    </span>
  </section>
</template>

