import { InvoiceInput } from "components/invoice-input";
import { useUI } from "context/ui-context";
import { TAB_SELECT_EVENTS } from "consts/events";
import { useDetailsSlice } from "stores/invoice-selectors";
import { useInvoiceStore } from "stores/invoice-store";
import { buildFieldUpdate } from "utils/apply-text-setting";
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
  const setNumberSettings = useInvoiceStore(state => state.setNumberSettings);
  const { setActiveSettings, setActiveField } = useUI();

  return (
    <div
      className="flex items-center"
      onClick={() =>
        setActiveTab({ eventType: TAB_SELECT_EVENTS.details, tab: "number" })
      }
    >
      <div
        className="min-w-32 cursor-pointer"
        style={getTextStyles({ settings: numberSettings.label })}
        onClick={event => {
          setActiveSettings("details");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.numberSettings.label,
            update: buildFieldUpdate(setNumberSettings, "label")
          });
        }}
      >
        Invoice number:
      </div>
      <InvoiceInput
        id="invoice-field-details"
        value={number}
        onChange={setNumber}
        onFocus={event => {
          setActiveSettings("details");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.numberSettings.value,
            update: buildFieldUpdate(setNumberSettings, "value")
          });
        }}
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
  const setInvoiceDateSettings = useInvoiceStore(
    state => state.setInvoiceDateSettings
  );
  const { setActiveSettings, setActiveField } = useUI();

  return (
    <div
      className="flex items-center"
      onClick={() =>
        setActiveTab({
          eventType: TAB_SELECT_EVENTS.details,
          tab: "invoiceDate"
        })
      }
    >
      <div
        className="min-w-32 cursor-pointer"
        style={getTextStyles({ settings: invoiceDateSettings.label })}
        onClick={event => {
          setActiveSettings("details");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.invoiceDateSettings.label,
            update: buildFieldUpdate(setInvoiceDateSettings, "label")
          });
        }}
      >
        Invoice date:
      </div>
      <InvoiceInput
        value={invoiceDate}
        onChange={setInvoiceDate}
        onFocus={event => {
          setActiveSettings("details");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.invoiceDateSettings.value,
            update: buildFieldUpdate(setInvoiceDateSettings, "value")
          });
        }}
        className="h-[unset]! w-full py-0"
        style={getTextStyles({ settings: invoiceDateSettings.value })}
        placeholder="Enter the invoice date"
      />
    </div>
  );
}

function InvoiceDueDate() {
  const { dueDate, dueDateSettings, setDueDate } = useDetailsSlice();
  const setDueDateSettings = useInvoiceStore(state => state.setDueDateSettings);
  const { setActiveSettings, setActiveField } = useUI();

  return (
    <div
      className="flex items-center"
      onClick={() =>
        setActiveTab({ eventType: TAB_SELECT_EVENTS.details, tab: "dueDate" })
      }
    >
      <div
        className="min-w-32 cursor-pointer"
        style={getTextStyles({ settings: dueDateSettings.label })}
        onClick={event => {
          setActiveSettings("details");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.dueDateSettings.label,
            update: buildFieldUpdate(setDueDateSettings, "label")
          });
        }}
      >
        Payment due:
      </div>
      <InvoiceInput
        value={dueDate}
        onChange={setDueDate}
        onFocus={event => {
          setActiveSettings("details");
          setActiveField({
            anchorEl: event.currentTarget,
            selector: state => state.dueDateSettings.value,
            update: buildFieldUpdate(setDueDateSettings, "value")
          });
        }}
        className="h-[unset]! w-full py-0"
        style={getTextStyles({ settings: dueDateSettings.value })}
        placeholder="Enter the payment due date"
      />
    </div>
  );
}
