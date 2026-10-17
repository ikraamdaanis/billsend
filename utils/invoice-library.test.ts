import { describe, expect, it } from "vitest";
import { createBlankInvoice } from "~/stores/invoice-store";
import type { Invoice, InvoiceDocument } from "~/types";
import {
  DEFAULT_LIBRARY_VIEW,
  filterInvoices,
  groupInvoices,
  listClients,
  NO_CLIENT,
  parseLibraryView,
  sortInvoices
} from "~/utils/invoice-library";

const NOW = new Date(2026, 9, 16);

function makeDocument({
  id,
  client,
  invoiceDate,
  price,
  number = id,
  currency = "£",
  updatedAt = invoiceDate,
  overrides = {}
}: {
  id: string;
  client: string;
  invoiceDate: string;
  price: number;
  number?: string;
  currency?: string;
  updatedAt?: string;
  overrides?: Partial<Invoice>;
}): InvoiceDocument {
  const invoice = createBlankInvoice();

  return {
    id,
    name: `${client} ${number}`,
    templateId: null,
    createdAt: new Date(updatedAt),
    updatedAt: new Date(updatedAt),
    invoiceData: {
      ...invoice,
      number,
      invoiceDate,
      dueDate: invoiceDate,
      currency,
      client: { ...invoice.client, content: client },
      items: [
        {
          id: `${id}-item`,
          description: "Consulting",
          quantity: 1,
          unit: "",
          unitPrice: price
        }
      ],
      ...overrides
    }
  };
}

const documents = [
  makeDocument({
    id: "a",
    client: "Pembee Ltd",
    invoiceDate: "2026-10-01",
    price: 600,
    number: "INV-9"
  }),
  makeDocument({
    id: "b",
    client: "Notus GmbH",
    invoiceDate: "2026-09-03",
    price: 7150,
    number: "INV-10",
    currency: "€"
  }),
  makeDocument({
    id: "c",
    client: "Pembee Ltd\n1 High Street",
    invoiceDate: "2025-12-01",
    price: 300,
    number: "INV-2"
  }),
  makeDocument({ id: "d", client: "", invoiceDate: "2026-10-10", price: 50 })
];

describe("invoice library", () => {
  it("sorts by amount, number and date in either direction", () => {
    const ids = (list: InvoiceDocument[]) => list.map(entry => entry.id);

    expect(ids(sortInvoices(documents, "amount", "desc"))).toEqual([
      "b",
      "a",
      "c",
      "d"
    ]);
    // Invoice numbers compare naturally, so INV-10 comes after INV-9.
    expect(ids(sortInvoices(documents, "number", "asc")).slice(1)).toEqual([
      "c",
      "a",
      "b"
    ]);
    expect(ids(sortInvoices(documents, "invoiceDate", "asc"))[0]).toBe("c");
  });

  it("filters by search words, client, currency and date range", () => {
    const filter = (
      query: string,
      view: Partial<typeof DEFAULT_LIBRARY_VIEW>
    ) =>
      filterInvoices(documents, {
        query,
        view: { ...DEFAULT_LIBRARY_VIEW, ...view },
        now: NOW
      }).map(entry => entry.id);

    expect(filter("pembee inv-2", {})).toEqual(["c"]);
    expect(filter("", { client: "Pembee Ltd" })).toEqual(["a", "c"]);
    expect(filter("", { currency: "€" })).toEqual(["b"]);
    expect(filter("", { dateRange: "thisMonth" })).toEqual(["a", "d"]);
    expect(filter("", { dateRange: "lastYear" })).toEqual(["c"]);
  });

  it("groups by client in sorted order, with a bucket for no client", () => {
    const groups = groupInvoices(
      sortInvoices(documents, "invoiceDate", "desc"),
      "client"
    );

    expect(groups.map(group => group.label)).toEqual([
      NO_CLIENT,
      "Pembee Ltd",
      "Notus GmbH"
    ]);
    expect(groups[1].documents.map(entry => entry.id)).toEqual(["a", "c"]);
  });

  it("groups by month of the invoice date", () => {
    const groups = groupInvoices(
      sortInvoices(documents, "invoiceDate", "desc"),
      "month"
    );

    expect(groups.map(group => group.label)).toEqual([
      "October 2026",
      "September 2026",
      "December 2025"
    ]);
  });

  it("lists each client once, alphabetically, with no client last", () => {
    expect(listClients(documents)).toEqual([
      "Notus GmbH",
      "Pembee Ltd",
      NO_CLIENT
    ]);
  });

  it("sorts invoices with nothing to sort by last in either direction", () => {
    const undated = makeDocument({
      id: "undated",
      client: "Pembee Ltd",
      invoiceDate: "2026-10-05",
      price: 10,
      overrides: { dueDate: "" }
    });
    const ids = (list: InvoiceDocument[]) => list.map(entry => entry.id);

    for (const direction of ["asc", "desc"] as const) {
      expect(
        ids(sortInvoices([undated, ...documents], "dueDate", direction)).at(-1)
      ).toBe("undated");
      expect(ids(sortInvoices(documents, "client", direction)).at(-1)).toBe(
        "d"
      );
    }
  });

  it("files a damaged record with no readable date under No date", () => {
    const damaged = {
      ...makeDocument({
        id: "damaged",
        client: "Pembee Ltd",
        invoiceDate: "not a date",
        price: 10
      }),
      updatedAt: new Date(Number.NaN)
    };

    expect(groupInvoices([damaged], "month")).toEqual([
      { key: "no-date", label: "No date", documents: [damaged] }
    ]);
    expect(() =>
      sortInvoices([damaged, ...documents], "updated", "desc")
    ).not.toThrow();
  });

  it("counts a later date this month as this month", () => {
    const later = makeDocument({
      id: "later",
      client: "Pembee Ltd",
      invoiceDate: "2026-10-25",
      price: 10
    });

    expect(
      filterInvoices([later], {
        query: "",
        view: { ...DEFAULT_LIBRARY_VIEW, dateRange: "thisMonth" },
        now: NOW
      })
    ).toEqual([later]);
  });

  it("repairs a stored view field by field", () => {
    expect(
      parseLibraryView({ sort: "amount", group: "weekday", client: 4 })
    ).toEqual({ ...DEFAULT_LIBRARY_VIEW, sort: "amount" });
    expect(parseLibraryView("nonsense")).toBeUndefined();
  });
});
