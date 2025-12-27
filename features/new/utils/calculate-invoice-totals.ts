import type { Invoice } from "features/new/types";

export function calculateInvoiceTotals(invoice: Invoice): Invoice {
  // Calculate the sum of all items
  const subtotal = invoice.items.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const itemTotal = quantity * unitPrice;

    // Update the item's amount
    item.amount = itemTotal;

    return sum + itemTotal;
  }, 0);

  // Calculate tax amount
  const taxAmount = (subtotal * (Number(invoice.tax.percentage) || 0)) / 100;

  // Get fees and discounts
  const fees = Number(invoice.fees) || 0;
  const discounts = Number(invoice.discounts) || 0;

  // Calculate total
  const total = subtotal + taxAmount + fees - discounts;

  return {
    ...invoice,
    subtotal: subtotal,
    tax: {
      ...invoice.tax,
      amount: taxAmount
    },
    total: total
  };
}
