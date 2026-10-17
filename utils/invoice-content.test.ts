import { describe, expect, it } from "vitest";
import { createBlankInvoice, invoiceDefault } from "~/stores/invoice-store";
import { isBlankInvoice, isLargeRemoval } from "~/utils/invoice-content";

describe("isBlankInvoice", () => {
  it("treats a new invoice as blank whatever day it was made", () => {
    expect(isBlankInvoice(createBlankInvoice())).toBe(true);
    expect(
      isBlankInvoice({ ...createBlankInvoice(), invoiceDate: "2020-01-01" })
    ).toBe(true);
  });

  it("notices any edit", () => {
    expect(isBlankInvoice({ ...createBlankInvoice(), title: "Quote" })).toBe(
      false
    );
    expect(
      isBlankInvoice({
        ...createBlankInvoice(),
        theme: { ...invoiceDefault.theme, font: "lora" }
      })
    ).toBe(false);
  });
});

describe("isLargeRemoval", () => {
  const written = {
    ...createBlankInvoice(),
    client: {
      ...invoiceDefault.client,
      content: "Acme Ltd\n1 High Street\nLondon\nUnited Kingdom"
    },
    notes: { ...invoiceDefault.notes, content: "Thanks for your business." }
  };

  it("spots a change that throws most of the content away", () => {
    expect(
      isLargeRemoval(written, {
        ...written,
        client: { ...written.client, content: "" },
        notes: { ...written.notes, content: "" }
      })
    ).toBe(true);
  });

  it("ignores small edits and nearly empty invoices", () => {
    expect(
      isLargeRemoval(written, {
        ...written,
        notes: { ...written.notes, content: "" }
      })
    ).toBe(false);
    expect(isLargeRemoval(createBlankInvoice(), createBlankInvoice())).toBe(
      false
    );
  });
});
