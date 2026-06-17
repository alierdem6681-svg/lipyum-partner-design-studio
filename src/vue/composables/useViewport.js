import { computed, onBeforeUnmount, onMounted, ref } from "vue";

export function useViewport() {
  const width = ref(typeof window === "undefined" ? 390 : window.innerWidth);
  const height = ref(typeof window === "undefined" ? 844 : window.innerHeight);

  const update = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => {
    update();
    window.addEventListener("resize", update, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", update);
  });

  return {
    width,
    height,
    isCompact: computed(() => width.value <= 370),
  };
}
