import type { Table } from "dexie";
import Dexie from "dexie";
import {
  BUSINESS_PROFILE_ID,
  createDefaultBusinessProfile,
  normalizeBusinessProfile
} from "~/schema/business-profile";
import {
  CURRENT_INVOICE_SCHEMA_VERSION,
  migrateInvoiceData
} from "~/schema/migrations";
import type {
  BusinessProfile,
  InvoiceDocument,
  InvoiceTemplate
} from "~/types";
import { selectOrphanedImageIds } from "~/utils/select-orphaned-images";

// Validate + migrate stored data on the way out, stamping the current schema
// version. Old records (no version) are treated as v0 and brought fully current.
function migrateStoredInvoice(document: InvoiceDocument): InvoiceDocument {
  return {
    ...document,
    invoiceData: migrateInvoiceData(
      document.invoiceData,
      document.schemaVersion ?? 0
    ),
    schemaVersion: CURRENT_INVOICE_SCHEMA_VERSION
  };
}

function migrateStoredTemplate(template: InvoiceTemplate): InvoiceTemplate {
  return {
    ...template,
    templateData: migrateInvoiceData(
      template.templateData,
      template.schemaVersion ?? 0
    ),
    schemaVersion: CURRENT_INVOICE_SCHEMA_VERSION
  };
}

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

function createStorageError(error: unknown, fallbackMessage: string): Error {
  return new Error(error instanceof Error ? error.message : fallbackMessage, {
    cause: error
  });
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
  profiles!: Table<BusinessProfile, string>;

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
    // Version 3: Replaced per-field text settings with a single global theme.
    // Transform stored invoiceData/templateData into the new model: add a
    // default theme, collapse the old table header settings into column labels,
    // and drop the obsolete per-field *Settings keys.
    this.version(3)
      .stores({
        templates: "id, name, createdAt, updatedAt",
        invoices: "id, name, createdAt, updatedAt",
        images: "id"
      })
      .upgrade(async tx => {
        await tx
          .table("invoices")
          .toCollection()
          .modify(invoice => {
            invoice.invoiceData = migrateInvoiceData(invoice.invoiceData, 0);
            invoice.schemaVersion = CURRENT_INVOICE_SCHEMA_VERSION;
          });
        await tx
          .table("templates")
          .toCollection()
          .modify(template => {
            template.templateData = migrateInvoiceData(
              template.templateData,
              0
            );
            template.schemaVersion = CURRENT_INVOICE_SCHEMA_VERSION;
          });
      });
    // Version 4: Stopped persisting derived money fields (subtotal, total,
    // per-item amount, tax.amount); they are now computed at render. Re-run the
    // invoice migration, which strips those keys and stamps the schema version.
    this.version(4)
      .stores({
        templates: "id, name, createdAt, updatedAt",
        invoices: "id, name, createdAt, updatedAt",
        images: "id"
      })
      .upgrade(async tx => {
        await tx
          .table("invoices")
          .toCollection()
          .modify(invoice => {
            invoice.invoiceData = migrateInvoiceData(invoice.invoiceData, 0);
            invoice.schemaVersion = CURRENT_INVOICE_SCHEMA_VERSION;
          });
        await tx
          .table("templates")
          .toCollection()
          .modify(template => {
            template.templateData = migrateInvoiceData(
              template.templateData,
              0
            );
            template.schemaVersion = CURRENT_INVOICE_SCHEMA_VERSION;
          });
      });
    // Version 5: Added the singleton business profile. Existing invoices,
    // templates, and images are untouched; the upgrade only provisions a
    // default (empty) profile so returning users have one to edit.
    this.version(5)
      .stores({
        templates: "id, name, createdAt, updatedAt",
        invoices: "id, name, createdAt, updatedAt",
        images: "id",
        profiles: "id"
      })
      .upgrade(async tx => {
        const existing = await tx.table("profiles").get(BUSINESS_PROFILE_ID);

        if (existing) return;

        await tx.table("profiles").put(createDefaultBusinessProfile());
      });
  }
}

const db = new InvoiceDatabase();

let dbOpenPromise: Promise<void> | null = null;

// Ensure database is ready before use
async function ensureDbReady(): Promise<void> {
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
          `Database migration failed. Your data is safe, but the app cannot start. Please refresh the page.${message ? ` (${message})` : ""}`,
          { cause: error }
        );
      }

      // Log raw error for debugging without breaking UX messaging.
      console.error("[InvoiceDatabase] Failed to open IndexedDB", error);

      throw new Error(getFriendlyIndexedDbErrorMessage(error), {
        cause: error
      });
    } finally {
      dbOpenPromise = null;
    }
  })();

  return dbOpenPromise;
}

export async function getAllTemplates(): Promise<InvoiceTemplate[]> {
  try {
    await ensureDbReady();
    return (await db.templates.toArray()).map(migrateStoredTemplate);
  } catch (error) {
    throw createStorageError(
      error,
      "Failed to load templates from local storage."
    );
  }
}

export async function saveTemplate(template: InvoiceTemplate): Promise<string> {
  try {
    await ensureDbReady();
    return await db.templates.put({
      ...template,
      schemaVersion: CURRENT_INVOICE_SCHEMA_VERSION
    });
  } catch (error) {
    throw createStorageError(
      error,
      "Failed to save template to local storage."
    );
  }
}

export async function deleteTemplate(id: string): Promise<void> {
  try {
    await ensureDbReady();
    await db.templates.delete(id);
  } catch (error) {
    throw createStorageError(
      error,
      "Failed to delete template from local storage."
    );
  }
}

export async function getAllInvoices(): Promise<InvoiceDocument[]> {
  try {
    await ensureDbReady();
    return (await db.invoices.toArray()).map(migrateStoredInvoice);
  } catch (error) {
    throw createStorageError(
      error,
      "Failed to load invoices from local storage."
    );
  }
}

export async function saveInvoice(invoice: InvoiceDocument): Promise<string> {
  try {
    await ensureDbReady();
    return await db.invoices.put({
      ...invoice,
      schemaVersion: CURRENT_INVOICE_SCHEMA_VERSION
    });
  } catch (error) {
    throw createStorageError(error, "Failed to save invoice to local storage.");
  }
}

export async function getInvoice(
  id: string
): Promise<InvoiceDocument | undefined> {
  try {
    await ensureDbReady();
    const document = await db.invoices.get(id);

    return document ? migrateStoredInvoice(document) : undefined;
  } catch (error) {
    throw createStorageError(
      error,
      "Failed to load invoice from local storage."
    );
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    await ensureDbReady();
    await db.invoices.delete(id);
  } catch (error) {
    throw createStorageError(
      error,
      "Failed to delete invoice from local storage."
    );
  }
}

/**
 * Read the singleton business profile, lazily provisioning a default (empty)
 * one the first time it is requested. Fresh installs skip the version-5
 * migration (Dexie only runs upgrades for existing lower versions), so this is
 * the seam that guarantees a profile always exists. Stored data is normalized
 * on the way out so a partial record is repaired rather than trusted blindly.
 */
export async function getBusinessProfile(): Promise<BusinessProfile> {
  try {
    await ensureDbReady();
    const stored = await db.profiles.get(BUSINESS_PROFILE_ID);

    if (stored) return normalizeBusinessProfile(stored);

    const fresh = createDefaultBusinessProfile();
    await db.profiles.put(fresh);

    return fresh;
  } catch (error) {
    throw createStorageError(
      error,
      "Failed to load business profile from local storage."
    );
  }
}

export async function saveBusinessProfile(
  profile: BusinessProfile
): Promise<void> {
  try {
    await ensureDbReady();
    await db.profiles.put({ ...profile, id: BUSINESS_PROFILE_ID });
  } catch (error) {
    throw createStorageError(
      error,
      "Failed to save business profile to local storage."
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
    throw createStorageError(error, "Failed to save image to local storage.");
  }
}

export async function deleteImage(id: string): Promise<void> {
  try {
    await ensureDbReady();
    await db.images.delete(id);
  } catch (error) {
    throw createStorageError(
      error,
      "Failed to delete image from local storage."
    );
  }
}

export async function getAllImages(): Promise<StoredImage[]> {
  try {
    await ensureDbReady();
    return await db.images.toArray();
  } catch (error) {
    throw createStorageError(
      error,
      "Failed to load images from local storage."
    );
  }
}

/**
 * Delete image blobs that no saved invoice or template references.
 *
 * Pass any image ids that are in use but not yet persisted (e.g. the logo on
 * the active in-memory invoice) via `keepImageIds` so they survive the sweep.
 * Best-effort: failures are logged but never thrown, since this is background
 * garbage collection that must not disrupt the upload/load/reset it follows.
 */
// Serialises orphan sweeps so overlapping callers (upload, load, save, reset)
// can't interleave their read-then-bulkDelete and drop a blob another sweep was
// about to keep. runOrphanCleanup never throws, so the chain never rejects.
let orphanCleanupChain: Promise<void> = Promise.resolve();

export function cleanupOrphanedImages(
  keepImageIds: string[] = []
): Promise<void> {
  orphanCleanupChain = orphanCleanupChain.then(() =>
    runOrphanCleanup(keepImageIds)
  );

  return orphanCleanupChain;
}

async function runOrphanCleanup(keepImageIds: string[]): Promise<void> {
  try {
    await ensureDbReady();

    const [invoices, templates, images, profile] = await Promise.all([
      db.invoices.toArray(),
      db.templates.toArray(),
      db.images.toArray(),
      db.profiles.get(BUSINESS_PROFILE_ID)
    ]);

    const referencedImageIds = [
      ...invoices.map(invoice => invoice.invoiceData.image),
      ...templates.map(template => template.templateData.image),
      profile?.logoImageId ?? ""
    ];

    const orphanedImageIds = selectOrphanedImageIds(
      images.map(image => image.id),
      referencedImageIds,
      keepImageIds
    );

    if (orphanedImageIds.length === 0) return;

    await db.images.bulkDelete(orphanedImageIds);
  } catch (error) {
    console.error(
      "[InvoiceDatabase] Failed to clean up orphaned images",
      error
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
    throw createStorageError(error, "Failed to load image from local storage.");
  }
}
