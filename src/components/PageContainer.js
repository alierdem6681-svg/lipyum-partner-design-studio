export function PageContainer({ children = "", className = "", labelledBy = "" } = {}) {
  return `
    <div class="page-container ${className}" ${labelledBy ? `aria-labelledby="${labelledBy}"` : ""}>
      ${children}
    </div>
  `;
}
