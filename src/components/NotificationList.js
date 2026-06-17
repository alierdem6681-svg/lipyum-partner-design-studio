import { NotificationCard } from "./NotificationCard.js";

export function NotificationList({
  items = [],
  visibleCount = 7,
  showMoreIndicator = false,
} = {}) {
  const visibleItems = items.slice(0, Math.min(visibleCount, items.length));

  if (!visibleItems.length) {
    return `
      <section class="notification-empty" aria-label="Boş bildirim kutusu">
        <span>
          <strong>Bildirim kutun temiz</strong>
          <small>Yeni iş, cüzdan ve destek bildirimleri burada görünür.</small>
        </span>
      </section>
    `;
  }

  return `
    <section class="notification-list" aria-label="Bildirim listesi">
      ${visibleItems.map((item) => NotificationCard({ item, isRead: item.isRead })).join("")}
      <div class="notification-load-note" data-notification-load-note data-complete="${visibleItems.length < items.length ? "false" : "true"}" aria-hidden="true"></div>
      ${showMoreIndicator ? `<div class="notification-more-indicator" aria-hidden="true"><span></span></div>` : ""}
    </section>
  `;
}
