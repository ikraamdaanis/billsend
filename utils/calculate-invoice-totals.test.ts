import { describe, expect, it } from "vitest";
import type { Invoice, InvoiceItem } from "~/types";
import { calculateInvoiceTotals } from "~/utils/calculate-invoice-totals";

// A minimal, dependency-free invoice factory. The money math only reads
// `items`, `tax`, `fees`, and `discounts`, so the rest is filled with empty
// placeholders rather than imported from the store (keeps this suite a clean
// template for future ones).
function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    id: "test",
    title: "Invoice",
    image: "",
    number: "1",
    invoiceDate: "2026-01-01",
    dueDate: "2026-01-31",
    seller: { label: "From", content: "", placeholder: "" },
    client: { label: "To", content: "", placeholder: "" },
    items: [],
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
    subtotal: 0,
    tax: { percentage: 0, amount: 0 },
    fees: 0,
    discounts: 0,
    total: 0,
    terms: { label: "Terms", content: "" },
    pdfSettings: { backgroundColor: "#ffffff" },
    currency: "£",
    theme: {
      font: "geist",
      fontWeight: "Normal",
      size: "medium",
      accent: "#1a1a1a"
    },
    ...overrides
  };
}

function makeItem(overrides: Partial<InvoiceItem> = {}): InvoiceItem {
  return {
    id: crypto.randomUUID(),
    description: "Item",
    quantity: 1,
    unitPrice: 0,
    amount: 0,
    ...overrides
  };
}

describe("calculateInvoiceTotals", () => {
  it("sums item amounts into the subtotal and total", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({
        items: [
          makeItem({ quantity: 2, unitPrice: 50 }),
          makeItem({ quantity: 3, unitPrice: 10 })
        ]
      })
    );

    expect(invoice.items[0].amount).toBe(100);
    expect(invoice.items[1].amount).toBe(30);
    expect(invoice.subtotal).toBe(130);
    expect(invoice.total).toBe(130);
  });

  it("returns zeros for an invoice with no items", () => {
    const invoice = calculateInvoiceTotals(makeInvoice({ items: [] }));

    expect(invoice.subtotal).toBe(0);
    expect(invoice.tax.amount).toBe(0);
    expect(invoice.total).toBe(0);
  });

  it("rounds each item amount to two decimal places", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({ items: [makeItem({ quantity: 3, unitPrice: 0.335 })] })
    );

    expect(invoice.items[0].amount).toBe(1.01);
    expect(invoice.subtotal).toBe(1.01);
  });

  it("rounds the subtotal explicitly, absorbing per-item float drift", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({
        items: [
          makeItem({ quantity: 1, unitPrice: 0.1 }),
          makeItem({ quantity: 1, unitPrice: 0.2 })
        ]
      })
    );

    expect(invoice.subtotal).toBe(0.3);
  });

  it("applies a whole-number tax percentage to the subtotal", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({
        items: [makeItem({ quantity: 1, unitPrice: 100 })],
        tax: { percentage: 20, amount: 0 }
      })
    );

    expect(invoice.subtotal).toBe(100);
    expect(invoice.tax.amount).toBe(20);
    expect(invoice.total).toBe(120);
  });

  it("rounds fractional tax to two decimal places", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({
        items: [makeItem({ quantity: 1, unitPrice: 99.99 })],
        tax: { percentage: 7.5, amount: 0 }
      })
    );

    expect(invoice.subtotal).toBe(99.99);
    expect(invoice.tax.amount).toBe(7.5);
    expect(invoice.total).toBe(107.49);
  });

  it("adds fees on top of the subtotal and tax", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({
        items: [makeItem({ quantity: 1, unitPrice: 100 })],
        tax: { percentage: 10, amount: 0 },
        fees: 15
      })
    );

    expect(invoice.total).toBe(125);
  });

  it("subtracts discounts from the total", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({
        items: [makeItem({ quantity: 1, unitPrice: 100 })],
        discounts: 30
      })
    );

    expect(invoice.total).toBe(70);
  });

  it("coerces string-typed quantities, prices, tax, fees, and discounts", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({
        items: [
          makeItem({
            quantity: "2" as unknown as number,
            unitPrice: "49.5" as unknown as number
          })
        ],
        tax: { percentage: "10" as unknown as number, amount: 0 },
        fees: "5" as unknown as number,
        discounts: "4" as unknown as number
      })
    );

    expect(invoice.items[0].amount).toBe(99);
    expect(invoice.subtotal).toBe(99);
    expect(invoice.tax.amount).toBe(9.9);
    expect(invoice.total).toBe(109.9);
  });

  it("treats non-numeric strings as zero", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({
        items: [
          makeItem({
            quantity: "abc" as unknown as number,
            unitPrice: "xyz" as unknown as number
          })
        ]
      })
    );

    expect(invoice.items[0].amount).toBe(0);
    expect(invoice.subtotal).toBe(0);
    expect(invoice.total).toBe(0);
  });

  it("clamps the total at zero when the discount exceeds the chargeable amount", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({
        items: [makeItem({ quantity: 1, unitPrice: 100 })],
        tax: { percentage: 10, amount: 0 },
        fees: 5,
        discounts: 1000
      })
    );

    expect(invoice.subtotal).toBe(100);
    expect(invoice.tax.amount).toBe(10);
    expect(invoice.total).toBe(0);
  });

  it("clamps to zero exactly when the discount equals the chargeable amount", () => {
    const invoice = calculateInvoiceTotals(
      makeInvoice({
        items: [makeItem({ quantity: 1, unitPrice: 100 })],
        discounts: 100
      })
    );

    expect(invoice.total).toBe(0);
  });
});
