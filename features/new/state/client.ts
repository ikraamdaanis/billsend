import { invoiceAtom } from "features/new/state/invoice";
import { focusAtom } from "jotai-optics";

// Focused atoms for client
export const clientAtom = focusAtom(invoiceAtom, o => o.prop("client"));
export const clientSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("clientSettings")
);
