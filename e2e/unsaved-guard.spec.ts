import { expect, test } from "./fixtures";
import {
  clearObjectStore,
  clickFileMenuItem,
  gotoEditorReady,
  saveInvoiceAs,
  storeContains
} from "./helpers";

// Group G: the unsaved-changes guard and navigation dialogs. gotoEditorReady
// sets the title without saving, so the editor is already dirty afterwards.

test("New and Open trigger the unsaved-changes dialog when dirty", async ({
  page
}) => {
  await gotoEditorReady(page, "Dirty invoice");

  await clickFileMenuItem(page, "New Invoice");

  const guard = page.getByRole("dialog", { name: "Unsaved Changes" });

  await expect(guard).toBeVisible();
  await guard.getByRole("button", { name: "Cancel" }).click();
  await expect(guard).toBeHidden();

  await clickFileMenuItem(page, "Open Invoice");
  await expect(guard).toBeVisible();
});

test("Cancel keeps edits; Discard drops them", async ({ page }) => {
  await gotoEditorReady(page, "Keep me");

  await clickFileMenuItem(page, "New Invoice");

  const guard = page.getByRole("dialog", { name: "Unsaved Changes" });

  await guard.getByRole("button", { name: "Cancel" }).click();
  await expect(guard).toBeHidden();
  await expect(page.getByLabel("Invoice title")).toHaveValue("Keep me");

  await clickFileMenuItem(page, "New Invoice");
  await guard.getByRole("button", { name: "Discard Changes" }).click();
  await expect(guard).toBeHidden();
  await expect(page.getByLabel("Invoice title")).toHaveValue("Invoice");
});

test("Save in the guard persists before proceeding [R]", async ({ page }) => {
  await gotoEditorReady(page, "To save first");
  await saveInvoiceAs(page, "Guarded doc");

  await page.getByLabel("From details").fill("late edit");

  await clickFileMenuItem(page, "New Invoice");

  const guard = page.getByRole("dialog", { name: "Unsaved Changes" });

  await guard.getByRole("button", { name: "Save", exact: true }).click();

  await expect(guard).toBeHidden();
  // The New action proceeded only after the save landed: a fresh blank invoice,
  // and the edit was persisted to the saved record before the reset ran.
  await expect(page.getByLabel("Invoice title")).toHaveValue("Invoice");
  await expect
    .poll(() => storeContains(page, "invoices", "late edit"))
    .toBe(true);
});

test("saving a document deleted in another tab routes to Save As without losing edits [R]", async ({
  page
}) => {
  await gotoEditorReady(page, "Solo title");
  await saveInvoiceAs(page, "Solo doc");

  await page.getByLabel("From details").fill("edit after delete");

  // Simulate another tab deleting the saved record.
  await clearObjectStore(page, "invoices");

  await page.keyboard.press("ControlOrMeta+s");

  const saveDialog = page.getByRole("dialog", { name: "Save Invoice" });

  await expect(saveDialog).toBeVisible();
  // Edits are intact, not wiped by the failed direct save.
  await expect(page.getByLabel("From details")).toHaveValue(
    "edit after delete"
  );
});

test("global Save/Open shortcuts are inert while a dialog is open [R]", async ({
  page
}) => {
  await gotoEditorReady(page);

  await clickFileMenuItem(page, "Save As...");

  const saveDialog = page.getByRole("dialog", { name: "Save Invoice" });

  await expect(saveDialog).toBeVisible();

  // Cmd/Ctrl+O must not stack an Open dialog underneath the Save dialog.
  await page.keyboard.press("ControlOrMeta+o");
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(saveDialog).toBeVisible();
});

test("the Leave this page dialog blocks and allows navigation", async ({
  page
}) => {
  await gotoEditorReady(page, "Leaving soon");

  await page.getByRole("button", { name: "Homepage" }).click();

  const leave = page.getByRole("dialog", { name: "Leave this page?" });

  await expect(leave).toBeVisible();
  await leave.getByRole("button", { name: "Cancel" }).click();
  await expect(leave).toBeHidden();
  await expect(page).toHaveURL(/\/create$/);

  await page.getByRole("button", { name: "Homepage" }).click();
  await page.getByRole("link", { name: "Leave" }).click();
  await expect(page).toHaveURL("/");
});
