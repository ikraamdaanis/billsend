import { InvoiceInput } from "components/invoice-input";
import { useDetailsSlice, useTheme } from "stores/invoice-selectors";
import { getRoleSettings } from "utils/get-role-settings";
import { getTextStyles } from "utils/get-text-styles";

export function InvoiceDetails() {
  return (
    <div className="flex flex-col">
      <InvoiceNumber />
      <InvoiceDate />
      <InvoiceDueDate />
    </div>
  );
}

function DetailLabel({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const theme = useTheme();
  const labelStyle = getTextStyles({
    settings: getRoleSettings(theme, "detailLabel")
  });

  return (
    <div className="flex min-w-32 items-center" style={labelStyle}>
      <InvoiceInput
        value={value}
        onChange={onChange}
        className="field-sizing-content h-[unset]! w-auto min-w-fit py-0"
        style={labelStyle}
        placeholder={placeholder}
      />
    </div>
  );
}

function InvoiceNumber() {
  const { number, setNumber, labels, setLabels } = useDetailsSlice();
  const theme = useTheme();

  return (
    <div className="flex items-center">
      <DetailLabel
        value={labels.invoiceNumber}
        onChange={value =>
          setLabels(prev => ({ ...prev, invoiceNumber: value }))
        }
        placeholder="Invoice No."
      />
      <InvoiceInput
        id="invoice-field-details"
        value={number}
        onChange={setNumber}
        className="h-[unset]! w-full py-0"
        style={getTextStyles({
          settings: getRoleSettings(theme, "detailValue")
        })}
        placeholder="########"
      />
    </div>
  );
}

function InvoiceDate() {
  const { invoiceDate, setInvoiceDate, labels, setLabels } = useDetailsSlice();
  const theme = useTheme();

  return (
    <div className="flex items-center">
      <DetailLabel
        value={labels.invoiceDate}
        onChange={value => setLabels(prev => ({ ...prev, invoiceDate: value }))}
        placeholder="Date"
      />
      <InvoiceInput
        value={invoiceDate}
        onChange={setInvoiceDate}
        className="h-[unset]! w-full py-0"
        style={getTextStyles({
          settings: getRoleSettings(theme, "detailValue")
        })}
        placeholder="Enter the invoice date"
      />
    </div>
  );
}

function InvoiceDueDate() {
  const { dueDate, setDueDate, labels, setLabels } = useDetailsSlice();
  const theme = useTheme();

  return (
    <div className="flex items-center">
      <DetailLabel
        value={labels.paymentDue}
        onChange={value => setLabels(prev => ({ ...prev, paymentDue: value }))}
        placeholder="Due date"
      />
      <InvoiceInput
        value={dueDate}
        onChange={setDueDate}
        className="h-[unset]! w-full py-0"
        style={getTextStyles({
          settings: getRoleSettings(theme, "detailValue")
        })}
        placeholder="Enter the payment due date"
      />
    </div>
  );
}
