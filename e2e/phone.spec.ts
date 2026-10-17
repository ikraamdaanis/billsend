import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

// Group: the editor on a phone, where the A4 page is fitted to the screen and
// tapping a field zooms in to it.
test.use({
  viewport: { width: 390, height: 664 },
  hasTouch: true,
  isMobile: true
});

function pageScale(page: Page) {
  return page
    .locator("[data-paper]")
    .evaluate(paper =>
      Number(/scale\(([\d.]+)\)/.exec(paper.style.transform)?.[1])
    );
}

test("tapping a field zooms in to it and Done fits the page", async ({
  page
}) => {
  await page.goto("/create");
  const toDetails = page.getByLabel("To details");
  await expect(toDetails).toBeVisible();
  await expect.poll(() => pageScale(page)).toBeLessThan(0.6);

  await toDetails.tap();

  await expect.poll(() => pageScale(page)).toBe(1);
  await expect(toDetails).toBeFocused();
  await expect(toDetails).toBeInViewport();

  await page.getByRole("button", { name: "Done" }).tap();

  await expect.poll(() => pageScale(page)).toBeLessThan(0.6);
  await expect(toDetails).not.toBeFocused();
  await expect(page.getByRole("button", { name: "Done" })).toHaveCount(0);
});
