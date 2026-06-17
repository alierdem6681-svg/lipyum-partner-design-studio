export function Badge({ label, tone = "neutral", icon = "" } = {}) {
  return `<span class="ui-badge ui-badge--${tone}">${icon}${label}</span>`;
}
