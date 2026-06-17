export function Card({ children = "", className = "", ariaLabel = "" } = {}) {
  return `
    <section class="ui-card ${className}" ${ariaLabel ? `aria-label="${ariaLabel}"` : ""}>
      ${children}
    </section>
  `;
}
