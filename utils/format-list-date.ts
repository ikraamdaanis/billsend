import { format } from "date-fns";

// Formats a stored timestamp for the invoice/template lists. Guards against an
// Invalid Date, which date-fns format() throws a RangeError on: without this a
// single corrupt record (one whose updatedAt never went through the import
// coercion) would crash the entire Open dialog list via the error boundary.
export function formatListDate(value: Date | string | number): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "–";
  }

  return format(date, "PP, p");
}
