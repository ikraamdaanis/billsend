import { InvoiceInput } from "features/new/components/invoice-input";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "features/new/components/settings-fields";
import { activeSettingsAtom } from "features/new/components/settings-panel";
import {
  titleAtom,
  titleSettingsAtom,
  updateTitleAtom,
  updateTitleSettingsAtom
} from "features/new/state";
import { getTextStyles } from "features/new/utils/get-text-styles";
import { useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo } from "react";

export const InvoiceTitle = memo(function InvoiceTitle() {
  const title = useAtomValue(titleAtom);
  const titleSettings = useAtomValue(titleSettingsAtom);

  const updateTitle = useSetAtom(updateTitleAtom);

  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceInput
      value={title}
      onChange={value => updateTitle(value)}
      onFocus={() => setActiveSettings("title")}
      className="w-full text-5xl font-semibold"
      style={{ ...getTextStyles({ settings: titleSettings }) }}
      placeholder="Invoice"
    />
  );
});

export const InvoiceTitleSettings = memo(function InvoiceTitleSettings() {
  return (
    <div className="flex flex-col gap-2">
      <Align />
      <Size />
      <Weight />
      <Color />
    </div>
  );
});

const alignAtom = selectAtom(titleSettingsAtom, settings => settings.align);
const sizeAtom = selectAtom(titleSettingsAtom, settings => settings.size);
const weightAtom = selectAtom(titleSettingsAtom, settings => settings.weight);
const colorAtom = selectAtom(titleSettingsAtom, settings => settings.color);

const Align = memo(function Align() {
  const align = useAtomValue(alignAtom);
  const updateTitleSettings = useSetAtom(updateTitleSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateTitleSettings({ align: value })}
    />
  );
});

const Size = memo(function Size() {
  const size = useAtomValue(sizeAtom);
  const updateTitleSettings = useSetAtom(updateTitleSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateTitleSettings({ size: value })}
    />
  );
});

const Weight = memo(function Weight() {
  const weight = useAtomValue(weightAtom);
  const updateTitleSettings = useSetAtom(updateTitleSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateTitleSettings({ weight: value })}
    />
  );
});

const Color = memo(function Color() {
  const color = useAtomValue(colorAtom);
  const updateTitleSettings = useSetAtom(updateTitleSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateTitleSettings({ color: value })}
    />
  );
});
