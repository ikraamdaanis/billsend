import {
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subYears
} from "date-fns";
import type {
  InvoiceDocument,
  InvoiceLibraryDateRange,
  InvoiceLibraryGroup,
  InvoiceLibrarySort,
  InvoiceLibraryView,
  SortDirection
} from "~/types";
import { calculateInvoiceTotals } from "~/utils/calculate-invoice-totals";

// Sorting, filtering and grouping for the saved-invoice lists (the invoices
// panel and the Open Invoice dialog), kept pure so both lists agree and the
// rules can be tested.

export const NO_CLIENT = "No client yet";

export const DEFAULT_LIBRARY_VIEW: InvoiceLibraryView = {
  sort: "updated",
  direction: "desc",
  group: "client",
  dateRange: "all",
  client: null,
  currency: null
};

export const LIBRARY_SORTS: {
  value: InvoiceLibrarySort;
  label: string;
  // The direction a sort starts in when picked: newest, biggest, A to Z.
  defaultDirection: SortDirection;
}[] = [
  { value: "updated", label: "Last edited", defaultDirection: "desc" },
  { value: "invoiceDate", label: "Invoice date", defaultDirection: "desc" },
  { value: "dueDate", label: "Due date", defaultDirection: "asc" },
  { value: "name", label: "Name", defaultDirection: "asc" },
  { value: "client", label: "Client", defaultDirection: "asc" },
  { value: "amount", label: "Amount", defaultDirection: "desc" },
  { value: "number", label: "Invoice number", defaultDirection: "desc" }
];

export const LIBRARY_GROUPS: { value: InvoiceLibraryGroup; label: string }[] = [
  { value: "client", label: "Client" },
  { value: "month", label: "Month" },
  { value: "none", label: "None" }
];

export const LIBRARY_DATE_RANGES: {
  value: InvoiceLibraryDateRange;
  label: string;
}[] = [
  { value: "all", label: "Any date" },
  { value: "thisMonth", label: "This month" },
  { value: "last30", label: "Last 30 days" },
  { value: "thisQuarter", label: "This quarter" },
  { value: "thisYear", label: "This year" },
  { value: "lastYear", label: "Last year" }
];

// The client an invoice is filed under: the first line of its "To" block.
export function getClientName(document: InvoiceDocument): string {
  const firstLine = document.invoiceData.client.content
    .split("\n")
    .map(line => line.trim())
    .find(Boolean);

  return firstLine ?? NO_CLIENT;
}

export function getInvoiceTotal(document: InvoiceDocument): number {
  return calculateInvoiceTotals(document.invoiceData).total;
}

// The invoice's own date, falling back to when it was last edited for an
// invoice whose date was cleared or mistyped.
export function getInvoiceDate(document: InvoiceDocument): Date {
  const date = parseISO(document.invoiceData.invoiceDate);

  return isValid(date) ? date : new Date(document.updatedAt);
}

function getDueDate(document: InvoiceDocument): Date | null {
  const date = parseISO(document.invoiceData.dueDate);

  return isValid(date) ? date : null;
}

function inDateRange(
  date: Date,
  range: InvoiceLibraryDateRange,
  now: Date
): boolean {
  switch (range) {
    case "all":
      return true;
    case "thisMonth":
      return date >= startOfMonth(now) && date <= now;
    case "last30":
      return (
        differenceInCalendarDays(now, date) <= 30 &&
        differenceInCalendarDays(now, date) >= 0
      );
    case "thisQuarter":
      return date >= startOfQuarter(now) && date <= now;
    case "thisYear":
      return date >= startOfYear(now) && date <= now;
    case "lastYear":
      return date >= startOfYear(subYears(now, 1)) && date < startOfYear(now);
  }
}

// Search matches the name, client, invoice and PO numbers, line items and the
// "To" block, case-insensitively; every word typed has to match somewhere.
function matchesSearch(document: InvoiceDocument, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (words.length === 0) return true;

  const { invoiceData } = document;
  const haystack = [
    document.name,
    invoiceData.client.content,
    invoiceData.number,
    invoiceData.poNumber,
    ...invoiceData.items.map(item => item.description)
  ]
    .join(" ")
    .toLowerCase();

  return words.every(word => haystack.includes(word));
}

export function filterInvoices(
  documents: InvoiceDocument[],
  { query, view, now }: { query: string; view: InvoiceLibraryView; now: Date }
): InvoiceDocument[] {
  return documents.filter(
    document =>
      matchesSearch(document, query) &&
      inDateRange(getInvoiceDate(document), view.dateRange, now) &&
      (view.client === null || getClientName(document) === view.client) &&
      (view.currency === null ||
        document.invoiceData.currency === view.currency)
  );
}

const textCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base"
});

function compareBy(
  a: InvoiceDocument,
  b: InvoiceDocument,
  sort: InvoiceLibrarySort
): number {
  switch (sort) {
    case "updated":
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    case "invoiceDate":
      return getInvoiceDate(a).getTime() - getInvoiceDate(b).getTime();
    case "dueDate": {
      // Invoices without a due date sort after every dated one.
      const aDue = getDueDate(a)?.getTime() ?? Number.POSITIVE_INFINITY;
      const bDue = getDueDate(b)?.getTime() ?? Number.POSITIVE_INFINITY;

      return aDue === bDue ? 0 : aDue < bDue ? -1 : 1;
    }
    case "name":
      return textCollator.compare(a.name, b.name);
    case "client":
      return textCollator.compare(getClientName(a), getClientName(b));
    case "amount":
      return getInvoiceTotal(a) - getInvoiceTotal(b);
    case "number":
      return textCollator.compare(a.invoiceData.number, b.invoiceData.number);
  }
}

// Ties fall back to the most recently edited first, so the order is stable.
export function sortInvoices(
  documents: InvoiceDocument[],
  sort: InvoiceLibrarySort,
  direction: SortDirection
): InvoiceDocument[] {
  const sign = direction === "asc" ? 1 : -1;

  return [...documents].sort(
    (a, b) => compareBy(a, b, sort) * sign || compareBy(b, a, "updated")
  );
}

// Groups keep the sorted order: a group appears where its first invoice falls.
export function groupInvoices(
  documents: InvoiceDocument[],
  group: InvoiceLibraryGroup
): { key: string; label: string; documents: InvoiceDocument[] }[] {
  if (group === "none") {
    return documents.length > 0 ? [{ key: "all", label: "", documents }] : [];
  }

  const groups = new Map<
    string,
    { key: string; label: string; documents: InvoiceDocument[] }
  >();

  documents.forEach(document => {
    const date = getInvoiceDate(document);
    const key =
      group === "client" ? getClientName(document) : format(date, "yyyy-MM");
    const label = group === "client" ? key : format(date, "MMMM yyyy");
    const existing = groups.get(key);

    if (existing) existing.documents.push(document);
    else groups.set(key, { key, label, documents: [document] });
  });

  return [...groups.values()];
}

export function listClients(documents: InvoiceDocument[]): string[] {
  return [...new Set(documents.map(getClientName))].sort((a, b) =>
    textCollator.compare(a, b)
  );
}

export function listCurrencies(documents: InvoiceDocument[]): string[] {
  return [
    ...new Set(documents.map(document => document.invoiceData.currency))
  ].sort((a, b) => textCollator.compare(a, b));
}

export function countActiveFilters(view: InvoiceLibraryView): number {
  return [
    view.dateRange !== "all",
    view.client !== null,
    view.currency !== null
  ].filter(Boolean).length;
}

const SORTS = new Set(LIBRARY_SORTS.map(sort => sort.value));
const GROUPS = new Set(LIBRARY_GROUPS.map(group => group.value));
const DATE_RANGES = new Set(LIBRARY_DATE_RANGES.map(range => range.value));

// Vets a stored view (storage can hold anything), keeping each valid choice
// and falling back to the default for the rest.
export function parseLibraryView(
  stored: unknown
): InvoiceLibraryView | undefined {
  if (typeof stored !== "object" || stored === null) return undefined;

  const record = stored as Record<string, unknown>;
  const pick = <TValue extends string>(
    value: unknown,
    allowed: Set<TValue>,
    fallback: TValue
  ) => (allowed.has(value as TValue) ? (value as TValue) : fallback);

  return {
    sort: pick(record.sort, SORTS, DEFAULT_LIBRARY_VIEW.sort),
    direction:
      record.direction === "asc" || record.direction === "desc"
        ? record.direction
        : DEFAULT_LIBRARY_VIEW.direction,
    group: pick(record.group, GROUPS, DEFAULT_LIBRARY_VIEW.group),
    dateRange: pick(
      record.dateRange,
      DATE_RANGES,
      DEFAULT_LIBRARY_VIEW.dateRange
    ),
    client: typeof record.client === "string" ? record.client : null,
    currency: typeof record.currency === "string" ? record.currency : null
  };
}
