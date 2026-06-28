import { addDays, format } from "date-fns";
import { currencyOptions } from "~/consts/currencies";
import { saveInvoice } from "~/db";
import { invoiceDefault } from "~/stores/invoice-store";
import type {
  Invoice,
  InvoiceDocument,
  InvoiceSize,
  TableSettings
} from "~/types";

const COMPANY_NAMES = [
  "Acme Studio",
  "Northwind Co.",
  "Globex Design",
  "Initech LLC",
  "Umbrella Works",
  "Soylent Studio",
  "Hooli Labs",
  "Stark Creative",
  "Wayne & Co.",
  "Wonka Workshop",
  "Pied Piper",
  "Dunder Mifflin"
];

const FIRST_NAMES = [
  "Jordan",
  "Riley",
  "Morgan",
  "Casey",
  "Avery",
  "Sam",
  "Alex",
  "Taylor",
  "Jamie",
  "Cameron"
];

const LAST_NAMES = [
  "Bennett",
  "Carter",
  "Diaz",
  "Okafor",
  "Nguyen",
  "Patel",
  "Schmidt",
  "Rossi",
  "Andersson",
  "Walsh"
];

const STREETS = [
  "123 Main St.",
  "88 Market Ave.",
  "12 Castle Row",
  "47 Harbour Lane",
  "9 Bishopsgate",
  "250 King Street",
  "1600 Pennsylvania Ave.",
  "5 Rue de Rivoli"
];

const CITIES = [
  "London EC1A 1BB",
  "New York, NY 10001",
  "Berlin 10115",
  "Paris 75001",
  "Austin, TX 73301",
  "Toronto, ON M5H 2N2",
  "Sydney NSW 2000",
  "Dublin D02 AF30"
];

const ITEM_DESCRIPTIONS = [
  "Brand identity design",
  "Landing page build",
  "Monthly retainer",
  "Logo exploration",
  "Website redesign",
  "SEO audit",
  "Copywriting",
  "Social media management",
  "Photography session",
  "UX research",
  "Consulting (hourly)",
  "Hosting & maintenance",
  "Email campaign",
  "Illustration set",
  "Mobile app prototype",
  "Design system setup"
];

const TITLES = [
  "Invoice",
  "Tax Invoice",
  "Sales Invoice",
  "Pro Forma Invoice",
  "Receipt",
  "Bill",
  "Statement"
];

const FROM_LABELS = ["From", "Billed by", "From:", "Bill from"];
const TO_LABELS = ["To", "Bill to", "Billed to", "Invoice to"];

const TERMS_LABELS = [
  "Terms and conditions",
  "Notes",
  "Payment terms",
  "Terms"
];

const TERMS_CONTENTS = [
  "Payment is due within 30 days of the invoice date.",
  "Please pay by bank transfer and quote the invoice number as the reference.",
  "Late payments are subject to a 2% monthly fee.",
  "Thank you for your business, it is a pleasure working with you.",
  "A 50% deposit is required up front; the balance is due on completion.",
  "All amounts are in the currency shown and exclude any bank charges."
];

const COLUMN_LABEL_SETS: TableSettings["columnLabels"][] = [
  {
    description: "Item",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    amount: "Amount"
  },
  {
    description: "Description",
    quantity: "Qty",
    unitPrice: "Rate",
    amount: "Total"
  },
  {
    description: "Service",
    quantity: "Hours",
    unitPrice: "Rate",
    amount: "Amount"
  },
  {
    description: "Product",
    quantity: "Qty",
    unitPrice: "Price",
    amount: "Subtotal"
  }
];

const TABLE_PALETTES = [
  { backgroundColor: "#f9fafb", borderColor: "#e5e7eb" },
  { backgroundColor: "#ffffff", borderColor: "#e5e7eb" },
  { backgroundColor: "#f8fafc", borderColor: "#e2e8f0" },
  { backgroundColor: "#fef2f2", borderColor: "#fecaca" },
  { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" },
  { backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }
];

const PDF_BACKGROUNDS = ["#ffffff", "#fffdf8", "#fafafa", "#f8fafc"];

const SIZES: InvoiceSize[] = ["small", "medium", "large"];

const TAX_RATES = [0, 5, 7.5, 10, 20];
const DUE_IN_DAYS = [14, 30, 45, 60];

function pickRandom<TItem>(items: TItem[]): TItem {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildContactBlock(name: string): string {
  const handle = name.toLowerCase().replace(/[^a-z0-9]+/g, "");

  return [
    name,
    pickRandom(STREETS),
    pickRandom(CITIES),
    `(555) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    `hello@${handle}.com`
  ].join("\n");
}

/**
 * Dev-only helper. Builds an invoice with random but realistic data and writes
 * it straight to IndexedDB so the Open Invoice list can be tested with many
 * entries. Not referenced from any production code path.
 */
export async function seedDummyInvoice(): Promise<InvoiceDocument> {
  const sellerName = pickRandom(COMPANY_NAMES);
  const clientName = `${pickRandom(FIRST_NAMES)} ${pickRandom(LAST_NAMES)}`;
  const invoiceNumber = `INV-${String(randomInt(1, 9999)).padStart(4, "0")}`;

  const items = Array.from({ length: randomInt(1, 6) }, () => ({
    id: crypto.randomUUID(),
    description: pickRandom(ITEM_DESCRIPTIONS),
    quantity: randomInt(1, 12),
    unitPrice: randomInt(1, 80) * 25
  }));

  const createdAt = new Date(
    Date.now() - randomInt(0, 120) * 24 * 60 * 60 * 1000
  );
  const updatedAt = new Date(
    createdAt.getTime() + randomInt(0, 48) * 3600 * 1000
  );

  const invoiceData: Invoice = {
    ...invoiceDefault,
    id: crypto.randomUUID(),
    title: pickRandom(TITLES),
    number: invoiceNumber,
    invoiceDate: format(createdAt, "yyyy-MM-dd"),
    dueDate: format(addDays(createdAt, pickRandom(DUE_IN_DAYS)), "yyyy-MM-dd"),
    seller: {
      ...invoiceDefault.seller,
      label: pickRandom(FROM_LABELS),
      content: buildContactBlock(sellerName)
    },
    client: {
      ...invoiceDefault.client,
      label: pickRandom(TO_LABELS),
      content: buildContactBlock(clientName)
    },
    items,
    tableSettings: {
      columnLabels: pickRandom(COLUMN_LABEL_SETS),
      ...pickRandom(TABLE_PALETTES)
    },
    tax: { percentage: pickRandom(TAX_RATES) },
    fees: Math.random() < 0.3 ? randomInt(1, 20) * 5 : 0,
    discounts: Math.random() < 0.25 ? randomInt(1, 20) * 5 : 0,
    terms: {
      label: pickRandom(TERMS_LABELS),
      content: pickRandom(TERMS_CONTENTS)
    },
    pdfSettings: { backgroundColor: pickRandom(PDF_BACKGROUNDS) },
    currency: pickRandom(currencyOptions).symbol,
    theme: { ...invoiceDefault.theme, size: pickRandom(SIZES) }
  };

  const invoiceDocument: InvoiceDocument = {
    id: crypto.randomUUID(),
    name: `${invoiceNumber} · ${clientName}`,
    invoiceData,
    templateId: null,
    createdAt,
    updatedAt
  };

  await saveInvoice(invoiceDocument);

  return invoiceDocument;
}
