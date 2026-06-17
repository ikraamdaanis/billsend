import { InvoiceInput } from "components/invoice-input";
import { useUI } from "context/ui-context";
import { formatCurrency } from "consts/currencies";
import { TAB_SELECT_EVENTS } from "consts/events";
import { useState } from "react";
import { usePricingSlice, useCurrencySymbol } from "stores/invoice-selectors";
import { useInvoiceStore } from "stores/invoice-store";
import { buildFieldUpdate } from "utils/apply-text-setting";
import { getTextStyles } from "utils/get-text-styles";
import { handleCurrencyInput } from "utils/handle-currency-input";
import { handlePercentageInput } from "utils/handle-percentage-input";
import { setActiveTab } from "utils/set-active-tab";

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
  const { setActiveSettings } = useUI();

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

function SubtotalRow() {
  const { subtotal, subtotalSettings, currency } = usePricingSlice();
  const setSubtotalSettings = useInvoiceStore(
    state => state.setSubtotalSettings
  );
  const { setActiveSettings, setActiveField } = useUI();

  return (
    <div
      className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm"
      onClick={() => {
        setActiveTab({
          eventType: TAB_SELECT_EVENTS.totals,
          tab: "subtotal"
        });
        setActiveSettings("totals");
      }}
    >
      <span
        className="inline-block w-full cursor-pointer"
        style={getTextStyles({ settings: subtotalSettings.label })}
        onClick={event => {
          setActiveSettings("totals");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.subtotalSettings.label,
            update: buildFieldUpdate(setSubtotalSettings, "label")
          });
        }}
      >
        Subtotal
      </span>
      <span
        className="inline-block min-w-40 cursor-pointer text-right text-zinc-900"
        style={getTextStyles({ settings: subtotalSettings.value })}
        onClick={event => {
          setActiveSettings("totals");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.subtotalSettings.value,
            update: buildFieldUpdate(setSubtotalSettings, "value")
          });
        }}
      >
        {formatCurrency(subtotal, currency)}
      </span>
    </div>
  );
}

function TaxRow() {
  const { tax, taxSettings, currency, setTax } = usePricingSlice();
  const setTaxSettings = useInvoiceStore(state => state.setTaxSettings);
  const { setActiveSettings, setActiveField } = useUI();

  const [taxInput, setTaxInput] = useState(tax.percentage.toString());

  function selectLabel(anchorEl: HTMLElement) {
    setActiveSettings("totals");
    setActiveField({
      anchorEl,
      selector: state => state.taxSettings.label,
      update: buildFieldUpdate(setTaxSettings, "label")
    });
  }

  return (
    <div
      className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm"
      onClick={() => {
        setActiveTab({
          eventType: TAB_SELECT_EVENTS.totals,
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
          onClick={event => selectLabel(event.currentTarget)}
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
            onFocus={event => selectLabel(event.currentTarget)}
          />
          <span style={getTextStyles({ settings: taxSettings.label })}>%</span>
        </span>
      </div>
      <span
        className="ml-auto min-w-40 cursor-pointer items-center"
        style={getTextStyles({ settings: taxSettings.value })}
        onClick={event => {
          setActiveSettings("totals");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.taxSettings.value,
            update: buildFieldUpdate(setTaxSettings, "value")
          });
        }}
      >
        {formatCurrency(tax.amount, currency)}
      </span>
    </div>
  );
}

function FeesRow() {
  const { fees, feesSettings, setFees } = usePricingSlice();
  const setFeesSettings = useInvoiceStore(state => state.setFeesSettings);
  const currencySymbol = useCurrencySymbol();
  const { setActiveSettings, setActiveField } = useUI();

  const [feesInput, setFeesInput] = useState(fees.toString());

  return (
    <div
      className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm"
      onClick={() => {
        setActiveTab({
          eventType: TAB_SELECT_EVENTS.totals,
          tab: "fees"
        });
        setActiveSettings("totals");
      }}
    >
      <span
        className="inline-block w-full cursor-pointer"
        style={getTextStyles({ settings: feesSettings.label })}
        onClick={event => {
          setActiveSettings("totals");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.feesSettings.label,
            update: buildFieldUpdate(setFeesSettings, "label")
          });
        }}
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
          onFocus={event => {
            setActiveSettings("totals");
            setActiveField({
              anchorEl: event.currentTarget,
              selector: state => state.feesSettings.value,
              update: buildFieldUpdate(setFeesSettings, "value")
            });
          }}
        />
      </span>
    </div>
  );
}

function DiscountsRow() {
  const { discounts, discountsSettings, setDiscounts } = usePricingSlice();
  const setDiscountsSettings = useInvoiceStore(
    state => state.setDiscountsSettings
  );
  const currencySymbol = useCurrencySymbol();
  const { setActiveSettings, setActiveField } = useUI();

  const [discountsInput, setDiscountsInput] = useState(discounts.toString());

  return (
    <div
      className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm"
      onClick={() => {
        setActiveTab({
          eventType: TAB_SELECT_EVENTS.totals,
          tab: "discounts"
        });
        setActiveSettings("totals");
      }}
    >
      <span
        className="inline-block w-full cursor-pointer"
        style={getTextStyles({ settings: discountsSettings.label })}
        onClick={event => {
          setActiveSettings("totals");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.discountsSettings.label,
            update: buildFieldUpdate(setDiscountsSettings, "label")
          });
        }}
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
          onFocus={event => {
            setActiveSettings("totals");
            setActiveField({
              anchorEl: event.currentTarget,
              selector: state => state.discountsSettings.value,
              update: buildFieldUpdate(setDiscountsSettings, "value")
            });
          }}
        />
      </span>
    </div>
  );
}

function TotalRow() {
  const { total, totalSettings, currency } = usePricingSlice();
  const setTotalSettings = useInvoiceStore(state => state.setTotalSettings);
  const { setActiveSettings, setActiveField } = useUI();

  return (
    <div
      className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm"
      onClick={() => {
        setActiveTab({
          eventType: TAB_SELECT_EVENTS.totals,
          tab: "total"
        });
        setActiveSettings("totals");
      }}
    >
      <span
        className="inline-block w-full cursor-pointer"
        style={getTextStyles({ settings: totalSettings.label })}
        onClick={event => {
          setActiveSettings("totals");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.totalSettings.label,
            update: buildFieldUpdate(setTotalSettings, "label")
          });
        }}
      >
        Total
      </span>
      <span
        className="inline-block min-w-40 cursor-pointer text-right font-bold"
        style={getTextStyles({ settings: totalSettings.value })}
        onClick={event => {
          setActiveSettings("totals");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.totalSettings.value,
            update: buildFieldUpdate(setTotalSettings, "value")
          });
        }}
      >
        {formatCurrency(total, currency)}
      </span>
    </div>
  );
}
