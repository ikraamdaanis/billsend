import { InvoiceInput } from "features/new/components/invoice-input";
import { activeSettingsAtom } from "features/new/components/settings-panel";
import {
  dueDateAtom,
  dueDateSettingsAtom,
  invoiceDateAtom,
  invoiceDateSettingsAtom,
  numberAtom,
  numberSettingsAtom
} from "features/new/state";
import { getTextStyles } from "features/new/utils/get-text-styles";
import { setActiveTab } from "features/new/utils/set-active-tab";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { memo } from "react";

function InvoiceDetailsComponent() {
  const setActiveSettings = useSetAtom(activeSettingsAtom);

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

const InvoiceNumber = memo(function InvoiceNumber() {
  const [number, setNumber] = useAtom(numberAtom);
  const numberSettings = useAtomValue(numberSettingsAtom);

  return (
    <div
      className="flex items-center"
      onClick={() => {
        setActiveTab({
          eventType: "select-details-tab",
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
});

const InvoiceDate = memo(function InvoiceDate() {
  const [invoiceDate, setInvoiceDate] = useAtom(invoiceDateAtom);
  const invoiceDateSettings = useAtomValue(invoiceDateSettingsAtom);

  return (
    <div
      className="flex items-center"
      onClick={() => {
        setActiveTab({
          eventType: "select-details-tab",
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
});

const InvoiceDueDate = memo(function InvoiceDueDate() {
  const [dueDate, setDueDate] = useAtom(dueDateAtom);
  const dueDateSettings = useAtomValue(dueDateSettingsAtom);

  return (
    <div
      className="flex items-center"
      onClick={() => {
        setActiveTab({
          eventType: "select-details-tab",
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
});

export const InvoiceDetails = memo(InvoiceDetailsComponent);
