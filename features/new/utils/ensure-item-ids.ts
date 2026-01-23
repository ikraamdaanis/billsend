import type { Invoice } from "features/new/types";

export function ensureItemIds(invoice: Invoice): Invoice {
  const hasAllIds = invoice.items.every(item => item.id);

  if (hasAllIds) return invoice;

  return {
    ...invoice,
    items: invoice.items.map(item => ({
      ...item,
      id: item.id || crypto.randomUUID()
    }))
  };
}
