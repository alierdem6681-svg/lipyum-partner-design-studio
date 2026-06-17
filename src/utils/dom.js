export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export function renderInto(target, html) {
  const element = typeof target === "string" ? qs(target) : target;
  if (!element) return null;
  element.innerHTML = html;
  return element;
}

export function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function fitTextToContainer(root = document) {
  const labels = qsa("[data-fit-text]", root);
  labels.forEach((label) => {
    const min = Number(label.dataset.fitMin || 11);
    const max = Number(label.dataset.fitMax || parseFloat(getComputedStyle(label).fontSize) || 14);
    label.style.fontSize = `${max}px`;

    let next = max;
    while (label.scrollWidth > label.clientWidth && next > min) {
      next -= 0.5;
      label.style.fontSize = `${next}px`;
    }
  });
}
