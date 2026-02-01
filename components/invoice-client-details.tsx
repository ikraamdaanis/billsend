import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { useUI } from "context/ui-context";
import { useClientSlice } from "stores/invoice-selectors";
import { useInvoiceStore } from "stores/invoice-store";
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
  const { setActiveSettings } = useUI();

  return (
    <InvoiceInput
      value={client.label}
      className="font-medium md:text-base"
      onChange={value => setClient(prev => ({ ...prev, label: value }))}
      placeholder="To"
      onFocus={() => setActiveSettings("client")}
      style={getTextStyles({ settings: clientSettings.label })}
    />
  );
}

function ClientContent() {
  const { client, clientSettings, setClient } = useClientSlice();
  const { setActiveSettings } = useUI();

  return (
    <InvoiceTextArea
      value={client.content}
      onChange={value => setClient(prev => ({ ...prev, content: value }))}
      onFocus={() => setActiveSettings("client")}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({ settings: clientSettings.content })}
      placeholder={client.placeholder}
    />
  );
}

export function InvoiceClientSettings() {
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 flex flex-col gap-4">
        <h3 className="text-sm font-medium">Label Settings</h3>
        <div className="flex flex-col gap-2">
          <ClientLabelAlign />
          <ClientLabelSize />
          <ClientLabelWeight />
          <ClientLabelColor />
        </div>
        <h3 className="text-sm font-medium">Content Settings</h3>
        <div className="flex flex-col gap-2">
          <ClientContentAlign />
          <ClientContentSize />
          <ClientContentWeight />
          <ClientContentColor />
        </div>
      </div>
    </div>
  );
}

// Client Label Settings
function ClientLabelAlign() {
  const align = useInvoiceStore(state => state.clientSettings.label.align);
  const setClientSettings = useInvoiceStore(state => state.setClientSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setClientSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function ClientLabelSize() {
  const size = useInvoiceStore(state => state.clientSettings.label.size);
  const setClientSettings = useInvoiceStore(state => state.setClientSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setClientSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function ClientLabelWeight() {
  const weight = useInvoiceStore(state => state.clientSettings.label.weight);
  const setClientSettings = useInvoiceStore(state => state.setClientSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setClientSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function ClientLabelColor() {
  const color = useInvoiceStore(state => state.clientSettings.label.color);
  const setClientSettings = useInvoiceStore(state => state.setClientSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setClientSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

// Client Content Settings
function ClientContentAlign() {
  const align = useInvoiceStore(state => state.clientSettings.content.align);
  const setClientSettings = useInvoiceStore(state => state.setClientSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setClientSettings(prev => ({
          ...prev,
          content: { ...prev.content, align: value }
        }))
      }
    />
  );
}

function ClientContentSize() {
  const size = useInvoiceStore(state => state.clientSettings.content.size);
  const setClientSettings = useInvoiceStore(state => state.setClientSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setClientSettings(prev => ({
          ...prev,
          content: { ...prev.content, size: value }
        }))
      }
    />
  );
}

function ClientContentWeight() {
  const weight = useInvoiceStore(state => state.clientSettings.content.weight);
  const setClientSettings = useInvoiceStore(state => state.setClientSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setClientSettings(prev => ({
          ...prev,
          content: { ...prev.content, weight: value }
        }))
      }
    />
  );
}

function ClientContentColor() {
  const color = useInvoiceStore(state => state.clientSettings.content.color);
  const setClientSettings = useInvoiceStore(state => state.setClientSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setClientSettings(prev => ({
          ...prev,
          content: { ...prev.content, color: value }
        }))
      }
    />
  );
}
