import type { Invoice } from "~/types";

export function calculateInvoiceTotals(invoice: Invoice): Invoice {
  // Calculate items with amounts (immutable - create new item objects)
  const itemsWithAmounts = invoice.items.map(item => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const amount = Math.round(quantity * unitPrice * 100) / 100;

    return { ...item, amount };
  });

  // Calculate the sum of all items, rounded explicitly so floating-point drift
  // from summing per-item amounts never leaks into the subtotal.
  const subtotal =
    Math.round(
      itemsWithAmounts.reduce((sum, item) => sum + item.amount, 0) * 100
    ) / 100;

  // Calculate tax amount
  const taxAmount =
    Math.round(subtotal * (Number(invoice.tax.percentage) || 0)) / 100;

  // Get fees and discounts
  const fees = Number(invoice.fees) || 0;
  const discounts = Number(invoice.discounts) || 0;

  // Calculate total. A discount can never push the grand total below zero: any
  // discount beyond the chargeable amount (subtotal + tax + fees) is dropped
  // rather than billed as a negative total.
  const total = Math.max(
    0,
    Math.round((subtotal + taxAmount + fees - discounts) * 100) / 100
  );

  return {
    ...invoice,
    items: itemsWithAmounts,
    subtotal,
    tax: {
      ...invoice.tax,
      amount: taxAmount
    },
    total
  };
}
