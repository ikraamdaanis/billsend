import { invoiceAtom } from "features/new/state/invoice";
import { atom } from "jotai";
import { focusAtom } from "jotai-optics";

// Focused atoms for table settings
export const tableSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("tableSettings")
);

// Focused atoms for line items
export const lineItemsAtom = atom(get => get(invoiceAtom).items);
