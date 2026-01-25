import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { invoiceAtom } from "state/invoice";
import type { InvoiceItem } from "types";
import { calculateInvoiceTotals } from "utils/calculate-invoice-totals";

// Focused atoms for pricing values
export const subtotalAtom = atom(get => get(invoiceAtom).subtotal);
export const subtotalSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("subtotalSettings")
);

export const taxAtom = focusAtom(invoiceAtom, o => o.prop("tax"));
export const taxSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("taxSettings")
);

export const feesAtom = focusAtom(invoiceAtom, o => o.prop("fees"));
export const feesSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("feesSettings")
);

export const discountsAtom = focusAtom(invoiceAtom, o => o.prop("discounts"));
export const discountsSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("discountsSettings")
);

export const totalAtom = atom(get => get(invoiceAtom).total);
export const totalSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("totalSettings")
);

// Utility atoms that perform calculations
export const addInvoiceItemAtom = atom(
  null,
  (_get, set, newItem: Omit<InvoiceItem, "amount">) => {
    const amount = newItem.quantity * newItem.unitPrice;
    set(invoiceAtom, draft => {
      draft.items.push({ ...newItem, amount });
      const updated = calculateInvoiceTotals(draft);
      Object.assign(draft, updated);
    });
  }
);

// Atom for recalculating pricing
export const updateInvoicePricingAtom = atom(null, (_get, set) => {
  set(invoiceAtom, draft => {
    const updated = calculateInvoiceTotals(draft);
    Object.assign(draft, updated);
  });
});
