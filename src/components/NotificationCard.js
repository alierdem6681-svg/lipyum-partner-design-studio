import { escapeHtml } from "../utils/dom.js";

export function NotificationCard({ item, isRead = false } = {}) {
  const tone = item.tone || "neutral";
  const label = item.actionLabel || "Gör";
  return `
    <button
      class="notification-card-row ${isRead ? "is-read" : "is-unread"} is-${tone}"
      type="button"
      data-action="open-notification"
      data-notification-id="${escapeHtml(item.id)}"
      data-notification-screen="${escapeHtml(item.screen || "home")}"
      aria-label="${escapeHtml(item.title)}"
    >
      <span class="notification-card-copy">
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.description)}</small>
      </span>
      ${tone === "warning" ? `<span class="notification-card-cta">${escapeHtml(label)}</span>` : ""}
    </button>
  `;
}
