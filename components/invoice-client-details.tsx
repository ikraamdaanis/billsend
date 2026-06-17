import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import { TextStyleControls } from "components/settings-fields";
import { SettingsSection } from "components/ui/settings-section";
import { useUI } from "context/ui-context";
import { useClientSlice } from "stores/invoice-selectors";
import { useInvoiceStore } from "stores/invoice-store";
import { applyTextSetting } from "utils/apply-text-setting";
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
  const setClientSettings = useInvoiceStore(state => state.setClientSettings);
  const { setActiveSettings, setActiveField } = useUI();

  return (
    <InvoiceInput
      value={client.label}
      className="font-medium md:text-base"
      onChange={value => setClient(prev => ({ ...prev, label: value }))}
      placeholder="To"
      onFocus={event => {
        setActiveSettings("client");
        setActiveField({
          anchorEl: event.currentTarget,
          selector: state => state.clientSettings.label,
          update: (key, value) =>
            setClientSettings(prev => ({
              ...prev,
              label: applyTextSetting(prev.label, key, value)
            }))
        });
      }}
      style={getTextStyles({ settings: clientSettings.label })}
    />
  );
}

function ClientContent() {
  const { client, clientSettings, setClient } = useClientSlice();
  const setClientSettings = useInvoiceStore(state => state.setClientSettings);
  const { setActiveSettings, setActiveField } = useUI();

  return (
    <InvoiceTextArea
      id="invoice-field-client"
      value={client.content}
      onChange={value => setClient(prev => ({ ...prev, content: value }))}
      onFocus={event => {
        setActiveSettings("client");
        setActiveField({
          anchorEl: event.currentTarget,
          selector: state => state.clientSettings.content,
          update: (key, value) =>
            setClientSettings(prev => ({
              ...prev,
              content: applyTextSetting(prev.content, key, value)
            }))
        });
      }}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({ settings: clientSettings.content })}
      placeholder={client.placeholder}
    />
  );
}

export function InvoiceClientSettings() {
  return (
    <div className="flex flex-col gap-2">
      <SettingsSection title="Label">
        <ClientLabelStyles />
      </SettingsSection>
      <SettingsSection title="Content">
        <ClientContentStyles />
      </SettingsSection>
    </div>
  );
}

function ClientLabelStyles() {
  const settings = useInvoiceStore(s => s.clientSettings.label);
  const set = useInvoiceStore(s => s.setClientSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, align: v } }))
      }
      onSizeChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, size: v } }))
      }
      onWeightChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, weight: v } }))
      }
      onColorChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, color: v } }))
      }
    />
  );
}

function ClientContentStyles() {
  const settings = useInvoiceStore(s => s.clientSettings.content);
  const set = useInvoiceStore(s => s.setClientSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v =>
        set(prev => ({ ...prev, content: { ...prev.content, align: v } }))
      }
      onSizeChange={v =>
        set(prev => ({ ...prev, content: { ...prev.content, size: v } }))
      }
      onWeightChange={v =>
        set(prev => ({ ...prev, content: { ...prev.content, weight: v } }))
      }
      onColorChange={v =>
        set(prev => ({ ...prev, content: { ...prev.content, color: v } }))
      }
    />
  );
}
