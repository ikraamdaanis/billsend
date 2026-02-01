import { currencySymbols } from "consts/currencies";
import { addDays, format } from "date-fns";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  Invoice,
  InvoiceClient,
  InvoiceItem,
  InvoiceSeller,
  InvoiceTerms,
  PdfSettings,
  TableSettings,
  TextSettings
} from "types";
import { calculateInvoiceTotals } from "utils/calculate-invoice-totals";

// Build a Map for O(1) currency symbol lookups
const currencySymbolMap = new Map(
  currencySymbols.map(currency => [currency.code, currency.symbol])
);

const DEFAULT_FONT_COLOUR = "#1a1a1a";

const LINE_ITEMS_DEFAULTS = {
  HEADER_WEIGHT: "Medium" as const,
  HEADER_SIZE: "13" as const,
  HEADER_ALIGN: "left" as const,
  HEADER_COLOR: DEFAULT_FONT_COLOUR,
  ROW_WEIGHT: "Normal" as const,
  ROW_SIZE: "14" as const,
  ROW_ALIGN: "left" as const,
  ROW_COLOR: DEFAULT_FONT_COLOUR
};

export const invoiceDefault: Invoice = {
  id: "1",
  title: "Invoice",
  image: "",
  titleSettings: {
    align: "left",
    size: "36",
    weight: "Semibold",
    color: DEFAULT_FONT_COLOUR
  },
  number: "1",
  numberSettings: {
    label: {
      align: "left",
      size: "14",
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    },
    value: {
      align: "left",
      size: "14",
      weight: "Normal",
      color: DEFAULT_FONT_COLOUR
    }
  },
  invoiceDate: format(new Date(), "yyyy-MM-dd"),
  invoiceDateSettings: {
    label: {
      align: "left",
      size: "14",
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    },
    value: {
      align: "left",
      size: "14",
      weight: "Normal",
      color: DEFAULT_FONT_COLOUR
    }
  },
  dueDate: format(addDays(new Date(), 30), "yyyy-MM-dd"),
  dueDateSettings: {
    label: {
      align: "left",
      size: "14",
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    },
    value: {
      align: "left",
      size: "14",
      weight: "Normal",
      color: DEFAULT_FONT_COLOUR
    }
  },
  seller: {
    label: "From",
    content: "",
    placeholder:
      "Acme Inc.\n123 Main St.\nAnytown, USA 12345\n(555) 555-5555\ninfo@acmeinc.com"
  },
  sellerSettings: {
    label: {
      align: "left",
      size: "14",
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    },
    content: {
      align: "left",
      size: "14",
      weight: "Normal",
      color: DEFAULT_FONT_COLOUR
    }
  },
  client: {
    label: "To",
    content: "",
    placeholder:
      "John Doe\n123 Main St.\nAnytown, USA 12345\n(555) 555-5555\njohn.doe@example.com"
  },
  clientSettings: {
    label: {
      align: "left",
      size: "14",
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    },
    content: {
      align: "left",
      size: "14",
      weight: "Normal",
      color: DEFAULT_FONT_COLOUR
    }
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
    headerSettings: {
      align: LINE_ITEMS_DEFAULTS.HEADER_ALIGN,
      size: LINE_ITEMS_DEFAULTS.HEADER_SIZE,
      weight: LINE_ITEMS_DEFAULTS.HEADER_WEIGHT,
      color: LINE_ITEMS_DEFAULTS.HEADER_COLOR
    },
    rowSettings: {
      align: LINE_ITEMS_DEFAULTS.ROW_ALIGN,
      size: LINE_ITEMS_DEFAULTS.ROW_SIZE,
      weight: LINE_ITEMS_DEFAULTS.ROW_WEIGHT,
      color: LINE_ITEMS_DEFAULTS.ROW_COLOR
    },
    descriptionHeaderSettings: {
      align: "left",
      size: LINE_ITEMS_DEFAULTS.HEADER_SIZE,
      weight: LINE_ITEMS_DEFAULTS.HEADER_WEIGHT,
      color: LINE_ITEMS_DEFAULTS.HEADER_COLOR,
      label: "Item"
    },
    descriptionRowSettings: {
      align: "left",
      size: LINE_ITEMS_DEFAULTS.ROW_SIZE,
      weight: LINE_ITEMS_DEFAULTS.ROW_WEIGHT,
      color: LINE_ITEMS_DEFAULTS.ROW_COLOR
    },
    quantityHeaderSettings: {
      align: "center",
      size: LINE_ITEMS_DEFAULTS.HEADER_SIZE,
      weight: LINE_ITEMS_DEFAULTS.HEADER_WEIGHT,
      color: LINE_ITEMS_DEFAULTS.HEADER_COLOR,
      label: "Quantity"
    },
    quantityRowSettings: {
      align: "center",
      size: LINE_ITEMS_DEFAULTS.ROW_SIZE,
      weight: LINE_ITEMS_DEFAULTS.ROW_WEIGHT,
      color: LINE_ITEMS_DEFAULTS.ROW_COLOR
    },
    unitPriceHeaderSettings: {
      align: "center",
      size: LINE_ITEMS_DEFAULTS.HEADER_SIZE,
      weight: LINE_ITEMS_DEFAULTS.HEADER_WEIGHT,
      color: LINE_ITEMS_DEFAULTS.HEADER_COLOR,
      label: "Unit Price"
    },
    unitPriceRowSettings: {
      align: "center",
      size: LINE_ITEMS_DEFAULTS.ROW_SIZE,
      weight: LINE_ITEMS_DEFAULTS.ROW_WEIGHT,
      color: LINE_ITEMS_DEFAULTS.ROW_COLOR
    },
    amountHeaderSettings: {
      align: "right",
      size: LINE_ITEMS_DEFAULTS.HEADER_SIZE,
      weight: LINE_ITEMS_DEFAULTS.HEADER_WEIGHT,
      color: LINE_ITEMS_DEFAULTS.HEADER_COLOR,
      label: "Amount"
    },
    amountRowSettings: {
      align: "right",
      size: LINE_ITEMS_DEFAULTS.ROW_SIZE,
      weight: LINE_ITEMS_DEFAULTS.ROW_WEIGHT,
      color: LINE_ITEMS_DEFAULTS.ROW_COLOR
    },
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb"
  },
  subtotal: 0,
  subtotalSettings: {
    label: {
      align: "right",
      size: "14",
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    },
    value: {
      align: "right",
      size: "14",
      weight: "Normal",
      color: DEFAULT_FONT_COLOUR
    }
  },
  tax: {
    percentage: 0,
    amount: 0
  },
  taxSettings: {
    label: {
      align: "right",
      size: "14",
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    },
    value: {
      align: "right",
      size: "14",
      weight: "Normal",
      color: DEFAULT_FONT_COLOUR
    }
  },
  fees: 0,
  feesSettings: {
    label: {
      align: "right",
      size: "14",
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    },
    value: {
      align: "right",
      size: "14",
      weight: "Normal",
      color: DEFAULT_FONT_COLOUR
    }
  },
  discounts: 0,
  discountsSettings: {
    label: {
      align: "right",
      size: "14",
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    },
    value: {
      align: "right",
      size: "14",
      weight: "Normal",
      color: DEFAULT_FONT_COLOUR
    }
  },
  total: 0,
  totalSettings: {
    label: {
      align: "right",
      size: "16",
      weight: "Semibold",
      color: DEFAULT_FONT_COLOUR
    },
    value: {
      align: "right",
      size: "16",
      weight: "Semibold",
      color: DEFAULT_FONT_COLOUR
    }
  },
  terms: {
    label: "Terms and conditions",
    content: ""
  },
  termsSettings: {
    label: {
      align: "left",
      size: "14",
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    },
    content: {
      align: "left",
      size: "13",
      weight: "Normal",
      color: DEFAULT_FONT_COLOUR
    }
  },
  pdfSettings: {
    backgroundColor: "#ffffff"
  },
  currency: "GBP"
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

  // Title
  setTitle: (title: string) => void;
  setTitleSettings: (
    settings: TextSettings | ((prev: TextSettings) => TextSettings)
  ) => void;

  // Image
  setImage: (image: string) => void;

  // Currency
  setCurrency: (currency: Invoice["currency"]) => void;

  // Seller
  setSeller: (
    seller: InvoiceSeller | ((prev: InvoiceSeller) => InvoiceSeller)
  ) => void;
  setSellerSettings: (
    settings:
      | Invoice["sellerSettings"]
      | ((prev: Invoice["sellerSettings"]) => Invoice["sellerSettings"])
  ) => void;

  // Client
  setClient: (
    client: InvoiceClient | ((prev: InvoiceClient) => InvoiceClient)
  ) => void;
  setClientSettings: (
    settings:
      | Invoice["clientSettings"]
      | ((prev: Invoice["clientSettings"]) => Invoice["clientSettings"])
  ) => void;

  // Details
  setNumber: (number: string) => void;
  setNumberSettings: (
    settings:
      | Invoice["numberSettings"]
      | ((prev: Invoice["numberSettings"]) => Invoice["numberSettings"])
  ) => void;
  setInvoiceDate: (date: string) => void;
  setInvoiceDateSettings: (
    settings:
      | Invoice["invoiceDateSettings"]
      | ((prev: Invoice["invoiceDateSettings"]) => Invoice["invoiceDateSettings"])
  ) => void;
  setDueDate: (date: string) => void;
  setDueDateSettings: (
    settings:
      | Invoice["dueDateSettings"]
      | ((prev: Invoice["dueDateSettings"]) => Invoice["dueDateSettings"])
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
  setTaxSettings: (
    settings:
      | Invoice["taxSettings"]
      | ((prev: Invoice["taxSettings"]) => Invoice["taxSettings"])
  ) => void;
  setFees: (fees: number) => void;
  setFeesSettings: (
    settings:
      | Invoice["feesSettings"]
      | ((prev: Invoice["feesSettings"]) => Invoice["feesSettings"])
  ) => void;
  setDiscounts: (discounts: number) => void;
  setDiscountsSettings: (
    settings:
      | Invoice["discountsSettings"]
      | ((prev: Invoice["discountsSettings"]) => Invoice["discountsSettings"])
  ) => void;
  setSubtotalSettings: (
    settings:
      | Invoice["subtotalSettings"]
      | ((prev: Invoice["subtotalSettings"]) => Invoice["subtotalSettings"])
  ) => void;
  setTotalSettings: (
    settings:
      | Invoice["totalSettings"]
      | ((prev: Invoice["totalSettings"]) => Invoice["totalSettings"])
  ) => void;

  // Terms
  setTerms: (
    terms: InvoiceTerms | ((prev: InvoiceTerms) => InvoiceTerms)
  ) => void;
  setTermsSettings: (
    settings:
      | Invoice["termsSettings"]
      | ((prev: Invoice["termsSettings"]) => Invoice["termsSettings"])
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
          // Return a fresh copy to ensure all slices update
          const calculated = calculateInvoiceTotals(invoice);
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

      // Title
      setTitle: title =>
        set(state => {
          state.title = title;
        }),

      setTitleSettings: settings =>
        set(state => {
          state.titleSettings = applyUpdater(state.titleSettings, settings);
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

      setSellerSettings: settings =>
        set(state => {
          state.sellerSettings = applyUpdater(state.sellerSettings, settings);
        }),

      // Client
      setClient: client =>
        set(state => {
          state.client = applyUpdater(state.client, client);
        }),

      setClientSettings: settings =>
        set(state => {
          state.clientSettings = applyUpdater(state.clientSettings, settings);
        }),

      // Details
      setNumber: number =>
        set(state => {
          state.number = number;
        }),

      setNumberSettings: settings =>
        set(state => {
          state.numberSettings = applyUpdater(state.numberSettings, settings);
        }),

      setInvoiceDate: date =>
        set(state => {
          state.invoiceDate = date;
        }),

      setInvoiceDateSettings: settings =>
        set(state => {
          state.invoiceDateSettings = applyUpdater(
            state.invoiceDateSettings,
            settings
          );
        }),

      setDueDate: date =>
        set(state => {
          state.dueDate = date;
        }),

      setDueDateSettings: settings =>
        set(state => {
          state.dueDateSettings = applyUpdater(state.dueDateSettings, settings);
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
          if (item) {
            (item as Record<string, unknown>)[field] = value;
            // Recalculate item amount
            item.amount = item.quantity * item.unitPrice;
            recalculate(state);
          }
        }),

      // Pricing
      setTax: tax =>
        set(state => {
          state.tax = applyUpdater(state.tax, tax);
          recalculate(state);
        }),

      setTaxSettings: settings =>
        set(state => {
          state.taxSettings = applyUpdater(state.taxSettings, settings);
        }),

      setFees: fees =>
        set(state => {
          state.fees = fees;
          recalculate(state);
        }),

      setFeesSettings: settings =>
        set(state => {
          state.feesSettings = applyUpdater(state.feesSettings, settings);
        }),

      setDiscounts: discounts =>
        set(state => {
          state.discounts = discounts;
          recalculate(state);
        }),

      setDiscountsSettings: settings =>
        set(state => {
          state.discountsSettings = applyUpdater(
            state.discountsSettings,
            settings
          );
        }),

      setSubtotalSettings: settings =>
        set(state => {
          state.subtotalSettings = applyUpdater(
            state.subtotalSettings,
            settings
          );
        }),

      setTotalSettings: settings =>
        set(state => {
          state.totalSettings = applyUpdater(state.totalSettings, settings);
        }),

      // Terms
      setTerms: terms =>
        set(state => {
          state.terms = applyUpdater(state.terms, terms);
        }),

      setTermsSettings: settings =>
        set(state => {
          state.termsSettings = applyUpdater(state.termsSettings, settings);
        }),

      // PDF
      setPdfSettings: settings =>
        set(state => {
          state.pdfSettings = applyUpdater(state.pdfSettings, settings);
        })
    }))
  )
);

// Export currency symbol map for selectors
export { currencySymbolMap };
