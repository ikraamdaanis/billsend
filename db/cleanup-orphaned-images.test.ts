import { subDays } from "date-fns";
import { beforeEach, describe, expect, it } from "vitest";
import {
  addInvoiceVersion,
  cleanupOrphanedImages,
  db,
  getAllImages,
  registerImageKeeper,
  saveInvoice
} from "~/db";
import { createBlankInvoice } from "~/stores/invoice-store";

// Stores a blob uploaded `daysAgo` days ago.
async function storeBlob(imageId: string, daysAgo = 2) {
  await db.images.put({
    id: imageId,
    data: new Uint8Array([1, 2, 3]).buffer,
    type: "image/png",
    createdAt: subDays(new Date(), daysAgo)
  });
}

async function saveInvoiceWithImage(id: string, imageId: string) {
  const now = new Date();
  const invoiceData = createBlankInvoice();

  invoiceData.image = imageId;

  await saveInvoice({
    id,
    name: id,
    nameSource: "user",
    invoiceData,
    templateId: null,
    rev: 1,
    createdAt: now,
    updatedAt: now
  });
}

async function storedImageIds() {
  const images = await getAllImages();

  return images.map(image => image.id).sort();
}

describe("cleanupOrphanedImages", () => {
  beforeEach(async () => {
    await getAllImages();
    await Promise.all([
      db.images.clear(),
      db.invoices.clear(),
      db.versions.clear()
    ]);
  });

  it("keeps a blob two saved invoices share and collects an unreferenced one", async () => {
    await storeBlob("shared-logo");
    await storeBlob("orphan-logo");
    await saveInvoiceWithImage("inv-a", "shared-logo");
    await saveInvoiceWithImage("inv-b", "shared-logo");

    await cleanupOrphanedImages();

    expect(await storedImageIds()).toEqual(["shared-logo"]);
  });

  it("keeps a blob an invoice's version history still names", async () => {
    const invoiceData = createBlankInvoice();

    invoiceData.image = "versioned-logo";
    await storeBlob("versioned-logo");
    await addInvoiceVersion({
      invoiceId: "inv-a",
      name: "Acme",
      invoiceData,
      reason: "opened"
    });

    await cleanupOrphanedImages();

    expect(await storedImageIds()).toEqual(["versioned-logo"]);
  });

  it("keeps a blob this tab's undo history could put back", async () => {
    await storeBlob("undoable-logo");

    const unregister = registerImageKeeper(() => ["undoable-logo"]);

    await cleanupOrphanedImages();
    unregister();

    expect(await storedImageIds()).toEqual(["undoable-logo"]);
  });

  it("keeps a blob from the last day, which another tab's undo may need", async () => {
    await storeBlob("new-logo", 0);

    await cleanupOrphanedImages();

    expect(await storedImageIds()).toEqual(["new-logo"]);
  });

  it("collects an older blob nothing references anymore", async () => {
    await storeBlob("gone-logo");

    await cleanupOrphanedImages();

    expect(await storedImageIds()).toEqual([]);
  });
});
