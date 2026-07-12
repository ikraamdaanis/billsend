import { expect, test } from "./fixtures";
import {
  clickFileMenuItem,
  gotoEditorReady,
  gotoEditorSettled,
  saveInvoiceAs
} from "./helpers";

// Group H: the Open Invoice dialog.

test("shows an empty state when there are no saved invoices", async ({
  page
}) => {
  await gotoEditorSettled(page);

  await clickFileMenuItem(page, "Open Invoice");

  const dialog = page.getByRole("dialog", { name: "Open Invoice" });

  await expect(dialog.getByText("No saved invoices yet")).toBeVisible();
});

test("lists a saved invoice and opens it into the editor", async ({ page }) => {
  await gotoEditorReady(page, "Alpha title");
  await saveInvoiceAs(page, "Alpha");
  await clickFileMenuItem(page, "New Invoice");

  await clickFileMenuItem(page, "Open Invoice");

  const dialog = page.getByRole("dialog", { name: "Open Invoice" });

  await dialog.getByRole("row", { name: /Alpha/ }).dblclick();
  await expect(dialog).toBeHidden();

  await expect(page.getByRole("heading", { name: "Alpha" })).toBeVisible();
  await expect(page.getByLabel("Invoice title")).toHaveValue("Alpha title");
});

test("deleting the current invoice detaches the editor [R]", async ({
  page
}) => {
  await gotoEditorReady(page, "Solo title");
  await saveInvoiceAs(page, "Solo doc");

  await clickFileMenuItem(page, "Open Invoice");

  const dialog = page.getByRole("dialog", { name: "Open Invoice" });
  const row = dialog.getByRole("row", { name: /Solo doc/ });

  await row.click();
  await row.press("Delete");

  await dialog.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(dialog.getByText("No saved invoices yet")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "Untitled invoice" })
  ).toBeVisible();
});

test("renaming from the dialog updates the toolbar title", async ({ page }) => {
  await gotoEditorReady(page, "Renamable");
  await saveInvoiceAs(page, "Old name");

  await clickFileMenuItem(page, "Open Invoice");

  const dialog = page.getByRole("dialog", { name: "Open Invoice" });
  const row = dialog.getByRole("row", { name: /Old name/ });

  await row.press("F2");
  await dialog.getByLabel("Invoice name").fill("New name");
  await dialog.getByLabel("Invoice name").press("Enter");

  await expect(dialog.getByRole("row", { name: /New name/ })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { name: "New name" })).toBeVisible();
});
