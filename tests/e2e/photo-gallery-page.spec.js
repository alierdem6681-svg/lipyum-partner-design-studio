import { expect, test } from "@playwright/test";
import { collectConsoleErrors, expectNoAppHorizontalOverflow, waitForApp } from "./helpers.js";

test("photo gallery has profile, workplace and service upload sections", async ({ page }) => {
  const errors = await collectConsoleErrors(page);
  await page.goto("/#/photo-gallery");
  await waitForApp(page);

  await expect(page.getByTestId("photo-gallery-page")).toBeVisible();
  await expect(page.getByTestId("photo-gallery-section-profile")).toContainText("Profil fotoğrafları");
  await expect(page.getByTestId("photo-gallery-section-workplace")).toContainText("İş yeri fotoğrafları");
  await expect(page.getByTestId("photo-gallery-section-service")).toContainText("Hizmet fotoğrafları");

  const profileInput = page.getByTestId("photo-gallery-upload-profile").locator("input");
  await profileInput.setInputFiles([
    {
      name: "profil-2.png",
      mimeType: "image/png",
      buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR42mP8z8BQDwAFgwJ/l4D3HgAAAABJRU5ErkJggg==", "base64"),
    },
    {
      name: "profil-3.png",
      mimeType: "image/png",
      buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR42mP8z8BQDwAFgwJ/l4D3HgAAAABJRU5ErkJggg==", "base64"),
    },
  ]);

  await expect(page.getByTestId("photo-gallery-section-profile")).toContainText("3 fotoğraf");
  await expect(page.getByTestId("app-toast")).toContainText("2 fotoğraf eklendi");

  await expectNoAppHorizontalOverflow(page);
  expect(errors).toEqual([]);
});
