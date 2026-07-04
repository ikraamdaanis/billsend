import { isEqual } from "lodash-es";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  cleanupOrphanedImages,
  getAllInvoices,
  getBusinessProfile,
  getInvoice,
  saveInvoice
} from "~/db";
import { selectInvoiceData, useInvoiceData } from "~/stores/invoice-selectors";
import { invoiceDefault, useInvoiceStore } from "~/stores/invoice-store";
import type { Invoice, InvoiceDocument } from "~/types";
import { deriveHasUnsavedChanges } from "~/utils/derive-has-unsaved-changes";
import { ensureItemIds } from "~/utils/ensure-item-ids";

type InvoiceDocumentContextValue = {
  currentDocumentId: string | null;
  currentDocumentName: string | null;
  lastSavedInvoice: Invoice | null;
  setCurrentDocumentId: (id: string | null) => void;
  setCurrentDocumentName: (name: string | null) => void;
  setLastSavedInvoice: (invoice: Invoice | null) => void;
  load: (documentId: string) => Promise<void>;
  saveAs: (name: string, templateId?: string | null) => Promise<string>;
  update: (options?: { documentId?: string; name?: string }) => Promise<void>;
  reset: () => Promise<void>;
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

  // Loads a saved document into the store and marks it as current, sweeping
  // any image blob the previously-edited invoice abandoned.
  async function load(documentId: string): Promise<void> {
    const document = await getInvoice(documentId);

    if (!document) {
      throw new Error("Invoice document not found");
    }

    const invoice = ensureItemIds(structuredClone(document.invoiceData));
    useInvoiceStore.getState().setInvoice(invoice);
    // Snapshot the baseline from the store after setInvoice ran it through
    // normalize + recalculate, so the dirty check compares like-for-like and
    // a freshly loaded document can't read as dirty.
    const normalized = selectInvoiceData(useInvoiceStore.getState());
    setCurrentDocumentId(documentId);
    setCurrentDocumentName(document.name);
    setLastSavedInvoice(structuredClone(normalized));
    void cleanupOrphanedImages([normalized.image]);
  }

  // Persists the live invoice as a brand-new document and makes it current.
  async function saveAs(
    name: string,
    templateId: string | null = null
  ): Promise<string> {
    const invoice = selectInvoiceData(useInvoiceStore.getState());
    const now = new Date();
    const trimmedName = name.trim();
    const document: InvoiceDocument = {
      id: crypto.randomUUID(),
      name: trimmedName,
      invoiceData: structuredClone(invoice),
      templateId,
      createdAt: now,
      updatedAt: now
    };

    const savedId = await saveInvoice(document);
    setCurrentDocumentId(savedId);
    setCurrentDocumentName(trimmedName);
    setLastSavedInvoice(structuredClone(invoice));
    void cleanupOrphanedImages([invoice.image]);

    return savedId;
  }

  // Saves the live invoice over an existing document. Defaults to the current
  // document; an explicit documentId/name overwrites and switches to that one.
  async function update(options?: {
    documentId?: string;
    name?: string;
  }): Promise<void> {
    const targetId = options?.documentId ?? currentDocumentId;

    if (!targetId) {
      throw new Error("Invoice document not found");
    }

    const existingDocument = await getInvoice(targetId);

    if (!existingDocument) {
      throw new Error("Invoice document not found");
    }

    const invoice = selectInvoiceData(useInvoiceStore.getState());
    const updatedDocument: InvoiceDocument = {
      ...existingDocument,
      invoiceData: structuredClone(invoice),
      updatedAt: new Date()
    };

    await saveInvoice(updatedDocument);
    setCurrentDocumentId(targetId);

    if (options?.name !== undefined) {
      setCurrentDocumentName(options.name);
    }

    setLastSavedInvoice(structuredClone(invoice));
    void cleanupOrphanedImages([invoice.image]);
  }

  // Replaces the store with a fresh blank invoice and clears the current
  // document, dropping any now-orphaned image blob. The blank invoice is seeded
  // from the saved business profile, so the seller details and logo pre-fill
  // while the profile itself stays untouched. The seeded invoice becomes the
  // baseline, so a freshly pre-filled document doesn't immediately read dirty.
  async function reset(): Promise<void> {
    const profile = await getBusinessProfile();
    useInvoiceStore.getState().resetInvoice(profile);
    const normalized = selectInvoiceData(useInvoiceStore.getState());
    setCurrentDocumentId(null);
    setCurrentDocumentName(null);
    setLastSavedInvoice(structuredClone(normalized));
    void cleanupOrphanedImages([normalized.image]);
  }

  // On first mount of a fresh editor session (no document loaded and the store
  // still at its pristine default), pre-fill from the business profile. Guarded
  // so it never clobbers an invoice the user has already started editing.
  const hasSeededRef = useRef(false);

  useEffect(() => {
    if (hasSeededRef.current) return;

    hasSeededRef.current = true;

    const pristine =
      currentDocumentId === null &&
      isEqual(selectInvoiceData(useInvoiceStore.getState()), invoiceDefault);

    if (!pristine) return;

    void reset();
  }, []);

  const value = {
    currentDocumentId,
    currentDocumentName,
    lastSavedInvoice,
    setCurrentDocumentId,
    setCurrentDocumentName,
    setLastSavedInvoice,
    load,
    saveAs,
    update,
    reset
  };

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

// Derived dirty state: compares the live invoice against its persisted baseline
// (default for a blank document, last-saved snapshot for a loaded one). Kept as
// a derivation so it can never desync from the store the way stored state could.
export function useHasUnsavedChanges(): boolean {
  const { currentDocumentId, lastSavedInvoice } = useInvoiceDocument();
  const invoice = useInvoiceData();

  return deriveHasUnsavedChanges(invoice, currentDocumentId, lastSavedInvoice);
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

// Re-export getAllInvoices for use in components
export { getAllInvoices };
