import Dexie from "dexie";
import { describe, expect, it } from "vitest";

// Builds a database at the v5 schema (which had the business profile) and
// populates it, so opening the real module (which declares v6) exercises the
// v5 -> v6 upgrade that drops the profiles table while leaving the user's
// invoices, templates, and images untouched.
async function seedLegacyV5Database() {
  const legacy = new Dexie("InvoiceDatabase");
  legacy.version(5).stores({
    templates: "id, name, createdAt, updatedAt",
    invoices: "id, name, createdAt, updatedAt",
    images: "id",
    profiles: "id"
  });
  await legacy.open();

  const now = new Date();

  await legacy.table("invoices").put({
    id: "inv-1",
    name: "My saved invoice",
    invoiceData: {
      id: "1",
      title: "Invoice",
      number: "INV-0042",
      seller: { label: "From", content: "Acme", placeholder: "" }
    },
    templateId: null,
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now
  });
  await legacy.table("templates").put({
    id: "tpl-1",
    name: "My template",
    description: null,
    isDefault: false,
    templateData: { id: "1", title: "Invoice" },
    screenshotUrl: null,
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now
  });
  await legacy.table("images").put({
    id: "img-1",
    data: new ArrayBuffer(8),
    type: "image/png",
    createdAt: now
  });
  await legacy.table("profiles").put({
    id: "business-profile",
    businessName: "Acme Inc.",
    numbering: { prefix: "ACME-", padding: 3, nextNumber: 42 }
  });

  legacy.close();
}

describe("business-profile removal migration", () => {
  it("keeps invoices, templates, and images and drops the profiles table", async () => {
    await seedLegacyV5Database();

    // Import after the legacy db exists so the module opens on top of v5 data
    // and runs the v6 upgrade that removes the profiles table.
    const { getAllInvoices, getAllTemplates, getAllImages } = await import(
      "~/db"
    );

    const invoices = await getAllInvoices();
    const templates = await getAllTemplates();
    const images = await getAllImages();

    expect(invoices).toHaveLength(1);
    expect(invoices[0].name).toBe("My saved invoice");
    expect(invoices[0].invoiceData.number).toBe("INV-0042");

    expect(templates).toHaveLength(1);
    expect(templates[0].name).toBe("My template");

    expect(images).toHaveLength(1);
    expect(images[0].id).toBe("img-1");

    // The profiles object store is gone; the invoice data stores remain.
    const raw = await new Promise<IDBDatabase>(resolve => {
      const request = indexedDB.open("InvoiceDatabase");
      request.onsuccess = () => resolve(request.result);
    });
    const storeNames = Array.from(raw.objectStoreNames);
    raw.close();

    expect(storeNames).not.toContain("profiles");
    expect(storeNames).toContain("invoices");
  });
});
