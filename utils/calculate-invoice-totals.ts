import type { Invoice } from "types";

export function calculateInvoiceTotals(invoice: Invoice): Invoice {
  // Calculate items with amounts (immutable - create new item objects)
  const itemsWithAmounts = invoice.items.map(item => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const amount = quantity * unitPrice;

    return { ...item, amount };
  });

  // Calculate the sum of all items
  const subtotal = itemsWithAmounts.reduce((sum, item) => sum + item.amount, 0);

  // Calculate tax amount
  const taxAmount = (subtotal * (Number(invoice.tax.percentage) || 0)) / 100;

  // Get fees and discounts
  const fees = Number(invoice.fees) || 0;
  const discounts = Number(invoice.discounts) || 0;

  // Calculate total
  const total = subtotal + taxAmount + fees - discounts;

  return {
    ...invoice,
    items: itemsWithAmounts,
    subtotal: subtotal,
    tax: {
      ...invoice.tax,
      amount: taxAmount
    },
    total: total
  };
}
