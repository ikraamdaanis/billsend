import { focusAtom } from "jotai-optics";
import { invoiceAtom } from "state/invoice";

// Focused atoms for number
export const numberAtom = focusAtom(invoiceAtom, o => o.prop("number"));
export const numberSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("numberSettings")
);

// Focused atoms for invoice date
export const invoiceDateAtom = focusAtom(invoiceAtom, o =>
  o.prop("invoiceDate")
);
export const invoiceDateSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("invoiceDateSettings")
);

// Focused atoms for due date
export const dueDateAtom = focusAtom(invoiceAtom, o => o.prop("dueDate"));
export const dueDateSettingsAtom = focusAtom(invoiceAtom, o =>
  o.prop("dueDateSettings")
);
