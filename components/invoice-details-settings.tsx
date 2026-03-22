import { TextStyleControls } from "components/settings-fields";
import { SettingsSection } from "components/ui/settings-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { TAB_SELECT_EVENTS } from "consts/events";
import { useInvoiceStore } from "stores/invoice-store";
import { useTabSelectEvent } from "hooks/use-tab-select-event";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleActiveTab } from "utils/handle-active-tab";

export function InvoiceDetailsSettings() {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("number");

  const scrollToSelectedTab = useCallback((value: string) => {
    if (!tabsRef.current) return;

    setActiveTab(value);
    handleActiveTab({ tabsRef, value });
  }, []);

  // Handle initial scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToSelectedTab(activeTab);
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab, scrollToSelectedTab]);

  // Listen for custom events to select tabs from outside this component
  useTabSelectEvent(TAB_SELECT_EVENTS.details, scrollToSelectedTab);

  return (
    <Tabs
      defaultValue="number"
      className="w-full"
      onValueChange={value => scrollToSelectedTab(value)}
      value={activeTab}
    >
      <div ref={tabsRef} className="scrollbar-thin overflow-x-auto pb-1">
        <TabsList className="inline-flex w-auto min-w-full">
          <TabsTrigger
            value="number"
            className="min-w-[120px] flex-1"
            data-value="number"
          >
            Invoice Number
          </TabsTrigger>
          <TabsTrigger
            value="invoiceDate"
            className="min-w-[80px] flex-1"
            data-value="invoiceDate"
          >
            Invoice Date
          </TabsTrigger>
          <TabsTrigger
            value="dueDate"
            className="min-w-[90px] flex-1"
            data-value="dueDate"
          >
            Payment Due
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="number" className="mt-4 flex flex-col gap-4">
        <InvoiceNumberSettings />
      </TabsContent>
      <TabsContent value="invoiceDate" className="mt-4 flex flex-col gap-4">
        <InvoiceDateSettings />
      </TabsContent>
      <TabsContent value="dueDate" className="mt-4 flex flex-col gap-4">
        <InvoiceDueDateSettings />
      </TabsContent>
    </Tabs>
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
      onAlignChange={v => set(prev => ({ ...prev, label: { ...prev.label, align: v } }))}
      onSizeChange={v => set(prev => ({ ...prev, label: { ...prev.label, size: v } }))}
      onWeightChange={v => set(prev => ({ ...prev, label: { ...prev.label, weight: v } }))}
      onColorChange={v => set(prev => ({ ...prev, label: { ...prev.label, color: v } }))}
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
      onAlignChange={v => set(prev => ({ ...prev, value: { ...prev.value, align: v } }))}
      onSizeChange={v => set(prev => ({ ...prev, value: { ...prev.value, size: v } }))}
      onWeightChange={v => set(prev => ({ ...prev, value: { ...prev.value, weight: v } }))}
      onColorChange={v => set(prev => ({ ...prev, value: { ...prev.value, color: v } }))}
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
      onAlignChange={v => set(prev => ({ ...prev, label: { ...prev.label, align: v } }))}
      onSizeChange={v => set(prev => ({ ...prev, label: { ...prev.label, size: v } }))}
      onWeightChange={v => set(prev => ({ ...prev, label: { ...prev.label, weight: v } }))}
      onColorChange={v => set(prev => ({ ...prev, label: { ...prev.label, color: v } }))}
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
      onAlignChange={v => set(prev => ({ ...prev, value: { ...prev.value, align: v } }))}
      onSizeChange={v => set(prev => ({ ...prev, value: { ...prev.value, size: v } }))}
      onWeightChange={v => set(prev => ({ ...prev, value: { ...prev.value, weight: v } }))}
      onColorChange={v => set(prev => ({ ...prev, value: { ...prev.value, color: v } }))}
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
      onAlignChange={v => set(prev => ({ ...prev, label: { ...prev.label, align: v } }))}
      onSizeChange={v => set(prev => ({ ...prev, label: { ...prev.label, size: v } }))}
      onWeightChange={v => set(prev => ({ ...prev, label: { ...prev.label, weight: v } }))}
      onColorChange={v => set(prev => ({ ...prev, label: { ...prev.label, color: v } }))}
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
      onAlignChange={v => set(prev => ({ ...prev, value: { ...prev.value, align: v } }))}
      onSizeChange={v => set(prev => ({ ...prev, value: { ...prev.value, size: v } }))}
      onWeightChange={v => set(prev => ({ ...prev, value: { ...prev.value, weight: v } }))}
      onColorChange={v => set(prev => ({ ...prev, value: { ...prev.value, color: v } }))}
    />
  );
}
