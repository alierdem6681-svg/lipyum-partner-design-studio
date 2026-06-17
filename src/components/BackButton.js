export function BackButton({ label = "Geri dön", icon = "" } = {}) {
  return `
    <button class="back-btn" type="button" data-action="go-back" data-testid="back-button" aria-label="${label}">
      ${icon || '<svg class="icon"><use href="#i-chevron-left"></use></svg>'}
    </button>
  `;
}
