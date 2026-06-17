import { TextStyleControls } from "components/settings-fields";
import { SettingsSectionPicker } from "components/settings-section-picker";
import { SettingsSection } from "components/ui/settings-section";
import { TAB_SELECT_EVENTS } from "consts/events";
import { useTabSelectEvent } from "hooks/use-tab-select-event";
import { useState } from "react";
import { useInvoiceStore } from "stores/invoice-store";
import type { TextSettings } from "types";

const TOTAL_SECTIONS = [
  { value: "subtotal", label: "Subtotal" },
  { value: "tax", label: "Tax" },
  { value: "fees", label: "Fees" },
  { value: "discounts", label: "Discounts" },
  { value: "total", label: "Total" }
] as const;

type TotalSection = (typeof TOTAL_SECTIONS)[number]["value"];

function isTotalSection(value: string): value is TotalSection {
  return TOTAL_SECTIONS.some(section => section.value === value);
}

export function InvoicePricingSettings() {
  const [activeSection, setActiveSection] = useState<TotalSection>("subtotal");

  useTabSelectEvent(TAB_SELECT_EVENTS.totals, tab => {
    if (isTotalSection(tab)) {
      setActiveSection(tab);
    }
  });

  return (
    <div className="flex flex-col gap-3">
      <SettingsSectionPicker
        id="totals-section"
        label="Row"
        value={activeSection}
        options={TOTAL_SECTIONS}
        onValueChange={value => {
          if (isTotalSection(value)) {
            setActiveSection(value);
          }
        }}
      />
      {activeSection === "subtotal" && <SubtotalSettings />}
      {activeSection === "tax" && <TaxSettings />}
      {activeSection === "fees" && <FeesSettings />}
      {activeSection === "discounts" && <DiscountsSettings />}
      {activeSection === "total" && <TotalSettings />}
    </div>
  );
}

// Helper: creates updater callbacks for a label/value text settings slice
function useTextStyleHandlers(
  selector: (
    state: ReturnType<typeof useInvoiceStore.getState>
  ) => TextSettings,
  setter: (state: ReturnType<typeof useInvoiceStore.getState>) => (
    fn: (prev: { label: TextSettings; value: TextSettings }) => {
      label: TextSettings;
      value: TextSettings;
    }
  ) => void,
  path: "label" | "value"
) {
  const settings = useInvoiceStore(selector);
  const setSettings = useInvoiceStore(setter);

  return {
    align: settings.align,
    size: settings.size,
    weight: settings.weight,
    color: settings.color,
    onAlignChange: (v: TextSettings["align"]) =>
      setSettings(prev => ({
        ...prev,
        [path]: { ...prev[path], align: v }
      })),
    onSizeChange: (v: TextSettings["size"]) =>
      setSettings(prev => ({
        ...prev,
        [path]: { ...prev[path], size: v }
      })),
    onWeightChange: (v: TextSettings["weight"]) =>
      setSettings(prev => ({
        ...prev,
        [path]: { ...prev[path], weight: v }
      })),
    onColorChange: (v: TextSettings["color"]) =>
      setSettings(prev => ({
        ...prev,
        [path]: { ...prev[path], color: v }
      }))
  };
}

// ===== SUBTOTAL =====
function SubtotalSettings() {
  return (
    <>
      <SettingsSection title="Label">
        <SubtotalLabelStyles />
      </SettingsSection>
      <SettingsSection title="Value">
        <SubtotalValueStyles />
      </SettingsSection>
    </>
  );
}

function SubtotalLabelStyles() {
  const props = useTextStyleHandlers(
    s => s.subtotalSettings.label,
    s => s.setSubtotalSettings,
    "label"
  );
  return <TextStyleControls {...props} />;
}

function SubtotalValueStyles() {
  const props = useTextStyleHandlers(
    s => s.subtotalSettings.value,
    s => s.setSubtotalSettings,
    "value"
  );
  return <TextStyleControls {...props} />;
}

// ===== TAX =====
function TaxSettings() {
  return (
    <>
      <SettingsSection title="Label">
        <TaxLabelStyles />
      </SettingsSection>
      <SettingsSection title="Value">
        <TaxValueStyles />
      </SettingsSection>
    </>
  );
}

function TaxLabelStyles() {
  const props = useTextStyleHandlers(
    s => s.taxSettings.label,
    s => s.setTaxSettings,
    "label"
  );
  return <TextStyleControls {...props} />;
}

function TaxValueStyles() {
  const props = useTextStyleHandlers(
    s => s.taxSettings.value,
    s => s.setTaxSettings,
    "value"
  );
  return <TextStyleControls {...props} />;
}

// ===== FEES =====
function FeesSettings() {
  return (
    <>
      <SettingsSection title="Label">
        <FeesLabelStyles />
      </SettingsSection>
      <SettingsSection title="Value">
        <FeesValueStyles />
      </SettingsSection>
    </>
  );
}

function FeesLabelStyles() {
  const props = useTextStyleHandlers(
    s => s.feesSettings.label,
    s => s.setFeesSettings,
    "label"
  );
  return <TextStyleControls {...props} />;
}

function FeesValueStyles() {
  const props = useTextStyleHandlers(
    s => s.feesSettings.value,
    s => s.setFeesSettings,
    "value"
  );
  return <TextStyleControls {...props} />;
}

// ===== DISCOUNTS =====
function DiscountsSettings() {
  return (
    <>
      <SettingsSection title="Label">
        <DiscountsLabelStyles />
      </SettingsSection>
      <SettingsSection title="Value">
        <DiscountsValueStyles />
      </SettingsSection>
    </>
  );
}

function DiscountsLabelStyles() {
  const props = useTextStyleHandlers(
    s => s.discountsSettings.label,
    s => s.setDiscountsSettings,
    "label"
  );
  return <TextStyleControls {...props} />;
}

function DiscountsValueStyles() {
  const props = useTextStyleHandlers(
    s => s.discountsSettings.value,
    s => s.setDiscountsSettings,
    "value"
  );
  return <TextStyleControls {...props} />;
}

// ===== TOTAL =====
function TotalSettings() {
  return (
    <>
      <SettingsSection title="Label">
        <TotalLabelStyles />
      </SettingsSection>
      <SettingsSection title="Value">
        <TotalValueStyles />
      </SettingsSection>
    </>
  );
}

function TotalLabelStyles() {
  const props = useTextStyleHandlers(
    s => s.totalSettings.label,
    s => s.setTotalSettings,
    "label"
  );
  return <TextStyleControls {...props} />;
}

function TotalValueStyles() {
  const props = useTextStyleHandlers(
    s => s.totalSettings.value,
    s => s.setTotalSettings,
    "value"
  );
  return <TextStyleControls {...props} />;
}
