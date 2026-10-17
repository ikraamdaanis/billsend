import { describe, expect, it } from "vitest";
import { invoiceDefault } from "~/stores/invoice-store";
import { deriveInvoiceName } from "~/utils/invoice-name";

function named(number: string, client: string) {
  return deriveInvoiceName({
    number,
    client: { ...invoiceDefault.client, content: client }
  });
}

describe("deriveInvoiceName", () => {
  it("joins the number and the client's first line", () => {
    expect(named("INV-0042", "Acme Ltd\n1 High St")).toBe(
      "INV-0042 · Acme Ltd"
    );
  });

  it("uses whichever one there is", () => {
    expect(named("INV-0042", "")).toBe("INV-0042");
    expect(named("", "\n  Acme Ltd  \n")).toBe("Acme Ltd");
  });

  it("is Untitled invoice with neither", () => {
    expect(named("  ", "  \n ")).toBe("Untitled invoice");
  });

  it("cuts a long client line short", () => {
    const name = named("", "A".repeat(200));

    expect(name.length).toBeLessThanOrEqual(61);
    expect(name.endsWith("…")).toBe(true);
  });
});
