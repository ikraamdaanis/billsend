import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { TAB_SELECT_EVENTS } from "consts/events";
import { useInvoiceStore } from "stores/invoice-store";
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
  const align = useInvoiceStore(state => state.subtotalSettings.label.align);
  const setSubtotalSettings = useInvoiceStore(
    state => state.setSubtotalSettings
  );

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setSubtotalSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function SubtotalLabelSize() {
  const size = useInvoiceStore(state => state.subtotalSettings.label.size);
  const setSubtotalSettings = useInvoiceStore(
    state => state.setSubtotalSettings
  );

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setSubtotalSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function SubtotalLabelWeight() {
  const weight = useInvoiceStore(state => state.subtotalSettings.label.weight);
  const setSubtotalSettings = useInvoiceStore(
    state => state.setSubtotalSettings
  );

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setSubtotalSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function SubtotalLabelColor() {
  const color = useInvoiceStore(state => state.subtotalSettings.label.color);
  const setSubtotalSettings = useInvoiceStore(
    state => state.setSubtotalSettings
  );

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setSubtotalSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

function SubtotalValueAlign() {
  const align = useInvoiceStore(state => state.subtotalSettings.value.align);
  const setSubtotalSettings = useInvoiceStore(
    state => state.setSubtotalSettings
  );

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setSubtotalSettings(prev => ({
          ...prev,
          value: { ...prev.value, align: value }
        }))
      }
    />
  );
}

function SubtotalValueSize() {
  const size = useInvoiceStore(state => state.subtotalSettings.value.size);
  const setSubtotalSettings = useInvoiceStore(
    state => state.setSubtotalSettings
  );

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setSubtotalSettings(prev => ({
          ...prev,
          value: { ...prev.value, size: value }
        }))
      }
    />
  );
}

function SubtotalValueWeight() {
  const weight = useInvoiceStore(state => state.subtotalSettings.value.weight);
  const setSubtotalSettings = useInvoiceStore(
    state => state.setSubtotalSettings
  );

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setSubtotalSettings(prev => ({
          ...prev,
          value: { ...prev.value, weight: value }
        }))
      }
    />
  );
}

function SubtotalValueColor() {
  const color = useInvoiceStore(state => state.subtotalSettings.value.color);
  const setSubtotalSettings = useInvoiceStore(
    state => state.setSubtotalSettings
  );

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setSubtotalSettings(prev => ({
          ...prev,
          value: { ...prev.value, color: value }
        }))
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
  const align = useInvoiceStore(state => state.taxSettings.label.align);
  const setTaxSettings = useInvoiceStore(state => state.setTaxSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTaxSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function TaxLabelSize() {
  const size = useInvoiceStore(state => state.taxSettings.label.size);
  const setTaxSettings = useInvoiceStore(state => state.setTaxSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTaxSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function TaxLabelWeight() {
  const weight = useInvoiceStore(state => state.taxSettings.label.weight);
  const setTaxSettings = useInvoiceStore(state => state.setTaxSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTaxSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function TaxLabelColor() {
  const color = useInvoiceStore(state => state.taxSettings.label.color);
  const setTaxSettings = useInvoiceStore(state => state.setTaxSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTaxSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

function TaxValueAlign() {
  const align = useInvoiceStore(state => state.taxSettings.value.align);
  const setTaxSettings = useInvoiceStore(state => state.setTaxSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTaxSettings(prev => ({
          ...prev,
          value: { ...prev.value, align: value }
        }))
      }
    />
  );
}

function TaxValueSize() {
  const size = useInvoiceStore(state => state.taxSettings.value.size);
  const setTaxSettings = useInvoiceStore(state => state.setTaxSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTaxSettings(prev => ({
          ...prev,
          value: { ...prev.value, size: value }
        }))
      }
    />
  );
}

function TaxValueWeight() {
  const weight = useInvoiceStore(state => state.taxSettings.value.weight);
  const setTaxSettings = useInvoiceStore(state => state.setTaxSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTaxSettings(prev => ({
          ...prev,
          value: { ...prev.value, weight: value }
        }))
      }
    />
  );
}

function TaxValueColor() {
  const color = useInvoiceStore(state => state.taxSettings.value.color);
  const setTaxSettings = useInvoiceStore(state => state.setTaxSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTaxSettings(prev => ({
          ...prev,
          value: { ...prev.value, color: value }
        }))
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
  const align = useInvoiceStore(state => state.feesSettings.label.align);
  const setFeesSettings = useInvoiceStore(state => state.setFeesSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setFeesSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function FeesLabelSize() {
  const size = useInvoiceStore(state => state.feesSettings.label.size);
  const setFeesSettings = useInvoiceStore(state => state.setFeesSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setFeesSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function FeesLabelWeight() {
  const weight = useInvoiceStore(state => state.feesSettings.label.weight);
  const setFeesSettings = useInvoiceStore(state => state.setFeesSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setFeesSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function FeesLabelColor() {
  const color = useInvoiceStore(state => state.feesSettings.label.color);
  const setFeesSettings = useInvoiceStore(state => state.setFeesSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setFeesSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

function FeesValueAlign() {
  const align = useInvoiceStore(state => state.feesSettings.value.align);
  const setFeesSettings = useInvoiceStore(state => state.setFeesSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setFeesSettings(prev => ({
          ...prev,
          value: { ...prev.value, align: value }
        }))
      }
    />
  );
}

function FeesValueSize() {
  const size = useInvoiceStore(state => state.feesSettings.value.size);
  const setFeesSettings = useInvoiceStore(state => state.setFeesSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setFeesSettings(prev => ({
          ...prev,
          value: { ...prev.value, size: value }
        }))
      }
    />
  );
}

function FeesValueWeight() {
  const weight = useInvoiceStore(state => state.feesSettings.value.weight);
  const setFeesSettings = useInvoiceStore(state => state.setFeesSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setFeesSettings(prev => ({
          ...prev,
          value: { ...prev.value, weight: value }
        }))
      }
    />
  );
}

function FeesValueColor() {
  const color = useInvoiceStore(state => state.feesSettings.value.color);
  const setFeesSettings = useInvoiceStore(state => state.setFeesSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setFeesSettings(prev => ({
          ...prev,
          value: { ...prev.value, color: value }
        }))
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
  const align = useInvoiceStore(state => state.discountsSettings.label.align);
  const setDiscountsSettings = useInvoiceStore(
    state => state.setDiscountsSettings
  );

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setDiscountsSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function DiscountsLabelSize() {
  const size = useInvoiceStore(state => state.discountsSettings.label.size);
  const setDiscountsSettings = useInvoiceStore(
    state => state.setDiscountsSettings
  );

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setDiscountsSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function DiscountsLabelWeight() {
  const weight = useInvoiceStore(state => state.discountsSettings.label.weight);
  const setDiscountsSettings = useInvoiceStore(
    state => state.setDiscountsSettings
  );

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setDiscountsSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function DiscountsLabelColor() {
  const color = useInvoiceStore(state => state.discountsSettings.label.color);
  const setDiscountsSettings = useInvoiceStore(
    state => state.setDiscountsSettings
  );

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setDiscountsSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

function DiscountsValueAlign() {
  const align = useInvoiceStore(state => state.discountsSettings.value.align);
  const setDiscountsSettings = useInvoiceStore(
    state => state.setDiscountsSettings
  );

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setDiscountsSettings(prev => ({
          ...prev,
          value: { ...prev.value, align: value }
        }))
      }
    />
  );
}

function DiscountsValueSize() {
  const size = useInvoiceStore(state => state.discountsSettings.value.size);
  const setDiscountsSettings = useInvoiceStore(
    state => state.setDiscountsSettings
  );

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setDiscountsSettings(prev => ({
          ...prev,
          value: { ...prev.value, size: value }
        }))
      }
    />
  );
}

function DiscountsValueWeight() {
  const weight = useInvoiceStore(state => state.discountsSettings.value.weight);
  const setDiscountsSettings = useInvoiceStore(
    state => state.setDiscountsSettings
  );

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setDiscountsSettings(prev => ({
          ...prev,
          value: { ...prev.value, weight: value }
        }))
      }
    />
  );
}

function DiscountsValueColor() {
  const color = useInvoiceStore(state => state.discountsSettings.value.color);
  const setDiscountsSettings = useInvoiceStore(
    state => state.setDiscountsSettings
  );

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setDiscountsSettings(prev => ({
          ...prev,
          value: { ...prev.value, color: value }
        }))
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
  const align = useInvoiceStore(state => state.totalSettings.label.align);
  const setTotalSettings = useInvoiceStore(state => state.setTotalSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTotalSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function TotalLabelSize() {
  const size = useInvoiceStore(state => state.totalSettings.label.size);
  const setTotalSettings = useInvoiceStore(state => state.setTotalSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTotalSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function TotalLabelWeight() {
  const weight = useInvoiceStore(state => state.totalSettings.label.weight);
  const setTotalSettings = useInvoiceStore(state => state.setTotalSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTotalSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function TotalLabelColor() {
  const color = useInvoiceStore(state => state.totalSettings.label.color);
  const setTotalSettings = useInvoiceStore(state => state.setTotalSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTotalSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

function TotalValueAlign() {
  const align = useInvoiceStore(state => state.totalSettings.value.align);
  const setTotalSettings = useInvoiceStore(state => state.setTotalSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTotalSettings(prev => ({
          ...prev,
          value: { ...prev.value, align: value }
        }))
      }
    />
  );
}

function TotalValueSize() {
  const size = useInvoiceStore(state => state.totalSettings.value.size);
  const setTotalSettings = useInvoiceStore(state => state.setTotalSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTotalSettings(prev => ({
          ...prev,
          value: { ...prev.value, size: value }
        }))
      }
    />
  );
}

function TotalValueWeight() {
  const weight = useInvoiceStore(state => state.totalSettings.value.weight);
  const setTotalSettings = useInvoiceStore(state => state.setTotalSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTotalSettings(prev => ({
          ...prev,
          value: { ...prev.value, weight: value }
        }))
      }
    />
  );
}

function TotalValueColor() {
  const color = useInvoiceStore(state => state.totalSettings.value.color);
  const setTotalSettings = useInvoiceStore(state => state.setTotalSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTotalSettings(prev => ({
          ...prev,
          value: { ...prev.value, color: value }
        }))
      }
    />
  );
}
