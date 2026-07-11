import { useEffect, useState } from "react";
import { InvoiceInput } from "~/components/editor/invoice-input";
import { formatCurrency } from "~/consts/currencies";
import {
  useCurrencySymbol,
  useInvoiceTotals,
  usePricingSlice,
  useTheme
} from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";
import { handleCurrencyInput } from "~/utils/handle-currency-input";
import { handlePercentageInput } from "~/utils/handle-percentage-input";
import { reconcilePricingInput } from "~/utils/reconcile-pricing-input";

function handleInputBlur(
  currentInput: string,
  setter: (value: string) => void,
  setValue: (value: number) => void
) {
  // When input loses focus, ensure valid number
  if (currentInput === "" || currentInput === ".") {
    setter("0");
    setValue(0);
  } else if (currentInput.endsWith(".")) {
    const cleanValue = currentInput.slice(0, -1);
    setter(cleanValue);
    setValue(Number(cleanValue));
  }
  // Note: Totals are auto-recalculated by Zustand store actions
}

// Tracks a pricing field's local input string, refreshing it from the store
// value whenever the active document is replaced (see reconcilePricingInput).
function usePricingInput(storeValue: number) {
  const [input, setInput] = useState(storeValue.toString());

  useEffect(() => {
    setInput(prev => reconcilePricingInput(prev, storeValue));
  }, [storeValue]);

  return [input, setInput] as const;
}

/**
 * Displays the pricing information for the invoice.
 */
export function InvoicePricing() {
  return (
    <div className="flex flex-col gap-1 text-right">
      <SubtotalRow />
      <TaxRow />
      <FeesRow />
      <DiscountsRow />
      <TotalRow />
    </div>
  );
}

function SubtotalRow() {
  const { currency, labels, setLabels } = usePricingSlice();
  const { subtotal } = useInvoiceTotals();
  const theme = useTheme();
  const labelSettings = getRoleSettings(theme, "totalsLabel");
  const valueSettings = getRoleSettings(theme, "totalsValue");

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <InvoiceInput
        aria-label="Subtotal label"
        value={labels.subtotal}
        onChange={value => setLabels(prev => ({ ...prev, subtotal: value }))}
        className="w-full min-w-fit"
        style={getTextStyles({ settings: labelSettings })}
        placeholder="Subtotal"
      />
      <span
        className="inline-block min-w-40 text-right text-zinc-900"
        style={getTextStyles({ settings: valueSettings })}
      >
        {formatCurrency(subtotal, currency)}
      </span>
    </div>
  );
}

function TaxRow() {
  const { tax, currency, setTax, labels, setLabels } = usePricingSlice();
  const { taxAmount } = useInvoiceTotals();
  const theme = useTheme();
  const labelSettings = getRoleSettings(theme, "totalsLabel");
  const valueSettings = getRoleSettings(theme, "totalsValue");

  const [taxInput, setTaxInput] = usePricingInput(tax.percentage);

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <div
        className="flex w-full items-center"
        style={{ justifyContent: labelSettings.align }}
      >
        <InvoiceInput
          aria-label="Tax label"
          value={labels.tax}
          onChange={value => setLabels(prev => ({ ...prev, tax: value }))}
          className="field-sizing-content w-auto min-w-fit pr-0.5"
          style={getTextStyles({ settings: labelSettings, remove: ["align"] })}
          placeholder="Tax"
        />
        <span className="flex items-center">
          <InvoiceInput
            id="invoice-field-totals"
            aria-label="Tax percentage"
            value={taxInput}
            onChange={value => {
              const numericValue = handlePercentageInput(value);
              setTaxInput(numericValue);
              setTax(prev => ({ ...prev, percentage: Number(numericValue) }));
            }}
            onBlur={() =>
              handleInputBlur(taxInput, setTaxInput, (val: number) =>
                setTax(prev => ({ ...prev, percentage: val }))
              )
            }
            className="w-10 p-0 text-right focus-visible:w-14"
            style={getTextStyles({
              settings: labelSettings,
              remove: ["align"]
            })}
          />
          <span style={getTextStyles({ settings: labelSettings })}>%</span>
        </span>
      </div>
      <span
        className="ml-auto min-w-40 items-center"
        style={getTextStyles({ settings: valueSettings })}
      >
        {formatCurrency(taxAmount, currency)}
      </span>
    </div>
  );
}

function FeesRow() {
  const { fees, setFees, labels, setLabels } = usePricingSlice();
  const currencySymbol = useCurrencySymbol();
  const theme = useTheme();
  const labelSettings = getRoleSettings(theme, "totalsLabel");
  const valueSettings = getRoleSettings(theme, "totalsValue");

  const [feesInput, setFeesInput] = usePricingInput(fees);

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <InvoiceInput
        aria-label="Fees label"
        value={labels.fees}
        onChange={value => setLabels(prev => ({ ...prev, fees: value }))}
        className="w-full min-w-fit"
        style={getTextStyles({ settings: labelSettings })}
        placeholder="Fees"
      />
      <span
        className="ml-auto flex min-w-40 items-center"
        style={{ justifyContent: valueSettings.align }}
      >
        <InvoiceInput
          aria-label="Fees amount"
          value={`${currencySymbol}${feesInput}`}
          className="w-20 text-right"
          style={getTextStyles({ settings: valueSettings })}
          placeholder={currencySymbol}
          onChange={value => {
            const numericValue = handleCurrencyInput(value, currencySymbol);
            setFeesInput(numericValue);
            setFees(Number(numericValue));
          }}
          onBlur={() => handleInputBlur(feesInput, setFeesInput, setFees)}
        />
      </span>
    </div>
  );
}

function DiscountsRow() {
  const { discounts, setDiscounts, labels, setLabels } = usePricingSlice();
  const currencySymbol = useCurrencySymbol();
  const theme = useTheme();
  const labelSettings = getRoleSettings(theme, "totalsLabel");
  const valueSettings = getRoleSettings(theme, "totalsValue");

  const [discountsInput, setDiscountsInput] = usePricingInput(discounts);

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <InvoiceInput
        aria-label="Discounts label"
        value={labels.discounts}
        onChange={value => setLabels(prev => ({ ...prev, discounts: value }))}
        className="w-full min-w-fit"
        style={getTextStyles({ settings: labelSettings })}
        placeholder="Discounts"
      />
      <span
        className="ml-auto flex min-w-40 items-center"
        style={{ justifyContent: valueSettings.align }}
      >
        <InvoiceInput
          aria-label="Discounts amount"
          value={`${currencySymbol}${discountsInput}`}
          style={getTextStyles({ settings: valueSettings })}
          onChange={value => {
            const numericValue = handleCurrencyInput(value, currencySymbol);
            setDiscountsInput(numericValue);
            setDiscounts(Number(numericValue));
          }}
          onBlur={() =>
            handleInputBlur(discountsInput, setDiscountsInput, setDiscounts)
          }
          className="w-20 text-right"
        />
      </span>
    </div>
  );
}

function TotalRow() {
  const { currency, labels, setLabels } = usePricingSlice();
  const { total } = useInvoiceTotals();
  const theme = useTheme();
  const labelSettings = getRoleSettings(theme, "grandTotalLabel");
  const valueSettings = getRoleSettings(theme, "grandTotalValue");

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <InvoiceInput
        aria-label="Total label"
        value={labels.total}
        onChange={value => setLabels(prev => ({ ...prev, total: value }))}
        className="w-full min-w-fit"
        style={getTextStyles({ settings: labelSettings })}
        placeholder="Total"
      />
      <span
        className="inline-block min-w-40 text-right font-bold"
        style={getTextStyles({ settings: valueSettings })}
      >
        {formatCurrency(total, currency)}
      </span>
    </div>
  );
}
