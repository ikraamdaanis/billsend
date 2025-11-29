import { Separator } from "components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "features/new/components/settings-fields";
import {
  dueDateSettingsAtom,
  invoiceDateSettingsAtom,
  numberSettingsAtom,
  updateDueDateSettingsAtom,
  updateInvoiceDateSettingsAtom,
  updateNumberSettingsAtom
} from "features/new/state";
import { handleActiveTab } from "features/new/utils/handle-active-tab";
import { useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo, useEffect, useRef, useState } from "react";

export function InvoiceDetailsSettings() {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("number");

  function scrollToSelectedTab(value: string) {
    if (!tabsRef.current) return;

    setActiveTab(value);
    handleActiveTab({ tabsRef, value });
  }

  // Handle initial scroll
  useEffect(() => {
    // Delay the initial scroll to ensure the component is fully rendered
    const timer = setTimeout(() => {
      scrollToSelectedTab(activeTab);
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab]);

  // Listen for custom events to select tabs from outside this component
  useEffect(() => {
    function handleSelectDetailsTab(event: Event) {
      const customEvent = event as CustomEvent<{
        tab: string;
      }>;

      if (customEvent.detail.tab) {
        scrollToSelectedTab(customEvent.detail.tab);
      }
    }

    window.addEventListener("select-details-tab", handleSelectDetailsTab);

    return () => {
      window.removeEventListener("select-details-tab", handleSelectDetailsTab);
    };
  }, []);

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
const InvoiceNumberSettings = memo(function InvoiceNumberSettings() {
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
});

// Invoice Date Settings
const InvoiceDateSettings = memo(function InvoiceDateSettings() {
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
});

// Due Date Settings
const InvoiceDueDateSettings = memo(function InvoiceDueDateSettings() {
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
});

// Number Label Atoms and Components
const numberLabelAlignAtom = selectAtom(
  numberSettingsAtom,
  settings => settings.label.align
);
const numberLabelSizeAtom = selectAtom(
  numberSettingsAtom,
  settings => settings.label.size
);
const numberLabelWeightAtom = selectAtom(
  numberSettingsAtom,
  settings => settings.label.weight
);
const numberLabelColorAtom = selectAtom(
  numberSettingsAtom,
  settings => settings.label.color
);

const NumberLabelAlign = memo(function NumberLabelAlign() {
  const align = useAtomValue(numberLabelAlignAtom);
  const updateNumberSettings = useSetAtom(updateNumberSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateNumberSettings({ label: { align: value } })}
    />
  );
});

const NumberLabelSize = memo(function NumberLabelSize() {
  const size = useAtomValue(numberLabelSizeAtom);
  const updateNumberSettings = useSetAtom(updateNumberSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateNumberSettings({ label: { size: value } })}
    />
  );
});

const NumberLabelWeight = memo(function NumberLabelWeight() {
  const weight = useAtomValue(numberLabelWeightAtom);
  const updateNumberSettings = useSetAtom(updateNumberSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateNumberSettings({ label: { weight: value } })}
    />
  );
});

const NumberLabelColor = memo(function NumberLabelColor() {
  const color = useAtomValue(numberLabelColorAtom);
  const updateNumberSettings = useSetAtom(updateNumberSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateNumberSettings({ label: { color: value } })}
    />
  );
});

// Number Value Atoms and Components
const numberValueAlignAtom = selectAtom(
  numberSettingsAtom,
  settings => settings.value.align
);
const numberValueSizeAtom = selectAtom(
  numberSettingsAtom,
  settings => settings.value.size
);
const numberValueWeightAtom = selectAtom(
  numberSettingsAtom,
  settings => settings.value.weight
);
const numberValueColorAtom = selectAtom(
  numberSettingsAtom,
  settings => settings.value.color
);

const NumberValueAlign = memo(function NumberValueAlign() {
  const align = useAtomValue(numberValueAlignAtom);
  const updateNumberSettings = useSetAtom(updateNumberSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateNumberSettings({ value: { align: value } })}
    />
  );
});

const NumberValueSize = memo(function NumberValueSize() {
  const size = useAtomValue(numberValueSizeAtom);
  const updateNumberSettings = useSetAtom(updateNumberSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateNumberSettings({ value: { size: value } })}
    />
  );
});

const NumberValueWeight = memo(function NumberValueWeight() {
  const weight = useAtomValue(numberValueWeightAtom);
  const updateNumberSettings = useSetAtom(updateNumberSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateNumberSettings({ value: { weight: value } })}
    />
  );
});

const NumberValueColor = memo(function NumberValueColor() {
  const color = useAtomValue(numberValueColorAtom);
  const updateNumberSettings = useSetAtom(updateNumberSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateNumberSettings({ value: { color: value } })}
    />
  );
});

// Invoice Date Label Atoms and Components
const dateLabelAlignAtom = selectAtom(
  invoiceDateSettingsAtom,
  settings => settings.label.align
);
const dateLabelSizeAtom = selectAtom(
  invoiceDateSettingsAtom,
  settings => settings.label.size
);
const dateLabelWeightAtom = selectAtom(
  invoiceDateSettingsAtom,
  settings => settings.label.weight
);
const dateLabelColorAtom = selectAtom(
  invoiceDateSettingsAtom,
  settings => settings.label.color
);

const DateLabelAlign = memo(function DateLabelAlign() {
  const align = useAtomValue(dateLabelAlignAtom);
  const updateDateSettings = useSetAtom(updateInvoiceDateSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateDateSettings({ label: { align: value } })}
    />
  );
});

const DateLabelSize = memo(function DateLabelSize() {
  const size = useAtomValue(dateLabelSizeAtom);
  const updateDateSettings = useSetAtom(updateInvoiceDateSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateDateSettings({ label: { size: value } })}
    />
  );
});

const DateLabelWeight = memo(function DateLabelWeight() {
  const weight = useAtomValue(dateLabelWeightAtom);
  const updateDateSettings = useSetAtom(updateInvoiceDateSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateDateSettings({ label: { weight: value } })}
    />
  );
});

const DateLabelColor = memo(function DateLabelColor() {
  const color = useAtomValue(dateLabelColorAtom);
  const updateDateSettings = useSetAtom(updateInvoiceDateSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateDateSettings({ label: { color: value } })}
    />
  );
});

const dateValueAlignAtom = selectAtom(
  invoiceDateSettingsAtom,
  settings => settings.value.align
);
const dateValueSizeAtom = selectAtom(
  invoiceDateSettingsAtom,
  settings => settings.value.size
);
const dateValueWeightAtom = selectAtom(
  invoiceDateSettingsAtom,
  settings => settings.value.weight
);
const dateValueColorAtom = selectAtom(
  invoiceDateSettingsAtom,
  settings => settings.value.color
);

const DateValueAlign = memo(function DateValueAlign() {
  const align = useAtomValue(dateValueAlignAtom);
  const updateDateSettings = useSetAtom(updateInvoiceDateSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateDateSettings({ value: { align: value } })}
    />
  );
});

const DateValueSize = memo(function DateValueSize() {
  const size = useAtomValue(dateValueSizeAtom);
  const updateDateSettings = useSetAtom(updateInvoiceDateSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateDateSettings({ value: { size: value } })}
    />
  );
});

const DateValueWeight = memo(function DateValueWeight() {
  const weight = useAtomValue(dateValueWeightAtom);
  const updateDateSettings = useSetAtom(updateInvoiceDateSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateDateSettings({ value: { weight: value } })}
    />
  );
});

const DateValueColor = memo(function DateValueColor() {
  const color = useAtomValue(dateValueColorAtom);
  const updateDateSettings = useSetAtom(updateInvoiceDateSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateDateSettings({ value: { color: value } })}
    />
  );
});

// Due Date Label Atoms and Components
const dueDateLabelAlignAtom = selectAtom(
  dueDateSettingsAtom,
  settings => settings.label.align
);
const dueDateLabelSizeAtom = selectAtom(
  dueDateSettingsAtom,
  settings => settings.label.size
);
const dueDateLabelWeightAtom = selectAtom(
  dueDateSettingsAtom,
  settings => settings.label.weight
);
const dueDateLabelColorAtom = selectAtom(
  dueDateSettingsAtom,
  settings => settings.label.color
);

const DueDateLabelAlign = memo(function DueDateLabelAlign() {
  const align = useAtomValue(dueDateLabelAlignAtom);
  const updateDueDateSettings = useSetAtom(updateDueDateSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateDueDateSettings({ label: { align: value } })}
    />
  );
});

const DueDateLabelSize = memo(function DueDateLabelSize() {
  const size = useAtomValue(dueDateLabelSizeAtom);
  const updateDueDateSettings = useSetAtom(updateDueDateSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateDueDateSettings({ label: { size: value } })}
    />
  );
});

const DueDateLabelWeight = memo(function DueDateLabelWeight() {
  const weight = useAtomValue(dueDateLabelWeightAtom);
  const updateDueDateSettings = useSetAtom(updateDueDateSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateDueDateSettings({ label: { weight: value } })}
    />
  );
});

const DueDateLabelColor = memo(function DueDateLabelColor() {
  const color = useAtomValue(dueDateLabelColorAtom);
  const updateDueDateSettings = useSetAtom(updateDueDateSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateDueDateSettings({ label: { color: value } })}
    />
  );
});

// Due Date Value Atoms and Components
const dueDateValueAlignAtom = selectAtom(
  dueDateSettingsAtom,
  settings => settings.value.align
);
const dueDateValueSizeAtom = selectAtom(
  dueDateSettingsAtom,
  settings => settings.value.size
);
const dueDateValueWeightAtom = selectAtom(
  dueDateSettingsAtom,
  settings => settings.value.weight
);
const dueDateValueColorAtom = selectAtom(
  dueDateSettingsAtom,
  settings => settings.value.color
);

const DueDateValueAlign = memo(function DueDateValueAlign() {
  const align = useAtomValue(dueDateValueAlignAtom);
  const updateDueDateSettings = useSetAtom(updateDueDateSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateDueDateSettings({ value: { align: value } })}
    />
  );
});

const DueDateValueSize = memo(function DueDateValueSize() {
  const size = useAtomValue(dueDateValueSizeAtom);
  const updateDueDateSettings = useSetAtom(updateDueDateSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateDueDateSettings({ value: { size: value } })}
    />
  );
});

const DueDateValueWeight = memo(function DueDateValueWeight() {
  const weight = useAtomValue(dueDateValueWeightAtom);
  const updateDueDateSettings = useSetAtom(updateDueDateSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateDueDateSettings({ value: { weight: value } })}
    />
  );
});

const DueDateValueColor = memo(function DueDateValueColor() {
  const color = useAtomValue(dueDateValueColorAtom);
  const updateDueDateSettings = useSetAtom(updateDueDateSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateDueDateSettings({ value: { color: value } })}
    />
  );
});
