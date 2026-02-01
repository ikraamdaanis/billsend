import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { Separator } from "components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { TAB_SELECT_EVENTS } from "consts/events";
import {
  useNumberSettingsSlice,
  useInvoiceDateSettingsSlice,
  useDueDateSettingsSlice
} from "stores/invoice-selectors";
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
  const { numberSettings, setNumberSettings } = useNumberSettingsSlice();

  return (
    <AlignSettings
      value={numberSettings.label.align}
      handleInput={value =>
        setNumberSettings({
          ...numberSettings,
          label: { ...numberSettings.label, align: value }
        })
      }
    />
  );
}

function NumberLabelSize() {
  const { numberSettings, setNumberSettings } = useNumberSettingsSlice();

  return (
    <SizeSettings
      value={numberSettings.label.size}
      handleInput={value =>
        setNumberSettings({
          ...numberSettings,
          label: { ...numberSettings.label, size: value }
        })
      }
    />
  );
}

function NumberLabelWeight() {
  const { numberSettings, setNumberSettings } = useNumberSettingsSlice();

  return (
    <FontWeightSettings
      value={numberSettings.label.weight}
      handleInput={value =>
        setNumberSettings({
          ...numberSettings,
          label: { ...numberSettings.label, weight: value }
        })
      }
    />
  );
}

function NumberLabelColor() {
  const { numberSettings, setNumberSettings } = useNumberSettingsSlice();

  return (
    <ColorSettings
      value={numberSettings.label.color}
      handleInput={value =>
        setNumberSettings({
          ...numberSettings,
          label: { ...numberSettings.label, color: value }
        })
      }
    />
  );
}

// Number Value Components
function NumberValueAlign() {
  const { numberSettings, setNumberSettings } = useNumberSettingsSlice();

  return (
    <AlignSettings
      value={numberSettings.value.align}
      handleInput={value =>
        setNumberSettings({
          ...numberSettings,
          value: { ...numberSettings.value, align: value }
        })
      }
    />
  );
}

function NumberValueSize() {
  const { numberSettings, setNumberSettings } = useNumberSettingsSlice();

  return (
    <SizeSettings
      value={numberSettings.value.size}
      handleInput={value =>
        setNumberSettings({
          ...numberSettings,
          value: { ...numberSettings.value, size: value }
        })
      }
    />
  );
}

function NumberValueWeight() {
  const { numberSettings, setNumberSettings } = useNumberSettingsSlice();

  return (
    <FontWeightSettings
      value={numberSettings.value.weight}
      handleInput={value =>
        setNumberSettings({
          ...numberSettings,
          value: { ...numberSettings.value, weight: value }
        })
      }
    />
  );
}

function NumberValueColor() {
  const { numberSettings, setNumberSettings } = useNumberSettingsSlice();

  return (
    <ColorSettings
      value={numberSettings.value.color}
      handleInput={value =>
        setNumberSettings({
          ...numberSettings,
          value: { ...numberSettings.value, color: value }
        })
      }
    />
  );
}

// Invoice Date Label Components
function DateLabelAlign() {
  const { invoiceDateSettings, setInvoiceDateSettings } = useInvoiceDateSettingsSlice();

  return (
    <AlignSettings
      value={invoiceDateSettings.label.align}
      handleInput={value =>
        setInvoiceDateSettings({
          ...invoiceDateSettings,
          label: { ...invoiceDateSettings.label, align: value }
        })
      }
    />
  );
}

function DateLabelSize() {
  const { invoiceDateSettings, setInvoiceDateSettings } = useInvoiceDateSettingsSlice();

  return (
    <SizeSettings
      value={invoiceDateSettings.label.size}
      handleInput={value =>
        setInvoiceDateSettings({
          ...invoiceDateSettings,
          label: { ...invoiceDateSettings.label, size: value }
        })
      }
    />
  );
}

function DateLabelWeight() {
  const { invoiceDateSettings, setInvoiceDateSettings } = useInvoiceDateSettingsSlice();

  return (
    <FontWeightSettings
      value={invoiceDateSettings.label.weight}
      handleInput={value =>
        setInvoiceDateSettings({
          ...invoiceDateSettings,
          label: { ...invoiceDateSettings.label, weight: value }
        })
      }
    />
  );
}

function DateLabelColor() {
  const { invoiceDateSettings, setInvoiceDateSettings } = useInvoiceDateSettingsSlice();

  return (
    <ColorSettings
      value={invoiceDateSettings.label.color}
      handleInput={value =>
        setInvoiceDateSettings({
          ...invoiceDateSettings,
          label: { ...invoiceDateSettings.label, color: value }
        })
      }
    />
  );
}

// Invoice Date Value Components
function DateValueAlign() {
  const { invoiceDateSettings, setInvoiceDateSettings } = useInvoiceDateSettingsSlice();

  return (
    <AlignSettings
      value={invoiceDateSettings.value.align}
      handleInput={value =>
        setInvoiceDateSettings({
          ...invoiceDateSettings,
          value: { ...invoiceDateSettings.value, align: value }
        })
      }
    />
  );
}

function DateValueSize() {
  const { invoiceDateSettings, setInvoiceDateSettings } = useInvoiceDateSettingsSlice();

  return (
    <SizeSettings
      value={invoiceDateSettings.value.size}
      handleInput={value =>
        setInvoiceDateSettings({
          ...invoiceDateSettings,
          value: { ...invoiceDateSettings.value, size: value }
        })
      }
    />
  );
}

function DateValueWeight() {
  const { invoiceDateSettings, setInvoiceDateSettings } = useInvoiceDateSettingsSlice();

  return (
    <FontWeightSettings
      value={invoiceDateSettings.value.weight}
      handleInput={value =>
        setInvoiceDateSettings({
          ...invoiceDateSettings,
          value: { ...invoiceDateSettings.value, weight: value }
        })
      }
    />
  );
}

function DateValueColor() {
  const { invoiceDateSettings, setInvoiceDateSettings } = useInvoiceDateSettingsSlice();

  return (
    <ColorSettings
      value={invoiceDateSettings.value.color}
      handleInput={value =>
        setInvoiceDateSettings({
          ...invoiceDateSettings,
          value: { ...invoiceDateSettings.value, color: value }
        })
      }
    />
  );
}

// Due Date Label Components
function DueDateLabelAlign() {
  const { dueDateSettings, setDueDateSettings } = useDueDateSettingsSlice();

  return (
    <AlignSettings
      value={dueDateSettings.label.align}
      handleInput={value =>
        setDueDateSettings({
          ...dueDateSettings,
          label: { ...dueDateSettings.label, align: value }
        })
      }
    />
  );
}

function DueDateLabelSize() {
  const { dueDateSettings, setDueDateSettings } = useDueDateSettingsSlice();

  return (
    <SizeSettings
      value={dueDateSettings.label.size}
      handleInput={value =>
        setDueDateSettings({
          ...dueDateSettings,
          label: { ...dueDateSettings.label, size: value }
        })
      }
    />
  );
}

function DueDateLabelWeight() {
  const { dueDateSettings, setDueDateSettings } = useDueDateSettingsSlice();

  return (
    <FontWeightSettings
      value={dueDateSettings.label.weight}
      handleInput={value =>
        setDueDateSettings({
          ...dueDateSettings,
          label: { ...dueDateSettings.label, weight: value }
        })
      }
    />
  );
}

function DueDateLabelColor() {
  const { dueDateSettings, setDueDateSettings } = useDueDateSettingsSlice();

  return (
    <ColorSettings
      value={dueDateSettings.label.color}
      handleInput={value =>
        setDueDateSettings({
          ...dueDateSettings,
          label: { ...dueDateSettings.label, color: value }
        })
      }
    />
  );
}

// Due Date Value Components
function DueDateValueAlign() {
  const { dueDateSettings, setDueDateSettings } = useDueDateSettingsSlice();

  return (
    <AlignSettings
      value={dueDateSettings.value.align}
      handleInput={value =>
        setDueDateSettings({
          ...dueDateSettings,
          value: { ...dueDateSettings.value, align: value }
        })
      }
    />
  );
}

function DueDateValueSize() {
  const { dueDateSettings, setDueDateSettings } = useDueDateSettingsSlice();

  return (
    <SizeSettings
      value={dueDateSettings.value.size}
      handleInput={value =>
        setDueDateSettings({
          ...dueDateSettings,
          value: { ...dueDateSettings.value, size: value }
        })
      }
    />
  );
}

function DueDateValueWeight() {
  const { dueDateSettings, setDueDateSettings } = useDueDateSettingsSlice();

  return (
    <FontWeightSettings
      value={dueDateSettings.value.weight}
      handleInput={value =>
        setDueDateSettings({
          ...dueDateSettings,
          value: { ...dueDateSettings.value, weight: value }
        })
      }
    />
  );
}

function DueDateValueColor() {
  const { dueDateSettings, setDueDateSettings } = useDueDateSettingsSlice();

  return (
    <ColorSettings
      value={dueDateSettings.value.color}
      handleInput={value =>
        setDueDateSettings({
          ...dueDateSettings,
          value: { ...dueDateSettings.value, color: value }
        })
      }
    />
  );
}
