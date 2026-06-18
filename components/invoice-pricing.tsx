import { InvoiceInput } from "components/invoice-input";
import { formatCurrency } from "consts/currencies";
import { useState } from "react";
import { usePricingSlice, useCurrencySymbol } from "stores/invoice-selectors";
import { getTextStyles } from "utils/get-text-styles";
import { handleCurrencyInput } from "utils/handle-currency-input";
import { handlePercentageInput } from "utils/handle-percentage-input";

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
  const { subtotal, subtotalSettings, currency } = usePricingSlice();

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <span
        className="inline-block w-full"
        style={getTextStyles({ settings: subtotalSettings.label })}
      >
        Subtotal
      </span>
      <span
        className="inline-block min-w-40 text-right text-zinc-900"
        style={getTextStyles({ settings: subtotalSettings.value })}
      >
        {formatCurrency(subtotal, currency)}
      </span>
    </div>
  );
}

function TaxRow() {
  const { tax, taxSettings, currency, setTax } = usePricingSlice();

  const [taxInput, setTaxInput] = useState(tax.percentage.toString());

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <div
        className="flex w-full items-center"
        style={{ justifyContent: taxSettings.label.align }}
      >
        <span
          className="inline-block pr-0.5"
          style={getTextStyles({ settings: taxSettings.label })}
        >
          Tax{" "}
        </span>
        <span className="flex items-center">
          <InvoiceInput
            id="invoice-field-totals"
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
              settings: taxSettings.label,
              remove: ["align"]
            })}
          />
          <span style={getTextStyles({ settings: taxSettings.label })}>%</span>
        </span>
      </div>
      <span
        className="ml-auto min-w-40 items-center"
        style={getTextStyles({ settings: taxSettings.value })}
      >
        {formatCurrency(tax.amount, currency)}
      </span>
    </div>
  );
}

function FeesRow() {
  const { fees, feesSettings, setFees } = usePricingSlice();
  const currencySymbol = useCurrencySymbol();

  const [feesInput, setFeesInput] = useState(fees.toString());

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <span
        className="inline-block w-full"
        style={getTextStyles({ settings: feesSettings.label })}
      >
        Fees
      </span>
      <span
        className="ml-auto flex min-w-40 items-center"
        style={{
          justifyContent: feesSettings.value.align
        }}
      >
        <InvoiceInput
          value={`${currencySymbol}${feesInput}`}
          className="w-20 text-right"
          style={getTextStyles({ settings: feesSettings.value })}
          placeholder={currencySymbol}
          onChange={value => {
            const numericValue = handleCurrencyInput(value);
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
  const { discounts, discountsSettings, setDiscounts } = usePricingSlice();
  const currencySymbol = useCurrencySymbol();

  const [discountsInput, setDiscountsInput] = useState(discounts.toString());

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <span
        className="inline-block w-full"
        style={getTextStyles({ settings: discountsSettings.label })}
      >
        Discounts
      </span>
      <span
        className="ml-auto flex min-w-40 items-center"
        style={{
          justifyContent: discountsSettings.value.align
        }}
      >
        <InvoiceInput
          value={`${currencySymbol}${discountsInput}`}
          style={getTextStyles({ settings: discountsSettings.value })}
          onChange={value => {
            const numericValue = handleCurrencyInput(value);
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
  const { total, totalSettings, currency } = usePricingSlice();

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <span
        className="inline-block w-full"
        style={getTextStyles({ settings: totalSettings.label })}
      >
        Total
      </span>
      <span
        className="inline-block min-w-40 text-right font-bold"
        style={getTextStyles({ settings: totalSettings.value })}
      >
        {formatCurrency(total, currency)}
      </span>
    </div>
  );
}
