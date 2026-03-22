import { TextStyleControls } from "components/settings-fields";
import { SettingsSection } from "components/ui/settings-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { TAB_SELECT_EVENTS } from "consts/events";
import { useTabSelectEvent } from "hooks/use-tab-select-event";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInvoiceStore } from "stores/invoice-store";
import type { TextSettings } from "types";
import { handleActiveTab } from "utils/handle-active-tab";

export function InvoicePricingSettings() {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("subtotal");

  const scrollToSelectedTab = useCallback((value: string) => {
    if (!tabsRef.current) return;

    setActiveTab(value);
    handleActiveTab({ tabsRef, value });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToSelectedTab(activeTab);
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab, scrollToSelectedTab]);

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
      <TabsContent value="subtotal" className="mt-3 flex flex-col gap-2">
        <SubtotalSettings />
      </TabsContent>
      <TabsContent value="tax" className="mt-3 flex flex-col gap-2">
        <TaxSettings />
      </TabsContent>
      <TabsContent value="fees" className="mt-3 flex flex-col gap-2">
        <FeesSettings />
      </TabsContent>
      <TabsContent value="discounts" className="mt-3 flex flex-col gap-2">
        <DiscountsSettings />
      </TabsContent>
      <TabsContent value="total" className="mt-3 flex flex-col gap-2">
        <TotalSettings />
      </TabsContent>
    </Tabs>
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
