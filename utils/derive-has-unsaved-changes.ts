import { isEqual } from "lodash-es";
import { invoiceDefault } from "~/stores/invoice-store";
import type { Invoice } from "~/types";

// Derives whether the current invoice differs from its persisted baseline.
// A blank document (no id) is compared against its baseline: the profile-seeded
// snapshot when one exists, otherwise the default invoice. A loaded document is
// compared against its last-saved snapshot. A document with an id but no
// snapshot is treated as dirty.
export function deriveHasUnsavedChanges(
  invoice: Invoice,
  currentDocumentId: string | null,
  lastSavedInvoice: Invoice | null
): boolean {
  if (currentDocumentId === null) {
    return !isEqual(invoice, lastSavedInvoice ?? invoiceDefault);
  }

  if (lastSavedInvoice === null) {
    return true;
  }

  return !isEqual(invoice, lastSavedInvoice);
}
