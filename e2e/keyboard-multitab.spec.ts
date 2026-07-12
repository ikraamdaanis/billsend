import { expect, test } from "./fixtures";
import { gotoEditorReady, gotoEditorSettled, saveInvoiceAs } from "./helpers";

// Groups N and M: keyboard shortcuts, focus management, and multi-tab behaviour.

test("Cmd/Ctrl+Shift+S opens Save As", async ({ page }) => {
  await gotoEditorReady(page, "Shortcut save");

  await page.keyboard.press("ControlOrMeta+Shift+s");

  await expect(
    page.getByRole("dialog", { name: "Save Invoice" })
  ).toBeVisible();
});

test("Cmd/Ctrl+O opens the Open Invoice dialog", async ({ page }) => {
  await gotoEditorReady(page, "Shortcut open");
  await saveInvoiceAs(page, "Openable");

  await page.keyboard.press("ControlOrMeta+o");

  await expect(
    page.getByRole("dialog", { name: "Open Invoice" })
  ).toBeVisible();
});

test("a dialog traps focus and restores it on close", async ({ page }) => {
  await gotoEditorReady(page, "Focus trap");

  await page.keyboard.press("ControlOrMeta+Shift+s");

  const dialog = page.getByRole("dialog", { name: "Save Invoice" });

  await expect(dialog).toBeVisible();

  // Focus is trapped inside the dialog while it is open.
  await expect(dialog.locator(":focus")).toHaveCount(1);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  // The editor is interactive again after the dialog closes.
  await page.getByLabel("Invoice title").click();
  await expect(page.getByLabel("Invoice title")).toBeFocused();
});

test("a second tab sees an invoice saved in the first tab", async ({
  browser
}) => {
  const context = await browser.newContext();
  const tabA = await context.newPage();
  const tabB = await context.newPage();

  await gotoEditorReady(tabA, "Shared title");
  await saveInvoiceAs(tabA, "Shared doc");

  // Tab B, opened in the same context (shared IndexedDB), sees the saved record.
  await gotoEditorSettled(tabB);
  await tabB.bringToFront();
  await tabB.getByRole("menuitem", { name: "File" }).click();
  await tabB
    .getByRole("menuitem", { name: "Open Invoice", exact: true })
    .click();

  const dialog = tabB.getByRole("dialog", { name: "Open Invoice" });

  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Loading invoices")).toHaveCount(0);
  await expect(dialog.getByRole("row", { name: /Shared doc/ })).toBeVisible();

  await context.close();
});
