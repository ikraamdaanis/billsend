import { endOfMonth, format, subMonths } from "date-fns";
import { InvoiceInput } from "~/components/editor/invoice-input";
import { useDetailsSlice, useTheme } from "~/stores/invoice-selectors";
import type { InvoiceDetailRow } from "~/types";
import { buildDetailRows } from "~/utils/build-invoice-view-model";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

// The previous whole calendar month as a realistic Service period example, e.g.
// "1–30 Jun 2026" (and "1–31 Dec 2025" when run in January, since the year rolls
// back with the month). The editor is client-only, so reading the clock here
// can't cause a server/client hydration mismatch.
function getServicePeriodExample(): string {
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  return `e.g. 1–${format(lastMonthEnd, "d MMM yyyy")}`;
}

function buildDetailPlaceholders(): Record<
  InvoiceDetailRow["id"],
  { label: string; value: string }
> {
  return {
    number: { label: "Invoice No.", value: "########" },
    poNumber: { label: "PO number", value: "Add a PO / reference" },
    invoiceDate: { label: "Date", value: "Enter invoice date" },
    dueDate: { label: "Due date", value: "Enter payment due date" },
    servicePeriod: {
      label: "Service period",
      value: getServicePeriodExample()
    }
  };
}

export function InvoiceDetails() {
  const { number, poNumber, invoiceDate, dueDate, servicePeriod, labels } =
    useDetailsSlice();
  const placeholders = buildDetailPlaceholders();
  const rows = buildDetailRows({
    labels,
    number,
    poNumber,
    invoiceDate,
    dueDate,
    servicePeriod
  });

  return (
    <div className="flex flex-col">
      {rows.map(row => (
        <DetailRow key={row.id} row={row} placeholders={placeholders[row.id]} />
      ))}
    </div>
  );
}

function DetailRow({
  row,
  placeholders
}: {
  row: InvoiceDetailRow;
  placeholders: { label: string; value: string };
}) {
  const {
    setNumber,
    setPoNumber,
    setInvoiceDate,
    setDueDate,
    setServicePeriod,
    setLabels
  } = useDetailsSlice();
  const theme = useTheme();
  const labelStyle = getTextStyles({
    settings: getRoleSettings(theme, "detailLabel")
  });
  const valueStyle = getTextStyles({
    settings: getRoleSettings(theme, "detailValue")
  });

  const setValue = {
    number: setNumber,
    poNumber: setPoNumber,
    invoiceDate: setInvoiceDate,
    dueDate: setDueDate,
    servicePeriod: setServicePeriod
  }[row.id];

  function handleLabelChange(value: string) {
    setLabels(prev => ({ ...prev, [row.labelKey]: value }));
  }

  return (
    <div className="flex items-center">
      <div className="flex min-w-32 items-center" style={labelStyle}>
        <InvoiceInput
          aria-label={`${placeholders.label} field label`}
          value={row.label}
          onChange={handleLabelChange}
          className="field-sizing-content h-[unset]! w-auto min-w-fit py-0"
          style={labelStyle}
          placeholder={placeholders.label}
        />
      </div>
      <InvoiceInput
        id={row.id === "number" ? "invoice-field-details" : undefined}
        aria-label={row.label || placeholders.label}
        value={row.value}
        onChange={setValue}
        className="h-[unset]! w-full py-0"
        style={valueStyle}
        placeholder={placeholders.value}
      />
    </div>
  );
}
