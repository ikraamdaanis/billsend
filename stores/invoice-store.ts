import { addDays, format } from "date-fns";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Invoice,
  InvoiceClient,
  InvoiceItem,
  InvoiceLabels,
  InvoiceSeller,
  InvoiceTerms,
  InvoiceTheme,
  PdfSettings,
  TableSettings
} from "~/types";
import { calculateInvoiceTotals } from "~/utils/calculate-invoice-totals";
import {
  DEFAULT_INVOICE_THEME,
  normalizeInvoice
} from "~/utils/normalize-invoice";

export const invoiceDefault: Invoice = {
  id: "1",
  title: "Invoice",
  image: "",
  number: "1",
  invoiceDate: format(new Date(), "yyyy-MM-dd"),
  dueDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
  seller: {
    label: "From",
    content: "",
    placeholder:
      "Acme Inc.\n123 Main St.\nAnytown, USA 12345\n(555) 555-5555\ninfo@acmeinc.com"
  },
  client: {
    label: "To",
    content: "",
    placeholder:
      "John Doe\n123 Main St.\nAnytown, USA 12345\n(555) 555-5555\njohn.doe@example.com"
  },
  items: [
    {
      id: crypto.randomUUID(),
      description: "Item 1",
      quantity: 1,
      unitPrice: 0,
      amount: 0
    }
  ],
  tableSettings: {
    columnLabels: {
      description: "Item",
      quantity: "Quantity",
      unitPrice: "Unit Price",
      amount: "Amount"
    },
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb"
  },
  labels: {
    invoiceNumber: "Invoice No.",
    invoiceDate: "Date",
    paymentDue: "Due date",
    subtotal: "Subtotal",
    tax: "Tax",
    fees: "Fees",
    discounts: "Discounts",
    total: "Total"
  },
  subtotal: 0,
  tax: {
    percentage: 0,
    amount: 0
  },
  fees: 0,
  discounts: 0,
  total: 0,
  terms: {
    label: "Terms and conditions",
    content: ""
  },
  pdfSettings: {
    backgroundColor: "#ffffff"
  },
  currency: "£",
  theme: DEFAULT_INVOICE_THEME
};

// Helper to apply updater (value or function)
function applyUpdater<T>(current: T, updater: T | ((prev: T) => T)): T {
  return typeof updater === "function"
    ? (updater as (prev: T) => T)(current)
    : updater;
}

// Helper to recalculate and apply totals
function recalculate(state: Invoice): void {
  const calculated = calculateInvoiceTotals(state);
  state.items = calculated.items;
  state.subtotal = calculated.subtotal;
  state.tax = calculated.tax;
  state.total = calculated.total;
}

// Actions type
interface InvoiceActions {
  // Whole state operations
  setInvoice: (invoice: Invoice) => void;
  resetInvoice: () => void;

  // Theme
  setTheme: (
    theme: InvoiceTheme | ((prev: InvoiceTheme) => InvoiceTheme)
  ) => void;

  // Title
  setTitle: (title: string) => void;

  // Image
  setImage: (image: string) => void;

  // Currency
  setCurrency: (currency: Invoice["currency"]) => void;

  // Seller
  setSeller: (
    seller: InvoiceSeller | ((prev: InvoiceSeller) => InvoiceSeller)
  ) => void;

  // Client
  setClient: (
    client: InvoiceClient | ((prev: InvoiceClient) => InvoiceClient)
  ) => void;

  // Details
  setNumber: (number: string) => void;
  setInvoiceDate: (date: string) => void;
  setDueDate: (date: string) => void;

  // Labels
  setLabels: (
    labels: InvoiceLabels | ((prev: InvoiceLabels) => InvoiceLabels)
  ) => void;

  // Line Items
  setTableSettings: (
    settings: TableSettings | ((prev: TableSettings) => TableSettings)
  ) => void;
  addItem: (item: Omit<InvoiceItem, "amount">) => void;
  removeItem: (itemId: string) => void;
  updateItem: (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;

  // Pricing
  setTax: (
    tax: Invoice["tax"] | ((prev: Invoice["tax"]) => Invoice["tax"])
  ) => void;
  setFees: (fees: number) => void;
  setDiscounts: (discounts: number) => void;

  // Terms
  setTerms: (
    terms: InvoiceTerms | ((prev: InvoiceTerms) => InvoiceTerms)
  ) => void;

  // PDF
  setPdfSettings: (
    settings: PdfSettings | ((prev: PdfSettings) => PdfSettings)
  ) => void;
}

export type InvoiceStore = Invoice & InvoiceActions;

export const useInvoiceStore = create<InvoiceStore>()(
  subscribeWithSelector(
    immer(set => ({
      // Initial state
      ...invoiceDefault,

      // Whole state operations
      setInvoice: invoice =>
        set(() => {
          // Normalize legacy/imported shapes, then recompute totals
          const calculated = calculateInvoiceTotals(normalizeInvoice(invoice));
          return { ...calculated };
        }),

      resetInvoice: () =>
        set(() => {
          // Create fresh default with new item IDs
          const fresh = {
            ...invoiceDefault,
            items: [
              {
                id: crypto.randomUUID(),
                description: "Item 1",
                quantity: 1,
                unitPrice: 0,
                amount: 0
              }
            ]
          };
          return fresh;
        }),

      // Theme
      setTheme: theme =>
        set(state => {
          state.theme = applyUpdater(state.theme, theme);
        }),

      // Title
      setTitle: title =>
        set(state => {
          state.title = title;
        }),

      // Image
      setImage: image =>
        set(state => {
          state.image = image;
        }),

      // Currency
      setCurrency: currency =>
        set(state => {
          state.currency = currency;
        }),

      // Seller
      setSeller: seller =>
        set(state => {
          state.seller = applyUpdater(state.seller, seller);
        }),

      // Client
      setClient: client =>
        set(state => {
          state.client = applyUpdater(state.client, client);
        }),

      // Details
      setNumber: number =>
        set(state => {
          state.number = number;
        }),

      setInvoiceDate: date =>
        set(state => {
          state.invoiceDate = date;
        }),

      setDueDate: date =>
        set(state => {
          state.dueDate = date;
        }),

      // Labels
      setLabels: labels =>
        set(state => {
          state.labels = applyUpdater(state.labels, labels);
        }),

      // Line Items
      setTableSettings: settings =>
        set(state => {
          state.tableSettings = applyUpdater(state.tableSettings, settings);
        }),

      addItem: item =>
        set(state => {
          const amount = item.quantity * item.unitPrice;
          state.items.push({ ...item, amount });
          recalculate(state);
        }),

      removeItem: itemId =>
        set(state => {
          state.items = state.items.filter(item => item.id !== itemId);
          recalculate(state);
        }),

      updateItem: (index, field, value) =>
        set(state => {
          const item = state.items[index];

          (item as Record<string, unknown>)[field] = value;
          // Recalculate item amount
          item.amount = item.quantity * item.unitPrice;
          recalculate(state);
        }),

      // Pricing
      setTax: tax =>
        set(state => {
          state.tax = applyUpdater(state.tax, tax);
          recalculate(state);
        }),

      setFees: fees =>
        set(state => {
          state.fees = fees;
          recalculate(state);
        }),

      setDiscounts: discounts =>
        set(state => {
          state.discounts = discounts;
          recalculate(state);
        }),

      // Terms
      setTerms: terms =>
        set(state => {
          state.terms = applyUpdater(state.terms, terms);
        }),

      // PDF
      setPdfSettings: settings =>
        set(state => {
          state.pdfSettings = applyUpdater(state.pdfSettings, settings);
        })
    }))
  )
);
