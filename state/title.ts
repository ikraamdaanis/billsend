import { focusAtom } from "jotai-optics";
import { invoiceAtom } from "state/invoice";

// Focused atoms for title
export const titleAtom = focusAtom(invoiceAtom, o => o.prop("title"));
export const titleSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("titleSettings")
);
