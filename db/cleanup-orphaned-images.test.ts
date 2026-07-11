import { beforeEach, describe, expect, it } from "vitest";
import {
  cleanupOrphanedImages,
  clearDraft,
  deleteImage,
  deleteInvoice,
  getAllImages,
  getAllInvoices,
  saveDraft,
  saveImage,
  saveInvoice
} from "~/db";
import { createBlankInvoice } from "~/stores/invoice-store";

async function storeBlob(imageId: string) {
  const blob = new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" });

  await saveImage(imageId, blob, "image/png");
}

async function saveInvoiceWithImage(id: string, imageId: string) {
  const now = new Date();
  const invoiceData = createBlankInvoice();
  invoiceData.image = imageId;

  await saveInvoice({
    id,
    name: id,
    invoiceData,
    templateId: null,
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
    const images = await getAllImages();
    await Promise.all(images.map(image => deleteImage(image.id)));

    const invoices = await getAllInvoices();
    await Promise.all(invoices.map(invoice => deleteInvoice(invoice.id)));

    await clearDraft();
  });

  it("keeps a blob two saved invoices share and collects an unreferenced one", async () => {
    await storeBlob("shared-logo");
    await storeBlob("orphan-logo");
    await saveInvoiceWithImage("inv-a", "shared-logo");
    await saveInvoiceWithImage("inv-b", "shared-logo");

    await cleanupOrphanedImages();

    expect(await storedImageIds()).toEqual(["shared-logo"]);
  });

  it("never deletes a blob still referenced by the working draft", async () => {
    await storeBlob("draft-logo");
    const invoiceData = createBlankInvoice();
    invoiceData.image = "draft-logo";
    await saveDraft({
      invoiceData,
      documentId: null,
      documentName: null,
      lastSavedInvoice: null,
      updatedAt: new Date()
    });

    await cleanupOrphanedImages();

    expect(await storedImageIds()).toContain("draft-logo");
  });

  it("collects a blob nothing references anymore", async () => {
    await storeBlob("gone-logo");

    await cleanupOrphanedImages();

    expect(await storedImageIds()).toEqual([]);
  });
});
