import Dexie from "dexie";
import { describe, expect, it } from "vitest";
import { getBusinessProfile, saveBusinessProfile } from "~/db";
import {
  BUSINESS_PROFILE_ID,
  createDefaultBusinessProfile
} from "~/schema/business-profile";

// Reads the persisted profile through an independent connection to prove it
// survives beyond the module's singleton, standing in for a reload/restart.
async function readProfileFromFreshConnection() {
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

// Writes a raw profile record straight to the table, bypassing the schema, to
// stand in for a record saved before a field existed.
async function saveRawProfile(raw: Record<string, unknown>) {
  const connection = new Dexie("InvoiceDatabase");
  connection.version(5).stores({
    templates: "id, name, createdAt, updatedAt",
    invoices: "id, name, createdAt, updatedAt",
    images: "id",
    profiles: "id"
  });
  await connection.open();
  await connection.table("profiles").put({ ...raw, id: BUSINESS_PROFILE_ID });
  connection.close();
}

describe("business profile db operations", () => {
  it("provisions a default profile the first time it is read", async () => {
    const profile = await getBusinessProfile();

    expect(profile).toEqual(createDefaultBusinessProfile());
    expect(await readProfileFromFreshConnection()).toBeTruthy();
  });

  it("saves an edited profile that survives a fresh connection", async () => {
    await saveBusinessProfile({
      ...createDefaultBusinessProfile(),
      businessName: "Acme Inc.",
      email: "info@acme.com",
      logoImageId: "logo-1"
    });

    const reloaded = await getBusinessProfile();

    expect(reloaded.businessName).toBe("Acme Inc.");
    expect(reloaded.email).toBe("info@acme.com");
    expect(reloaded.logoImageId).toBe("logo-1");

    const persisted = await readProfileFromFreshConnection();

    expect(persisted?.businessName).toBe("Acme Inc.");
  });

  it("saves and reloads the profile payment details", async () => {
    await saveBusinessProfile({
      ...createDefaultBusinessProfile(),
      paymentDetails: {
        bankName: "Acme Bank",
        accountNumber: "12345678",
        iban: "GB29 NWBK 6016 1331 9268 19",
        sortCode: "12-34-56",
        terms: "Net 30"
      }
    });

    const reloaded = await getBusinessProfile();

    expect(reloaded.paymentDetails).toEqual({
      bankName: "Acme Bank",
      accountNumber: "12345678",
      iban: "GB29 NWBK 6016 1331 9268 19",
      sortCode: "12-34-56",
      terms: "Net 30"
    });
  });

  it("defaults missing payment details on a legacy profile record", async () => {
    await saveBusinessProfile(createDefaultBusinessProfile());
    const { paymentDetails: _paymentDetails, ...legacy } =
      createDefaultBusinessProfile();
    await saveRawProfile(legacy);

    const reloaded = await getBusinessProfile();

    expect(reloaded.paymentDetails).toEqual({
      bankName: "",
      accountNumber: "",
      iban: "",
      sortCode: "",
      terms: ""
    });
  });

  it("always stores the profile under the singleton id", async () => {
    await saveBusinessProfile({
      ...createDefaultBusinessProfile(),
      id: "some-other-id",
      businessName: "Reassigned"
    });

    const persisted = await readProfileFromFreshConnection();

    expect(persisted?.id).toBe(BUSINESS_PROFILE_ID);
    expect(persisted?.businessName).toBe("Reassigned");
  });
});
