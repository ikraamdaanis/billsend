import type { Table } from "dexie";
import Dexie from "dexie";
import type { InvoiceDocument, InvoiceTemplate } from "features/new/types";

export interface StoredImage {
  id: string;
  data: ArrayBuffer;
  type: string;
  createdAt: Date;
}

class InvoiceDatabase extends Dexie {
  templates!: Table<InvoiceTemplate, string>;
  invoices!: Table<InvoiceDocument, string>;
  images!: Table<StoredImage, string>;

  constructor() {
    super("InvoiceDatabase");
    this.version(1).stores({
      templates: "id, name, createdAt, updatedAt",
      images: "id"
    });
    this.version(2).stores({
      templates: "id, name, createdAt, updatedAt",
      invoices: "id, name, createdAt, updatedAt",
      images: "id"
    });
  }
}

export const db = new InvoiceDatabase();

// Ensure database is ready before use
export async function ensureDbReady(): Promise<void> {
  try {
    await db.open();
  } catch {
    throw new Error(
      "Unable to access local storage. Please check your browser settings and ensure IndexedDB is enabled."
    );
  }
}

export async function getAllTemplates(): Promise<InvoiceTemplate[]> {
  try {
    await ensureDbReady();
    return await db.templates.toArray();
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to load templates from local storage."
    );
  }
}

export async function saveTemplate(template: InvoiceTemplate): Promise<string> {
  try {
    await ensureDbReady();
    return await db.templates.put(template);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to save template to local storage."
    );
  }
}

export async function getTemplate(
  id: string
): Promise<InvoiceTemplate | undefined> {
  try {
    await ensureDbReady();
    return await db.templates.get(id);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to load template from local storage."
    );
  }
}

export async function deleteTemplate(id: string): Promise<void> {
  try {
    await ensureDbReady();
    await db.templates.delete(id);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to delete template from local storage."
    );
  }
}

export async function getAllInvoices(): Promise<InvoiceDocument[]> {
  try {
    await ensureDbReady();
    return await db.invoices.toArray();
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to load invoices from local storage."
    );
  }
}

export async function saveInvoice(invoice: InvoiceDocument): Promise<string> {
  try {
    await ensureDbReady();
    return await db.invoices.put(invoice);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to save invoice to local storage."
    );
  }
}

export async function getInvoice(
  id: string
): Promise<InvoiceDocument | undefined> {
  try {
    await ensureDbReady();
    return await db.invoices.get(id);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to load invoice from local storage."
    );
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    await ensureDbReady();
    await db.invoices.delete(id);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to delete invoice from local storage."
    );
  }
}

export async function saveImage(
  id: string,
  blob: Blob,
  type: string
): Promise<string> {
  try {
    await ensureDbReady();
    // Convert blob to ArrayBuffer for reliable storage
    const arrayBuffer = await blob.arrayBuffer();
    const image: StoredImage = {
      id,
      data: arrayBuffer,
      type,
      createdAt: new Date()
    };
    await db.images.put(image);
    // Verify save worked
    const verify = await db.images.get(id);
    if (!verify) {
      throw new Error(
        "Failed to save image. The image may be too large or your browser storage may be full."
      );
    }
    return id;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to save image to local storage."
    );
  }
}

export async function getImage(id: string): Promise<StoredImage | undefined> {
  try {
    await ensureDbReady();
    return await db.images.get(id);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to load image from local storage."
    );
  }
}

export async function deleteImage(id: string): Promise<void> {
  try {
    await ensureDbReady();
    await db.images.delete(id);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to delete image from local storage."
    );
  }
}

export async function getImageBlob(id: string): Promise<Blob | null> {
  try {
    await ensureDbReady();
    const image = await db.images.get(id);
    if (!image) {
      return null;
    }
    // Convert ArrayBuffer back to Blob
    return new Blob([image.data], { type: image.type });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to load image from local storage."
    );
  }
}
