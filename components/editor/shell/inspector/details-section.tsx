import { useState } from "react";
import { CustomCurrencyDialog } from "~/components/dialogs/custom-currency-dialog";
import {
  inspectorFieldClassName,
  InspectorRow,
  InspectorSection
} from "~/components/editor/shell/inspector/inspector-controls";
import { NativeSelect } from "~/components/ui/select";
import {
  currencyOptions,
  getCurrencyCodeForSymbol,
  getCurrencyMarker,
  normalizeCurrency
} from "~/consts/currencies";
import { cn } from "~/lib/utils";
import { useCurrencySlice, useDetailsSlice } from "~/stores/invoice-selectors";
import {
  addDaysToIsoDate,
  getPaymentTermsDays,
  PAYMENT_TERMS
} from "~/utils/payment-terms";

const CUSTOM_CURRENCY = "__custom";
const CUSTOM_TERMS = "custom";

export function DetailsSection() {
  return (
    <InspectorSection id="details" title="Details">
      <CurrencyRow />
      <DatesRows />
    </InspectorSection>
  );
}

function CurrencyRow() {
  const { currency, currencyCode, setCurrency, setCurrencyCode } =
    useCurrencySlice();
  const [customOpen, setCustomOpen] = useState(false);
  const selected = normalizeCurrency(currency);
  const isCustom = !currencyOptions.some(option => option.symbol === selected);

  // A preset stores its symbol and its default ISO code together, so a bare
  // "$" still carries an explicit code the user can override.
  function handleChange(value: string) {
    if (value === CUSTOM_CURRENCY) {
      setCustomOpen(true);

      return;
    }

    setCurrency(value);
    setCurrencyCode(getCurrencyCodeForSymbol(value));
  }

  return (
    <>
      <InspectorRow label="Currency" htmlFor="inspector-currency">
        <NativeSelect
          id="inspector-currency"
          value={isCustom ? CUSTOM_CURRENCY : selected}
          onChange={event => handleChange(event.target.value)}
          className={cn(inspectorFieldClassName, "pr-7")}
        >
          {currencyOptions.map(({ symbol, code, label }) => (
            <option key={symbol} value={symbol}>
              {`${getCurrencyMarker(symbol)} ${label} · ${code}`}
            </option>
          ))}
          <option value={CUSTOM_CURRENCY}>
            {isCustom ? `Custom (${selected})` : "Custom…"}
          </option>
        </NativeSelect>
      </InspectorRow>
      <CustomCurrencyDialog
        open={customOpen}
        onOpenChange={setCustomOpen}
        currentSymbol={selected}
        currentCode={isCustom ? currencyCode : ""}
        onSubmit={(symbol, code) => {
          setCurrency(symbol);
          setCurrencyCode(code);
        }}
      />
    </>
  );
}

function DatesRows() {
  const { invoiceDate, dueDate, setInvoiceDate, setDueDate } =
    useDetailsSlice();
  const termsDays = getPaymentTermsDays(invoiceDate, dueDate);

  // Moving the invoice date keeps a preset's gap, so Net 30 stays Net 30.
  function handleInvoiceDateChange(value: string) {
    setInvoiceDate(value);

    if (termsDays === null) return;

    const nextDueDate = addDaysToIsoDate(value, termsDays);

    if (nextDueDate) setDueDate(nextDueDate);
  }

  function handleTermsChange(value: string) {
    if (value === CUSTOM_TERMS) return;

    const nextDueDate = addDaysToIsoDate(invoiceDate, Number(value));

    if (nextDueDate) setDueDate(nextDueDate);
  }

  return (
    <>
      <InspectorRow label="Issue date" htmlFor="inspector-issue-date">
        <input
          id="inspector-issue-date"
          type="date"
          value={invoiceDate}
          onChange={event => handleInvoiceDateChange(event.target.value)}
          className={cn(inspectorFieldClassName, "tabular-nums")}
        />
      </InspectorRow>
      <InspectorRow label="Payment terms" htmlFor="inspector-terms">
        <NativeSelect
          id="inspector-terms"
          value={termsDays === null ? CUSTOM_TERMS : String(termsDays)}
          onChange={event => handleTermsChange(event.target.value)}
          className={cn(inspectorFieldClassName, "pr-7")}
        >
          {PAYMENT_TERMS.map(term => (
            <option key={term.days} value={String(term.days)}>
              {term.label}
            </option>
          ))}
          {termsDays === null && (
            <option value={CUSTOM_TERMS}>Custom due date</option>
          )}
        </NativeSelect>
      </InspectorRow>
    </>
  );
}
