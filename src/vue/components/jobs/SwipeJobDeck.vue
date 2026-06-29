<script setup>
import { ref, watch } from "vue";
import SwipeJobCard from "./SwipeJobCard.vue";
import { shouldAdvanceOnSwipe } from "../../data/jobSwipeModel.js";

const props = defineProps({
  job: { type: Object, default: null },
  nextJob: { type: Object, default: null },
});

const emit = defineEmits(["advance", "cta", "open-customer"]);
const dragX = ref(0);
const startX = ref(0);
const dragging = ref(false);
const activeCardRef = ref(null);

function syncDragStyle() {
  if (!activeCardRef.value) return;
  activeCardRef.value.style.setProperty("--job-swipe-drag-x", `${dragX.value}px`);
  activeCardRef.value.style.setProperty("--job-swipe-rotate", `${dragX.value * -0.015}deg`);
}

watch([dragX, activeCardRef], syncDragStyle, { immediate: true });

function onPointerDown(event) {
  if (!props.job) return;
  if (event.target?.closest?.("button")) return;
  dragging.value = true;
  startX.value = event.clientX;
  dragX.value = 0;
  event.currentTarget?.setPointerCapture?.(event.pointerId);
}

function onPointerMove(event) {
  if (!dragging.value) return;
  dragX.value = Math.min(24, event.clientX - startX.value);
}

function finishDrag() {
  if (!dragging.value) return;
  const shouldAdvance = shouldAdvanceOnSwipe(dragX.value);
  dragging.value = false;
  if (shouldAdvance) emit("advance", "swipe-left");
  dragX.value = 0;
}

function onKeydown(event) {
  if (event.key !== "ArrowLeft" && event.key !== "Backspace") return;
  event.preventDefault();
  emit("advance", "keyboard");
}
</script>

<template>
  <section class="job-swipe-deck" data-testid="job-swipe-deck">
    <div v-if="nextJob" class="job-swipe-deck__peek" aria-hidden="true">
      <SwipeJobCard :job="nextJob" is-preview />
    </div>
    <div
      v-if="job"
      ref="activeCardRef"
      class="job-swipe-deck__active"
      :class="{ 'is-dragging': dragging }"
      tabindex="0"
      role="group"
      aria-label="İş kartı. Sola kaydır veya sol ok tuşuyla sıradaki işi gör."
      @keydown="onKeydown"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="finishDrag"
      @pointercancel="finishDrag"
      @lostpointercapture="finishDrag"
    >
      <SwipeJobCard :job="job" @cta="emit('cta', $event)" @open-customer="emit('open-customer', $event)" />
    </div>
  </section>
</template>
