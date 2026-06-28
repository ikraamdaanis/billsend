import { describe, expect, it } from "vitest";
import type { Invoice } from "~/types";
import {
  DEFAULT_INVOICE_THEME,
  normalizeInvoice
} from "~/utils/normalize-invoice";

// Builds a fully-formed, current-shape invoice. Individual tests strip or swap
// fields to recreate the legacy/imported shapes normalizeInvoice has to absorb.
function makeCurrentInvoice(): Invoice {
  return {
    id: "abc",
    title: "Invoice",
    image: "",
    number: "42",
    invoiceDate: "2026-01-01",
    dueDate: "2026-01-31",
    seller: { label: "From", content: "Acme", placeholder: "" },
    client: { label: "To", content: "Client", placeholder: "" },
    items: [
      {
        id: "i1",
        description: "Work",
        quantity: 1,
        unitPrice: 100
      }
    ],
    tableSettings: {
      columnLabels: {
        description: "Item",
        quantity: "Quantity",
        unitPrice: "Unit Price",
        amount: "Amount"
      },
      backgroundColor: "#f9fafb",
      borderColor: "#e5e7eb"
    },
    labels: {
      invoiceNumber: "Invoice No.",
      invoiceDate: "Date",
      paymentDue: "Due date",
      subtotal: "Subtotal",
      tax: "Tax",
      fees: "Fees",
      discounts: "Discounts",
      total: "Total"
    },
    tax: { percentage: 0 },
    fees: 0,
    discounts: 0,
    terms: { label: "Terms", content: "" },
    pdfSettings: { backgroundColor: "#ffffff" },
    currency: "£",
    theme: {
      font: "lora",
      fontWeight: "Bold",
      size: "large",
      accent: "#123456"
    }
  };
}

describe("normalizeInvoice", () => {
  it("preserves a current-shape invoice (idempotent)", () => {
    const current = makeCurrentInvoice();
    const once = normalizeInvoice(current);
    const twice = normalizeInvoice(once);

    expect(once).toEqual(current);
    expect(twice).toEqual(once);
  });

  it("fills in a missing theme with the default", () => {
    const { theme: _theme, ...withoutTheme } = makeCurrentInvoice();
    const normalized = normalizeInvoice(withoutTheme as unknown as Invoice);

    expect(normalized.theme).toEqual(DEFAULT_INVOICE_THEME);
  });

  it("maps the legacy textFont onto the new theme font", () => {
    const { theme: _theme, ...rest } = makeCurrentInvoice();
    const legacy = { ...rest, theme: { textFont: "inter" } };
    const normalized = normalizeInvoice(legacy as unknown as Invoice);

    expect(normalized.theme.font).toBe("inter");
    expect(normalized.theme.size).toBe(DEFAULT_INVOICE_THEME.size);
    expect(normalized.theme.accent).toBe(DEFAULT_INVOICE_THEME.accent);
  });

  it("falls back to the default weight when the stored weight is unavailable", () => {
    const { theme: _theme, ...rest } = makeCurrentInvoice();
    const legacy = {
      ...rest,
      theme: { font: "geist", fontWeight: "Heavy" }
    };
    const normalized = normalizeInvoice(legacy as unknown as Invoice);

    expect(normalized.theme.fontWeight).toBe(DEFAULT_INVOICE_THEME.fontWeight);
  });

  it("collapses legacy per-column header settings into column labels", () => {
    const { tableSettings: _tableSettings, ...rest } = makeCurrentInvoice();
    const legacy = {
      ...rest,
      tableSettings: {
        descriptionHeaderSettings: { label: "Service" },
        quantityHeaderSettings: { label: "Hours" },
        unitPriceHeaderSettings: { label: "Rate" },
        amountHeaderSettings: { label: "Total" },
        backgroundColor: "#fef2f2",
        borderColor: "#fecaca"
      }
    };
    const normalized = normalizeInvoice(legacy as unknown as Invoice);

    expect(normalized.tableSettings.columnLabels).toEqual({
      description: "Service",
      quantity: "Hours",
      unitPrice: "Rate",
      amount: "Total"
    });
    expect(normalized.tableSettings.backgroundColor).toBe("#fef2f2");
    expect(normalized.tableSettings.borderColor).toBe("#fecaca");
  });

  it("supplies default table colours when none are stored", () => {
    const { tableSettings: _tableSettings, ...withoutTable } =
      makeCurrentInvoice();
    const normalized = normalizeInvoice(withoutTable as unknown as Invoice);

    expect(normalized.tableSettings.backgroundColor).toBe("#f9fafb");
    expect(normalized.tableSettings.borderColor).toBe("#e5e7eb");
    expect(normalized.tableSettings.columnLabels.description).toBe("Item");
  });

  it("merges partial labels over the defaults", () => {
    const { labels: _labels, ...rest } = makeCurrentInvoice();
    const legacy = { ...rest, labels: { total: "Grand Total" } };
    const normalized = normalizeInvoice(legacy as unknown as Invoice);

    expect(normalized.labels.total).toBe("Grand Total");
    expect(normalized.labels.subtotal).toBe("Subtotal");
    expect(normalized.labels.invoiceNumber).toBe("Invoice No.");
  });

  it("carries the money inputs through untouched", () => {
    const current = makeCurrentInvoice();
    const normalized = normalizeInvoice(current);

    expect(normalized.tax).toEqual(current.tax);
    expect(normalized.fees).toBe(current.fees);
    expect(normalized.discounts).toBe(current.discounts);
    expect(normalized.items).toEqual(current.items);
  });
});
