import { BackButton } from "./BackButton.js";

export function Header({
  title,
  subtitle = "",
  showBack = true,
  rightAction = "",
  backIcon = "",
  variant = showBack ? "subpage" : "section",
} = {}) {
  const fallbackRightAction = `
    <button class="icon-btn icon-only-btn page-header-action" type="button" data-action="header-info" data-testid="header-info-button" aria-label="Sayfa bilgisi">
      <svg class="icon"><use href="#i-help-circle"></use></svg>
    </button>
  `;

  return `
    <header class="page-header" data-testid="app-header" data-header-variant="${variant}">
      ${showBack ? BackButton({ icon: backIcon }) : '<span class="page-header-spacer" aria-hidden="true"></span>'}
      <div class="page-header-copy">
        <h1>${title}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
      </div>
      ${rightAction || fallbackRightAction}
    </header>
  `;
}
