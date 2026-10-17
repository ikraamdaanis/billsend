import { format } from "date-fns";
import type { CSSProperties } from "react";
import { useId, useState } from "react";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "~/components/ui/popover";
import { useIsPreview } from "~/hooks/use-shown-sections";
import { cn } from "~/lib/utils";
import { useDetailsSlice } from "~/stores/invoice-selectors";
import { formatInvoiceDate } from "~/utils/format-invoice-date";
import { parseIsoDate } from "~/utils/parse-iso-date";
import { dueDateForNewInvoiceDate } from "~/utils/payment-terms";

// The invoice or due date on the page: written in the invoice's date format,
// and picked from a calendar rather than typed, so it's always a real date.
// Moving the invoice date carries a Net 7/14/30/60 due date along with it.
export function InvoiceDateField({
  field,
  label,
  placeholder,
  style
}: {
  field: "invoiceDate" | "dueDate";
  label: string;
  placeholder: string;
  style: CSSProperties;
}) {
  const { invoiceDate, dueDate, dateFormat, setInvoiceDate, setDueDate } =
    useDetailsSlice();
  const [open, setOpen] = useState(false);
  const textId = useId();
  const isPreview = useIsPreview();
  const value = field === "invoiceDate" ? invoiceDate : dueDate;
  const selected = parseIsoDate(value) ?? undefined;
  const text = value ? formatInvoiceDate(value, dateFormat) : "";

  function handleSelect(date: Date | undefined) {
    if (!date) return;

    const isoDate = format(date, "yyyy-MM-dd");

    if (field === "invoiceDate") {
      const nextDueDate = dueDateForNewInvoiceDate({
        invoiceDate,
        dueDate,
        nextInvoiceDate: isoDate
      });

      setInvoiceDate(isoDate);
      if (nextDueDate) setDueDate(nextDueDate);
    } else {
      setDueDate(isoDate);
    }

    setOpen(false);
  }

  if (isPreview) {
    return (
      <span className="leading-paper-row text-paper-foreground" style={style}>
        {text}
      </span>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={label}
        aria-describedby={textId}
        data-date={value}
        className={cn(
          "leading-paper-row rounded-surface hover:bg-brand-50 aria-expanded:bg-brand-50 focus-visible:border-brand-500 -mx-px w-full border border-transparent text-left outline-none",
          text ? "text-paper-foreground" : "text-paper-muted-foreground"
        )}
        style={style}
      >
        <span id={textId}>{text || placeholder}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          required
          selected={selected}
          defaultMonth={selected}
          onSelect={handleSelect}
          autoFocus
          className="pointer-coarse:[--cell-size:--spacing(10)]"
        />
      </PopoverContent>
    </Popover>
  );
}
