import { getAllInvoices, getInvoice, saveInvoice } from "features/new/db";
import { invoiceDefault } from "features/new/state/invoice";
import type { Invoice, InvoiceDocument } from "features/new/types";
import { ensureItemIds } from "features/new/utils/ensure-item-ids";
import { atom } from "jotai";
import { loadable } from "jotai/utils";

export const currentInvoiceDocumentIdAtom = atom<string | null>(null);

export const currentInvoiceDocumentNameAtom = atom<string | null>(null);

export const savedInvoicesAtom = atom<Promise<InvoiceDocument[]>>(async () => {
  return await getAllInvoices();
});

export const savedInvoicesLoadableAtom = loadable(savedInvoicesAtom);

export const lastSavedInvoiceAtom = atom<Invoice | null>(null);

export const hasUnsavedChangesAtom = atom<boolean>(false);

export function generateDefaultInvoiceName(
  existingInvoices: InvoiceDocument[]
): string {
  const baseName = "Invoice";
  const existingNames = new Set(
    existingInvoices.map(inv => inv.name.toLowerCase())
  );

  let counter = 1;
  let name = `${baseName} ${String(counter).padStart(3, "0")}`;

  while (existingNames.has(name.toLowerCase())) {
    counter++;
    name = `${baseName} ${String(counter).padStart(3, "0")}`;
  }

  return name;
}

export async function loadInvoiceDocumentIntoAtom(
  documentId: string,
  setInvoice: (invoice: Invoice | ((draft: Invoice) => void)) => void,
  setCurrentDocumentId: (id: string | null) => void,
  setCurrentDocumentName: (name: string | null) => void,
  setLastSaved: (invoice: Invoice | null) => void
): Promise<void> {
  const document = await getInvoice(documentId);
  if (!document) {
    throw new Error("Invoice document not found");
  }

  // Use immer updater pattern to properly set the invoice
  // Deep copy the invoice data to ensure all nested properties are copied
  const invoiceDataCopy = JSON.parse(JSON.stringify(document.invoiceData));
  // Ensure all items have IDs (backward compatibility for saved invoices without IDs)
  const invoice = ensureItemIds(invoiceDataCopy);
  // With atomWithImmer, we can return a new value directly
  setInvoice(invoice);
  setCurrentDocumentId(documentId);
  setCurrentDocumentName(document.name);
  setLastSaved(JSON.parse(JSON.stringify(invoice)));
}

export async function saveCurrentInvoiceAsDocument(
  invoice: Invoice,
  name: string,
  templateId: string | null,
  setCurrentDocumentId: (id: string | null) => void,
  setCurrentDocumentName: (name: string | null) => void,
  setLastSaved: (invoice: Invoice | null) => void
): Promise<string> {
  const now = new Date();
  const trimmedName = name.trim();
  const document: InvoiceDocument = {
    id: crypto.randomUUID(),
    name: trimmedName,
    invoiceData: JSON.parse(JSON.stringify(invoice)),
    templateId,
    createdAt: now,
    updatedAt: now
  };

  const savedId = await saveInvoice(document);
  setCurrentDocumentId(savedId);
  setCurrentDocumentName(trimmedName);
  setLastSaved(JSON.parse(JSON.stringify(invoice)));
  return savedId;
}

export async function updateCurrentInvoiceDocument(
  documentId: string,
  invoice: Invoice,
  setLastSaved: (invoice: Invoice | null) => void
): Promise<void> {
  const existingDocument = await getInvoice(documentId);
  if (!existingDocument) {
    throw new Error("Invoice document not found");
  }

  const updatedDocument: InvoiceDocument = {
    ...existingDocument,
    invoiceData: JSON.parse(JSON.stringify(invoice)),
    updatedAt: new Date()
  };

  await saveInvoice(updatedDocument);
  setLastSaved(JSON.parse(JSON.stringify(invoice)));
}

export function resetToNewInvoice(
  setInvoice: (invoice: Invoice | ((draft: Invoice) => void)) => void,
  setCurrentDocumentId: (id: string | null) => void,
  setCurrentDocumentName: (name: string | null) => void,
  setLastSaved: (invoice: Invoice | null) => void
): void {
  // Deep copy the default invoice to ensure a fresh instance
  const defaultCopy = JSON.parse(JSON.stringify(invoiceDefault));
  // Ensure all items have IDs (generates new IDs for the fresh invoice)
  const invoiceWithIds = ensureItemIds(defaultCopy);
  setInvoice(invoiceWithIds);
  setCurrentDocumentId(null);
  setCurrentDocumentName(null);
  setLastSaved(null);
}
