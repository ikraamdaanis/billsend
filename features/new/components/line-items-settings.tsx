import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "features/new/components/settings-fields";
import { tableSettingsAtom } from "features/new/state";
import { handleActiveTab } from "features/new/utils/handle-active-tab";
import { useAtom, useAtomValue } from "jotai";
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
      <h3 className="text-sm font-medium">Header settings</h3>
      <div className="flex flex-col gap-2">
        <DescriptionHeaderAlign />
        <DescriptionHeaderSize />
        <DescriptionHeaderWeight />
        <DescriptionHeaderColor />
        <DescriptionHeaderLabel />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Row settings</h3>
      <div className="flex flex-col gap-2">
        <DescriptionRowAlign />
        <DescriptionRowSize />
        <DescriptionRowWeight />
        <DescriptionRowColor />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Table design</h3>
      <TableDesignSettings />
    </div>
  );
});

// Quantity Settings
const QuantitySettings = memo(function QuantitySettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium">Header settings</h3>
      <div className="flex flex-col gap-2">
        <QuantityHeaderAlign />
        <QuantityHeaderSize />
        <QuantityHeaderWeight />
        <QuantityHeaderColor />
        <QuantityHeaderLabel />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Row settings</h3>
      <div className="flex flex-col gap-2">
        <QuantityRowAlign />
        <QuantityRowSize />
        <QuantityRowWeight />
        <QuantityRowColor />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Table design</h3>
      <TableDesignSettings />
    </div>
  );
});

// Unit Price Settings
const UnitPriceSettings = memo(function UnitPriceSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium">Header settings</h3>
      <div className="flex flex-col gap-2">
        <UnitPriceHeaderAlign />
        <UnitPriceHeaderSize />
        <UnitPriceHeaderWeight />
        <UnitPriceHeaderColor />
        <UnitPriceHeaderLabel />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Row settings</h3>
      <div className="flex flex-col gap-2">
        <UnitPriceRowAlign />
        <UnitPriceRowSize />
        <UnitPriceRowWeight />
        <UnitPriceRowColor />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Table design</h3>
      <TableDesignSettings />
    </div>
  );
});

// Amount Settings
const AmountSettings = memo(function AmountSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium">Header settings</h3>
      <div className="flex flex-col gap-2">
        <AmountHeaderAlign />
        <AmountHeaderSize />
        <AmountHeaderWeight />
        <AmountHeaderColor />
        <AmountHeaderLabel />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Row settings</h3>
      <div className="flex flex-col gap-2">
        <AmountRowAlign />
        <AmountRowSize />
        <AmountRowWeight />
        <AmountRowColor />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Table design</h3>
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
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <ColorSettings
      value={backgroundColor}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          backgroundColor: value
        })
      }
      label="Background"
    />
  );
});

const TableBorderColor = memo(function TableBorderColor() {
  const borderColor = useAtomValue(tableBorderColorAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <ColorSettings
      value={borderColor}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          borderColor: value
        })
      }
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
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionHeaderSettings: {
            ...tableSettings.descriptionHeaderSettings,
            align: value
          }
        })
      }
    />
  );
});

const DescriptionHeaderSize = memo(function DescriptionHeaderSize() {
  const size = useAtomValue(descriptionHeaderSizeAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionHeaderSettings: {
            ...tableSettings.descriptionHeaderSettings,
            size: value
          }
        })
      }
    />
  );
});

const DescriptionHeaderWeight = memo(function DescriptionHeaderWeight() {
  const weight = useAtomValue(descriptionHeaderWeightAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionHeaderSettings: {
            ...tableSettings.descriptionHeaderSettings,
            weight: value
          }
        })
      }
    />
  );
});

const DescriptionHeaderColor = memo(function DescriptionHeaderColor() {
  const color = useAtomValue(descriptionHeaderColorAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionHeaderSettings: {
            ...tableSettings.descriptionHeaderSettings,
            color: value
          }
        })
      }
    />
  );
});

const DescriptionHeaderLabel = memo(function DescriptionHeaderLabel() {
  const label = useAtomValue(descriptionHeaderLabelAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

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
          setTableSettings({
            ...tableSettings,
            descriptionHeaderSettings: {
              ...tableSettings.descriptionHeaderSettings,
              label: value
            }
          })
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
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionRowSettings: {
            ...tableSettings.descriptionRowSettings,
            align: value
          }
        })
      }
    />
  );
});

const DescriptionRowSize = memo(function DescriptionRowSize() {
  const size = useAtomValue(descriptionRowSizeAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionRowSettings: {
            ...tableSettings.descriptionRowSettings,
            size: value
          }
        })
      }
    />
  );
});

const DescriptionRowWeight = memo(function DescriptionRowWeight() {
  const weight = useAtomValue(descriptionRowWeightAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionRowSettings: {
            ...tableSettings.descriptionRowSettings,
            weight: value
          }
        })
      }
    />
  );
});

const DescriptionRowColor = memo(function DescriptionRowColor() {
  const color = useAtomValue(descriptionRowColorAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionRowSettings: {
            ...tableSettings.descriptionRowSettings,
            color: value
          }
        })
      }
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
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityHeaderSettings: {
            ...tableSettings.quantityHeaderSettings,
            align: value
          }
        })
      }
    />
  );
});

const QuantityHeaderSize = memo(function QuantityHeaderSize() {
  const size = useAtomValue(quantityHeaderSizeAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityHeaderSettings: {
            ...tableSettings.quantityHeaderSettings,
            size: value
          }
        })
      }
    />
  );
});

const QuantityHeaderWeight = memo(function QuantityHeaderWeight() {
  const weight = useAtomValue(quantityHeaderWeightAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityHeaderSettings: {
            ...tableSettings.quantityHeaderSettings,
            weight: value
          }
        })
      }
    />
  );
});

const QuantityHeaderColor = memo(function QuantityHeaderColor() {
  const color = useAtomValue(quantityHeaderColorAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityHeaderSettings: {
            ...tableSettings.quantityHeaderSettings,
            color: value
          }
        })
      }
    />
  );
});

const QuantityHeaderLabel = memo(function QuantityHeaderLabel() {
  const label = useAtomValue(quantityHeaderLabelAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

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
          setTableSettings({
            ...tableSettings,
            quantityHeaderSettings: {
              ...tableSettings.quantityHeaderSettings,
              label: value
            }
          })
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
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityRowSettings: {
            ...tableSettings.quantityRowSettings,
            align: value
          }
        })
      }
    />
  );
});

const QuantityRowSize = memo(function QuantityRowSize() {
  const size = useAtomValue(quantityRowSizeAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityRowSettings: {
            ...tableSettings.quantityRowSettings,
            size: value
          }
        })
      }
    />
  );
});

const QuantityRowWeight = memo(function QuantityRowWeight() {
  const weight = useAtomValue(quantityRowWeightAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityRowSettings: {
            ...tableSettings.quantityRowSettings,
            weight: value
          }
        })
      }
    />
  );
});

const QuantityRowColor = memo(function QuantityRowColor() {
  const color = useAtomValue(quantityRowColorAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityRowSettings: {
            ...tableSettings.quantityRowSettings,
            color: value
          }
        })
      }
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
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceHeaderSettings: {
            ...tableSettings.unitPriceHeaderSettings,
            align: value
          }
        })
      }
    />
  );
});

const UnitPriceHeaderSize = memo(function UnitPriceHeaderSize() {
  const size = useAtomValue(unitPriceHeaderSizeAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceHeaderSettings: {
            ...tableSettings.unitPriceHeaderSettings,
            size: value
          }
        })
      }
    />
  );
});

const UnitPriceHeaderWeight = memo(function UnitPriceHeaderWeight() {
  const weight = useAtomValue(unitPriceHeaderWeightAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceHeaderSettings: {
            ...tableSettings.unitPriceHeaderSettings,
            weight: value
          }
        })
      }
    />
  );
});

const UnitPriceHeaderColor = memo(function UnitPriceHeaderColor() {
  const color = useAtomValue(unitPriceHeaderColorAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceHeaderSettings: {
            ...tableSettings.unitPriceHeaderSettings,
            color: value
          }
        })
      }
    />
  );
});

const UnitPriceHeaderLabel = memo(function UnitPriceHeaderLabel() {
  const label = useAtomValue(unitPriceHeaderLabelAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

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
          setTableSettings({
            ...tableSettings,
            unitPriceHeaderSettings: {
              ...tableSettings.unitPriceHeaderSettings,
              label: value
            }
          })
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
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceRowSettings: {
            ...tableSettings.unitPriceRowSettings,
            align: value
          }
        })
      }
    />
  );
});

const UnitPriceRowSize = memo(function UnitPriceRowSize() {
  const size = useAtomValue(unitPriceRowSizeAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceRowSettings: {
            ...tableSettings.unitPriceRowSettings,
            size: value
          }
        })
      }
    />
  );
});

const UnitPriceRowWeight = memo(function UnitPriceRowWeight() {
  const weight = useAtomValue(unitPriceRowWeightAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceRowSettings: {
            ...tableSettings.unitPriceRowSettings,
            weight: value
          }
        })
      }
    />
  );
});

const UnitPriceRowColor = memo(function UnitPriceRowColor() {
  const color = useAtomValue(unitPriceRowColorAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceRowSettings: {
            ...tableSettings.unitPriceRowSettings,
            color: value
          }
        })
      }
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
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountHeaderSettings: {
            ...tableSettings.amountHeaderSettings,
            align: value
          }
        })
      }
    />
  );
});

const AmountHeaderSize = memo(function AmountHeaderSize() {
  const size = useAtomValue(amountHeaderSizeAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountHeaderSettings: {
            ...tableSettings.amountHeaderSettings,
            size: value
          }
        })
      }
    />
  );
});

const AmountHeaderWeight = memo(function AmountHeaderWeight() {
  const weight = useAtomValue(amountHeaderWeightAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountHeaderSettings: {
            ...tableSettings.amountHeaderSettings,
            weight: value
          }
        })
      }
    />
  );
});

const AmountHeaderColor = memo(function AmountHeaderColor() {
  const color = useAtomValue(amountHeaderColorAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountHeaderSettings: {
            ...tableSettings.amountHeaderSettings,
            color: value
          }
        })
      }
    />
  );
});

const AmountHeaderLabel = memo(function AmountHeaderLabel() {
  const label = useAtomValue(amountHeaderLabelAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

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
          setTableSettings({
            ...tableSettings,
            amountHeaderSettings: {
              ...tableSettings.amountHeaderSettings,
              label: value
            }
          })
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
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountRowSettings: {
            ...tableSettings.amountRowSettings,
            align: value
          }
        })
      }
    />
  );
});

const AmountRowSize = memo(function AmountRowSize() {
  const size = useAtomValue(amountRowSizeAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountRowSettings: {
            ...tableSettings.amountRowSettings,
            size: value
          }
        })
      }
    />
  );
});

const AmountRowWeight = memo(function AmountRowWeight() {
  const weight = useAtomValue(amountRowWeightAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountRowSettings: {
            ...tableSettings.amountRowSettings,
            weight: value
          }
        })
      }
    />
  );
});

const AmountRowColor = memo(function AmountRowColor() {
  const color = useAtomValue(amountRowColorAtom);
  const [tableSettings, setTableSettings] = useAtom(tableSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountRowSettings: {
            ...tableSettings.amountRowSettings,
            color: value
          }
        })
      }
    />
  );
});
