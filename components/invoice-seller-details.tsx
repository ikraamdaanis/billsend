import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import { TextStyleControls } from "components/settings-fields";
import { SettingsSection } from "components/ui/settings-section";
import { useUI } from "context/ui-context";
import { useSellerSlice } from "stores/invoice-selectors";
import { useInvoiceStore } from "stores/invoice-store";
import { getTextStyles } from "utils/get-text-styles";

export function InvoiceSellerDetails() {
  return (
    <section className="flex flex-col gap-1">
      <SellerLabel />
      <SellerContent />
    </section>
  );
}

function SellerLabel() {
  const { seller, sellerSettings, setSeller } = useSellerSlice();
  const { setActiveSettings } = useUI();

  return (
    <InvoiceInput
      value={seller.label}
      className="font-medium md:text-base"
      onChange={value => setSeller(prev => ({ ...prev, label: value }))}
      placeholder="From"
      onFocus={() => setActiveSettings("seller")}
      style={getTextStyles({ settings: sellerSettings.label })}
    />
  );
}

function SellerContent() {
  const { seller, sellerSettings, setSeller } = useSellerSlice();
  const { setActiveSettings } = useUI();

  return (
    <InvoiceTextArea
      value={seller.content}
      onChange={value => setSeller(prev => ({ ...prev, content: value }))}
      onFocus={() => setActiveSettings("seller")}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({ settings: sellerSettings.content })}
      placeholder={seller.placeholder}
    />
  );
}

export function InvoiceSellerSettings() {
  return (
    <div className="flex flex-col gap-2">
      <SettingsSection title="Label">
        <SellerLabelStyles />
      </SettingsSection>
      <SettingsSection title="Content">
        <SellerContentStyles />
      </SettingsSection>
    </div>
  );
}

function SellerLabelStyles() {
  const settings = useInvoiceStore(s => s.sellerSettings.label);
  const set = useInvoiceStore(s => s.setSellerSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v => set(prev => ({ ...prev, label: { ...prev.label, align: v } }))}
      onSizeChange={v => set(prev => ({ ...prev, label: { ...prev.label, size: v } }))}
      onWeightChange={v => set(prev => ({ ...prev, label: { ...prev.label, weight: v } }))}
      onColorChange={v => set(prev => ({ ...prev, label: { ...prev.label, color: v } }))}
    />
  );
}

function SellerContentStyles() {
  const settings = useInvoiceStore(s => s.sellerSettings.content);
  const set = useInvoiceStore(s => s.setSellerSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v => set(prev => ({ ...prev, content: { ...prev.content, align: v } }))}
      onSizeChange={v => set(prev => ({ ...prev, content: { ...prev.content, size: v } }))}
      onWeightChange={v => set(prev => ({ ...prev, content: { ...prev.content, weight: v } }))}
      onColorChange={v => set(prev => ({ ...prev, content: { ...prev.content, color: v } }))}
    />
  );
}
