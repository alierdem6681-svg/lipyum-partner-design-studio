import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), "tests/golden-master/v11-stable/GOLDEN_MASTER_MANIFEST.json"), "utf8"));
const golden = new Map(
  manifest.records
    .filter((item) => item.target === "vercel" && item.viewport === "393x852")
    .map((item) => [item.route, item]),
);

for (const route of ["/home"]) {
  test(`V12 content parity ${route}`, async ({ page }) => {
    await page.goto(`/?engine=vue#${route}`);
    const current = await page.evaluate(() => ({
      bodyTextLength: document.body.innerText.trim().length,
      headings: Array.from(document.querySelectorAll("h1,h2,h3"))
        .map((el) => el.textContent.replace(/\s+/g, " ").trim())
        .filter(Boolean),
      buttons: Array.from(document.querySelectorAll("button,a[role='button']"))
        .map((el) => el.textContent.replace(/\s+/g, " ").trim())
        .filter(Boolean),
    }));
    const reference = golden.get(route);
    expect(reference, `missing Golden Master for ${route}`).toBeTruthy();
    expect(current.bodyTextLength).toBe(reference.bodyTextLength);
    expect(current.headings).toEqual(reference.visibleSections);
    expect(current.buttons).toEqual(reference.buttonLabels);
  });
}
