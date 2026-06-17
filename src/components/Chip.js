export function Chip({ label, tone = "neutral", icon = "", selected = false } = {}) {
  return `
    <span class="ui-chip ui-chip--${tone} ${selected ? "is-selected" : ""}">
      ${icon}${label}
    </span>
  `;
}
