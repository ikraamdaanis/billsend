import { invoiceAtom } from "features/new/state/invoice";
import { focusAtom } from "jotai-optics";

// Focused atoms for terms
export const termsAtom = focusAtom(invoiceAtom, o => o.prop("terms"));
export const termsSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("termsSettings")
);

// Focused atom for PDF settings
export const pdfSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("pdfSettings")
);
