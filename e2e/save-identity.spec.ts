import { expect, test } from "./fixtures";
import {
  clickFileMenuItem,
  gotoEditorReady,
  saveInvoiceAs,
  storeContains
} from "./helpers";

// Group E: Save / Save As / document identity, including the [R] validation
// scenarios that guard the lifecycle refactor.

test("Save with no current document opens Save As and names the document", async ({
  page
}) => {
  await gotoEditorReady(page, "My services");

  await clickFileMenuItem(page, "Save");

  const dialog = page.getByRole("dialog", { name: "Save Invoice" });

  await expect(dialog).toBeVisible();

  await dialog.getByRole("textbox").fill("Project Alpha");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();

  await expect(
    page.getByRole("heading", { name: "Project Alpha" })
  ).toBeVisible();
});

test("Ctrl/Cmd+S saves directly once a document exists, with no dialog [R]", async ({
  page
}) => {
  await gotoEditorReady(page, "Retainer");
  await saveInvoiceAs(page, "Retainer March");

  await page.getByLabel("Invoice title").fill("Retainer March (rev)");
  await page.keyboard.press("ControlOrMeta+s");

  // Direct save: no Save As dialog, and the edit lands on the existing record.
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect
    .poll(() => storeContains(page, "invoices", "Retainer March (rev)"))
    .toBe(true);
  await expect(
    page.getByRole("heading", { name: "Retainer March" })
  ).toBeVisible();
});

test("whitespace-only names are rejected on Save As [R]", async ({ page }) => {
  await gotoEditorReady(page);

  await clickFileMenuItem(page, "Save As...");

  const dialog = page.getByRole("dialog", { name: "Save Invoice" });

  await dialog.getByRole("textbox").fill("   ");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();

  await expect(dialog.getByText("Invoice name is required")).toBeVisible();
  await expect(dialog).toBeVisible();
});

test("whitespace-only names are rejected on Rename [R]", async ({ page }) => {
  await gotoEditorReady(page, "Named doc");
  await saveInvoiceAs(page, "Named doc");

  await page.getByRole("heading", { name: "Named doc" }).click();

  const dialog = page.getByRole("dialog", { name: "Rename Invoice" });

  await expect(dialog).toBeVisible();

  await dialog.getByRole("textbox").fill("   ");
  await dialog.getByRole("button", { name: /Rename|Save/ }).click();

  await expect(dialog.getByText("Invoice name is required")).toBeVisible();
  await expect(dialog).toBeVisible();
});

test("whitespace-only names are rejected on Save As Template [R]", async ({
  page
}) => {
  await gotoEditorReady(page);

  await clickFileMenuItem(page, "Save As Template");

  const dialog = page.getByRole("dialog", { name: "Save as Template" });

  await dialog.getByPlaceholder("Enter template name").fill("   ");
  await dialog.getByRole("button", { name: "Create Template" }).click();

  await expect(dialog.getByText("Template name is required")).toBeVisible();
  await expect(dialog).toBeVisible();
});

test("default invoice name avoids collisions", async ({ page }) => {
  await gotoEditorReady(page);

  await clickFileMenuItem(page, "Save As...");

  const dialog = page.getByRole("dialog", { name: "Save Invoice" });

  await expect(dialog.getByRole("textbox")).toHaveValue("Invoice 001");

  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();

  await clickFileMenuItem(page, "Save As...");
  await expect(dialog.getByRole("textbox")).toHaveValue("Invoice 002");
});
