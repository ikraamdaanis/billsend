import type { Invoice } from "~/schema/invoice";
import {
  CURRENT_INVOICE_SCHEMA_VERSION,
  invoiceSchema
} from "~/schema/invoice";

// Ordered registry of structural migrations applied before schema parsing.
// Each step reshapes data that the resilient schema can't recover on its own
// (renamed/relocated keys), because `.catch()` would discard the legacy value
// rather than carry it forward. Leaf defaulting and stripping of obsolete keys
// is left to invoiceSchema. The schema version travels on the stored document
// envelope, so only the steps newer than a record's version run.

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readLabel(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined;

  const { label } = value;

  return typeof label === "string" ? label : undefined;
}

// v0 -> v1: collapse the legacy per-column header settings into `columnLabels`
// and map the legacy `textFont` onto the single theme `font`. Everything else
// (defaults, dropping derived money fields) is handled by the schema.
function migrateV0ToV1(raw: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...raw };

  if (isRecord(next.theme)) {
    const theme = { ...next.theme };

    if (theme.font == null && typeof theme.textFont === "string") {
      theme.font = theme.textFont;
    }

    next.theme = theme;
  }

  if (isRecord(next.tableSettings) && next.tableSettings.columnLabels == null) {
    const table = next.tableSettings;

    next.tableSettings = {
      ...table,
      columnLabels: {
        description: readLabel(table.descriptionHeaderSettings),
        quantity: readLabel(table.quantityHeaderSettings),
        unitPrice: readLabel(table.unitPriceHeaderSettings),
        amount: readLabel(table.amountHeaderSettings)
      }
    };
  }

  return next;
}

const migrations: {
  to: number;
  up: (raw: Record<string, unknown>) => Record<string, unknown>;
}[] = [{ to: 1, up: migrateV0ToV1 }];

/**
 * Bring any stored or imported invoice data to the current shape: run the
 * structural migrations newer than `fromVersion`, then parse with the resilient
 * schema. Never throws and never drops a record (repair & keep); a hopelessly
 * corrupt value yields a blank-but-valid invoice.
 */
export function migrateInvoiceData(raw: unknown, fromVersion = 0): Invoice {
  let working: Record<string, unknown> = isRecord(raw) ? { ...raw } : {};

  for (const migration of migrations) {
    if (fromVersion < migration.to) {
      working = migration.up(working);
    }
  }

  return invoiceSchema.parse(working);
}

export { CURRENT_INVOICE_SCHEMA_VERSION };
