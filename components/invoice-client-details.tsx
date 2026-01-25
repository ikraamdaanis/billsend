import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { activeSettingsAtom } from "components/settings-panel";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo } from "react";
import { clientAtom, clientSettingsAtom } from "state";
import { getTextStyles } from "utils/get-text-styles";

export const InvoiceClientDetails = memo(function InvoiceClientDetails() {
  return (
    <section className="flex flex-col gap-1">
      <ClientLabel />
      <ClientContent />
    </section>
  );
});

const clientLabelAtom = selectAtom(clientAtom, client => client.label);
const clientLabelSettingsAtom = selectAtom(
  clientSettingsAtom,
  settings => settings.label
);

const ClientLabel = memo(function ClientLabel() {
  const clientLabel = useAtomValue(clientLabelAtom);
  const clientLabelSettings = useAtomValue(clientLabelSettingsAtom);
  const [client, setClient] = useAtom(clientAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceInput
      value={clientLabel}
      className="font-medium md:text-base"
      onChange={value => setClient({ ...client, label: value })}
      placeholder="To"
      onFocus={() => setActiveSettings("client")}
      style={getTextStyles({ settings: clientLabelSettings })}
    />
  );
});

const clientContentAtom = selectAtom(clientAtom, client => client.content);
const clientContentSettingsAtom = selectAtom(
  clientSettingsAtom,
  settings => settings.content
);

const ClientContent = memo(function ClientContent() {
  const clientContent = useAtomValue(clientContentAtom);
  const clientContentSettings = useAtomValue(clientContentSettingsAtom);
  const [client, setClient] = useAtom(clientAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceTextArea
      value={clientContent}
      onChange={value => setClient({ ...client, content: value })}
      onFocus={() => setActiveSettings("client")}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({ settings: clientContentSettings })}
      placeholder={client.placeholder}
    />
  );
});

export const InvoiceClientSettings = memo(function InvoiceClientSettings() {
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
});

// Client Label Settings
const clientLabelAlignAtom = selectAtom(
  clientSettingsAtom,
  settings => settings.label.align
);
const clientLabelSizeAtom = selectAtom(
  clientSettingsAtom,
  settings => settings.label.size
);
const clientLabelWeightAtom = selectAtom(
  clientSettingsAtom,
  settings => settings.label.weight
);
const clientLabelColorAtom = selectAtom(
  clientSettingsAtom,
  settings => settings.label.color
);

const ClientLabelAlign = memo(function ClientLabelAlign() {
  const align = useAtomValue(clientLabelAlignAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setClientSettings({
          ...clientSettings,
          label: { ...clientSettings.label, align: value }
        })
      }
    />
  );
});

const ClientLabelSize = memo(function ClientLabelSize() {
  const size = useAtomValue(clientLabelSizeAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setClientSettings({
          ...clientSettings,
          label: { ...clientSettings.label, size: value }
        })
      }
    />
  );
});

const ClientLabelWeight = memo(function ClientLabelWeight() {
  const weight = useAtomValue(clientLabelWeightAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setClientSettings({
          ...clientSettings,
          label: { ...clientSettings.label, weight: value }
        })
      }
    />
  );
});

const ClientLabelColor = memo(function ClientLabelColor() {
  const color = useAtomValue(clientLabelColorAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setClientSettings({
          ...clientSettings,
          label: { ...clientSettings.label, color: value }
        })
      }
    />
  );
});

// Client Content Settings
const clientContentAlignAtom = selectAtom(
  clientSettingsAtom,
  settings => settings.content.align
);
const clientContentSizeAtom = selectAtom(
  clientSettingsAtom,
  settings => settings.content.size
);
const clientContentWeightAtom = selectAtom(
  clientSettingsAtom,
  settings => settings.content.weight
);
const clientContentColorAtom = selectAtom(
  clientSettingsAtom,
  settings => settings.content.color
);

const ClientContentAlign = memo(function ClientContentAlign() {
  const align = useAtomValue(clientContentAlignAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setClientSettings({
          ...clientSettings,
          content: { ...clientSettings.content, align: value }
        })
      }
    />
  );
});

const ClientContentSize = memo(function ClientContentSize() {
  const size = useAtomValue(clientContentSizeAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setClientSettings({
          ...clientSettings,
          content: { ...clientSettings.content, size: value }
        })
      }
    />
  );
});

const ClientContentWeight = memo(function ClientContentWeight() {
  const weight = useAtomValue(clientContentWeightAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setClientSettings({
          ...clientSettings,
          content: { ...clientSettings.content, weight: value }
        })
      }
    />
  );
});

const ClientContentColor = memo(function ClientContentColor() {
  const color = useAtomValue(clientContentColorAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setClientSettings({
          ...clientSettings,
          content: { ...clientSettings.content, color: value }
        })
      }
    />
  );
});
