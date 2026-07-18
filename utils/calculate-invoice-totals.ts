import type { Invoice, InvoiceTotals } from "~/types";

// Rounds a single line amount to two decimal places, coercing non-numeric
// quantity/price to zero. Shared by the totals calculator and the view-model so
// a line's amount is computed one way everywhere.
export function calculateLineAmount(
  quantity: number,
  unitPrice: number
): number {
  const safeQuantity = Number(quantity) || 0;
  const safeUnitPrice = Number(unitPrice) || 0;

  return Math.round(safeQuantity * safeUnitPrice * 100) / 100;
}

// Derives the money totals from an invoice's inputs (items, tax, fees,
// discount, amount paid). Nothing here is persisted: totals are recomputed
// wherever the invoice is rendered, so stored or imported data can never carry
// stale numbers.
export function calculateInvoiceTotals(
  invoice: Pick<
    Invoice,
    "items" | "tax" | "fees" | "discounts" | "discountType" | "amountPaid"
  >
): InvoiceTotals {
  const items = invoice.items.map(item => ({
    ...item,
    amount: calculateLineAmount(item.quantity, item.unitPrice)
  }));

  // Sum is rounded explicitly so floating-point drift from summing per-item
  // amounts never leaks into the subtotal.
  const subtotal =
    Math.round(items.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;

  // A tax-exempt invoice charges no tax regardless of the stored rate, so a
  // reverse-charge or zero-rated invoice reads zero while keeping the rate the
  // user last entered.
  const taxAmount = invoice.tax.exempt
    ? 0
    : Math.round(subtotal * (Number(invoice.tax.percentage) || 0)) / 100;

  const fees = Number(invoice.fees) || 0;

  // A percentage discount is taken off the subtotal; a fixed discount is the
  // entered amount. Either way the amount is clamped below so it can never push
  // the grand total negative.
  const discountValue = Number(invoice.discounts) || 0;
  const rawDiscount =
    invoice.discountType === "percentage"
      ? Math.round(subtotal * discountValue) / 100
      : discountValue;

  // A discount can never push the grand total below zero: any discount beyond
  // the chargeable amount (subtotal + tax + fees) is dropped rather than billed
  // as a negative total.
  const chargeable = Math.round((subtotal + taxAmount + fees) * 100) / 100;
  const discountAmount = Math.min(Math.max(rawDiscount, 0), chargeable);

  const total = Math.max(
    0,
    Math.round((chargeable - discountAmount) * 100) / 100
  );

  // The balance due nets off any recorded payment/deposit. An overpayment
  // reads as a zero balance rather than a negative one.
  const amountPaid = Math.max(0, Number(invoice.amountPaid) || 0);
  const balanceDue = Math.max(0, Math.round((total - amountPaid) * 100) / 100);

  return { items, subtotal, taxAmount, discountAmount, total, balanceDue };
}
