import { Header } from "../components/Header.js";
import { NotificationActions } from "../components/NotificationActions.js";
import { NotificationList } from "../components/NotificationList.js";
import { PageContainer } from "../components/PageContainer.js";
import { notifications } from "../data/mockData.js";

export function NotificationsPage({ state = {}, icon = () => "" } = {}) {
  const readIds = new Set(state.notificationReadIds || []);
  const allItems = state.notificationsCleared
    ? []
    : notifications.map((item) => ({
      ...item,
      isRead: !item.unread || readIds.has(item.id),
    }));
  const showReadNotifications = Boolean(state.showReadNotifications);
  const displayedItems = showReadNotifications ? allItems : allItems.filter((item) => !item.isRead);
  const hasHiddenReadItems = allItems.some((item) => item.isRead);
  const visibleCount = state.notificationVisibleCount || 7;
  const showMoreIndicator = displayedItems.length > visibleCount || (!showReadNotifications && hasHiddenReadItems);

  return PageContainer({
    className: "notifications-page",
    children: `
      <span class="sr-only" data-testid="notifications-page">Bildirimler</span>
      ${Header({
        title: "Bildirimler",
        subtitle: "Önemli gelişmeler için bildirimleri takip et",
        rightAction: `
          <button class="notification-more-btn" type="button" data-open="notification-menu" aria-label="Bildirim seçenekleri">
            <span></span><span></span><span></span>
          </button>
        `,
      })}
      ${NotificationActions({ showReadNotifications, icon })}
      ${NotificationList({ items: displayedItems, visibleCount, showMoreIndicator })}
    `,
  });
}
