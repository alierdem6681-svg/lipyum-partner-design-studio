export function MenuList({ title = "", items = [], icon = (name) => name } = {}) {
  return `
    <section class="menu-list">
      ${title ? `<h2 class="menu-list-title">${title}</h2>` : ""}
      <div class="menu-list-card">
        ${items.map((item) => `
          <button
            class="menu-list-row"
            type="button"
            ${item.route ? `data-route="${item.route}"` : ""}
            ${item.screen ? `data-screen="${item.screen}"` : ""}
            ${item.action ? `data-action="${item.action}"` : ""}
            ${item.disabled ? "disabled aria-disabled=\"true\"" : ""}
          >
            <span class="menu-list-icon" style="${item.color ? `--menu-color:${item.color}` : ""}">${icon(item.icon || "chevron-right")}</span>
            <span class="menu-list-copy">
              <strong>${item.label}</strong>
              ${item.description ? `<small>${item.description}</small>` : ""}
            </span>
            ${item.badge ? `<em class="menu-list-badge">${item.badge}</em>` : ""}
            ${icon("chevron-right")}
          </button>
        `).join("")}
      </div>
    </section>
  `;
}
