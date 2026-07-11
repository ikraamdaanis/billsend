import { describe, expect, it } from "vitest";
import type { Invoice, InvoiceItem } from "~/types";
import { buildInvoiceViewModel } from "~/utils/build-invoice-view-model";

function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    id: "test",
    title: "Invoice",
    image: "",
    number: "INV-001",
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
    tax: { percentage: 0 },
    fees: 0,
    discounts: 0,
    terms: { label: "Terms", content: "" },
    paymentDetails: {
      label: "Payment details",
      bankName: "",
      accountNumber: "",
      iban: "",
      bic: "",
      sortCode: "",
      terms: ""
    },
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
    ...overrides
  };
}

describe("buildInvoiceViewModel", () => {
  describe("detailRows", () => {
    it("emits the number, invoice date, and due date rows in that order", () => {
      const { detailRows } = buildInvoiceViewModel(makeInvoice());

      expect(detailRows.map(row => row.id)).toEqual([
        "number",
        "invoiceDate",
        "dueDate"
      ]);
    });

    it("resolves each row's label from the invoice labels and value from the field", () => {
      const { detailRows } = buildInvoiceViewModel(
        makeInvoice({
          number: "INV-42",
          invoiceDate: "2026-02-01",
          dueDate: "2026-03-01",
          labels: {
            invoiceNumber: "Ref",
            invoiceDate: "Issued",
            paymentDue: "Pay by",
            subtotal: "Subtotal",
            tax: "Tax",
            fees: "Fees",
            discounts: "Discounts",
            total: "Total"
          }
        })
      );

      expect(detailRows).toEqual([
        {
          id: "number",
          labelKey: "invoiceNumber",
          label: "Ref",
          value: "INV-42"
        },
        {
          id: "invoiceDate",
          labelKey: "invoiceDate",
          label: "Issued",
          value: "2026-02-01"
        },
        {
          id: "dueDate",
          labelKey: "paymentDue",
          label: "Pay by",
          value: "2026-03-01"
        }
      ]);
    });
  });

  describe("lineItems", () => {
    it("formats unit price and computes the amount once per item", () => {
      const { lineItems } = buildInvoiceViewModel(
        makeInvoice({
          items: [
            makeItem({ description: "Design", quantity: 2, unitPrice: 50 }),
            makeItem({ description: "Build", quantity: 3, unitPrice: 10.5 })
          ]
        })
      );

      expect(lineItems[0]).toMatchObject({
        description: "Design",
        quantity: 2,
        unitPrice: "£50.00",
        amount: "£100.00"
      });
      expect(lineItems[1]).toMatchObject({
        description: "Build",
        quantity: 3,
        unitPrice: "£10.50",
        amount: "£31.50"
      });
    });

    it("formats with the invoice currency symbol", () => {
      const { lineItems } = buildInvoiceViewModel(
        makeInvoice({
          currency: "$",
          items: [makeItem({ quantity: 1, unitPrice: 9 })]
        })
      );

      expect(lineItems[0].unitPrice).toBe("$9.00");
      expect(lineItems[0].amount).toBe("$9.00");
    });

    it("renders a legible ASCII marker for the Riyal and Dirham symbols", () => {
      const riyal = buildInvoiceViewModel(
        makeInvoice({
          currency: "⃁",
          items: [makeItem({ quantity: 2, unitPrice: 50 })]
        })
      );

      expect(riyal.lineItems[0].unitPrice).toBe("SAR50.00");
      expect(riyal.lineItems[0].amount).toBe("SAR100.00");

      const dirham = buildInvoiceViewModel(
        makeInvoice({
          currency: "د.إ",
          items: [makeItem({ quantity: 1, unitPrice: 9 })]
        })
      );

      expect(dirham.lineItems[0].unitPrice).toBe("AED9.00");
      expect(dirham.lineItems[0].amount).toBe("AED9.00");
    });
  });

  describe("summaryRows", () => {
    it("orders the rows subtotal, tax, fees, discounts, total", () => {
      const { summaryRows } = buildInvoiceViewModel(makeInvoice());

      expect(summaryRows.map(row => row.id)).toEqual([
        "subtotal",
        "tax",
        "fees",
        "discounts",
        "total"
      ]);
    });

    it("keeps subtotal and total visible but hides tax, fees, and discounts when empty", () => {
      const { summaryRows } = buildInvoiceViewModel(makeInvoice());
      const visibleById = Object.fromEntries(
        summaryRows.map(row => [row.id, row.isVisible])
      );

      expect(visibleById).toEqual({
        subtotal: true,
        tax: false,
        fees: false,
        discounts: false,
        total: true
      });
    });

    it("shows tax, fees, and discounts once they have a value", () => {
      const { summaryRows } = buildInvoiceViewModel(
        makeInvoice({
          tax: { percentage: 20 },
          fees: 5,
          discounts: 3
        })
      );
      const visible = summaryRows
        .filter(row => row.isVisible)
        .map(row => row.id);

      expect(visible).toEqual([
        "subtotal",
        "tax",
        "fees",
        "discounts",
        "total"
      ]);
    });

    it("derives and formats each summary value and carries the tax percentage", () => {
      const { summaryRows } = buildInvoiceViewModel(
        makeInvoice({
          items: [makeItem({ quantity: 1, unitPrice: 100 })],
          tax: { percentage: 7.5 },
          fees: 12,
          discounts: 4
        })
      );
      const byId = Object.fromEntries(summaryRows.map(row => [row.id, row]));

      expect(byId.subtotal.value).toBe("£100.00");
      expect(byId.tax.value).toBe("£7.50");
      expect(byId.tax.percentage).toBe(7.5);
      expect(byId.fees.value).toBe("£12.00");
      expect(byId.discounts.value).toBe("£4.00");
      expect(byId.total.value).toBe("£115.50");
    });

    it("caps the displayed discount so the rows reconcile when over-discounted", () => {
      const { summaryRows } = buildInvoiceViewModel(
        makeInvoice({
          items: [makeItem({ quantity: 1, unitPrice: 100 })],
          tax: { percentage: 10 },
          fees: 5,
          discounts: 1000
        })
      );
      const byId = Object.fromEntries(summaryRows.map(row => [row.id, row]));

      expect(byId.discounts.value).toBe("£115.00");
      expect(byId.total.value).toBe("£0.00");
    });

    it("flags only the total row as the grand total", () => {
      const { summaryRows } = buildInvoiceViewModel(makeInvoice());
      const totalRows = summaryRows
        .filter(row => row.isTotal)
        .map(row => row.id);

      expect(totalRows).toEqual(["total"]);
    });
  });
});
