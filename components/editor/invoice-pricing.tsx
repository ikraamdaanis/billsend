import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { InvoiceInput } from "~/components/editor/invoice-input";
import { formatCurrency, formatCurrencyWithCode } from "~/consts/currencies";
import { cn } from "~/lib/utils";
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

// A small editor-only toggle shown to the left of a pricing row (e.g. switch a
// discount between fixed and percentage, or mark tax exempt). Like the add /
// remove item buttons, it is an editing affordance that never appears in the
// rendered PDF.
function PricingRowToggle({
  label,
  active,
  onClick,
  children
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "shrink-0 rounded px-1.5 py-0.5 text-xs transition-colors hover:bg-blue-100",
        active ? "text-blue-700" : "text-zinc-400"
      )}
    >
      {children}
    </button>
  );
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
      <AmountPaidRow />
      <BalanceDueRow />
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
        data-testid="subtotal-value"
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
      <PricingRowToggle
        label="Toggle tax exempt"
        active={tax.exempt}
        onClick={() => setTax(prev => ({ ...prev, exempt: !prev.exempt }))}
      >
        {tax.exempt ? "Exempt" : "%"}
      </PricingRowToggle>
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
        {!tax.exempt && (
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
        )}
      </div>
      {tax.exempt ? (
        <InvoiceInput
          aria-label="Tax exempt note"
          value={tax.note}
          onChange={value => setTax(prev => ({ ...prev, note: value }))}
          className="ml-auto min-w-40 text-right"
          style={getTextStyles({ settings: valueSettings })}
          placeholder="e.g. Reverse charge"
        />
      ) : (
        <span
          data-testid="tax-amount"
          className="ml-auto min-w-40 items-center"
          style={getTextStyles({ settings: valueSettings })}
        >
          {formatCurrency(taxAmount, currency)}
        </span>
      )}
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
  const {
    discounts,
    discountType,
    setDiscounts,
    setDiscountType,
    currency,
    labels,
    setLabels
  } = usePricingSlice();
  const { discountAmount } = useInvoiceTotals();
  const currencySymbol = useCurrencySymbol();
  const theme = useTheme();
  const labelSettings = getRoleSettings(theme, "totalsLabel");
  const valueSettings = getRoleSettings(theme, "totalsValue");

  const [discountsInput, setDiscountsInput] = usePricingInput(discounts);
  const isPercentage = discountType === "percentage";

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <PricingRowToggle
        label="Toggle discount type"
        active={isPercentage}
        onClick={() => setDiscountType(isPercentage ? "fixed" : "percentage")}
      >
        {isPercentage ? "%" : currencySymbol}
      </PricingRowToggle>
      <div
        className="flex w-full items-center"
        style={{ justifyContent: labelSettings.align }}
      >
        <InvoiceInput
          aria-label="Discounts label"
          value={labels.discounts}
          onChange={value => setLabels(prev => ({ ...prev, discounts: value }))}
          className="field-sizing-content w-auto min-w-fit pr-0.5"
          style={getTextStyles({ settings: labelSettings, remove: ["align"] })}
          placeholder="Discounts"
        />
        {isPercentage && (
          <span className="flex items-center">
            <InvoiceInput
              aria-label="Discount percentage"
              value={discountsInput}
              onChange={value => {
                const numericValue = handlePercentageInput(value);
                setDiscountsInput(numericValue);
                setDiscounts(Number(numericValue));
              }}
              onBlur={() =>
                handleInputBlur(discountsInput, setDiscountsInput, setDiscounts)
              }
              className="w-10 p-0 text-right focus-visible:w-14"
              style={getTextStyles({
                settings: labelSettings,
                remove: ["align"]
              })}
            />
            <span style={getTextStyles({ settings: labelSettings })}>%</span>
          </span>
        )}
      </div>
      {isPercentage ? (
        <span
          className="ml-auto min-w-40 items-center"
          style={getTextStyles({ settings: valueSettings })}
        >
          {`-${formatCurrency(discountAmount, currency)}`}
        </span>
      ) : (
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
      )}
    </div>
  );
}

// The grand total suppresses its emphasis when a payment has been recorded, so
// the balance-due row below reads as the figure to pay instead.
function TotalRow() {
  const { currency, currencyCode, amountPaid, labels, setLabels } =
    usePricingSlice();
  const { total } = useInvoiceTotals();
  const theme = useTheme();
  const hasPayment = amountPaid > 0;
  const role = hasPayment ? "totalsLabel" : "grandTotalLabel";
  const labelSettings = getRoleSettings(theme, role);
  const valueSettings = getRoleSettings(
    theme,
    hasPayment ? "totalsValue" : "grandTotalValue"
  );

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
        data-testid="total-value"
        className={cn(
          "inline-block min-w-40 text-right",
          hasPayment ? "" : "font-bold"
        )}
        style={getTextStyles({ settings: valueSettings })}
      >
        {formatCurrencyWithCode(total, currency, currencyCode)}
      </span>
    </div>
  );
}

function AmountPaidRow() {
  const { amountPaid, setAmountPaid, labels, setLabels } = usePricingSlice();
  const currencySymbol = useCurrencySymbol();
  const theme = useTheme();
  const labelSettings = getRoleSettings(theme, "totalsLabel");
  const valueSettings = getRoleSettings(theme, "totalsValue");

  const [amountPaidInput, setAmountPaidInput] = usePricingInput(amountPaid);

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <InvoiceInput
        aria-label="Amount paid label"
        value={labels.amountPaid}
        onChange={value => setLabels(prev => ({ ...prev, amountPaid: value }))}
        className="w-full min-w-fit"
        style={getTextStyles({ settings: labelSettings })}
        placeholder="Amount paid"
      />
      <span
        className="ml-auto flex min-w-40 items-center"
        style={{ justifyContent: valueSettings.align }}
      >
        <InvoiceInput
          aria-label="Amount paid"
          value={`${currencySymbol}${amountPaidInput}`}
          className="w-24 text-right"
          style={getTextStyles({ settings: valueSettings })}
          placeholder={currencySymbol}
          onChange={value => {
            const numericValue = handleCurrencyInput(value, currencySymbol);
            setAmountPaidInput(numericValue);
            setAmountPaid(Number(numericValue));
          }}
          onBlur={() =>
            handleInputBlur(amountPaidInput, setAmountPaidInput, setAmountPaid)
          }
        />
      </span>
    </div>
  );
}

function BalanceDueRow() {
  const { amountPaid, currency, currencyCode, labels, setLabels } =
    usePricingSlice();
  const { balanceDue } = useInvoiceTotals();
  const theme = useTheme();
  const labelSettings = getRoleSettings(theme, "grandTotalLabel");
  const valueSettings = getRoleSettings(theme, "grandTotalValue");

  if (amountPaid <= 0) {
    return null;
  }

  return (
    <div className="ml-auto flex w-1/3 items-center justify-end gap-1 text-sm">
      <InvoiceInput
        aria-label="Balance due label"
        value={labels.balanceDue}
        onChange={value => setLabels(prev => ({ ...prev, balanceDue: value }))}
        className="w-full min-w-fit"
        style={getTextStyles({ settings: labelSettings })}
        placeholder="Balance due"
      />
      <span
        data-testid="balance-due-value"
        className="inline-block min-w-40 text-right font-bold"
        style={getTextStyles({ settings: valueSettings })}
      >
        {formatCurrencyWithCode(balanceDue, currency, currencyCode)}
      </span>
    </div>
  );
}
