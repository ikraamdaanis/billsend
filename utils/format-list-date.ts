import { format, isSameDay, isSameYear, subDays } from "date-fns";

function toValidDate(value: Date | string | number): Date | null {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

// Formats a stored timestamp for the invoice/template lists, as short as Mail
// and Finder keep theirs: the time for today, "Yesterday", the day and month
// this year, and the full date before that. Guards against an Invalid Date,
// which date-fns format() throws a RangeError on: without this a single
// corrupt record (one whose updatedAt never went through the import coercion)
// would crash the entire Open dialog list via the error boundary.
export function formatListDate(
  value: Date | string | number,
  now: Date = new Date()
): string {
  const date = toValidDate(value);

  if (!date) return "–";
  if (isSameDay(date, now)) return format(date, "HH:mm");
  if (isSameDay(date, subDays(now, 1))) return "Yesterday";

  return format(date, isSameYear(date, now) ? "d MMM" : "d MMM yyyy");
}

// The whole timestamp, for where a short list date needs spelling out.
export function formatFullDate(value: Date | string | number): string {
  const date = toValidDate(value);

  return date ? format(date, "d MMM yyyy, HH:mm") : "–";
}
