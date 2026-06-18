import { InvoiceInput } from "components/invoice-input";
import { useDetailsSlice } from "stores/invoice-selectors";
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
  const { number, numberSettings, setNumber } = useDetailsSlice();

  return (
    <div className="flex items-center">
      <div
        className="min-w-32"
        style={getTextStyles({ settings: numberSettings.label })}
      >
        Invoice number:
      </div>
      <InvoiceInput
        id="invoice-field-details"
        value={number}
        onChange={setNumber}
        className="h-[unset]! w-full py-0"
        style={getTextStyles({ settings: numberSettings.value })}
        placeholder="########"
      />
    </div>
  );
}

function InvoiceDate() {
  const { invoiceDate, invoiceDateSettings, setInvoiceDate } =
    useDetailsSlice();

  return (
    <div className="flex items-center">
      <div
        className="min-w-32"
        style={getTextStyles({ settings: invoiceDateSettings.label })}
      >
        Invoice date:
      </div>
      <InvoiceInput
        value={invoiceDate}
        onChange={setInvoiceDate}
        className="h-[unset]! w-full py-0"
        style={getTextStyles({ settings: invoiceDateSettings.value })}
        placeholder="Enter the invoice date"
      />
    </div>
  );
}

function InvoiceDueDate() {
  const { dueDate, dueDateSettings, setDueDate } = useDetailsSlice();

  return (
    <div className="flex items-center">
      <div
        className="min-w-32"
        style={getTextStyles({ settings: dueDateSettings.label })}
      >
        Payment due:
      </div>
      <InvoiceInput
        value={dueDate}
        onChange={setDueDate}
        className="h-[unset]! w-full py-0"
        style={getTextStyles({ settings: dueDateSettings.value })}
        placeholder="Enter the payment due date"
      />
    </div>
  );
}
