import { describe, expect, it } from "vitest";
import { invoiceDefault } from "~/stores/invoice-store";
import type { Invoice } from "~/types";
import { deriveHasUnsavedChanges } from "~/utils/derive-has-unsaved-changes";

function cloneDefault(): Invoice {
  return structuredClone(invoiceDefault);
}

describe("deriveHasUnsavedChanges", () => {
  describe("blank document (no id)", () => {
    it("is clean when the invoice equals the default", () => {
      expect(deriveHasUnsavedChanges(cloneDefault(), null, null)).toBe(false);
    });

    it("is dirty when the invoice differs from the default", () => {
      const invoice = cloneDefault();
      invoice.title = "Changed";

      expect(deriveHasUnsavedChanges(invoice, null, null)).toBe(true);
    });
  });

  describe("existing document (has id)", () => {
    it("is dirty when there is no saved snapshot yet", () => {
      expect(deriveHasUnsavedChanges(cloneDefault(), "doc-1", null)).toBe(true);
    });

    it("is clean when the invoice equals the last-saved snapshot", () => {
      const invoice = cloneDefault();
      const lastSaved = cloneDefault();

      expect(deriveHasUnsavedChanges(invoice, "doc-1", lastSaved)).toBe(false);
    });

    it("is dirty when the invoice differs from the last-saved snapshot", () => {
      const invoice = cloneDefault();
      invoice.number = "999";
      const lastSaved = cloneDefault();

      expect(deriveHasUnsavedChanges(invoice, "doc-1", lastSaved)).toBe(true);
    });
  });
});
