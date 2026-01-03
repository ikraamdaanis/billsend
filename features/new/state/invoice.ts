import { addDays, format } from "date-fns";
import type { Invoice } from "features/new/types";
import { calculateInvoiceTotals } from "features/new/utils/calculate-invoice-totals";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { focusAtom } from "jotai-optics";
import { setTypedNestedValue } from "lib/set-nested-value";
import type { DeepKeyOf, DeepValueType } from "types";

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

// Base invoice atom with immer for easier updates
export const invoiceAtom = atomWithImmer<Invoice>(invoiceDefault);

// Focused atoms for image and currency
export const imageAtom = focusAtom(invoiceAtom, o => o.prop("image"));
export const currencyAtom = focusAtom(invoiceAtom, o => o.prop("currency"));

// Utility atom for updating nested invoice values with dynamic paths
// Uses setTypedNestedValue to maintain the same API as before
export const updateInvoiceValueAtom = atom(
  null,
  <P extends DeepKeyOf<Invoice>, V extends DeepValueType<Invoice, P>>(
    get: (a: typeof invoiceAtom) => Invoice,
    set: (a: typeof invoiceAtom, updater: (draft: Invoice) => void) => void,
    payload: { field: P; value: V }
  ) => {
    const { field, value } = payload;
    const invoice = get(invoiceAtom);

    // Use the type-safe nested value setter
    const updated = setTypedNestedValue(invoice, field, value);

    // Update the invoice with calculated totals using immer
    set(invoiceAtom, draft => {
      const calculated = calculateInvoiceTotals(updated);
      Object.assign(draft, calculated);
    });
  }
);
