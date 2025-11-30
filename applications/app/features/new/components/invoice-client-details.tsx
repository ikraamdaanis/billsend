import { InvoiceTextArea } from "features/new/components/invoice-textarea";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "features/new/components/settings-fields";
import { activeSettingsAtom } from "features/new/components/settings-panel";
import { clientAtom, clientSettingsAtom } from "features/new/state";
import { getTextStyles } from "features/new/utils/get-text-styles";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo } from "react";

export const InvoiceClientDetails = memo(function InvoiceClientDetails() {
  const [client, setClient] = useAtom(clientAtom);
  const clientSettings = useAtomValue(clientSettingsAtom);

  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceTextArea
      value={client.content}
      onChange={value => setClient({ ...client, content: value })}
      onFocus={() => setActiveSettings("client")}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({ settings: clientSettings })}
      placeholder={client.placeholder}
    />
  );
});

export const InvoiceClientSettings = memo(function InvoiceClientSettings() {
  return (
    <div className="flex flex-col gap-2">
      <Align />
      <Size />
      <Weight />
      <Color />
    </div>
  );
});

const alignAtom = selectAtom(clientSettingsAtom, settings => settings.align);
const sizeAtom = selectAtom(clientSettingsAtom, settings => settings.size);
const weightAtom = selectAtom(clientSettingsAtom, settings => settings.weight);
const colorAtom = selectAtom(clientSettingsAtom, settings => settings.color);

const Align = memo(function Align() {
  const align = useAtomValue(alignAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => setClientSettings({ ...clientSettings, align: value })}
    />
  );
});

const Size = memo(function Size() {
  const size = useAtomValue(sizeAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => setClientSettings({ ...clientSettings, size: value })}
    />
  );
});

const Weight = memo(function Weight() {
  const weight = useAtomValue(weightAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => setClientSettings({ ...clientSettings, weight: value })}
    />
  );
});

const Color = memo(function Color() {
  const color = useAtomValue(colorAtom);
  const [clientSettings, setClientSettings] = useAtom(clientSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => setClientSettings({ ...clientSettings, color: value })}
    />
  );
});
