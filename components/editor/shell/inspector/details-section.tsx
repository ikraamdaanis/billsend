import { IconCalendar } from "@tabler/icons-react";
import { format, isValid, parseISO } from "date-fns";
import { useState } from "react";
import { CustomCurrencyDialog } from "~/components/dialogs/custom-currency-dialog";
import {
  inspectorFieldClassName,
  InspectorRow,
  InspectorSection
} from "~/components/editor/shell/inspector/inspector-controls";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "~/components/ui/popover";
import { NativeSelect } from "~/components/ui/select";
import {
  currencyOptions,
  getCurrencyCodeForSymbol,
  getCurrencyMarker,
  normalizeCurrency
} from "~/consts/currencies";
import { cn } from "~/lib/utils";
import { INVOICE_DATE_FORMATS } from "~/schema/invoice";
import { useCurrencySlice, useDetailsSlice } from "~/stores/invoice-selectors";
import { formatInvoiceDate } from "~/utils/format-invoice-date";
import {
  addDaysToIsoDate,
  dueDateForNewInvoiceDate,
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
      <DateFormatRow />
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

// Each format is shown as today's date written that way, so the choice is
// obvious without reading a pattern.
function DateFormatRow() {
  const { dateFormat, setDateFormat } = useDetailsSlice();
  const today = new Date();

  return (
    <InspectorRow label="Date format" htmlFor="inspector-date-format">
      <NativeSelect
        id="inspector-date-format"
        value={dateFormat}
        onChange={event => {
          const next = INVOICE_DATE_FORMATS.find(
            option => option === event.target.value
          );

          if (next) setDateFormat(next);
        }}
        className={cn(inspectorFieldClassName, "pr-7")}
      >
        {INVOICE_DATE_FORMATS.map(option => (
          <option key={option} value={option}>
            {format(today, option)}
          </option>
        ))}
      </NativeSelect>
    </InspectorRow>
  );
}

// The same calendar as the page's date fields, with the date written in the
// invoice's format.
function IssueDatePicker({
  value,
  onChange
}: {
  value: string;
  onChange: (isoDate: string) => void;
}) {
  const { dateFormat } = useDetailsSlice();
  const [open, setOpen] = useState(false);
  const parsed = parseISO(value);
  const selected = isValid(parsed) ? parsed : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id="inspector-issue-date"
        className={cn(
          inspectorFieldClassName,
          "flex items-center justify-between gap-2 text-left tabular-nums"
        )}
      >
        <span className="truncate">
          {value ? formatInvoiceDate(value, dateFormat) : "Pick a date"}
        </span>
        <IconCalendar
          aria-hidden="true"
          className="text-muted-foreground size-3.5 shrink-0"
        />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={date => {
            if (!date) return;

            onChange(format(date, "yyyy-MM-dd"));
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function DatesRows() {
  const { invoiceDate, dueDate, setInvoiceDate, setDueDate } =
    useDetailsSlice();
  const termsDays = getPaymentTermsDays(invoiceDate, dueDate);

  // Moving the invoice date keeps a preset's gap, so Net 30 stays Net 30.
  function handleInvoiceDateChange(value: string) {
    const nextDueDate = dueDateForNewInvoiceDate({
      invoiceDate,
      dueDate,
      nextInvoiceDate: value
    });

    setInvoiceDate(value);
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
        <IssueDatePicker
          value={invoiceDate}
          onChange={handleInvoiceDateChange}
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
