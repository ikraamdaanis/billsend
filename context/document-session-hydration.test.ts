import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearDraft, saveDraft } from "~/db";
import { invoiceDefault } from "~/stores/invoice-store";

// Hydration runs once per module, so each test loads a fresh copy of the
// session and its stores.
async function hydrateFresh() {
  vi.resetModules();
  const { hydrateDocument } = await import("~/context/document-session");
  const { useInvoiceStore } = await import("~/stores/invoice-store");
  const { useDocumentStore } = await import("~/stores/document-store");
  await hydrateDocument();

  return {
    invoice: useInvoiceStore.getState(),
    document: useDocumentStore.getState()
  };
}

const yesterdaysBlank = {
  ...structuredClone(invoiceDefault),
  invoiceDate: "2026-10-16",
  dueDate: "2026-11-15"
};

describe("restoring the working draft", () => {
  beforeEach(async () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 17, 9), toFake: ["Date"] });
    await clearDraft();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("dates an untouched blank from an earlier day today", async () => {
    await saveDraft({
      invoiceData: yesterdaysBlank,
      documentId: null,
      documentName: null,
      lastSavedInvoice: yesterdaysBlank,
      updatedAt: new Date(2026, 9, 16)
    });

    const { invoice, document } = await hydrateFresh();

    expect(invoice.invoiceDate).toBe("2026-10-17");
    expect(invoice.dueDate).toBe("2026-11-16");
    expect(document.lastSavedInvoice?.invoiceDate).toBe("2026-10-17");
  });

  it("keeps the dates of a blank someone has typed into", async () => {
    await saveDraft({
      invoiceData: { ...yesterdaysBlank, number: "INV-0042" },
      documentId: null,
      documentName: null,
      lastSavedInvoice: yesterdaysBlank,
      updatedAt: new Date(2026, 9, 16)
    });

    const { invoice } = await hydrateFresh();

    expect(invoice.invoiceDate).toBe("2026-10-16");
    expect(invoice.number).toBe("INV-0042");
  });
});
