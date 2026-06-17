export function renderStatusPill({ active = true, title = "Durum: Aktif", detail = "675 kredi ≈ 2-3 iş", icon = "" } = {}) {
  return `
    <div class="status-pill ${active ? "is-active" : "is-passive"}" role="status">
      ${icon ? `<span class="status-pill-icon">${icon}</span>` : ""}
      <span class="status-pill-copy">
        <strong>${title}</strong>
        <small>${detail}</small>
      </span>
    </div>
  `;
}
