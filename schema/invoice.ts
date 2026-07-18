import { z } from "zod";
import { getAvailableFontWeights } from "~/consts/invoice-fonts";

// The Zod schema is the single source of truth for the persisted invoice shape.
// Every field is resilient (`.catch(...)`): parsing a partial, legacy, or
// corrupt record yields a valid invoice with sensible defaults rather than
// throwing, so stored data is repaired in place and never dropped. Derived money
// fields (subtotal, total, per-item amount, tax.amount) are intentionally absent
// and stripped on parse, since totals are computed at render.

export const CURRENT_INVOICE_SCHEMA_VERSION = 1;

const INVOICE_FONTS = [
  "geist",
  "inter",
  "bricolage-grotesque",
  "dm-sans",
  "ibm-plex-sans",
  "lora",
  "libre-baskerville",
  "geist-mono",
  "jetbrains-mono",
  "ibm-plex-mono"
] as const;

const FONT_WEIGHTS = ["Normal", "Medium", "Semibold", "Bold"] as const;
const INVOICE_SIZES = ["small", "medium", "large"] as const;

export const DEFAULT_INVOICE_THEME = {
  font: "geist",
  fontWeight: "Normal",
  size: "medium",
  accent: "#1a1a1a"
} as const;

const DEFAULT_LABELS = {
  invoiceNumber: "Invoice No.",
  invoiceDate: "Date",
  paymentDue: "Due date",
  poNumber: "PO number",
  servicePeriod: "Service period",
  subtotal: "Subtotal",
  tax: "Tax",
  fees: "Fees",
  discounts: "Discounts",
  total: "Total",
  amountPaid: "Amount paid",
  balanceDue: "Balance due"
} as const;

const DEFAULT_PAYMENT_DETAILS = {
  label: "Payment details",
  bankName: "",
  accountNumber: "",
  iban: "",
  bic: "",
  sortCode: "",
  terms: ""
} as const;

const DEFAULT_COLUMN_LABELS = {
  description: "Item",
  quantity: "Quantity",
  unit: "Unit",
  unitPrice: "Unit Price",
  amount: "Amount"
} as const;

const DEFAULT_TABLE_SETTINGS = {
  columnLabels: DEFAULT_COLUMN_LABELS,
  backgroundColor: "#f9fafb",
  borderColor: "#e5e7eb"
} as const;

function contactSchema(defaultLabel: string) {
  return z
    .object({
      label: z.string().catch(defaultLabel),
      content: z.string().catch(""),
      placeholder: z.string().catch("")
    })
    .catch({ label: defaultLabel, content: "", placeholder: "" });
}

// A labelled free-text block (notes, late-payment terms, etc.): a customizable
// heading plus content, mirroring the terms section. An empty block is
// suppressed at render.
function textSectionSchema(defaultLabel: string) {
  return z
    .object({
      label: z.string().catch(defaultLabel),
      content: z.string().catch("")
    })
    .catch({ label: defaultLabel, content: "" });
}

// Payment details mirror the terms section: a customizable label plus content.
// The content is a set of free-text fields so they work across banking
// conventions (bank name, account number, IBAN, BIC/SWIFT, sort code) alongside
// free-text instructions (e.g. "Net 30", a PayPal address). An all-empty section
// is suppressed at render.
const paymentDetailsSchema = z
  .object({
    label: z.string().catch(DEFAULT_PAYMENT_DETAILS.label),
    bankName: z.string().catch(""),
    accountNumber: z.string().catch(""),
    iban: z.string().catch(""),
    bic: z.string().catch(""),
    sortCode: z.string().catch(""),
    terms: z.string().catch("")
  })
  .catch(DEFAULT_PAYMENT_DETAILS);

const invoiceItemSchema = z.object({
  id: z.string().catch(""),
  description: z.string().catch(""),
  quantity: z.coerce.number().catch(0),
  unit: z.string().catch(""),
  unitPrice: z.coerce.number().catch(0)
});

const invoiceThemeSchema = z
  .object({
    font: z.enum(INVOICE_FONTS).catch(DEFAULT_INVOICE_THEME.font),
    fontWeight: z.enum(FONT_WEIGHTS).catch(DEFAULT_INVOICE_THEME.fontWeight),
    size: z.enum(INVOICE_SIZES).catch(DEFAULT_INVOICE_THEME.size),
    accent: z.string().catch(DEFAULT_INVOICE_THEME.accent)
  })
  // A stored weight may not be offered by the chosen font; fall back if so.
  .transform(theme => ({
    ...theme,
    fontWeight: getAvailableFontWeights(theme.font).includes(theme.fontWeight)
      ? theme.fontWeight
      : DEFAULT_INVOICE_THEME.fontWeight
  }))
  .catch(DEFAULT_INVOICE_THEME);

const tableSettingsSchema = z
  .object({
    columnLabels: z
      .object({
        description: z.string().catch(DEFAULT_COLUMN_LABELS.description),
        quantity: z.string().catch(DEFAULT_COLUMN_LABELS.quantity),
        unit: z.string().catch(DEFAULT_COLUMN_LABELS.unit),
        unitPrice: z.string().catch(DEFAULT_COLUMN_LABELS.unitPrice),
        amount: z.string().catch(DEFAULT_COLUMN_LABELS.amount)
      })
      .catch(DEFAULT_COLUMN_LABELS),
    backgroundColor: z.string().catch(DEFAULT_TABLE_SETTINGS.backgroundColor),
    borderColor: z.string().catch(DEFAULT_TABLE_SETTINGS.borderColor)
  })
  .catch(DEFAULT_TABLE_SETTINGS);

const invoiceLabelsSchema = z
  .object({
    invoiceNumber: z.string().catch(DEFAULT_LABELS.invoiceNumber),
    invoiceDate: z.string().catch(DEFAULT_LABELS.invoiceDate),
    paymentDue: z.string().catch(DEFAULT_LABELS.paymentDue),
    poNumber: z.string().catch(DEFAULT_LABELS.poNumber),
    servicePeriod: z.string().catch(DEFAULT_LABELS.servicePeriod),
    subtotal: z.string().catch(DEFAULT_LABELS.subtotal),
    tax: z.string().catch(DEFAULT_LABELS.tax),
    fees: z.string().catch(DEFAULT_LABELS.fees),
    discounts: z.string().catch(DEFAULT_LABELS.discounts),
    total: z.string().catch(DEFAULT_LABELS.total),
    amountPaid: z.string().catch(DEFAULT_LABELS.amountPaid),
    balanceDue: z.string().catch(DEFAULT_LABELS.balanceDue)
  })
  .catch(DEFAULT_LABELS);

export const invoiceSchema = z.object({
  id: z.string().catch("1"),
  title: z.string().catch("Invoice"),
  image: z.string().catch(""),
  number: z.string().catch("1"),
  poNumber: z.string().catch(""),
  invoiceDate: z.string().catch(""),
  dueDate: z.string().catch(""),
  servicePeriod: z.string().catch(""),
  seller: contactSchema("From"),
  client: contactSchema("To"),
  shipping: contactSchema("Ship to"),
  // Resilience lives on each element, not the array: a single unparseable entry
  // (e.g. a `null` from a hand-edited or merge-conflicted backup) drops only
  // that entry, never the whole line-item list. Putting `.catch([])` on the
  // array instead would silently blank every item to recover from one bad one.
  items: z
    .array(z.unknown())
    .catch([])
    .transform(items =>
      items.flatMap(item => {
        const parsed = invoiceItemSchema.safeParse(item);

        return parsed.success ? [parsed.data] : [];
      })
    ),
  tableSettings: tableSettingsSchema,
  labels: invoiceLabelsSchema,
  // Tax stays a single invoice-level rate, extended with a tax-exempt flag and a
  // free-text note (e.g. "Reverse charge") so mixed-jurisdiction and zero-rated
  // invoices are supported without per-line rates. When exempt, the rate is
  // ignored and no tax is charged.
  tax: z
    .object({
      percentage: z.coerce.number().catch(0),
      // Not z.coerce.boolean(): Boolean("false") is true, so a hand-edited
      // backup with `"exempt": "false"` would silently flip to exempt.
      exempt: z.boolean().catch(false),
      note: z.string().catch("")
    })
    .catch({ percentage: 0, exempt: false, note: "" }),
  fees: z.coerce.number().catch(0),
  discounts: z.coerce.number().catch(0),
  // A fixed discount is a currency amount; a percentage discount is applied to
  // the subtotal. The numeric value lives in `discounts` either way.
  discountType: z.enum(["fixed", "percentage"]).catch("fixed"),
  amountPaid: z.coerce.number().catch(0),
  terms: z
    .object({
      label: z.string().catch("Terms and conditions"),
      content: z.string().catch("")
    })
    .catch({ label: "Terms and conditions", content: "" }),
  notes: textSectionSchema("Notes"),
  latePayment: textSectionSchema("Late payment"),
  paymentDetails: paymentDetailsSchema,
  pdfSettings: z
    .object({ backgroundColor: z.string().catch("#ffffff") })
    .catch({ backgroundColor: "#ffffff" }),
  currency: z.string().catch("£"),
  currencyCode: z.string().catch(""),
  theme: invoiceThemeSchema
});

export type Invoice = z.infer<typeof invoiceSchema>;
