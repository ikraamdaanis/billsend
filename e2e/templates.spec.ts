import { expect, test } from "./fixtures";
import { clickFileMenuItem, gotoEditorReady, saveInvoiceAs } from "./helpers";

// Group I: templates.

test("saves the current invoice as a template", async ({
  page,
  seedTemplate
}) => {
  await gotoEditorReady(page, "Templatable");
  await saveInvoiceAs(page, "Templatable doc");
  await seedTemplate({ name: "My template" });

  await clickFileMenuItem(page, "Open Template");

  const dialog = page.getByRole("dialog", { name: "Open Template" });

  await expect(dialog.getByRole("row", { name: /My template/ })).toBeVisible();
});

test("opening a template applies its data and detaches from the current document [R]", async ({
  page,
  seedTemplate
}) => {
  await gotoEditorReady(page, "Base title");
  await page.getByLabel("From details").fill("Template seller");
  // Save so the editor is clean, then capture the current content as a template.
  await saveInvoiceAs(page, "Base doc");
  await seedTemplate({ name: "Reusable" });

  await clickFileMenuItem(page, "Open Template");

  const dialog = page.getByRole("dialog", { name: "Open Template" });

  await dialog.getByRole("row", { name: /Reusable/ }).dblclick();
  await expect(dialog).toBeHidden();

  // The template's content is applied and the editor is no longer tied to the
  // saved "Base doc": the toolbar shows an untitled, unattached document.
  await expect(page.getByLabel("From details")).toHaveValue("Template seller");
  await expect(
    page.getByRole("heading", { name: "Untitled invoice" })
  ).toBeVisible();
});

test("templates can be renamed and deleted from the dialog", async ({
  page,
  seedTemplate
}) => {
  await gotoEditorReady(page, "For templating");
  await saveInvoiceAs(page, "Templating doc");
  await seedTemplate({ name: "First template" });

  await clickFileMenuItem(page, "Open Template");

  const dialog = page.getByRole("dialog", { name: "Open Template" });
  const row = dialog.getByRole("row", { name: /First template/ });

  await row.press("F2");
  await dialog.getByLabel("Template name").fill("Renamed template");
  await dialog.getByLabel("Template name").press("Enter");
  await expect(
    dialog.getByRole("row", { name: /Renamed template/ })
  ).toBeVisible();

  const renamedRow = dialog.getByRole("row", { name: /Renamed template/ });

  await renamedRow.click();
  await renamedRow.press("Delete");
  await dialog.getByRole("button", { name: "Delete", exact: true }).click();

  await expect(dialog.getByText("No saved templates yet")).toBeVisible();
});
