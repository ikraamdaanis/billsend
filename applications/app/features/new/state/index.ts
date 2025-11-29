import { addDays, format } from "date-fns";
import type {
  Invoice,
  InvoiceItem,
  InvoiceTemplate,
  InvoiceTerms,
  TableSettings,
  TextSettings
} from "features/new/types";
import { calculateInvoiceTotals } from "features/new/utils/calculate-invoice-totals";
import { atom } from "jotai";
import { setTypedNestedValue } from "lib/set-nested-value";
import type { Currency, DeepKeyOf, DeepValueType } from "types";

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
    weight: "Bold",
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
      weight: "Medium",
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
      weight: "Medium",
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
      weight: "Medium",
      color: DEFAULT_FONT_COLOUR
    }
  },
  seller: {
    content: "",
    placeholder:
      "Acme Inc.\n123 Main St.\nAnytown, USA 12345\n(555) 555-5555\ninfo@acmeinc.com"
  },
  sellerSettings: {
    align: "left",
    size: "14",
    weight: "Medium",
    color: DEFAULT_FONT_COLOUR
  },
  client: {
    content: "",
    placeholder:
      "John Doe\n123 Main St.\nAnytown, USA 12345\n(555) 555-5555\njohn.doe@example.com"
  },
  clientSettings: {
    align: "left",
    size: "14",
    weight: "Normal",
    color: DEFAULT_FONT_COLOUR
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
      weight: "Medium",
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
      weight: "Medium",
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
      weight: "Medium",
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
      weight: "Medium",
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

const STORAGE_KEY = "invoice-templates";

function loadTemplatesFromStorage(): InvoiceTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map(
      (
        template: Omit<InvoiceTemplate, "createdAt" | "updatedAt"> & {
          createdAt: string;
          updatedAt: string;
        }
      ) => ({
        ...template,
        createdAt: new Date(template.createdAt),
        updatedAt: new Date(template.updatedAt)
      })
    );
  } catch {
    return [];
  }
}

export const invoiceTemplatesAtom = atom<InvoiceTemplate[]>(
  loadTemplatesFromStorage()
);
export const invoiceTemplatesErrorAtom = atom<unknown>(null);

// Create initial invoice atom
export const invoiceAtom = atom<Invoice>(invoiceDefault);

// Create derived atom for adding new invoice item
export const addInvoiceItemAtom = atom(
  null,
  (get, set, newItem: Omit<InvoiceItem, "amount">) => {
    const invoice = get(invoiceAtom);
    const amount = newItem.quantity * newItem.unitPrice;

    const updatedItems = [...invoice.items, { ...newItem, amount }];

    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (invoice.tax.percentage / 100);
    const total = subtotal + taxAmount + invoice.fees - invoice.discounts;

    set(invoiceAtom, {
      ...invoice,
      items: updatedItems,
      subtotal,
      tax: {
        ...invoice.tax,
        amount: taxAmount
      },
      total
    });
  }
);

export const updateInvoicePricingAtom = atom(null, (get, set) => {
  const invoice = get(invoiceAtom);

  const updatedItems = [...invoice.items];

  const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);

  const taxAmount = subtotal * (invoice.tax.percentage / 100);
  const total = subtotal + taxAmount + invoice.fees - invoice.discounts;

  set(invoiceAtom, {
    ...invoice,
    subtotal,
    tax: {
      ...invoice.tax,
      amount: taxAmount
    },
    total
  });
});

// Create a utility atom for updating invoice values by key
export const updateInvoiceValueAtom = atom(
  null,
  <P extends DeepKeyOf<Invoice>, V extends DeepValueType<Invoice, P>>(
    get: (a: typeof invoiceAtom) => Invoice,
    set: (a: typeof invoiceAtom, v: Invoice) => void,
    payload: { field: P; value: V }
  ) => {
    const { field, value } = payload;
    const invoice = get(invoiceAtom);

    // Use the type-safe nested value setter
    const updated = setTypedNestedValue(invoice, field, value);

    // Update the invoice with calculated totals
    set(invoiceAtom, calculateInvoiceTotals(updated));
  }
);

export const lineItemsAtom = atom(get => get(invoiceAtom).items);
export const tableSettingsAtom = atom(get => get(invoiceAtom).tableSettings);
export const updateTableSettingsAtom = atom(
  null,
  (get, set, settings: Partial<TableSettings>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      tableSettings: {
        ...get(invoiceAtom).tableSettings,
        ...settings
      }
    });
  }
);

// More specific update functions for table parts
export const updateDescriptionHeaderSettingsAtom = atom(
  null,
  (get, set, settings: Partial<TextSettings & { label?: string }>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      tableSettings: {
        ...get(invoiceAtom).tableSettings,
        descriptionHeaderSettings: {
          ...get(invoiceAtom).tableSettings.descriptionHeaderSettings,
          ...settings
        }
      }
    });
  }
);

export const updateDescriptionRowSettingsAtom = atom(
  null,
  (get, set, settings: Partial<TextSettings>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      tableSettings: {
        ...get(invoiceAtom).tableSettings,
        descriptionRowSettings: {
          ...get(invoiceAtom).tableSettings.descriptionRowSettings,
          ...settings
        }
      }
    });
  }
);

export const updateQuantityHeaderSettingsAtom = atom(
  null,
  (get, set, settings: Partial<TextSettings & { label?: string }>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      tableSettings: {
        ...get(invoiceAtom).tableSettings,
        quantityHeaderSettings: {
          ...get(invoiceAtom).tableSettings.quantityHeaderSettings,
          ...settings
        }
      }
    });
  }
);

export const updateQuantityRowSettingsAtom = atom(
  null,
  (get, set, settings: Partial<TextSettings>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      tableSettings: {
        ...get(invoiceAtom).tableSettings,
        quantityRowSettings: {
          ...get(invoiceAtom).tableSettings.quantityRowSettings,
          ...settings
        }
      }
    });
  }
);

export const updateUnitPriceHeaderSettingsAtom = atom(
  null,
  (get, set, settings: Partial<TextSettings & { label?: string }>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      tableSettings: {
        ...get(invoiceAtom).tableSettings,
        unitPriceHeaderSettings: {
          ...get(invoiceAtom).tableSettings.unitPriceHeaderSettings,
          ...settings
        }
      }
    });
  }
);

export const updateUnitPriceRowSettingsAtom = atom(
  null,
  (get, set, settings: Partial<TextSettings>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      tableSettings: {
        ...get(invoiceAtom).tableSettings,
        unitPriceRowSettings: {
          ...get(invoiceAtom).tableSettings.unitPriceRowSettings,
          ...settings
        }
      }
    });
  }
);

export const updateAmountHeaderSettingsAtom = atom(
  null,
  (get, set, settings: Partial<TextSettings & { label?: string }>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      tableSettings: {
        ...get(invoiceAtom).tableSettings,
        amountHeaderSettings: {
          ...get(invoiceAtom).tableSettings.amountHeaderSettings,
          ...settings
        }
      }
    });
  }
);

export const updateAmountRowSettingsAtom = atom(
  null,
  (get, set, settings: Partial<TextSettings>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      tableSettings: {
        ...get(invoiceAtom).tableSettings,
        amountRowSettings: {
          ...get(invoiceAtom).tableSettings.amountRowSettings,
          ...settings
        }
      }
    });
  }
);

export const updateTableDesignSettingsAtom = atom(
  null,
  (
    get,
    set,
    designSettings: { backgroundColor?: string; borderColor?: string }
  ) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      tableSettings: {
        ...get(invoiceAtom).tableSettings,
        ...(designSettings.backgroundColor
          ? { backgroundColor: designSettings.backgroundColor }
          : {}),
        ...(designSettings.borderColor
          ? { borderColor: designSettings.borderColor }
          : {})
      }
    });
  }
);

export const currencyAtom = atom(get => get(invoiceAtom).currency);
export const updateCurrencyAtom = atom(null, (get, set, value: Currency) => {
  set(invoiceAtom, { ...get(invoiceAtom), currency: value });
});
export const titleAtom = atom(get => get(invoiceAtom).title);
export const updateTitleAtom = atom(null, (get, set, value: string) => {
  set(invoiceAtom, { ...get(invoiceAtom), title: value });
});
export const titleSettingsAtom = atom(get => get(invoiceAtom).titleSettings);
export const updateTitleSettingsAtom = atom(
  null,
  (get, set, titleSettings: Partial<TextSettings>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      titleSettings: {
        ...get(invoiceAtom).titleSettings,
        ...titleSettings
      }
    });
  }
);
export const imageAtom = atom(get => get(invoiceAtom).image);
export const updateImageAtom = atom(null, (get, set, value: string) => {
  set(invoiceAtom, { ...get(invoiceAtom), image: value });
});
// ==============================
// ----------- Number -----------
// ==============================
export const numberAtom = atom(get => get(invoiceAtom).number);
export const updateNumberAtom = atom(null, (get, set, value: string) => {
  set(invoiceAtom, { ...get(invoiceAtom), number: value });
});

export const numberSettingsAtom = atom(get => get(invoiceAtom).numberSettings);
export const updateNumberSettingsAtom = atom(
  null,
  (
    get,
    set,
    value: { label?: Partial<TextSettings>; value?: Partial<TextSettings> }
  ) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      numberSettings: {
        ...get(invoiceAtom).numberSettings,
        label: {
          ...get(invoiceAtom).numberSettings.label,
          ...value.label
        },
        value: {
          ...get(invoiceAtom).numberSettings.value,
          ...value.value
        }
      }
    });
  }
);

export const invoiceDateAtom = atom(get => get(invoiceAtom).invoiceDate);
export const updateInvoiceDateAtom = atom(null, (get, set, value: string) => {
  set(invoiceAtom, { ...get(invoiceAtom), invoiceDate: value });
});
export const invoiceDateSettingsAtom = atom(
  get => get(invoiceAtom).invoiceDateSettings
);
export const updateInvoiceDateSettingsAtom = atom(
  null,
  (
    get,
    set,
    value: { label?: Partial<TextSettings>; value?: Partial<TextSettings> }
  ) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      invoiceDateSettings: {
        ...get(invoiceAtom).invoiceDateSettings,
        label: {
          ...get(invoiceAtom).invoiceDateSettings.label,
          ...value.label
        },
        value: {
          ...get(invoiceAtom).invoiceDateSettings.value,
          ...value.value
        }
      }
    });
  }
);

// ==============================
// ---------- Due Date ----------
// ==============================
export const dueDateAtom = atom(get => get(invoiceAtom).dueDate);
export const updateDueDateAtom = atom(null, (get, set, value: string) => {
  set(invoiceAtom, { ...get(invoiceAtom), dueDate: value });
});

export const dueDateSettingsAtom = atom(
  get => get(invoiceAtom).dueDateSettings
);
export const updateDueDateSettingsAtom = atom(
  null,
  (
    get,
    set,
    value: { label?: Partial<TextSettings>; value?: Partial<TextSettings> }
  ) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      dueDateSettings: {
        ...get(invoiceAtom).dueDateSettings,
        label: {
          ...get(invoiceAtom).dueDateSettings.label,
          ...value.label
        },
        value: {
          ...get(invoiceAtom).dueDateSettings.value,
          ...value.value
        }
      }
    });
  }
);

// ==============================
// ----------- Seller -----------
// ==============================
export const sellerAtom = atom(get => get(invoiceAtom).seller);
export const updateSellerAtom = atom(null, (get, set, value: string) => {
  set(invoiceAtom, {
    ...get(invoiceAtom),
    seller: {
      ...get(invoiceAtom).seller,
      content: value
    }
  });
});

export const sellerSettingsAtom = atom(get => get(invoiceAtom).sellerSettings);
export const updateSellerSettingsAtom = atom(
  null,
  (get, set, value: Partial<TextSettings>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      sellerSettings: {
        ...get(invoiceAtom).sellerSettings,
        ...value
      }
    });
  }
);

// ==============================
// ----------- Client -----------
// ==============================
export const clientAtom = atom(get => get(invoiceAtom).client);
export const updateClientAtom = atom(null, (get, set, value: string) => {
  set(invoiceAtom, {
    ...get(invoiceAtom),
    client: {
      ...get(invoiceAtom).client,
      content: value
    }
  });
});

export const clientSettingsAtom = atom(get => get(invoiceAtom).clientSettings);
export const updateClientSettingsAtom = atom(
  null,
  (get, set, value: Partial<TextSettings>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      clientSettings: {
        ...get(invoiceAtom).clientSettings,
        ...value
      }
    });
  }
);

export const subtotalAtom = atom(get => get(invoiceAtom).subtotal);
export const subtotalSettingsAtom = atom(
  get => get(invoiceAtom).subtotalSettings
);
export const updateSubtotalSettingsAtom = atom(
  null,
  (
    get,
    set,
    settings: { label?: Partial<TextSettings>; value?: Partial<TextSettings> }
  ) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      subtotalSettings: {
        ...get(invoiceAtom).subtotalSettings,
        label: {
          ...get(invoiceAtom).subtotalSettings.label,
          ...settings.label
        },
        value: {
          ...get(invoiceAtom).subtotalSettings.value,
          ...settings.value
        }
      }
    });
  }
);
export const taxAtom = atom(get => get(invoiceAtom).tax);
export const updateTaxAtom = atom(null, (get, set, value: number) => {
  set(invoiceAtom, {
    ...get(invoiceAtom),
    tax: { ...get(invoiceAtom).tax, percentage: value }
  });
});
export const taxSettingsAtom = atom(get => get(invoiceAtom).taxSettings);
export const updateTaxSettingsAtom = atom(
  null,
  (
    get,
    set,
    settings: { label?: Partial<TextSettings>; value?: Partial<TextSettings> }
  ) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      taxSettings: {
        ...get(invoiceAtom).taxSettings,
        label: {
          ...get(invoiceAtom).taxSettings.label,
          ...settings.label
        },
        value: {
          ...get(invoiceAtom).taxSettings.value,
          ...settings.value
        }
      }
    });
  }
);
export const feesAtom = atom(get => get(invoiceAtom).fees);
export const updateFeesAtom = atom(null, (get, set, value: number) => {
  set(invoiceAtom, { ...get(invoiceAtom), fees: value });
});
export const feesSettingsAtom = atom(get => get(invoiceAtom).feesSettings);
export const updateFeesSettingsAtom = atom(
  null,
  (
    get,
    set,
    settings: { label?: Partial<TextSettings>; value?: Partial<TextSettings> }
  ) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      feesSettings: {
        ...get(invoiceAtom).feesSettings,
        label: {
          ...get(invoiceAtom).feesSettings.label,
          ...settings.label
        },
        value: {
          ...get(invoiceAtom).feesSettings.value,
          ...settings.value
        }
      }
    });
  }
);
export const discountsAtom = atom(get => get(invoiceAtom).discounts);
export const updateDiscountsAtom = atom(null, (get, set, value: number) => {
  set(invoiceAtom, { ...get(invoiceAtom), discounts: value });
});
export const discountsSettingsAtom = atom(
  get => get(invoiceAtom).discountsSettings
);
export const updateDiscountsSettingsAtom = atom(
  null,
  (
    get,
    set,
    settings: { label?: Partial<TextSettings>; value?: Partial<TextSettings> }
  ) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      discountsSettings: {
        ...get(invoiceAtom).discountsSettings,
        label: {
          ...get(invoiceAtom).discountsSettings.label,
          ...settings.label
        },
        value: {
          ...get(invoiceAtom).discountsSettings.value,
          ...settings.value
        }
      }
    });
  }
);
export const totalAtom = atom(get => get(invoiceAtom).total);
export const totalSettingsAtom = atom(get => get(invoiceAtom).totalSettings);
export const updateTotalSettingsAtom = atom(
  null,
  (
    get,
    set,
    settings: { label?: Partial<TextSettings>; value?: Partial<TextSettings> }
  ) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      totalSettings: {
        ...get(invoiceAtom).totalSettings,
        label: {
          ...get(invoiceAtom).totalSettings.label,
          ...settings.label
        },
        value: {
          ...get(invoiceAtom).totalSettings.value,
          ...settings.value
        }
      }
    });
  }
);

// ==============================
// ----------- Terms ------------
// ==============================
export const termsAtom = atom(get => get(invoiceAtom).terms);
export const updateTermsAtom = atom(
  null,
  (get, set, value: Partial<InvoiceTerms>) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      terms: { ...get(invoiceAtom).terms, ...value }
    });
  }
);

export const termsSettingsAtom = atom(get => get(invoiceAtom).termsSettings);
export const updateTermsSettingsAtom = atom(
  null,
  (
    get,
    set,
    value: Partial<{
      label?: Partial<TextSettings>;
      content?: Partial<TextSettings>;
    }>
  ) => {
    set(invoiceAtom, {
      ...get(invoiceAtom),
      termsSettings: {
        ...get(invoiceAtom).termsSettings,
        label: value.label
          ? {
              ...get(invoiceAtom).termsSettings.label,
              ...value.label
            }
          : get(invoiceAtom).termsSettings.label,
        content: value.content
          ? {
              ...get(invoiceAtom).termsSettings.content,
              ...value.content
            }
          : get(invoiceAtom).termsSettings.content
      }
    });
  }
);

export const pdfSettingsAtom = atom(get => get(invoiceAtom).pdfSettings);
