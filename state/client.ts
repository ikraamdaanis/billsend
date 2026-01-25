import { focusAtom } from "jotai-optics";
import { invoiceAtom } from "state/invoice";

// Focused atoms for client
export const clientAtom = focusAtom(invoiceAtom, o => o.prop("client"));
export const clientSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("clientSettings")
);
