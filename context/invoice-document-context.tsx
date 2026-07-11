import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  documentActions,
  hydrateDocument,
  startDraftPersistence
} from "~/context/document-session";
import { getAllInvoices } from "~/db";
import { useDocumentStore } from "~/stores/document-store";
import { useInvoiceData } from "~/stores/invoice-selectors";
import type { InvoiceDocument } from "~/types";
import { deriveHasUnsavedChanges } from "~/utils/derive-has-unsaved-changes";

// Marker context: identity now lives in the document store, so the provider
// carries no value. Its job is to scope the editor session (start persistence,
// run hydration) and to let the hook assert it is used inside the editor.
const InvoiceDocumentContext = createContext<boolean>(false);

export function InvoiceDocumentProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    startDraftPersistence();
    void hydrateDocument();
  }, []);

  return (
    <InvoiceDocumentContext.Provider value={true}>
      {children}
    </InvoiceDocumentContext.Provider>
  );
}

export function useInvoiceDocument() {
  const withinProvider = useContext(InvoiceDocumentContext);

  if (!withinProvider) {
    throw new Error(
      "useInvoiceDocument must be used within an InvoiceDocumentProvider"
    );
  }

  const { documentId, documentName, lastSavedInvoice } = useDocumentStore(
    useShallow(state => ({
      documentId: state.documentId,
      documentName: state.documentName,
      lastSavedInvoice: state.lastSavedInvoice
    }))
  );

  return {
    currentDocumentId: documentId,
    currentDocumentName: documentName,
    lastSavedInvoice,
    ...documentActions
  };
}

// Derived dirty state: compares the live invoice against its persisted baseline
// (default for a blank document, last-saved snapshot for a loaded one). Kept as
// a derivation so it can never desync from the store the way stored state could.
export function useHasUnsavedChanges(): boolean {
  const { documentId, lastSavedInvoice } = useDocumentStore(
    useShallow(state => ({
      documentId: state.documentId,
      lastSavedInvoice: state.lastSavedInvoice
    }))
  );
  const invoice = useInvoiceData();

  return deriveHasUnsavedChanges(invoice, documentId, lastSavedInvoice);
}

export function generateDefaultInvoiceName(
  existingInvoices: InvoiceDocument[]
): string {
  const baseName = "Invoice";
  const existingNames = new Set(
    existingInvoices.map(invoice => invoice.name.toLowerCase())
  );

  let counter = 1;
  let name = `${baseName} ${String(counter).padStart(3, "0")}`;

  while (existingNames.has(name.toLowerCase())) {
    counter++;
    name = `${baseName} ${String(counter).padStart(3, "0")}`;
  }

  return name;
}

export { DocumentNotFoundError } from "~/context/document-session";
export { getAllInvoices };
