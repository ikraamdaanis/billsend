import { getAvailableFontWeights } from "~/consts/invoice-fonts";
import type {
  Invoice,
  InvoiceFont,
  InvoiceLabels,
  InvoiceTheme,
  TableSettings
} from "~/types";

export const DEFAULT_INVOICE_THEME: InvoiceTheme = {
  font: "geist",
  fontWeight: "Normal",
  size: "medium",
  accent: "#1a1a1a"
};

type LegacyInvoiceTheme = Partial<InvoiceTheme> & {
  textFont?: InvoiceFont;
  numberFont?: InvoiceFont;
  textFontOverride?: InvoiceFont | null;
  numberFontOverride?: InvoiceFont | null;
};

const DEFAULT_COLUMN_LABELS: TableSettings["columnLabels"] = {
  description: "Item",
  quantity: "Quantity",
  unitPrice: "Unit Price",
  amount: "Amount"
};

const DEFAULT_LABELS: InvoiceLabels = {
  invoiceNumber: "Invoice No.",
  invoiceDate: "Date",
  paymentDue: "Due date",
  subtotal: "Subtotal",
  tax: "Tax",
  fees: "Fees",
  discounts: "Discounts",
  total: "Total"
};

// The old per-column header settings each carried a `label`; the new model
// keeps only those labels alongside the table colours.
type LegacyTableSettings = {
  columnLabels?: Partial<TableSettings["columnLabels"]>;
  descriptionHeaderSettings?: { label?: string };
  quantityHeaderSettings?: { label?: string };
  unitPriceHeaderSettings?: { label?: string };
  amountHeaderSettings?: { label?: string };
  backgroundColor?: string;
  borderColor?: string;
};

type LegacyInvoice = Omit<Invoice, "theme" | "tableSettings" | "labels"> & {
  theme?: LegacyInvoiceTheme;
  tableSettings?: LegacyTableSettings;
  labels?: Partial<InvoiceLabels>;
};

function normalizeTheme(theme: LegacyInvoiceTheme = {}): InvoiceTheme {
  const font = theme.font ?? theme.textFont ?? DEFAULT_INVOICE_THEME.font;
  const fontWeight = theme.fontWeight ?? DEFAULT_INVOICE_THEME.fontWeight;
  const availableWeights = getAvailableFontWeights(font);

  return {
    font,
    fontWeight: availableWeights.includes(fontWeight)
      ? fontWeight
      : DEFAULT_INVOICE_THEME.fontWeight,
    size: theme.size ?? DEFAULT_INVOICE_THEME.size,
    accent: theme.accent ?? DEFAULT_INVOICE_THEME.accent
  };
}

function normalizeTableSettings(
  table: LegacyTableSettings = {}
): TableSettings {
  const columnLabels = table.columnLabels
    ? { ...DEFAULT_COLUMN_LABELS, ...table.columnLabels }
    : {
        description:
          table.descriptionHeaderSettings?.label ??
          DEFAULT_COLUMN_LABELS.description,
        quantity:
          table.quantityHeaderSettings?.label ?? DEFAULT_COLUMN_LABELS.quantity,
        unitPrice:
          table.unitPriceHeaderSettings?.label ??
          DEFAULT_COLUMN_LABELS.unitPrice,
        amount:
          table.amountHeaderSettings?.label ?? DEFAULT_COLUMN_LABELS.amount
      };

  return {
    columnLabels,
    backgroundColor: table.backgroundColor ?? "#f9fafb",
    borderColor: table.borderColor ?? "#e5e7eb"
  };
}

/**
 * Bring any stored or imported invoice up to the current model: guarantee a
 * `theme`, collapse the legacy per-field table settings into column labels, and
 * drop the obsolete per-field `*Settings` keys. Idempotent on new-shaped data.
 */
export function normalizeInvoice(raw: Invoice): Invoice {
  const legacy = raw as LegacyInvoice;

  return {
    id: legacy.id,
    title: legacy.title,
    image: legacy.image,
    number: legacy.number,
    invoiceDate: legacy.invoiceDate,
    dueDate: legacy.dueDate,
    seller: legacy.seller,
    client: legacy.client,
    items: legacy.items,
    tableSettings: normalizeTableSettings(legacy.tableSettings),
    labels: { ...DEFAULT_LABELS, ...legacy.labels },
    subtotal: legacy.subtotal,
    tax: legacy.tax,
    fees: legacy.fees,
    discounts: legacy.discounts,
    total: legacy.total,
    terms: legacy.terms,
    pdfSettings: legacy.pdfSettings,
    currency: legacy.currency,
    theme: normalizeTheme(legacy.theme)
  };
}
