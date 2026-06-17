import { BackButton } from "./BackButton.js";

export function Header({
  title,
  subtitle = "",
  showBack = true,
  rightAction = "",
  backIcon = "",
  variant = showBack ? "subpage" : "section",
} = {}) {
  return `
    <header class="page-header" data-testid="app-header" data-header-variant="${variant}">
      ${showBack ? BackButton({ icon: backIcon }) : '<span class="page-header-spacer" aria-hidden="true"></span>'}
      <div class="page-header-copy">
        <h1>${title}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
      </div>
      ${rightAction || '<span class="page-header-spacer page-header-spacer--right" aria-hidden="true"></span>'}
    </header>
  `;
}
