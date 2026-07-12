import { expect, test } from "./fixtures";
import {
  clickFileMenuItem,
  draftContains,
  gotoEditorReady,
  saveInvoiceAs
} from "./helpers";

// Group F: working-draft autosave and restore. Every scenario here guards a
// lifecycle-refactor regression.

test("edits typed immediately on load are not wiped by hydration [R]", async ({
  page
}) => {
  await page.goto("/create");

  const title = page.getByLabel("Invoice title");

  // Type as soon as the field is actionable, without any readiness helper. The
  // editor is client-only (no pre-hydration SSR input to clobber) and the draft
  // read must not reset the store out from under this edit.
  await title.fill("Typed immediately");

  await expect.poll(() => draftContains(page, "Typed immediately")).toBe(true);
  await expect(title).toHaveValue("Typed immediately");
});

test("reloading restores edited content from the draft [R]", async ({
  page
}) => {
  await gotoEditorReady(page, "Restored title");
  await page.getByLabel("From details").fill("Persisted seller");
  await expect.poll(() => draftContains(page, "Persisted seller")).toBe(true);

  await page.reload();

  await expect(page.getByLabel("Invoice title")).toHaveValue("Restored title");
  await expect(page.getByLabel("From details")).toHaveValue("Persisted seller");
});

test("reloading restores the document identity, not just content [R]", async ({
  page
}) => {
  await gotoEditorReady(page, "Named title");
  await saveInvoiceAs(page, "Quarterly retainer");

  await page.getByLabel("From details").fill("Edited after save");
  await expect.poll(() => draftContains(page, "Edited after save")).toBe(true);

  await page.reload();

  await expect(
    page.getByRole("heading", { name: "Quarterly retainer" })
  ).toBeVisible();
  await expect(page.getByLabel("From details")).toHaveValue(
    "Edited after save"
  );
});

test("New Invoice clears the draft; reloading yields a blank invoice [R]", async ({
  page
}) => {
  await gotoEditorReady(page, "About to be discarded");
  await page.getByLabel("From details").fill("Temporary seller");
  await expect.poll(() => draftContains(page, "Temporary seller")).toBe(true);

  await clickFileMenuItem(page, "New Invoice");

  // Editing without saving leaves the editor dirty, so New Invoice routes
  // through the unsaved-changes guard; discard to proceed.
  const guard = page.getByRole("dialog", { name: "Unsaved Changes" });

  await expect(guard).toBeVisible();
  await guard.getByRole("button", { name: "Discard Changes" }).click();
  await expect(guard).toBeHidden();

  // A blank invoice carries the default title "Invoice" and an empty seller.
  await expect(page.getByLabel("Invoice title")).toHaveValue("Invoice");
  await expect(page.getByLabel("From details")).toHaveValue("");

  await page.reload();

  await expect(page.getByLabel("Invoice title")).toHaveValue("Invoice");
  await expect(page.getByLabel("From details")).toHaveValue("");
});

test("leaving to home and returning preserves identity and content [R]", async ({
  page
}) => {
  await gotoEditorReady(page, "Trip invoice");
  await saveInvoiceAs(page, "Trip invoice");
  await page.getByLabel("From details").fill("Return seller");

  await page.getByRole("button", { name: "Homepage" }).click();
  await page.getByRole("link", { name: "Leave" }).click();
  await expect(page).toHaveURL("/");

  await page.getByRole("link", { name: "Create invoice" }).click();
  await expect(page).toHaveURL("/create");

  await expect(
    page.getByRole("heading", { name: "Trip invoice" })
  ).toBeVisible();
  await expect(page.getByLabel("From details")).toHaveValue("Return seller");
});

test("backgrounding flushes an edit made inside the debounce window [R]", async ({
  page
}) => {
  await gotoEditorReady(page, "Flush test");

  // Edit, then background the tab before the 600ms autosave debounce fires. The
  // visibilitychange->hidden handler must flush the pending edit immediately.
  await page.getByLabel("From details").fill("Last-moment edit");
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden"
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });

  await expect.poll(() => draftContains(page, "Last-moment edit")).toBe(true);

  await page.reload();

  await expect(page.getByLabel("From details")).toHaveValue("Last-moment edit");
});
