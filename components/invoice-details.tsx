import { InvoiceInput } from "components/invoice-input";
import { useUI } from "context/ui-context";
import { TAB_SELECT_EVENTS } from "consts/events";
import { useDetailsSlice } from "stores/invoice-selectors";
import { getTextStyles } from "utils/get-text-styles";
import { setActiveTab } from "utils/set-active-tab";

export function InvoiceDetails() {
  const { setActiveSettings } = useUI();

  return (
    <div
      className="flex flex-col pt-7"
      onClick={() => setActiveSettings("details")}
    >
      <InvoiceNumber />
      <InvoiceDate />
      <InvoiceDueDate />
    </div>
  );
}

function InvoiceNumber() {
  const { number, numberSettings, setNumber } = useDetailsSlice();

  return (
    <div
      className="flex items-center"
      onClick={() => {
        setActiveTab({
          eventType: TAB_SELECT_EVENTS.details,
          tab: "number"
        });
      }}
    >
      <div
        className="min-w-32 cursor-pointer"
        style={getTextStyles({ settings: numberSettings.label })}
      >
        Invoice number:
      </div>
      <InvoiceInput
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
    <div
      className="flex items-center"
      onClick={() => {
        setActiveTab({
          eventType: TAB_SELECT_EVENTS.details,
          tab: "invoiceDate"
        });
      }}
    >
      <div
        className="min-w-32 cursor-pointer"
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
    <div
      className="flex items-center"
      onClick={() => {
        setActiveTab({
          eventType: TAB_SELECT_EVENTS.details,
          tab: "dueDate"
        });
      }}
    >
      <div
        className="min-w-32 cursor-pointer"
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
