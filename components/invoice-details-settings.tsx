import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { Separator } from "components/ui/separator";
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
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium">Label settings</h3>
      <div className="flex flex-col gap-2">
        <NumberLabelAlign />
        <NumberLabelSize />
        <NumberLabelWeight />
        <NumberLabelColor />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Value settings</h3>
      <div className="flex flex-col gap-2">
        <NumberValueAlign />
        <NumberValueSize />
        <NumberValueWeight />
        <NumberValueColor />
      </div>
    </div>
  );
}

// Invoice Date Settings
function InvoiceDateSettings() {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <h3 className="font-medium">Label Settings</h3>
      <div className="flex flex-col gap-2">
        <DateLabelAlign />
        <DateLabelSize />
        <DateLabelWeight />
        <DateLabelColor />
      </div>
      <h3 className="font-medium">Value Settings</h3>
      <div className="flex flex-col gap-2">
        <DateValueAlign />
        <DateValueSize />
        <DateValueWeight />
        <DateValueColor />
      </div>
    </div>
  );
}

// Due Date Settings
function InvoiceDueDateSettings() {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <h3 className="font-medium">Label Settings</h3>
      <div className="flex flex-col gap-2">
        <DueDateLabelAlign />
        <DueDateLabelSize />
        <DueDateLabelWeight />
        <DueDateLabelColor />
      </div>
      <h3 className="font-medium">Value Settings</h3>
      <div className="flex flex-col gap-2">
        <DueDateValueAlign />
        <DueDateValueSize />
        <DueDateValueWeight />
        <DueDateValueColor />
      </div>
    </div>
  );
}

// Number Label Components
function NumberLabelAlign() {
  const align = useInvoiceStore(state => state.numberSettings.label.align);
  const setNumberSettings = useInvoiceStore(state => state.setNumberSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setNumberSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function NumberLabelSize() {
  const size = useInvoiceStore(state => state.numberSettings.label.size);
  const setNumberSettings = useInvoiceStore(state => state.setNumberSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setNumberSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function NumberLabelWeight() {
  const weight = useInvoiceStore(state => state.numberSettings.label.weight);
  const setNumberSettings = useInvoiceStore(state => state.setNumberSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setNumberSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function NumberLabelColor() {
  const color = useInvoiceStore(state => state.numberSettings.label.color);
  const setNumberSettings = useInvoiceStore(state => state.setNumberSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setNumberSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

// Number Value Components
function NumberValueAlign() {
  const align = useInvoiceStore(state => state.numberSettings.value.align);
  const setNumberSettings = useInvoiceStore(state => state.setNumberSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setNumberSettings(prev => ({
          ...prev,
          value: { ...prev.value, align: value }
        }))
      }
    />
  );
}

function NumberValueSize() {
  const size = useInvoiceStore(state => state.numberSettings.value.size);
  const setNumberSettings = useInvoiceStore(state => state.setNumberSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setNumberSettings(prev => ({
          ...prev,
          value: { ...prev.value, size: value }
        }))
      }
    />
  );
}

function NumberValueWeight() {
  const weight = useInvoiceStore(state => state.numberSettings.value.weight);
  const setNumberSettings = useInvoiceStore(state => state.setNumberSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setNumberSettings(prev => ({
          ...prev,
          value: { ...prev.value, weight: value }
        }))
      }
    />
  );
}

function NumberValueColor() {
  const color = useInvoiceStore(state => state.numberSettings.value.color);
  const setNumberSettings = useInvoiceStore(state => state.setNumberSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setNumberSettings(prev => ({
          ...prev,
          value: { ...prev.value, color: value }
        }))
      }
    />
  );
}

// Invoice Date Label Components
function DateLabelAlign() {
  const align = useInvoiceStore(state => state.invoiceDateSettings.label.align);
  const setInvoiceDateSettings = useInvoiceStore(
    state => state.setInvoiceDateSettings
  );

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setInvoiceDateSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function DateLabelSize() {
  const size = useInvoiceStore(state => state.invoiceDateSettings.label.size);
  const setInvoiceDateSettings = useInvoiceStore(
    state => state.setInvoiceDateSettings
  );

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setInvoiceDateSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function DateLabelWeight() {
  const weight = useInvoiceStore(
    state => state.invoiceDateSettings.label.weight
  );
  const setInvoiceDateSettings = useInvoiceStore(
    state => state.setInvoiceDateSettings
  );

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setInvoiceDateSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function DateLabelColor() {
  const color = useInvoiceStore(state => state.invoiceDateSettings.label.color);
  const setInvoiceDateSettings = useInvoiceStore(
    state => state.setInvoiceDateSettings
  );

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setInvoiceDateSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

// Invoice Date Value Components
function DateValueAlign() {
  const align = useInvoiceStore(state => state.invoiceDateSettings.value.align);
  const setInvoiceDateSettings = useInvoiceStore(
    state => state.setInvoiceDateSettings
  );

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setInvoiceDateSettings(prev => ({
          ...prev,
          value: { ...prev.value, align: value }
        }))
      }
    />
  );
}

function DateValueSize() {
  const size = useInvoiceStore(state => state.invoiceDateSettings.value.size);
  const setInvoiceDateSettings = useInvoiceStore(
    state => state.setInvoiceDateSettings
  );

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setInvoiceDateSettings(prev => ({
          ...prev,
          value: { ...prev.value, size: value }
        }))
      }
    />
  );
}

function DateValueWeight() {
  const weight = useInvoiceStore(
    state => state.invoiceDateSettings.value.weight
  );
  const setInvoiceDateSettings = useInvoiceStore(
    state => state.setInvoiceDateSettings
  );

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setInvoiceDateSettings(prev => ({
          ...prev,
          value: { ...prev.value, weight: value }
        }))
      }
    />
  );
}

function DateValueColor() {
  const color = useInvoiceStore(state => state.invoiceDateSettings.value.color);
  const setInvoiceDateSettings = useInvoiceStore(
    state => state.setInvoiceDateSettings
  );

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setInvoiceDateSettings(prev => ({
          ...prev,
          value: { ...prev.value, color: value }
        }))
      }
    />
  );
}

// Due Date Label Components
function DueDateLabelAlign() {
  const align = useInvoiceStore(state => state.dueDateSettings.label.align);
  const setDueDateSettings = useInvoiceStore(state => state.setDueDateSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setDueDateSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function DueDateLabelSize() {
  const size = useInvoiceStore(state => state.dueDateSettings.label.size);
  const setDueDateSettings = useInvoiceStore(state => state.setDueDateSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setDueDateSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function DueDateLabelWeight() {
  const weight = useInvoiceStore(state => state.dueDateSettings.label.weight);
  const setDueDateSettings = useInvoiceStore(state => state.setDueDateSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setDueDateSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function DueDateLabelColor() {
  const color = useInvoiceStore(state => state.dueDateSettings.label.color);
  const setDueDateSettings = useInvoiceStore(state => state.setDueDateSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setDueDateSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

// Due Date Value Components
function DueDateValueAlign() {
  const align = useInvoiceStore(state => state.dueDateSettings.value.align);
  const setDueDateSettings = useInvoiceStore(state => state.setDueDateSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setDueDateSettings(prev => ({
          ...prev,
          value: { ...prev.value, align: value }
        }))
      }
    />
  );
}

function DueDateValueSize() {
  const size = useInvoiceStore(state => state.dueDateSettings.value.size);
  const setDueDateSettings = useInvoiceStore(state => state.setDueDateSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setDueDateSettings(prev => ({
          ...prev,
          value: { ...prev.value, size: value }
        }))
      }
    />
  );
}

function DueDateValueWeight() {
  const weight = useInvoiceStore(state => state.dueDateSettings.value.weight);
  const setDueDateSettings = useInvoiceStore(state => state.setDueDateSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setDueDateSettings(prev => ({
          ...prev,
          value: { ...prev.value, weight: value }
        }))
      }
    />
  );
}

function DueDateValueColor() {
  const color = useInvoiceStore(state => state.dueDateSettings.value.color);
  const setDueDateSettings = useInvoiceStore(state => state.setDueDateSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setDueDateSettings(prev => ({
          ...prev,
          value: { ...prev.value, color: value }
        }))
      }
    />
  );
}
