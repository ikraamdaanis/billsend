import {
  DESIGN_BLOCKS,
  DESIGN_VIEWPORTS
} from "~/components/design/design-blocks";
import { expect, test } from "./fixtures";

// Group: the design catalogue (/design), which shows the editor's chrome in
// sandboxed frames.

test("the catalogue lists every block in frames", async ({ page }) => {
  await page.goto("/design");

  await expect(
    page.getByRole("heading", { name: "Status banners" })
  ).toBeVisible();
  await expect(page.locator("iframe").first()).toBeVisible();
});

test("frames never touch the real library or the editor's settings", async ({
  page
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("billsend-editor-theme", "light")
  );
  const keysBefore = await page.evaluate(() => Object.keys(localStorage));

  await page.goto("/design/frame?block=panel-invoices&theme=dark");
  await expect(page.locator("html[data-design-ready]")).toBeAttached();
  await expect(page.locator("html")).toHaveAttribute(
    "data-editor-theme",
    "dark"
  );

  await page.goto("/");
  const after = await page.evaluate(async () => ({
    theme: localStorage.getItem("billsend-editor-theme"),
    keys: Object.keys(localStorage),
    databases: (await indexedDB.databases()).map(database => database.name)
  }));

  expect(after.theme).toBe("light");
  expect(after.keys).toEqual(keysBefore);
  expect(after.databases).toContain("billsend-design");
  expect(after.databases).not.toContain("InvoiceDatabase");
});

for (const block of DESIGN_BLOCKS) {
  test(`the ${block.id} frame reaches its state at every viewport`, async ({
    page,
    browserName
  }) => {
    test.skip(
      browserName === "webkit",
      "Every frame runs in Chromium; WebKit checks the sandbox."
    );

    for (const viewport of block.viewports) {
      const { width, height } = DESIGN_VIEWPORTS[viewport];

      await page.setViewportSize({ width, height: block.height ?? height });
      await page.goto(`/design/frame?block=${block.id}&theme=light`);

      await expect(page.locator("html[data-design-ready]")).toBeAttached();
      await expect(page.getByText("Something went wrong")).toHaveCount(0);
    }
  });
}
