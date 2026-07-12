import { isEqual } from "lodash-es";
import {
  cleanupOrphanedImages,
  clearDraft,
  getDraft,
  getInvoice,
  saveDraft,
  saveInvoice
} from "~/db";
import { useDocumentStore } from "~/stores/document-store";
import { selectInvoiceData } from "~/stores/invoice-selectors";
import { invoiceDefault, useInvoiceStore } from "~/stores/invoice-store";
import type { InvoiceDocument } from "~/types";
import { ensureItemIds } from "~/utils/ensure-item-ids";

// The editor session: the module-level document actions (load / saveAs / update
// / reset) and the working-draft persistence + hydration controller. This lives
// outside React on purpose. Identity and content are both module-global stores,
// so the session outlives any single mounted editor route, which is what makes
// navigating away and back non-destructive. The React surface (provider, hooks)
// is a thin wrapper over this in invoice-document-context.tsx.

// How long to wait after the last edit before writing the working draft. Long
// enough to coalesce a burst of keystrokes, short enough that little work is at
// risk between saves.
const DRAFT_SAVE_DEBOUNCE_MS = 600;

// Thrown when a save/load targets a document id that no longer exists in the
// database (e.g. it was deleted from the Open Invoice dialog). Callers can catch
// this specifically to recover, such as falling back to the Save As flow.
export class DocumentNotFoundError extends Error {
  constructor() {
    super("Invoice document not found");
    this.name = "DocumentNotFoundError";
  }
}

// Loads a saved document into the store and marks it as current, sweeping any
// image blob the previously-edited invoice abandoned.
async function load(documentId: string): Promise<void> {
  const document = await getInvoice(documentId);

  if (!document) {
    throw new DocumentNotFoundError();
  }

  const invoice = ensureItemIds(structuredClone(document.invoiceData));
  useInvoiceStore.getState().setInvoice(invoice);
  // Snapshot the baseline from the store after setInvoice ran it through
  // normalize + recalculate, so the dirty check compares like-for-like and a
  // freshly loaded document can't read as dirty.
  const normalized = selectInvoiceData(useInvoiceStore.getState());
  useDocumentStore.getState().setDocument({
    documentId,
    documentName: document.name,
    lastSavedInvoice: structuredClone(normalized)
  });
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
  useDocumentStore.getState().setDocument({
    documentId: savedId,
    documentName: trimmedName,
    lastSavedInvoice: structuredClone(invoice)
  });
  void cleanupOrphanedImages([invoice.image]);

  return savedId;
}

// Saves the live invoice over an existing document. Defaults to the current
// document; an explicit documentId/name overwrites and switches to that one.
async function update(options?: {
  documentId?: string;
  name?: string;
}): Promise<void> {
  const targetId =
    options?.documentId ?? useDocumentStore.getState().documentId;

  if (!targetId) {
    throw new DocumentNotFoundError();
  }

  const existingDocument = await getInvoice(targetId);

  if (!existingDocument) {
    throw new DocumentNotFoundError();
  }

  const invoice = selectInvoiceData(useInvoiceStore.getState());
  const trimmedName = options?.name?.trim();
  const updatedDocument: InvoiceDocument = {
    ...existingDocument,
    // Persist a new name onto the record when overwriting under one, otherwise
    // keep the existing name. Without this a Save As over an existing document
    // with a renamed field updated only the header, never the stored record.
    name: trimmedName ?? existingDocument.name,
    invoiceData: structuredClone(invoice),
    updatedAt: new Date()
  };

  await saveInvoice(updatedDocument);
  useDocumentStore.getState().setDocument({
    documentId: targetId,
    documentName: updatedDocument.name,
    lastSavedInvoice: structuredClone(invoice)
  });
  void cleanupOrphanedImages([invoice.image]);
}

// Replaces the store with a fresh blank invoice and clears the current
// document, dropping any now-orphaned image blob. New invoices start fully
// blank, including a static default number the user edits per invoice. The
// blank invoice becomes the baseline, so it doesn't immediately read dirty.
function reset(): void {
  useInvoiceStore.getState().resetInvoice();
  const normalized = selectInvoiceData(useInvoiceStore.getState());
  useDocumentStore.getState().setDocument({
    documentId: null,
    documentName: null,
    lastSavedInvoice: structuredClone(normalized)
  });
  void cleanupOrphanedImages([normalized.image]);
  // Discard the working draft so "New invoice" truly starts fresh, even if the
  // page is reloaded before the next autosave fires.
  void clearDraft();
}

// Writes the live editing session (content + identity) into the working draft.
// Reads both stores at call time, so it always pairs the current content with
// the current identity, never a stale closure of either.
function writeDraft(): void {
  const invoiceData = selectInvoiceData(useInvoiceStore.getState());
  const { documentId, documentName, lastSavedInvoice } =
    useDocumentStore.getState();

  // Never autosave a pristine, unattached blank. This is the only state that
  // equals the default, and only occurs before hydration or right after a read
  // failure; skipping it means a transient draft-read error can never overwrite
  // an intact on-disk draft with an empty one.
  if (documentId === null && isEqual(invoiceData, invoiceDefault)) {
    return;
  }

  void saveDraft({
    invoiceData: structuredClone(invoiceData),
    documentId,
    documentName,
    lastSavedInvoice: lastSavedInvoice
      ? structuredClone(lastSavedInvoice)
      : null,
    updatedAt: new Date()
  });
}

// Module-level draft-persistence controller. Owning the debounce timer and the
// store subscriptions at module scope (rather than in a component effect) means
// client-side navigation away from the editor never discards a pending write:
// the timer and the stores outlive any single mounted provider, so the debounced
// write still lands. pagehide / visibilitychange remain as belt-and-braces for
// tab close and backgrounding.
let persistenceStarted = false;
let hydrated = false;
let draftTimeout: ReturnType<typeof setTimeout> | null = null;

function scheduleSave(): void {
  if (!hydrated) return;

  if (draftTimeout) clearTimeout(draftTimeout);

  draftTimeout = setTimeout(writeDraft, DRAFT_SAVE_DEBOUNCE_MS);
}

function flushSave(): void {
  if (!draftTimeout) return;

  clearTimeout(draftTimeout);
  draftTimeout = null;
  writeDraft();
}

function handleVisibilityChange(): void {
  if (document.visibilityState === "hidden") {
    flushSave();
  }
}

export function startDraftPersistence(): void {
  if (persistenceStarted) return;

  persistenceStarted = true;
  useInvoiceStore.subscribe(scheduleSave);
  useDocumentStore.subscribe(scheduleSave);
  window.addEventListener("pagehide", flushSave);
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

// One-time restore of the autosaved working draft, so an accidental reload never
// loses unsaved work. Memoised on a module promise: idempotent across provider
// remounts (navigating back to the editor never re-runs it) and safe under React
// StrictMode's double-invoked effects. Only restores into a pristine store, so it
// can never clobber edits already in progress, and enables autosave (via
// `hydrated`) once settled.
let hydrationPromise: Promise<void> | null = null;

async function runHydration(): Promise<void> {
  const pristine =
    useDocumentStore.getState().documentId === null &&
    isEqual(selectInvoiceData(useInvoiceStore.getState()), invoiceDefault);

  if (!pristine) {
    hydrated = true;

    return;
  }

  let draft;

  try {
    draft = await getDraft();
  } catch (error) {
    // A transient read failure must not be mistaken for "no draft": resetting
    // here would delete an intact draft and blank the editor. Leave the store
    // untouched (still pristine, so autosave won't overwrite the draft either)
    // and let the user reload to try again.
    console.error("[InvoiceDocument] Failed to read working draft", error);
    hydrated = true;

    return;
  }

  // Re-check pristineness after the async read. getDraft() yields the event
  // loop, so the user can start typing on the blank invoice while it is in
  // flight; restoring the draft or resetting now would silently wipe those
  // in-progress edits. If the store is no longer pristine, keep what is there,
  // enable autosave, and schedule a write for the edits that landed while
  // `hydrated` was still false (and so never scheduled one themselves).
  const stillPristine =
    useDocumentStore.getState().documentId === null &&
    isEqual(selectInvoiceData(useInvoiceStore.getState()), invoiceDefault);

  if (!stillPristine) {
    hydrated = true;
    scheduleSave();

    return;
  }

  if (draft) {
    const invoice = ensureItemIds(structuredClone(draft.invoiceData));
    useInvoiceStore.getState().setInvoice(invoice);
    const normalized = selectInvoiceData(useInvoiceStore.getState());
    useDocumentStore.getState().setDocument({
      documentId: draft.documentId,
      documentName: draft.documentName,
      lastSavedInvoice: structuredClone(draft.lastSavedInvoice ?? normalized)
    });
    void cleanupOrphanedImages([normalized.image]);
  } else {
    // No draft: seed a fresh blank invoice (which stamps today's dates). Safe to
    // reset here because the stillPristine guard above guarantees the user has
    // not edited anything yet, so there is nothing to clobber.
    reset();
  }

  hydrated = true;
}

export function hydrateDocument(): Promise<void> {
  if (!hydrationPromise) {
    hydrationPromise = runHydration();
  }

  return hydrationPromise;
}

export const documentActions = {
  setCurrentDocumentId: useDocumentStore.getState().setDocumentId,
  setCurrentDocumentName: useDocumentStore.getState().setDocumentName,
  setLastSavedInvoice: useDocumentStore.getState().setLastSavedInvoice,
  load,
  saveAs,
  update,
  reset
} as const;
