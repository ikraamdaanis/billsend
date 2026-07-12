import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

// Dexie database name, mirrored from db/index.ts so the suite has no import
// dependency on app source.
export const DB_NAME = "InvoiceDatabase";

// Counts working-draft rows in IndexedDB. A row only exists once the editor has
// hydrated (autosave is gated on hydration completing), so it doubles as a
// "hydration finished" signal.
export async function readDraftCount(page: Page): Promise<number> {
  return await page.evaluate(async databaseName => {
    return await new Promise<number>(resolve => {
      const request = indexedDB.open(databaseName);

      request.onsuccess = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("drafts")) {
          db.close();
          resolve(0);

          return;
        }

        const countRequest = db
          .transaction("drafts", "readonly")
          .objectStore("drafts")
          .count();

        countRequest.onsuccess = () => {
          db.close();
          resolve(countRequest.result);
        };
        countRequest.onerror = () => {
          db.close();
          resolve(0);
        };
      };

      request.onerror = () => resolve(0);
    });
  }, DB_NAME);
}

// Whether the serialized rows of an IndexedDB object store contain the given
// text. Used to wait for a specific edit to reach the draft (before reloading,
// so restore assertions test hydration rather than autosave-flush timing) or to
// confirm a save landed in the invoices store.
export async function storeContains(
  page: Page,
  storeName: string,
  needle: string
): Promise<boolean> {
  return await page.evaluate(
    async ([databaseName, store, text]) => {
      return await new Promise<boolean>(resolve => {
        const request = indexedDB.open(databaseName);

        request.onsuccess = () => {
          const db = request.result;

          if (!db.objectStoreNames.contains(store)) {
            db.close();
            resolve(false);

            return;
          }

          const getAll = db
            .transaction(store, "readonly")
            .objectStore(store)
            .getAll();

          getAll.onsuccess = () => {
            db.close();
            resolve(JSON.stringify(getAll.result).includes(text));
          };
          getAll.onerror = () => {
            db.close();
            resolve(false);
          };
        };

        request.onerror = () => resolve(false);
      });
    },
    [DB_NAME, storeName, needle] as const
  );
}

// Whether the working draft currently contains the given text.
export async function draftContains(
  page: Page,
  needle: string
): Promise<boolean> {
  return await storeContains(page, "drafts", needle);
}

// Clears an IndexedDB object store from the page's origin. Used to simulate a
// record being deleted in another tab (a readwrite transaction, no version
// bump, so it never blocks the app's open connection).
export async function clearObjectStore(page: Page, storeName: string) {
  await page.evaluate(
    async ([databaseName, store]) => {
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(databaseName);

        request.onsuccess = () => {
          const db = request.result;

          if (!db.objectStoreNames.contains(store)) {
            db.close();
            resolve();

            return;
          }

          const tx = db.transaction(store, "readwrite");

          tx.objectStore(store).clear();
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => {
            db.close();
            reject(tx.error);
          };
        };

        request.onerror = () => reject(request.error);
      });
    },
    [DB_NAME, storeName] as const
  );
}

// Fills a field and waits until the editor has durably accepted it. The editor
// resets its store once while hydrating (restoring the working draft on first
// mount); on a cold IndexedDB that read can land a second or two after mount and
// wipe edits made in between. A persisted draft row proves hydration finished
// and no further reset will fire, so the field value is durable from then on.
// Re-fills each poll because a pre-hydration fill gets discarded before it can
// persist. Use this for the first edit of every test that mutates the editor.
export async function fillWhenReady(
  page: Page,
  locator: Locator,
  value: string
) {
  await expect
    .poll(
      async () => {
        await locator.fill(value);

        const count = await readDraftCount(page);
        const domValue = await locator.inputValue();

        return count > 0 && domValue === value;
      },
      { timeout: 25_000, intervals: [700] }
    )
    .toBe(true);
}

// Opens the editor and settles hydration by durably setting the invoice title.
// Returns once the editor is ready for further edits.
export async function gotoEditorReady(page: Page, title = "Test invoice") {
  await page.goto("/create");
  await fillWhenReady(page, page.getByLabel("Invoice title"), title);
}

// Opens the editor and waits for hydration to settle without editing anything,
// by waiting for the client-stamped invoice date to populate. Use for tests
// that must not dirty the editor (e.g. empty-state and menu-only flows), so
// hydration's one-time store reset can't re-render a menu closed mid-open.
export async function gotoEditorSettled(page: Page) {
  await page.goto("/create");
  await expect(page.getByLabel("Date", { exact: true })).not.toHaveValue("");
}

// Opens the File menu, retrying until the menu content actually appears. A
// hydration re-render can close the menu the instant after it opens, so a bare
// click occasionally lands on nothing; retrying the open is deterministic.
export async function openFileMenu(page: Page) {
  const trigger = page.getByRole("menuitem", { name: "File" });
  const firstItem = page.getByRole("menuitem", { name: "New Invoice" });

  await expect(async () => {
    await trigger.click();
    await expect(firstItem).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 10_000 });
}

export async function clickFileMenuItem(page: Page, name: string | RegExp) {
  await openFileMenu(page);
  await page
    .getByRole("menuitem", { name, exact: typeof name === "string" })
    .click();
}

// Saves the current invoice through the Save As dialog under the given name.
export async function saveInvoiceAs(page: Page, name: string) {
  await clickFileMenuItem(page, "Save As...");

  const dialog = page.getByRole("dialog", { name: "Save Invoice" });

  await dialog.getByRole("textbox").fill(name);
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeHidden();
}

export async function addLineItem(page: Page) {
  await page.getByRole("button", { name: "Add item" }).click();
}

// Triggers Export Data and returns the download's filename and parsed JSON.
export async function exportData(page: Page) {
  const downloadPromise = page.waitForEvent("download");

  await clickFileMenuItem(page, "Export Data");

  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }

  return {
    filename: download.suggestedFilename(),
    // JSON.parse returns `any`, which the import edge-case tests mutate freely.
    json: JSON.parse(Buffer.concat(chunks).toString("utf8"))
  };
}

// Opens the Import dialog and selects an in-memory JSON payload as the file.
export async function selectImportFile(page: Page, data: unknown) {
  await clickFileMenuItem(page, "Import Data");

  const dialog = page.getByRole("dialog", { name: "Import Data" });

  await dialog.locator("#import-file-input").setInputFiles({
    name: "import.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(data))
  });

  return dialog;
}

// Local yyyy-MM-dd, mirroring the app's date-fns format(now, "yyyy-MM-dd").
function localIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isoToday(offsetDays = 0): string {
  const date = new Date();

  date.setDate(date.getDate() + offsetDays);

  return localIsoDate(date);
}

// Sets a numeric field (quantity, unit price, tax, fees, discounts) by typing.
// These fields keep an internal editing draft that focus repopulates, so a bare
// fill() appends to the existing value instead of replacing it; selecting all
// first mirrors how a user overwrites the value. Blurs afterwards so the parsed
// value is committed for both the amount and any value assertion.
export async function setNumber(locator: Locator, value: string) {
  await locator.click();
  await locator.press("ControlOrMeta+a");
  await locator.pressSequentially(value);
  await locator.blur();
}
