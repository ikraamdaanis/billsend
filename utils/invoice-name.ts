import type { Invoice, InvoiceDocument } from "~/types";

// Long client lines are cut here, so a pasted paragraph doesn't become a name.
const MAX_CLIENT_NAME_LENGTH = 60;

export const UNTITLED_INVOICE_NAME = "Untitled invoice";

function firstLine(text: string): string {
  const line =
    text
      .split("\n")
      .map(candidate => candidate.trim())
      .find(candidate => candidate.length > 0) ?? "";

  return line.length > MAX_CLIENT_NAME_LENGTH
    ? `${line.slice(0, MAX_CLIENT_NAME_LENGTH).trimEnd()}…`
    : line;
}

// The name an invoice goes by until someone names it: its number and its
// client's first line, such as "INV-0042 · Acme Ltd". With only one of the two
// that one is the name, and with neither it's "Untitled invoice".
export function deriveInvoiceName(
  invoice: Pick<Invoice, "number" | "client">
): string {
  const parts = [invoice.number.trim(), firstLine(invoice.client.content)];
  const name = parts.filter(part => part.length > 0).join(" · ");

  return name || UNTITLED_INVOICE_NAME;
}

// What a library invoice is called: the name it was given, or for one that
// was never named, the name its content gives it.
export function getInvoiceName(
  document: Pick<InvoiceDocument, "name" | "nameSource" | "invoiceData">
): string {
  if (document.nameSource === "auto") {
    return deriveInvoiceName(document.invoiceData);
  }

  return document.name || UNTITLED_INVOICE_NAME;
}
