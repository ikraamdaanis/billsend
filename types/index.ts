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

export type InvoiceLabels = {
  invoiceNumber: string;
  invoiceDate: string;
  paymentDue: string;
  subtotal: string;
  tax: string;
  fees: string;
  discounts: string;
  total: string;
};

type InvoiceFont = "geist";

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
  labels: InvoiceLabels;
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
  currency: string;
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
