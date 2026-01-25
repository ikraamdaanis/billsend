import { InvoiceInput } from "components/invoice-input";
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
import { titleAtom, titleSettingsAtom } from "state";
import { getTextStyles } from "utils/get-text-styles";

export const InvoiceTitle = memo(function InvoiceTitle() {
  const [title, setTitle] = useAtom(titleAtom);
  const titleSettings = useAtomValue(titleSettingsAtom);

  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceInput
      value={title}
      onChange={setTitle}
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
  const [titleSettings, setTitleSettings] = useAtom(titleSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTitleSettings({ ...titleSettings, align: value })
      }
    />
  );
});

const Size = memo(function Size() {
  const size = useAtomValue(sizeAtom);
  const [titleSettings, setTitleSettings] = useAtom(titleSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => setTitleSettings({ ...titleSettings, size: value })}
    />
  );
});

const Weight = memo(function Weight() {
  const weight = useAtomValue(weightAtom);
  const [titleSettings, setTitleSettings] = useAtom(titleSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTitleSettings({ ...titleSettings, weight: value })
      }
    />
  );
});

const Color = memo(function Color() {
  const color = useAtomValue(colorAtom);
  const [titleSettings, setTitleSettings] = useAtom(titleSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTitleSettings({ ...titleSettings, color: value })
      }
    />
  );
});
