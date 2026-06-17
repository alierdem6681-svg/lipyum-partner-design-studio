export function NotificationActions({ showReadNotifications = false, icon = () => "" } = {}) {
  return `
    <section class="notification-actions-bar" aria-label="Bildirim liste işlemleri">
      <button class="notification-action-btn is-muted" type="button" data-action="show-read-notifications" data-testid="notifications-filter-all">
        ${showReadNotifications ? "Okunanları Gizle" : "Okunanları Göster"}
      </button>
      <button class="notification-action-btn" type="button" data-action="mark-notifications-read" data-testid="notifications-mark-read">
        ${icon("check")} Okundu Yap
      </button>
    </section>
  `;
}
