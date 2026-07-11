import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Invoice } from "~/types";

// The identity of the document currently being edited: which saved record it
// maps to (if any), its name, and the snapshot it was last persisted at (the
// baseline for the dirty check). This lives in its own module-global store,
// deliberately separate from the invoice-content store, for two reasons:
//
//   1. Content and identity now share the same lifetime. Previously identity
//      lived in per-route React state while content lived in a module-global
//      store, so navigating away from the editor and back dropped the identity
//      while the content survived, silently detaching the invoice from its
//      saved document. One store per concern, both module-global, cannot desync.
//   2. `setInvoice` replaces the entire invoice-store state (migrate returns a
//      fresh Invoice), so identity kept in that store would be wiped on every
//      load. A separate store is immune.
type DocumentState = {
  documentId: string | null;
  documentName: string | null;
  lastSavedInvoice: Invoice | null;
};

type DocumentActions = {
  setDocumentId: (id: string | null) => void;
  setDocumentName: (name: string | null) => void;
  setLastSavedInvoice: (invoice: Invoice | null) => void;
  setDocument: (document: DocumentState) => void;
};

export const documentDefault: DocumentState = {
  documentId: null,
  documentName: null,
  lastSavedInvoice: null
};

export const useDocumentStore = create<DocumentState & DocumentActions>()(
  subscribeWithSelector(set => ({
    ...documentDefault,
    setDocumentId: documentId => set({ documentId }),
    setDocumentName: documentName => set({ documentName }),
    setLastSavedInvoice: lastSavedInvoice => set({ lastSavedInvoice }),
    setDocument: document => set({ ...document })
  }))
);
