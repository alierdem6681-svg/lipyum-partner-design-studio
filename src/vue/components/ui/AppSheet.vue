<script setup>
import { ref } from "vue";
import AppIcon from "./AppIcon.vue";

defineProps({
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  open: { type: Boolean, default: true },
});

const emit = defineEmits(["close"]);

const dragStartY = ref(0);
const dragOffsetY = ref(0);
const isDragging = ref(false);

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
  const shouldClose = dragOffsetY.value >= 64;
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
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="v-app-sheet-overlay fixed inset-0 z-50 flex items-end bg-slate-950/35"
      role="presentation"
      data-testid="app-sheet-overlay"
    >
      <section
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
        <div class="v-app-sheet__body">
          <slot />
        </div>
      </section>
    </div>
  </Teleport>
</template>
