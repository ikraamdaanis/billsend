import type { Table } from "dexie";
import Dexie from "dexie";
import type { InvoiceTemplate } from "features/new/types";

export interface StoredImage {
  id: string;
  data: ArrayBuffer;
  type: string;
  createdAt: Date;
}

class InvoiceDatabase extends Dexie {
  templates!: Table<InvoiceTemplate, string>;
  images!: Table<StoredImage, string>;

  constructor() {
    super("InvoiceDatabase");
    this.version(1).stores({
      templates: "id, name, createdAt, updatedAt",
      images: "id"
    });
  }
}

export const db = new InvoiceDatabase();

// Ensure database is ready before use
export async function ensureDbReady(): Promise<void> {
  await db.open();
}

export async function getAllTemplates(): Promise<InvoiceTemplate[]> {
  await ensureDbReady();
  return await db.templates.toArray();
}

export async function saveTemplate(template: InvoiceTemplate): Promise<string> {
  await ensureDbReady();
  return await db.templates.put(template);
}

export async function getTemplate(
  id: string
): Promise<InvoiceTemplate | undefined> {
  await ensureDbReady();
  return await db.templates.get(id);
}

export async function deleteTemplate(id: string): Promise<void> {
  await ensureDbReady();
  await db.templates.delete(id);
}

export async function saveImage(
  id: string,
  blob: Blob,
  type: string
): Promise<string> {
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
    throw new Error(`Failed to save image ${id}`);
  }
  return id;
}

export async function getImage(id: string): Promise<StoredImage | undefined> {
  await ensureDbReady();
  return await db.images.get(id);
}

export async function deleteImage(id: string): Promise<void> {
  await ensureDbReady();
  await db.images.delete(id);
}

export async function getImageBlob(id: string): Promise<Blob | null> {
  await ensureDbReady();
  const image = await db.images.get(id);
  if (!image) {
    return null;
  }
  // Convert ArrayBuffer back to Blob
  return new Blob([image.data], { type: image.type });
}
