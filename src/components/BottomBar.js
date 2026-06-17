export function renderBottomBar({
  items = [],
  activeScreen = "home",
  ctaVariant = "home",
  icon,
  badgeSnapshot = new Map(),
} = {}) {
  const renderIcon = (item) => item.featured
    ? `<span class="cta-lightning-wrap" aria-hidden="true">${icon(item.icon)}</span>`
    : icon(item.icon);

  const html = items
    .map((item) => {
      const oldBadge = badgeSnapshot.get(item.id);
      const badgeChanged = item.badge && oldBadge !== undefined && oldBadge !== item.badge;
      const badgeClass = badgeChanged ? " is-updating" : "";
      const active = activeScreen === item.id;

      return `
        <button
          class="bottom-item ${active ? "active" : ""} ${item.featured ? `featured cta-fab cta-fab--${ctaVariant}` : ""}"
          type="button"
          data-screen="${item.id}"
          aria-label="${item.label}"
          ${active ? 'aria-current="page"' : ""}
        >
          ${renderIcon(item)}
          <span data-fit-text data-fit-min="11" data-fit-max="12">${item.label}</span>
          ${item.badge ? `<em class="bottom-badge${badgeClass}">${item.badge}</em>` : ""}
        </button>
      `;
    })
    .join("");

  items.forEach((item) => {
    if (item.badge) badgeSnapshot.set(item.id, item.badge);
    else badgeSnapshot.delete(item.id);
  });

  return html;
}
