export function NotificationActions({ showReadNotifications = false, icon = () => "" } = {}) {
  return `
    <section class="notification-actions-bar" aria-label="Bildirim liste işlemleri">
      <button class="notification-action-btn is-muted" type="button" data-action="show-read-notifications">
        ${showReadNotifications ? "Okunanları Gizle" : "Okunanları Göster"}
      </button>
      <button class="notification-action-btn" type="button" data-action="mark-notifications-read">
        ${icon("check")} Okundu Yap
      </button>
    </section>
  `;
}
