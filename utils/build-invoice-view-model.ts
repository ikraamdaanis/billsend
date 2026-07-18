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
import {
  calculateInvoiceTotals,
  calculateLineAmount
} from "~/utils/calculate-invoice-totals";

// Maps an invoice to an ordered, fully-formatted view-model so the HTML canvas
// and the PDF render from one source instead of duplicating ordering,
// conditional logic, and currency formatting across two trees. The smaller
// builders are exported so the canvas (which only has a slice of the store, not
// the whole Invoice) can derive the same rows without subscribing to everything.

export function buildDetailRows(input: {
  labels: InvoiceLabels;
  number: string;
  poNumber: string;
  invoiceDate: string;
  dueDate: string;
  servicePeriod: string;
}): InvoiceDetailRow[] {
  return [
    {
      id: "number",
      labelKey: "invoiceNumber",
      label: input.labels.invoiceNumber,
      value: input.number,
      isOptional: false
    },
    {
      id: "poNumber",
      labelKey: "poNumber",
      label: input.labels.poNumber,
      value: input.poNumber,
      isOptional: true
    },
    {
      id: "invoiceDate",
      labelKey: "invoiceDate",
      label: input.labels.invoiceDate,
      value: input.invoiceDate,
      isOptional: false
    },
    {
      id: "dueDate",
      labelKey: "paymentDue",
      label: input.labels.paymentDue,
      value: input.dueDate,
      isOptional: false
    },
    {
      id: "servicePeriod",
      labelKey: "servicePeriod",
      label: input.labels.servicePeriod,
      value: input.servicePeriod,
      isOptional: true
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
    unit: item.unit,
    unitPrice: formatCurrency(item.unitPrice, currency),
    amount: formatCurrency(
      calculateLineAmount(item.quantity, item.unitPrice),
      currency
    )
  };
}

// Appends the ISO currency code to a formatted grand-total value when one is
// set (e.g. "£115.50 GBP"), so a bare "$" is disambiguated on the document.
function withCurrencyCode(value: string, currencyCode: string): string {
  const code = currencyCode.trim();

  return code ? `${value} ${code}` : value;
}

function buildSummaryRows(input: {
  labels: InvoiceLabels;
  subtotal: number;
  tax: { percentage: number; amount: number; exempt: boolean; note: string };
  fees: number;
  discountAmount: number;
  discountType: Invoice["discountType"];
  discountValue: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  currencyCode: string;
}): InvoiceSummaryRow[] {
  const { labels, currency } = input;
  const hasPayment = input.amountPaid > 0;

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
      value: input.tax.exempt
        ? input.tax.note.trim() || "Exempt"
        : formatCurrency(input.tax.amount, currency),
      percentage: input.tax.exempt ? undefined : input.tax.percentage,
      note: input.tax.exempt ? input.tax.note.trim() : undefined,
      isVisible: input.tax.exempt || input.tax.percentage > 0,
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
      value: `-${formatCurrency(input.discountAmount, currency)}`,
      percentage:
        input.discountType === "percentage" ? input.discountValue : undefined,
      isVisible: input.discountValue > 0,
      isTotal: false
    },
    {
      id: "total",
      label: labels.total,
      value: withCurrencyCode(
        formatCurrency(input.total, currency),
        input.currencyCode
      ),
      // Without a recorded payment the grand total is the final figure; with a
      // payment the balance-due row below becomes the emphasised total instead.
      isVisible: true,
      isTotal: !hasPayment
    },
    {
      id: "amountPaid",
      label: labels.amountPaid,
      value: `-${formatCurrency(input.amountPaid, currency)}`,
      isVisible: hasPayment,
      isTotal: false
    },
    {
      id: "balanceDue",
      label: labels.balanceDue,
      value: withCurrencyCode(
        formatCurrency(input.balanceDue, currency),
        input.currencyCode
      ),
      isVisible: hasPayment,
      isTotal: hasPayment
    }
  ];
}

export function buildInvoiceViewModel(invoice: Invoice): InvoiceViewModel {
  const totals = calculateInvoiceTotals(invoice);

  return {
    detailRows: buildDetailRows(invoice),
    lineItems: invoice.items.map(item =>
      buildLineItemRow(item, invoice.currency)
    ),
    summaryRows: buildSummaryRows({
      labels: invoice.labels,
      subtotal: totals.subtotal,
      tax: {
        percentage: invoice.tax.percentage,
        amount: totals.taxAmount,
        exempt: invoice.tax.exempt,
        note: invoice.tax.note
      },
      fees: invoice.fees,
      discountAmount: totals.discountAmount,
      discountType: invoice.discountType,
      discountValue: invoice.discounts,
      total: totals.total,
      amountPaid: invoice.amountPaid,
      balanceDue: totals.balanceDue,
      currency: invoice.currency,
      currencyCode: invoice.currencyCode
    })
  };
}
