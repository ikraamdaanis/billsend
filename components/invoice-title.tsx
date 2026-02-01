import { InvoiceInput } from "components/invoice-input";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { useUI } from "context/ui-context";
import { useTitleSlice } from "stores/invoice-selectors";
import { useInvoiceStore } from "stores/invoice-store";
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
      <TitleAlign />
      <TitleSize />
      <TitleWeight />
      <TitleColor />
    </div>
  );
}

function TitleAlign() {
  const align = useInvoiceStore(state => state.titleSettings.align);
  const setTitleSettings = useInvoiceStore(state => state.setTitleSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTitleSettings(prev => ({ ...prev, align: value }))
      }
    />
  );
}

function TitleSize() {
  const size = useInvoiceStore(state => state.titleSettings.size);
  const setTitleSettings = useInvoiceStore(state => state.setTitleSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTitleSettings(prev => ({ ...prev, size: value }))
      }
    />
  );
}

function TitleWeight() {
  const weight = useInvoiceStore(state => state.titleSettings.weight);
  const setTitleSettings = useInvoiceStore(state => state.setTitleSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTitleSettings(prev => ({ ...prev, weight: value }))
      }
    />
  );
}

function TitleColor() {
  const color = useInvoiceStore(state => state.titleSettings.color);
  const setTitleSettings = useInvoiceStore(state => state.setTitleSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTitleSettings(prev => ({ ...prev, color: value }))
      }
    />
  );
}
