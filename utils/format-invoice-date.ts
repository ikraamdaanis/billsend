import { format, isValid, parseISO } from "date-fns";
import type { Invoice } from "~/types";

// Writes a stored yyyy-MM-dd date the way the invoice asks. Anything that
// isn't a valid date (a half-typed or legacy value) is shown as it is.
export function formatInvoiceDate(
  isoDate: string,
  dateFormat: Invoice["dateFormat"]
): string {
  const date = parseISO(isoDate);

  return isValid(date) ? format(date, dateFormat) : isoDate;
}
