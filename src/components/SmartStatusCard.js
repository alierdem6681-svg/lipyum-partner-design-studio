export function renderSmartStatusCard({ title = "Hazırsın", description = "Yeni iş geldiğinde bildirim alırsın.", actionLabel = "", action = "" } = {}) {
  return `
    <section class="smart-status-card">
      <div>
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
      ${actionLabel ? `<button class="ui-btn ui-btn--primary" type="button" data-action="${action}">${actionLabel}</button>` : ""}
    </section>
  `;
}
