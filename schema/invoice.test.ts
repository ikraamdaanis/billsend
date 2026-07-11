import { describe, expect, it } from "vitest";
import { invoiceSchema } from "~/schema/invoice";
import { invoiceDefault } from "~/stores/invoice-store";

describe("invoiceSchema line-item resilience", () => {
  // The regression guard for the "one bad item wipes them all" bug: resilience
  // is on each element, so an unparseable entry drops only itself.
  it("drops only the unparseable line items, keeping the valid ones", () => {
    const input: unknown = {
      ...invoiceDefault,
      items: [
        { id: "a", description: "Design", quantity: 2, unitPrice: 100 },
        null,
        "garbage",
        42,
        { id: "b", description: "Dev", quantity: 1, unitPrice: 50 }
      ]
    };

    const parsed = invoiceSchema.parse(input);

    expect(parsed.items).toHaveLength(2);
    expect(parsed.items.map(item => item.description)).toEqual([
      "Design",
      "Dev"
    ]);
  });

  it("repairs a partial item rather than dropping it", () => {
    const input: unknown = {
      ...invoiceDefault,
      items: [{ description: "Only a description" }]
    };

    const parsed = invoiceSchema.parse(input);

    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].description).toBe("Only a description");
    expect(parsed.items[0].quantity).toBe(0);
    expect(parsed.items[0].unitPrice).toBe(0);
  });

  it("recovers to an empty list when items is not an array", () => {
    const input: unknown = { ...invoiceDefault, items: "not an array" };

    const parsed = invoiceSchema.parse(input);

    expect(parsed.items).toEqual([]);
  });
});
