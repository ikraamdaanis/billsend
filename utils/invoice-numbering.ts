import type { BusinessProfile } from "~/types";

// Render the numbering counter as the string a new invoice carries, e.g.
// { prefix: "INV-", padding: 4, nextNumber: 42 } -> "INV-0042". A number wider
// than the padding is never truncated; padding only ever pads.
export function formatInvoiceNumber(
  numbering: BusinessProfile["numbering"]
): string {
  const digits = String(numbering.nextNumber).padStart(numbering.padding, "0");

  return `${numbering.prefix}${digits}`;
}

// Advance the counter by one, returning a fresh numbering config. Prefix and
// padding are untouched; only `nextNumber` moves. Pure, so the caller decides
// when to persist the result.
export function advanceInvoiceNumber(
  numbering: BusinessProfile["numbering"]
): BusinessProfile["numbering"] {
  return { ...numbering, nextNumber: numbering.nextNumber + 1 };
}
