import { addDays, format } from "date-fns";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { DEFAULT_INVOICE_THEME } from "~/schema/invoice";
import { migrateInvoiceData } from "~/schema/migrations";
import type {
  Invoice,
  InvoiceClient,
  InvoiceItem,
  InvoiceLabels,
  InvoicePaymentDetails,
  InvoiceSeller,
  InvoiceTerms,
  InvoiceTheme,
  PdfSettings,
  TableSettings
} from "~/types";

export const invoiceDefault: Invoice = {
  id: "1",
  title: "Invoice",
  image: "",
  number: "INV-0001",
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
      unitPrice: 0
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
  tax: {
    percentage: 0
  },
  fees: 0,
  discounts: 0,
  terms: {
    label: "Terms and conditions",
    content: ""
  },
  paymentDetails: {
    label: "Payment details",
    bankName: "",
    accountNumber: "",
    iban: "",
    bic: "",
    sortCode: "",
    terms: ""
  },
  pdfSettings: {
    backgroundColor: "#ffffff"
  },
  currency: "£",
  theme: DEFAULT_INVOICE_THEME
};

/**
 * The single factory that seeds a fresh, blank invoice. Every new invoice is
 * created here. A new invoice always starts blank (including a static default
 * number the user edits inline); the returned invoice is a fully independent
 * snapshot, never sharing nested objects with the default.
 */
export function createBlankInvoice(): Invoice {
  return {
    ...structuredClone(invoiceDefault),
    items: invoiceDefault.items.map(item => ({
      ...item,
      id: crypto.randomUUID()
    }))
  };
}

// Helper to apply updater (value or function)
function applyUpdater<T>(current: T, updater: T | ((prev: T) => T)): T {
  return typeof updater === "function"
    ? (updater as (prev: T) => T)(current)
    : updater;
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
  addItem: (item: InvoiceItem) => void;
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

  // Payment details
  setPaymentDetails: (
    paymentDetails:
      | InvoicePaymentDetails
      | ((prev: InvoicePaymentDetails) => InvoicePaymentDetails)
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
          // Validate + migrate any legacy/imported shape to the current schema.
          // Totals are derived at render, so there is nothing to recompute here.
          return migrateInvoiceData(invoice);
        }),

      resetInvoice: () =>
        set(() => {
          // Route blank creation through the single factory.
          return createBlankInvoice();
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
          state.items.push(item);
        }),

      removeItem: itemId =>
        set(state => {
          state.items = state.items.filter(item => item.id !== itemId);
        }),

      updateItem: (index, field, value) =>
        set(state => {
          const item = state.items[index];

          switch (field) {
            case "id":
            case "description":
              item[field] = String(value);
              break;
            case "quantity":
            case "unitPrice":
              item[field] = Number(value);
              break;
          }
        }),

      // Pricing
      setTax: tax =>
        set(state => {
          state.tax = applyUpdater(state.tax, tax);
        }),

      setFees: fees =>
        set(state => {
          state.fees = fees;
        }),

      setDiscounts: discounts =>
        set(state => {
          state.discounts = discounts;
        }),

      // Terms
      setTerms: terms =>
        set(state => {
          state.terms = applyUpdater(state.terms, terms);
        }),

      // Payment details
      setPaymentDetails: paymentDetails =>
        set(state => {
          state.paymentDetails = applyUpdater(
            state.paymentDetails,
            paymentDetails
          );
        }),

      // PDF
      setPdfSettings: settings =>
        set(state => {
          state.pdfSettings = applyUpdater(state.pdfSettings, settings);
        })
    }))
  )
);
