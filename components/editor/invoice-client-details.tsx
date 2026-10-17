import { InvoiceInput } from "~/components/editor/invoice-input";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { useClientSlice, useTheme } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

export function InvoiceClientDetails() {
  return (
    <section data-field-area="client" className="flex flex-col">
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
      aria-label="Client section label"
      data-field="client.label"
      value={client.label}
      className="leading-paper-row font-medium"
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
      aria-label={`${client.label || "Client"} details`}
      data-field="client.content"
      value={client.content}
      onChange={value => setClient(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[5lh] w-full max-w-[500px]"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionContent")
      })}
      placeholder={client.placeholder}
    />
  );
}
