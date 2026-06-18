import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import { useClientSlice } from "stores/invoice-selectors";
import { getTextStyles } from "utils/get-text-styles";

export function InvoiceClientDetails() {
  return (
    <section className="flex flex-col gap-1">
      <ClientLabel />
      <ClientContent />
    </section>
  );
}

function ClientLabel() {
  const { client, clientSettings, setClient } = useClientSlice();

  return (
    <InvoiceInput
      value={client.label}
      className="font-medium md:text-base"
      onChange={value => setClient(prev => ({ ...prev, label: value }))}
      placeholder="To"
      style={getTextStyles({ settings: clientSettings.label })}
    />
  );
}

function ClientContent() {
  const { client, clientSettings, setClient } = useClientSlice();

  return (
    <InvoiceTextArea
      id="invoice-field-client"
      value={client.content}
      onChange={value => setClient(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({ settings: clientSettings.content })}
      placeholder={client.placeholder}
    />
  );
}
