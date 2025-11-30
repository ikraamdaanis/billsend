import { invoiceAtom } from "features/new/state/invoice";
import { focusAtom } from "jotai-optics";

// Focused atoms for seller
export const sellerAtom = focusAtom(invoiceAtom, o => o.prop("seller"));
export const sellerSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("sellerSettings")
);
