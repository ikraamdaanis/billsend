import Dexie from "dexie";
import { beforeEach, describe, expect, it } from "vitest";
import {
  getBusinessProfile,
  getImageBlob,
  saveBusinessProfile,
  saveImage
} from "~/db";
import { createDefaultBusinessProfile } from "~/schema/business-profile";
import { buildExportData } from "~/utils/export-data";
import { executeImport, parseExportFile } from "~/utils/import-data";
import { formatInvoiceNumber } from "~/utils/invoice-numbering";

// Clears every table through an independent connection so each test starts from
// an empty database, matching a fresh device.
async function resetDb() {
  const connection = new Dexie("InvoiceDatabase");
  connection.version(5).stores({
    templates: "id, name, createdAt, updatedAt",
    invoices: "id, name, createdAt, updatedAt",
    images: "id",
    profiles: "id"
  });
  await connection.open();
  await Promise.all([
    connection.table("templates").clear(),
    connection.table("invoices").clear(),
    connection.table("images").clear(),
    connection.table("profiles").clear()
  ]);
  connection.close();
}

function toFile(value: unknown): File {
  return new File([JSON.stringify(value)], "billsend-export.json", {
    type: "application/json"
  });
}

const CONFIGURED_PROFILE = {
  ...createDefaultBusinessProfile(),
  businessName: "Acme Inc.",
  address: "1 Main Street",
  email: "hello@acme.com",
  phone: "555-0100",
  logoImageId: "logo-original",
  paymentDetails: {
    bankName: "Acme Bank",
    accountNumber: "12345678",
    iban: "GB29 NWBK 6016 1331 9268 19",
    bic: "NWBKGB2L",
    sortCode: "12-34-56",
    terms: "Net 30"
  },
  numbering: { prefix: "ACME-", padding: 3, nextNumber: 8 }
};

describe("business profile backup/restore", () => {
  beforeEach(async () => {
    await resetDb();
  });

  it("round-trips the profile, payment details, and numbering", async () => {
    const logoBytes = new Uint8Array([1, 2, 3, 4, 5]);
    await saveImage(
      "logo-original",
      new Blob([logoBytes], { type: "image/png" }),
      "image/png"
    );
    await saveBusinessProfile(CONFIGURED_PROFILE);

    const exported = await buildExportData();

    await saveBusinessProfile(createDefaultBusinessProfile());

    const result = await executeImport(exported);
    const restored = await getBusinessProfile();

    expect(result.profileImported).toBe(true);
    expect(restored.businessName).toBe("Acme Inc.");
    expect(restored.address).toBe("1 Main Street");
    expect(restored.email).toBe("hello@acme.com");
    expect(restored.phone).toBe("555-0100");
    expect(restored.paymentDetails).toEqual(CONFIGURED_PROFILE.paymentDetails);
    expect(restored.numbering).toEqual({
      prefix: "ACME-",
      padding: 3,
      nextNumber: 8
    });
  });

  it("reproduces the next-number behaviour unchanged", async () => {
    await saveBusinessProfile(CONFIGURED_PROFILE);
    const before = formatInvoiceNumber(CONFIGURED_PROFILE.numbering);

    const exported = await buildExportData();

    await saveBusinessProfile(createDefaultBusinessProfile());
    await executeImport(exported);

    const restored = await getBusinessProfile();

    expect(formatInvoiceNumber(restored.numbering)).toBe(before);
    expect(before).toBe("ACME-008");
  });

  it("remaps the logo onto the freshly imported image", async () => {
    const logoBytes = new Uint8Array([9, 8, 7, 6]);
    await saveImage(
      "logo-original",
      new Blob([logoBytes], { type: "image/png" }),
      "image/png"
    );
    await saveBusinessProfile(CONFIGURED_PROFILE);

    const exported = await buildExportData();

    await resetDb();

    await executeImport(exported);
    const restored = await getBusinessProfile();

    expect(restored.logoImageId).not.toBe("");
    expect(restored.logoImageId).not.toBe("logo-original");

    const blob = await getImageBlob(restored.logoImageId);

    expect(blob).toBeTruthy();
    const bytes = new Uint8Array(
      (await blob?.arrayBuffer()) ?? new ArrayBuffer(0)
    );

    expect(Array.from(bytes)).toEqual([9, 8, 7, 6]);
  });

  it("imports an older export without a profile using existing defaults", async () => {
    await saveBusinessProfile(createDefaultBusinessProfile());
    const exported = await buildExportData();
    const { profile: _profile, ...legacy } = exported;

    const parsed = await parseExportFile(
      toFile({ ...legacy, meta: { ...legacy.meta, version: 1 } })
    );

    expect(parsed.profile).toBeUndefined();

    const result = await executeImport(parsed);
    const restored = await getBusinessProfile();

    expect(result.profileImported).toBe(false);
    expect(restored).toEqual(createDefaultBusinessProfile());
  });

  it("validates and repairs a corrupt profile with the Zod schema on parse", async () => {
    const exported = await buildExportData();
    const corrupt = {
      ...exported,
      profile: {
        id: "business-profile",
        businessName: "Repaired Co.",
        numbering: { prefix: "X-", padding: 999, nextNumber: 0 }
      }
    };

    const parsed = await parseExportFile(toFile(corrupt));

    expect(parsed.profile?.businessName).toBe("Repaired Co.");
    expect(parsed.profile?.numbering).toEqual({
      prefix: "X-",
      padding: 4,
      nextNumber: 1
    });
    expect(parsed.profile?.paymentDetails).toEqual({
      bankName: "",
      accountNumber: "",
      iban: "",
      bic: "",
      sortCode: "",
      terms: ""
    });
  });
});
