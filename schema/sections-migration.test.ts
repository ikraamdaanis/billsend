import { describe, expect, it } from "vitest";
import { DEFAULT_INVOICE_SECTIONS } from "~/schema/invoice";
import { migrateInvoiceData } from "~/schema/migrations";

describe("section switches migration (v1 -> v2)", () => {
  it("switches on the optional sections that already have content", () => {
    const invoice = migrateInvoiceData(
      {
        shipping: { label: "Ship to", content: "1 Dock Road", placeholder: "" },
        notes: { label: "Notes", content: "Thanks!" },
        terms: { label: "Terms", content: "   " },
        latePayment: { label: "Late payment", content: "" }
      },
      1
    );

    expect(invoice.sections).toEqual({
      ...DEFAULT_INVOICE_SECTIONS,
      shipping: true,
      notes: true,
      terms: false,
      latePayment: false
    });
  });

  it("keeps the pricing rows and payment details on, as the editor showed them", () => {
    const invoice = migrateInvoiceData({}, 1);

    expect(invoice.sections.discounts).toBe(true);
    expect(invoice.sections.tax).toBe(true);
    expect(invoice.sections.paymentDetails).toBe(true);
    expect(invoice.sections.shipping).toBe(false);
  });

  it("leaves stored switches alone", () => {
    const sections = { ...DEFAULT_INVOICE_SECTIONS, logo: false, notes: true };
    const invoice = migrateInvoiceData(
      { sections, notes: { label: "Notes", content: "" } },
      1
    );

    expect(invoice.sections).toEqual(sections);
  });

  it("repairs a corrupt switch to its default", () => {
    const invoice = migrateInvoiceData(
      { sections: { ...DEFAULT_INVOICE_SECTIONS, tax: "yes" } },
      2
    );

    expect(invoice.sections.tax).toBe(DEFAULT_INVOICE_SECTIONS.tax);
  });
});
