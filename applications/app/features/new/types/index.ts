import type { Currency } from "types";

export type TextSettings = {
  align: "left" | "center" | "right";
  size: string;
  weight: "Normal" | "Medium" | "Semibold" | "Bold";
  color: string;
};

export type TableColumnSettings = TextSettings & { label: string };

export type TableSettings = {
  headerSettings: TextSettings;
  rowSettings: TextSettings;
  descriptionHeaderSettings: TableColumnSettings;
  descriptionRowSettings: TextSettings;
  quantityHeaderSettings: TableColumnSettings;
  quantityRowSettings: TextSettings;
  unitPriceHeaderSettings: TableColumnSettings;
  unitPriceRowSettings: TextSettings;
  amountHeaderSettings: TableColumnSettings;
  amountRowSettings: TextSettings;
  backgroundColor: string;
  borderColor: string;
};

export type TotalsSettings = {
  labelSettings: TextSettings;
  valueSettings: TextSettings;
};

export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type InvoiceSeller = {
  content: string;
  placeholder: string;
};

export type InvoiceClient = {
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
  titleSettings: TextSettings;
  image: string;
  number: string;
  numberSettings: {
    label: TextSettings;
    value: TextSettings;
  };
  invoiceDate: string;
  invoiceDateSettings: {
    label: TextSettings;
    value: TextSettings;
  };
  dueDate: string;
  dueDateSettings: {
    label: TextSettings;
    value: TextSettings;
  };
  seller: InvoiceSeller;
  sellerSettings: TextSettings;
  client: InvoiceClient;
  clientSettings: TextSettings;
  items: InvoiceItem[];
  tableSettings: TableSettings;
  subtotal: number;
  subtotalSettings: {
    label: TextSettings;
    value: TextSettings;
  };
  tax: {
    percentage: number;
    amount: number;
  };
  taxSettings: {
    label: TextSettings;
    value: TextSettings;
  };
  fees: number;
  feesSettings: {
    label: TextSettings;
    value: TextSettings;
  };
  discounts: number;
  discountsSettings: {
    label: TextSettings;
    value: TextSettings;
  };
  total: number;
  totalSettings: {
    label: TextSettings;
    value: TextSettings;
  };
  terms: InvoiceTerms;
  termsSettings: {
    label: TextSettings;
    content: TextSettings;
  };
  pdfSettings: PdfSettings;
  currency: Currency;
};

export type SettingsType =
  | "title"
  | "details"
  | "seller"
  | "client"
  | "table"
  | "totals"
  | "terms"
  | "main";

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
