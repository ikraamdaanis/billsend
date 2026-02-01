import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { TAB_SELECT_EVENTS } from "consts/events";
import {
  useSubtotalSettingsSlice,
  useTaxSettingsSlice,
  useFeesSettingsSlice,
  useDiscountsSettingsSlice,
  useTotalSettingsSlice
} from "stores/invoice-selectors";
import { useTabSelectEvent } from "hooks/use-tab-select-event";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleActiveTab } from "utils/handle-active-tab";

export function InvoicePricingSettings() {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("subtotal");

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
  useTabSelectEvent(TAB_SELECT_EVENTS.totals, scrollToSelectedTab);

  function handleValueChange(value: string) {
    scrollToSelectedTab(value);
  }

  return (
    <Tabs
      defaultValue="subtotal"
      className="w-full"
      onValueChange={handleValueChange}
      value={activeTab}
    >
      <div ref={tabsRef} className="scrollbar-thin overflow-x-auto pb-1">
        <TabsList className="inline-flex w-auto min-w-full">
          <TabsTrigger value="subtotal" data-value="subtotal">
            Subtotal
          </TabsTrigger>
          <TabsTrigger value="tax" data-value="tax" className="min-w-16">
            Tax
          </TabsTrigger>
          <TabsTrigger value="fees" data-value="fees" className="min-w-16">
            Fees
          </TabsTrigger>
          <TabsTrigger value="discounts" data-value="discounts">
            Discounts
          </TabsTrigger>
          <TabsTrigger value="total" data-value="total">
            Total
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="subtotal" className="mt-4 flex flex-col gap-4">
        <SubtotalSettings />
      </TabsContent>
      <TabsContent value="tax" className="mt-4 flex flex-col gap-4">
        <TaxSettings />
      </TabsContent>
      <TabsContent value="fees" className="mt-4 flex flex-col gap-4">
        <FeesSettings />
      </TabsContent>
      <TabsContent value="discounts" className="mt-4 flex flex-col gap-4">
        <DiscountsSettings />
      </TabsContent>
      <TabsContent value="total" className="mt-4 flex flex-col gap-4">
        <TotalSettings />
      </TabsContent>
    </Tabs>
  );
}

// ===== SUBTOTAL SETTINGS =====
function SubtotalSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Label Settings</h3>
      <div className="flex flex-col gap-2">
        <SubtotalLabelAlign />
        <SubtotalLabelSize />
        <SubtotalLabelWeight />
        <SubtotalLabelColor />
      </div>
      <h3 className="font-medium">Value Settings</h3>
      <div className="flex flex-col gap-2">
        <SubtotalValueAlign />
        <SubtotalValueSize />
        <SubtotalValueWeight />
        <SubtotalValueColor />
      </div>
    </div>
  );
}

function SubtotalLabelAlign() {
  const { subtotalSettings, setSubtotalSettings } = useSubtotalSettingsSlice();

  return (
    <AlignSettings
      value={subtotalSettings.label.align}
      handleInput={value =>
        setSubtotalSettings({
          ...subtotalSettings,
          label: { ...subtotalSettings.label, align: value }
        })
      }
    />
  );
}

function SubtotalLabelSize() {
  const { subtotalSettings, setSubtotalSettings } = useSubtotalSettingsSlice();

  return (
    <SizeSettings
      value={subtotalSettings.label.size}
      handleInput={value =>
        setSubtotalSettings({
          ...subtotalSettings,
          label: { ...subtotalSettings.label, size: value }
        })
      }
    />
  );
}

function SubtotalLabelWeight() {
  const { subtotalSettings, setSubtotalSettings } = useSubtotalSettingsSlice();

  return (
    <FontWeightSettings
      value={subtotalSettings.label.weight}
      handleInput={value =>
        setSubtotalSettings({
          ...subtotalSettings,
          label: { ...subtotalSettings.label, weight: value }
        })
      }
    />
  );
}

function SubtotalLabelColor() {
  const { subtotalSettings, setSubtotalSettings } = useSubtotalSettingsSlice();

  return (
    <ColorSettings
      value={subtotalSettings.label.color}
      handleInput={value =>
        setSubtotalSettings({
          ...subtotalSettings,
          label: { ...subtotalSettings.label, color: value }
        })
      }
    />
  );
}

function SubtotalValueAlign() {
  const { subtotalSettings, setSubtotalSettings } = useSubtotalSettingsSlice();

  return (
    <AlignSettings
      value={subtotalSettings.value.align}
      handleInput={value =>
        setSubtotalSettings({
          ...subtotalSettings,
          value: { ...subtotalSettings.value, align: value }
        })
      }
    />
  );
}

function SubtotalValueSize() {
  const { subtotalSettings, setSubtotalSettings } = useSubtotalSettingsSlice();

  return (
    <SizeSettings
      value={subtotalSettings.value.size}
      handleInput={value =>
        setSubtotalSettings({
          ...subtotalSettings,
          value: { ...subtotalSettings.value, size: value }
        })
      }
    />
  );
}

function SubtotalValueWeight() {
  const { subtotalSettings, setSubtotalSettings } = useSubtotalSettingsSlice();

  return (
    <FontWeightSettings
      value={subtotalSettings.value.weight}
      handleInput={value =>
        setSubtotalSettings({
          ...subtotalSettings,
          value: { ...subtotalSettings.value, weight: value }
        })
      }
    />
  );
}

function SubtotalValueColor() {
  const { subtotalSettings, setSubtotalSettings } = useSubtotalSettingsSlice();

  return (
    <ColorSettings
      value={subtotalSettings.value.color}
      handleInput={value =>
        setSubtotalSettings({
          ...subtotalSettings,
          value: { ...subtotalSettings.value, color: value }
        })
      }
    />
  );
}

// ===== TAX SETTINGS =====
function TaxSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Label Settings</h3>
      <div className="flex flex-col gap-2">
        <TaxLabelAlign />
        <TaxLabelSize />
        <TaxLabelWeight />
        <TaxLabelColor />
      </div>
      <h3 className="font-medium">Value Settings</h3>
      <div className="flex flex-col gap-2">
        <TaxValueAlign />
        <TaxValueSize />
        <TaxValueWeight />
        <TaxValueColor />
      </div>
    </div>
  );
}

function TaxLabelAlign() {
  const { taxSettings, setTaxSettings } = useTaxSettingsSlice();

  return (
    <AlignSettings
      value={taxSettings.label.align}
      handleInput={value =>
        setTaxSettings({
          ...taxSettings,
          label: { ...taxSettings.label, align: value }
        })
      }
    />
  );
}

function TaxLabelSize() {
  const { taxSettings, setTaxSettings } = useTaxSettingsSlice();

  return (
    <SizeSettings
      value={taxSettings.label.size}
      handleInput={value =>
        setTaxSettings({
          ...taxSettings,
          label: { ...taxSettings.label, size: value }
        })
      }
    />
  );
}

function TaxLabelWeight() {
  const { taxSettings, setTaxSettings } = useTaxSettingsSlice();

  return (
    <FontWeightSettings
      value={taxSettings.label.weight}
      handleInput={value =>
        setTaxSettings({
          ...taxSettings,
          label: { ...taxSettings.label, weight: value }
        })
      }
    />
  );
}

function TaxLabelColor() {
  const { taxSettings, setTaxSettings } = useTaxSettingsSlice();

  return (
    <ColorSettings
      value={taxSettings.label.color}
      handleInput={value =>
        setTaxSettings({
          ...taxSettings,
          label: { ...taxSettings.label, color: value }
        })
      }
    />
  );
}

function TaxValueAlign() {
  const { taxSettings, setTaxSettings } = useTaxSettingsSlice();

  return (
    <AlignSettings
      value={taxSettings.value.align}
      handleInput={value =>
        setTaxSettings({
          ...taxSettings,
          value: { ...taxSettings.value, align: value }
        })
      }
    />
  );
}

function TaxValueSize() {
  const { taxSettings, setTaxSettings } = useTaxSettingsSlice();

  return (
    <SizeSettings
      value={taxSettings.value.size}
      handleInput={value =>
        setTaxSettings({
          ...taxSettings,
          value: { ...taxSettings.value, size: value }
        })
      }
    />
  );
}

function TaxValueWeight() {
  const { taxSettings, setTaxSettings } = useTaxSettingsSlice();

  return (
    <FontWeightSettings
      value={taxSettings.value.weight}
      handleInput={value =>
        setTaxSettings({
          ...taxSettings,
          value: { ...taxSettings.value, weight: value }
        })
      }
    />
  );
}

function TaxValueColor() {
  const { taxSettings, setTaxSettings } = useTaxSettingsSlice();

  return (
    <ColorSettings
      value={taxSettings.value.color}
      handleInput={value =>
        setTaxSettings({
          ...taxSettings,
          value: { ...taxSettings.value, color: value }
        })
      }
    />
  );
}

// ===== FEES SETTINGS =====
function FeesSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Label Settings</h3>
      <div className="flex flex-col gap-2">
        <FeesLabelAlign />
        <FeesLabelSize />
        <FeesLabelWeight />
        <FeesLabelColor />
      </div>
      <h3 className="font-medium">Value Settings</h3>
      <div className="flex flex-col gap-2">
        <FeesValueAlign />
        <FeesValueSize />
        <FeesValueWeight />
        <FeesValueColor />
      </div>
    </div>
  );
}

function FeesLabelAlign() {
  const { feesSettings, setFeesSettings } = useFeesSettingsSlice();

  return (
    <AlignSettings
      value={feesSettings.label.align}
      handleInput={value =>
        setFeesSettings({
          ...feesSettings,
          label: { ...feesSettings.label, align: value }
        })
      }
    />
  );
}

function FeesLabelSize() {
  const { feesSettings, setFeesSettings } = useFeesSettingsSlice();

  return (
    <SizeSettings
      value={feesSettings.label.size}
      handleInput={value =>
        setFeesSettings({
          ...feesSettings,
          label: { ...feesSettings.label, size: value }
        })
      }
    />
  );
}

function FeesLabelWeight() {
  const { feesSettings, setFeesSettings } = useFeesSettingsSlice();

  return (
    <FontWeightSettings
      value={feesSettings.label.weight}
      handleInput={value =>
        setFeesSettings({
          ...feesSettings,
          label: { ...feesSettings.label, weight: value }
        })
      }
    />
  );
}

function FeesLabelColor() {
  const { feesSettings, setFeesSettings } = useFeesSettingsSlice();

  return (
    <ColorSettings
      value={feesSettings.label.color}
      handleInput={value =>
        setFeesSettings({
          ...feesSettings,
          label: { ...feesSettings.label, color: value }
        })
      }
    />
  );
}

function FeesValueAlign() {
  const { feesSettings, setFeesSettings } = useFeesSettingsSlice();

  return (
    <AlignSettings
      value={feesSettings.value.align}
      handleInput={value =>
        setFeesSettings({
          ...feesSettings,
          value: { ...feesSettings.value, align: value }
        })
      }
    />
  );
}

function FeesValueSize() {
  const { feesSettings, setFeesSettings } = useFeesSettingsSlice();

  return (
    <SizeSettings
      value={feesSettings.value.size}
      handleInput={value =>
        setFeesSettings({
          ...feesSettings,
          value: { ...feesSettings.value, size: value }
        })
      }
    />
  );
}

function FeesValueWeight() {
  const { feesSettings, setFeesSettings } = useFeesSettingsSlice();

  return (
    <FontWeightSettings
      value={feesSettings.value.weight}
      handleInput={value =>
        setFeesSettings({
          ...feesSettings,
          value: { ...feesSettings.value, weight: value }
        })
      }
    />
  );
}

function FeesValueColor() {
  const { feesSettings, setFeesSettings } = useFeesSettingsSlice();

  return (
    <ColorSettings
      value={feesSettings.value.color}
      handleInput={value =>
        setFeesSettings({
          ...feesSettings,
          value: { ...feesSettings.value, color: value }
        })
      }
    />
  );
}

// ===== DISCOUNTS SETTINGS =====
function DiscountsSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Label Settings</h3>
      <div className="flex flex-col gap-2">
        <DiscountsLabelAlign />
        <DiscountsLabelSize />
        <DiscountsLabelWeight />
        <DiscountsLabelColor />
      </div>
      <h3 className="font-medium">Value Settings</h3>
      <div className="flex flex-col gap-2">
        <DiscountsValueAlign />
        <DiscountsValueSize />
        <DiscountsValueWeight />
        <DiscountsValueColor />
      </div>
    </div>
  );
}

function DiscountsLabelAlign() {
  const { discountsSettings, setDiscountsSettings } = useDiscountsSettingsSlice();

  return (
    <AlignSettings
      value={discountsSettings.label.align}
      handleInput={value =>
        setDiscountsSettings({
          ...discountsSettings,
          label: { ...discountsSettings.label, align: value }
        })
      }
    />
  );
}

function DiscountsLabelSize() {
  const { discountsSettings, setDiscountsSettings } = useDiscountsSettingsSlice();

  return (
    <SizeSettings
      value={discountsSettings.label.size}
      handleInput={value =>
        setDiscountsSettings({
          ...discountsSettings,
          label: { ...discountsSettings.label, size: value }
        })
      }
    />
  );
}

function DiscountsLabelWeight() {
  const { discountsSettings, setDiscountsSettings } = useDiscountsSettingsSlice();

  return (
    <FontWeightSettings
      value={discountsSettings.label.weight}
      handleInput={value =>
        setDiscountsSettings({
          ...discountsSettings,
          label: { ...discountsSettings.label, weight: value }
        })
      }
    />
  );
}

function DiscountsLabelColor() {
  const { discountsSettings, setDiscountsSettings } = useDiscountsSettingsSlice();

  return (
    <ColorSettings
      value={discountsSettings.label.color}
      handleInput={value =>
        setDiscountsSettings({
          ...discountsSettings,
          label: { ...discountsSettings.label, color: value }
        })
      }
    />
  );
}

function DiscountsValueAlign() {
  const { discountsSettings, setDiscountsSettings } = useDiscountsSettingsSlice();

  return (
    <AlignSettings
      value={discountsSettings.value.align}
      handleInput={value =>
        setDiscountsSettings({
          ...discountsSettings,
          value: { ...discountsSettings.value, align: value }
        })
      }
    />
  );
}

function DiscountsValueSize() {
  const { discountsSettings, setDiscountsSettings } = useDiscountsSettingsSlice();

  return (
    <SizeSettings
      value={discountsSettings.value.size}
      handleInput={value =>
        setDiscountsSettings({
          ...discountsSettings,
          value: { ...discountsSettings.value, size: value }
        })
      }
    />
  );
}

function DiscountsValueWeight() {
  const { discountsSettings, setDiscountsSettings } = useDiscountsSettingsSlice();

  return (
    <FontWeightSettings
      value={discountsSettings.value.weight}
      handleInput={value =>
        setDiscountsSettings({
          ...discountsSettings,
          value: { ...discountsSettings.value, weight: value }
        })
      }
    />
  );
}

function DiscountsValueColor() {
  const { discountsSettings, setDiscountsSettings } = useDiscountsSettingsSlice();

  return (
    <ColorSettings
      value={discountsSettings.value.color}
      handleInput={value =>
        setDiscountsSettings({
          ...discountsSettings,
          value: { ...discountsSettings.value, color: value }
        })
      }
    />
  );
}

// ===== TOTAL SETTINGS =====
function TotalSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Label Settings</h3>
      <div className="flex flex-col gap-2">
        <TotalLabelAlign />
        <TotalLabelSize />
        <TotalLabelWeight />
        <TotalLabelColor />
      </div>
      <h3 className="font-medium">Value Settings</h3>
      <div className="flex flex-col gap-2">
        <TotalValueAlign />
        <TotalValueSize />
        <TotalValueWeight />
        <TotalValueColor />
      </div>
    </div>
  );
}

function TotalLabelAlign() {
  const { totalSettings, setTotalSettings } = useTotalSettingsSlice();

  return (
    <AlignSettings
      value={totalSettings.label.align}
      handleInput={value =>
        setTotalSettings({
          ...totalSettings,
          label: { ...totalSettings.label, align: value }
        })
      }
    />
  );
}

function TotalLabelSize() {
  const { totalSettings, setTotalSettings } = useTotalSettingsSlice();

  return (
    <SizeSettings
      value={totalSettings.label.size}
      handleInput={value =>
        setTotalSettings({
          ...totalSettings,
          label: { ...totalSettings.label, size: value }
        })
      }
    />
  );
}

function TotalLabelWeight() {
  const { totalSettings, setTotalSettings } = useTotalSettingsSlice();

  return (
    <FontWeightSettings
      value={totalSettings.label.weight}
      handleInput={value =>
        setTotalSettings({
          ...totalSettings,
          label: { ...totalSettings.label, weight: value }
        })
      }
    />
  );
}

function TotalLabelColor() {
  const { totalSettings, setTotalSettings } = useTotalSettingsSlice();

  return (
    <ColorSettings
      value={totalSettings.label.color}
      handleInput={value =>
        setTotalSettings({
          ...totalSettings,
          label: { ...totalSettings.label, color: value }
        })
      }
    />
  );
}

function TotalValueAlign() {
  const { totalSettings, setTotalSettings } = useTotalSettingsSlice();

  return (
    <AlignSettings
      value={totalSettings.value.align}
      handleInput={value =>
        setTotalSettings({
          ...totalSettings,
          value: { ...totalSettings.value, align: value }
        })
      }
    />
  );
}

function TotalValueSize() {
  const { totalSettings, setTotalSettings } = useTotalSettingsSlice();

  return (
    <SizeSettings
      value={totalSettings.value.size}
      handleInput={value =>
        setTotalSettings({
          ...totalSettings,
          value: { ...totalSettings.value, size: value }
        })
      }
    />
  );
}

function TotalValueWeight() {
  const { totalSettings, setTotalSettings } = useTotalSettingsSlice();

  return (
    <FontWeightSettings
      value={totalSettings.value.weight}
      handleInput={value =>
        setTotalSettings({
          ...totalSettings,
          value: { ...totalSettings.value, weight: value }
        })
      }
    />
  );
}

function TotalValueColor() {
  const { totalSettings, setTotalSettings } = useTotalSettingsSlice();

  return (
    <ColorSettings
      value={totalSettings.value.color}
      handleInput={value =>
        setTotalSettings({
          ...totalSettings,
          value: { ...totalSettings.value, color: value }
        })
      }
    />
  );
}
