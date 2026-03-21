import { getAllInvoices, getInvoice, saveInvoice } from "db";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { invoiceDefault } from "stores/invoice-store";
import type { Invoice, InvoiceDocument } from "types";
import { ensureItemIds } from "utils/ensure-item-ids";

type InvoiceDocumentContextValue = {
  currentDocumentId: string | null;
  currentDocumentName: string | null;
  lastSavedInvoice: Invoice | null;
  hasUnsavedChanges: boolean;
  setCurrentDocumentId: (id: string | null) => void;
  setCurrentDocumentName: (name: string | null) => void;
  setLastSavedInvoice: (invoice: Invoice | null) => void;
  setHasUnsavedChanges: (value: boolean) => void;
};

const InvoiceDocumentContext =
  createContext<InvoiceDocumentContextValue | null>(null);

export function InvoiceDocumentProvider({ children }: { children: ReactNode }) {
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null
  );
  const [currentDocumentName, setCurrentDocumentName] = useState<string | null>(
    null
  );
  const [lastSavedInvoice, setLastSavedInvoice] = useState<Invoice | null>(
    null
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const value = useMemo(
    () => ({
      currentDocumentId,
      currentDocumentName,
      lastSavedInvoice,
      hasUnsavedChanges,
      setCurrentDocumentId,
      setCurrentDocumentName,
      setLastSavedInvoice,
      setHasUnsavedChanges
    }),
    [
      currentDocumentId,
      currentDocumentName,
      lastSavedInvoice,
      hasUnsavedChanges
    ]
  );

  return (
    <InvoiceDocumentContext.Provider value={value}>
      {children}
    </InvoiceDocumentContext.Provider>
  );
}

export function useInvoiceDocument() {
  const context = useContext(InvoiceDocumentContext);
  if (!context) {
    throw new Error(
      "useInvoiceDocument must be used within an InvoiceDocumentProvider"
    );
  }
  return context;
}

// Utility functions (same as before, but now work with context setters)

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

export async function loadInvoiceDocument(
  documentId: string,
  setInvoice: (invoice: Invoice) => void,
  setCurrentDocumentId: (id: string | null) => void,
  setCurrentDocumentName: (name: string | null) => void,
  setLastSaved: (invoice: Invoice | null) => void
): Promise<void> {
  const document = await getInvoice(documentId);
  if (!document) {
    throw new Error("Invoice document not found");
  }

  // Deep copy the invoice data to ensure all nested properties are copied
  const invoiceDataCopy = JSON.parse(JSON.stringify(document.invoiceData));
  // Ensure all items have IDs (backward compatibility for saved invoices without IDs)
  const invoice = ensureItemIds(invoiceDataCopy);
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
  setInvoice: (invoice: Invoice) => void,
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

// Re-export getAllInvoices for use in components
export { getAllInvoices };
