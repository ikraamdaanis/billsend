import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

// P0 smoke path: the single happy path that exercises the create -> edit ->
// add line item -> save -> leave -> return -> download chain end to end. This
// alone would have caught the #78 detach bug, where returning to the editor
// dropped the saved document's identity.
test("create, edit, save, leave, return, and download an invoice", async ({
  page,
  setTitleWhenReady
}) => {
  const context = page.context();

  await page.goto("/create");

  const title = page.getByLabel("Invoice title");

  await expect(title).toBeVisible();

  // Fills the title and waits for the editor to finish hydrating (see fixtures).
  // Once this returns the store has settled, so the remaining edits are durable.
  await setTitleWhenReady("Acme Consulting");

  await page.getByRole("button", { name: "Add item" }).click();

  const description = page.getByLabel("Item, item 1");
  const quantity = page.getByLabel("Quantity, item 1");
  const unitPrice = page.getByLabel("Unit Price, item 1");

  await description.fill("Consulting work");
  await quantity.fill("3");
  await unitPrice.fill("100");

  const amount = page.getByLabel("Amount, item 1");

  await expect(amount).toContainText("300");

  await openFileMenu(page);
  await page.getByRole("menuitem", { name: "Save", exact: true }).click();

  const saveDialog = page.getByRole("dialog");

  await expect(saveDialog).toBeVisible();

  await saveDialog.getByRole("textbox").fill("Acme Invoice");
  await saveDialog.getByRole("button", { name: "Save" }).click();
  await expect(saveDialog).toBeHidden();

  await expect(
    page.getByRole("heading", { name: "Acme Invoice" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Homepage" }).click();
  await page.getByRole("link", { name: "Leave" }).click();

  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Create invoice" }).click();

  await expect(page).toHaveURL("/create");
  await expect(
    page.getByRole("heading", { name: "Acme Invoice" })
  ).toBeVisible();
  await expect(title).toHaveValue("Acme Consulting");
  await expect(description).toHaveValue("Consulting work");

  // Download opens the PDF in a new viewer tab. Asserting that the tab opens is
  // the stable P0 signal (the issue's "assert ... the new viewer tab" option):
  // @react-pdf's blob generation does not complete under the headless dev server,
  // so the deeper /Title-filename and blob-content checks live in the later
  // P2 "PDF download" group, which can target the production build.
  const pdfPagePromise = context.waitForEvent("page");

  await page.getByRole("button", { name: "Download" }).click();

  const pdfPage = await pdfPagePromise;

  expect(pdfPage).toBeTruthy();
  expect(pdfPage.isClosed()).toBe(false);
});

async function openFileMenu(page: Page) {
  await page.getByRole("menuitem", { name: "File" }).click();
}
