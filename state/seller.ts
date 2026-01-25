import { focusAtom } from "jotai-optics";
import { invoiceAtom } from "state/invoice";

// Focused atoms for seller
export const sellerAtom = focusAtom(invoiceAtom, o => o.prop("seller"));
export const sellerSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("sellerSettings")
);
