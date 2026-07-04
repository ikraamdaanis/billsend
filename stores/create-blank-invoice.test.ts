import { describe, expect, it } from "vitest";
import { createDefaultBusinessProfile } from "~/schema/business-profile";
import { createBlankInvoice, invoiceDefault } from "~/stores/invoice-store";
import type { BusinessProfile } from "~/types";

function profile(overrides: Partial<BusinessProfile> = {}): BusinessProfile {
  return { ...createDefaultBusinessProfile(), ...overrides };
}

describe("createBlankInvoice", () => {
  it("returns a blank invoice when no profile is supplied", () => {
    const invoice = createBlankInvoice();

    expect(invoice.seller.content).toBe("");
    expect(invoice.image).toBe("");
    expect(invoice.title).toBe(invoiceDefault.title);
  });

  it("gives each blank invoice fresh line-item ids", () => {
    const first = createBlankInvoice();
    const second = createBlankInvoice();

    expect(first.items[0].id).not.toBe(second.items[0].id);
    expect(first.items[0].id).not.toBe(invoiceDefault.items[0].id);
    expect(first.items[0].description).toBe(
      invoiceDefault.items[0].description
    );
  });

  it("seeds the seller content from the profile sender fields", () => {
    const invoice = createBlankInvoice(
      profile({
        businessName: "Acme Inc.",
        address: "123 Main St.",
        email: "info@acme.com",
        phone: "(555) 555-5555"
      })
    );

    expect(invoice.seller.content).toBe(
      "Acme Inc.\n123 Main St.\ninfo@acme.com\n(555) 555-5555"
    );
  });

  it("drops empty sender fields when composing the seller content", () => {
    const invoice = createBlankInvoice(
      profile({ businessName: "Acme Inc.", email: "info@acme.com" })
    );

    expect(invoice.seller.content).toBe("Acme Inc.\ninfo@acme.com");
  });

  it("seeds the logo from the profile", () => {
    const invoice = createBlankInvoice(profile({ logoImageId: "logo-123" }));

    expect(invoice.image).toBe("logo-123");
  });

  it("seeds the payment details from the profile", () => {
    const invoice = createBlankInvoice(
      profile({
        paymentDetails: {
          bankName: "Acme Bank",
          accountNumber: "12345678",
          iban: "GB29 NWBK 6016 1331 9268 19",
          sortCode: "12-34-56",
          terms: "Net 30"
        }
      })
    );

    expect(invoice.paymentDetails).toEqual({
      label: invoiceDefault.paymentDetails.label,
      bankName: "Acme Bank",
      accountNumber: "12345678",
      iban: "GB29 NWBK 6016 1331 9268 19",
      sortCode: "12-34-56",
      terms: "Net 30"
    });
  });

  it("leaves the payment details empty when no profile is supplied", () => {
    const invoice = createBlankInvoice();

    expect(invoice.paymentDetails).toEqual(invoiceDefault.paymentDetails);
  });

  it("keeps the seller label and placeholder from the default", () => {
    const invoice = createBlankInvoice(profile({ businessName: "Acme Inc." }));

    expect(invoice.seller.label).toBe(invoiceDefault.seller.label);
    expect(invoice.seller.placeholder).toBe(invoiceDefault.seller.placeholder);
  });

  it("is non-retroactive: editing the profile afterwards leaves an already-created invoice untouched", () => {
    const savedProfile = profile({ businessName: "Acme Inc." });
    const invoice = createBlankInvoice(savedProfile);

    savedProfile.businessName = "Renamed Ltd.";
    savedProfile.logoImageId = "new-logo";

    expect(invoice.seller.content).toBe("Acme Inc.");
    expect(invoice.image).toBe("");
  });

  it("is non-retroactive for payment details: editing the profile afterwards leaves the invoice untouched", () => {
    const savedProfile = profile({
      paymentDetails: {
        bankName: "Acme Bank",
        accountNumber: "12345678",
        iban: "",
        sortCode: "",
        terms: ""
      }
    });
    const invoice = createBlankInvoice(savedProfile);

    savedProfile.paymentDetails.bankName = "Renamed Bank";

    expect(invoice.paymentDetails.bankName).toBe("Acme Bank");
  });

  it("returns an independent invoice on each call", () => {
    const savedProfile = profile({ businessName: "Acme Inc." });
    const first = createBlankInvoice(savedProfile);

    first.seller.content = "Edited on this invoice only";

    const second = createBlankInvoice(savedProfile);

    expect(second.seller.content).toBe("Acme Inc.");
  });
});
