/**
 * The invoice stores a currency symbol directly, deduped by symbol so the
 * various dollar/yen currencies collapse to a single entry. Anything outside
 * this list is entered through the custom-symbol modal.
 */
export const currencyOptions: { symbol: string; label: string }[] = [
  { symbol: "£", label: "Pound" },
  { symbol: "$", label: "Dollar" },
  { symbol: "€", label: "Euro" },
  { symbol: "¥", label: "Yen" },
  { symbol: "CHF", label: "Franc" },
  { symbol: "⃁", label: "Riyal" },
  { symbol: "د.إ", label: "Dirham" }
];

/**
 * Older invoices stored a currency code (e.g. "GBP"). Map those to the deduped
 * symbol so previously saved documents keep rendering correctly.
 */
const LEGACY_CODE_TO_SYMBOL: Record<string, string> = {
  GBP: "£",
  USD: "$",
  AUD: "$",
  CAD: "$",
  HKD: "$",
  SGD: "$",
  EUR: "€",
  JPY: "¥",
  CNY: "¥",
  CHF: "CHF",
  SAR: "⃁",
  AED: "د.إ"
};

export function normalizeCurrency(currency: string): string {
  return LEGACY_CODE_TO_SYMBOL[currency] ?? currency;
}

/**
 * Some currency symbols have no glyph in the latin-subset webfonts used for PDF
 * generation, and are missing from most OS fonts too, so they render as a tofu
 * box in both the PDF and the editor preview. The Riyal sign (U+20C1) and the
 * Arabic-script Dirham symbol fall in this bucket. We show a legible ASCII code
 * for them instead, so money stays readable everywhere it is formatted.
 */
const SYMBOL_TO_DISPLAY_MARKER: Record<string, string> = {
  "⃁": "SAR",
  "د.إ": "AED"
};

/**
 * Resolves the stored currency to the marker shown before amounts. Legacy codes
 * are normalised to their symbol first, then any tofu-prone symbol is swapped
 * for its ASCII code. The stored currency value itself is left untouched, so the
 * picker selection and saved invoices keep working.
 */
export function getCurrencyMarker(currency: string): string {
  const symbol = normalizeCurrency(currency);

  return SYMBOL_TO_DISPLAY_MARKER[symbol] ?? symbol;
}

export function formatCurrency(amount: number, currency: string): string {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${getCurrencyMarker(currency)}${formatted}`;
}
