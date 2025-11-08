import type { InvoiceDesignOverrides } from "features/invoices/templates/types";

const STORAGE_KEY_PREFIX = "invoice:design:";

function getStorageKey(invoiceId: string): string {
  return `${STORAGE_KEY_PREFIX}${invoiceId}`;
}

export function loadDesign(invoiceId: string): InvoiceDesignOverrides | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(getStorageKey(invoiceId));
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as InvoiceDesignOverrides;
  } catch (error) {
    console.error("Failed to load design from localStorage:", error);
    return null;
  }
}

export function saveDesign(
  invoiceId: string,
  overrides: InvoiceDesignOverrides
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(getStorageKey(invoiceId), JSON.stringify(overrides));
  } catch (error) {
    console.error("Failed to save design to localStorage:", error);
  }
}

export function clearDesign(invoiceId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(getStorageKey(invoiceId));
  } catch (error) {
    console.error("Failed to clear design from localStorage:", error);
  }
}
