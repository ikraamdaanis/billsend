// The persisted invoice shape is defined and validated by the Zod schema; this
// import + re-export keeps `~/types` the single import site for the inferred
// type while making it usable by the document/template types below.
import type { BusinessProfile } from "~/schema/business-profile";
import type { Invoice } from "~/schema/invoice";

export type { BusinessProfile, Invoice };

export type TextSettings = {
  align: "left" | "center" | "right";
  size: string;
  weight: "Normal" | "Medium" | "Semibold" | "Bold";
  color: string;
  fontFamily?: string;
  pdfFontFamily?: string;
  letterSpacing?: string;
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

export type InvoiceFont =
  | "geist"
  | "inter"
  | "bricolage-grotesque"
  | "dm-sans"
  | "ibm-plex-sans"
  | "lora"
  | "libre-baskerville"
  | "geist-mono"
  | "jetbrains-mono"
  | "ibm-plex-mono";

export type InvoiceSize = "small" | "medium" | "large";

export type InvoiceTheme = {
  font: InvoiceFont;
  fontWeight: TextSettings["weight"];
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
};

export type InvoiceItemWithAmount = InvoiceItem & { amount: number };

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

export type InvoiceDetailRow = {
  id: "number" | "invoiceDate" | "dueDate";
  labelKey: "invoiceNumber" | "invoiceDate" | "paymentDue";
  label: string;
  value: string;
};

export type InvoiceLineItemRow = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  amount: string;
};

export type InvoiceSummaryRow = {
  id: "subtotal" | "tax" | "fees" | "discounts" | "total";
  label: string;
  value: string;
  percentage?: number;
  isVisible: boolean;
  isTotal: boolean;
};

export type InvoiceViewModel = {
  detailRows: InvoiceDetailRow[];
  lineItems: InvoiceLineItemRow[];
  summaryRows: InvoiceSummaryRow[];
};

export type InvoiceTotals = {
  items: InvoiceItemWithAmount[];
  subtotal: number;
  taxAmount: number;
  total: number;
};

export type InvoiceDocument = {
  id: string;
  name: string;
  invoiceData: Invoice;
  templateId: string | null;
  schemaVersion?: number;
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
    schemaVersion?: number;
    createdAt: string;
    updatedAt: string;
  }>;
  invoices: Array<{
    id: string;
    name: string;
    invoiceData: Invoice;
    templateId: string | null;
    schemaVersion?: number;
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
  schemaVersion?: number;
  createdAt: Date;
  updatedAt: Date;
};
