import { TextStyleControls } from "components/settings-fields";
import { SettingsSectionPicker } from "components/settings-section-picker";
import { SettingsSection } from "components/ui/settings-section";
import { TAB_SELECT_EVENTS } from "consts/events";
import { useTabSelectEvent } from "hooks/use-tab-select-event";
import { useState } from "react";
import { useInvoiceStore } from "stores/invoice-store";

const DETAIL_SECTIONS = [
  { value: "number", label: "Invoice Number" },
  { value: "invoiceDate", label: "Invoice Date" },
  { value: "dueDate", label: "Payment Due" }
] as const;

type DetailSection = (typeof DETAIL_SECTIONS)[number]["value"];

function isDetailSection(value: string): value is DetailSection {
  return DETAIL_SECTIONS.some(section => section.value === value);
}

export function InvoiceDetailsSettings() {
  const [activeSection, setActiveSection] = useState<DetailSection>("number");

  useTabSelectEvent(TAB_SELECT_EVENTS.details, tab => {
    if (isDetailSection(tab)) {
      setActiveSection(tab);
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <SettingsSectionPicker
        id="details-section"
        label="Field"
        value={activeSection}
        options={DETAIL_SECTIONS}
        onValueChange={value => {
          if (isDetailSection(value)) {
            setActiveSection(value);
          }
        }}
      />
      {activeSection === "number" && <InvoiceNumberSettings />}
      {activeSection === "invoiceDate" && <InvoiceDateSettings />}
      {activeSection === "dueDate" && <InvoiceDueDateSettings />}
    </div>
  );
}

// Number Settings
function InvoiceNumberSettings() {
  return (
    <div className="flex flex-col gap-2">
      <SettingsSection title="Label">
        <NumberLabelStyles />
      </SettingsSection>
      <SettingsSection title="Value">
        <NumberValueStyles />
      </SettingsSection>
    </div>
  );
}

function NumberLabelStyles() {
  const settings = useInvoiceStore(s => s.numberSettings.label);
  const set = useInvoiceStore(s => s.setNumberSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, align: v } }))
      }
      onSizeChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, size: v } }))
      }
      onWeightChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, weight: v } }))
      }
      onColorChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, color: v } }))
      }
    />
  );
}

function NumberValueStyles() {
  const settings = useInvoiceStore(s => s.numberSettings.value);
  const set = useInvoiceStore(s => s.setNumberSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, align: v } }))
      }
      onSizeChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, size: v } }))
      }
      onWeightChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, weight: v } }))
      }
      onColorChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, color: v } }))
      }
    />
  );
}

// Invoice Date Settings
function InvoiceDateSettings() {
  return (
    <div className="flex flex-col gap-2">
      <SettingsSection title="Label">
        <DateLabelStyles />
      </SettingsSection>
      <SettingsSection title="Value">
        <DateValueStyles />
      </SettingsSection>
    </div>
  );
}

function DateLabelStyles() {
  const settings = useInvoiceStore(s => s.invoiceDateSettings.label);
  const set = useInvoiceStore(s => s.setInvoiceDateSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, align: v } }))
      }
      onSizeChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, size: v } }))
      }
      onWeightChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, weight: v } }))
      }
      onColorChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, color: v } }))
      }
    />
  );
}

function DateValueStyles() {
  const settings = useInvoiceStore(s => s.invoiceDateSettings.value);
  const set = useInvoiceStore(s => s.setInvoiceDateSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, align: v } }))
      }
      onSizeChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, size: v } }))
      }
      onWeightChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, weight: v } }))
      }
      onColorChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, color: v } }))
      }
    />
  );
}

// Due Date Settings
function InvoiceDueDateSettings() {
  return (
    <div className="flex flex-col gap-2">
      <SettingsSection title="Label">
        <DueDateLabelStyles />
      </SettingsSection>
      <SettingsSection title="Value">
        <DueDateValueStyles />
      </SettingsSection>
    </div>
  );
}

function DueDateLabelStyles() {
  const settings = useInvoiceStore(s => s.dueDateSettings.label);
  const set = useInvoiceStore(s => s.setDueDateSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, align: v } }))
      }
      onSizeChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, size: v } }))
      }
      onWeightChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, weight: v } }))
      }
      onColorChange={v =>
        set(prev => ({ ...prev, label: { ...prev.label, color: v } }))
      }
    />
  );
}

function DueDateValueStyles() {
  const settings = useInvoiceStore(s => s.dueDateSettings.value);
  const set = useInvoiceStore(s => s.setDueDateSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, align: v } }))
      }
      onSizeChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, size: v } }))
      }
      onWeightChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, weight: v } }))
      }
      onColorChange={v =>
        set(prev => ({ ...prev, value: { ...prev.value, color: v } }))
      }
    />
  );
}
