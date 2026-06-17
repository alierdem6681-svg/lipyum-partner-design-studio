import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

const routes = ["/home", "/profile", "/support/new", "/support/live", "/partner-card-preview", "/notifications"];

test("V10 critical labels stay single-line", async ({ page }) => {
  const errors = await collectConsoleErrors(page);

  for (const route of routes) {
    await page.goto(`/#${route}`);
    await waitForApp(page);
    const offenders = await page.evaluate(() => {
      const selector = [
        ".app-title h2",
        ".page-header h1",
        ".page-header p",
        ".bottom-label",
        ".drawer-menu-copy strong",
        ".partner-profile-action",
        ".primary-btn",
        ".secondary-btn",
      ].join(",");
      return Array.from(document.querySelectorAll(selector))
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return false;
          const style = window.getComputedStyle(element);
          if (style.whiteSpace === "nowrap") return false;
          const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.35;
          return element.scrollHeight > lineHeight * 1.65 && style.whiteSpace !== "normal";
        })
        .map((element) => element.textContent.trim().slice(0, 60));
    });

    expect(offenders, `${route} wrapped labels`).toEqual([]);
  }

  expect(errors).toEqual([]);
});
