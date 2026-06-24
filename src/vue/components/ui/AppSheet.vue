<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import AppIcon from "./AppIcon.vue";

const props = defineProps({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  open: { type: Boolean, default: true },
});

const emit = defineEmits(["close"]);

const sheetRef = ref(null);
const bodyRef = ref(null);
const dragStartY = ref(0);
const dragOffsetY = ref(0);
const isDragging = ref(false);
const closeDragThreshold = 28;
const minSheetHeight = 220;
let resizeObserver;
let animationFrameId = 0;

function toNumber(value) {
  return Number.parseFloat(value) || 0;
}

function getVerticalMargins(node) {
  const style = window.getComputedStyle(node);
  return toNumber(style.marginTop) + toNumber(style.marginBottom);
}

function updateSheetHeight() {
  const sheet = sheetRef.value;
  const body = bodyRef.value;
  if (!props.open || !sheet || !body || typeof window === "undefined") {
    sheet?.style.removeProperty("--app-sheet-dynamic-height");
    return;
  }

  const sheetStyleValue = window.getComputedStyle(sheet);
  const maxHeight = Math.floor(Math.min(window.innerHeight * 0.94, 820));
  const shellHeight =
    toNumber(sheetStyleValue.paddingTop) +
    toNumber(sheetStyleValue.paddingBottom) +
    toNumber(sheetStyleValue.borderTopWidth) +
    toNumber(sheetStyleValue.borderBottomWidth);
  const fixedChildrenHeight = Array.from(sheet.children).reduce((total, child) => {
    if (child === body) return total;
    return total + child.getBoundingClientRect().height + getVerticalMargins(child);
  }, 0);
  const desiredHeight = Math.ceil(shellHeight + fixedChildrenHeight + body.scrollHeight + 10);
  const nextHeight = Math.max(Math.min(minSheetHeight, maxHeight), Math.min(desiredHeight, maxHeight));
  sheet.style.setProperty("--app-sheet-dynamic-height", `${nextHeight}px`);
}

function scheduleSheetMeasure() {
  if (typeof window === "undefined") return;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(updateSheetHeight);
}

function beginDrag(event) {
  isDragging.value = true;
  dragStartY.value = event.clientY;
  dragOffsetY.value = 0;
  try {
    event.currentTarget?.setPointerCapture?.(event.pointerId);
  } catch {
    // Synthetic test events may not have an active pointer capture target.
  }
}

function updateDrag(event) {
  if (!isDragging.value) return;
  dragOffsetY.value = Math.max(0, event.clientY - dragStartY.value);
}

function finishDrag() {
  if (!isDragging.value) return;
  const shouldClose = dragOffsetY.value >= closeDragThreshold;
  isDragging.value = false;
  dragStartY.value = 0;
  dragOffsetY.value = 0;
  if (shouldClose) emit("close");
}

function cancelDrag() {
  isDragging.value = false;
  dragStartY.value = 0;
  dragOffsetY.value = 0;
}

onMounted(() => {
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(scheduleSheetMeasure);
    if (sheetRef.value) resizeObserver.observe(sheetRef.value);
    if (bodyRef.value) resizeObserver.observe(bodyRef.value);
  }
  window.addEventListener("resize", scheduleSheetMeasure);
  nextTick(scheduleSheetMeasure);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("resize", scheduleSheetMeasure);
  cancelAnimationFrame(animationFrameId);
});

watch(
  () => [props.open, props.title, props.description],
  () => nextTick(scheduleSheetMeasure),
  { flush: "post" },
);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="v-app-sheet-overlay fixed inset-0 z-50 flex items-end bg-slate-950/35"
      role="presentation"
      data-testid="app-sheet-overlay"
      @click.self="emit('close')"
    >
      <section
        ref="sheetRef"
        class="v-app-sheet"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Alt panel'"
        data-testid="app-sheet"
      >
        <button
          class="v-app-sheet__handle"
          type="button"
          aria-label="Alt paneli aşağı sürükleyerek kapat"
          data-testid="app-sheet-drag-handle"
          @pointerdown="beginDrag"
          @pointermove="updateDrag"
          @pointerup="finishDrag"
          @pointercancel="cancelDrag"
          @lostpointercapture="finishDrag"
        >
          <span class="v-app-sheet__handle-bar" aria-hidden="true"></span>
        </button>
        <div class="v-app-sheet__header">
          <span class="v-app-sheet__heading">
            <h2 class="v-app-sheet__title">{{ title }}</h2>
            <p v-if="description" class="v-app-sheet__description">{{ description }}</p>
          </span>
          <button class="v-app-sheet__close" type="button" aria-label="Kapat" data-testid="sheet-close-button" @click="emit('close')">
            <AppIcon name="x" :size="20" />
          </button>
        </div>
        <div ref="bodyRef" class="v-app-sheet__body">
          <slot />
        </div>
      </section>
    </div>
  </Teleport>
</template>
