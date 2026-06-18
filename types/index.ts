import type { FileRouteTypes } from "app/routeTree.gen";
import type { topCurrencies } from "consts/currencies";

export type ValidRoute = FileRouteTypes["to"];

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Type for accessing deeply nested properties in an object with autocomplete support.
 * This type creates dot-notation paths for all nested properties.
 */
export type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends Array<any>
          ? K
          : T[K] extends object
            ? K | `${K}.${DeepKeyOf<T[K]>}`
            : K
        : never;
    }[keyof T]
  : never;

/**
 * Type for getting the value type at a deep path in an object.
 * Use with DeepKeyOf to get proper typing for nested values.
 */
export type DeepValueType<T, TPath extends string> = TPath extends keyof T
  ? T[TPath]
  : TPath extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? DeepValueType<T[K], R>
      : never
    : never;

/**
 * Helper type for working with nested paths in an object.
 * Provides both the path string and the expected value type.
 */
export type DeepPath<T> = {
  [P in DeepKeyOf<T>]: {
    path: P;
    valueType: DeepValueType<T, P>;
  };
}[DeepKeyOf<T>];

/**
 * More precise helper function for updating deeply nested values with type safety.
 * @param obj The object to update
 * @param path The nested path as a dot-notation string
 * @param value The new value to set
 * @returns A new object with the updated value
 */
export function updateDeepValue<
  T extends object,
  TPath extends DeepKeyOf<T>,
  TValue extends DeepValueType<T, TPath>
>(obj: T, path: TPath, value: TValue): T {
  const keys = path.split(".");
  const key = keys[0] as keyof T;

  if (keys.length === 1) {
    return {
      ...obj,
      [key]: value
    };
  }

  const remainingPath = keys.slice(1).join(".") as any;
  return {
    ...obj,
    [key]: updateDeepValue(obj[key] as any, remainingPath, value)
  };
}

export type Currency = (typeof topCurrencies)[number];

export interface SelectOption {
  readonly label: string;
  readonly value: string;
}

export type ApiResponse<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export type TextSettings = {
  align: "left" | "center" | "right";
  size: string;
  weight: "Normal" | "Medium" | "Semibold" | "Bold";
  color: string;
};

export type TableSettings = {
  columnLabels: {
    description: string;
    quantity: string;
    unitPrice: string;
    amount: string;
  };
  backgroundColor: string;
  borderColor: string;
};

export type InvoiceFont = "geist";

export type InvoiceSize = "small" | "medium" | "large";

export type InvoiceTheme = {
  font: InvoiceFont;
  size: InvoiceSize;
  accent: string;
};

export type TextRole =
  | "title"
  | "sectionLabel"
  | "sectionContent"
  | "termsContent"
  | "detailLabel"
  | "detailValue"
  | "tableHeaderLeft"
  | "tableHeaderCenter"
  | "tableHeaderRight"
  | "tableRowLeft"
  | "tableRowCenter"
  | "tableRowRight"
  | "totalsLabel"
  | "totalsValue"
  | "grandTotalLabel"
  | "grandTotalValue";

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type InvoiceSeller = {
  label: string;
  content: string;
  placeholder: string;
};

export type InvoiceClient = {
  label: string;
  content: string;
  placeholder: string;
};

export type InvoiceTerms = {
  label: string;
  content: string;
};

export type PdfSettings = {
  backgroundColor: string;
};

export type Invoice = {
  id: string;
  title: string;
  image: string;
  number: string;
  invoiceDate: string;
  dueDate: string;
  seller: InvoiceSeller;
  client: InvoiceClient;
  items: InvoiceItem[];
  tableSettings: TableSettings;
  subtotal: number;
  tax: {
    percentage: number;
    amount: number;
  };
  fees: number;
  discounts: number;
  total: number;
  terms: InvoiceTerms;
  pdfSettings: PdfSettings;
  currency: Currency;
  theme: InvoiceTheme;
};

export type InvoiceDocument = {
  id: string;
  name: string;
  invoiceData: Invoice;
  templateId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BillsendExportFile = {
  meta: {
    version: number;
    exportedAt: string;
    appName: "billsend";
  };
  templates: Array<{
    id: string;
    name: string;
    description: string | null;
    isDefault: boolean;
    templateData: Invoice;
    screenshotUrl: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  invoices: Array<{
    id: string;
    name: string;
    invoiceData: Invoice;
    templateId: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  images: Array<{
    id: string;
    data: string;
    type: string;
    createdAt: string;
  }>;
};

export type ImportAnalysis = {
  templates: { total: number; new: number; conflicts: string[] };
  invoices: { total: number; new: number; conflicts: string[] };
  images: { total: number; new: number; duplicates: number };
};

export type ImportResult = {
  templatesImported: number;
  invoicesImported: number;
  imagesImported: number;
};

export type InvoiceTemplate = {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  templateData: Invoice;
  screenshotUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};
