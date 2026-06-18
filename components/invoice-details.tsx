import { InvoiceInput } from "components/invoice-input";
import { useDetailsSlice, useTheme } from "stores/invoice-selectors";
import { getRoleSettings } from "utils/get-role-settings";
import { getTextStyles } from "utils/get-text-styles";

export function InvoiceDetails() {
  return (
    <div className="flex flex-col pt-7">
      <InvoiceNumber />
      <InvoiceDate />
      <InvoiceDueDate />
    </div>
  );
}

function InvoiceNumber() {
  const { number, setNumber } = useDetailsSlice();
  const theme = useTheme();

  return (
    <div className="flex items-center">
      <div
        className="min-w-32"
        style={getTextStyles({
          settings: getRoleSettings(theme, "detailLabel")
        })}
      >
        Invoice number:
      </div>
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
  const { invoiceDate, setInvoiceDate } = useDetailsSlice();
  const theme = useTheme();

  return (
    <div className="flex items-center">
      <div
        className="min-w-32"
        style={getTextStyles({
          settings: getRoleSettings(theme, "detailLabel")
        })}
      >
        Invoice date:
      </div>
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
  const { dueDate, setDueDate } = useDetailsSlice();
  const theme = useTheme();

  return (
    <div className="flex items-center">
      <div
        className="min-w-32"
        style={getTextStyles({
          settings: getRoleSettings(theme, "detailLabel")
        })}
      >
        Payment due:
      </div>
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
