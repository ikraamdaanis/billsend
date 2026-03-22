import { InvoiceInput } from "components/invoice-input";
import { TextStyleControls } from "components/settings-fields";
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
  return <TitleStyles />;
}

function TitleStyles() {
  const settings = useInvoiceStore(s => s.titleSettings);
  const set = useInvoiceStore(s => s.setTitleSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v => set(prev => ({ ...prev, align: v }))}
      onSizeChange={v => set(prev => ({ ...prev, size: v }))}
      onWeightChange={v => set(prev => ({ ...prev, weight: v }))}
      onColorChange={v => set(prev => ({ ...prev, color: v }))}
    />
  );
}
