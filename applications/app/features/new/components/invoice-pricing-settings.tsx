import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "features/new/components/settings-fields";
import {
  discountsSettingsAtom,
  feesSettingsAtom,
  subtotalSettingsAtom,
  taxSettingsAtom,
  totalSettingsAtom,
  updateDiscountsSettingsAtom,
  updateFeesSettingsAtom,
  updateSubtotalSettingsAtom,
  updateTaxSettingsAtom,
  updateTotalSettingsAtom
} from "features/new/state";
import { handleActiveTab } from "features/new/utils/handle-active-tab";
import { useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo, useEffect, useRef, useState } from "react";

export function InvoicePricingSettings() {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("subtotal");

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
    function handleSelectTotalsTab(event: Event) {
      const customEvent = event as CustomEvent<{
        tab: string;
        option: string;
      }>;

      if (customEvent.detail.tab) {
        scrollToSelectedTab(customEvent.detail.tab);
      }
    }

    window.addEventListener("select-totals-tab", handleSelectTotalsTab);

    return () => {
      window.removeEventListener("select-totals-tab", handleSelectTotalsTab);
    };
  }, []);

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
const SubtotalSettings = memo(function SubtotalSettings() {
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
});

// Subtotal Label Atoms and Components
const subtotalLabelAlignAtom = selectAtom(
  subtotalSettingsAtom,
  settings => settings.label.align
);

const SubtotalLabelAlign = memo(function SubtotalLabelAlign() {
  const align = useAtomValue(subtotalLabelAlignAtom);
  const updateSubtotalSettings = useSetAtom(updateSubtotalSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateSubtotalSettings({ label: { align: value } })}
    />
  );
});

const subtotalLabelSizeAtom = selectAtom(
  subtotalSettingsAtom,
  settings => settings.label.size
);

const SubtotalLabelSize = memo(function SubtotalLabelSize() {
  const size = useAtomValue(subtotalLabelSizeAtom);
  const updateSubtotalSettings = useSetAtom(updateSubtotalSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateSubtotalSettings({ label: { size: value } })}
    />
  );
});

const subtotalLabelWeightAtom = selectAtom(
  subtotalSettingsAtom,
  settings => settings.label.weight
);

const SubtotalLabelWeight = memo(function SubtotalLabelWeight() {
  const weight = useAtomValue(subtotalLabelWeightAtom);
  const updateSubtotalSettings = useSetAtom(updateSubtotalSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        updateSubtotalSettings({ label: { weight: value } })
      }
    />
  );
});

const subtotalLabelColorAtom = selectAtom(
  subtotalSettingsAtom,
  settings => settings.label.color
);

const SubtotalLabelColor = memo(function SubtotalLabelColor() {
  const color = useAtomValue(subtotalLabelColorAtom);
  const updateSubtotalSettings = useSetAtom(updateSubtotalSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateSubtotalSettings({ label: { color: value } })}
    />
  );
});

// Subtotal Value Atoms and Components
const subtotalValueAlignAtom = selectAtom(
  subtotalSettingsAtom,
  settings => settings.value.align
);

const SubtotalValueAlign = memo(function SubtotalValueAlign() {
  const align = useAtomValue(subtotalValueAlignAtom);
  const updateSubtotalSettings = useSetAtom(updateSubtotalSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateSubtotalSettings({ value: { align: value } })}
    />
  );
});

const subtotalValueSizeAtom = selectAtom(
  subtotalSettingsAtom,
  settings => settings.value.size
);

const SubtotalValueSize = memo(function SubtotalValueSize() {
  const size = useAtomValue(subtotalValueSizeAtom);
  const updateSubtotalSettings = useSetAtom(updateSubtotalSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateSubtotalSettings({ value: { size: value } })}
    />
  );
});

const subtotalValueWeightAtom = selectAtom(
  subtotalSettingsAtom,
  settings => settings.value.weight
);

const SubtotalValueWeight = memo(function SubtotalValueWeight() {
  const weight = useAtomValue(subtotalValueWeightAtom);
  const updateSubtotalSettings = useSetAtom(updateSubtotalSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        updateSubtotalSettings({ value: { weight: value } })
      }
    />
  );
});

const subtotalValueColorAtom = selectAtom(
  subtotalSettingsAtom,
  settings => settings.value.color
);

const SubtotalValueColor = memo(function SubtotalValueColor() {
  const color = useAtomValue(subtotalValueColorAtom);
  const updateSubtotalSettings = useSetAtom(updateSubtotalSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateSubtotalSettings({ value: { color: value } })}
    />
  );
});

// ===== TAX SETTINGS =====
const TaxSettings = memo(function TaxSettings() {
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
});

// Tax Label Atoms and Components
const taxLabelAlignAtom = selectAtom(
  taxSettingsAtom,
  settings => settings.label.align
);

const TaxLabelAlign = memo(function TaxLabelAlign() {
  const align = useAtomValue(taxLabelAlignAtom);
  const updateTaxSettings = useSetAtom(updateTaxSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateTaxSettings({ label: { align: value } })}
    />
  );
});

const taxLabelSizeAtom = selectAtom(
  taxSettingsAtom,
  settings => settings.label.size
);

const TaxLabelSize = memo(function TaxLabelSize() {
  const size = useAtomValue(taxLabelSizeAtom);
  const updateTaxSettings = useSetAtom(updateTaxSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateTaxSettings({ label: { size: value } })}
    />
  );
});

const taxLabelWeightAtom = selectAtom(
  taxSettingsAtom,
  settings => settings.label.weight
);

const TaxLabelWeight = memo(function TaxLabelWeight() {
  const weight = useAtomValue(taxLabelWeightAtom);
  const updateTaxSettings = useSetAtom(updateTaxSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateTaxSettings({ label: { weight: value } })}
    />
  );
});

const taxLabelColorAtom = selectAtom(
  taxSettingsAtom,
  settings => settings.label.color
);

const TaxLabelColor = memo(function TaxLabelColor() {
  const color = useAtomValue(taxLabelColorAtom);
  const updateTaxSettings = useSetAtom(updateTaxSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateTaxSettings({ label: { color: value } })}
    />
  );
});

// Tax Value Atoms and Components
const taxValueAlignAtom = selectAtom(
  taxSettingsAtom,
  settings => settings.value.align
);

const TaxValueAlign = memo(function TaxValueAlign() {
  const align = useAtomValue(taxValueAlignAtom);
  const updateTaxSettings = useSetAtom(updateTaxSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateTaxSettings({ value: { align: value } })}
    />
  );
});

const taxValueSizeAtom = selectAtom(
  taxSettingsAtom,
  settings => settings.value.size
);

const TaxValueSize = memo(function TaxValueSize() {
  const size = useAtomValue(taxValueSizeAtom);
  const updateTaxSettings = useSetAtom(updateTaxSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateTaxSettings({ value: { size: value } })}
    />
  );
});

const taxValueWeightAtom = selectAtom(
  taxSettingsAtom,
  settings => settings.value.weight
);

const TaxValueWeight = memo(function TaxValueWeight() {
  const weight = useAtomValue(taxValueWeightAtom);
  const updateTaxSettings = useSetAtom(updateTaxSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateTaxSettings({ value: { weight: value } })}
    />
  );
});

const taxValueColorAtom = selectAtom(
  taxSettingsAtom,
  settings => settings.value.color
);

const TaxValueColor = memo(function TaxValueColor() {
  const color = useAtomValue(taxValueColorAtom);
  const updateTaxSettings = useSetAtom(updateTaxSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateTaxSettings({ value: { color: value } })}
    />
  );
});

// ===== FEES SETTINGS =====
const FeesSettings = memo(function FeesSettings() {
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
});

// Fees Label Atoms and Components
const feesLabelAlignAtom = selectAtom(
  feesSettingsAtom,
  settings => settings.label.align
);

const FeesLabelAlign = memo(function FeesLabelAlign() {
  const align = useAtomValue(feesLabelAlignAtom);
  const updateFeesSettings = useSetAtom(updateFeesSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateFeesSettings({ label: { align: value } })}
    />
  );
});

const feesLabelSizeAtom = selectAtom(
  feesSettingsAtom,
  settings => settings.label.size
);

const FeesLabelSize = memo(function FeesLabelSize() {
  const size = useAtomValue(feesLabelSizeAtom);
  const updateFeesSettings = useSetAtom(updateFeesSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateFeesSettings({ label: { size: value } })}
    />
  );
});

const feesLabelWeightAtom = selectAtom(
  feesSettingsAtom,
  settings => settings.label.weight
);

const FeesLabelWeight = memo(function FeesLabelWeight() {
  const weight = useAtomValue(feesLabelWeightAtom);
  const updateFeesSettings = useSetAtom(updateFeesSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateFeesSettings({ label: { weight: value } })}
    />
  );
});

const feesLabelColorAtom = selectAtom(
  feesSettingsAtom,
  settings => settings.label.color
);

const FeesLabelColor = memo(function FeesLabelColor() {
  const color = useAtomValue(feesLabelColorAtom);
  const updateFeesSettings = useSetAtom(updateFeesSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateFeesSettings({ label: { color: value } })}
    />
  );
});

// Fees Value Atoms and Components
const feesValueAlignAtom = selectAtom(
  feesSettingsAtom,
  settings => settings.value.align
);

const FeesValueAlign = memo(function FeesValueAlign() {
  const align = useAtomValue(feesValueAlignAtom);
  const updateFeesSettings = useSetAtom(updateFeesSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateFeesSettings({ value: { align: value } })}
    />
  );
});

const feesValueSizeAtom = selectAtom(
  feesSettingsAtom,
  settings => settings.value.size
);

const FeesValueSize = memo(function FeesValueSize() {
  const size = useAtomValue(feesValueSizeAtom);
  const updateFeesSettings = useSetAtom(updateFeesSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateFeesSettings({ value: { size: value } })}
    />
  );
});

const feesValueWeightAtom = selectAtom(
  feesSettingsAtom,
  settings => settings.value.weight
);

const FeesValueWeight = memo(function FeesValueWeight() {
  const weight = useAtomValue(feesValueWeightAtom);
  const updateFeesSettings = useSetAtom(updateFeesSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateFeesSettings({ value: { weight: value } })}
    />
  );
});

const feesValueColorAtom = selectAtom(
  feesSettingsAtom,
  settings => settings.value.color
);

const FeesValueColor = memo(function FeesValueColor() {
  const color = useAtomValue(feesValueColorAtom);
  const updateFeesSettings = useSetAtom(updateFeesSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateFeesSettings({ value: { color: value } })}
    />
  );
});

// ===== DISCOUNTS SETTINGS =====
const DiscountsSettings = memo(function DiscountsSettings() {
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
});

// Discounts Label Atoms and Components
const discountsLabelAlignAtom = selectAtom(
  discountsSettingsAtom,
  settings => settings.label.align
);

const DiscountsLabelAlign = memo(function DiscountsLabelAlign() {
  const align = useAtomValue(discountsLabelAlignAtom);
  const updateDiscountsSettings = useSetAtom(updateDiscountsSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        updateDiscountsSettings({ label: { align: value } })
      }
    />
  );
});

const discountsLabelSizeAtom = selectAtom(
  discountsSettingsAtom,
  settings => settings.label.size
);

const DiscountsLabelSize = memo(function DiscountsLabelSize() {
  const size = useAtomValue(discountsLabelSizeAtom);
  const updateDiscountsSettings = useSetAtom(updateDiscountsSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateDiscountsSettings({ label: { size: value } })}
    />
  );
});

const discountsLabelWeightAtom = selectAtom(
  discountsSettingsAtom,
  settings => settings.label.weight
);

const DiscountsLabelWeight = memo(function DiscountsLabelWeight() {
  const weight = useAtomValue(discountsLabelWeightAtom);
  const updateDiscountsSettings = useSetAtom(updateDiscountsSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        updateDiscountsSettings({ label: { weight: value } })
      }
    />
  );
});

const discountsLabelColorAtom = selectAtom(
  discountsSettingsAtom,
  settings => settings.label.color
);

const DiscountsLabelColor = memo(function DiscountsLabelColor() {
  const color = useAtomValue(discountsLabelColorAtom);
  const updateDiscountsSettings = useSetAtom(updateDiscountsSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        updateDiscountsSettings({ label: { color: value } })
      }
    />
  );
});

// Discounts Value Atoms and Components
const discountsValueAlignAtom = selectAtom(
  discountsSettingsAtom,
  settings => settings.value.align
);

const DiscountsValueAlign = memo(function DiscountsValueAlign() {
  const align = useAtomValue(discountsValueAlignAtom);
  const updateDiscountsSettings = useSetAtom(updateDiscountsSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        updateDiscountsSettings({ value: { align: value } })
      }
    />
  );
});

const discountsValueSizeAtom = selectAtom(
  discountsSettingsAtom,
  settings => settings.value.size
);

const DiscountsValueSize = memo(function DiscountsValueSize() {
  const size = useAtomValue(discountsValueSizeAtom);
  const updateDiscountsSettings = useSetAtom(updateDiscountsSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateDiscountsSettings({ value: { size: value } })}
    />
  );
});

const discountsValueWeightAtom = selectAtom(
  discountsSettingsAtom,
  settings => settings.value.weight
);

const DiscountsValueWeight = memo(function DiscountsValueWeight() {
  const weight = useAtomValue(discountsValueWeightAtom);
  const updateDiscountsSettings = useSetAtom(updateDiscountsSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        updateDiscountsSettings({ value: { weight: value } })
      }
    />
  );
});

const discountsValueColorAtom = selectAtom(
  discountsSettingsAtom,
  settings => settings.value.color
);

const DiscountsValueColor = memo(function DiscountsValueColor() {
  const color = useAtomValue(discountsValueColorAtom);
  const updateDiscountsSettings = useSetAtom(updateDiscountsSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        updateDiscountsSettings({ value: { color: value } })
      }
    />
  );
});

// ===== TOTAL SETTINGS =====
const TotalSettings = memo(function TotalSettings() {
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
});

// Total Label Atoms and Components
const totalLabelAlignAtom = selectAtom(
  totalSettingsAtom,
  settings => settings.label.align
);

const TotalLabelAlign = memo(function TotalLabelAlign() {
  const align = useAtomValue(totalLabelAlignAtom);
  const updateTotalSettings = useSetAtom(updateTotalSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateTotalSettings({ label: { align: value } })}
    />
  );
});

const totalLabelSizeAtom = selectAtom(
  totalSettingsAtom,
  settings => settings.label.size
);

const TotalLabelSize = memo(function TotalLabelSize() {
  const size = useAtomValue(totalLabelSizeAtom);
  const updateTotalSettings = useSetAtom(updateTotalSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateTotalSettings({ label: { size: value } })}
    />
  );
});

const totalLabelWeightAtom = selectAtom(
  totalSettingsAtom,
  settings => settings.label.weight
);

const TotalLabelWeight = memo(function TotalLabelWeight() {
  const weight = useAtomValue(totalLabelWeightAtom);
  const updateTotalSettings = useSetAtom(updateTotalSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateTotalSettings({ label: { weight: value } })}
    />
  );
});

const totalLabelColorAtom = selectAtom(
  totalSettingsAtom,
  settings => settings.label.color
);

const TotalLabelColor = memo(function TotalLabelColor() {
  const color = useAtomValue(totalLabelColorAtom);
  const updateTotalSettings = useSetAtom(updateTotalSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateTotalSettings({ label: { color: value } })}
    />
  );
});

// Total Value Atoms and Components
const totalValueAlignAtom = selectAtom(
  totalSettingsAtom,
  settings => settings.value.align
);

const TotalValueAlign = memo(function TotalValueAlign() {
  const align = useAtomValue(totalValueAlignAtom);
  const updateTotalSettings = useSetAtom(updateTotalSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateTotalSettings({ value: { align: value } })}
    />
  );
});

const totalValueSizeAtom = selectAtom(
  totalSettingsAtom,
  settings => settings.value.size
);

const TotalValueSize = memo(function TotalValueSize() {
  const size = useAtomValue(totalValueSizeAtom);
  const updateTotalSettings = useSetAtom(updateTotalSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateTotalSettings({ value: { size: value } })}
    />
  );
});

const totalValueWeightAtom = selectAtom(
  totalSettingsAtom,
  settings => settings.value.weight
);

const TotalValueWeight = memo(function TotalValueWeight() {
  const weight = useAtomValue(totalValueWeightAtom);
  const updateTotalSettings = useSetAtom(updateTotalSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateTotalSettings({ value: { weight: value } })}
    />
  );
});

const totalValueColorAtom = selectAtom(
  totalSettingsAtom,
  settings => settings.value.color
);

const TotalValueColor = memo(function TotalValueColor() {
  const color = useAtomValue(totalValueColorAtom);
  const updateTotalSettings = useSetAtom(updateTotalSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateTotalSettings({ value: { color: value } })}
    />
  );
});
