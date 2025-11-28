import { InvoiceTextArea } from "features/new/components/invoice-textarea";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "features/new/components/settings-fields";
import { activeSettingsAtom } from "features/new/components/settings-panel";
import {
  clientAtom,
  clientSettingsAtom,
  updateClientAtom,
  updateClientSettingsAtom
} from "features/new/state";
import { getTextStyles } from "features/new/utils/get-text-styles";
import { useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo } from "react";

export const InvoiceClientDetails = memo(function InvoiceClientDetails() {
  const client = useAtomValue(clientAtom);
  const updateClient = useSetAtom(updateClientAtom);
  const clientSettings = useAtomValue(clientSettingsAtom);

  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceTextArea
      value={client.content}
      onChange={value => updateClient(value)}
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
  const updateClientSettings = useSetAtom(updateClientSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateClientSettings({ align: value })}
    />
  );
});

const Size = memo(function Size() {
  const size = useAtomValue(sizeAtom);
  const updateClientSettings = useSetAtom(updateClientSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateClientSettings({ size: value })}
    />
  );
});

const Weight = memo(function Weight() {
  const weight = useAtomValue(weightAtom);
  const updateClientSettings = useSetAtom(updateClientSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateClientSettings({ weight: value })}
    />
  );
});

const Color = memo(function Color() {
  const color = useAtomValue(colorAtom);
  const updateClientSettings = useSetAtom(updateClientSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateClientSettings({ color: value })}
    />
  );
});
