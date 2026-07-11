import Dexie from "dexie";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DocumentNotFoundError,
  documentActions
} from "~/context/document-session";
import { deleteInvoice, getDraft, getInvoice, saveDraft, saveInvoice } from "~/db";
import { documentDefault, useDocumentStore } from "~/stores/document-store";
import { invoiceDefault, useInvoiceStore } from "~/stores/invoice-store";
import type { InvoiceDocument } from "~/types";

// Clears every table through an independent connection so each test starts from
// an empty database, matching a fresh device. Declared at the current schema
// version (7) so the drafts table is included and actually cleared between tests.
async function resetDb() {
  const connection = new Dexie("InvoiceDatabase");
  connection.version(7).stores({
    templates: "id, name, createdAt, updatedAt",
    invoices: "id, name, createdAt, updatedAt",
    images: "id",
    drafts: "id"
  });
  await connection.open();
  await Promise.all([
    connection.table("templates").clear(),
    connection.table("invoices").clear(),
    connection.table("images").clear(),
    connection.table("drafts").clear()
  ]);
  connection.close();
}

// Returns both module-global stores to their defaults, standing in for a fresh
// editor session. setInvoice routes through migrate/normalize just like the app.
function resetStores() {
  useInvoiceStore.getState().setInvoice(structuredClone(invoiceDefault));
  useDocumentStore.getState().setDocument({ ...documentDefault });
}

function makeStoredInvoice(
  overrides: Partial<InvoiceDocument> = {}
): InvoiceDocument {
  const now = new Date();

  return {
    id: "seed-invoice",
    name: "Seed",
    invoiceData: structuredClone(invoiceDefault),
    templateId: null,
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

describe("document session", () => {
  beforeEach(async () => {
    await resetDb();
    resetStores();
  });

  it("saveAs persists the invoice and marks it as the current document", async () => {
    useInvoiceStore.getState().setNumber("INV-9000");

    const id = await documentActions.saveAs("Client A");

    expect(useDocumentStore.getState().documentId).toBe(id);
    expect(useDocumentStore.getState().documentName).toBe("Client A");

    const stored = await getInvoice(id);
    expect(stored?.name).toBe("Client A");
    expect(stored?.invoiceData.number).toBe("INV-9000");
  });

  it("saveAs trims the document name", async () => {
    const id = await documentActions.saveAs("   Spaced Name   ");

    expect(useDocumentStore.getState().documentName).toBe("Spaced Name");

    const stored = await getInvoice(id);
    expect(stored?.name).toBe("Spaced Name");
  });

  // The regression guard for the detach bug: identity lives in its own store, so
  // replacing the entire invoice-content state (what setInvoice does on load /
  // template apply / navigation restore) must not disturb the current document.
  it("keeps the document association when the invoice content is replaced", async () => {
    const id = await documentActions.saveAs("Client A");

    useInvoiceStore.getState().setInvoice(structuredClone(invoiceDefault));

    expect(useDocumentStore.getState().documentId).toBe(id);
    expect(useDocumentStore.getState().documentName).toBe("Client A");
  });

  it("load restores a saved document and marks it current", async () => {
    await saveInvoice(
      makeStoredInvoice({
        id: "inv-load",
        name: "Loaded",
        invoiceData: { ...structuredClone(invoiceDefault), number: "INV-77" }
      })
    );

    await documentActions.load("inv-load");

    expect(useDocumentStore.getState().documentId).toBe("inv-load");
    expect(useDocumentStore.getState().documentName).toBe("Loaded");
    expect(useInvoiceStore.getState().number).toBe("INV-77");
  });

  it("load throws DocumentNotFoundError for a missing document", async () => {
    await expect(documentActions.load("does-not-exist")).rejects.toBeInstanceOf(
      DocumentNotFoundError
    );
  });

  it("update overwrites the current document and persists a new name", async () => {
    const id = await documentActions.saveAs("Original");
    useInvoiceStore.getState().setNumber("INV-1");

    await documentActions.update({ documentId: id, name: "Renamed" });

    const stored = await getInvoice(id);
    expect(stored?.name).toBe("Renamed");
    expect(stored?.invoiceData.number).toBe("INV-1");
    expect(useDocumentStore.getState().documentName).toBe("Renamed");
  });

  it("update keeps the existing name when none is given", async () => {
    const id = await documentActions.saveAs("Keep This");

    await documentActions.update();

    const stored = await getInvoice(id);
    expect(stored?.name).toBe("Keep This");
  });

  it("update throws DocumentNotFoundError when the document was deleted elsewhere", async () => {
    const id = await documentActions.saveAs("Doomed");
    await deleteInvoice(id);

    await expect(documentActions.update()).rejects.toBeInstanceOf(
      DocumentNotFoundError
    );
  });

  it("update throws DocumentNotFoundError with no current document", async () => {
    await expect(documentActions.update()).rejects.toBeInstanceOf(
      DocumentNotFoundError
    );
  });

  it("reset clears the current document and discards the working draft", async () => {
    const id = await documentActions.saveAs("Temp");
    await saveDraft({
      invoiceData: structuredClone(invoiceDefault),
      documentId: id,
      documentName: "Temp",
      lastSavedInvoice: null,
      updatedAt: new Date()
    });

    documentActions.reset();

    expect(useDocumentStore.getState().documentId).toBeNull();
    expect(useDocumentStore.getState().documentName).toBeNull();

    await vi.waitFor(async () => {
      expect(await getDraft()).toBeUndefined();
    });
  });
});

describe("working draft persistence", () => {
  beforeEach(async () => {
    await resetDb();
    resetStores();
  });

  it("returns undefined when there is no draft", async () => {
    expect(await getDraft()).toBeUndefined();
  });

  // A draft is what a reload restores from, so it must carry the document
  // identity, not just the content. This is the mechanism that keeps a reload
  // attached to its saved document.
  it("round-trips the document association through the draft", async () => {
    const invoice = { ...structuredClone(invoiceDefault), number: "INV-DRAFT" };

    await saveDraft({
      invoiceData: invoice,
      documentId: "doc-9",
      documentName: "Client B",
      lastSavedInvoice: invoice,
      updatedAt: new Date()
    });

    const draft = await getDraft();

    expect(draft?.documentId).toBe("doc-9");
    expect(draft?.documentName).toBe("Client B");
    expect(draft?.invoiceData.number).toBe("INV-DRAFT");
    expect(draft?.lastSavedInvoice?.number).toBe("INV-DRAFT");
  });
});
