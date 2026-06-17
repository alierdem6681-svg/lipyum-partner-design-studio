export function Button({
  label,
  variant = "primary",
  icon = "",
  action = "",
  route = "",
  disabled = false,
  extraClass = "",
} = {}) {
  return `
    <button
      class="ui-btn ui-btn--${variant} ${extraClass}"
      type="button"
      ${action ? `data-action="${action}"` : ""}
      ${route ? `data-route="${route}"` : ""}
      ${disabled ? "disabled aria-disabled=\"true\"" : ""}
    >
      ${icon}${label ? `<span>${label}</span>` : ""}
    </button>
  `;
}
