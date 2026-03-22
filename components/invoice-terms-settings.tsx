import { TextStyleControls } from "components/settings-fields";
import { SettingsSection } from "components/ui/settings-section";
import { useInvoiceStore } from "stores/invoice-store";

export function InvoiceTermsSettings() {
  return (
    <div className="flex flex-col gap-2">
      <SettingsSection title="Label">
        <TermsLabelStyles />
      </SettingsSection>
      <SettingsSection title="Content">
        <TermsContentStyles />
      </SettingsSection>
    </div>
  );
}

function TermsLabelStyles() {
  const settings = useInvoiceStore(s => s.termsSettings.label);
  const set = useInvoiceStore(s => s.setTermsSettings);

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

function TermsContentStyles() {
  const settings = useInvoiceStore(s => s.termsSettings.content);
  const set = useInvoiceStore(s => s.setTermsSettings);

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
