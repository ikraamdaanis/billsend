import Dexie from "dexie";
import { beforeEach, describe, expect, it } from "vitest";
import { getAllInvoices, saveInvoice } from "~/db";
import { invoiceDefault } from "~/stores/invoice-store";
import { buildExportData } from "~/utils/export-data";
import { executeImport, parseExportFile } from "~/utils/import-data";

// Clears every table through an independent connection so each test starts from
// an empty database, matching a fresh device.
async function resetDb() {
  const connection = new Dexie("InvoiceDatabase");
  connection.version(6).stores({
    templates: "id, name, createdAt, updatedAt",
    invoices: "id, name, createdAt, updatedAt",
    images: "id"
  });
  await connection.open();
  await Promise.all([
    connection.table("templates").clear(),
    connection.table("invoices").clear(),
    connection.table("images").clear()
  ]);
  connection.close();
}

function toFile(value: unknown): File {
  return new File([JSON.stringify(value)], "billsend-export.json", {
    type: "application/json"
  });
}

describe("data backup/restore", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("round-trips saved invoices through export and import", async () => {
    const now = new Date();
    await saveInvoice({
      id: "inv-1",
      name: "My invoice",
      invoiceData: { ...structuredClone(invoiceDefault), number: "INV-0007" },
      templateId: null,
      createdAt: now,
      updatedAt: now
    });

    const exported = await buildExportData();

    await resetDb();

    const result = await executeImport(exported);
    const invoices = await getAllInvoices();

    expect(result.invoicesImported).toBe(1);
    expect(invoices).toHaveLength(1);
    expect(invoices[0].name).toBe("My invoice");
    expect(invoices[0].invoiceData.number).toBe("INV-0007");
  });

  it("imports an older profile-bearing export, ignoring the profile", async () => {
    const exported = await buildExportData();
    const legacy = {
      ...exported,
      meta: { ...exported.meta, version: 2 },
      profile: {
        id: "business-profile",
        businessName: "Acme Inc.",
        numbering: { prefix: "ACME-", padding: 3, nextNumber: 8 }
      }
    };

    const parsed = await parseExportFile(toFile(legacy));

    // The profile field is not part of the current schema, so it is stripped.
    expect("profile" in parsed).toBe(false);

    const result = await executeImport(parsed);

    expect(result).toEqual({
      templatesImported: 0,
      invoicesImported: 0,
      imagesImported: 0
    });
  });
});
