import { codes, data } from "currency-codes";

export const currencies = codes();

export const extraSymbols = {
  SAR: "﷼",
  AED: "د.ل",
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
  "USD",
  "EUR",
  "JPY",
  "GBP",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "HKD",
  "NZD",
  "SEK",
  "KRW",
  "SGD",
  "NOK",
  "MXN",
  "INR",
  "RUB",
  "ZAR",
  "TRY",
  "BRL",
  "TWD",
  "DKK",
  "PLN",
  "THB",
  "IDR",
  "HUF",
  "CZK",
  "CLP",
  "PHP",
  "AED",
  "COP",
  "SAR",
  "MYR",
  "RON",
  "ARS",
  "BGN",
  "HRK",
  "ISK",
  "KZT",
  "PEN",
  "VND",
  "NGN",
  "PKR",
  "EGP",
  "BDT",
  "UAH",
  "QAR",
  "KWD",
  "DZD"
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

export function formatCurrency(
  amount: number,
  currencyCode: (typeof topCurrencies)[number]
): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: currencyCode
  });
}
