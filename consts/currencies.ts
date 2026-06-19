import { codes, data } from "currency-codes";

export const currencies = codes();

export const extraSymbols = {
  SAR: "﷼",
  AED: "د.إ",
  QAR: "ر.ق",
  KWD: "د.ك",
  BHD: "د.ب",
  OMR: "ر.ع",
  YER: "﷼",
  IQD: "د.ع",
  LYD: "د.ل",
  JOD: "د.ل",
  USD: "$" // Add explicit USD symbol
};

export const extraCurrencyNames = {
  HRK: "Croatian kuna"
};

export const topCurrencies = [
  "GBP",
  "USD",
  "EUR",
  "JPY",
  "CNY",
  "AUD",
  "CAD",
  "CHF",
  "HKD",
  "SGD",
  "SAR",
  "AED"
] as const;

export const currencySymbols = topCurrencies.map(currencyCode => {
  const symbol =
    extraSymbols[currencyCode as keyof typeof extraSymbols] ||
    new Intl.NumberFormat("en", {
      style: "currency",
      currency: currencyCode
    })
      .format(0)
      .replace(/[\d., ]/g, "")
      .trim();

  const currency =
    extraCurrencyNames[currencyCode as keyof typeof extraCurrencyNames] ||
    data.find(curr => curr.code === currencyCode)?.currency.trim();

  return {
    currency,
    code: currencyCode,
    symbol
  };
});

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

export function formatCurrency(amount: number, currency: string): string {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `${normalizeCurrency(currency)}${formatted}`;
}
