import type { Table } from "dexie";
import Dexie from "dexie";
import type { InvoiceDocument, InvoiceTemplate } from "features/new/types";

export interface StoredImage {
  id: string;
  data: ArrayBuffer;
  type: string;
  createdAt: Date;
}

interface ErrorWithOptionalFields {
  name?: unknown;
  message?: unknown;
}

function getErrorName(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;

  const { name } = error as ErrorWithOptionalFields;

  return typeof name === "string" && name.length > 0 ? name : null;
}

function getErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;

  const { message } = error as ErrorWithOptionalFields;

  return typeof message === "string" && message.length > 0 ? message : null;
}

function isUpgradeError(error: unknown): boolean {
  const name = getErrorName(error);

  if (!name) return false;

  return (
    name === "UpgradeError" || name === "VersionError" || name === "SchemaError"
  );
}

function getFriendlyIndexedDbErrorMessage(error: unknown): string {
  const name = getErrorName(error);

  if (name === "MissingAPIError") {
    return "Local storage is not available in this browser. Please use a browser that supports IndexedDB.";
  }

  if (name === "SecurityError") {
    return "Local storage is blocked by your browser settings. Please enable site storage/IndexedDB and try again.";
  }

  if (name === "QuotaExceededError") {
    return "Your browser storage is full. Please free up space (or remove saved templates) and try again.";
  }

  if (name === "InvalidStateError") {
    return "Local storage is temporarily unavailable. If you have this app open in another tab, close it and refresh.";
  }

  const message = getErrorMessage(error);

  if (message) return message;

  return "Unable to access local storage. Please check your browser settings and ensure IndexedDB is enabled.";
}

/**
 * InvoiceDatabase - IndexedDB database for storing invoices, templates, and images.
 *
 * MIGRATION GUIDELINES:
 * - Always increment the version number when changing the schema
 * - Keep ALL previous version definitions (Dexie needs them for migrations)
 * - For new tables: No upgrade callback needed - Dexie handles it automatically
 * - For schema changes (adding/removing indexes): No upgrade callback needed
 * - For data transformations: Use .upgrade(tx => { ... }) to transform existing data
 * - NEVER delete the database automatically - this causes data loss
 *
 * Example migration with data transformation:
 *   this.version(3)
 *     .stores({ templates: "id, name, createdAt, updatedAt, newField" })
 *     .upgrade(async tx => {
 *       await tx.table("templates").toCollection().modify(template => {
 *         template.newField = "default value";
 *       });
 *     });
 */
class InvoiceDatabase extends Dexie {
  templates!: Table<InvoiceTemplate, string>;
  invoices!: Table<InvoiceDocument, string>;
  images!: Table<StoredImage, string>;

  constructor() {
    super("InvoiceDatabase");
    // Version 1: Initial schema with templates and images
    this.version(1).stores({
      templates: "id, name, createdAt, updatedAt",
      images: "id"
    });
    // Version 2: Added invoices table (no data migration needed - new table only)
    // Dexie automatically handles adding new tables - no upgrade callback needed
    this.version(2).stores({
      templates: "id, name, createdAt, updatedAt",
      invoices: "id, name, createdAt, updatedAt",
      images: "id"
    });
  }
}

export const db = new InvoiceDatabase();

let dbOpenPromise: Promise<void> | null = null;

// Ensure database is ready before use
export async function ensureDbReady(): Promise<void> {
  if (db.isOpen()) return;
  if (dbOpenPromise) return dbOpenPromise;

  dbOpenPromise = (async () => {
    try {
      await db.open();
      return;
    } catch (error) {
      // Dexie handles migrations automatically when versions are properly defined.
      // Upgrade errors should be rare and usually indicate a serious issue.
      // We should NOT automatically delete user data - that would cause data loss.
      if (isUpgradeError(error)) {
        // Log the error for debugging
        console.error(
          "[InvoiceDatabase] Migration error - this should not happen with proper version definitions",
          error
        );
        // Provide a helpful error message without deleting data
        const message = getErrorMessage(error);

        throw new Error(
          `Database migration failed. Your data is safe, but the app cannot start. Please refresh the page.${message ? ` (${message})` : ""}`
        );
      }

      // Log raw error for debugging without breaking UX messaging.
      console.error("[InvoiceDatabase] Failed to open IndexedDB", error);

      throw new Error(getFriendlyIndexedDbErrorMessage(error));
    } finally {
      dbOpenPromise = null;
    }
  })();

  return dbOpenPromise;
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
