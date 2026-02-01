import { InvoiceInput } from "components/invoice-input";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { useUI } from "context/ui-context";
import { useTitleSlice, useTitleSettingsSlice } from "stores/invoice-selectors";
import { getTextStyles } from "utils/get-text-styles";

export function InvoiceTitle() {
  const { title, titleSettings, setTitle } = useTitleSlice();
  const { setActiveSettings } = useUI();

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
}

export function InvoiceTitleSettings() {
  return (
    <div className="flex flex-col gap-2">
      <Align />
      <Size />
      <Weight />
      <Color />
    </div>
  );
}

function Align() {
  const { titleSettings, setTitleSettings } = useTitleSettingsSlice();

  return (
    <AlignSettings
      value={titleSettings.align}
      handleInput={value =>
        setTitleSettings(prev => ({ ...prev, align: value }))
      }
    />
  );
}

function Size() {
  const { titleSettings, setTitleSettings } = useTitleSettingsSlice();

  return (
    <SizeSettings
      value={titleSettings.size}
      handleInput={value =>
        setTitleSettings(prev => ({ ...prev, size: value }))
      }
    />
  );
}

function Weight() {
  const { titleSettings, setTitleSettings } = useTitleSettingsSlice();

  return (
    <FontWeightSettings
      value={titleSettings.weight}
      handleInput={value =>
        setTitleSettings(prev => ({ ...prev, weight: value }))
      }
    />
  );
}

function Color() {
  const { titleSettings, setTitleSettings } = useTitleSettingsSlice();

  return (
    <ColorSettings
      value={titleSettings.color}
      handleInput={value =>
        setTitleSettings(prev => ({ ...prev, color: value }))
      }
    />
  );
}
