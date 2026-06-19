import { expect, test } from "@playwright/test";
import { collectConsoleErrors, waitForApp } from "./helpers.js";

const measuredRoutes = ["/home", "/reviews", "/wallet", "/leaderboard", "/referral", "/subscription"];

test("performance smoke keeps bundle, DOM and route switch within mobile prototype limits", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/home");
  await waitForApp(page);

  const initialMetrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource");
    const scriptBytes = resources
      .filter((entry) => entry.name.includes(".js") || entry.initiatorType === "script")
      .reduce((sum, entry) => sum + (entry.transferSize || entry.encodedBodySize || 0), 0);
    const styleBytes = resources
      .filter((entry) => entry.name.includes(".css") || entry.initiatorType === "link")
      .reduce((sum, entry) => sum + (entry.transferSize || entry.encodedBodySize || 0), 0);
    return {
      domNodes: document.querySelectorAll("*").length,
      scriptBytes,
      styleBytes,
    };
  });

  expect(initialMetrics.domNodes).toBeLessThan(5200);
  // Vite dev mode serves source modules separately, so this budget guards
  // runaway dependency growth rather than production bundle size. `npm run build`
  // remains the production asset check in the quality gate.
  expect(initialMetrics.scriptBytes).toBeLessThan(5_500_000);
  expect(initialMetrics.styleBytes).toBeLessThan(900_000);

  for (const route of measuredRoutes) {
    const duration = await page.evaluate(async (nextRoute) => {
      const start = performance.now();
      window.location.hash = nextRoute;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return performance.now() - start;
    }, route);
    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain(route);
    expect(duration).toBeLessThan(700);
  }

  expect(errors).toEqual([]);
});
