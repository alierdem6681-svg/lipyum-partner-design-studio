export function BackButton({ label = "Geri dön", icon = "" } = {}) {
  return `
    <button class="back-btn" type="button" data-action="go-back" aria-label="${label}">
      ${icon}
    </button>
  `;
}
