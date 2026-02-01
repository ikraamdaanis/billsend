import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { useUI } from "context/ui-context";
import { useClientSlice, useClientSettingsSlice } from "stores/invoice-selectors";
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
  const { clientSettings, setClientSettings } = useClientSettingsSlice();

  return (
    <AlignSettings
      value={clientSettings.label.align}
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
  const { clientSettings, setClientSettings } = useClientSettingsSlice();

  return (
    <SizeSettings
      value={clientSettings.label.size}
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
  const { clientSettings, setClientSettings } = useClientSettingsSlice();

  return (
    <FontWeightSettings
      value={clientSettings.label.weight}
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
  const { clientSettings, setClientSettings } = useClientSettingsSlice();

  return (
    <ColorSettings
      value={clientSettings.label.color}
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
  const { clientSettings, setClientSettings } = useClientSettingsSlice();

  return (
    <AlignSettings
      value={clientSettings.content.align}
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
  const { clientSettings, setClientSettings } = useClientSettingsSlice();

  return (
    <SizeSettings
      value={clientSettings.content.size}
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
  const { clientSettings, setClientSettings } = useClientSettingsSlice();

  return (
    <FontWeightSettings
      value={clientSettings.content.weight}
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
  const { clientSettings, setClientSettings } = useClientSettingsSlice();

  return (
    <ColorSettings
      value={clientSettings.content.color}
      handleInput={value =>
        setClientSettings(prev => ({
          ...prev,
          content: { ...prev.content, color: value }
        }))
      }
    />
  );
}
