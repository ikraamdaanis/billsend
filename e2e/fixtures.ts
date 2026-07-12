import type { Page } from "@playwright/test";
import { test as base, expect } from "@playwright/test";

// The Dexie database name, mirrored from db/index.ts. Kept as a literal here so
// the E2E suite has no import dependency on app source (which pulls in Vite/SSR
// plugins Playwright's Node runtime should not load).
const DB_NAME = "InvoiceDatabase";

// Reads the current working-draft's invoice title straight from IndexedDB, or
// null when no draft exists yet. Used to prove hydration has settled.
async function readDraftTitle(page: Page): Promise<string | null> {
  return await page.evaluate(async databaseName => {
    return await new Promise<string | null>(resolve => {
      const request = indexedDB.open(databaseName);

      request.onsuccess = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("drafts")) {
          db.close();
          resolve(null);

          return;
        }

        const getAll = db
          .transaction("drafts", "readonly")
          .objectStore("drafts")
          .getAll();

        getAll.onsuccess = () => {
          const drafts = getAll.result as {
            invoiceData?: { title?: string };
          }[];
          const draft = drafts.at(0);

          // Close before resolving: a lingering connection would block the app's
          // one-time Dexie upgrade on a cold database, stalling hydration.
          db.close();
          resolve(draft?.invoiceData?.title ?? null);
        };
        getAll.onerror = () => {
          db.close();
          resolve(null);
        };
      };

      request.onerror = () => resolve(null);
    });
  }, DB_NAME);
}

// Fills the invoice title and waits until that edit is durably persisted to the
// working draft. The editor resets its store once while hydrating (restoring the
// draft on first mount), and on a cold IndexedDB that read can resolve a second
// or two after mount, wiping edits made in the meantime. Autosave only runs once
// hydration completes and never resets afterwards, so a title that reaches the
// draft proves the editor is ready for the rest of the flow. Re-fills each poll
// because a pre-hydration fill gets discarded before it can persist.
async function setTitleWhenReady(page: Page, value: string) {
  await expect
    .poll(
      async () => {
        await page.getByLabel("Invoice title").fill(value);

        return await readDraftTitle(page);
      },
      { timeout: 20_000, intervals: [800] }
    )
    .toBe(value);
}

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

// Drives the editor UI to create and Save an invoice. UI-driven seeding (the
// issue's option 1) is the most realistic and avoids coupling to the stored
// record shape.
async function seedInvoice(
  page: Page,
  overrides: { name: string; title?: string }
) {
  await page.goto("/create");
  await setTitleWhenReady(page, overrides.title ?? "Seeded invoice");

  await page.getByRole("menuitem", { name: "File" }).click();
  await page.getByRole("menuitem", { name: "Save", exact: true }).click();

  const dialog = page.getByRole("dialog");

  await dialog.getByRole("textbox").fill(overrides.name);
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden();
}

// Drives the editor UI to save the current invoice as a template.
async function seedTemplate(page: Page, overrides: { name: string }) {
  await page.getByRole("menuitem", { name: "File" }).click();
  await page.getByRole("menuitem", { name: "Save As Template" }).click();

  const dialog = page.getByRole("dialog");

  await dialog.getByRole("textbox").fill(overrides.name);
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog).toBeHidden();
}

export const test = base.extend<{
  resetDb: () => Promise<void>;
  setTitleWhenReady: (value: string) => Promise<void>;
  seedInvoice: (overrides: { name: string; title?: string }) => Promise<void>;
  seedTemplate: (overrides: { name: string }) => Promise<void>;
}>({
  resetDb: async ({ page }, use) => {
    await use(() => resetDb(page));
  },
  setTitleWhenReady: async ({ page }, use) => {
    await use(value => setTitleWhenReady(page, value));
  },
  seedInvoice: async ({ page }, use) => {
    await use(overrides => seedInvoice(page, overrides));
  },
  seedTemplate: async ({ page }, use) => {
    await use(overrides => seedTemplate(page, overrides));
  }
});

export { expect };
