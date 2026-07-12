import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import {
  DB_NAME,
  clickFileMenuItem,
  gotoEditorReady,
  saveInvoiceAs
} from "./helpers";

// Deletes the whole IndexedDB database from the page's origin. Each Playwright
// test already gets a fresh BrowserContext (so IDB starts empty), but this is
// the escape hatch for the rare intra-test reset.
async function resetDb(page: Page) {
  await page.evaluate(async databaseName => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(databaseName);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => resolve();
    });
  }, DB_NAME);
}

// Drives the editor UI to create and Save an invoice under a name. UI-driven
// seeding (the issue's option 1) is the most realistic and avoids coupling to
// the stored record shape.
async function seedInvoice(
  page: Page,
  overrides: { name: string; title?: string }
) {
  await gotoEditorReady(page, overrides.title ?? "Seeded invoice");
  await saveInvoiceAs(page, overrides.name);
}

// Drives the editor UI to save the current invoice as a template.
async function seedTemplate(page: Page, overrides: { name: string }) {
  await clickFileMenuItem(page, "Save As Template");

  const dialog = page.getByRole("dialog", { name: "Save as Template" });

  await dialog.getByPlaceholder("Enter template name").fill(overrides.name);
  await dialog.getByRole("button", { name: "Create Template" }).click();
  await expect(dialog).toBeHidden();
}

export const test = base.extend<{
  resetDb: () => Promise<void>;
  seedInvoice: (overrides: { name: string; title?: string }) => Promise<void>;
  seedTemplate: (overrides: { name: string }) => Promise<void>;
}>({
  resetDb: async ({ page }, use) => {
    await use(() => resetDb(page));
  },
  seedInvoice: async ({ page }, use) => {
    await use(overrides => seedInvoice(page, overrides));
  },
  seedTemplate: async ({ page }, use) => {
    await use(overrides => seedTemplate(page, overrides));
  }
});

export { expect };
