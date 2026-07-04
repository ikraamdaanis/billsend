import { describe, expect, it } from "vitest";
import {
  BUSINESS_PROFILE_ID,
  createDefaultBusinessProfile,
  normalizeBusinessProfile
} from "~/schema/business-profile";

describe("createDefaultBusinessProfile", () => {
  it("produces an empty profile under the singleton id", () => {
    expect(createDefaultBusinessProfile()).toEqual({
      id: BUSINESS_PROFILE_ID,
      businessName: "",
      address: "",
      email: "",
      phone: "",
      logoImageId: "",
      paymentDetails: {
        bankName: "",
        accountNumber: "",
        iban: "",
        sortCode: "",
        terms: ""
      },
      numbering: {
        prefix: "INV-",
        padding: 4,
        nextNumber: 1
      }
    });
  });
});

describe("normalizeBusinessProfile", () => {
  it("repairs a non-object input into a default profile (never throws)", () => {
    expect(() => normalizeBusinessProfile(null)).not.toThrow();
    expect(normalizeBusinessProfile("garbage")).toEqual(
      createDefaultBusinessProfile()
    );
  });

  it("fills missing fields with defaults", () => {
    expect(normalizeBusinessProfile({ businessName: "Acme Inc." })).toEqual({
      id: BUSINESS_PROFILE_ID,
      businessName: "Acme Inc.",
      address: "",
      email: "",
      phone: "",
      logoImageId: "",
      paymentDetails: {
        bankName: "",
        accountNumber: "",
        iban: "",
        sortCode: "",
        terms: ""
      },
      numbering: {
        prefix: "INV-",
        padding: 4,
        nextNumber: 1
      }
    });
  });

  it("preserves valid stored fields", () => {
    const stored = {
      id: BUSINESS_PROFILE_ID,
      businessName: "Acme Inc.",
      address: "123 Main St.",
      email: "info@acme.com",
      phone: "(555) 555-5555",
      logoImageId: "logo-1",
      paymentDetails: {
        bankName: "Acme Bank",
        accountNumber: "12345678",
        iban: "GB29 NWBK 6016 1331 9268 19",
        sortCode: "12-34-56",
        terms: "Net 30"
      },
      numbering: {
        prefix: "ACME-",
        padding: 3,
        nextNumber: 17
      }
    };

    expect(normalizeBusinessProfile(stored)).toEqual(stored);
  });

  it("defaults the numbering config on a legacy profile record", () => {
    const { numbering: _numbering, ...legacy } = createDefaultBusinessProfile();

    expect(normalizeBusinessProfile(legacy).numbering).toEqual({
      prefix: "INV-",
      padding: 4,
      nextNumber: 1
    });
  });

  it("repairs corrupt numbering fields while keeping the valid ones", () => {
    const normalized = normalizeBusinessProfile({
      businessName: "Acme Inc.",
      numbering: { prefix: "OK-", padding: -5, nextNumber: "nope" }
    });

    expect(normalized.businessName).toBe("Acme Inc.");
    expect(normalized.numbering).toEqual({
      prefix: "OK-",
      padding: 4,
      nextNumber: 1
    });
  });

  it("coerces a corrupt field to its default without dropping the record", () => {
    const normalized = normalizeBusinessProfile({
      businessName: 42,
      email: "info@acme.com"
    });

    expect(normalized.businessName).toBe("");
    expect(normalized.email).toBe("info@acme.com");
  });
});
