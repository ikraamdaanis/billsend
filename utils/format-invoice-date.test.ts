import { describe, expect, it } from "vitest";
import { createBlankInvoice } from "~/stores/invoice-store";
import { buildInvoiceViewModel } from "~/utils/build-invoice-view-model";
import { formatInvoiceDate } from "~/utils/format-invoice-date";

describe("invoice dates", () => {
  it("writes a stored date in each format", () => {
    expect(formatInvoiceDate("2026-10-07", "d MMM yyyy")).toBe("7 Oct 2026");
    expect(formatInvoiceDate("2026-10-07", "MMMM d, yyyy")).toBe(
      "October 7, 2026"
    );
    expect(formatInvoiceDate("2026-10-07", "dd/MM/yyyy")).toBe("07/10/2026");
    expect(formatInvoiceDate("2026-10-07", "MM/dd/yyyy")).toBe("10/07/2026");
    expect(formatInvoiceDate("2026-10-07", "yyyy-MM-dd")).toBe("2026-10-07");
  });

  it("leaves a value that isn't a date as it is", () => {
    expect(formatInvoiceDate("next Tuesday", "d MMM yyyy")).toBe(
      "next Tuesday"
    );
    expect(formatInvoiceDate("", "d MMM yyyy")).toBe("");
  });

  it("prints the PDF's dates in the invoice's format", () => {
    const viewModel = buildInvoiceViewModel({
      ...createBlankInvoice(),
      invoiceDate: "2026-10-17",
      dueDate: "2026-11-16",
      dateFormat: "MMMM d, yyyy"
    });
    const values = Object.fromEntries(
      viewModel.detailRows.map(row => [row.id, row.value])
    );

    expect(values.invoiceDate).toBe("October 17, 2026");
    expect(values.dueDate).toBe("November 16, 2026");
  });
});
