import { describe, expect, it } from "vitest";
import {
  advanceInvoiceNumber,
  formatInvoiceNumber
} from "~/utils/invoice-numbering";

describe("formatInvoiceNumber", () => {
  it("renders the prefix followed by the zero-padded counter", () => {
    expect(
      formatInvoiceNumber({ prefix: "INV-", padding: 4, nextNumber: 42 })
    ).toBe("INV-0042");
  });

  it("renders the first invoice as prefix + a padded 1", () => {
    expect(
      formatInvoiceNumber({ prefix: "INV-", padding: 4, nextNumber: 1 })
    ).toBe("INV-0001");
  });

  it("does not pad when padding is zero", () => {
    expect(
      formatInvoiceNumber({ prefix: "INV-", padding: 0, nextNumber: 7 })
    ).toBe("INV-7");
  });

  it("never truncates a number wider than the padding", () => {
    expect(
      formatInvoiceNumber({ prefix: "INV-", padding: 2, nextNumber: 12345 })
    ).toBe("INV-12345");
  });

  it("supports an empty prefix", () => {
    expect(formatInvoiceNumber({ prefix: "", padding: 3, nextNumber: 5 })).toBe(
      "005"
    );
  });
});

describe("advanceInvoiceNumber", () => {
  it("increments the counter by one", () => {
    expect(
      advanceInvoiceNumber({ prefix: "INV-", padding: 4, nextNumber: 1 })
    ).toEqual({ prefix: "INV-", padding: 4, nextNumber: 2 });
  });

  it("leaves the prefix and padding untouched", () => {
    const advanced = advanceInvoiceNumber({
      prefix: "ACME-",
      padding: 6,
      nextNumber: 99
    });

    expect(advanced.prefix).toBe("ACME-");
    expect(advanced.padding).toBe(6);
    expect(advanced.nextNumber).toBe(100);
  });

  it("does not mutate its input", () => {
    const numbering = { prefix: "INV-", padding: 4, nextNumber: 1 };
    advanceInvoiceNumber(numbering);

    expect(numbering.nextNumber).toBe(1);
  });

  it("renders successive counters in the configured format", () => {
    let numbering = { prefix: "INV-", padding: 4, nextNumber: 1 };
    const rendered = [];

    for (let index = 0; index < 3; index++) {
      rendered.push(formatInvoiceNumber(numbering));
      numbering = advanceInvoiceNumber(numbering);
    }

    expect(rendered).toEqual(["INV-0001", "INV-0002", "INV-0003"]);
  });
});
