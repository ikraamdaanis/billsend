import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import { useClientSlice, useTheme } from "stores/invoice-selectors";
import { getRoleSettings } from "utils/get-role-settings";
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
  const { client, setClient } = useClientSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      value={client.label}
      className="font-medium md:text-base"
      onChange={value => setClient(prev => ({ ...prev, label: value }))}
      placeholder="To"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionLabel")
      })}
    />
  );
}

function ClientContent() {
  const { client, setClient } = useClientSlice();
  const theme = useTheme();

  return (
    <InvoiceTextArea
      id="invoice-field-client"
      value={client.content}
      onChange={value => setClient(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionContent")
      })}
      placeholder={client.placeholder}
    />
  );
}
