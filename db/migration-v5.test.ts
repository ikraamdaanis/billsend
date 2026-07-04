import Dexie from "dexie";
import { describe, expect, it } from "vitest";
import { BUSINESS_PROFILE_ID } from "~/schema/business-profile";

// Builds a database at the pre-profile v4 schema and populates it, so opening
// the real module (which declares v5) exercises the v4 -> v5 upgrade path.
async function seedLegacyV4Database() {
  const legacy = new Dexie("InvoiceDatabase");
  legacy.version(4).stores({
    templates: "id, name, createdAt, updatedAt",
    invoices: "id, name, createdAt, updatedAt",
    images: "id"
  });
  await legacy.open();

  const now = new Date();

  await legacy.table("invoices").put({
    id: "inv-1",
    name: "My saved invoice",
    invoiceData: {
      id: "1",
      title: "Invoice",
      number: "42",
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

  legacy.close();
}

async function readProfileRow() {
  const connection = new Dexie("InvoiceDatabase");
  connection.version(5).stores({
    templates: "id, name, createdAt, updatedAt",
    invoices: "id, name, createdAt, updatedAt",
    images: "id",
    profiles: "id"
  });
  await connection.open();
  const profile = await connection.table("profiles").get(BUSINESS_PROFILE_ID);
  connection.close();

  return profile;
}

describe("v4 -> v5 migration", () => {
  it("keeps existing invoices, templates, and images and gains a default profile", async () => {
    await seedLegacyV4Database();

    // Import after the legacy db exists so the module opens on top of v4 data.
    const {
      getAllInvoices,
      getAllTemplates,
      getAllImages,
      getBusinessProfile
    } = await import("~/db");

    const invoices = await getAllInvoices();
    const templates = await getAllTemplates();
    const images = await getAllImages();

    expect(invoices).toHaveLength(1);
    expect(invoices[0].name).toBe("My saved invoice");
    expect(invoices[0].invoiceData.number).toBe("42");

    expect(templates).toHaveLength(1);
    expect(templates[0].name).toBe("My template");

    expect(images).toHaveLength(1);
    expect(images[0].id).toBe("img-1");

    // The migration itself seeded the profile: the row exists before any lazy
    // getBusinessProfile provisioning would have run.
    const migratedProfile = await readProfileRow();

    expect(migratedProfile).toBeTruthy();
    expect(migratedProfile?.id).toBe(BUSINESS_PROFILE_ID);
    expect(migratedProfile?.businessName).toBe("");

    const profile = await getBusinessProfile();

    expect(profile.businessName).toBe("");
  });
});
