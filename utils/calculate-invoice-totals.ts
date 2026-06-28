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

// Derives the money totals from an invoice's inputs (items, tax %, fees,
// discounts). Nothing here is persisted: totals are recomputed wherever the
// invoice is rendered, so stored or imported data can never carry stale numbers.
export function calculateInvoiceTotals(
  invoice: Pick<Invoice, "items" | "tax" | "fees" | "discounts">
): InvoiceTotals {
  const items = invoice.items.map(item => ({
    ...item,
    amount: calculateLineAmount(item.quantity, item.unitPrice)
  }));

  // Sum is rounded explicitly so floating-point drift from summing per-item
  // amounts never leaks into the subtotal.
  const subtotal =
    Math.round(items.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;

  const taxAmount =
    Math.round(subtotal * (Number(invoice.tax.percentage) || 0)) / 100;

  const fees = Number(invoice.fees) || 0;
  const discounts = Number(invoice.discounts) || 0;

  // A discount can never push the grand total below zero: any discount beyond
  // the chargeable amount (subtotal + tax + fees) is dropped rather than billed
  // as a negative total.
  const total = Math.max(
    0,
    Math.round((subtotal + taxAmount + fees - discounts) * 100) / 100
  );

  return { items, subtotal, taxAmount, total };
}
