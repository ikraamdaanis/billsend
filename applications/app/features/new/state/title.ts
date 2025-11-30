import { invoiceAtom } from "features/new/state/invoice";
import { focusAtom } from "jotai-optics";

// Focused atoms for title
export const titleAtom = focusAtom(invoiceAtom, o => o.prop("title"));
export const titleSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("titleSettings")
);
