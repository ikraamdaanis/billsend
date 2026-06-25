import { formatCurrency } from "~/consts/currencies";
import type {
  Invoice,
  InvoiceDetailRow,
  InvoiceItem,
  InvoiceLabels,
  InvoiceLineItemRow,
  InvoiceSummaryRow,
  InvoiceViewModel
} from "~/types";

// Maps an invoice to an ordered, fully-formatted view-model so the HTML canvas
// and the PDF render from one source instead of duplicating ordering,
// conditional logic, and currency formatting across two trees. The smaller
// builders are exported so the canvas (which only has a slice of the store, not
// the whole Invoice) can derive the same rows without subscribing to everything.

export function buildDetailRows(input: {
  labels: InvoiceLabels;
  number: string;
  invoiceDate: string;
  dueDate: string;
}): InvoiceDetailRow[] {
  return [
    {
      id: "number",
      labelKey: "invoiceNumber",
      label: input.labels.invoiceNumber,
      value: input.number
    },
    {
      id: "invoiceDate",
      labelKey: "invoiceDate",
      label: input.labels.invoiceDate,
      value: input.invoiceDate
    },
    {
      id: "dueDate",
      labelKey: "paymentDue",
      label: input.labels.paymentDue,
      value: input.dueDate
    }
  ];
}

export function buildLineItemRow(
  item: InvoiceItem,
  currency: string
): InvoiceLineItemRow {
  return {
    id: item.id,
    description: item.description,
    quantity: item.quantity,
    unitPrice: formatCurrency(item.unitPrice, currency),
    amount: formatCurrency(item.quantity * item.unitPrice, currency)
  };
}

function buildSummaryRows(input: {
  labels: InvoiceLabels;
  subtotal: number;
  tax: { percentage: number; amount: number };
  fees: number;
  discounts: number;
  total: number;
  currency: string;
}): InvoiceSummaryRow[] {
  const { labels, currency } = input;

  return [
    {
      id: "subtotal",
      label: labels.subtotal,
      value: formatCurrency(input.subtotal, currency),
      isVisible: true,
      isTotal: false
    },
    {
      id: "tax",
      label: labels.tax,
      value: formatCurrency(input.tax.amount, currency),
      percentage: input.tax.percentage,
      isVisible: input.tax.percentage > 0,
      isTotal: false
    },
    {
      id: "fees",
      label: labels.fees,
      value: formatCurrency(input.fees, currency),
      isVisible: input.fees > 0,
      isTotal: false
    },
    {
      id: "discounts",
      label: labels.discounts,
      value: formatCurrency(input.discounts, currency),
      isVisible: input.discounts > 0,
      isTotal: false
    },
    {
      id: "total",
      label: labels.total,
      value: formatCurrency(input.total, currency),
      isVisible: true,
      isTotal: true
    }
  ];
}

export function buildInvoiceViewModel(invoice: Invoice): InvoiceViewModel {
  return {
    detailRows: buildDetailRows(invoice),
    lineItems: invoice.items.map(item =>
      buildLineItemRow(item, invoice.currency)
    ),
    summaryRows: buildSummaryRows(invoice)
  };
}
