import { escapeHtml } from "../utils/dom.js";

function SupportActionItem({ item, icon = () => "" } = {}) {
  const target = item.topic
    ? `data-action="ticket-topic" data-topic="${escapeHtml(item.topic)}"`
    : `data-action="menu-placeholder" data-label="${escapeHtml(item.label || item.title)}"`;

  return `
    <button class="support-action-card ${item.dark ? "is-dark" : ""} ${item.primary ? "is-primary" : ""}" type="button" ${target} aria-label="${escapeHtml(item.title)}">
      <span class="support-action-icon">${icon(item.icon)}</span>
      <span class="support-action-copy">
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.description)}</small>
      </span>
      <span class="support-row-tail">
        ${item.badge ? `<span class="support-action-meta">${escapeHtml(item.badge)}</span>` : ""}
        ${icon("chevron-right")}
      </span>
    </button>
  `;
}

export function SupportActionList({ title = "", items = [], icon = () => "" } = {}) {
  return `
    <section class="support-action-section">
      ${title ? `<strong class="support-section-label">${escapeHtml(title)}</strong>` : ""}
      <div class="support-action-list">
        ${items.map((item) => SupportActionItem({ item, icon })).join("")}
      </div>
    </section>
  `;
}
