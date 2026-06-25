import { InvoiceInput } from "~/components/invoice-input";
import { useDetailsSlice, useTheme } from "~/stores/invoice-selectors";
import type { InvoiceDetailRow } from "~/types";
import { buildDetailRows } from "~/utils/build-invoice-view-model";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

const DETAIL_PLACEHOLDERS: Record<
  InvoiceDetailRow["id"],
  { label: string; value: string }
> = {
  number: { label: "Invoice No.", value: "########" },
  invoiceDate: { label: "Date", value: "Enter the invoice date" },
  dueDate: { label: "Due date", value: "Enter the payment due date" }
};

export function InvoiceDetails() {
  const { number, invoiceDate, dueDate, labels } = useDetailsSlice();
  const rows = buildDetailRows({ labels, number, invoiceDate, dueDate });

  return (
    <div className="flex flex-col">
      {rows.map(row => (
        <DetailRow key={row.id} row={row} />
      ))}
    </div>
  );
}

function DetailRow({ row }: { row: InvoiceDetailRow }) {
  const { setNumber, setInvoiceDate, setDueDate, setLabels } =
    useDetailsSlice();
  const theme = useTheme();
  const placeholders = DETAIL_PLACEHOLDERS[row.id];
  const labelStyle = getTextStyles({
    settings: getRoleSettings(theme, "detailLabel")
  });
  const valueStyle = getTextStyles({
    settings: getRoleSettings(theme, "detailValue")
  });

  const setValue = {
    number: setNumber,
    invoiceDate: setInvoiceDate,
    dueDate: setDueDate
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
