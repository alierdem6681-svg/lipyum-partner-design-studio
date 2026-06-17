export function renderSupportCard({ title = "Yardım ve Destek", description = "Ticket, danışman ve mesaj takibi", icon = "", action = "support" } = {}) {
  return `
    <button class="support-card" type="button" data-screen="${action}">
      ${icon ? `<span>${icon}</span>` : ""}
      <span>
        <strong>${title}</strong>
        <small>${description}</small>
      </span>
    </button>
  `;
}
