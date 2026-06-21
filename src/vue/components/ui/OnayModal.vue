<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "Emin misin?" },
  message: { type: String, default: "Bu işlemi onaylıyor musun?" },
  confirmLabel: { type: String, default: "Onayla" },
  cancelLabel: { type: String, default: "Vazgeç" },
  danger: { type: Boolean, default: false },
});

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="onay-modal-overlay" role="presentation" data-testid="onay-modal-overlay" @click.self="emit('cancel')">
      <section
        class="onay-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        data-testid="onay-modal"
      >
        <div class="onay-modal__header">
          <h2>{{ title }}</h2>
          <p>{{ message }}</p>
        </div>
        <div class="onay-modal__actions">
          <button class="onay-modal__button is-cancel" type="button" data-testid="onay-modal-cancel" @click="emit('cancel')">
            {{ cancelLabel }}
          </button>
          <button
            class="onay-modal__button is-confirm"
            :class="{ 'is-danger': danger }"
            type="button"
            data-testid="onay-modal-confirm"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
