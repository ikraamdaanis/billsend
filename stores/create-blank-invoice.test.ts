import { describe, expect, it } from "vitest";
import { createBlankInvoice, invoiceDefault } from "~/stores/invoice-store";

describe("createBlankInvoice", () => {
  it("returns a fully blank invoice", () => {
    const invoice = createBlankInvoice();

    expect(invoice.seller.content).toBe("");
    expect(invoice.image).toBe("");
    expect(invoice.paymentDetails).toEqual(invoiceDefault.paymentDetails);
    expect(invoice.title).toBe(invoiceDefault.title);
  });

  it("carries the static default invoice number", () => {
    expect(createBlankInvoice().number).toBe("INV-0001");
    expect(createBlankInvoice().number).toBe(invoiceDefault.number);
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

  it("keeps the seller label and placeholder from the default", () => {
    const invoice = createBlankInvoice();

    expect(invoice.seller.label).toBe(invoiceDefault.seller.label);
    expect(invoice.seller.placeholder).toBe(invoiceDefault.seller.placeholder);
  });

  it("returns an independent invoice on each call", () => {
    const first = createBlankInvoice();

    first.seller.content = "Edited on this invoice only";

    const second = createBlankInvoice();

    expect(second.seller.content).toBe("");
  });
});
