import { Label } from "components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "features/new/components/settings-fields";
import {
  tableSettingsAtom,
  updateAmountHeaderSettingsAtom,
  updateAmountRowSettingsAtom,
  updateDescriptionHeaderSettingsAtom,
  updateDescriptionRowSettingsAtom,
  updateQuantityHeaderSettingsAtom,
  updateQuantityRowSettingsAtom,
  updateTableDesignSettingsAtom,
  updateUnitPriceHeaderSettingsAtom,
  updateUnitPriceRowSettingsAtom
} from "features/new/state";
import { handleActiveTab } from "features/new/utils/handle-active-tab";
import { useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo, useEffect, useRef, useState } from "react";

export const LineItemsSettings = memo(function LineItemsSettings() {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("description");

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
    function handleSelectLineItemsTab(event: Event) {
      const customEvent = event as CustomEvent<{
        tab: string;
      }>;

      if (customEvent.detail.tab) {
        scrollToSelectedTab(customEvent.detail.tab);
      }
    }

    window.addEventListener("select-line-items-tab", handleSelectLineItemsTab);

    return () => {
      window.removeEventListener(
        "select-line-items-tab",
        handleSelectLineItemsTab
      );
    };
  }, []);

  function handleValueChange(value: string) {
    scrollToSelectedTab(value);
  }

  return (
    <Tabs
      defaultValue="description"
      className="w-full"
      onValueChange={handleValueChange}
      value={activeTab}
    >
      <div ref={tabsRef} className="scrollbar-thin overflow-x-auto pb-1">
        <TabsList className="inline-flex w-auto min-w-full">
          <TabsTrigger
            value="description"
            className="min-w-[100px] flex-1"
            data-value="description"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="quantity"
            className="min-w-[80px] flex-1"
            data-value="quantity"
          >
            Quantity
          </TabsTrigger>
          <TabsTrigger
            value="unitPrice"
            className="min-w-[90px] flex-1"
            data-value="unitPrice"
          >
            Unit Price
          </TabsTrigger>
          <TabsTrigger
            value="amount"
            className="min-w-[80px] flex-1"
            data-value="amount"
          >
            Amount
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="description" className="mt-4 flex flex-col gap-4">
        <DescriptionSettings />
      </TabsContent>
      <TabsContent value="quantity" className="mt-4 flex flex-col gap-4">
        <QuantitySettings />
      </TabsContent>
      <TabsContent value="unitPrice" className="mt-4 flex flex-col gap-4">
        <UnitPriceSettings />
      </TabsContent>
      <TabsContent value="amount" className="mt-4 flex flex-col gap-4">
        <AmountSettings />
      </TabsContent>
    </Tabs>
  );
});

// Description Settings
const DescriptionSettings = memo(function DescriptionSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Header Settings</h3>
      <div className="flex flex-col gap-2">
        <DescriptionHeaderAlign />
        <DescriptionHeaderSize />
        <DescriptionHeaderWeight />
        <DescriptionHeaderColor />
        <DescriptionHeaderLabel />
      </div>
      <h3 className="font-medium">Row Settings</h3>
      <div className="flex flex-col gap-2">
        <DescriptionRowAlign />
        <DescriptionRowSize />
        <DescriptionRowWeight />
        <DescriptionRowColor />
      </div>
      <h3 className="font-medium">Table Design</h3>
      <TableDesignSettings />
    </div>
  );
});

// Quantity Settings
const QuantitySettings = memo(function QuantitySettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Header Settings</h3>
      <div className="flex flex-col gap-2">
        <QuantityHeaderAlign />
        <QuantityHeaderSize />
        <QuantityHeaderWeight />
        <QuantityHeaderColor />
        <QuantityHeaderLabel />
      </div>
      <h3 className="font-medium">Row Settings</h3>
      <div className="flex flex-col gap-2">
        <QuantityRowAlign />
        <QuantityRowSize />
        <QuantityRowWeight />
        <QuantityRowColor />
      </div>
      <h3 className="font-medium">Table Design</h3>
      <TableDesignSettings />
    </div>
  );
});

// Unit Price Settings
const UnitPriceSettings = memo(function UnitPriceSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Header Settings</h3>
      <div className="flex flex-col gap-2">
        <UnitPriceHeaderAlign />
        <UnitPriceHeaderSize />
        <UnitPriceHeaderWeight />
        <UnitPriceHeaderColor />
        <UnitPriceHeaderLabel />
      </div>
      <h3 className="font-medium">Row Settings</h3>
      <div className="flex flex-col gap-2">
        <UnitPriceRowAlign />
        <UnitPriceRowSize />
        <UnitPriceRowWeight />
        <UnitPriceRowColor />
      </div>
      <h3 className="font-medium">Table Design</h3>
      <TableDesignSettings />
    </div>
  );
});

// Amount Settings
const AmountSettings = memo(function AmountSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-medium">Header Settings</h3>
      <div className="flex flex-col gap-2">
        <AmountHeaderAlign />
        <AmountHeaderSize />
        <AmountHeaderWeight />
        <AmountHeaderColor />
        <AmountHeaderLabel />
      </div>
      <h3 className="font-medium">Row Settings</h3>
      <div className="flex flex-col gap-2">
        <AmountRowAlign />
        <AmountRowSize />
        <AmountRowWeight />
        <AmountRowColor />
      </div>
      <h3 className="font-medium">Table Design</h3>
      <TableDesignSettings />
    </div>
  );
});

const tableBackgroundColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.backgroundColor
);

const tableBorderColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.borderColor
);

const TableDesignSettings = memo(function TableDesignSettings() {
  return (
    <div className="flex flex-col gap-2">
      <TableBackgroundColor />
      <TableBorderColor />
    </div>
  );
});

const TableBackgroundColor = memo(function TableBackgroundColor() {
  const backgroundColor = useAtomValue(tableBackgroundColorAtom);
  const updateTableDesignSettings = useSetAtom(updateTableDesignSettingsAtom);

  return (
    <ColorSettings
      value={backgroundColor}
      handleInput={value =>
        updateTableDesignSettings({ backgroundColor: value })
      }
      label="Background"
    />
  );
});

const TableBorderColor = memo(function TableBorderColor() {
  const borderColor = useAtomValue(tableBorderColorAtom);
  const updateTableDesignSettings = useSetAtom(updateTableDesignSettingsAtom);

  return (
    <ColorSettings
      value={borderColor}
      handleInput={value => updateTableDesignSettings({ borderColor: value })}
      label="Border Color"
    />
  );
});

// Description Header Settings
const descriptionHeaderAlignAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionHeaderSettings.align
);
const descriptionHeaderSizeAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionHeaderSettings.size
);
const descriptionHeaderWeightAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionHeaderSettings.weight
);
const descriptionHeaderColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionHeaderSettings.color
);
const descriptionHeaderLabelAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionHeaderSettings.label
);

const DescriptionHeaderAlign = memo(function DescriptionHeaderAlign() {
  const align = useAtomValue(descriptionHeaderAlignAtom);
  const updateDescriptionHeaderSettings = useSetAtom(
    updateDescriptionHeaderSettingsAtom
  );

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateDescriptionHeaderSettings({ align: value })}
    />
  );
});

const DescriptionHeaderSize = memo(function DescriptionHeaderSize() {
  const size = useAtomValue(descriptionHeaderSizeAtom);
  const updateDescriptionHeaderSettings = useSetAtom(
    updateDescriptionHeaderSettingsAtom
  );

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateDescriptionHeaderSettings({ size: value })}
    />
  );
});

const DescriptionHeaderWeight = memo(function DescriptionHeaderWeight() {
  const weight = useAtomValue(descriptionHeaderWeightAtom);
  const updateDescriptionHeaderSettings = useSetAtom(
    updateDescriptionHeaderSettingsAtom
  );

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateDescriptionHeaderSettings({ weight: value })}
    />
  );
});

const DescriptionHeaderColor = memo(function DescriptionHeaderColor() {
  const color = useAtomValue(descriptionHeaderColorAtom);
  const updateDescriptionHeaderSettings = useSetAtom(
    updateDescriptionHeaderSettingsAtom
  );

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateDescriptionHeaderSettings({ color: value })}
    />
  );
});

const DescriptionHeaderLabel = memo(function DescriptionHeaderLabel() {
  const label = useAtomValue(descriptionHeaderLabelAtom);
  const updateDescriptionHeaderSettings = useSetAtom(
    updateDescriptionHeaderSettingsAtom
  );

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="description-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="description-header-label"
        value={label}
        onChange={({ target: { value } }) =>
          updateDescriptionHeaderSettings({ label: value })
        }
        className="w-full border p-2"
      />
    </div>
  );
});

// Description Row Settings
const descriptionRowAlignAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionRowSettings.align
);
const descriptionRowSizeAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionRowSettings.size
);
const descriptionRowWeightAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionRowSettings.weight
);
const descriptionRowColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionRowSettings.color
);

const DescriptionRowAlign = memo(function DescriptionRowAlign() {
  const align = useAtomValue(descriptionRowAlignAtom);
  const updateDescriptionRowSettings = useSetAtom(
    updateDescriptionRowSettingsAtom
  );

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateDescriptionRowSettings({ align: value })}
    />
  );
});

const DescriptionRowSize = memo(function DescriptionRowSize() {
  const size = useAtomValue(descriptionRowSizeAtom);
  const updateDescriptionRowSettings = useSetAtom(
    updateDescriptionRowSettingsAtom
  );

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateDescriptionRowSettings({ size: value })}
    />
  );
});

const DescriptionRowWeight = memo(function DescriptionRowWeight() {
  const weight = useAtomValue(descriptionRowWeightAtom);
  const updateDescriptionRowSettings = useSetAtom(
    updateDescriptionRowSettingsAtom
  );

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateDescriptionRowSettings({ weight: value })}
    />
  );
});

const DescriptionRowColor = memo(function DescriptionRowColor() {
  const color = useAtomValue(descriptionRowColorAtom);
  const updateDescriptionRowSettings = useSetAtom(
    updateDescriptionRowSettingsAtom
  );

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateDescriptionRowSettings({ color: value })}
    />
  );
});

// Quantity Header Settings
const quantityHeaderAlignAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityHeaderSettings.align
);
const quantityHeaderSizeAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityHeaderSettings.size
);
const quantityHeaderWeightAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityHeaderSettings.weight
);
const quantityHeaderColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityHeaderSettings.color
);
const quantityHeaderLabelAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityHeaderSettings.label
);

const QuantityHeaderAlign = memo(function QuantityHeaderAlign() {
  const align = useAtomValue(quantityHeaderAlignAtom);
  const updateQuantityHeaderSettings = useSetAtom(
    updateQuantityHeaderSettingsAtom
  );

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateQuantityHeaderSettings({ align: value })}
    />
  );
});

const QuantityHeaderSize = memo(function QuantityHeaderSize() {
  const size = useAtomValue(quantityHeaderSizeAtom);
  const updateQuantityHeaderSettings = useSetAtom(
    updateQuantityHeaderSettingsAtom
  );

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateQuantityHeaderSettings({ size: value })}
    />
  );
});

const QuantityHeaderWeight = memo(function QuantityHeaderWeight() {
  const weight = useAtomValue(quantityHeaderWeightAtom);
  const updateQuantityHeaderSettings = useSetAtom(
    updateQuantityHeaderSettingsAtom
  );

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateQuantityHeaderSettings({ weight: value })}
    />
  );
});

const QuantityHeaderColor = memo(function QuantityHeaderColor() {
  const color = useAtomValue(quantityHeaderColorAtom);
  const updateQuantityHeaderSettings = useSetAtom(
    updateQuantityHeaderSettingsAtom
  );

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateQuantityHeaderSettings({ color: value })}
    />
  );
});

const QuantityHeaderLabel = memo(function QuantityHeaderLabel() {
  const label = useAtomValue(quantityHeaderLabelAtom);
  const updateQuantityHeaderSettings = useSetAtom(
    updateQuantityHeaderSettingsAtom
  );

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="quantity-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="quantity-header-label"
        value={label}
        onChange={({ target: { value } }) =>
          updateQuantityHeaderSettings({ label: value })
        }
        className="w-full border p-2"
      />
    </div>
  );
});

const quantityRowAlignAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityRowSettings.align
);
const quantityRowSizeAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityRowSettings.size
);
const quantityRowWeightAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityRowSettings.weight
);
const quantityRowColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityRowSettings.color
);

const QuantityRowAlign = memo(function QuantityRowAlign() {
  const align = useAtomValue(quantityRowAlignAtom);
  const updateQuantityRowSettings = useSetAtom(updateQuantityRowSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateQuantityRowSettings({ align: value })}
    />
  );
});

const QuantityRowSize = memo(function QuantityRowSize() {
  const size = useAtomValue(quantityRowSizeAtom);
  const updateQuantityRowSettings = useSetAtom(updateQuantityRowSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateQuantityRowSettings({ size: value })}
    />
  );
});

const QuantityRowWeight = memo(function QuantityRowWeight() {
  const weight = useAtomValue(quantityRowWeightAtom);
  const updateQuantityRowSettings = useSetAtom(updateQuantityRowSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateQuantityRowSettings({ weight: value })}
    />
  );
});

const QuantityRowColor = memo(function QuantityRowColor() {
  const color = useAtomValue(quantityRowColorAtom);
  const updateQuantityRowSettings = useSetAtom(updateQuantityRowSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateQuantityRowSettings({ color: value })}
    />
  );
});

// Unit Price Header Settings
const unitPriceHeaderAlignAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceHeaderSettings.align
);
const unitPriceHeaderSizeAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceHeaderSettings.size
);
const unitPriceHeaderWeightAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceHeaderSettings.weight
);
const unitPriceHeaderColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceHeaderSettings.color
);
const unitPriceHeaderLabelAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceHeaderSettings.label
);

const UnitPriceHeaderAlign = memo(function UnitPriceHeaderAlign() {
  const align = useAtomValue(unitPriceHeaderAlignAtom);
  const updateUnitPriceHeaderSettings = useSetAtom(
    updateUnitPriceHeaderSettingsAtom
  );

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateUnitPriceHeaderSettings({ align: value })}
    />
  );
});

const UnitPriceHeaderSize = memo(function UnitPriceHeaderSize() {
  const size = useAtomValue(unitPriceHeaderSizeAtom);
  const updateUnitPriceHeaderSettings = useSetAtom(
    updateUnitPriceHeaderSettingsAtom
  );

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateUnitPriceHeaderSettings({ size: value })}
    />
  );
});

const UnitPriceHeaderWeight = memo(function UnitPriceHeaderWeight() {
  const weight = useAtomValue(unitPriceHeaderWeightAtom);
  const updateUnitPriceHeaderSettings = useSetAtom(
    updateUnitPriceHeaderSettingsAtom
  );

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateUnitPriceHeaderSettings({ weight: value })}
    />
  );
});

const UnitPriceHeaderColor = memo(function UnitPriceHeaderColor() {
  const color = useAtomValue(unitPriceHeaderColorAtom);
  const updateUnitPriceHeaderSettings = useSetAtom(
    updateUnitPriceHeaderSettingsAtom
  );

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateUnitPriceHeaderSettings({ color: value })}
    />
  );
});

const UnitPriceHeaderLabel = memo(function UnitPriceHeaderLabel() {
  const label = useAtomValue(unitPriceHeaderLabelAtom);
  const updateUnitPriceHeaderSettings = useSetAtom(
    updateUnitPriceHeaderSettingsAtom
  );

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="unit-price-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="unit-price-header-label"
        value={label}
        onChange={({ target: { value } }) =>
          updateUnitPriceHeaderSettings({ label: value })
        }
        className="w-full border p-2"
      />
    </div>
  );
});

// Unit Price Row Settings
const unitPriceRowAlignAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceRowSettings.align
);
const unitPriceRowSizeAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceRowSettings.size
);
const unitPriceRowWeightAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceRowSettings.weight
);
const unitPriceRowColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceRowSettings.color
);

const UnitPriceRowAlign = memo(function UnitPriceRowAlign() {
  const align = useAtomValue(unitPriceRowAlignAtom);
  const updateUnitPriceRowSettings = useSetAtom(updateUnitPriceRowSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateUnitPriceRowSettings({ align: value })}
    />
  );
});

const UnitPriceRowSize = memo(function UnitPriceRowSize() {
  const size = useAtomValue(unitPriceRowSizeAtom);
  const updateUnitPriceRowSettings = useSetAtom(updateUnitPriceRowSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateUnitPriceRowSettings({ size: value })}
    />
  );
});

const UnitPriceRowWeight = memo(function UnitPriceRowWeight() {
  const weight = useAtomValue(unitPriceRowWeightAtom);
  const updateUnitPriceRowSettings = useSetAtom(updateUnitPriceRowSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateUnitPriceRowSettings({ weight: value })}
    />
  );
});

const UnitPriceRowColor = memo(function UnitPriceRowColor() {
  const color = useAtomValue(unitPriceRowColorAtom);
  const updateUnitPriceRowSettings = useSetAtom(updateUnitPriceRowSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateUnitPriceRowSettings({ color: value })}
    />
  );
});

// Amount Header Settings
const amountHeaderAlignAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountHeaderSettings.align
);
const amountHeaderSizeAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountHeaderSettings.size
);
const amountHeaderWeightAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountHeaderSettings.weight
);
const amountHeaderColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountHeaderSettings.color
);
const amountHeaderLabelAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountHeaderSettings.label
);

const AmountHeaderAlign = memo(function AmountHeaderAlign() {
  const align = useAtomValue(amountHeaderAlignAtom);
  const updateAmountHeaderSettings = useSetAtom(updateAmountHeaderSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateAmountHeaderSettings({ align: value })}
    />
  );
});

const AmountHeaderSize = memo(function AmountHeaderSize() {
  const size = useAtomValue(amountHeaderSizeAtom);
  const updateAmountHeaderSettings = useSetAtom(updateAmountHeaderSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateAmountHeaderSettings({ size: value })}
    />
  );
});

const AmountHeaderWeight = memo(function AmountHeaderWeight() {
  const weight = useAtomValue(amountHeaderWeightAtom);
  const updateAmountHeaderSettings = useSetAtom(updateAmountHeaderSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateAmountHeaderSettings({ weight: value })}
    />
  );
});

const AmountHeaderColor = memo(function AmountHeaderColor() {
  const color = useAtomValue(amountHeaderColorAtom);
  const updateAmountHeaderSettings = useSetAtom(updateAmountHeaderSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateAmountHeaderSettings({ color: value })}
    />
  );
});

const AmountHeaderLabel = memo(function AmountHeaderLabel() {
  const label = useAtomValue(amountHeaderLabelAtom);
  const updateAmountHeaderSettings = useSetAtom(updateAmountHeaderSettingsAtom);

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="amount-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="amount-header-label"
        value={label}
        onChange={({ target: { value } }) =>
          updateAmountHeaderSettings({ label: value })
        }
        className="w-full border p-2"
      />
    </div>
  );
});

// Amount Row Settings
const amountRowAlignAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountRowSettings.align
);
const amountRowSizeAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountRowSettings.size
);
const amountRowWeightAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountRowSettings.weight
);
const amountRowColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountRowSettings.color
);

const AmountRowAlign = memo(function AmountRowAlign() {
  const align = useAtomValue(amountRowAlignAtom);
  const updateAmountRowSettings = useSetAtom(updateAmountRowSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => updateAmountRowSettings({ align: value })}
    />
  );
});

const AmountRowSize = memo(function AmountRowSize() {
  const size = useAtomValue(amountRowSizeAtom);
  const updateAmountRowSettings = useSetAtom(updateAmountRowSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => updateAmountRowSettings({ size: value })}
    />
  );
});

const AmountRowWeight = memo(function AmountRowWeight() {
  const weight = useAtomValue(amountRowWeightAtom);
  const updateAmountRowSettings = useSetAtom(updateAmountRowSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => updateAmountRowSettings({ weight: value })}
    />
  );
});

const AmountRowColor = memo(function AmountRowColor() {
  const color = useAtomValue(amountRowColorAtom);
  const updateAmountRowSettings = useSetAtom(updateAmountRowSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => updateAmountRowSettings({ color: value })}
    />
  );
});
