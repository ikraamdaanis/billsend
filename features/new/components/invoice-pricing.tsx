import { currencySymbols, formatCurrency } from "consts/currencies";
import { InvoiceInput } from "features/new/components/invoice-input";
import { activeSettingsAtom } from "features/new/components/settings-panel";
import {
  currencyAtom,
  discountsAtom,
  discountsSettingsAtom,
  feesAtom,
  feesSettingsAtom,
  subtotalAtom,
  subtotalSettingsAtom,
  taxAtom,
  taxSettingsAtom,
  totalAtom,
  totalSettingsAtom,
  updateInvoicePricingAtom
} from "features/new/state";
import { getTextStyles } from "features/new/utils/get-text-styles";
import { handleCurrencyInput } from "features/new/utils/handle-currency-input";
import { handlePercentageInput } from "features/new/utils/handle-percentage-input";
import { setActiveTab } from "features/new/utils/set-active-tab";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo, useState } from "react";

function handleInputBlur(
  currentInput: string,
  setter: (value: string) => void,
  setValue: (value: number) => void,
  updateInvoicePricing: () => void
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

  updateInvoicePricing();
}

/**
 * Displays the pricing information for the invoice.
 */
function InvoicePricingComponent() {
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <div
      className="space-y-1 text-right"
      onClick={() => setActiveSettings("totals")}
    >
      <SubtotalRow />
      <TaxRow />
      <FeesRow />
      <DiscountsRow />
      <TotalRow />
    </div>
  );
}

const SubtotalRow = memo(function SubtotalRow() {
  const subtotal = useAtomValue(subtotalAtom);
  const subtotalSettings = useAtomValue(subtotalSettingsAtom);
  const currency = useAtomValue(currencyAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <div
      className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm"
      onClick={() => {
        setActiveTab({
          eventType: "select-totals-tab",
          tab: "subtotal"
        });
        setActiveSettings("totals");
      }}
    >
      <span
        className="inline-block w-full cursor-pointer"
        style={getTextStyles({ settings: subtotalSettings.label })}
      >
        Subtotal
      </span>
      <span
        className="inline-block min-w-40 cursor-pointer text-right text-zinc-900"
        style={getTextStyles({ settings: subtotalSettings.value })}
      >
        {formatCurrency(subtotal, currency)}
      </span>
    </div>
  );
});

const taxPercentageAtom = selectAtom(taxAtom, tax => tax.percentage);
const taxAmountAtom = selectAtom(taxAtom, tax => tax.amount);

const TaxRow = memo(function TaxRow() {
  const taxPercentage = useAtomValue(taxPercentageAtom);
  const taxAmount = useAtomValue(taxAmountAtom);
  const [tax, setTax] = useAtom(taxAtom);
  const taxSettings = useAtomValue(taxSettingsAtom);
  const currency = useAtomValue(currencyAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);
  const updateInvoicePricing = useSetAtom(updateInvoicePricingAtom);

  const [taxInput, setTaxInput] = useState(taxPercentage.toString());

  return (
    <div
      className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm"
      onClick={() => {
        setActiveTab({
          eventType: "select-totals-tab",
          tab: "tax"
        });
        setActiveSettings("totals");
      }}
    >
      <div
        className="flex w-full items-center"
        style={{ justifyContent: taxSettings.label.align }}
      >
        <span
          className="inline-block cursor-pointer pr-0.5"
          style={getTextStyles({ settings: taxSettings.label })}
        >
          Tax{" "}
        </span>
        <span className="flex items-center">
          <InvoiceInput
            value={taxInput}
            onChange={value => {
              const numericValue = handlePercentageInput(value);
              setTaxInput(numericValue);
              setTax({ ...tax, percentage: Number(numericValue) });
              updateInvoicePricing();
            }}
            onBlur={() =>
              handleInputBlur(
                taxInput,
                setTaxInput,
                (val: number) => setTax({ ...tax, percentage: val }),
                updateInvoicePricing
              )
            }
            className="w-10 p-0 text-right focus-visible:w-14"
            style={getTextStyles({
              settings: taxSettings.label,
              remove: ["align"]
            })}
            onFocus={() => setActiveSettings("totals")}
          />
          <span style={getTextStyles({ settings: taxSettings.label })}>%</span>
        </span>
      </div>
      <span
        className="ml-auto min-w-40 cursor-pointer items-center"
        style={getTextStyles({ settings: taxSettings.value })}
      >
        {formatCurrency(taxAmount, currency)}
      </span>
    </div>
  );
});

const FeesRow = memo(function FeesRow() {
  const [fees, setFees] = useAtom(feesAtom);
  const feesSettings = useAtomValue(feesSettingsAtom);
  const currency = useAtomValue(currencyAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);
  const updateInvoicePricing = useSetAtom(updateInvoicePricingAtom);

  const [feesInput, setFeesInput] = useState(fees.toString());
  const currencySymbol = currencySymbols.find(c => c.code === currency)?.symbol;

  return (
    <div
      className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm"
      onClick={() => {
        setActiveTab({
          eventType: "select-totals-tab",
          tab: "fees"
        });
        setActiveSettings("totals");
      }}
    >
      <span
        className="inline-block w-full cursor-pointer"
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
            updateInvoicePricing();
          }}
          onBlur={() =>
            handleInputBlur(
              feesInput,
              setFeesInput,
              setFees,
              updateInvoicePricing
            )
          }
          onFocus={() => setActiveSettings("totals")}
        />
      </span>
    </div>
  );
});

const DiscountsRow = memo(function DiscountsRow() {
  const [discounts, setDiscounts] = useAtom(discountsAtom);
  const discountsSettings = useAtomValue(discountsSettingsAtom);
  const currency = useAtomValue(currencyAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);
  const updateInvoicePricing = useSetAtom(updateInvoicePricingAtom);

  const [discountsInput, setDiscountsInput] = useState(discounts.toString());
  const currencySymbol = currencySymbols.find(c => c.code === currency)?.symbol;

  return (
    <div
      className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm"
      onClick={() => {
        setActiveTab({
          eventType: "select-totals-tab",
          tab: "discounts"
        });
        setActiveSettings("totals");
      }}
    >
      <span
        className="inline-block w-full cursor-pointer"
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
            updateInvoicePricing();
          }}
          onBlur={() =>
            handleInputBlur(
              discountsInput,
              setDiscountsInput,
              setDiscounts,
              updateInvoicePricing
            )
          }
          className="w-20 text-right"
          onFocus={() => setActiveSettings("totals")}
        />
      </span>
    </div>
  );
});

const TotalRow = memo(function TotalRow() {
  const total = useAtomValue(totalAtom);
  const totalSettings = useAtomValue(totalSettingsAtom);
  const currency = useAtomValue(currencyAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <div
      className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm"
      onClick={() => {
        setActiveTab({
          eventType: "select-totals-tab",
          tab: "total"
        });
        setActiveSettings("totals");
      }}
    >
      <span
        className="inline-block w-full cursor-pointer"
        style={getTextStyles({ settings: totalSettings.label })}
      >
        Total
      </span>
      <span
        className="inline-block min-w-40 cursor-pointer text-right font-bold"
        style={getTextStyles({ settings: totalSettings.value })}
      >
        {formatCurrency(total, currency)}
      </span>
    </div>
  );
});

export const InvoicePricing = memo(InvoicePricingComponent);
